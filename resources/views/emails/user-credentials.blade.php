@component('mail::message')
# Kullanıcı Bilgileriniz

Merhaba {{ $user->name }},

Kullanıcı bilgileriniz aşağıdaki gibidir:

**Kullanıcı Adı:** {{ $user->name }}
**E-posta:** {{ $user->email }}
**Yeni Şifreniz:** {{ $password }}

Lütfen ilk girişinizde şifrenizi değiştirmeyi unutmayın.

Saygılarımızla,<br>
{{ config('app.name') }}
@endcomponent
