 /*
 * Fallr v1.2 - jQuery Plugin
 * Simple & elegant modal box jQuery plugin
 *
 * Copyright 2011 amatyr4n
 * http://codecanyon.net/user/amatyr4n
 *
 * licensed under Envato licenses
 * http://wiki.envato.com/support/legal-terms/licensing-terms/
 *
 * Any suggestions, bug report, or whatever feedback are welcome :)
 */

;(function($){var defaults={buttons:{button1:{text:'OK',danger:false,onclick:function(){$.fallr('hide');}}},icon:'check',content:'Hello',position:'top',closeKey:false,closeOverlay:false,useOverlay:true,autoclose:false,easingDuration:300,easingIn:'swing',easingOut:'swing',height:'auto',width:'360px',zIndex:100},opts,timeoutId,$w=$(window),methods={hide:function(options,callback,self){if(methods.isActive()){$('#fallr-wrapper').stop(true,true);var $f=$('#fallr-wrapper'),pos=$f.css('position'),yminpos=0;switch(opts.position){case'bottom':case'center':yminpos=((pos==='fixed')?$w.height():$f.offset().top+$f.height())+10;break;default:yminpos=((pos==='fixed')?(-1)*($f.outerHeight()):$f.offset().top)-10;};$f.animate({'top':(yminpos)},(opts.easingDuration||opts.duration),opts.easingOut,function(){if($.browser.msie){$('#fallr-overlay').css('display','none');}else{$('#fallr-overlay').fadeOut('fast');};$f.remove();clearTimeout(timeoutId);if(typeof callback==="function"){callback.call(self);}});$(document).unbind('keydown',helpers.enterKeyHandler).unbind('keydown',helpers.closeKeyHandler).unbind('keydown',helpers.tabKeyHandler);}},resize:function(options,callback,self){var $f=$('#fallr-wrapper'),newWidth=parseInt(options.width,10),newHeight=parseInt(options.height,10),diffWidth=Math.abs($f.outerWidth()-newWidth),diffHeight=Math.abs($f.outerHeight()-newHeight);if(methods.isActive()&&(diffWidth>5||diffHeight>5)){$f.animate({'width':newWidth},function(){$(this).animate({'height':newHeight},function(){helpers.fixPos();});});$('#fallr').animate({'width':newWidth-94},function(){$(this).animate({'height':newHeight-131},function(){if(typeof callback==="function"){callback.call(self);}});});}},show:function(options,callback,self){if(methods.isActive()){$.error('Can\'t create new message with content: "'+options.content+'", past message with content "'+opts.content+'" is still active');}else{opts=$.extend({},defaults,options);$('<div id="fallr-wrapper"></div>').appendTo('body');var $f=$('#fallr-wrapper'),$o=$('#fallr-overlay');$f.css({'width':opts.width,'height':opts.height,'position':'absolute','top':'-9999px','left':'-9999px'}).html('<div id="fallr-icon"></div>'+'<div id="fallr"></div>'+'<div id="fallr-buttons"></div>').find('#fallr-icon').addClass('icon-'+opts.icon).end().find('#fallr').html(opts.content).css({'height':(opts.height=='auto')?'auto':$f.height()-131,'width':$f.width()-94}).end().find('#fallr-buttons').html((function(){var buttons='';var i;for(i in opts.buttons){if(opts.buttons.hasOwnProperty(i)){buttons=buttons+'<a href="#" class="fallr-button '+(opts.buttons[i].danger?'fallr-button-danger':'')+'" id="fallr-button-'+i+'">'+opts.buttons[i].text+'</a>';}};return buttons;}())).find('.fallr-button').bind('click',function(){var buttonId=$(this).attr('id').substring(13);if(typeof opts.buttons[buttonId].onclick==='function'&&opts.buttons[buttonId].onclick!=false){var scope=document.getElementById('fallr');opts.buttons[buttonId].onclick.apply(scope);}else{methods.hide();};return false;});var showFallr=function(){$f.show();var xpos=($w.width()-$f.outerWidth())/2+$w.scrollLeft(),yminpos,ymaxpos,pos=($w.height()>$f.height()&&$w.width()>$f.width())?'fixed':'absolute';switch(opts.position){case'bottom':yminpos=(pos==='fixed')?$w.height():$w.scrollTop()+$w.height();ymaxpos=yminpos-$f.outerHeight();break;case'center':yminpos=(pos==='fixed')?(-1)*$f.outerHeight():$o.offset().top-$f.outerHeight();ymaxpos=yminpos+$f.outerHeight()+(($w.height()-$f.outerHeight())/2);break;default:ymaxpos=(pos==='fixed')?0:$w.scrollTop();yminpos=ymaxpos-$f.outerHeight();};$f.css({'left':xpos,'position':pos,'top':yminpos,'z-index':opts.zIndex+1}).animate({'top':ymaxpos},opts.easingDuration,opts.easingIn,function(){if(typeof callback==="function"){callback.call(self);};if(opts.autoclose){timeoutId=setTimeout(methods.hide,opts.autoclose);}});};if(opts.useOverlay){if($.browser.msie&&$.browser.version<9){$o.css({'display':'block','z-index':opts.zIndex});showFallr();}else{$o.css({'z-index':opts.zIndex}).fadeIn(showFallr);}}else{showFallr();};$(document).bind('keydown',helpers.enterKeyHandler).bind('keydown',helpers.closeKeyHandler).bind('keydown',helpers.tabKeyHandler);$('#fallr-buttons').children().eq(-1).bind('focus',function(){$(this).bind('keydown',helpers.tabKeyHandler);});$f.find(':input').bind('keydown',function(e){helpers.unbindKeyHandler();if(e.keyCode===13){console.log(1);$('.fallr-button').eq(0).trigger('click');}});}},set:function(options,callback,self){for(var i in options){if(defaults.hasOwnProperty(i)){defaults[i]=options[i];if(opts&&opts[i]){opts[i]=options[i];}}};if(typeof callback==="function"){callback.call(self);}},isActive:function(){return!!($('#fallr-wrapper').length>0);},blink:function(){$('#fallr-wrapper').fadeOut(100,function(){$(this).fadeIn(100);});},shake:function(){$('#fallr-wrapper').stop(true,true).animate({'left':'+=20px'},50,function(){$(this).animate({'left':'-=40px'},50,function(){$(this).animate({'left':'+=30px'},50,function(){$(this).animate({'left':'-=20px'},50,function(){$(this).animate({'left':'+=10px'},50);});});});});},},helpers={fixPos:function(){var $f=$('#fallr-wrapper'),pos=$f.css('position');if($w.width()>$f.outerWidth()&&$w.height()>$f.outerHeight()){var newLeft=($w.width()-$f.outerWidth())/2,newTop=$w.height()-$f.outerHeight();switch(opts.position){case'center':newTop=newTop/2;break;case'bottom':break;default:newTop=0;};if(pos=='fixed'){$f.animate({'left':newLeft},function(){$(this).animate({'top':newTop});});}else{$f.css({'position':'fixed','left':newLeft,'top':newTop});}}else{var newLeft=($w.width()-$f.outerWidth())/2+$w.scrollLeft();var newTop=$w.scrollTop();if(pos!='fixed'){$f.animate({'left':newLeft},function(){$(this).animate({'top':newTop});});}else{$f.css({'position':'absolute','top':newTop,'left':(newLeft>0?newLeft:0)});}}},enterKeyHandler:function(e){if(e.keyCode===13){$('#fallr-buttons').children().eq(0).focus();helpers.unbindKeyHandler();}},tabKeyHandler:function(e){if(e.keyCode===9){$('#fallr-wrapper').find(':input, .fallr-button').eq(0).focus();helpers.unbindKeyHandler();e.preventDefault();}},closeKeyHandler:function(e){if(e.keyCode===27&&opts.closeKey){methods.hide();}},unbindKeyHandler:function(){$(document).unbind('keydown',helpers.enterKeyHandler).unbind('keydown',helpers.tabKeyHandler);}};$(document).ready(function(){$('body').append('<div id="fallr-overlay"></div>');$('#fallr-overlay').bind('click',function(){if(opts.closeOverlay){methods.hide();}else{methods.blink();}});});$(window).resize(function(){if(methods.isActive()){helpers.fixPos();}});$.fallr=function(method,options,callback){var self=window;if(typeof method==='object'){options=method;method='show';};if(methods[method]){if(typeof options==='function'){callback=options;options=null;};methods[method](options,callback,self);}else{$.error('Method "'+method+'" does not exist in $.fallr');}};}(jQuery));

