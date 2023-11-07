<?php


    require "./utilities.php";
    require GetBaseURL()."/wp-blog-header.php";
    
    function GetBaseURL2()
    {
        return GetBaseURL();
    }

    //Function to Create the GeoJSON layer
    function BuildJsonLayer($layerType) {
    
        
        //Get the location-pin type posts.
        $filter  = [ "post_type" => "location-pin", 'posts_per_page' => 10000 ]; //Let's not be stingy!
    
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
                        "GapYearDay":'.date_diff(date_create("2022-07-01"), date_create(get_the_date()))->format("%a").',
                        "DaysSince":'.date_diff(date_create(get_the_date()), new DateTime())->format("%a").',
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
    
    function BuildJsonConnectionsLayer() {
        
        
        //Get the location-pin type posts.
        $filter  = [ "post_type" => "location-pin", 'posts_per_page' => 10000 ]; //Let's not be stingy!
    
        //Perform the query
        $query = new WP_Query( $filter );
        
        //Initialize the JSON
        $json = '{"type":"FeatureCollection", "features":[';
        
        //Create an array of posts
        $posts = array();
      
        if ( $query->have_posts() ) {
            while ( $query->have_posts() ) {
                    $query->the_post();
                    
                    //echo get_the_title() . " => " . GetMeta("last_location");
                 
                    $posts[get_the_ID()] = [
                                                "longitude" => GetMeta("longitude"),
                                                "latitude" => GetMeta("latitude"),
                                                "GapYearDay" => date_diff(date_create("2022-07-01"), date_create(get_the_date()))->format("%a"),
                                                "DaysSince" => date_diff(date_create(get_the_date()), new DateTime())->format("%a"),
                                                "last_location_id" => trim(GetMeta("last_location")),
                                                "travel_mode" => trim(GetMeta("travel_mode"))
                                            ];
                       
            }
                
            //print_r($posts);
                
            $i = 0;
            foreach ($posts as $key => $value) {
                    
                    $lastLocation = $value["last_location_id"];
                    
                    if ($lastLocation!=null) {
                        
                        $last = $posts[$lastLocation];
                              
                        //Create the feature point
                        if ($i > 0) {
                            $feature = ",";
                        } else {
                            $feature = "";
                        }
                        
                        $feature = $feature.'{ "type" : "Feature", "geometry": {"type":"LineString","coordinates":[['.$last["longitude"].','.$last["latitude"].'],['.$value["longitude"].','.$value["latitude"].']]},';
                        $feature = $feature.'"properties":{ "GapYearDay": '.$last["DaysSince"].', "DaysSince": '.$last["DaysSince"].', "TravelMode": "' . $value["travel_mode"] . '" }}';
                        
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

        


    
?>

