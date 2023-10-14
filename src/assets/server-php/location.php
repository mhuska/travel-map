<?php

    
        require "./utilities.php";
        require  GetBaseURL()."/wp-blog-header.php";

    function GetBaseURL2()
    {
        return GetBaseURL();
    }
    
    /*
    ini_set('display_errors', 1);
    ini_set('display_startup_errors', 1);
    error_reporting(E_ALL);
    */
    
    //Get the ID and return the location
    if (!empty($_GET['id'])) {
        $postid = $_GET["id"];
        header('Content-Type: application/json');
        header("Access-Control-Allow-Origin: *");
        echo GetLocationData($postid);
        http_response_code(200);
    }


    //Function to Create the GeoJSON layer
    function GetLocationData($PostId) {
    
        require   GetBaseURL()."/wp-blog-header.php";
        
       //Get the location-pin type posts.
        $filter  = [ "post_type" => "location-pin" , "p" => $PostId ];
    
        //Perform the query
        $query = new WP_Query( $filter );
        
        //Initialize the JSON
        $json = null;
        

        if ( $query->have_posts() ) {
            while ( $query->have_posts() ) {
                $query->the_post();
                
                $galleryJson = "[".str_replace('\"', '"', ParsePostIdArrayString(GetMeta("photo_gallery")))."]";
                $gallery = json_decode($galleryJson);

                foreach ($gallery as &$photo) {
                    $link = wp_get_attachment_image_src( $photo->id, 'Large', false );
                    $photo->url = $link[0];
                }
            
                $json = '{
                    "Image":"'.GetImage().'",
                    "Content":"'.str_replace('"', '\"', GetMeta("popup_content")).'",
                    "FlyTo":'. (GetMeta("fly_to") ? "1" : "0") .',
                    "Visited":"'.GetMeta("visited").'",
                    "Articles":"['.ParsePostIdArrayString(GetMeta("article")).']",
                    "Gallery":'.json_encode($gallery).'
                }';
            }
        }
        
        /* Restore original Post Data */
        wp_reset_postdata();

        return $json;
            
    }
    
    //A function to get the URL of the Featured Image
    function GetImage() {
        $thumb_id = get_post_thumbnail_id();
        $thumb_url_array = wp_get_attachment_image_src($thumb_id, 'thumbnail-size', true);
        $thumb_url = $thumb_url_array[0];
        return $thumb_url;
    }

    
    function OutputAllLocationJsons() {
        
        
        //Get the location-pin type posts.
        $filter  = [ "post_type" => "location-pin", 'posts_per_page' => 10000 ]; //Let's not be stingy!
    
        //Perform the query
        $query = new WP_Query( $filter );
        
        
        $i = 0;
        if ( $query->have_posts() ) {
            while ( $query->have_posts() ) {
                $query->the_post();

                //Initialize the JSON
                $id = get_the_ID();
                $json = GetLocationData($id);

                //Save to json file
                file_put_contents(
                    GetBaseURL().'/travel-map/assets/locations/'.$id.'.json',
                    $json,
                    $flags = 0,
                    $context = null
                );

         
                $i++; //Increment index
            }
        } else {
            // no posts found
            //echo "no posts";
        }
        
        /* Restore original Post Data */
        wp_reset_postdata();
    
        return $json;
    }

?>

