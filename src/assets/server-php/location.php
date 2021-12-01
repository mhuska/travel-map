<?php

    /*
    ini_set('display_errors', 1);
    ini_set('display_startup_errors', 1);
    error_reporting(E_ALL);
    */
    
    //Get the ID
    $postid = $_GET["id"];
    
    //Create the JSON
    header('Content-Type: application/json');
    header("Access-Control-Allow-Origin: *");
    echo GetLocationData($postid);
    http_response_code(200);
    

    //Function to Create the GeoJSON layer
    function GetLocationData($PostId) {
    
        require "/home/wtk3vlq0kjjx/public_html/slowcamino.com/wp-blog-header.php";
        
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

    //A function to extract post data
    function GetMeta($key) {
        $keyt = trim( $key );
        try {
            $val_arr = get_post_custom_values( $key );
            if ($val_arr!=null) {
                $values = array_map( 'trim', get_post_custom_values( $key ) );
                $value  = implode( ', ', $values ); 
            }

        } catch (exception $e) {
            //Do nothing
            return "";
        }

        if ($value == null) {
            $value = "";
        }
        return $value;
    }
    
    //Parse the IDs from WordPress and get the article / media info
    function ParsePostIdArrayString($text) {
        //a:1:{i:0;s:3:"711";}
        //a:2:{i:0;s:3:"733";i:1;s:3:"757";}
        
        //Split the output blob
        $result = "";
        $parts = explode(':"', $text);
        $count = count($parts);
        
        //Loop through the parts (skip the first)
        for ($i=1; $i<=$count; $i++ ) {
            
            //Get the PostID
            $part = $parts[$i];
            $id = substr($part, 0, strpos($part, '"'));
            
            if (is_numeric($id)) {
                
                $post_id = (int)$id;
                
                //Get the Post Info
                $the_post = get_post( $post_id ); 
                $title = $the_post->post_title;
                $date = $the_post->post_date;
                $url = get_permalink($the_post);
                $excerpt = $the_post->post_excerpt;
    
                //add the comma between items
                if ($i > 1) {
                    $result = $result.",";
                }
    
                //Append the post info JSON object
                $objectString = str_replace('"', '\"', '{"id":'.$id.',"title":"'.$title.'","created":"'.$date.'","url":"'.$url.'","excerpt":"'.$excerpt.'"}');
                $result = $result.$objectString;     
            }

        }
        return $result;
    }
?>

