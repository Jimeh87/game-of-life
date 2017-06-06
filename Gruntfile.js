module.exports = function (grunt) {
  //
  // grunt.initConfig({
  //   peg: {
  //     rle : {
  //       src: "src/assets/rle.pegjs",
  //       dest: "src/assets/rle-parser.js"
  //     }
  //   }
  // });

  grunt.initConfig({
    fileParser: {}
  });

  // grunt.task.loadTasks('./grunt-tasks');

  grunt.registerTask('rle-parser', 'Converts list of files into JSON file', function() {
    const allData = [];
    grunt.file.recurse('./src/assets/templates', function callback(abspath, rootdir, subdir, filename) {
      fileData = {};
      // grunt.log.writeln('processing: ' + filename);
      const fileContents = grunt.file.read(abspath);

      fileData['filename'] = filename;

      const unformattedName = /#N\s?[^\n]*/.exec(fileContents);
      var name;
      if (unformattedName != null) {
        name = unformattedName[0].replace(/#N\s?/g, '').replace(/\r?\n|\r/g, '').trim();
      } else {
        name = filename.slice(0, -4);
      }
      fileData['name'] = name;

      const unformattedAuthor = /#O\s?[^\n]*/.exec(fileContents);
      fileData['author'] = unformattedAuthor != null ? unformattedAuthor[0].replace(/#O\s?/g, '').replace(/\r?\n|\r/g, '').trim() : null;

      // Rule
      const unformattedRule = /rule\s?\=\s?(B|S|b|s)?[0-9]+\/(B|S|b|s)?[0-9]+/.exec(fileContents);
      const rule = unformattedRule != null ? unformattedRule[0].replace(/\r?\n|\r|\s/g, '').replace(/rule=/, '') : null;
      if (unformattedRule != null) {
        fileData['rule'] = rule;
      } else {
        grunt.log.writeln('Failed to parse rule for file ' + filename);
        return true;
      }

      // Comments
      const comments = [];
      const commentsPattern = /#(C|c)\s?[^\n]*/g;
      var execArray;
      while (execArray = commentsPattern.exec(fileContents)) {
        comments.push(execArray[0].replace(/#C\s?/g, '').replace(/\r?\n|\r/g, '').replace(/^(?!http:\/\/)www\./g, 'http://www.'));
      }
      fileData['comments'] = comments;

      // Bounding box
      const boundingBox = {x: null, y: null};
      boundingBox['x'] = 1;
      const findLinePattern = /(?!#C)x\s?\=\s?[0-9]+,\s?y\s?\=\s?[0-9]+/i;
      const xyLine = findLinePattern.exec(fileContents)[0].replace(/[^0-9xXyY]/g, '');
      var xyValue = '';
      var leadingCharacter = null;
      for (var i = 0; i < xyLine.length; i++) {
        const char = xyLine[i];
        if (char === 'x' || char === 'X' || char === 'y' || char === 'Y') {
          if (leadingCharacter != null) {
            boundingBox[leadingCharacter] = +xyValue;
            xyValue = '';
          }
          leadingCharacter = char.toLowerCase();
        } else {
          xyValue += char;
        }
      }
      boundingBox[leadingCharacter] = +xyValue;
      if (boundingBox.x == null || boundingBox.y == null) {
        grunt.log.writeln('Failed to parse pattern for file ' + filename);
        return true;
      }
      fileData['boundingBox'] = boundingBox;

      // Game board pattern
      const unformattedPattern = /(\r?\n|\r)([0-9]|b|o|\$|\s|\n)*!/.exec(fileContents);
      const pattern = unformattedPattern != null ? unformattedPattern[0].replace(/\r?\n|\r|\s/g, '') : null;
      if (pattern == null) {
        grunt.log.writeln('Failed to parse pattern for file ' + filename);
        return true;
      }
      fileData['pattern'] = pattern;


      allData.push(fileData);
    });
    grunt.file.write('./src/assets/parsed-rle-data.json', JSON.stringify(allData));
  });

  grunt.registerTask('parse-rle', ['rle-parser']);

};
