<?php

namespace App\Library;

class EncryptionKey
{
    public static function create()
    {
        return base64_encode(openssl_random_pseudo_bytes(32));
    }
}