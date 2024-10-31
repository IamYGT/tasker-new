import defaultTheme from 'tailwindcss/defaultTheme';
import forms from '@tailwindcss/forms';

/** @type {import('tailwindcss').Config} */
export default {
    darkMode: 'class', // Karanlık mod sınıf tabanlı olarak ayarlandı
    content: [
        // Laravel ve uygulama dosyaları için içerik yolları
        './vendor/laravel/framework/src/Illuminate/Pagination/resources/views/*.blade.php',
        './storage/framework/views/*.php',
        './resources/views/**/*.blade.php',
        './resources/js/**/*.tsx',
    ],

    theme: {
        extend: {
            // Mevcut temayı genişletme
            fontWeight: {
                'extrabold': '800', // Ekstra kalın font ağırlığı tanımı
            },
            fontFamily: {
                sans: ['Figtree', ...defaultTheme.fontFamily.sans], // Varsayılan sans-serif font ailesini Figtree ile genişletme
            },
            colors: {
                // Aydınlık Tema Renkleri (Revize edilmiş)
                light: {
                    background: '#F0F4F8', // Daha yumuşak bir mavi-gri arka plan
                    surface: '#FFFFFF',    // Beyaz yüzey rengi
                    primary: '#3B82F6',    // Daha kapalı bir mavi (Blue-500)
                    secondary: '#64748B',  // Daha koyu bir gri (Slate-500)
                    text: '#1E293B',       // Daha koyu bir metin rengi (Slate-800)
                    'text-secondary': '#475569', // İkincil metin rengi (Slate-600)
                    accent: '#38BDF8',     // Turuncu vurgu rengi (Amber-500)
                },
                // Karanlık Tema Renkleri
                dark: {
                    background: '#0F172A', // Koyu arka plan rengi (Slate-900)
                    surface: '#1E293B',    // Yüzey rengi (Slate-800)
                    primary: '#60A5FA',    // Ana renk, daha açık bir mavi (Blue-400)
                    secondary: '#475569',  // İkincil renk (Slate-600)
                    text: '#E2E8F0',       // Ana metin rengi (Slate-200)
                    'text-secondary': '#94A3B8', // İkincil metin rengi (Slate-400)
                    accent: '#38BDF8',     // Vurgu rengi (Sky-400)
                },
            },
        },
    },

    plugins: [forms], // Tailwind CSS Forms eklentisini kullan
};