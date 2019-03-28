<?php
namespace App\Library;

class Encoding {
    static public function convert_cp1252_to_ascii($input, $default = '') {
        if ($input === null || $input == '') {
            return $default;
        }

        // https://en.wikipedia.org/wiki/UTF-8
        // https://en.wikipedia.org/wiki/ISO/IEC_8859-1
        // https://en.wikipedia.org/wiki/Windows-1252
        // http://www.unicode.org/Public/MAPPINGS/VENDORS/MICSFT/WINDOWS/CP1252.TXT
        $encoding = mb_detect_encoding($input, array('Windows-1252', 'ISO-8859-1'), true);
        if ($encoding == 'ISO-8859-1' || $encoding == 'Windows-1252') {
            /*
             * Use the search/replace arrays if a character needs to be replaced with
             * something other than its Unicode equivalent.
             */

            $replace = array(
                128 => "E",     // http://www.fileformat.info/info/unicode/char/20AC/index.htm EURO SIGN
                129 => "",              // UNDEFINED
                130 => ",",     // http://www.fileformat.info/info/unicode/char/201A/index.htm SINGLE LOW-9 QUOTATION MARK
                131 => "f",     // http://www.fileformat.info/info/unicode/char/0192/index.htm LATIN SMALL LETTER F WITH HOOK
                132 => ",,",        // http://www.fileformat.info/info/unicode/char/201e/index.htm DOUBLE LOW-9 QUOTATION MARK
                133 => "...",       // http://www.fileformat.info/info/unicode/char/2026/index.htm HORIZONTAL ELLIPSIS
                134 => "t",     // http://www.fileformat.info/info/unicode/char/2020/index.htm DAGGER
                135 => "T",     // http://www.fileformat.info/info/unicode/char/2021/index.htm DOUBLE DAGGER
                136 => "^",     // http://www.fileformat.info/info/unicode/char/02c6/index.htm MODIFIER LETTER CIRCUMFLEX ACCENT
                137 => "%",     // http://www.fileformat.info/info/unicode/char/2030/index.htm PER MILLE SIGN
                138 => "S",     // http://www.fileformat.info/info/unicode/char/0160/index.htm LATIN CAPITAL LETTER S WITH CARON
                139 => "<",     // http://www.fileformat.info/info/unicode/char/2039/index.htm SINGLE LEFT-POINTING ANGLE QUOTATION MARK
                140 => "OE",        // http://www.fileformat.info/info/unicode/char/0152/index.htm LATIN CAPITAL LIGATURE OE
                141 => "",              // UNDEFINED
                142 => "Z",     // http://www.fileformat.info/info/unicode/char/017d/index.htm LATIN CAPITAL LETTER Z WITH CARON
                143 => "",              // UNDEFINED
                144 => "",              // UNDEFINED
                145 => "'",     // http://www.fileformat.info/info/unicode/char/2018/index.htm LEFT SINGLE QUOTATION MARK
                146 => "'",     // http://www.fileformat.info/info/unicode/char/2019/index.htm RIGHT SINGLE QUOTATION MARK
                147 => "\"",        // http://www.fileformat.info/info/unicode/char/201c/index.htm LEFT DOUBLE QUOTATION MARK
                148 => "\"",        // http://www.fileformat.info/info/unicode/char/201d/index.htm RIGHT DOUBLE QUOTATION MARK
                149 => "*",     // http://www.fileformat.info/info/unicode/char/2022/index.htm BULLET
                150 => "-",     // http://www.fileformat.info/info/unicode/char/2013/index.htm EN DASH
                151 => "--",        // http://www.fileformat.info/info/unicode/char/2014/index.htm EM DASH
                152 => "~",     // http://www.fileformat.info/info/unicode/char/02DC/index.htm SMALL TILDE
                153 => "TM",        // http://www.fileformat.info/info/unicode/char/2122/index.htm TRADE MARK SIGN
                154 => "s",     // http://www.fileformat.info/info/unicode/char/0161/index.htm LATIN SMALL LETTER S WITH CARON
                155 => ">",     // http://www.fileformat.info/info/unicode/char/203A/index.htm SINGLE RIGHT-POINTING ANGLE QUOTATION MARK
                156 => "oe",        // http://www.fileformat.info/info/unicode/char/0153/index.htm LATIN SMALL LIGATURE OE
                157 => "",              // UNDEFINED
                158 => "z",     // http://www.fileformat.info/info/unicode/char/017E/index.htm LATIN SMALL LETTER Z WITH CARON
                159 => "Y",     // http://www.fileformat.info/info/unicode/char/0178/index.htm LATIN CAPITAL LETTER Y WITH DIAERESIS
            );

            $find = array();
            foreach (array_keys($replace) as $key) {
                $find[] = chr($key);
            }

            $input = str_replace($find, array_values($replace), $input);
            /*
             * Because ISO-8859-1 and CP1252 are identical except for 0x80 through 0x9F
             * and control characters, always convert from Windows-1252 to UTF-8.
             */
            $input = iconv('Windows-1252', 'UTF-8//IGNORE', $input);
        }
        return $input;
    }

public static function convert_from_latin1_to_utf8_recursively($dat)
   {
      if (is_string($dat)) {
         return utf8_encode($dat);
      } elseif (is_array($dat)) {
         $ret = [];
         foreach ($dat as $i => $d) $ret[ $i ] = self::convert_from_latin1_to_utf8_recursively($d);

         return $ret;
      } elseif (is_object($dat)) {
         foreach ($dat as $i => $d) $dat->$i = self::convert_from_latin1_to_utf8_recursively($d);

         return $dat;
      } else {
         return $dat;
      }
   }
    
}