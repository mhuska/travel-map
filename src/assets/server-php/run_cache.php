<?php
    /*
    ini_set('display_errors', 1);
    ini_set('display_startup_errors', 1);
    error_reporting(E_ALL);
    */
    
    require "./location.php";

    //Get the pins
    $pins = file_get_contents('https://slowcamino.com/travel-map/assets/server-php/pins.php');
    
    //Save pins to json file
    $pinsFile = GetBaseURL2()."/travel-map/assets/layers/cache_pins.json";
    file_put_contents(
                $pinsFile,
                $pins,
                $flags = 0,
                $context = null
            );
    
    //Get the connections
    $connections = file_get_contents('https://slowcamino.com/travel-map/assets/server-php/connections.php');
    
    
    //Save connections to json file
    $connectionsFile = GetBaseURL2()."/travel-map/assets/layers/cache_connections.json";
    file_put_contents(
                $connectionsFile,
                $connections,
                $flags = 0,
                $context = null
            );

    //Cache each location in the pins
    OutputAllLocationJsons();

    echo "Finished updating cache."
?>