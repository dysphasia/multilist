module.exports = function(grunt) {
  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-contrib-qunit');

  grunt.initConfig({
    jshint: {
      all: ['source/js/*.js']
    },

    qunit: {
      all: ['test/test.html']
    }
  });
};
