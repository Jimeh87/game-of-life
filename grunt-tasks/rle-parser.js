module.exports = function(grunt) {

  //TODO : I think if I change this to registerTask it will work...
  grunt.registerMultiTask('fileParser', 'Converts list of files into JSON file', function() {
    grunt.file.recurse('./src/assets/templates/', function callback(abspath, rootdir, subdir, filename) {
      grunt.log.write(filename);
    });
  });
};
