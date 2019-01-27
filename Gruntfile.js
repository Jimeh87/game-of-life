module.exports = function (grunt) {
  grunt.registerTask('rle-parser', 'Converts list of RLE files into JSON file', function () {
    var allData = [];
    grunt.file.recurse('./src/assets/templates', function callback(abspath, rootdir, subdir, filename) {
      var fileData = {};
      // grunt.log.writeln('processing: ' + filename);
      var fileContents = grunt.file.read(abspath);

      fileData['filename'] = filename;

      var unformattedName = /#N\s?[^\n]*/.exec(fileContents);
      var name;
      if (unformattedName != null) {
        name = unformattedName[0].replace(/#N\s?/g, '').replace(/\r?\n|\r/g, '').trim();
      } else {
        name = filename.slice(0, -4);
      }
      fileData['name'] = name;

      var unformattedAuthor = /#O\s?[^\n]*/.exec(fileContents);
      fileData['author'] = unformattedAuthor != null ? unformattedAuthor[0].replace(/#O\s?/g, '').replace(/\r?\n|\r/g, '').trim() : null;

      // Rule
      var unformattedRule = /rule\s?\=\s?(B|S|b|s)?[0-9]+\/(B|S|b|s)?[0-9]+/.exec(fileContents);
      var rule = unformattedRule != null ? unformattedRule[0].replace(/\r?\n|\r|\s/g, '').replace(/rule=/, '') : null;
      if (unformattedRule != null) {
        fileData['rule'] = rule;
      } else {
        grunt.log.writeln('Failed to parse rule for file ' + filename + ' while identifying rule.');
        return true;
      }

      // Comments
      var comments = [];
      var commentsPattern = /#(C|c)\s?[^\n]*/g;
      var execArray;
      while (execArray = commentsPattern.exec(fileContents)) {
        comments.push(execArray[0].replace(/#C\s?/g, '').replace(/\r?\n|\r/g, '').replace(/^(?!http:\/\/)www\./g, 'http://www.'));
      }
      fileData['comments'] = comments;

      // Bounding box
      var boundingBox = {x: null, y: null};
      boundingBox['x'] = 1;
      var findLinePattern = /(?!#C)x\s?\=\s?[0-9]+,\s?y\s?\=\s?[0-9]+/i;
      var xyLine = findLinePattern.exec(fileContents)[0].replace(/[^0-9xXyY]/g, '');
      var xyValue = '';
      var leadingCharacter = null;
      for (var i = 0; i < xyLine.length; i++) {
        var char = xyLine[i];
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
        grunt.log.writeln('Failed to parse pattern for file ' + filename + ' while identifying bounding box.');
        return true;
      }
      fileData['boundingBox'] = boundingBox;

      // Game board pattern
      var unformattedPattern = /(\r?\n|\r)([0-9]|b|o|\$|\s|\n)*!/.exec(fileContents);
      var pattern = unformattedPattern != null ? unformattedPattern[0].replace(/\r?\n|\r|\s/g, '') : null;
      if (pattern == null) {
        grunt.log.writeln('Failed to parse pattern for file ' + filename + ' while identifying pattern.');
        return true;
      }
      fileData['pattern'] = pattern;

      // fileData['tags'] = [];
      // fileData['tags'].push({
      //   'key': 'title',
      //   'value': fileData['name']
      // });
      // fileData['tags'].push({
      //   'key': 'pattern',
      //   'value': fileData['pattern']
      // });

      allData.push(fileData);
    });
    var authors = [];
    allData.forEach(function (data) {
      var rawAuthorName = data['author'];
      if (!rawAuthorName || rawAuthorName.toLowerCase() === 'unknown') {
        return;
      }
      var splitName = rawAuthorName.split(' ');
      if (splitName.length > 3 || splitName.length < 1) {
        grunt.log.writeln('Failed to parse author name [' + rawAuthorName + '] for file ' + data['filename'] + ' while building author pool.');
        return;
      }
      var firstName = splitName.length > 1 ? splitName[0] : null;
      var lastName = splitName[splitName.length - 1];
      var authorKey = ((firstName ? firstName : '') + lastName).toLowerCase();
      var matchingAuthors = authors.filter(function (a) {
        return a.key === authorKey
      });
      if (matchingAuthors.length) {
        matchingAuthors[0]['count']++;
      } else {
        authors.push({
          key: authorKey,
          display: rawAuthorName,
          firstName: firstName,
          lastName: lastName,
          count: 1
        });
      }
    });

    authors.sort(function (a, b) {
      return b['count'] - a['count'];
    });


    grunt.file.write('./src/assets/parsed-rle-data.json', JSON.stringify(allData));
    grunt.file.write('./src/assets/parsed-authors.json', JSON.stringify(authors));
  });

  grunt.registerTask('parse-rle', ['rle-parser']);
};

var groupBy = function (xs, key) {
  return xs.reduce(function (rv, x) {
    (rv[x[key]] = rv[x[key]] || []).push(x);
    return rv;
  }, {});
};
