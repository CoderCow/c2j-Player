# Setup Your Environment #

Please complete the following steps to setup your development environment for this project:
* Install the most recent version of Node.js if you don't have it yet.
* Install grunt.js globally by executing 'npm install -g grunt-cli' from command line.
* Run a command line in the project's root directory and execute 'npm install' to install all required npm packages.
* Install the most recent version of Ruby (for the SASS preprocessor) by using [Ruby Installer](http://rubyinstaller.org/) for example.
* Install the ruby gem required for preprocessing SASS by executing 'gem install sass' from command line.

# Folder Structure #

* Gruntfile.js                          Primary grunt file.
* scss-lint.yml                         Configuration file for the SCSS linter.
* tslint.json                           Configuration file for the TypeScript linter.
* tsconfig.json                         Configuration file for the TypeScript transpiler.
* tsconfig.coverage.json                Configuration file for the TypeScript transpiler (for unit text coverage).
* dist                                  Distribution files (compiled software ready for shipping or debugging).
* typings                               TypeScript definition files which are fed to the TypeScript transpiler for type checking. Managed by the "typings" utility.
* public                                Production files such as source code and assets.
* public/iconfont                       Files used for icon font generation.
* public/scss                           SASS CSS files which to be compiled to CSS.
* public/ts                             TypeScript files which get compiled to JavaScript.
* public/dist                           Files for distribution. Should not be edited. Will simply be copied to dist/

# Npm Scripts #

**build**: Builds the project to "dist" for debugging purposes.
**build:prod**: Builds the project to "dist" for distribution.

**develop**: Builds the project to "dist" for debugging purposes and starts the webpack development server. Continuously rebuilds source files as they are changed.

**test**: Runs all unit tests.

**coverage**: Runs all unit tests and generates a coverage report.

**testing**: Runs all unit tests and continously re-runs them when source files or test files are changed.

**tslint**: Runs the TypeScript linter on all production source files.

**clean**: Removes all content of the "dist" directory.

# Icons and Font Generation #

Video.js displays icons by using a font which is generated from svg files. Such a set of icons is scalable, very small and easy to use.
This project uses very similar font generators as the video.js project.

# IntelliJ IDEA Related #

If you're using IntelliJ IDEA then you should install the 'scss-lint' plugin to get real time linting while writing SCSS code.
