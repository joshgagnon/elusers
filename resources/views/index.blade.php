<!DOCTYPE html>
<html lang="en">
    <head>
        <!-- These three tags must come first (for bootstrap to work properly) -->
        <meta charset="utf-8">
        <meta http-equiv="X-UA-Compatible" content="IE=edge">
        <meta name="viewport" content="width=device-width, initial-scale=1">

        <link rel="apple-touch-icon" sizes="57x57" href="https://evolutionlawyers.nz/images/favicons/apple-touch-icon-57x57-517fec1f58.png">
        <link rel="apple-touch-icon" sizes="60x60" href="https://evolutionlawyers.nz/images/favicons/apple-touch-icon-60x60-7429c00601.png">
        <link rel="apple-touch-icon" sizes="72x72" href="https://evolutionlawyers.nz/images/favicons/apple-touch-icon-72x72-c958b0a3d5.png">
        <link rel="apple-touch-icon" sizes="76x76" href="https://evolutionlawyers.nz/images/favicons/apple-touch-icon-76x76-f44134f2a8.png">
        <link rel="icon" type="image/png" href="https://evolutionlawyers.nz/images/favicons/favicon-32x32-bbd5d053e4.png" sizes="32x32">
        <link rel="icon" type="image/png" href="https://evolutionlawyers.nz/images/favicons/favicon-96x96-540cd9674c.png" sizes="96x96">
        <link rel="icon" type="image/png" href="https://evolutionlawyers.nz/images/favicons/favicon-16x16-b2ff926b0a.png" sizes="16x16">
        <link rel="manifest" href="https://evolutionlawyers.nz/images/favicons/manifest.json">
        <link rel="mask-icon" href="https://evolutionlawyers.nz/images/favicons/safari-pinned-tab-f5f84a304e.svg" color="#5bbad5">


        <meta name="apple-mobile-web-app-title" content="Evolution Lawyers">
        <meta name="application-name" content="Evolution Lawyers">
        <meta name="msapplication-TileColor" content="#da532c">
        <meta name="theme-color" content="#ffffff">


        <!-- Title -->
        <title>Evolution Lawyers</title>

        <!-- CSS -->
        <link href="/{{ mix('main.css') }}" rel="stylesheet">

        <!-- Fonts -->
        <link href="https://fonts.googleapis.com/css?family=Open+Sans:300,400,400i,700" rel="stylesheet">
       <link rel="stylesheet" href="https://use.fontawesome.com/releases/v5.2.0/css/all.css" integrity="sha384-hWVjflwFxL6sNzntih27bfxkr27PmbbK/iSvJ+a4+0owXq79v+lsFkW54bOGbiDQ" crossorigin="anonymous">



        <!-- HTML5 shim and Respond.js for IE8 support of HTML5 elements and media queries -->
        <!-- WARNING: Respond.js doesn't work if you view the page via file:// -->
        <!--[if lt IE 9]>
        <script src="https://oss.maxcdn.com/html5shiv/3.7.3/html5shiv.min.js"></script>
        <script src="https://oss.maxcdn.com/respond/1.4.2/respond.min.js"></script>
        <![endif]-->

        <script type="application/json" id="load-data">{!! $loadData !!}</script>
        <script type="application/json" id="version">{ "ASSET_HASH": "{{mix('main.js')}}"}</script>
    </head>
    <body>
        <div id="main"></div>

        <script type="text/javascript" src="/{{ mix('main.js') }}"></script>
    </body>
</html>