/* clickMenu - v0.1.6
 * Copyright (c) 2007 Roman Weich
 * http://p.sohei.org
 *
 * Changelog: 
 * v 0.1.6 - 2007-09-06
 *  -fix: having a link in the top-level menu would not open the menu but call the link instead
 * v 0.1.5 - 2007-07-07
 *  -change/fix: menu opening/closing now through simple show() and hide() calls - before fadeIn and fadeOut were used for which extra functions to stop a already running animation were created -> they were 
 *      buggy (not working with the interface plugin in jquery1.1.2 and not working with jquery1.1.3 at all) and now removed
 *  -change: removed option: fadeTime
 *  -change: now using the bgiframe plugin for adding iframes in ie6 when available
 * v 0.1.4 - 2007-03-20
 *  -fix: the default options were overwritten by the context related options
 *  -fix: hiding a submenu all hover- and click-events were unbound, even the ones not defined in this plugin - unbinding should work now
 * v 0.1.3 - 2007-03-13
 *  -fix: some display problems ie had when no width was set on the submenu, so on ie the width for each submenu will be explicitely set
 *  -fix: the fix to the ie-width-problem is a fix to the "ie does not support css min-width stuff" problem too which displayed some submenus too narrow (it looked just not right)
 *  -fix: some bugs, when user the was too fast with the mouse
 * v 0.1.2 - 2007-03-11
 *  -change: made a lot changes in the traversing routines to speed things up (having better memory usage now as well)
 *  -change: added $.fn.clickMenu.setDefaults() for setting global defaults
 *  -fix: hoverbug when a main menu item had no submenu
 *  -fix: some bugs i found while rewriting most of the stuff
 * v 0.1.1 - 2007-03-04
 *  -change: the width of the submenus is no longer fixed, its set in the plugin now
 *  -change: the submenu-arrow is now an img, not the background-img of the list element - that allows better positioning, and background-changes on hover (you have to set the image through the arrowSrc option)
 *  -fix: clicking on a clickMenu while another was already open, didn't close the open one
 *  -change: clicking on the open main menu item will close it
 *  -fix: on an open menu moving the mouse to a main menu item and moving it fastly elsewere hid the whole menu
 * v 0.1.0 - 2007-03-03
 */

