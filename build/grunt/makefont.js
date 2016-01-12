"use strict";

// Generates a font and a CSS file from SVG images.

var fs = require('fs');
var path = require('path');
var _ = require('lodash');

var jsonRequirePath = '../../src/iconfont/icons.json';
var cssDestPath = 'dist/css/font.css';
var scssTempPath = 'build/temp/font.scss';
var cssTempPath = 'build/temp/font.css';
var cssTemplatePath = 'build/iconfont/template.scss.hbs';
var htmlDestPath = 'build/temp/font_preview.html';
var htmlTemplatePath = 'build/iconfont/preview_template.html.hbs';
var fontDestPath = 'build/temp/';

module.exports = function(grunt) {
  grunt.registerTask('makefont-generate', function() {
    var done = this.async();

    let webfontsGenerator = require('webfonts-generator');
    let iconConfig = require(jsonRequirePath);
    let svgRootDir = iconConfig['root-dir'];
    let icons = iconConfig.icons;

    let iconFiles = icons.map(function(icon) {
      // If root-dir is specified for a specific icon, use that.
      if (icon['root-dir']) {
        return icon['root-dir'] + icon.svg;
      }

      // Otherwise, use the default root-dir.
      return svgRootDir + icon.svg;
    });

    webfontsGenerator({
      files: iconFiles,
      dest: fontDestPath,
      fontName: iconConfig['font-name'],
      cssDest: scssTempPath,
      cssTemplate: cssTemplatePath,
      htmlDest: htmlDestPath,
      htmlTemplate: htmlTemplatePath,
      html: true,
      rename: function(iconPath) {
        let fileName = path.basename(iconPath);

        let iconName = _.result(_.find(icons, function(icon) {
          let svgName = path.basename(icon.svg);

          return svgName === fileName;
        }), 'name');

        return iconName;
      },
      types: ['svg', 'ttf', 'woff', 'eot']
    }, function(error) {
      if (error) {
        console.error(error);
        done(false);
      }

      done();
    });

  });

  grunt.registerTask('makefont-base64', function() {
    let iconScssFile = scssTempPath;
    let fontFiles = {
      ttf: fontDestPath + 'icons.ttf',
      woff: fontDestPath + 'icons.woff'
    };

    let scssContents = fs.readFileSync(iconScssFile).toString();

    Object.keys(fontFiles).forEach(function(font) {
      let fontFile = fontFiles[font];
      let fontContent = fs.readFileSync(fontFile);

      let regex = new RegExp(`(url.*font-${font}.*base64,)([^\\s]+)(\\).*)`);

      scssContents = scssContents.replace(regex, `$1${fontContent.toString('base64')}$3`);
    });

    fs.writeFileSync(iconScssFile, scssContents);
  });

  // Sass turns unicode codepoints into utf8 characters.
  // We don't want that so we unwrapped them in the templates/scss.hbs file.
  // After sass has generated our css file, we need to wrap the codepoints
  // in quotes for it to work.
  grunt.registerTask('makefont-wrapcodepoints', function() {
    let cssPath = path.normalize(cssTempPath);
    let cssOutPath = path.normalize(cssDestPath);
    let css = grunt.file.read(cssPath);
    let newCss = css.replace(/(\\f\w+)/g, "'$1'");
    grunt.file.write(cssPath, newCss);
    grunt.file.write(cssOutPath, newCss);

    /*const sassPath = path.normalize(scssTempPath);
    const normalSassPath = path.normalize(scssTempPath);
    const sass = grunt.file.read(sassPath);
    grunt.file.write(normalSassPath, sass.replace(/(\\f\w+),/g, "'$1',"));*/
  });

  grunt.registerTask('makefont', ['makefont-generate', 'makefont-base64', 'sass:makefont', 'makefont-wrapcodepoints']);
};