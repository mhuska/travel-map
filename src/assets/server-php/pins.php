<?php
    
    //http://slowcamino.com/custom/pins.php
    require "./layer.php";

/*
    ini_set('display_errors', 1);
    ini_set('display_startup_errors', 1);
    error_reporting(E_ALL);
  */  
    //Create the JSON
    header('Content-Type: application/geo+json');
    header("Access-Control-Allow-Origin: *");
    echo BuildJsonLayer("Pin");
    http_response_code(200);
    
?>