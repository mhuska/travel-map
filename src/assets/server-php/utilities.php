<?php

    function GetBaseURL() {
        $var = "/var/www/html/slowcamino.com";
        return $var;
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
             $title = str_replace('"', "'", $the_post->post_title);
             $date = $the_post->post_date;
             $url = get_permalink($the_post);
             $excerpt = str_replace('"', "'", $the_post->post_excerpt);
 
 
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