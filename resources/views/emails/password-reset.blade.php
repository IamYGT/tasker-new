@component('mail::message')
# Şifreniz Sıfırlandı

Yeni şifreniz: **{{ $newPassword }}**

Güvenliğiniz için lütfen giriş yaptıktan sonra şifrenizi değiştirin.

@component('mail::button', ['url' => route('login')])
Giriş Yap
@endcomponent

Teşekkürler,<br>
{{ config('app.name') }}
@endcomponent 