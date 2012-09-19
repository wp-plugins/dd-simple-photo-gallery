<?php


    $url=$_SERVER['REQUEST_URI'];
    $page='dd_spg_manage_photo'; //Used to create this page link like back, no thanks, edit and delte
    
    if(!empty($_POST['submit'])){
        //Additional Settings on 20-09-2012 version 1.2 update by Jewel Ahmed<tojibon@gmail.com>
        update_option('dd_spg_effect', $_POST['dd_spg_effect']);
        update_option('dd_spg_slices', $_POST['dd_spg_slices']);
        update_option('dd_spg_boxcols', $_POST['dd_spg_boxcols']);
        update_option('dd_spg_boxrows', $_POST['dd_spg_boxrows']);
        update_option('dd_spg_pausetime', $_POST['dd_spg_pausetime']);
        update_option('dd_spg_largenavarrow', $_POST['dd_spg_largenavarrow']);
        update_option('dd_spg_largenavarrowdefaulthidden', $_POST['dd_spg_largenavarrowdefaulthidden']);
        update_option('dd_spg_pauseonhover', $_POST['dd_spg_pauseonhover']);
        update_option('dd_spg_manualadvance', $_POST['dd_spg_manualadvance']);
        update_option('dd_spg_prevtext', $_POST['dd_spg_prevtext']);
        update_option('dd_spg_nexttext', $_POST['dd_spg_nexttext']);
        update_option('dd_spg_keyboardnav', $_POST['dd_spg_keyboardnav']);
        update_option('dd_spg_displaygallerycaption', $_POST['dd_spg_displaygallerycaption']);
        update_option('dd_spg_controlnav', $_POST['dd_spg_controlnav']);
        update_option('dd_spg_controlnavthumbs', $_POST['dd_spg_controlnavthumbs']);
        update_option('dd_spg_captionopacity', $_POST['dd_spg_captionopacity']);
        
        
		update_option('dd_spg_slide_speed', $_POST['dd_spg_slide_speed']);
        update_option('dd_spg_is_display_title_and_des', $_POST['dd_spg_is_display_title_and_des']);
        
        if(empty($_POST['dd_spg_thumb_size']))
            $_POST['dd_spg_thumb_size']='80x60';
            
        $_POST['dd_spg_thumb_size'] = strtolower($_POST['dd_spg_thumb_size']);    
        update_option('dd_spg_thumb_size', $_POST['dd_spg_thumb_size']);
        
        
        if(empty($_POST['dd_spg_large_size']))
            $_POST['dd_spg_large_size']='400x300';
        
        $_POST['dd_spg_large_size'] = strtolower($_POST['dd_spg_large_size']);
        update_option('dd_spg_large_size', $_POST['dd_spg_large_size']);
        
        
        $thumb_size = explode('x', $_POST['dd_spg_thumb_size']);
        $width = !empty($thumb_size[0])?$thumb_size[0]:80;
        $height = !empty($thumb_size[1])?$thumb_size[1]:60;
            
        $large_thumb_size = explode('x', $_POST['dd_spg_large_size']);
        $large_width = !empty($large_thumb_size[0])?$large_thumb_size[0]:400;
        $large_height = !empty($large_thumb_size[1])?$large_thumb_size[1]:300;
            
        
        $msg = '';   
        $sql="select * from ".$table_photo;
        $photo_data = $wpdb->get_results($sql);
        
        if(!empty($photo_data)){
            foreach($photo_data as $row){
                $img = '..' . substr($row->photo, strpos($row->photo, '/wp-content'));
                $thumb = image_resize($img,$width,$height,true);
                
                $large_thumb = image_resize($img,$large_width,$large_height,true);
                
                
            }
        }
        
        
        $msg.= 'Your gallery settings has been updated successfully.';
    }
    
    $return_options_data=dd_spg_get_all_options();
    $data = (object) $return_options_data;
	
?>
<div class='wrap'>
<h2><a href='<?=PLUGINS_WEBSITE?>'><img src="<?php
echo (DD_SFG_BASE_URL . '/admin/images/logo_big.png'); ?>" align='center'/></a>Manage Settings | DD Simple Photo Gallery</h2>


<?php if (!empty($msg)) { ?>
    <div class="updated fade"><p><strong><?=$msg?></strong></p></div>
<?php } ?>

<?php if (!empty($err)) { ?>
    <div class="error fade"><p><strong><?=$err?></strong></p></div>
<?php } ?>





