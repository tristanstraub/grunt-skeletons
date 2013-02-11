/* global module, require, __dirname */

'use strict';
var path = require('path');
var lrSnippet = require('grunt-contrib-livereload/lib/utils').livereloadSnippet;


module.exports = function(grunt) {
  // jade partials, precompiled for insertion into index.html
  var partials = [];

  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-contrib-stylus');
  grunt.loadNpmTasks('grunt-contrib-compass');
  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-regarde');
  grunt.loadNpmTasks('grunt-contrib-connect');
  grunt.loadNpmTasks('grunt-contrib-livereload');
  grunt.loadNpmTasks('grunt-contrib-jade');

  // Project configuration.
  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    regarde: {
      js: {
        files: '<%= jshint.all %>',
        tasks: ['jshint','livereload']
      },
      jade: {
        files: 'src/templates/**/*.jade',
        tasks: ['jade','livereload']
      },
      scss: {
        files: 'src/stylesheets/templates/*.scss',
        tasks: ['compass','livereload']
      },
      styl: {
        files: 'src/stylesheets/templates/*.styl',
        tasks: ['stylus', 'livereload']
      }
    },

    connect: {
      livereload: {
        options: {
          port: 9001,
          middleware: function(connect, options) {
            return [lrSnippet,
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
      all: ['grunt.js', 'src/scripts/**/*.js'],
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
        browser: true,
        globals: {
          require: true,
          define: true,
          requirejs: true,
          describe: true,
          expect: true,
          it: true,
          console: true
        }

      }
    },

    partials: {
      options: {
        path: 'src/templates/partials',
        mask: /([^/]*)[.]hbs[.]jade$/
      }
    },

    original_jade: {
      compile: {
        options: {
          data: {
            debug: false,
            partials: function() {
              return partials;
            }
          }
        },
        files: {
          "src/index.html": "src/templates/index.jade"
        }
      }
    },

    compass: {                  
      dist: {                   
        options: {              
          sassDir: 'src/stylesheets/templates',
          cssDir: 'src/stylesheets',
          environment: 'production'
        }
      },
      dev: {                    
        options: {
          sassDir: 'src/stylesheets/templates',
          cssDir: 'src/stylesheets'
        }
      }
    },

    stylus: {
      compile: {
        files: {
          'src/stylesheets/app.css': ['src/stylesheets/templates/*.styl']
        }
      }
    }
  });

  grunt.registerTask('partials', 'Find *.hbs.jade files and store them in partials list', function() {
    var jade = require('jade');
    var _ = require('underscore')._;
    var findit = require('findit');

    var options = this.options();

    var partials_path = options.path;
    var partials_mask = options.mask;

    // set shared object
    partials = _(findit.sync(path.join(__dirname, partials_path)))
      .filter(function(partial) {
        var re = partials_mask;
        return re.exec(partial);
      })
      .map(function(partial) {
        return { 
          content: jade.compile(grunt.file.read(partial))(),
          name: partials_mask.exec(partial)[1]
        };
      });
  });

  grunt.renameTask('jade', 'original_jade');
  grunt.registerTask('jade', ['partials', 'original_jade']);

  grunt.registerTask('build', ['jade', 'jshint', 'compass', 'stylus']);

  // Default task(s).
  grunt.registerTask('default', ['build', 'livereload-start', 'connect', 'regarde']);
};

