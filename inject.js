var head = document.getElementsByTagName('head')[0];

// Inject into the application context from the content script context

var script = document.createElement('script');
script.type = "text/javascript";
script.src = chrome.extension.getURL('./WhybugTracker.js');
head.insertBefore(script, head.firstChild);

// Hack to detect javascript version using deprecated language attribtue.
['1.1', '1.2', '1.3', '1.4', '1.5', '1.6', '1.7', '1.8', '2.0'].forEach(function(version) {
    var script = document.createElement('script');
    script.type = "text/javascript";
    script.language = "javascript" + version;
    script.text = "var js_version='" + version + "';"; 
    head.appendChild(script);
}) ;
