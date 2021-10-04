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
                        "Scale":"'.GetMeta("scale_dependency").'",
                        "Marker":"'.GetMeta("marker_type").'",
                        "Date":"'.get_the_date().'",
                        "PostId":'.get_the_ID().'
                    }}';
                    
                    //concatenate the feature
                    $json = $json.$feature;
              
                }
         
                $i++; //Increment index
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
    
?>

