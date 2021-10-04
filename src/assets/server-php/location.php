<?php

    //Get the ID
    $postid = $_GET["id"];
    
    //Create the JSON
    header('Content-Type: application/geo+json');
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
                
                $json = '{
                        "Image":"'.GetImage().'",
                        "Content":"'.GetMeta("popup_content").'",
                        "Articles":"['.ParsePostIdArrayString(GetMeta("article")).']",
                        "Gallery":"['.ParsePostIdArrayString(GetMeta("photo_gallery")).']"
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
        $values = array_map( 'trim', get_post_custom_values( $key ) );
        $value  = implode( ', ', $values );
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

