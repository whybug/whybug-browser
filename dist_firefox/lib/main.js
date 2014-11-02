var ss = require("sdk/simple-storage");
var tabs = require('sdk/tabs');
var { ToggleButton } = require('sdk/ui/button/toggle');
var panels = require("sdk/panel");

// Initialize storage.
ss.storage.pages = ss.storage.pages || {};

var WhybugFirefox = {
  /**
   * Storage to use for domain .
   * 
   * @type {Object}
   */
  storage: ss.storeage.pages,

  updateTab: function (tab) {
    this.updateIcon(tab, this.getStatus(tab));
      // WhybugChrome.injectWhybug(tab, enabled);
  },

  updateIcon: function (tab, enabled) {
    button.icon = {
      "16": "./icon-16.png",
      "32": "./icon-32.png",
      "64": "./icon-64.png"
    };
  },

  /**
   * Returns if whybug is enabled or disabled for 
   * specified tab.
   * 
   * @param {Objectl} tab Chrome tab instance.
   * @param  {Function} callback Callback with boolean param 'enabled'.
   */
  getStatus: function (tab, callback) {
      return this.storage[this.getDomainFromTab(tab)] || false;
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

var button = ToggleButton({
  id: "my-button",
  label: "my button",
  icon: {
    "16": "./icon-16.png",
    "32": "./icon-32.png",
    "64": "./icon-64.png"
  },
  onClick: function(state) {
    console.log(tabs.activeTab.url);
    console.log(state);
  },
  onChange: function (state) {
    if (state.checked) {
      panel.show({position: button});
    }
  }
});



require("sdk/tabs").on("open", function(tab) {
  WhybugFirefox.updateTab(tab);
});

function handleHide() {
  button.state('window', {checked: false});
}