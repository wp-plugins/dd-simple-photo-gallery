<?php
/*
Plugin Name: DD Simple Photo Gallery
Plugin URI: http://www.dropndot.com/blog/wordpress/dd-simple-photo-gallery-wordpress-plugin/
Description: DD Simple Photo Gallery is a free, simple, fast and light weight wordpress  plugin to create photo gallery for your wordpress enabled website.
Version: 1.2
Author: Jewel Ahmed
Author URI: http://www.phpfarmer.com
License: GPL2

Copyright 2011 Jewel Ahmed (email : jewel@dropndot.com)

This program is free software; you can redistribute it and/or modify
it under the terms of the GNU General Public License, version 2, as
published by the Free Software Foundation.

This program is distributed in the hope that it will be useful,
but WITHOUT ANY WARRANTY; without even the implied warranty of
MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
GNU General Public License for more details.

You should have received a copy of the GNU General Public License
along with this program; if not, write to the Free Software
Foundation, Inc., 51 Franklin St, Fifth Floor, Boston, MA  02110-1301  USA
*/

include_once('dd_spg_libs.php');


if ( is_admin() ) {
    //If admin user interface/screen
    include_once('admin/dd_spg_admin_settings.php');
} else {
    //If front-end user interface/screen
    
    /* Short code to load DD Simple Photo Gallery plugin.  Detects the word
     * [DDSPG_Gallery] in posts or pages and loads the gallery.
     */
    add_shortcode('DDSPG_Gallery', 'dd_spg_display_gallery'); 
    
    /*
    *
    * Loading plugins required javascript files here for front end
    * */
    add_action('wp_print_scripts', 'enqueue_dd_spg_scripts');
    
    /*
    *
    * Locading plugins required css files here for front-end
    * */
    add_action('wp_print_styles', 'enqueue_dd_spg_styles');
}


        
//Loading dd simple photo gallery required javascript files
function enqueue_dd_spg_scripts() {
    wp_enqueue_script('jquery');
    wp_enqueue_script('enqueue_dd_spg_script1', DD_SFG_BASE_URL . "/js/jquery-1.7.min.js");
    wp_enqueue_script('enqueue_dd_spg_script2', DD_SFG_BASE_URL . "/js/jquery.effects.core.js");
    wp_enqueue_script('enqueue_dd_spg_script3', DD_SFG_BASE_URL . "/js/jquery.ssslider.v1.2.min.js");
}

//Loading dd simple photo gallery required css files
function enqueue_dd_spg_styles() {
    wp_enqueue_style('enqueue_dd_spg_styles', DD_SFG_BASE_URL . "/css/style.css", 100);
}