(function($)
{
  var defaults = {
    onClick: function(){
      $(this).find('>a').each(function(){
        // if ( this.href )
        // {
        //   window.location = this.href;
        // }
      });
    },
    arrowSrc: '',
    subDelay: 300,
    mainDelay: 10
  };

  $.fn.clickMenu = function(options) 
  {
    var shown = false;
    var liOffset = ( ($.browser.msie) ? 4 : 2 );

    var settings = $.extend({}, defaults, options);

    var hideDIV = function(div, delay)
    {
      //a timer running to show the div?
      if ( div.timer && !div.isVisible )
      {
        clearTimeout(div.timer);
      }
      else if (div.timer)
      {
        return; //hide-timer already running
      }
      if ( div.isVisible )
      {
        div.timer = setTimeout(function()
        {
          //remove events
          $(getAllChilds(getOneChild(div, 'UL'), 'LI')).unbind('mouseover', liHoverIn).unbind('mouseout', liHoverOut).unbind('click', settings.onClick);
          //hide it
          $(div).hide();
          div.isVisible = false;
          div.timer = null;
        }, delay);
      }
    };

    var showDIV = function(div, delay)
    {
      if ( div.timer )
      {
        clearTimeout(div.timer);
      }
      if ( !div.isVisible )
      {
        div.timer = setTimeout(function()
        {
          //check if the mouse is still over the parent item - if not dont show the submenu
          if ( !checkClass(div.parentNode, 'hover') )
          {
            return;
          }
          //assign events to all div>ul>li-elements
          $(getAllChilds(getOneChild(div, 'UL'), 'LI')).mouseover(liHoverIn).mouseout(liHoverOut).click(settings.onClick);
          //positioning
          if ( !checkClass(div.parentNode, 'main') )
          {
            // $(div).css('left', div.parentNode.offsetWidth - liOffset);
          }
          //show it
          div.isVisible = true; //we use this over :visible to speed up traversing
          $(div).show();
          if ( $.browser.msie ) //fixing a display-bug in ie6 and adding min-width
          {
            var cW = $(getOneChild(div, 'UL')).width();
            if ( cW < 100 )
            {
              cW = 100;
            }
            $(div).css('width', cW);
          }
          div.timer = null;
        }, delay);
      }
    };

    //same as hover.handlehover in jquery - just can't use hover() directly - need the ability to unbind only the one hover event
    var testHandleHover = function(e)
    {
      // Check if mouse(over|out) are still within the same parent element
      var p = (e.type == "mouseover" ? e.fromElement : e.toElement) || e.relatedTarget;
      // Traverse up the tree
      while ( p && p != this )
      {
        try
        { 
          p = p.parentNode;
        }
        catch(e)
        { 
          p = this;
        }
      }
      // If we actually just moused on to a sub-element, ignore it
      if ( p == this )
      {
        return false;
      }
      return true;
    };
    
    var mainHoverIn = function(e)
    {
      //no need to test e.target==this, as no child has the same event binded
      //its possible, that a main menu item still has hover (if it has no submenu) - thus remove it
      var lis = getAllChilds(this.parentNode, 'LI');
      var pattern = new RegExp("(^|\\s)hover(\\s|$)");
      for (var i = 0; i < lis.length; i++)
      {
        if ( pattern.test(lis[i].className) )
        {
          $(lis[i]).removeClass('hover');
        }
      }
      $(this).addClass('hover');
      if ( shown )
      {
        hoverIn(this, settings.mainDelay);
      }
    };

    var liHoverIn = function(e)
    {
      if ( !testHandleHover(e) )
      {
        return false;
      }
      if ( e.target != this )
      {
        //look whether the target is a direct child of this (maybe an image)
        if ( !isChild(this, e.target) )
        {
          return;
        }
      }
      hoverIn(this, settings.subDelay);
    };

    var hoverIn = function(li, delay)
    {
      var innerDiv = getOneChild(li, 'DIV');
      //stop running timers from the other menus on the same level - a little faster than $('>*>div', li.parentNode)
      var n = li.parentNode.firstChild;
      for ( ; n; n = n.nextSibling ) 
      {
        if ( n.nodeType == 1 && n.nodeName.toUpperCase() == 'LI' )
        {
          var div = getOneChild(n, 'DIV');
          if ( div && div.timer && !div.isVisible ) //clear show-div timer
          {
            clearTimeout(div.timer);
            div.timer = null;
          }
        }
      }
      //is there a timer running to hide one of the parent divs? stop it
      var pNode = li.parentNode;
      for ( ; pNode; pNode = pNode.parentNode ) 
      {
        if ( pNode.nodeType == 1 && pNode.nodeName.toUpperCase() == 'DIV' )
        {
          if (pNode.timer)
          {
            clearTimeout(pNode.timer);
            pNode.timer = null;
            $(pNode.parentNode).addClass('hover');
          }
        }
      }
      //highlight the current element
      $(li).addClass('hover');
      //is the submenu already visible?
      if ( innerDiv && innerDiv.isVisible )
      {
        //hide-timer running?
        if ( innerDiv.timer )
        {
          clearTimeout(innerDiv.timer);
          innerDiv.timer = null;
        }
        else
        {
          return;
        }
      }
      //hide all open menus on the same level and below and unhighlight the li item (but not the current submenu!)
      $(li.parentNode.getElementsByTagName('DIV')).each(function(){
        if ( this != innerDiv && this.isVisible )
        {
          hideDIV(this, delay);
          $(this.parentNode).removeClass('hover');
        }
      });
      //show the submenu, if there is one
      if ( innerDiv )
      {
        showDIV(innerDiv, delay);
      }
    };

    var liHoverOut = function(e)
    {
      if ( !testHandleHover(e) )
      {
        return false;
      }
      if ( e.target != this )
      {
        if ( !isChild(this, e.target) ) //return only if the target is no direct child of this
        {
          return;
        }
      }
      //remove the hover from the submenu item, if the mouse is hovering out of the menu (this is only for the last open (levelwise) (sub-)menu)
      var div = getOneChild(this, 'DIV');
      if ( !div )
      {
        $(this).removeClass('hover');
      }
      else 
      {
        if ( !div.isVisible )
        {
          $(this).removeClass('hover');
        }
      }
    };

    var mainHoverOut = function(e)
    {
      //no need to test e.target==this, as no child has the same event binded
      //remove hover
      var div = getOneChild(this, 'DIV');
      var relTarget = e.relatedTarget || e.toElement; //this is undefined sometimes (e.g. when the mouse moves out of the window), so dont remove hover then
      var p;
      if ( !shown )
      {
        $(this).removeClass('hover');
      }
      else if ( !div && relTarget ) //menuitem has no submenu, so dont remove the hover if the mouse goes outside the menu
      {
        p = findParentWithClass(e.target, 'UL', 'clickMenu');
        if ( p.contains(relTarget))
        {
          $(this).removeClass('hover');
        }
      }
      else if ( relTarget )
      {
        //remove hover only when moving to anywhere inside the clickmenu
        p = findParentWithClass(e.target, 'UL', 'clickMenu');
        if ( !div.isVisible && (p.contains(relTarget)) )
        {
          $(this).removeClass('hover');
        }
      }
    };

    var mainClick = function()
    {
      var div = getOneChild(this, 'DIV');
      if ( div && div.isVisible ) //clicked on an open main-menu-item
      {
        clean();
        $(this).addClass('hover');
      }
      else
      {
        hoverIn(this, settings.mainDelay);
        shown = true;
        $(document).bind('mousedown', checkMouse);
      }
      // return false;
    };

    var checkMouse = function(e)
    {
      //is the mouse inside a clickmenu? if yes, is it an open (the current) one?
      var vis = false;
      var cm = findParentWithClass(e.target, 'UL', 'clickMenu');
      if ( cm )
      {
        $(cm.getElementsByTagName('DIV')).each(function(){
          if ( this.isVisible )
          {
            vis = true;
          }
        });
      }
      if ( !vis )
      {
        clean();
      }
    };

    var clean = function()
    {
      //remove timeout and hide the divs
      $('ul.clickMenu div.outerbox').each(function(){
        if ( this.timer )
        {
          clearTimeout(this.timer);
          this.timer = null;
        }
        if ( this.isVisible )
        {
          $(this).hide();
          this.isVisible = false;
        }
      });
      $('ul.clickMenu li').removeClass('hover');
      //remove events
      $('ul.clickMenu>li li').unbind('mouseover', liHoverIn).unbind('mouseout', liHoverOut).unbind('click', settings.onClick);
      $(document).unbind('mousedown', checkMouse);
      shown = false;
    };

    var getOneChild = function(elem, name)
    {
      if ( !elem )
      {
        return null;
      }
      var n = elem.firstChild;
      for ( ; n; n = n.nextSibling ) 
      {
        if ( n.nodeType == 1 && n.nodeName.toUpperCase() == name )
        {
          return n;
        }
      }
      return null;
    };

    var getAllChilds = function(elem, name)
    {
      if ( !elem )
      {
        return [];
      }
      var r = [];
      var n = elem.firstChild;
      for ( ; n; n = n.nextSibling ) 
      {
        if ( n.nodeType == 1 && n.nodeName.toUpperCase() == name )
        {
          r[r.length] = n;
        }
      }
      return r;
    };

    var findParentWithClass = function(elem, searchTag, searchClass)
    {
      var pNode = elem.parentNode;
      var pattern = new RegExp("(^|\\s)" + searchClass + "(\\s|$)");
      for ( ; pNode; pNode = pNode.parentNode )
      {
        if ( pNode.nodeType == 1 && pNode.nodeName.toUpperCase() == searchTag && pattern.test(pNode.className) )
        {
          return pNode;
        }
      }
      return null;
    };
    
    var checkClass = function(elem, searchClass)
    {
      var pattern = new RegExp("(^|\\s)" + searchClass + "(\\s|$)");
      if ( pattern.test(elem.className) )
      {
        return true;
      }
      return false;
    };
    
    var isChild = function(elem, childElem)
    {
      var n = elem.firstChild;
      for ( ; n; n = n.nextSibling ) 
      {
        if ( n == childElem )
        {
          return true;
        }
      }
      return false;
    };

      return this.each(function()
    {
      //add .contains() to mozilla - http://www.quirksmode.org/blog/archives/2006/01/contains_for_mo.html
      if (window.Node && Node.prototype && !Node.prototype.contains)
      {
        Node.prototype.contains = function(arg) 
        {
          return !!(this.compareDocumentPosition(arg) & 16);
        };
      }
      //add class
      if ( !checkClass(this, 'clickMenu') )
      {
        $(this).addClass('clickMenu');
      }
      //add shadows
      $('ul', this).shadowBox();
      //ie6? - add iframes
      if ( $.browser.msie && (!$.browser.version || parseInt($.browser.version) <= 6) )
      {
        if ( $.fn.bgiframe )
        {
          $('div.outerbox', this).bgiframe();
        }
        else
        {
          /* thanks to Mark Gibson - http://www.nabble.com/forum/ViewPost.jtp?post=6504414&framed=y */
          $('div.outerbox', this).append('<iframe style="display:block;position:absolute;top:0;left:0;z-index:-1;filter:mask();' + 
                  'width:expression(this.parentNode.offsetWidth);height:expression(this.parentNode.offsetHeight)"/>');
        }
      }
      //assign events
      $(this).bind('closemenu', function(){clean();}); //assign closemenu-event, through wich the menu can be closed from outside the plugin
      //add click event handling, if there are any elements inside the main menu
      var liElems = getAllChilds(this, 'LI');
      for ( var j = 0; j < liElems.length; j++ )
      {
        if ( getOneChild(getOneChild(getOneChild(liElems[j], 'DIV'), 'UL'), 'LI') ) // >div>ul>li
        {
          $(liElems[j]).click(mainClick);
        }
      }
      //add hover event handling and assign classes
      $(liElems).hover(mainHoverIn, mainHoverOut).addClass('main').find('>div').addClass('inner');
      //add the little arrow before each submenu
      if ( settings.arrowSrc )
      {
        $('div.inner div.outerbox', this).before('<img src="' + settings.arrowSrc + '" class="liArrow" />');
      }

      //the floating list elements are destroying the layout..so make it nice again..
      $(this).wrap('<div class="cmDiv"></div>').after('<div style="clear: both; visibility: hidden;"></div>');
      });
  };
  $.fn.clickMenu.setDefaults = function(o)
  {
    $.extend(defaults, o);
  };
})(jQuery);

