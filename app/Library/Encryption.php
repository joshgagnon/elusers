<?php

namespace App\Library;

class Encryption
{
    private $key;
    private $cipher;

    /**
     * Encryption constructor.
     *
     * @param string $key
     */
    function __construct(string $key)
    {
        $this->key = $key;
        $this->cipher = config('app.cipher');
    }

    /**
     * Encrypt plain text.
     *
     * @param string $plainText
     * @return string
     */
    public function encrypt(string $plainText)
    {
        $ivLength = openssl_cipher_iv_length($this->cipher);
        $iv = openssl_random_pseudo_bytes($ivLength);
        $rawCiphertext = openssl_encrypt($plainText, $this->cipher, $this->key, $options=OPENSSL_RAW_DATA, $iv);
        $hmac = hash_hmac('sha256', $rawCiphertext, $this->key, $as_binary=true);
        $ciphertext = base64_encode($iv . $hmac . $rawCiphertext);

        return $ciphertext;
    }

    /**
     * Decrypt ciphertext.
     *
     * @param string $ciphertext
     * @return string
     * @throws \Exception
     */
    public function decrypt(string $ciphertext)
    {
        $c = base64_decode($ciphertext);
        $ivLength = openssl_cipher_iv_length($this->cipher);
        $iv = substr($c, 0, $ivLength);
        $hmac = substr($c, $ivLength, $sha2len=32);
        $ciphertext_raw = substr($c, $ivLength + $sha2len);
        $original_plaintext = openssl_decrypt($ciphertext_raw, $this->cipher, $this->key, $options=OPENSSL_RAW_DATA, $iv);
        $calcmac = hash_hmac('sha256', $ciphertext_raw, $this->key, $as_binary=true);

        //PHP 5.6+ timing attack safe comparison
        if (!hash_equals($hmac, $calcmac)) {
            throw new \Exception('Hmac and calcmac do not match');
        }

        return $original_plaintext;
    }
}