/*
 * jQuery Slim and Sexy Slider v1.0
 * http://phpfarmer.com
 *
 * Copyright 2011, Jewel Ahmed
 * Free to use and abuse under the MIT license.
 * http://www.opensource.org/licenses/mit-license.php
 * 
 * November 2011
 */
 
 
 (function($) {

    var ssSlider = function(element, options){
        //Defaults variables which is overwritable
        var settings = $.extend({}, $.fn.ssSlider.defaults, options);

        // For debugging
        var printString = function(msg){
            if (this.console && typeof console.log != "undefined")
                console.log(msg);
        }
        
        
        //Internal settings variables.
        var vars = {
            currentSlide: 0,
            currentImage: '',
            totalSlides: 0,
            slideAnimation: '',
            sliderWapper: '',
            wrapperId: '',
            running: false,
            paused: false,
            stop: false
        };
    
        var slider = $(element);
		vars.wrapperId = element.id + '_wapper';
		slider.wrap('<div id="'+vars.wrapperId+'" class="sliderWapper" />');
        
		
		
		vars.sliderWapper = $('#'+vars.wrapperId+'');
		
		
		
		slider.data('sss:vars', vars);
        slider.css('position','relative');
        //slider.css('overflow','hidden');
        slider.addClass('ssSlider');
        
        
        var kids = slider.children('img');
        
        var maxWidth = 0;
		var maxHeight = 0;
		
		
		
        kids.each(function() {
            var child = $(this);
			
			

			
			
            var childWidth = child.width();
			
            if(childWidth == 0) childWidth = child.attr('width');
            
            var childHeight = child.height();
            if(childHeight == 0) childHeight = child.attr('height');
            
            //Resize the slider
            if(childWidth > maxWidth){
                maxWidth = childWidth;
            }
			
			if(childHeight > maxHeight){
                maxHeight = childHeight;
            }
            
            child.css('display','none');
            vars.totalSlides++;
        });
        vars.totalSlides--;
        
        
        maxWidth = slider.width(maxWidth);
        maxHeight = slider.height(maxHeight);
        
        
        //Resizing the slider width with large image width
        vars.sliderWapper.width(maxWidth);
        slider.width(maxWidth);
        
        
		//Resizing the slider height with large image height
		vars.sliderWapper.height(maxHeight+settings.controlNavThumbsHeight+20);
		slider.height(maxHeight);
        
        
		
        //Overwriting slider height for slice or column height
        settings.sliderHeight = slider.height();
        
        vars.currentImage = $(kids[vars.currentSlide]);
        
        
		//Set first background
        slider.css('background','url("'+ vars.currentImage.attr('src') +'") no-repeat');                           
        
		
		
        //Create caption    
        slider.append(
            $('<div class="sss-caption"><p></p></div>').css({ display:'none', opacity:settings.captionOpacity })
        );            
        
        
        // Process caption function
        var sssCaption = function(settings){
            if(settings.displayGalleryCaption!='yes')
            return false;
            
            var sssCaption = $('.sss-caption', slider);
            
            if(vars.currentImage.attr('title') != '' && vars.currentImage.attr('title') != undefined){
                var title = vars.currentImage.attr('title');
                if(title.substr(0,1) == '#') title = $(title).html();    

                
                if(sssCaption.css('display') == 'block'){
                    sssCaption.find('p').fadeOut(settings.slideSpeed, function(){
                        $(this).html(title);
                        $(this).fadeIn(settings.slideSpeed);
                    });
                } else {   
                    sssCaption.find('p').html(title);
                }                    
                sssCaption.fadeIn(settings.slideSpeed);
            } else {
                sssCaption.fadeOut(settings.slideSpeed);
            }
        }
        
        //Process initial  caption
        
        sssCaption(settings);
        
        //In the words of Super Mario "let's a go!"
        var timer = 0;
        if(!settings.manualAdvance && kids.length > 1){
            timer = setInterval(function(){ sssRun(slider, kids, settings, false); }, settings.pauseTime);
        }

        if(settings.largeNavArrow){
            slider.append('<div class="sssLargeNav"><a class="sssPre">'+ settings.prevText +'</a><a class="sssNext">'+ settings.nextText +'</a></div>');
            if(settings.largeNavArrowDefaultHidden){
                $('.sssLargeNav', slider).hide();
                slider.hover(function(){
                    $('.sssLargeNav', slider).show();
                }, function(){
                    $('.sssLargeNav', slider).hide();
                });
            }
            
            $('a.sssPre', slider).live('click', function(){
                if(vars.running) return false;                  
                clearInterval(timer);
                timer = '';
                vars.currentSlide -= 2;
                sssRun(slider, kids, settings, 'prev');
            });
            
            $('a.sssNext', slider).live('click', function(){
                if(vars.running) return false;                  
                clearInterval(timer);
                timer = '';
                sssRun(slider, kids, settings, 'next');
            });
        }
        
        
        if(settings.controlNav){
            
            
            var sssControl = $('<div class="sss-controlNav"><div class="sss-thumb-inner"></div></div>');
            slider.after(sssControl);
            
            sssControl = $('.sss-thumb-inner', vars.sliderWapper);
            sssControl.css({width:(settings.controlNavThumbsWidth*(kids.length-1))+'px', position:'absolute'});
            
            
            var sssControlNav = $('.sss-controlNav', vars.sliderWapper);
            sssControlNav.css({height:settings.controlNavThumbsHeight+'px', position:'relative', overflow:'hidden'});
            
            
            for(var i = 0; i < kids.length-1; i++){
                if(settings.controlNavThumbs){
                    var child = kids.eq(i);
                    if(!child.is('img')){
                        child = child.find('img:first');
                    }
                    
                    printString(child.attr('src'));
                    sssControl.append('<a class="sss-control" rel="'+ i +'"><img src="'+ child.attr('src').replace(settings.controlNavThumbsSearch, settings.controlNavThumbsReplace) +'" alt="" /></a>');
                    
                } else {
                    sssControl.append('<a class="sss-control" rel="'+ i +'">'+ (i + 1) +'</a>');
                }
                
            }
            
            $('.sss-controlNav a', vars.sliderWapper).css({float:'left'});
            
            $('.sss-controlNav a', vars.sliderWapper).css({float:'left', height: settings.controlNavThumbsHeight+'px', width: settings.controlNavThumbsWidth+'px', overflow: 'hidden'});
            
            
                    
             /*
             * Image Thumbnail resizing and showing the center position of a thumbnail image on the fly according to the thumbnail size settings
             */      
             var thumbImageList = $('.sss-control img', vars.sliderWapper);      
             thumbImageList.each(function(){
                    var childWidth = $(this).width();
                    var childHeight = $(this).height();
                    
                    var leftThumb = 0;
                    var topThumb = 0;
                   
                    if(childWidth>settings.controlNavThumbsWidth){
                        var xExtraWidth = childWidth-settings.controlNavThumbsWidth;
                        leftThumb = (leftThumb-xExtraWidth)/2;
                    }
                   
                    if(childHeight>settings.controlNavThumbsHeight){
                        var xExtraHeight = childHeight-settings.controlNavThumbsHeight;
                        topThumb = (topThumb-xExtraHeight)/2;
                    }         
                  
                    $(this).css({left:leftThumb+'px', top:topThumb+'px', position:'absolute'});
             });
             
                   
            
            
            //Set initial active link
            $('.sss-controlNav a:eq('+ vars.currentSlide +')', vars.sliderWapper).addClass('active');
            
            $('.sss-controlNav a', vars.sliderWapper).live('click', function(){
                
                if(vars.running) return false;
                if($(this).hasClass('active')) return false;
                
                clearInterval(timer);
                timer = '';
                slider.css('background','url("'+ vars.currentImage.attr('src') +'") no-repeat');
                
                vars.currentSlide = $(this).attr('rel');
                
                vars.currentSlide--;
                
                sssRun(slider, kids, settings);
            });
        }
        
       
        
        
        if(settings.pauseOnHover){
            slider.hover(function(){
                vars.paused = true;
                clearInterval(timer);
                timer = '';
            }, function(){
                vars.paused = false;
                //Restart the timer
                if(timer == '' && !settings.manualAdvance){
                    timer = setInterval(function(){ sssRun(slider, kids, settings, false); }, settings.pauseTime);
                }
            });
        }
        
        
        if(settings.keyboardNav){
            $(window).keypress(function(event){
                //Left key pressed
                if(event.keyCode == '37'){
                    if(vars.running) return false;
                    clearInterval(timer);
                    timer = '';
                    vars.currentSlide-=2;
                    sssRun(slider, kids, settings, 'prev');
                }
                //Right key pressed
                if(event.keyCode == '39'){
                    if(vars.running) return false;
                    clearInterval(timer);
                    timer = '';
                    sssRun(slider, kids, settings, 'next');
                }
            });
        }
        
        slider.bind('sss:animDone', function(){ 
            vars.running = false; 
            
            //Restart the timer
            if(timer == '' && !vars.paused && !settings.manualAdvance){
                timer = setInterval(function(){ sssRun(slider, kids, settings, false); }, settings.pauseTime);
            }
            //sssCaption(settings);  
            settings.afterChange.call(this);
        });
        
        
        
        var showSelectedThumbActive = function(slider, settings, vars){
            $('a.sss-control', vars.sliderWapper).removeClass('active');
            $('.sss-controlNav a:eq('+ vars.currentSlide +')', vars.sliderWapper).addClass('active');
        
        
            var sssThumbInner = $('.sss-thumb-inner', vars.sliderWapper);  
            var innerWidth = sssThumbInner.width();    //1150
            
            
            var sssControlNav = $('.sss-controlNav', vars.sliderWapper);
            var outerWidth = sssControlNav.width();    //734
            //outerWidth-=settings.controlNavThumbsWidth;
            
            
            //vars.currentSlide         //2
            //settings.controlNavThumbsWidth    //115
            
            //vars.totalSlides          //10
            
            
            //Number of thumb showing at default
            var showableTotalSlide = parseInt(outerWidth/settings.controlNavThumbsWidth);      //6.3826086956521735
            
            
            
            
            //690       -----       In Left or Right showable be default
            var defaultShowingWidth = settings.controlNavThumbsWidth*(parseInt(outerWidth/settings.controlNavThumbsWidth));
            
            /*230
            460
            575
            690
            
            
            805
            920*/
            var currentSliderInWidth = (vars.currentSlide+1)*settings.controlNavThumbsWidth;
            var sssThumbInnerPosition = sssThumbInner.position();
            var currentSlide = vars.currentSlide;                                                       //7
            var totalSlide = vars.totalSlides;                                                          //10
                
            if(currentSliderInWidth>defaultShowingWidth){
                if((totalSlide-currentSlide)>showableTotalSlide){
                    var numberOfFullSet = parseInt(currentSlide/showableTotalSlide);
                    var numberOfExtra = (currentSlide/showableTotalSlide)-numberOfFullSet;
                    var leftSlidePosition = ((defaultShowingWidth*numberOfFullSet)+(numberOfExtra*settings.controlNavThumbsWidth));
                    if(numberOfFullSet>0){
                        leftSlidePosition-=  (settings.controlNavThumbsWidth*1);                      
                    } 
                    sssThumbInner.animate({ left:'-'+leftSlidePosition+'px' }, settings.slideSpeed);
                } else {
                    //outerWidth+=settings.controlNavThumbsWidth;
                    var leftSlidePosition = ((totalSlide-showableTotalSlide)*settings.controlNavThumbsWidth) - (outerWidth-defaultShowingWidth);
                    sssThumbInner.animate({ left:'-'+leftSlidePosition+'px' }, settings.slideSpeed);
                }
            } else {
                sssThumbInner.animate({ left:'0px' }, settings.slideSpeed);
            } 
        }
        
        
        // Private run method
        var sssRun = function(slider, kids, settings, direction){
            //Get our vars
            var vars = slider.data('sss:vars');
            
            //Trigger the lastSlide callback
            if(vars && (vars.currentSlide == (vars.totalSlides - 1))){ 
                settings.lastSlide.call(this);
            }
            
            
            
            
            
            // Stop
            if((!vars || vars.stop) && !nudge) return false;
            
            //Trigger the beforeChange callback
            settings.beforeChange.call(this);
                    
            //Set current background before change
            if(!direction){
                slider.css('background','url("'+ vars.currentImage.attr('src') +'") no-repeat');
            } else {
                if(direction == 'prev'){
                    slider.css('background','url("'+ vars.currentImage.attr('src') +'") no-repeat');
                }
                if(direction == 'next'){
                    slider.css('background','url("'+ vars.currentImage.attr('src') +'") no-repeat');
                }
            }
            vars.currentSlide++;
            
            
            //Moving back to first slide if it is just before the last slide
            if(vars.currentSlide == vars.totalSlides){ 
                vars.currentSlide = 0;
                settings.slideshowEnd.call(this);              
            }
            
            //MOving to last slide if it is a invalid slide request with less then 0 index
            if(vars.currentSlide < 0) vars.currentSlide = (vars.totalSlides - 1);
            
            //Set vars.currentImage      
            vars.currentImage = $(kids[vars.currentSlide]);
            
            //selected Thumb activation
            showSelectedThumbActive(slider, settings, vars);
            
            sssCaption(settings);   
            
            // Remove any slices or columns from last transition
            $('.sss-slice', slider).remove();
            
            // Remove any boxes from last transition
            $('.sss-box', slider).remove();
            
            
            if(settings.effect == 'random'){
                if (settings && typeof settings.defaultEffects != "undefined"){
                    var anims = settings.defaultEffects;    
                } else {
                    var anims = $.fn.ssSlider.defaultEffects.defaultEffects;
                } 
                vars.slideAnimation = anims[Math.floor(Math.random()*(anims.length + 1))];
                if(vars.slideAnimation == undefined) 
                    vars.slideAnimation = 'fade';
                    
            } else {
                vars.slideAnimation = settings.effect;    
            }
            
            
            //Running is active on running
            vars.running = true;
            
            //printString('Running slide animation: ' + vars.slideAnimation);
            
            
            if( 
                vars.slideAnimation == 'sliceDownRight' ||
                vars.slideAnimation == 'sliceDownLeft' || 
                vars.slideAnimation == 'sliceDownRandom'
                ){
                createSlices(slider, settings, vars);
                
                var timeBuff = 0;
                var i = 0;
                
                
                if(vars.slideAnimation=='sliceDownRandom')
                    var slices = arrayRandom($('.sss-slice', slider));   
                else
                    var slices = $('.sss-slice', slider);
                
                
                if(vars.slideAnimation == 'sliceDownLeft') slices = $('.sss-slice', slider)._reverse();
                
                slices.each(function(){
                    var slice = $(this);
                    slice.css({ 'top': '0px' });
                    if(i == settings.slices-1){
                        setTimeout(function(){
                            slice.animate({ height:settings.sliderHeight+'px', opacity:'1.0' }, settings.slideSpeed, '', function(){ slider.trigger('sss:animDone'); });
                        }, (100 + timeBuff));
                    } else {
                        setTimeout(function(){
                            slice.animate({ height:settings.sliderHeight+'px', opacity:'1.0' }, settings.slideSpeed);
                        }, (100 + timeBuff));
                    }
                    timeBuff += 50;
                    i++;
                });   
            } else if(
                vars.slideAnimation == 'sliceUpRight' || 
                vars.slideAnimation == 'sliceUpLeft' || 
                vars.slideAnimation == 'sliceUpRandom'
                ){
                createSlices(slider, settings, vars);
                var timeBuff = 0;
                var i = 0;
                
                if(vars.slideAnimation=='sliceUpRandom')
                    var slices = arrayRandom($('.sss-slice', slider));
                else
                    var slices = $('.sss-slice', slider);
                
                if(vars.slideAnimation == 'sliceUpLeft') slices = $('.sss-slice', slider)._reverse();
                
                slices.each(function(){
                    var slice = $(this);
                    slice.css({ 'bottom': '0px' });
                    if(i == settings.slices-1){
                        setTimeout(function(){
                            slice.animate({ height:settings.sliderHeight+'px', opacity:'1.0' }, settings.slideSpeed, '', function(){ slider.trigger('sss:animDone'); });
                        }, (100 + timeBuff));
                    } else {
                        setTimeout(function(){
                            slice.animate({ height:settings.sliderHeight+'px', opacity:'1.0' }, settings.slideSpeed);
                        }, (100 + timeBuff));
                    }
                    timeBuff += 50;
                    i++;
                });
            } else if(
                vars.slideAnimation == 'sliceUpDownRight' || 
                vars.slideAnimation == 'sliceUpDownLeft' || 
                vars.slideAnimation == 'sliceUpDownRandom'
                ){
                createSlices(slider, settings, vars);
                var timeBuff = 0;
                var i = 0;
                var v = 0;
                
                if(vars.slideAnimation=='sliceUpDownRandom')
                    var slices = arrayRandom($('.sss-slice', slider));
                else
                    var slices = $('.sss-slice', slider);
                
                if(vars.slideAnimation == 'sliceUpDownLeft') slices = $('.sss-slice', slider)._reverse();
                
                slices.each(function(){
                    var slice = $(this);
                    if(i == 0){
                        slice.css('top','0px');
                        i++;
                    } else {
                        slice.css('bottom','0px');
                        i = 0;
                    }
                    
                    if(v == settings.slices-1){
                        setTimeout(function(){
                            slice.animate({ height:settings.sliderHeight+'px', opacity:'1.0' }, settings.slideSpeed, '', function(){ slider.trigger('sss:animDone'); });
                        }, (100 + timeBuff));
                    } else {
                        setTimeout(function(){
                            slice.animate({ height:settings.sliderHeight+'px', opacity:'1.0' }, settings.slideSpeed);
                        }, (100 + timeBuff));
                    }
                    timeBuff += 50;
                    v++;
                });
            } else if(
                vars.slideAnimation == 'slide2Right' 
                ){
                createSlices(slider, settings, vars);
                
                var firstSlice = $('.sss-slice:first', slider);
                firstSlice.css({
                    'height': settings.sliderHeight+'px',
                    'width': '0px',
                    'opacity': '1'
                });

                firstSlice.animate({ width: slider.width() + 'px' }, (settings.slideSpeed*2), '', function(){ slider.trigger('sss:animDone'); });
            } else if(
                vars.slideAnimation == 'slide2Left'
                ){
                createSlices(slider, settings, vars);
                
                var firstSlice = $('.sss-slice:first', slider);
                firstSlice.css({
                    'height': '100%',
                    'width': '0px',
                    'opacity': '1',
                    'left': '',
                    'right': '0px'
                });

                firstSlice.animate({ width: slider.width() + 'px' }, (settings.slideSpeed*2), '', function(){ 
                    firstSlice.css({
                        'left': '0px',
                        'right': ''
                    }); 
                    
                    slider.trigger('sss:animDone'); 
                                   
                });
            } else if(
                vars.slideAnimation == 'slice2Right'
                ){
                createSlices(slider, settings, vars);
                
                
                var timeBuff = 0;
                var i = 0;
                
                var slices = $('.sss-slice', slider);  
                
                slices.each(function(){
                    var slice = $(this);
                    var origWidth = slice.width();
                    slice.css({ top:'0px', height:settings.sliderHeight+'px', width:'0px' });
                    if(i == settings.slices-1){
                        setTimeout(function(){
                            slice.animate({ width:origWidth, opacity:'1.0' }, settings.slideSpeed, '', function(){ slider.trigger('sss:animDone'); });
                        }, (100 + timeBuff));
                    } else {
                        setTimeout(function(){
                            slice.animate({ width:origWidth, opacity:'1.0' }, settings.slideSpeed);
                        }, (100 + timeBuff));
                    }
                    timeBuff += 50;
                    i++;
                });
            } else if(
                vars.slideAnimation == 'slice2Left'
                ){
                createSlices(slider, settings, vars);
                
                
                var timeBuff = 0;
                var i = 0;
                
                var slices = $('.sss-slice', slider)._reverse();  
                
                slices.each(function(){
                    var slice = $(this);
                    var origWidth = slice.width();
                    slice.css({ top:'0px', height:settings.sliderHeight+'px', width:'0px' });
                    if(i == settings.slices-1){
                        setTimeout(function(){
                            slice.animate({ width:origWidth, opacity:'1.0' }, settings.slideSpeed, '', function(){ slider.trigger('sss:animDone'); });
                        }, (100 + timeBuff));
                    } else {
                        setTimeout(function(){
                            slice.animate({ width:origWidth, opacity:'1.0' }, settings.slideSpeed);
                        }, (100 + timeBuff));
                    }
                    timeBuff += 50;
                    i++;
                });
            } else if(
                vars.slideAnimation == 'fade'
                ){
                createSlices(slider, settings, vars);
                
                
                var firstSlice = $('.sss-slice:first', slider);
                firstSlice.css({
                    'height': settings.sliderHeight+'px',
                    'width': slider.width() + 'px'
                });
    
                firstSlice.animate({ opacity:'1.0' }, (settings.slideSpeed*2), '', function(){ slider.trigger('sss:animDone'); });
            } else if(
                vars.slideAnimation == 'boxRandom' ||
                vars.slideAnimation == 'boxRandomGrow'
                ){
                createBoxes(slider, settings, vars);
                
                
                var totalBoxes = settings.boxCols * settings.boxRows;
                var i = 0;
                var timeBuff = 0;
                
                var boxes = arrayRandom($('.sss-box', slider));
                boxes.each(function(){
                    var box = $(this);
                    
                    var boxHeight = box.height();
                    var boxWidth = box.width();
                    
                    if(vars.slideAnimation = 'boxRandomGrow'){
                        box.height(0).width(0);
                    } 
                    
                    if(i == totalBoxes-1){
                        setTimeout(function(){
                            box.animate({ width: boxWidth+'px', height: boxHeight+'px', opacity:'1' }, settings.slideSpeed, '', function(){ slider.trigger('sss:animDone'); });
                        }, (100 + timeBuff));
                    } else {
                        setTimeout(function(){
                            box.animate({ width: boxWidth+'px', height: boxHeight+'px', opacity:'1' }, settings.slideSpeed);
                        }, (100 + timeBuff));
                    }
                    timeBuff += 20;
                    i++;
                });
            } else if(
                vars.slideAnimation == 'boxRain2Right' ||
                vars.slideAnimation == 'boxRain2RightGrow'
                ){
                
                createBoxes(slider, settings, vars);
                
                var totalBoxes = settings.boxCols * settings.boxRows;
                var i = 0;
                var timeBuff = 0;
                
                var boxes = $('.sss-box', slider);
                
                boxes.each(function(){
                    var box = $(this);
                    var boxHeight = box.height();
                    var boxWidth = box.width();
                    
                    if(vars.slideAnimation=='boxRain2RightGrow'){ 
                        box.height(0).width(0);
                    }
                    
                    if(i == totalBoxes-1){
                        setTimeout(function(){
                            box.animate({ width: boxWidth+'px', height: boxHeight+'px', opacity:'1' }, (settings.slideSpeed*2), '', function(){ slider.trigger('sss:animDone'); });
                        }, (100 + timeBuff));
                    } else {
                        setTimeout(function(){
                            box.animate({ width: boxWidth+'px', height: boxHeight+'px', opacity:'1' }, (settings.slideSpeed*2));
                        }, (100 + timeBuff));
                    }
                    
                    timeBuff += 20;
                    i++;
                });
            } else if(
                vars.slideAnimation == 'boxRain2Left' ||
                vars.slideAnimation == 'boxRain2LeftGrow'
                ){
                
                createBoxes(slider, settings, vars);
                
                var totalBoxes = settings.boxCols * settings.boxRows;
                var i = 0;
                var timeBuff = 0;
                
                var boxes = $('.sss-box', slider)._reverse();
                
                boxes.each(function(){
                    var box = $(this);
                    var boxHeight = box.height();
                    var boxWidth = box.width();
                    
                    if(vars.slideAnimation=='boxRain2LeftGrow'){ 
                        box.height(0).width(0);
                    }
                    
                    if(i == totalBoxes-1){
                        setTimeout(function(){
                            box.animate({ width: boxWidth+'px', height: boxHeight+'px', opacity:'1' }, (settings.slideSpeed*2), '', function(){ slider.trigger('sss:animDone'); });
                        }, (100 + timeBuff));
                    } else {
                        setTimeout(function(){
                            box.animate({ width: boxWidth+'px', height: boxHeight+'px', opacity:'1' }, (settings.slideSpeed*2));
                        }, (100 + timeBuff));
                    }
                    
                    timeBuff += 20;
                    i++;
                });
            } else if(
                vars.slideAnimation == 'boxTop2Bottom' || 
                vars.slideAnimation == 'boxBottom2Top' || 
                vars.slideAnimation == 'boxTop2BottomGrow' || 
                vars.slideAnimation == 'boxBottom2TopGrow' || 
                vars.slideAnimation == 'boxTop2BottomRandom' || 
                vars.slideAnimation == 'boxTop2BottomRandomGrow' ||
                vars.slideAnimation == 'boxBottom2TopRandom' || 
                vars.slideAnimation == 'boxBottom2TopRandomGrow'
                ){
                
                createBoxes(slider, settings, vars);
                
                var totalBoxes = settings.boxCols * settings.boxRows;
                var i = 0;
                var timeBuff = 0;
                
                if(vars.slideAnimation == 'boxTop2Bottom' || vars.slideAnimation == 'boxBottom2Top' || vars.slideAnimation == 'boxTop2BottomGrow' || vars.slideAnimation == 'boxBottom2TopGrow'){
                    if(vars.slideAnimation == 'boxBottom2Top'){
                        var boxes = $('.sss-box', slider)._reverse();           
                    } else {
                        var boxes = $('.sss-box', slider);       
                    }
                } else if(vars.slideAnimation == 'boxTop2BottomRandom' || vars.slideAnimation == 'boxBottom2TopRandom' || vars.slideAnimation == 'boxTop2BottomRandomGrow' || vars.slideAnimation == 'boxBottom2TopRandomGrow'){  
                    var boxes = arrayRandom($('.sss-box', slider));       
                } else {
                    var boxes = $('.sss-box', slider);       
                }
                
                
                boxes.each(function(){
                    var box = $(this);
                    var position = box.position(); 
                    var boxHeight = box.height();
                    var boxWidth = box.width();
                      
                    if(vars.slideAnimation == 'boxTop2BottomGrow' || vars.slideAnimation == 'boxBottom2TopGrow' ||vars.slideAnimation == 'boxTop2BottomRandomGrow' ||vars.slideAnimation == 'boxBottom2TopRandomGrow') {
                        box.width(0).height(0);
                    }   
                    
                    
                    if( vars.slideAnimation == 'boxTop2Bottom' ||  vars.slideAnimation == 'boxTop2BottomGrow' ||  vars.slideAnimation == 'boxTop2BottomRandom' ||  vars.slideAnimation == 'boxTop2BottomRandomGrow'){
                        box.css('top', '0px');    
                        if(i == totalBoxes-1){
                            setTimeout(function(){
                                box.animate({ width: boxWidth+'px', height: boxHeight+'px', top:position.top+'px', opacity:'1' }, (settings.slideSpeed*3), '', function(){ slider.trigger('sss:animDone'); });
                            }, (100 + timeBuff));
                        } else {
                            setTimeout(function(){
                                box.animate({ width: boxWidth+'px', height: boxHeight+'px', top:position.top+'px', opacity:'1' }, (settings.slideSpeed*3));
                            }, (100 + timeBuff));
                        }                          
                    } else {
                        box.css('bottom', '0px');    
                        if(i == totalBoxes-1){
                            setTimeout(function(){
                                box.animate({ width: boxWidth+'px', height: boxHeight+'px', bottom:'-'+(position.top+boxHeight)+'px', opacity:'1' }, (settings.slideSpeed*3), '', function(){ slider.trigger('sss:animDone'); });
                            }, (100 + timeBuff));
                        } else {
                            setTimeout(function(){
                                box.animate({ width: boxWidth+'px', height: boxHeight+'px', bottom:'-'+(position.top+boxHeight)+'px', opacity:'1' }, (settings.slideSpeed*3));
                            }, (100 + timeBuff));
                        }                          
                    }
                    
                     
                    
                     
                    timeBuff += 20;
                    i++;
                });
            } else if( 
                vars.slideAnimation == 'boxRain' || 
                vars.slideAnimation == 'boxRainReverse' || 
                vars.slideAnimation == 'boxRainGrow' || 
                vars.slideAnimation == 'boxRainGrowReverse'
                ){
                createBoxes(slider, settings, vars);
                
                var totalBoxes = settings.boxCols * settings.boxRows;
                var i = 0;
                var timeBuff = 0;
                
                // Split boxes into 2D array
                var rowIndex = 0;
                var colIndex = 0;
                var box2Darr = new Array();
                box2Darr[rowIndex] = new Array();
                var boxes = $('.sss-box', slider);
                if(vars.slideAnimation == 'boxRainReverse' || vars.slideAnimation == 'boxRainGrowReverse'){
                    boxes = $('.sss-box', slider)._reverse();
                }
                boxes.each(function(){
                    box2Darr[rowIndex][colIndex] = $(this);
                    colIndex++;
                    if(colIndex == settings.boxCols){
                        rowIndex++;
                        colIndex = 0;
                        box2Darr[rowIndex] = new Array();
                    }
                });
                
                // Run animation
                for(var cols = 0; cols < (settings.boxCols * 2); cols++){
                    var prevCol = cols;
                    for(var rows = 0; rows < settings.boxRows; rows++){
                        if(prevCol >= 0 && prevCol < settings.boxCols){
                            (function(row, col, time, i, totalBoxes) {
                                var box = $(box2Darr[row][col]);
                                var w = box.width();
                                var h = box.height();
                                if(vars.slideAnimation == 'boxRainGrow' || vars.slideAnimation == 'boxRainGrowReverse'){
                                    box.width(0).height(0);
                                }
                                if(i == totalBoxes-1){
                                    setTimeout(function(){
                                        box.animate({ opacity:'1', width:w, height:h }, settings.slideSpeed/1.3, '', function(){ slider.trigger('sss:animDone'); });
                                    }, (100 + time));
                                } else {
                                    setTimeout(function(){
                                        box.animate({ opacity:'1', width:w, height:h }, settings.slideSpeed/1.3);
                                    }, (100 + time));
                                }
                            })(rows, prevCol, timeBuff, i, totalBoxes);
                            i++;
                        }
                        prevCol--;
                    }
                    timeBuff += 100;
                }
            } else if(                                         
                vars.slideAnimation == 'boxLeft2Right' ||
                vars.slideAnimation == 'boxRight2Left' ||
                vars.slideAnimation == 'boxLeft2RightRandom' ||
                vars.slideAnimation == 'boxRight2LeftRandom' ||
                vars.slideAnimation == 'boxLeft2RightGrow' ||
                vars.slideAnimation == 'boxRight2LeftGrow' ||
                vars.slideAnimation == 'boxLeft2RightRandomGrow' ||
                vars.slideAnimation == 'boxRight2LeftRandomGrow'
                ){
                
                createBoxes(slider, settings, vars);
                
                var totalBoxes = settings.boxCols * settings.boxRows;
                var i = 0;
                var timeBuff = 0;
                
                if(vars.slideAnimation=='boxLeft2RightRandom' || vars.slideAnimation=='boxRight2LeftRandom'){
                    var boxes = arrayRandom($('.sss-box', slider));    
                } else if(vars.slideAnimation=='boxLeft2Right'){
                    var boxes = $('.sss-box', slider);    
                } else {
                    var boxes = $('.sss-box', slider)._reverse();
                }                                               
                
                
                
                
                boxes.each(function(){
                    var box = $(this);
                    var position = box.position(); 
                    
                    var boxHeight = box.height();                      
                    var boxWidth = box.width();                      
                    
                    if(
                        vars.slideAnimation=='boxLeft2RightGrow' || 
                        vars.slideAnimation=='boxRight2LeftRandomGrow' ||
                        vars.slideAnimation=='boxRight2LeftGrow' ||
                        vars.slideAnimation=='boxLeft2RightRandomGrow'
                        ){
                        box.width(0).height(0);
                    }
                                          
                    
                    if(vars.slideAnimation=='boxLeft2Right' || vars.slideAnimation=='boxLeft2RightRandom' || vars.slideAnimation=='boxLeft2RightGrow' || vars.slideAnimation=='boxLeft2RightRandomGrow'){
                        box.css('left', '0px');
                        if(i == totalBoxes-1){
                            setTimeout(function(){
                                box.animate({ left:position.left+'px', width: boxWidth+'px', height: boxHeight+'px', opacity:'1' }, (settings.slideSpeed*2), '', function(){ slider.trigger('sss:animDone'); });
                            }, (100 + timeBuff));
                        } else {
                            setTimeout(function(){
                                box.animate({ left:position.left+'px', width: boxWidth+'px', height: boxHeight+'px', opacity:'1' }, (settings.slideSpeed*2));
                            }, (100 + timeBuff));
                        }    
                    } else {
                        box.css('right', '0px');
                        if(i == totalBoxes-1){
                            setTimeout(function(){
                                box.animate({ right:(position.left-boxWidth)+'px', width: boxWidth+'px', height: boxHeight+'px', opacity:'1' }, (settings.slideSpeed*2), '', function(){ slider.trigger('sss:animDone'); });
                            }, (100 + timeBuff));
                        } else {
                            setTimeout(function(){
                                box.animate({ right:(position.left-boxWidth)+'px', width: boxWidth+'px', height: boxHeight+'px', opacity:'1' }, (settings.slideSpeed*2));
                            }, (100 + timeBuff));
                        }
                    }
                    
                    
                    
                    timeBuff += 20;
                    i++;
                });
            } else if(
                vars.slideAnimation == 'boxRainSmall' ||
                vars.slideAnimation == 'boxRainSmallGrow'
                ){
                
               
                settings.boxCols = 16;
                settings.boxRows = 8;
                
                createBoxes(slider, settings, vars);
                
                var totalBoxes = settings.boxCols * settings.boxRows;
                var i = 0;
                var timeBuff = 0;
                
                var boxes = arrayRandom($('.sss-box', slider));
                
                boxes.each(function(){
                    var box = $(this);
                    var position = box.position(); 
                    var boxHeight = box.height();
                    var boxWidth = box.width();
                    
                    if(vars.slideAnimation == 'boxRainSmallGrow'){
                        box.width(0).height(0);
                    }
                   
                   
                    if(i == totalBoxes-1){
                        setTimeout(function(){
                            box.animate({height: boxHeight+'px', width: boxWidth+'px',   opacity:'1'}, settings.slideSpeed, "easeInOutBack", function(){ slider.trigger('sss:animDone'); });    
                        }, (100 + timeBuff));
                    } else {
                        setTimeout(function(){
                            box.animate({height: boxHeight+'px', width: boxWidth+'px',   opacity:'1'}, settings.slideSpeed, "easeInOutBack");    
                        }, (100 + timeBuff));
                    }    

                    timeBuff += 20;
                    i++;
                });
            }  
            
        }//End of sssRun
        
       
        var createSlices = function(slider, settings, vars){
            for(var i = 0; i < settings.slices; i++){
                var sliceWidth = Math.round(slider.width()/settings.slices);
                
                if(i == settings.slices-1){
                    slider.append(
                        $('<div class="sss-slice"></div>').css({ 
                            left:(sliceWidth*i)+'px', 
                            width:(slider.width()-(sliceWidth*i))+'px',
                            height:'0px', 
                            opacity:'0',  
                            background: 'url("'+ vars.currentImage.attr('src') +'") no-repeat -'+ (((i * sliceWidth))) +'px 0%'
                        })
                    );
                } else {
                    slider.append(
                        $('<div class="sss-slice"></div>').css({ 
                            left:(sliceWidth*i)+'px', 
                            width:sliceWidth+'px',
                            height:'0px', 
                            opacity:'0',                
                            background: 'url("'+ vars.currentImage.attr('src') +'") no-repeat -'+ (((i * sliceWidth))) +'px 0%'
                        })
                    );
                }
            }
        }
        
        
        var createBoxes = function(slider, settings, vars){
            var boxWidth = Math.round(slider.width()/settings.boxCols);
            var boxHeight = Math.round(slider.height()/settings.boxRows);
            
            for(var rows = 0; rows < settings.boxRows; rows++){
                for(var cols = 0; cols < settings.boxCols; cols++){
                    if(cols == settings.boxCols-1){
                        slider.append(
                            $('<div class="sss-box"></div>').css({ 
                                opacity:0,
                                left:(boxWidth*cols)+'px', 
                                top:(boxHeight*rows)+'px',
                                width:(slider.width()-(boxWidth*cols))+'px',
                                height:boxHeight+'px',
                                background: 'url("'+ vars.currentImage.attr('src') +'") no-repeat -'+ (((cols * boxWidth))) +'px -'+ (((rows * boxHeight))) +'px'
                            })
                        );
                    } else {
                        slider.append(
                            $('<div class="sss-box"></div>').css({ 
                                opacity:0,
                                left:(boxWidth*cols)+'px', 
                                top:(boxHeight*rows)+'px',
                                width:boxWidth+'px',
                                height:boxHeight+'px',
                                background: 'url("'+ vars.currentImage.attr('src') +'") no-repeat -'+ (((cols * boxWidth))) +'px -'+ (((rows * boxHeight))) +'px'
                            })
                        );
                    }
                }
            }
        }
        
        
        // Randomize an array
        var arrayRandom = function(arr){
            for(var j, x, i = arr.length; i; j = parseInt(Math.random() * i), x = arr[--i], arr[i] = arr[j], arr[j] = x);
            return arr;
        }
        
        
        this.stop = function(){
            if(!$(element).data('sss:vars').stop){
                $(element).data('sss:vars').stop = true;
                printString('Stop ssSlider');
            }
        }
        
        this.start = function(){
            if($(element).data('sss:vars').stop){
                $(element).data('sss:vars').stop = false;
                printString('Start ssSlider');
            }
        }        
        
        return this;
    };
        
        
    /**
    * Options default settings when initializing the slider class
    * Ex: 
    * effect:'random',
    * slideSpeed: 500,
    * pauseTime: 2000
    * */    
    $.fn.ssSlider = function(options) {
        return this.each(function(key, value){
           
            //each slider id
            //If single slider id provided then element is that single id div html element
            var element = $(this);
             
            if (element.data('ssslider')) return element.data('ssslider');
            
            //Initiating ssSlider class                                                                                                                                                     
            var ssslider = new ssSlider(this, options);
            
            // Store plugin object in this element's data
            element.data('ssslider', ssslider);
                                                                       
            
            
        });

    };
    
    
    
    //Default settings
    $.fn.ssSlider.defaults = {
        effect: 'random',
        slices: 15,
        boxCols: 8,
        boxRows: 4,
        slideSpeed: 500,
        pauseTime: 5000,
        largeNavArrow: true,
        largeNavArrowDefaultHidden: true,
        
        pauseOnHover: true,
        manualAdvance: false,
        prevText: 'Prev',
        nextText: 'Next',
        keyboardNav: true,
        
        
        
        controlNav: true,
        controlNavThumbs: true,
        controlNavThumbsWidth: 60,
        controlNavThumbsHeight: 60,
        controlNavThumbsSearch: '.jpg',
        controlNavThumbsReplace: '_thumb.jpg',
        
        
        
        captionOpacity: 0.8,
        
        
        defaultEffects: new Array(
                    
                    'sliceDownRight',
                    'sliceDownLeft',
                    'sliceDownRandom',
                    
                    'sliceUpRight',
                    'sliceUpLeft',
                    'sliceUpRandom',
                    
                    'sliceUpDownRight',
                    'sliceUpDownLeft',
                    'sliceUpDownRandom',
                    
                    'slide2Right',
                    'slide2Left',  
                    
                    'slice2Right',
                    'slice2Left'
                      
        ),
        beforeChange: function(){},
        afterChange: function(){},
        slideshowEnd: function(){},
        lastSlide: function(){},
        afterLoad: function(){}
    };                                  
    
    
    $.fn.ssSlider.defaultEffects = {      
    
        defaultEffects : new Array(
                    
                    'sliceDownRight',
                    'sliceDownLeft',
                    'sliceDownRandom',
                    
                    'sliceUpRight',
                    'sliceUpLeft',
                    'sliceUpRandom',
                    
                    'sliceUpDownRight',
                    'sliceUpDownLeft',
                    'sliceUpDownRandom',
                    
                    'slide2Right',
                    'slide2Left',  
                    
                    'slice2Right',
                    'slice2Left',
                    'fade',
                    
                    'boxRandom',
                    'boxRandomGrow',
                                      
                    'boxRain2Right',
                    'boxRain2RightGrow',
                    
                    'boxRain2Left',
                    'boxRain2LeftGrow',
                    
                    
                    'boxTop2Bottom',
                    'boxTop2BottomGrow',
                    'boxTop2BottomRandom',
                    'boxTop2BottomRandomGrow', 
                    'boxBottom2Top',
                    'boxBottom2TopGrow',
                    'boxBottom2TopRandom',
                    'boxBottom2TopRandomGrow',
                    
                    'boxRain',
                    'boxRainReverse',
                    'boxRainGrow',
                    'boxRainGrowReverse',
                    
                    
                    'boxLeft2Right',
                    'boxLeft2RightRandom',
                    'boxLeft2RightGrow',
                    'boxLeft2RightRandomGrow',
                    'boxRight2Left',
                    'boxRight2LeftRandom',
                    'boxRight2LeftGrow',
                    'boxRight2LeftRandomGrow'
                    
                    /*'boxRainSmall',
                    'boxRainSmallGrow'*/
        )
    };
    
    
    $.fn._reverse = [].reverse;       
    
    
})(jQuery);
