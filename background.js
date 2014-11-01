// Copyright (c) 2014 Adrian Philipp <info@whybug.com>
/**
 * Chrome integration for whybug.
 * 
 * @type {Object}
 */
var WhybugChrome = {
  
  /**
   * Storage to use for domain .
   * 
   * @type {Object}
   */
  storage: chrome.storage.sync,

  /**
   * Updates icon for the specified tab.
   *  
   * @param {Objectl} tab Chrome tab instance.
   */
  updateIcon: function (tab) {
    this.getStatus(tab, function (enabled) {
      chrome.pageAction.setIcon({
        tabId: tab.id,
        path: "./icon" + (enabled ? 2 : 1) + ".png"
      });
      chrome.pageAction.show(tab.id);
    })
  },

  /**
   * Activates or deactivates whybug for the specified tab.
   * 
   * @param {Objectl} tab Chrome tab instance.
   */
  toggleStatus: function (tab) {
      var domain = this.getDomainFromTab(tab);
      this.storage.get(domain, function(setting) {
        console.log('toggle status', domain, setting)
        setting[domain] = !setting[domain];
        WhybugChrome.storage.set(setting, function() {
          WhybugChrome.updateIcon(tab);
        });
      });
  },

  /**
   * Returns if whybug is enabled or disabled for 
   * specified tab.
   * 
   * @param {Objectl} tab Chrome tab instance.
   * @param  {Function} callback Callback with boolean param 'enabled'.
   */
  getStatus: function (tab, callback) {
      var domain = this.getDomainFromTab(tab);
      this.storage.get(domain, function(setting) {
        console.log('status for', domain, setting[domain])
        callback(setting[domain]);
      });
  },

  /**
   * Returns the domain name for a specified tab.
   * 
   * @param {Objectl} tab Chrome tab instance.
   * @return {String}     Domain name.
   */
  getDomainFromTab: function(tab) {
    return new URL(tab.url).hostname;
  }
};

chrome.tabs.onUpdated.addListener(function(tabId, changeInfo, tab) {
    if (changeInfo.status !== 'loading') {return;}

    WhybugChrome.updateIcon(tab);
});

chrome.tabs.onCreated.addListener(function(tab) {         
    WhybugChrome.updateIcon(tab);
});

chrome.pageAction.onClicked.addListener(function(tab) {
    WhybugChrome.toggleStatus(tab);
});

// When the extension is installed or upgraded ...
chrome.runtime.onInstalled.addListener(function() {
  // Replace all rules ...
  chrome.declarativeContent.onPageChanged.removeRules(undefined, function() {
    // With a new rule ...
    chrome.declarativeContent.onPageChanged.addRules([
      {
        // That fires when a page's URL contains a 'g' ...
        conditions: [
          new chrome.declarativeContent.PageStateMatcher({
            // pageUrl: { urlContains: 'localhost' },
          })
        ],
        // And shows the extension's page action.
        actions: [ new chrome.declarativeContent.ShowPageAction() ]
      }
    ]);
  });
});

/*
Ideas:

 - Activate/deactivate per domain
 - register general javascript error handler
 - register angular/ember/... error handler
 - show red dot when solutions are found?
 -  


app.config(function($provide) {
  $provide.decorator("$exceptionHandler", ['$delegate', function($delegate) {
    return function(exception, cause) {
      _errs.push(exception);
      $delegate(exception, cause);
    }
  }])
});

(function() {
  var reportError = function(e) { _errs.push(e); };
  Ember.onerror = reportError;
  Ember.RSVP.configure('onerror', reportError);
  App.ApplicationRoute = Ember.Route.extend({actions: {error: reportError}});
})();
*/
