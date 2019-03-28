<?php
namespace App\Library;

class StringToStream {
    static public function create($content) {
        if (substr($content, -1) != "\n") {
            $content = $content.PHP_EOL;
        }

        $size = 50 * 1024 * 1024;
        $fp = fopen("php://temp/maxmemory:$size", 'r+');
        fputs($fp, $content);
        rewind($fp);
        return $fp;
    }
}