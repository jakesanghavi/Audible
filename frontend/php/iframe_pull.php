<?php
    header('Content-Type: text/html');
    header('Access-Control-Allow-Origin: https://w.soundcloud.com/');

    $URL = "https://w.soundcloud.com/player/?url=https%3A//api.soundcloud.com/tracks/255766429&color=%23ff5500&auto_play=false&hide_related=true&show_comments=false&show_user=false&show_reposts=false&show_teaser=false&visual=false";

    $domain = file_get_contents($URL);

    echo $domain;
?>