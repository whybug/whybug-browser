var JsTracker = {
  isActive: function () {
    return true;
  },
  register: function() {
    // todo, register error handler
  },
  unregister: function() {

  }
};

var AngularTracker = {
  isActive: function () {
    return typeof(angular) !== 'undefined';
  },
  register: function() {
    app.config(function($provide) {
      $provide.decorator("$exceptionHandler", ['$delegate', function($delegate) {
        return function(exception, cause) {
          _errs.push(exception);
          $delegate(exception, cause);
        }
      }])
    });
  },
  unregister: function() {
  }
};

var EmberTracker = {
  isActive: function() {
    return typeof(Ember) !== 'undefined';
  },
  register: function() {
    (function() {
      var reportError = function(e) { _errs.push(e); };
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
  }
};

WhybugTracker.enable(true);