(function($)
{
  $.fn.shadowBox = function() {
      return this.each(function()
    {
      var outer = $('<div class="outerbox"></div>').get(0);
      if ( $(this).css('position') == 'absolute' )
      {
        //if the child(this) is positioned abolute, we have to use relative positioning and shrink the outerbox accordingly to the innerbox
        $(outer).css({position:'relative', width:this.offsetWidth, height:this.offsetHeight});
      }
      else
      {
        //shrink the outerbox
        $(outer).css('position', 'absolute');
      }
      //add the boxes
      $(this).addClass('innerBox').wrap(outer).
          before('<div class="shadowbox1"></div><div class="shadowbox2"></div><div class="shadowbox3"></div>');
      });
  };
})(jQuery);
/*
 * jQuery ctRotator Plugin
 * Examples and documentation at: http://thecodecentral.com/2011/08/15/ctnotify-a-flexible-multi-instance-jquery-notification-script
 * Under MIT license http://www.opensource.org/licenses/mit-license.php
 *
 * @author: Cuong Tham
 * @version: 1.0
 * @requires jQuery v1.2.6 or later
 *
 * @headsTip: A queued notification script based on jQuery. Supports multiple instances. Highly configurable.
 */


(function($) {



  var defaultInstanceId = 'default';
  var defaultType = 'message';
  var instData = {};



  
  $.extend({
    ctNotifyOption:function(options, instId){
      createInstnace(options, instId);
     
    },
    ctNotify:function(html, type, instId){
      

      var inst = getInstance(instId);

      addItem(html, type, instId);

      if(!inst.inTimeout){
        removeItem(instId);
      }
    }
  });

  function getInstanceIdFallback(instId){
    if(instId == null){
      return defaultInstanceId;
    }else{
      return instId;
    }
  }

  function getInstance(instId){
    instId = getInstanceIdFallback(instId);

    var inst;
    if(instData[instId] != null){
      inst = instData[instId];
    }else{
      inst = createInstnace(null, instId);
   
    }
  
 
    return inst;
  }

  function createInstnace(options, instId){
    instId = getInstanceIdFallback(instId);
    var inst = initialize(options, instId);
    return inst;
  }


  function getOptions(instId){
    return getInstance(instId).options;
  }
  

  function initialize(options, instId){
    var inst;

    if(instData[instId] && instData[instId].isInitialized){
      inst = instData[instId];
    }else{
      inst = {
        id: instId,
        con:null,
        parentCon: null,
        inTimeout: false,
        isInitialized: false,
        timerId: null,
        stickyItemCount: 0
      };
    
    }
    


    var opts = {
      delay: 3000,
      id: 'ctNotify_' + instId,
      className: 'ctNotify',
      animated: true,
      animateSpeed: 500,
      animateType: "slideUp",
      appendTo: null,
      sticky: false,
      autoWidth: 'fitWindow', //fit,fitWindow, disabled
      width: null, //if autoWidth is set to other than disabled, this option is not used
      opacity: .7,
      position: "fixed",
      bodyIdSuffix: '_body_', //the element ID which contains the notificationc children
      bodyClassName: 'ctNotify_body',
      anchors: {
        top:0,
        left: 0,
        bottom: null,
        right: null
      }, //top, left, bottom, right
      containerRender: null,
      itemRender: null
    };
    
    options = $.extend({}, opts, options);


    options.bodyId = opts.id + opts.bodyIdSuffix;

    
    if(options.appendTo == null){
      options.appendTo = $(document.body);
    }
    
    if(options.autoWidth != 'fit' && options.autoWidth != 'fitWindow'){
      options.autoWidth = 'disabled';
    }
    
    
    if(options.width != null){
      options.autoWidth = 'disabled';
    }
    



    inst.options = options;
    
    
 
    initContainer(inst);
    initItemRender(inst);
 
    inst.con = inst.options.containerRender(inst);
    inst.body = inst.con.find('#' + inst.options.bodyId);
    inst.parentCon = inst.options.appendTo;


    

    inst.con.bind('click', inst, function(e){
      if(e.data.inTimeout){
        clearTimeout(e.data.timerId);
        inst.inTimeout = false;
      }

      e.data.body.empty();
      $(this).hide();
      inst.stickyItemCount = 0;
    });


    if(inst.parentCon.size() == 0){
      throw ('Parent container ' + opt.appendTo + ' no found.');
    }

    inst.con.appendTo(inst.parentCon);



    if(inst.options.autoWidth != 'disabled'){
      $(window).resize(function(){
        fixWidth(inst); 
      });
    }


    inst.isInitialized = true;
    instData[instId] = inst;


 
    return inst;
    
  }
  
  
  function initContainer(inst){
    if(inst.options.containerRender != null){
      return;
    }
      
    inst.options.containerRender = function(inst){
      var options = inst.options;
      var conWrapper = $('<div></div>').attr({
        id:  options.id,
        title: 'click to close'
      })
      .css({
        opacity: options.opacity,
        position: options.position,
        top: options.anchors.top,
        bottom: options.anchors.bottom,
        left: options.anchors.left,
        right: options.anchors.right
      })
      .addClass(options.className)
      .hide();


      var con = $('<ul></ul>').attr({
        id: options.id + options.bodyIdSuffix
      })
      .addClass(options.bodyClassName);
      

      

      conWrapper.append(con);

      return conWrapper;
    };
    

  }
  
  function initItemRender(inst){
    if(inst.options.itemRender != null){
      return;
    }
      
    inst.options.itemRender = function(html, itemOptions, inst){
      var   span = $('<span></span>') ;
      if(itemOptions.isSticky){
        span.addClass('sticky');
      }
      span.html(html);
      return $('<li></li>').append(span);
    };
  }
    
    
  function addItem(html, type, instId){
    var inst = getInstance(instId);
    
    
    
    var options;
    if($.isPlainObject(type)){
      options = type;
    }else{
      options = {};
      options.type = type;
    }
    
    options = $.extend({
      type: defaultType,
      isSticky: inst.options.sticky,
      delay: inst.options.delay
    }, options);
    
    
    inst.con.show();
    var item = inst.options.itemRender(html, options, inst);
    item.addClass(options.type);
    inst.body.append(item);

    $(item).data('ct_delay', options.delay);
    
    if(options.isSticky){
      inst.stickyItemCount++;
      $(item).data('ct_isSticky', true);
    }

      
    fixWidth(inst);
      
   
  }

  function fixWidth(inst){
    var con = inst.con;
    
   
    if(inst.options.autoWidth == 'disabled'){
      
      if(inst.options.width != null){
        inst.con.width(inst.options.width);
      }
    }else if(inst.options.autoWidth == 'fit'){
      con.width(inst.options.appendTo.width() - (con.outerWidth() -  con.width()));
      

    }else if(inst.options.autoWidth == 'fitWindow'){
      con.width($(window).width() - (con.outerWidth() - con.width()));
    }
    
  }



  function removeItem(instId){
    
    var inst = getInstance(instId);
    var con = inst.con;
    var body = inst.body;
    var opt = inst.options;
    
    if(con == null){
      return;
    }

    var size = Math.max(body.children().size() - inst.stickyItemCount, 0);
    
   
    
    if(size == 0){
      inst.inTimeout = false;
      inst.timerId = null;
      if(body.children().size() == 0){
        con.hide();
      }else{
          
      }
      
      return;
    }else if(size > 0){
      inst.inTimeout = true;
      getInstance(instId).inTimeout = true;


      var firstRemovable = getRemovableItem(instId);
        
      if(firstRemovable != null){
        inst.timeerId = setTimeout(function(){
       
          if(opt.animated){
            firstRemovable[opt.animateType](opt.animateSpeed, function(){
              doRemoveItem(instId, firstRemovable);
            });
          }else{
            doRemoveItem(instId, firstRemovable);
          }
        

        }, firstRemovable.data('ct_delay'));
      }
    }
  }
  

  function getRemovableItem(instId){
    var inst = getInstance(instId);
    var children = inst.body.children();
    
    for(var i=0; i< children.size(); i++){
      if( $(children[i]).data('ct_isSticky') != true){
        return $(children[i]);
      }
    }
    
    return null;
  
  }

  function doRemoveItem(instId, item){
    item.remove();
    removeItem(instId);
  }
 
})(jQuery);
/**
*  Ajax Autocomplete for jQuery, version 1.1.3
*  (c) 2010 Tomas Kirda
*
*  Ajax Autocomplete for jQuery is freely distributable under the terms of an MIT-style license.
*  For details, see the web site: http://www.devbridge.com/projects/autocomplete/jquery/
*
*  Last Review: 04/19/2010
*/

