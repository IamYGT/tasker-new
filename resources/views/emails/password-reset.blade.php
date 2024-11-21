<x-mail::message>
# {{ translate('users.hello') }} {{ $user->name }},

{{ translate('users.passwordResetByAdmin') }}

{{ translate('users.passwordResetWarning') }}

{{ translate('users.regards') }},<br>
{{ config('app.name') }}
</x-mail::message> 