//Creating dd simple photo gallery front-end html out for post, page or category.
function dd_spg_display_gallery($atts) {
    
    global $wpdb;
    $table_photo = $wpdb->prefix . "dd_spg_photos";
    $table_gallery = $wpdb->prefix . "dd_spg_galleries";
    
    $return_options_data=dd_spg_get_all_options();
    $option_data = (object) $return_options_data;
    $dd_spg_is_display_title_and_des = strtolower($option_data->dd_spg_is_display_title_and_des);
    $dd_spg_slide_speed = strtolower($option_data->dd_spg_slide_speed);
    
    $dd_spg_effect = strtolower($option_data->dd_spg_effect);
    $dd_spg_slices = strtolower($option_data->dd_spg_slices);
    $dd_spg_boxcols = strtolower($option_data->dd_spg_boxcols);
    $dd_spg_boxrows = strtolower($option_data->dd_spg_boxrows);
    $dd_spg_pausetime = strtolower($option_data->dd_spg_pausetime);
    $dd_spg_largenavarrow = strtolower($option_data->dd_spg_largenavarrow);
    $dd_spg_largenavarrowdefaulthidden = strtolower($option_data->dd_spg_largenavarrowdefaulthidden);
    $dd_spg_pauseonhover = strtolower($option_data->dd_spg_pauseonhover);
    $dd_spg_manualadvance = strtolower($option_data->dd_spg_manualadvance);
    $dd_spg_prevtext = strtolower($option_data->dd_spg_prevtext);
    $dd_spg_nexttext = strtolower($option_data->dd_spg_nexttext);
    $dd_spg_keyboardnav = strtolower($option_data->dd_spg_keyboardnav);
    $dd_spg_displaygallerycaption = strtolower($option_data->dd_spg_displaygallerycaption);
    $dd_spg_controlnav = strtolower($option_data->dd_spg_controlnav);
    $dd_spg_controlnavthumbs = strtolower($option_data->dd_spg_controlnavthumbs);
    $dd_spg_captionopacity = strtolower($option_data->dd_spg_captionopacity);
	
	//Initializing thumbnail width height
    $img_thumb_size = explode('x', strtolower(trim($option_data->dd_spg_thumb_size)));  //width x height
    $thumb_width = ($img_thumb_size[0])?$img_thumb_size[0]:80;    //Calculating thumbnail width
    $thumb_height = ($img_thumb_size[1])?$img_thumb_size[1]:60;   //Calculating thumbnail height
     
    //Initializing large width height
    $img_large_size = explode('x', strtolower(trim($option_data->dd_spg_large_size)));  //height x width
    $img_large_width = ($img_large_size[0])?$img_large_size[0]:400;    //Calculating large image width
    $img_large_height = ($img_large_size[1])?$img_large_size[1]:300;   //Calculating large image height
    
    $extra = strtolower($img_large_width . 'x' . $img_large_height);
    $extra_replace = strtolower($thumb_width . 'x' . $thumb_height);
    
    
    extract( shortcode_atts( array(
        'id' => '0',
        'effect' => $dd_spg_effect,
        'slices' => $dd_spg_slices,
        'boxcols' => $dd_spg_boxcols,
        'boxrows' => $dd_spg_boxrows,
        'slidespeed' => $dd_spg_slide_speed,
        'pausetime' => $dd_spg_pausetime,
        'largenavarrow' => $dd_spg_largenavarrow,
        'largenavarrowdefaulthidden' => $dd_spg_largenavarrowdefaulthidden,
        'pausepnhover' => $dd_spg_pauseonhover,
        'manualadvance' => $dd_spg_manualadvance,
        'prevtext' => $dd_spg_prevtext,
        'nexttext' => $dd_spg_nexttext,
        'keyboardnav' => $dd_spg_keyboardnav,
        'displaygallerycaption' => $dd_spg_is_display_title_and_des,
        'controlnav' => $dd_spg_controlnav,
        'controlnavthumbs' => $dd_spg_controlnavthumbs,
        'controlnavthumbswidth' => $thumb_width,
        'largeimageheight' => $img_large_height,
        'largeimagewidth' => $img_large_width,
        'controlnavthumbsheight' => $thumb_height,
        'captionopacity' => $dd_spg_captionopacity,
    ), $atts ) );   
    
    
    if(empty($id)){
        return false;
    }
    
    
    $sql="select * from ".$table_gallery." where id='".$id."'";
    $gallery_data = $wpdb->get_row($sql);
    
    
    
    $sql="select * from ".$table_photo." where gallery_id='".$id."'";
    $photo_data = $wpdb->get_results($sql);
    
    
    if(!empty($gallery_data)){
        $upload_dir = wp_upload_dir();
        /*Array ( 
            [path] => C:\path\to\wordpress\wp-content\uploads\2010\05 
            [url] => http://example.com/wp-content/uploads/2010/05 
            [subdir] => /2010/05 
            [basedir] => C:\path\to\wordpress\wp-content\uploads 
            [baseurl] => http://example.com/wp-content/uploads 
            [error] => 
        )*/ 
        
        $return_text = '<div id="slider_'.$id.'" class="sssSlider">';
            foreach($photo_data as $row){
                $img = $row->photo;
                
                $wp_filetype = wp_check_filetype(basename($img), null );
                $ext = '.' . $wp_filetype['ext'];
                $img = str_replace($ext, '-' . $img_large_width . 'x' . $img_large_height . $ext, $img);
                
                $tmp_img_url = $img;
                $tmp_img_dir = str_replace($upload_dir['baseurl'], $upload_dir['basedir'], $img);
                if(!file_exists($tmp_img_dir)){
                    $img =  $row->photo;
                }
                
                $image = '<img src="'.$img.'" alt="'.$row->title.'" title="'.$row->description.'" />';
                $return_text.=$image;    
            }
        $return_text.='</div>';

        

        
$javascript_str = <<<EOD
<script type="text/javascript">
$(window).load(function() {               
    $('#slider_{$id}').ssSlider({
        effect: '{$effect}',
        slices: '{$slices}',
        boxCols: '{$boxcols}',
        boxRows: '{$boxrows}',
        slideSpeed: '{$slidespeed}',
        pauseTime: '{$pausetime}',
        largeNavArrow: '{$largenavarrow}',
        largeNavArrowDefaultHidden: '{$largenavarrowdefaulthidden}',
        pauseOnHover: '{$pauseonhover}',
        manualAdvance: '{$manualadvance}',
        prevText: '{$prevtext}',
        nextText: '{$nexttext}',
        keyboardNav: '{$keyboardnav}',
        displayGalleryCaption: '{$displayhallerycaption}',
        controlNav: '{$controlnav}',
        controlNavThumbs: '{$controlnavthumbs}',
        controlNavThumbsWidth: '{$controlnavthumbswidth}',
        largeImageHeight: '{$largeimageheight}',
        largeImageWidth: '{$largeimagewidth}',
        controlNavThumbsHeight: '{$controlnavthumbsheight}',
        controlNavThumbsSearch: '{$extra}',
        controlNavThumbsReplace: '{$extra_replace}',
        captionOpacity: '{$captionopacity}',
        beforeChange: function(){},
        afterChange: function(){},
        slideshowEnd: function(){},
        lastSlide: function(){},
        afterLoad: function(){}
    });                                   
});
</script>
EOD;
        $return_text.= $javascript_str;
        return $return_text;
        
    } else {
        return false;
    }
    return false;
}    



