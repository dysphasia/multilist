module.exports = function(grunt) {
  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-contrib-qunit');
  grunt.loadNpmTasks('grunt-blanket-qunit');

  var testUrl = 'test/test.html';

  grunt.initConfig({
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
    }
  });
};
