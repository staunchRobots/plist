/*
*
* Facebook Integration
*
*/
window.fbAsyncInit = function() {
  var appId = '270579051603';
  if (window.location.href.match(/plist\.tv/)) {
    appId = '133998703298878';
  }

  FB.init({
    appId: appId,
    status: true,
    cookie: true,
    xfbml: true
  });
};

(function() {
	var e = document.createElement('script');
	e.type = 'text/javascript';
	e.src = document.location.protocol + '//connect.facebook.net/en_US/all.js';
	e.async = true;
	document.getElementById('fb-root').appendChild(e);
} ());