//Plugins installation process starts here!
register_activation_hook(__FILE__,'dd_spg_install');
register_activation_hook(__FILE__,'dd_spg_install_options');




//creating galleries database table when activating the plugins
function dd_spg_install() {
   global $wpdb;
   $table_galleries = $wpdb->prefix . "dd_spg_galleries";
   $table_photos = $wpdb->prefix . "dd_spg_photos";
   
   
  if ($wpdb->get_var("SHOW TABLES LIKE '$table_galleries'") != $table_galleries) {
        //Creating database galleries table for dd simple photo gallery    
        $sql = 'CREATE TABLE '.$table_galleries.' (
  id int(11) NOT NULL auto_increment,
  title varchar(120) NOT NULL,
  description text,
  created datetime default NULL,
  updated datetime default NULL,
  PRIMARY KEY  (`id`)
) ENGINE=InnoDB  DEFAULT CHARSET=latin1 AUTO_INCREMENT=1 ;';
    
        $wpdb->query($sql);
    }
    
    
    
    
  if ($wpdb->get_var("SHOW TABLES LIKE '$table_photos'") != $table_photos) {
        //Creating database photos table for dd simple photo gallery
        $sql = 'CREATE TABLE '.$table_photos.' (
  id int(11) NOT NULL auto_increment,
  gallery_id int(11) NOT NULL default 0,
  title varchar(120) NOT NULL,
  photo text NOT NULL,
  description text,
  ordering int(11) NOT NULL default 0,
  created datetime default NULL,
  updated datetime default NULL,
  PRIMARY KEY  (`id`)
) ENGINE=InnoDB  DEFAULT CHARSET=latin1 AUTO_INCREMENT=18 ;';
        $wpdb->query($sql);
        
    }
}


//adding plugins required all settings options here when activating the plugins
function dd_spg_install_options(){
    // add_option( $name, $value, $deprecated, $autoload );
    if(!get_option('dd_spg_slide_speed'))
        add_option('dd_spg_slide_speed', '500', '', 'no');       // image thumbnail sliding speed in milliseconds 
    
    if(!get_option('dd_spg_effect'))
        add_option('dd_spg_effect', 'random', '', 'no');       // image transition effect 
    
    if(!get_option('dd_spg_slices'))
        add_option('dd_spg_slices', '18', '', 'no');       
    
    if(!get_option('dd_spg_boxcols'))
        add_option('dd_spg_boxcols', '8', '', 'no');       
    
    if(!get_option('dd_spg_boxrows'))
        add_option('dd_spg_boxrows', '4', '', 'no');       
    
    if(!get_option('dd_spg_pausetime'))
        add_option('dd_spg_pausetime', '5000', '', 'no');       
    
    if(!get_option('dd_spg_largenavarrow'))
        add_option('dd_spg_largenavarrow', 'true', '', 'no');       
    
    if(!get_option('dd_spg_largenavarrowdefaulthidden'))
        add_option('dd_spg_largenavarrowdefaulthidden', 'true', '', 'no');       
    
    if(!get_option('dd_spg_pauseonhover'))
        add_option('dd_spg_pauseonhover', 'true', '', 'no');       
    
    if(!get_option('dd_spg_manualadvance'))
        add_option('dd_spg_manualadvance', 'false', '', 'no');       
    
    if(!get_option('dd_spg_prevtext'))
        add_option('dd_spg_prevtext', 'Prev', '', 'no');       
    
    if(!get_option('dd_spg_nexttext'))
        add_option('dd_spg_nexttext', 'Next', '', 'no');       
    
    if(!get_option('dd_spg_keyboardnav'))
        add_option('dd_spg_keyboardnav', 'true', '', 'no');       
    
    if(!get_option('dd_spg_displaygallerycaption'))
        add_option('dd_spg_displaygallerycaption', 'false', '', 'no');       
    
    if(!get_option('dd_spg_controlnav'))
        add_option('dd_spg_controlnav', 'true', '', 'no');       
    
    if(!get_option('dd_spg_controlnavthumbs'))
        add_option('dd_spg_controlnavthumbs', 'true', '', 'no');       
    
    if(!get_option('dd_spg_captionopacity'))
        add_option('dd_spg_captionopacity', '0.6', '', 'no');       
    
    
    
    if(!get_option('dd_spg_is_display_title_and_des'))
        add_option('dd_spg_is_display_title_and_des', 'yes', '', 'no');       // image information display or not settings 
    
    if(!get_option('dd_spg_thumb_size'))
        add_option('dd_spg_thumb_size', '50x50', '', 'no');     // in pixel width x height
    
    if(!get_option('dd_spg_large_size'))
        add_option('dd_spg_large_size', '550x250', '', 'no');   // in pixel width x height
    
    if(!get_option('dd_sfg_db_version'))
        add_option("dd_sfg_db_version", VERSION, '', 'no');     // plugins database verions 1.0
        
    //Updating gallery version    
    $installed_ver = get_option( "dd_sfg_db_version" );
    if( $installed_ver != VERSION ) {
      update_option( "dd_sfg_db_version", VERSION );
    }
    
}
