module.exports = function(grunt) {
  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-contrib-qunit');
  grunt.loadNpmTasks('grunt-blanket-qunit');
  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-contrib-cssmin');
  grunt.loadNpmTasks('grunt-contrib-copy');
  grunt.loadNpmTasks('grunt-contrib-clean');

  var pkg = grunt.file.readJSON('package.json');
  var licenseDoc = grunt.file.read('LICENSE.txt');
  var copyright = licenseDoc.split('\n')[0];
  var testUrl = 'test/test.html';

  var cfg = {
    pkg: pkg,

    license: ' * ' + copyright + '\n * Released under the MIT license\n * http://jquery.org/license',

    jshint: {
      all: ['source/js/*.js']
    },

    qunit: {
      all: [testUrl]
    },

    blanket_qunit: {
      all: {
        options: {
          urls: [testUrl + '?coverage=true&gruntReport']
        }
      }
    },

    clean: {
      release: ['release/']
    },

    copy: {
      release_js: {
        expand: true,
        src: 'source/js/*.js',
        dest: 'release/',
        flatten: true,
        filter: 'isFile'
      },

      release_css: {
        expand: true,
        src: 'source/css/*.css',
        dest: 'release/',
        flatten: true,
        filter: 'isFile',
        options: {
          process: function(content, srcpath) {
            return content.replace(/\.\.\/img\//g, '');
          }
        }
      },

      release_demo: {
        src: 'demo/' + pkg.name + '.html',
        dest: 'release/demo.html',
        flatten: true,
        filter: 'isFile',
        options: {
          process: function(content, srcpath) {
            return content.replace(/\.\.\/source\/(?:j|cs)s\/(.+)\.(js|css)/g,
                                   '$1-' + pkg.version + '.min.$2');
          }
        }
      },

      release_images: {
        expand: true,
        src: 'source/img/*',
        dest: 'release/',
        flatten: true,
        filter: 'isFile'
      }
    },

    cssmin: {
      css: {
        src: 'release/' + pkg.name + '.css',
        dest: 'release/' + pkg.name + '-' + pkg.version + '.min.css'
      }
    },

    uglify: {
      js: { files: {} },
      options: {
        banner: '/*!\n * <%= pkg.name %> v<%= pkg.version %>\n' +
          ' * built <%= grunt.template.today("yyyy-mm-dd") %>\n' +
          '<%= license %>\n */\n'
      }
    }
  };

  cfg.uglify.js.files['release/' + pkg.name + '-' + pkg.version + '.min.js'] = ['release/' + pkg.name + '.js'];

  grunt.initConfig(cfg);

  grunt.registerTask('release', ['clean:release', 'copy', 'cssmin:css', 'uglify:js']);
};
