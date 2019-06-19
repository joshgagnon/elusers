<!DOCTYPE html>
<html lang="en">
    <head>
        <!-- These three tags must come first (for bootstrap to work properly) -->
        <meta charset="utf-8">
        <meta http-equiv="X-UA-Compatible" content="IE=edge">
        <meta name="viewport" content="width=device-width, initial-scale=1">

        <link rel="icon" type="image/png" sizes="32x32" href="https://evolutionlawyers.nz/icons-6655226e3c0b7ded0eafcdf071a6166e/favicon-32x32.png">

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
        <meta name="csrf-token" content="{{ csrf_token() }}">



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