<?php

if (!function_exists('translate')) {
    function translate($key)
    {
        return app(\App\Helpers\Helpers::class)->getTranslation($key);
    }
}