(function(d){function l(b,a,c){a="("+c.replace(m,"\\$1")+")";return b.replace(new RegExp(a,"gi"),"<strong>$1</strong>")}function i(b,a){this.el=d(b);this.el.attr("autocomplete","off");this.suggestions=[];this.data=[];this.badQueries=[];this.selectedIndex=-1;this.currentValue=this.el.val();this.intervalId=0;this.cachedResponse=[];this.onChangeInterval=null;this.ignoreValueChange=false;this.serviceUrl=a.serviceUrl;this.isLocal=false;this.options={autoSubmit:false,minChars:1,maxHeight:300,deferRequestBy:0, width:0,highlight:true,params:{},fnFormatResult:l,delimiter:null,zIndex:9999};this.initialize();this.setOptions(a)}var m=new RegExp("(\\/|\\.|\\*|\\+|\\?|\\||\\(|\\)|\\[|\\]|\\{|\\}|\\\\)","g");d.fn.autocomplete=function(b){return new i(this.get(0)||d("<input />"),b)};i.prototype={killerFn:null,initialize:function(){var b,a,c;b=this;a=Math.floor(Math.random()*1048576).toString(16);c="Autocomplete_"+a;this.killerFn=function(e){if(d(e.target).parents(".autocomplete").size()===0){b.killSuggestions(); b.disableKillerFn()}};if(!this.options.width)this.options.width=this.el.width();this.mainContainerId="AutocompleteContainter_"+a;d('<div id="'+this.mainContainerId+'" style="position:absolute;z-index:9999;"><div class="autocomplete-w1"><div class="autocomplete" id="'+c+'" style="display:none; width:300px;"></div></div></div>').appendTo("body");this.container=d("#"+c);this.fixPosition();window.opera?this.el.keypress(function(e){b.onKeyPress(e)}):this.el.keydown(function(e){b.onKeyPress(e)});this.el.keyup(function(e){b.onKeyUp(e)}); this.el.blur(function(){b.enableKillerFn()});this.el.focus(function(){b.fixPosition()})},setOptions:function(b){var a=this.options;d.extend(a,b);if(a.lookup){this.isLocal=true;if(d.isArray(a.lookup))a.lookup={suggestions:a.lookup,data:[]}}d("#"+this.mainContainerId).css({zIndex:a.zIndex});this.container.css({maxHeight:a.maxHeight+"px",width:a.width})},clearCache:function(){this.cachedResponse=[];this.badQueries=[]},disable:function(){this.disabled=true},enable:function(){this.disabled=false},fixPosition:function(){var b= this.el.offset();d("#"+this.mainContainerId).css({top:b.top+this.el.innerHeight()+"px",left:b.left+"px"})},enableKillerFn:function(){d(document).bind("click",this.killerFn)},disableKillerFn:function(){d(document).unbind("click",this.killerFn)},killSuggestions:function(){var b=this;this.stopKillSuggestions();this.intervalId=window.setInterval(function(){b.hide();b.stopKillSuggestions()},300)},stopKillSuggestions:function(){window.clearInterval(this.intervalId)},onKeyPress:function(b){if(!(this.disabled|| !this.enabled)){switch(b.keyCode){case 27:this.el.val(this.currentValue);this.hide();break;case 9:case 13:if(this.selectedIndex===-1){this.hide();return}this.select(this.selectedIndex);if(b.keyCode===9)return;break;case 38:this.moveUp();break;case 40:this.moveDown();break;default:return}b.stopImmediatePropagation();b.preventDefault()}},onKeyUp:function(b){if(!this.disabled){switch(b.keyCode){case 38:case 40:return}clearInterval(this.onChangeInterval);if(this.currentValue!==this.el.val())if(this.options.deferRequestBy> 0){var a=this;this.onChangeInterval=setInterval(function(){a.onValueChange()},this.options.deferRequestBy)}else this.onValueChange()}},onValueChange:function(){clearInterval(this.onChangeInterval);this.currentValue=this.el.val();var b=this.getQuery(this.currentValue);this.selectedIndex=-1;if(this.ignoreValueChange)this.ignoreValueChange=false;else b===""||b.length<this.options.minChars?this.hide():this.getSuggestions(b)},getQuery:function(b){var a;a=this.options.delimiter;if(!a)return d.trim(b);b= b.split(a);return d.trim(b[b.length-1])},getSuggestionsLocal:function(b){var a,c,e,g,f;c=this.options.lookup;e=c.suggestions.length;a={suggestions:[],data:[]};b=b.toLowerCase();for(f=0;f<e;f++){g=c.suggestions[f];if(g.toLowerCase().indexOf(b)===0){a.suggestions.push(g);a.data.push(c.data[f])}}return a},getSuggestions:function(b){var a,c;if((a=this.isLocal?this.getSuggestionsLocal(b):this.cachedResponse[b])&&d.isArray(a.suggestions)){this.suggestions=a.suggestions;this.data=a.data;this.suggest()}else if(!this.isBadQuery(b)){c= this;c.options.params.query=b;d.get(this.serviceUrl,c.options.params,function(e){c.processResponse(e)},"text")}},isBadQuery:function(b){for(var a=this.badQueries.length;a--;)if(b.indexOf(this.badQueries[a])===0)return true;return false},hide:function(){this.enabled=false;this.selectedIndex=-1;this.container.hide()},suggest:function(){if(this.suggestions.length===0)this.hide();else{var b,a,c,e,g,f,j,k;b=this;a=this.suggestions.length;e=this.options.fnFormatResult;g=this.getQuery(this.currentValue); j=function(h){return function(){b.activate(h)}};k=function(h){return function(){b.select(h)}};this.container.hide().empty();for(f=0;f<a;f++){c=this.suggestions[f];c=d((b.selectedIndex===f?'<div class="selected"':"<div")+' title="'+c+'">'+e(c,this.data[f],g)+"</div>");c.mouseover(j(f));c.click(k(f));this.container.append(c)}this.enabled=true;this.container.show()}},processResponse:function(b){var a;try{a=eval("("+b+")")}catch(c){return}if(!d.isArray(a.data))a.data=[];if(!this.options.noCache){this.cachedResponse[a.query]= a;a.suggestions.length===0&&this.badQueries.push(a.query)}if(a.query===this.getQuery(this.currentValue)){this.suggestions=a.suggestions;this.data=a.data;this.suggest()}},activate:function(b){var a,c;a=this.container.children();this.selectedIndex!==-1&&a.length>this.selectedIndex&&d(a.get(this.selectedIndex)).removeClass();this.selectedIndex=b;if(this.selectedIndex!==-1&&a.length>this.selectedIndex){c=a.get(this.selectedIndex);d(c).addClass("selected")}return c},deactivate:function(b,a){b.className= "";if(this.selectedIndex===a)this.selectedIndex=-1},select:function(b){var a;if(a=this.suggestions[b]){this.el.val(a);if(this.options.autoSubmit){a=this.el.parents("form");a.length>0&&a.get(0).submit()}this.ignoreValueChange=true;this.hide();this.onSelect(b)}},moveUp:function(){if(this.selectedIndex!==-1)if(this.selectedIndex===0){this.container.children().get(0).className="";this.selectedIndex=-1;this.el.val(this.currentValue)}else this.adjustScroll(this.selectedIndex-1)},moveDown:function(){this.selectedIndex!== this.suggestions.length-1&&this.adjustScroll(this.selectedIndex+1)},adjustScroll:function(b){var a,c,e;a=this.activate(b).offsetTop;c=this.container.scrollTop();e=c+this.options.maxHeight-25;if(a<c)this.container.scrollTop(a);else a>e&&this.container.scrollTop(a-this.options.maxHeight+25);this.el.val(this.getValue(this.suggestions[b]))},onSelect:function(b){var a,c;a=this.options.onSelect;c=this.suggestions[b];b=this.data[b];this.el.val(this.getValue(c));d.isFunction(a)&&a(c,b,this.el)},getValue:function(b){var a, c;a=this.options.delimiter;if(!a)return b;c=this.currentValue;a=c.split(a);if(a.length===1)return b;return c.substr(0,c.length-a[a.length-1].length)+b}}})(jQuery);
jQTubeUtil=function(h){function i(a,b,c){var d={"max-results":b.max||l,"start-index":b.start||u};if(b.time)d.time=b.time;a=m(a,d);return n(a,b.callback||c)}function j(a,b){switch(typeof a){case "function":return{callback:a,time:undefined};case "object":var c={max:a.max,start:a["start-index"]};if(b)c.time=a.time;return c;default:return{}}}function v(a,b){a=m(w,a);return n(a,b)}function n(a,b){var c={};h.ajax({type:"GET",dataType:"json",url:a,success:function(d){if(typeof d!="undefined"){var g=[];if(d.feed){var e=
d.feed,p=d.feed.entry;for(entry in p)g.push(new q(p[entry]));c.startIndex=e.openSearch$startIndex.$t;c.itemsPerPage=e.openSearch$itemsPerPage.$t;c.totalResults=e.openSearch$totalResults.$t}else g.push(new q(d.entry));c.version=d.version;c.searchURL=a;c.videos=g;typeof b=="function"&&b(c)}},error:function(d){throw Exception("couldn't fetch YouTube request : "+a+" : "+d);}});return c}function m(a,b){var c="?",d,g=true,e=h.extend({},b,r);for(o in e){b=o;d=e[o];c+=(g?"":"&")+b+"="+d;g=false}return a+
c}var s=function(){},f=s.prototype,l=10,u=1,w="http://gdata.youtube.com/feeds/api/videos";MostPopular="http://gdata.youtube.com/feeds/api/standardfeeds/most_popular";MostRecent="http://gdata.youtube.com/feeds/api/standardfeeds/most_recent";TopRated="http://gdata.youtube.com/feeds/api/standardfeeds/top_rated";TopFavs="http://gdata.youtube.com/feeds/api/standardfeeds/top_favorites";RecentlyFeatured="http://gdata.youtube.com/feeds/api/standardfeeds/recently_featured";SuggestURL="http://suggestqueries.google.com/complete/search";
Times=["today","this_week","this_month","all_time"];OrderBy=["relevance","published","viewCount","rating"];var k={q:"",orderby:OrderBy[2],time:Times[3],"max-results":l},r={key:"",format:5,alt:"json",callback:"?"},t={hl:"en",ds:"yt",client:"youtube",hjson:"t",cp:1};f.init=function(a){if(!a.key)throw"jQTube requires a key!";r.key=a.key;if(a.orderby)k.orderby=a.orderby;if(a.time)k.time=a.time;if(a.maxResults)k["max-results"]=l=a.maxResults;if(a.lang)t.hl=a.lang};f.getTimes=function(){return Times};f.getOrders=
function(){return OrderBy};f.suggest=function(a,b){a={q:encodeURIComponent(a)};var c=m(SuggestURL,h.extend({},t,a));h.ajax({type:"GET",dataType:"json",url:c,success:function(d){var g=[],e={};for(entry in d[1])g.push(d[1][entry][0]);e.suggestions=g;e.searchURL=c;typeof b=="function"&&b(e)}})};f.search=function(a,b){if(typeof a=="string")a={q:encodeURIComponent(a)};return v(h.extend({},k,a),b)};f.video=function(a,b){return n("http://gdata.youtube.com/feeds/api/videos/"+a+"?alt=json",b)};f.mostViewed=
function(a,b){return i("http://gdata.youtube.com/feeds/api/standardfeeds/most_viewed",j(a,true),b)};f.mostRecent=function(a,b){return i(MostRecent,j(a,false),b)};f.mostPopular=function(a,b){return i(MostPopular,j(a,true),b)};f.topRated=function(a,b){return i(TopRated,j(a,true),b)};f.topFavs=function(a,b){return i(TopFavs,j(a,true),b)};var q=function(a){var b=[],c=a.id.$t,d=c.lastIndexOf("/")+1;this.videoId=c.substring(d,c.length);this.title=a.title.$t;try{this.updated=a.updated.$t}catch(g){b.push("updated")}try{this.thumbs=
a.media$group.media$thumbnail}catch(e){b.push("thumbs")}try{this.duration=a.media$group.yt$duration.seconds}catch(p){b.push("duration")}try{this.favCount=a.yt$statistics.favoriteCount}catch(x){b.push("favCount")}try{this.viewCount=a.yt$statistics.viewCount}catch(y){b.push("viewCount")}try{this.category=a.media$group.media$category.$t}catch(z){b.push("category")}try{this.description=a.media$group.media$description.$t}catch(A){b.push("description")}try{this.keywords=a.media$group.media$keywords.$t}catch(B){b.push("keywords")}this.unavailAttributes=
b};return new s}(jQuery);

