<?php
    /*
    ini_set('display_errors', 1);
    ini_set('display_startup_errors', 1);
    error_reporting(E_ALL);
    */

    //Get the pins
    $pins = file_get_contents('https://slowcamino.com/travel-map/assets/server-php/pins.php');
    
    //Save pins to json file
    file_put_contents(
                '/home/wtk3vlq0kjjx/public_html/slowcamino.com/travel-map/assets/server-php/cache_pins.json',
                $pins,
                $flags = 0,
                $context = null
            );
    
    //Get the connections
    $connections = file_get_contents('https://slowcamino.com/travel-map/assets/server-php/connections.php');
    
    
    //Save connections to json file
    file_put_contents(
                '/home/wtk3vlq0kjjx/public_html/slowcamino.com/travel-map/assets/server-php/cache_connections.json',
                $connections,
                $flags = 0,
                $context = null
            );
    
    echo "Finished updating cache."
?>