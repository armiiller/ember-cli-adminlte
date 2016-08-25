/* jshint node: true */
'use strict';


// module requirements
var chalk = require('chalk');
var fs    = require('fs');


module.exports = {
  name: 'ember-cli-adminlte',


  included: function(app, parentAddon) {

    // Per the ADDON_HOOKS.md document
    // https://github.com/ember-cli/ember-cli/blob/master/ADDON_HOOKS.md#included
    this._super.included.apply(this, arguments);


    // Per the ember-cli documentation
    // http://ember-cli.com/extending/#broccoli-build-options-for-in-repo-addons
    var target = (parentAddon || app);


    // Addon options from the apps ember-cli-build.js
    var options = target.options[this.name] || {};


    // Options can just be a string of the theme,
    // if so, convert to object and set the theme
    if (typeof options === 'string') {
      options = {'theme':options};
    }


    // Other local variables needed
    var bootstrapPath = target.bowerDirectory + '/AdminLTE/bootstrap';
    var pluginsPath = target.bowerDirectory + '/AdminLTE/bootstrap';
    var adminltePath  = target.bowerDirectory + '/AdminLTE/dist';
    var fontsPath     = bootstrapPath + '/fonts';


    // Make sure bootswatch is available
    if (!fs.existsSync(adminltePath)) {
      throw new Error(
        this.name + ': AdminLTE is not available from bower (' + adminltePath + '), ' +
        'install into your project by running `bower install admin-lte --save`'
      );
    }


    // Friendly message if the addon will not do anything
    if (options.excludeFonts && options.excludeJS && options.excludeCSS) {
      console.error(chalk.red(
        this.name + ': All exclude options are enabled (excludeCSS, excludeJS, excludeFonts). ' +
        'This addon will not import anything into your build tree, which may be intended if ' +
        'you plan on only using Sass or Less files.'
      ));
    }


    // Include bootstrap fonts by default, opt-out option
    if (!options.excludeFonts) {


      // Get all of the font files
      var fontsToImport = fs.readdirSync(fontsPath);
      var filesInFonts  = []; // Bucket for filenames already in the fonts folder
      var fontsSkipped  = []; // Bucket for fonts not imported because they already have been


      // Find files already imported into the fonts folder
      target.otherAssetPaths.forEach(function(asset){
        if (asset.dest == '/fonts') {
          filesInFonts.push(asset.file);
        }
      });


      // Attempt to import each font, if not already imported
      fontsToImport.forEach(function(fontFilename){
        if (filesInFonts.indexOf(fontFilename) > -1) {
          fontsSkipped.push(fontFilename);
        } else {
          target.import(fontsPath + '/' + fontFilename, {destDir:'/fonts'});
        }
      });


      // Fonts that had already been imported, so bootswatch skipped..
      // But do not error if bootstrap option incorrect, already logged similar error
      if (fontsSkipped.length) {
        console.error(chalk.red(
          this.name + ': Fonts already imported [' + fontsSkipped.join(', ') +
          '] by another addon or in your ember-cli-build.js, disable the import ' +
          'from other locations or disable the bootswatch import by setting ' +
          '`"excludeFonts":true` for the "' + this.name + '" options in your ember-cli-build.js'
        ));
      }


    } // if (!options.excludeFonts)


    // Include bootstrap js by default, opt-out option
    if (!options.excludeJS) {
      target.import({
        development: bootstrapPath + '/js/bootstrap.js',
        production:  bootstrapPath + '/js/bootstrap.min.js'
      });

      target.import({
        development: adminltePath + '/js/app.js',
        production:  adminltePath + '/js/app.min.js'
      });

      target.import({
        development: pluginsPath + '/slimScroll/jquery.slimscroll.js',
        production:  pluginsPath + '/slimScroll/jquery.slimscroll.min.js'
      });
    }


    // Include bootswatch css by default, opt-out option
    if (!options.excludeCSS) {
      target.import({
        development: adminltePath + '/css/AdminLTE.css',
        production:  adminltePath + '/css/AdminLTE.min.css'
      });

      target.import({
        development: adminltePath + '/css/skins/_all-skins.css',
        production:  adminltePath + '/css/skins/_all-skins.min.css'
      });

      target.import({
        development: bootstrapPath + '/css/bootstrap.css',
        production:  bootstrapPath + '/css/bootstrap.min.css'
      });

    } // if (!options.excludeCSS)


  } // :included


}; // module.exports