<?php echo dd_spg_version_line(); ?>
<div class="postbox-container" style="width:70%;">
<div id="poststuff">
    <form method='post' action='<?php echo $url ?>'>
    <div class="postbox">
        <h3>Default Settings</h3>
        
        <table class='form-table'>
            <tr valign='top'>
            <th scope='row'>Display image information </th>
            <td>
			
			<?php 
			
			if($data->dd_spg_is_display_title_and_des=='yes'){ 
				$yes = ' checked="checked"';
				$no = '';
			} else {
				$no = ' checked="checked"';				
				$yes = '';
			}
			
			?>
			
			<input type='radio'  name='dd_spg_is_display_title_and_des' <?=$yes?> value="yes" />&nbsp; Yes
			
			<input type='radio' name='dd_spg_is_display_title_and_des' <?=$no?> value="no" />&nbsp;&nbsp;&nbsp;No
			
			</td>
            </tr>
            <tr valign='top'>
            <th scope='row'>Thumb Photo Size</th>
            <td><input maxlength='100' size='50%' type='text' id='dd_spg_thumb_size' name='dd_spg_thumb_size' value="<?=$data->dd_spg_thumb_size?>" /></td>
            </tr>
            
            <tr valign='top'>
            <th scope='row'>Large Photo Size</th>
            <td><input maxlength='100' size='50%' type='text' id='dd_spg_large_size' name='dd_spg_large_size' value="<?=$data->dd_spg_large_size?>" /></td>
            </tr>
			
			
            <tr valign='top'>
            <th scope='row'>Slider Speed in milliseconds</th>
            <td><input maxlength='100' size='50%' type='text' id='dd_spg_slide_speed' name='dd_spg_slide_speed' value="<?=$data->dd_spg_slide_speed?>" /></td>
            </tr>
            
            
            <tr valign='top'>
            <th scope='row'>Effect</th>
            <td><input maxlength='100' size='50%' type='text' id='dd_spg_effect' name='dd_spg_effect' value="<?=$data->dd_spg_effect?>" /></td>
            </tr>
            
            <tr valign='top'>
            <th scope='row'>Slices</th>
            <td><input maxlength='100' size='50%' type='text' id='dd_spg_slices' name='dd_spg_slices' value="<?=$data->dd_spg_slices?>" /></td>
            </tr>
            
            <tr valign='top'>
            <th scope='row'>Box Cols</th>
            <td><input maxlength='100' size='50%' type='text' id='dd_spg_boxcols' name='dd_spg_boxcols' value="<?=$data->dd_spg_boxcols?>" /></td>
            </tr>
            
            <tr valign='top'>
            <th scope='row'>Box Rows</th>
            <td><input maxlength='100' size='50%' type='text' id='dd_spg_boxrows' name='dd_spg_boxrows' value="<?=$data->dd_spg_boxrows?>" /></td>
            </tr>
            
            <tr valign='top'>
            <th scope='row'>Pause Time</th>
            <td><input maxlength='100' size='50%' type='text' id='dd_spg_pausetime' name='dd_spg_pausetime' value="<?=$data->dd_spg_pausetime?>" /></td>
            </tr>
            
            <tr valign='top'>
            <th scope='row'>Large Nav Arrow</th>
            <td>
            
            <?php   
            if($data->dd_spg_largenavarrow=='true'){ 
                $yes = ' checked="checked"';
                $no = '';
            } else {
                $no = ' checked="checked"';                
                $yes = '';
            }               
            ?>                              
            <input type='radio'  name='dd_spg_largenavarrow' <?=$yes?> value="true" />&nbsp; Yes
            <input type='radio' name='dd_spg_largenavarrow' <?=$no?> value="false" />&nbsp;&nbsp;&nbsp;No
            
            </td>
            </tr>
            
            <tr valign='top'>
            <th scope='row'>Large Nav Arrow Default Hidden</th>
            <td>
            
            <?php   
            if($data->dd_spg_largenavarrowdefaulthidden=='true'){ 
                $yes = ' checked="checked"';
                $no = '';
            } else {
                $no = ' checked="checked"';                
                $yes = '';
            }               
            ?>                              
            <input type='radio'  name='dd_spg_largenavarrowdefaulthidden' <?=$yes?> value="true" />&nbsp; Yes
            <input type='radio' name='dd_spg_largenavarrowdefaulthidden' <?=$no?> value="false" />&nbsp;&nbsp;&nbsp;No
            
            </td>
            </tr>
            
            <tr valign='top'>
            <th scope='row'>Pause On Hover</th>
            <td>
            
            <?php   
            if($data->dd_spg_pauseonhover=='true'){ 
                $yes = ' checked="checked"';
                $no = '';
            } else {
                $no = ' checked="checked"';                
                $yes = '';
            }               
            ?>                              
            <input type='radio'  name='dd_spg_pauseonhover' <?=$yes?> value="true" />&nbsp; Yes
            <input type='radio' name='dd_spg_pauseonhover' <?=$no?> value="false" />&nbsp;&nbsp;&nbsp;No
            
            </td>
            </tr>
            
            <tr valign='top'>
            <th scope='row'>Auto Play Off</th>
            <td>
            
            <?php   
            if($data->dd_spg_manualadvance=='true'){ 
                $yes = ' checked="checked"';
                $no = '';
            } else {
                $no = ' checked="checked"';                
                $yes = '';
            }               
            ?>                              
            <input type='radio'  name='dd_spg_manualadvance' <?=$yes?> value="true" />&nbsp; Yes
            <input type='radio' name='dd_spg_manualadvance' <?=$no?> value="false" />&nbsp;&nbsp;&nbsp;No
            
            </td>
            </tr>
            
            <tr valign='top'>
            <th scope='row'>Keyboard Nav</th>
            <td>
            
            <?php   
            if($data->dd_spg_keyboardnav=='true'){ 
                $yes = ' checked="checked"';
                $no = '';
            } else {
                $no = ' checked="checked"';                
                $yes = '';
            }               
            ?>                              
            <input type='radio'  name='dd_spg_keyboardnav' <?=$yes?> value="true" />&nbsp; Yes
            <input type='radio' name='dd_spg_keyboardnav' <?=$no?> value="false" />&nbsp;&nbsp;&nbsp;No
            
            </td>
            </tr>
            
            <tr valign='top'>
            <th scope='row'>Display Gallery Caption</th>
            <td>
            
            <?php   
            if($data->dd_spg_displaygallerycaption=='true'){ 
                $yes = ' checked="checked"';
                $no = '';
            } else {
                $no = ' checked="checked"';                
                $yes = '';
            }               
            ?>                              
            <input type='radio'  name='dd_spg_displaygallerycaption' <?=$yes?> value="true" />&nbsp; Yes
            <input type='radio' name='dd_spg_displaygallerycaption' <?=$no?> value="false" />&nbsp;&nbsp;&nbsp;No
            
            </td>
            </tr>
            
            <tr valign='top'>
            <th scope='row'>Display Control Nav</th>
            <td>
            
            <?php   
            if($data->dd_spg_controlnav=='true'){ 
                $yes = ' checked="checked"';
                $no = '';
            } else {
                $no = ' checked="checked"';                
                $yes = '';
            }               
            ?>                              
            <input type='radio'  name='dd_spg_controlnav' <?=$yes?> value="true" />&nbsp; Yes
            <input type='radio' name='dd_spg_controlnav' <?=$no?> value="false" />&nbsp;&nbsp;&nbsp;No
            
            </td>
            </tr>
            
            
            <tr valign='top'>
            <th scope='row'>Display Thumb Nav</th>
            <td>
            
            <?php   
            if($data->controlnavthumbs=='true'){ 
                $yes = ' checked="checked"';
                $no = '';
            } else {
                $no = ' checked="checked"';                
                $yes = '';
            }               
            ?>                              
            <input type='radio'  name='dd_spg_controlnavthumbs' <?=$yes?> value="true" />&nbsp; Yes
            <input type='radio' name='dd_spg_controlnavthumbs' <?=$no?> value="false" />&nbsp;&nbsp;&nbsp;No
            
            </td>
            </tr>
            
            
            <tr valign='top'>
            <th scope='row'>Thumb Opacity</th>
            <td><input maxlength='100' size='50%' type='text' id='dd_spg_captionopacity' name='dd_spg_captionopacity' value="<?=$data->dd_spg_captionopacity?>" /></td>
            </tr>
            
            <tr valign='top'>
            <th scope='row'>Prev Text</th>
            <td><input maxlength='100' size='50%' type='text' id='dd_spg_prevtext' name='dd_spg_prevtext' value="<?=$data->dd_spg_prevtext?>" /></td>
            </tr>
            
            <tr valign='top'>
            <th scope='row'>Next Text</th>
            <td><input maxlength='100' size='50%' type='text' id='dd_spg_nexttext' name='dd_spg_nexttext' value="<?=$data->dd_spg_nexttext?>" /></td>
            </tr>
            
            
        </table>
        
       
    </div>
    <input type="submit" id="submit" class="button-primary" name="submit" value="Save Changes" />
     </form>
</div>
</div>




<div class="postbox-container" style="width: 29%; margin-left: 10px;">
<?php
echo dd_spg_current_settings_box();
echo dd_spg_box('Update Instructions', 'Please set all size in pixel.<br /><b>Example:</b><br />Thumb size: 80x80 as width x height (In Pixel)<br />Large Image size: 450x320 as width x height (In Pixel)');
 ?>
</div>