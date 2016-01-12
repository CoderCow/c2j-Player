# Setup Your Environment #

Please complete the following steps to setup your development environment for this project:
* Install Node.js if you don't have it yet.
* Install grunt.js globally by executing 'npm install -g grunt-cli' from command line.
* Run a command line in the project's root directory and execute 'npm install' to install all required npm packages.
* Install the most recent version of Ruby (for the SASS preprocessor) by using [Ruby Installer](http://rubyinstaller.org/) for example.
* Install the ruby gem required for preprocessing SASS by executing 'gem install sass' from command line.

# Folder Structure #

* Gruntfile.js                          Primary grunt file.
* scss-lint.yml                         Configuration file for the SCSS linter.
* tslint.yml                            Configuration file for the TypeScript linter.
* tsconfig.json                         Configuration file for the TypeScript transpiler.
* tsconfig.release.json                 Configuration file for the TypeScript transpiler (for release builds).
* +-- dist                              Distribution files (compiled software ready for shipping).
* +-- src                               Source files.
* |   +-- d.ts                          TypeScript definition files which are fed to the TypeScript transpiler for type checking.
* |   +-- iconfont                      Images and definitions out of which the icon font is generated.
* |       `-- icons.json                If an SVG image should be included into the font, it must be registered in this JSON file.
* |       +-- fontawesome               SVG images used from the 'fontawesome' set.
* |       +-- material-design-icons     SVG images used from the 'material-design-icons' npm package.
* |       +-- custom                    Custom SVG images.
* |   +-- scss                          SASS CSS files which get compiled to CSS.
* |   +-- templates                     Dust template files which get compiled to JavaScript.
* |   +-- ts                            TypeScript files which get compiled to JavaScript.
* +-- test                              Contains test code for "src".
* +-- build                             Files necessary for building the
* |   +-- dist                          Prebuilt files for distribution. Should not be edited unless dependencies must be updated. Will simply be copied to dist/
* |   +-- grunt                         Grunt task configurations.
* |   +-- iconfont                      Files required to generate the icons font.
* |       `-- preview_template.html.hbs The template used to generate the font preview HTML file.
* |       `-- template.scss.hbs         The template used for the resulting font CSS file.
* |   +-- temp                          Temporary files of the build process go here.
* |       `-- font_preview.html         After a font has been generated, you may use this page to check whether all SVGs have been encoded properly.
* |       `-- font.css                  The final font.css generated from the SVG files. Contains the actual font as base64 value.
* |   `-- grunt.js                      Grunt configuration.

# Grunt Tasks #

**debug**: Builds the project to "dist" for debugging purposes.
**release**: Builds the project to "dist" for distribution.
**debugging**: Builds the project to "dist" for debugging purposes and continuously rebuilds required files as they are changed in "src".
**validate**: Runs all linters on source files.

# Icons and Font Generation #

Video.js displays icons by using a font which is generated from svg files. Such a set of icons is scalable, very small and easy to use.
This project uses the same font generators as the video.js project for further icons.
To override an existing video.js icon, simply name it (in the icons.json) just like the video.js icon, so that the css class will eventually be overridden.

# IntelliJ IDEA Related #

If you're using IntelliJ IDEA then you should install the 'scss-lint' plugin to get real time linting while writing SCSS code.

This project also provides several preconfigured project run configurations. Some to simply run or debug the grunt tasks stated above, and some tasks useful
for JavaScript debugging.

The general development cycle should be
* Run the Debug JavaScript configuration once (in debugging mode, bug icon).
* Run the Debugging Grunt configuration once normally (in non-debug mode, arrow icon).
* From now on: edit files in src, save and refresh browser.