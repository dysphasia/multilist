module.exports = function(grunt) {
  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-contrib-qunit');
  grunt.loadNpmTasks('grunt-blanket-qunit');
  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-contrib-cssmin');

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

    cssmin: {
      css: {
        src: 'source/css/' + pkg.name + '.css',
        dest: 'release/' + pkg.name + '-' + pkg.version + '-min.css'
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

  cfg.uglify.js.files['release/' + pkg.name + '-' + pkg.version + '-min.js'] = ['source/js/' + pkg.name + '.js'];

  grunt.initConfig(cfg);

  grunt.registerTask('release', ['cssmin:css', 'uglify:js']);
};