if(!this.JSON){JSON=function(){function f(n){return n<10?'0'+n:n;}
Date.prototype.toJSON=function(){return this.getUTCFullYear()+'-'+
f(this.getUTCMonth()+1)+'-'+
f(this.getUTCDate())+'T'+
f(this.getUTCHours())+':'+
f(this.getUTCMinutes())+':'+
f(this.getUTCSeconds())+'Z';};var m={'\b':'\\b','\t':'\\t','\n':'\\n','\f':'\\f','\r':'\\r','"':'\\"','\\':'\\\\'};function stringify(value,whitelist){var a,i,k,l,r=/["\\\x00-\x1f\x7f-\x9f]/g,v;switch(typeof value){case'string':return r.test(value)?'"'+value.replace(r,function(a){var c=m[a];if(c){return c;}
c=a.charCodeAt();return'\\u00'+Math.floor(c/16).toString(16)+
(c%16).toString(16);})+'"':'"'+value+'"';case'number':return isFinite(value)?String(value):'null';case'boolean':case'null':return String(value);case'object':if(!value){return'null';}
if(typeof value.toJSON==='function'){return stringify(value.toJSON());}
a=[];if(typeof value.length==='number'&&!(value.propertyIsEnumerable('length'))){l=value.length;for(i=0;i<l;i+=1){a.push(stringify(value[i],whitelist)||'null');}
return'['+a.join(',')+']';}
if(whitelist){l=whitelist.length;for(i=0;i<l;i+=1){k=whitelist[i];if(typeof k==='string'){v=stringify(value[k],whitelist);if(v){a.push(stringify(k)+':'+v);}}}}else{for(k in value){if(typeof k==='string'){v=stringify(value[k],whitelist);if(v){a.push(stringify(k)+':'+v);}}}}
return'{'+a.join(',')+'}';}}
return{stringify:stringify,parse:function(text,filter){var j;function walk(k,v){var i,n;if(v&&typeof v==='object'){for(i in v){if(Object.prototype.hasOwnProperty.apply(v,[i])){n=walk(i,v[i]);if(n!==undefined){v[i]=n;}}}}
return filter(k,v);}
if(/^[\],:{}\s]*$/.test(text.replace(/\\./g,'@').replace(/"[^"\\\n\r]*"|true|false|null|-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?/g,']').replace(/(?:^|:|,)(?:\s*\[)+/g,''))){j=eval('('+text+')');return typeof filter==='function'?walk('',j):j;}
throw new SyntaxError('parseJSON');}};}();}
$(document).ready(function(){

  if (!Modernizr.input.placeholder) {
    // regular placeholder
    $('[placeholder]').live('focus', function() {
      var input = $(this);
      if (input.val() == input.attr('placeholder')) {
        input.val('');
        input.removeClass('placeholder');
      }
    }).live('blur', function() {
      var input = $(this);
      if (input.val() == '' || input.val() == input.attr('placeholder')) {
        input.addClass('placeholder');
        input.val(input.attr('placeholder'));
      }
    });
    $('[placeholder]').parents('form').submit(function() {
      $(this).find('[placeholder]').each(function() {
      var input = $(this);
      if (input.val() == input.attr('placeholder')) {
        input.val('');
      }
      })
    })

    // password placeholder
    $(".txtPassword").live('focus', function() {
      $(this).hide()
      $('.password').show().css('display', 'block').focus()
    })
    $(".password").live('blur', function() {
      if ($(this).val() == '' || $(this).val() == $(this).attr('placeholder')) {
        $(this).hide()
        $('.txtPassword').show()
      }
    })

    $(".txtConfirmPassword").live('focus', function() {
      $(this).hide()
      $('.confirmPassword').show().focus()
    })
    $(".confirmPassword").live('blur', function() {
      if ($(this).val() == '' || $(this).val() == $(this).attr('placeholder')) {
        $(this).hide()
        $('.txtConfirmPassword').show()
      }
    })
  }
})
