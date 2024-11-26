<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Ticket;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;

class AdminTicketController extends Controller
{
    public function index(Request $request)
    {
        $query = Ticket::with('user')
            ->when($request->search, function ($query, $search) {
                $query->where(function ($query) use ($search) {
                    $query->whereRaw('LOWER(subject) LIKE ?', ['%' . strtolower($search) . '%'])
                        ->orWhereHas('user', function ($query) use ($search) {
                            $query->whereRaw('LOWER(name) LIKE ?', ['%' . strtolower($search) . '%'])
                                ->orWhereRaw('LOWER(email) LIKE ?', ['%' . strtolower($search) . '%']);
                        });
                });
            })
            ->when($request->filled('status'), function ($query) use ($request) {
                $query->where('status', $request->status);
            })
            ->when($request->filled('priority'), function ($query) use ($request) {
                $query->where('priority', $request->priority);
            })
            ->when($request->filled('category'), function ($query) use ($request) {
                $query->where('category', $request->category);
            })
            ->latest('last_reply_at');

        $stats = [
            'total' => Ticket::count(),
            'open' => Ticket::where('status', 'open')->count(),
            'answered' => Ticket::where('status', 'answered')->count(),
            'high_priority' => Ticket::where('priority', 'high')->count(),
        ];

        $tickets = $query->paginate(10)
            ->appends($request->query());

        return Inertia::render('Admin/Tickets/Index', [
            'tickets' => $tickets,
            'filters' => $request->only(['search', 'status', 'priority', 'category']),
            'statuses' => Ticket::STATUSES,
            'priorities' => Ticket::PRIORITIES,
            'categories' => Ticket::CATEGORIES,
            'stats' => $stats,
        ]);
    }

    public function show(Ticket $ticket)
    {
        return Inertia::render('Admin/Tickets/Show', [
            'ticket' => $ticket->load(['user', 'replies.user']),
            'statuses' => Ticket::STATUSES,
            'priorities' => Ticket::PRIORITIES,
            'categories' => Ticket::CATEGORIES,
        ]);
    }

    public function reply(Request $request, Ticket $ticket)
    {
        $validated = $request->validate([
            'message' => 'required|string|min:1',
            'attachments.*' => 'nullable|file|mimes:jpeg,png,jpg,gif,pdf,doc,docx|max:10240',
            'quote' => 'nullable|string',
            'status' => 'nullable|string|in:' . implode(',', Ticket::STATUSES)
        ]);

        DB::beginTransaction();
        
        try {
            // Yanıtı oluştur
            $reply = $ticket->replies()->create([
                'user_id' => auth()->id(),
                'message' => $validated['message'],
                'quote' => $validated['quote'] ?? null,
                'is_admin' => auth()->user()->hasRole('admin')
            ]);

            // Dosyaları işle
            if ($request->hasFile('attachments')) {
                $year = date('Y');
                $month = date('m');
                $day = date('d');
                
                $uploadPath = "ticket-attachments/{$year}/{$month}/{$day}";
                
                // Ana dizini oluştur
                if (!Storage::disk('public')->exists('ticket-attachments')) {
                    Storage::disk('public')->makeDirectory('ticket-attachments', 0775);
                }
                
                // Yıl dizinini oluştur
                if (!Storage::disk('public')->exists("ticket-attachments/{$year}")) {
                    Storage::disk('public')->makeDirectory("ticket-attachments/{$year}", 0775);
                }
                
                // Ay dizinini oluştur
                if (!Storage::disk('public')->exists("ticket-attachments/{$year}/{$month}")) {
                    Storage::disk('public')->makeDirectory("ticket-attachments/{$year}/{$month}", 0775);
                }
                
                // Gün dizinini oluştur
                if (!Storage::disk('public')->exists($uploadPath)) {
                    Storage::disk('public')->makeDirectory($uploadPath, 0775);
                }

                foreach ($request->file('attachments') as $file) {
                    try {
                        // Benzersiz dosya adı oluştur
                        $fileName = uniqid() . '_' . Str::slug(pathinfo($file->getClientOriginalName(), PATHINFO_FILENAME)) 
                                 . '.' . $file->getClientOriginalExtension();
                        
                        $fullPath = $uploadPath . '/' . $fileName;

                        // Dosyayı yükle
                        $uploaded = Storage::disk('public')->putFileAs(
                            $uploadPath,
                            $file,
                            $fileName,
                            ['visibility' => 'public']
                        );

                        if (!$uploaded) {
                            throw new \Exception('Dosya yüklenemedi');
                        }

                        // Veritabanına kaydet
                        $attachment = $reply->attachments()->create([
                            'name' => $file->getClientOriginalName(),
                            'path' => $fullPath,
                            'type' => $file->getMimeType(),
                            'size' => $file->getSize(),
                            'ticket_message_id' => $reply->id
                        ]);

                        // Path'i kontrol et
                        if (!Storage::disk('public')->exists($fullPath)) {
                            throw new \Exception('Dosya kaydedildi fakat erişilemiyor');
                        }

                    } catch (\Exception $e) {
                        Log::error('Dosya yükleme hatası:', [
                            'error' => $e->getMessage(),
                            'file' => $file->getClientOriginalName(),
                            'path' => $fullPath ?? null,
                            'storage_path' => storage_path('app/public/' . ($fullPath ?? '')),
                            'permissions' => decoct(fileperms(storage_path('app/public')) & 0777)
                        ]);
                        continue;
                    }
                }
            }

            // Ticket durumunu güncelle
            if ($ticket->status === 'open') {
                $ticket->updateStatus('answered');
            } elseif ($validated['status'] ?? null) {
                $ticket->updateStatus($validated['status']);
            }

            $ticket->addToHistory('ticket.replied');

            DB::commit();
            return back()->with('success', 'ticket.replySent');

        } catch (\Exception $e) {
            DB::rollBack();
            Log::error('Ticket yanıt hatası:', [
                'error' => $e->getMessage(),
                'ticket_id' => $ticket->id
            ]);
            
            return back()->with('error', 'ticket.replyError');
        }
    }

    public function updateStatus(Request $request, Ticket $ticket)
    {
        $validated = $request->validate([
            'status' => 'required|in:' . implode(',', Ticket::STATUSES)
        ]);

        $oldStatus = $ticket->status;
        $ticket->update([
            'status' => $validated['status'],
            'last_reply_at' => now(),
        ]);

        $ticket->addToHistory('ticket.statusChanged', 'info', [
            'old' => $oldStatus,
            'new' => $validated['status']
        ]);

        return back()->with('success', 'ticket.statusUpdated');
    }
} 