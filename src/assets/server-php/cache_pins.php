<?php
    
    //Return the JSON
    header('Content-Type: application/geo+json');
    header("Access-Control-Allow-Origin: *");
    $payload = file_get_contents('./cache_pins.json');
    http_response_code(200);
    echo $payload;
    
?>