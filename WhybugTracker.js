/**
 * Tracks general javascript errors.
 * 
 * @type {Object}
 */
var JsTracker = {
  isActive: function () {
    return true;
  },
  register: function() {
    TraceKit.report.subscribe(WhybugTracker.track);
    console.log('installed tracekit', TraceKit);
  },
  unregister: function() {
    TraceKit.report.subscribe(WhybugTracker.track);
  }
};

/**
 * Tracks angular errors.
 * 
 * @type {Object}
 */
var AngularTracker = {
  isActive: function () {
    console.log('angular detected', typeof(angular) !== 'undefined');
    return typeof(angular) !== 'undefined';
  },
  register: function() {
    app.config(function($provide) {
      $provide.decorator("$exceptionHandler", ['$delegate', function($delegate) {
        return function(exception, cause) {
          WhybugTracker.track(exception);
          $delegate(exception, cause);
        }
      }])
    });
  },
  unregister: function() {
    
  }
};

/**
 * Tracks angular errors.
 * 
 * @type {Object}
 */
var EmberTracker = {
  isActive: function() {
    return typeof(Ember) !== 'undefined';
  },
  register: function() {
    (function() {
      var reportError = function(e) { WhybugTracker.track(e); };
      Ember.onerror = reportError;
      Ember.RSVP.configure('onerror', reportError);
      App.ApplicationRoute = Ember.Route.extend({actions: {error: reportError}});
    })();
  },
  unregister: function() {
  }
};


var WhybugTracker = {
  enabled: false,

  trackers: [
    JsTracker,
    AngularTracker,
    EmberTracker
  ],

  enable: function(enabled) {
    console.log('tacker', enabled, this.enabled);
    this.enabled = enabled;
    this.trackers.forEach(function (tracker) {
      if (!tracker.isActive()) return;

      if (enabled) {
        tracker.register()
      } else {
        tracker.unregister(); 
      }
    });
  },

  track: function(error) {
    console.log('wuhu tracked an error: ', error); 
  }
};

WhybugTracker.enable(true);
