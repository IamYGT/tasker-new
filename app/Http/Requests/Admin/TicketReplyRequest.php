<?php

namespace App\Http\Requests\Admin;

use App\Models\Ticket;
use Illuminate\Foundation\Http\FormRequest;

class TicketReplyRequest extends FormRequest
{
    public function authorize()
    {
        return $this->user()->hasRole('admin');
    }

    public function rules()
    {
        return [
            'message' => 'required|string|min:1',
            'attachments.*' => 'nullable|file|mimes:jpeg,png,jpg,gif,pdf,doc,docx|max:10240',
            'quote' => 'nullable|string',
            'status' => 'nullable|string|in:' . implode(',', Ticket::STATUSES)
        ];
    }
}
