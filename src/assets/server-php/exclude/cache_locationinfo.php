<?php
    
       /*
    ini_set('display_errors', 1);
    ini_set('display_startup_errors', 1);
    error_reporting(E_ALL);
    */
    
    //Get the ID
    $postid = $_GET["id"];

    //Return the JSON
    header('Content-Type: application/geo+json');
    header("Access-Control-Allow-Origin: *");
    $payload = file_get_contents('../locations/'.$postid.'.json');
    http_response_code(200);
    echo $payload;
    
?>