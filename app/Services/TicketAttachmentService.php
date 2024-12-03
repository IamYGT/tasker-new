<?php

namespace App\Services;

use App\Models\TicketMessage;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;

class TicketAttachmentService
{
    public function uploadAttachments(array $files, TicketMessage $message): void
    {
        $uploadPath = $this->createUploadPath();

        foreach ($files as $file) {
            try {
                $this->uploadSingleFile($file, $uploadPath, $message);
            } catch (\Exception $e) {
                Log::error('Dosya yükleme hatası:', [
                    'error' => $e->getMessage(),
                    'file' => $file->getClientOriginalName(),
                    'message_id' => $message->id
                ]);
            }
        }
    }

    private function createUploadPath(): string
    {
        $year = date('Y');
        $month = date('m');
        $day = date('d');
        
        $path = "ticket-attachments/{$year}/{$month}/{$day}";
        
        $this->ensureDirectoryExists('ticket-attachments');
        $this->ensureDirectoryExists("ticket-attachments/{$year}");
        $this->ensureDirectoryExists("ticket-attachments/{$year}/{$month}");
        $this->ensureDirectoryExists($path);
        
        return $path;
    }

    private function ensureDirectoryExists(string $path): void
    {
        if (!Storage::disk('public')->exists($path)) {
            Storage::disk('public')->makeDirectory($path, 0775);
        }
    }

    private function uploadSingleFile(UploadedFile $file, string $uploadPath, TicketMessage $message): void
    {
        $fileName = uniqid() . '_' . Str::slug(pathinfo($file->getClientOriginalName(), PATHINFO_FILENAME)) 
                 . '.' . $file->getClientOriginalExtension();
        
        $fullPath = $uploadPath . '/' . $fileName;

        $uploaded = Storage::disk('public')->putFileAs(
            $uploadPath,
            $file,
            $fileName,
            ['visibility' => 'public']
        );

        if (!$uploaded) {
            throw new \Exception('Dosya yüklenemedi');
        }

        $attachment = $message->attachments()->create([
            'name' => $file->getClientOriginalName(),
            'path' => $fullPath,
            'type' => $file->getMimeType(),
            'size' => $file->getSize(),
            'ticket_message_id' => $message->id
        ]);

        if (!Storage::disk('public')->exists($fullPath)) {
            throw new \Exception('Dosya kaydedildi fakat erişilemiyor');
        }
    }
}
