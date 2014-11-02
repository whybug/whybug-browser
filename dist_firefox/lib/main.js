var ss = require("sdk/simple-storage");
var tabs = require('sdk/tabs');
var { ToggleButton } = require('sdk/ui/button/toggle');
var panels = require("sdk/panel");
var pageMod = require("sdk/page-mod");
var urls = require("sdk/url");

// Initialize storage.
// There needs to be some valid default value.
ss.storage.pages = ss.storage.pages || ["*.whybug.com"];

var WhybugFirefox = {

  /**
   * Storage to use for domain .
   * 
   * @type {Object}
   */
  storage: ss.storage.pages,

  updateTab: function (tab) {
    this.updateIcon(tab, this.getStatus(tab));
      // WhybugChrome.injectWhybug(tab, enabled);
  },

  updateIcon: function (tab, enabled) {
    console.log("update icon" , enabled);
    button.icon = enabled ? iconEnabled : iconDisabled;
  },

  /**
   * Returns if whybug is enabled or disabled for 
   * specified tab.
   * 
   * @param {Objectl} tab Chrome tab instance.
   * @param  {Function} callback Callback with boolean param 'enabled'.
   */
  getStatus: function (tab, callback) {
      console.log("get status", this.storage);
      return this.storage.indexOf(this.getDomainFromTab(tab)) !== -1;
  },

  /**
   * Returns the domain name for a specified tab.
   * 
   * @param {Objectl} tab Chrome tab instance.
   * @return {String}     Domain name.
   */
  getDomainFromTab: function(tab) {
    console.log('getDomainFromTab', tab.url) 
    return "*." + new urls.URL(tab.url).hostname;
  },

  toggleStatus: function (tab) {
    var domain = this.getDomainFromTab(tab);
    console.log('toggle status', domain, this.getStatus(tab), "to", !this.getStatus(tab));
    if (this.getStatus(tab)) {
      this.storage.splice(this.storage.indexOf(5), 1);
    } else {
      this.storage.push(domain);
    }
    this.updateTab(tab);
  }
};

var iconEnabled = {
  "16": "./icon2.png",
  "32": "./icon2.png",
  "64": "./icon2.png"
};

var iconDisabled = {
  "16": "./icon1.png",
  "32": "./icon1.png",
  "64": "./icon1.png"
};

var button = ToggleButton({
  id: "my-button",
  label: "my button",
  icon: iconDisabled,
  onClick: function(state) {
    WhybugFirefox.toggleStatus(tabs.activeTab);
    console.log(state);
  },
  onChange: function (state) {
    if (state.checked) {
      // panel.show({position: button});
    }
  }
});

tabs.on('activate', function onOpen(tab) {
  WhybugFirefox.updateTab(tab);
});

pageMod.PageMod({
  include: WhybugFirefox.storage,
  onAttach: function onAttach(worker) {
    WhybugFirefox.updateTab(worker.tab)
  }
});

// require("sdk/tabs").on("open", function(tab) {
//   WhybugFirefox.updateTab(tab);
// });

function handleHide() {
  button.state('window', {checked: false});
}