<?php
/*
Plugin Name: DD Simple Photo Gallery
Plugin URI: http://www.dropndot.com/blog/dd-simple-photo-gallery-wordpress-plugin/
Description: DD Simple Photo Gallery is a simple, fast and light plugin to create a gallery of your custom uploaded gallery wise photos on your WordPress enabled website.  This plugin aims at providing a simple yet customizable way to create, manage gallery and upload photos under custom gallery.
Version: 1.0
Author: phpfarmer(Jewel Ahmed)
Author URI: http://www.phpfarmer.com
License: GPL2
Release Date: 10-Jul-2011

Copyright 2011 Jewel Ahmed (email : jewel@dropndot.com)

Filename: uninstall.php
*/

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
	delete_option('dd_spg_thumb_size');     //widthxheight
    delete_option('dd_spg_large_size');     // in pixel
}


dd_spg_uninstall();
