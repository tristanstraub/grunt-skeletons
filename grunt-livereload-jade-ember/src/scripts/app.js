/* global console, define, App */
define(['ember'], function(Ember) {
  var set = Ember.set, get = Ember.get;
  
  var App = new Ember.Application();

  App.IndexRoute = Ember.Route.extend({
    setupController: function(controller, model) {
      controller.set('things', ['apples','oranges','pears'] );
    }
  });

  App.IndexController = Ember.Controller.extend({
    things: null,

    moveUp: function(fruit) {
      var things = get(this, 'things');
      var index = things.indexOf(fruit);
      things.removeAt(index);
      if (index-1 >= 0) {
        things.insertAt(index-1, fruit);
      } else {
        things.insertAt(get(things, 'length'), fruit);
      }
    },

    moveDown: function(fruit) {
      var things = get(this, 'things');
      var index = things.indexOf(fruit);
      things.removeAt(index);
      if (index + 1 <= get(things, 'length')) {
        things.insertAt(index+1, fruit);
      } else {
        things.insertAt(0, fruit);
      }
    }
  });

  return App;
});

