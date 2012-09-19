<?php
if ( ! defined( 'WP_UNINSTALL_PLUGIN' ) )
	exit();


/**
* To remove or drop all tables related to this plugins and settins variables from wordpress options
* 
* @return null
* @access public
*/
function dd_spg_uninstall() {	
	global $wpdb;
	
	
	$sql = 'DROP TABLE IF EXISTS '. $wpdb->prefix.'dd_spg_galleries;';
	$wpdb->query( $sql );
	
	$sql = 'DROP TABLE IF EXISTS '. $wpdb->prefix.'dd_spg_photos;';
	$wpdb->query( $sql );
	
	delete_option('dd_spg_slide_speed');
    delete_option('dd_sfg_db_version');
	delete_option('dd_spg_is_display_title_and_des');
	delete_option('dd_spg_thumb_size');     
    delete_option('dd_spg_large_size');     
    
    delete_option('dd_spg_effect');     
    delete_option('dd_spg_slices');     
    delete_option('dd_spg_boxcols');     
    delete_option('dd_spg_boxrows');     
    delete_option('dd_spg_pausetime');     
    delete_option('dd_spg_largenavarrow');     
    delete_option('dd_spg_largenavarrowdefaulthidden');     
    delete_option('dd_spg_pauseonhover');     
    delete_option('dd_spg_manualadvance');     
    delete_option('dd_spg_prevtext');     
    delete_option('dd_spg_nexttext');     
    delete_option('dd_spg_keyboardnav');     
    delete_option('dd_spg_displaygallerycaption');     
    delete_option('dd_spg_controlnav');     
    delete_option('dd_spg_controlnavthumbs');     
    delete_option('dd_spg_captionopacity');     
}


dd_spg_uninstall();
