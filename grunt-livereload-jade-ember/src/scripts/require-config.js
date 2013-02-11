/* global require */
require.config({
  shim: {
    jquery: {
      exports: 'jQuery'
    },

    'handlebars': {
      deps: ['jquery'],
      exports: 'Handlebars'
    },

    ember: {
      deps: ['handlebars'],
      exports: 'Ember'
    }
  },

  paths: {
    jquery: '../components/jquery/jquery.min',
    handlebars: '../components/handlebars/handlebars',
    ember: '../components/ember/ember'
  }
});
 
require(['app'], function(App) {
  
});
