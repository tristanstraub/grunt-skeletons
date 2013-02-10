/* global module, require */

'use strict';
var path = require('path');
var lrSnippet = require('grunt-contrib-livereload/lib/utils').livereloadSnippet;

var folderMount = function folderMount(connect, point) {
  return connect.static(path.resolve(point));
};

module.exports = function(grunt) {

  // Project configuration.
  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    regarde: {
      js: {
        files: '<%= jshint.all %>',
        tasks: ['jshint','livereload']
      },
      jade: {
        files: 'src/*.jade',
        tasks: ['jade','livereload']
      }
    },
    connect: {
      livereload: {
        options: {
          port: 9001,
          middleware: function(connect, options) {
            return [lrSnippet, folderMount(connect, '.'),
                    // Serve static files.
                    connect.static(path.join(options.base, 'src')),
                    // Make empty directories browsable.
                    connect.directory(path.join(options.base, 'src'))
                   ];
          }
        }
      }
    },
    jshint: {
      all: ['grunt.js', 'src/app/**/*.js', 'src/config.js', 'tests/app/**/*.js'],
      options: {
        curly: true,
        eqeqeq: true,
        immed: true,
        latedef: true,
        newcap: true,
        noarg: true,
        sub: true,
        undef: true,
        boss: true,
        eqnull: true,
        browser: true
      },
      globals: {
        require: true,
        define: true,
        requirejs: true,
        describe: true,
        expect: true,
        it: true
      }
    },

    jade: {
      compile: {
        options: {
          data: {
            debug: false
          }
        },
        files: {
          "src/index.html": "src/index.jade"
        }
      }
    }
  });

  // Load the plugin that provides the "uglify" task.
  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-regarde');
  grunt.loadNpmTasks('grunt-contrib-connect');
  grunt.loadNpmTasks('grunt-contrib-livereload');
  grunt.loadNpmTasks('grunt-contrib-jade');

    // Default task(s).
  grunt.registerTask('default', ['jade', 'jshint', 'livereload-start', 'connect', 'regarde']);

};