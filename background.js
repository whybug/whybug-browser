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

  updateTab: function (tab) {
    this.getStatus(tab, function (enabled) {
      WhybugChrome.updateIcon(tab, enabled);
      WhybugChrome.injectWhybug(tab, enabled);
    })
  },

  /**
   * Updates icon for the specified tab.
   *  
   * @param {Objectl} tab Chrome tab instance.
   */
  updateIcon: function (tab, enabled) {
    chrome.pageAction.setIcon({
      tabId: tab.id,
      path: "./icon" + (enabled ? 2 : 1) + ".png"
    });
    chrome.pageAction.setTitle({
      tabId: tab.id,
      title: enabled ? "Disable whybug for this website." : "Activate whybug for this website."
    })
    chrome.pageAction.show(tab.id);
  },

  injectWhybug: function (tab, enabled) {
    if (enabled) {
      chrome.tabs.executeScript(tab.id, {
        file: './TraceKit.js', 
        runAt: 'document_start'
      });
      chrome.tabs.executeScript(tab.id, {
        file: './WhybugTracker.js', 
        runAt: 'document_end'
      });
    }
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
          WhybugChrome.updateTab(tab);
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
        callback(setting[domain] || false);
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
    if (changeInfo.status !== 'complete') {return;}

    WhybugChrome.updateTab(tab);
});

chrome.tabs.onCreated.addListener(function(tab) {         
    WhybugChrome.updateTab(tab);
});

chrome.pageAction.onClicked.addListener(function(tab) {
    WhybugChrome.toggleStatus(tab);
});

// // When the extension is installed or upgraded ...
// chrome.runtime.onInstalled.addListener(function() {
//   // Replace all rules ...
//   chrome.declarativeContent.onPageChanged.removeRules(undefined, function() {
//     // With a new rule ...
//     chrome.declarativeContent.onPageChanged.addRules([
//       {
//         // That fires when a page's URL contains a 'g' ...
//         conditions: [
//           new chrome.declarativeContent.PageStateMatcher({
//             // pageUrl: { urlContains: 'localhost' },
//           })
//         ],
//         // And shows the extension's page action.
//         actions: [ new chrome.declarativeContent.ShowPageAction() ]
//       }
//     ]);
//   });
// });

/*
Ideas:

 - Activate/deactivate per domain
 - register general javascript error handler
 - register angular/ember/... error handler
 - show red dot when solutions are found?
 -  


*/
