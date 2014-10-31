// Copyright (c) 2011 The Chromium Authors. All rights reserved.
// Use of this source code is governed by a BSD-style license that can be
// found in the LICENSE file.

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

var min = 1;
var max = 2;
var current = min;
chrome.pageAction.onClicked.addListener(function(tab) {
  if (++current > max) current = min;

  chrome.pageAction.show(tab.id);
  chrome.pageAction.setIcon({
    tabId: tab.id,
    path: "icon" + current + ".png"
  });
});

/*
Ideas:

 - Activate/deactivate per domain
 - register general javascript error handler
 - register angular/ember/... error handler
 - show red dot when solutions are found?
 -  

*/
