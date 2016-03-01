<?php 

$v = @$_GET['v']!="" ? $_GET['v'] : 'master';
$url = 'https://raw.githubusercontent.com/bodymovin/bodymovin/'.$v.'/build/player/bodymovin.js';
header('Content-Type: application/javascript');
readfile($url);

?>