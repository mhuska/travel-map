<?php
    
    //http://slowcamino.com/travel-map/assets/server-php/connections.php
    require "./layer.php";

/*
    ini_set('display_errors', 1);
    ini_set('display_startup_errors', 1);
    error_reporting(E_ALL);
 */
  
    //Create the JSON
    header('Content-Type: application/geo+json');
    header("Access-Control-Allow-Origin: *");
    $payload = BuildJsonConnectionsLayer();
    http_response_code(200);
    echo $payload;
    
?>