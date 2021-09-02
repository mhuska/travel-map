<?php


    //Function to Create the GeoJSON layer
    function BuildJsonLayer($layerType) {
    
        require "/home/wtk3vlq0kjjx/public_html/slowcamino.com/wp-blog-header.php";
        
        //Get the location-pin type posts.
        $filter  = [ "post_type" => "location-pin" ];
    
        //Perform the query
        $query = new WP_Query( $filter );
        
        //Initialize the JSON
        $json = '{"type":"FeatureCollection", "features":[';
        
        $i = 0;
        if ( $query->have_posts() ) {
            while ( $query->have_posts() ) {
                $query->the_post();
                
                $locationType = trim(GetMeta("location_type"));

                if ($locationType == $layerType) {
                          
                    //Create the feature point
                    if ($i > 0) {
                        $feature = ",";
                    } else {
                        $feature = "";
                    }
                    $feature = $feature.'{ "type" : "Feature", "geometry": {"type":"Point","coordinates":['.GetMeta("longitude").','.GetMeta("latitude").']},';
                    $feature = $feature.
                    '"properties":{
                        "Title":"'.get_the_title().'",
                        "Image":"'.GetImage().'",
                        "Scale":"'.GetMeta("scale_dependency").'",
                        "Marker":"'.GetMeta("marker_type").'",
                        "ArticleURL":"'.GetMeta("article_url").'",
                        "Content":"'.GetMeta("popup_content").'",
                        "Articles":['.ParsePostIdArrayString(GetMeta("article")).'],
                        "Gallery":['.ParsePostIdArrayString(GetMeta("photo_gallery")).']
                    }}';
                    
                    
                    //concatenate the feature
                    $json = $json.$feature;
              
                }
         

            }
        } else {
            // no posts found
            //echo "no posts";
        }
        
        /* Restore original Post Data */
        wp_reset_postdata();
        
        //Cap off the json
        $json = $json.']}';
    
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
    
    function ParsePostIdArrayString($text) {
        //a:1:{i:0;s:3:"711";}
        //a:2:{i:0;s:3:"733";i:1;s:3:"757";}
        $result = "";
        $parts = explode(':"', $text);
        $count = count($parts);
        for ($i=1; $i<=$count; $i++ ) {
            $part = $parts[$i];
            $id = substr($part, 0, strpos($part, '"'));
            if ($i > 1 && $i<$count) {
                $result = $result.",";
            }
            $result = $result.$id;
        }
        return $result;
    }
?>

