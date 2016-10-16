/* jshint node: true */
'use strict';


// module requirements
var chalk = require('chalk');
var fs = require('fs');


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
        options = {
          'theme': options
        };
      }


      // Other local variables needed
      var bootstrapPath = target.bowerDirectory + '/AdminLTE/bootstrap';
      var pluginsPath = target.bowerDirectory + '/AdminLTE/plugins';
      var adminltePath = target.bowerDirectory + '/AdminLTE/dist';
      var lessPath = target.bowerDirectory + '/AdminLTE/build/less';
      var fontsPath = bootstrapPath + '/fonts';


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
        var filesInFonts = []; // Bucket for filenames already in the fonts folder
        var fontsSkipped = []; // Bucket for fonts not imported because they already have been


        // Find files already imported into the fonts folder
        target.otherAssetPaths.forEach(function(asset) {
          if (asset.dest == '/fonts') {
            filesInFonts.push(asset.file);
          }
        });


        // Attempt to import each font, if not already imported
        fontsToImport.forEach(function(fontFilename) {
          if (filesInFonts.indexOf(fontFilename) > -1) {
            fontsSkipped.push(fontFilename);
          } else {
            target.import(fontsPath + '/' + fontFilename, {
              destDir: '/fonts'
            });
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
          production: bootstrapPath + '/js/bootstrap.min.js'
        });

        target.import({
          development: adminltePath + '/js/app.js',
          production: adminltePath + '/js/app.min.js'
        });

        if (options.includeSlimScroll) {
          target.import({
            development: pluginsPath + '/slimScroll/jquery.slimscroll.js',
            production: pluginsPath + '/slimScroll/jquery.slimscroll.min.js'
          });
        }

        // bootstrap-slider
        if (options.includeBSSlider) {
          target.import({
            development: pluginsPath + '/bootstrap-slider/bootstrap-slider.js',
            production: pluginsPath + '/bootstrap-slider/bootstrap-slider.js'
          });
          target.import({
            development: pluginsPath + '/bootstrap-slider/slider.css',
            production: pluginsPath + '/bootstrap-slider/slider.css'
          });
        }

        // bootstrap-wysihtml5
        if (options.includeWYSIHTML5) {
          target.import({
            development: pluginsPath + '/bootstrap-wysihtml5/bootstrap3-wysihtml5.all.js',
            production: pluginsPath + '/bootstrap-wysihtml5/bootstrap3-wysihtml5.all.min.js'
          });
          target.import({
            development: pluginsPath + '/bootstrap-wysihtml5/bootstrap3-wysihtml5.css',
            production: pluginsPath + '/bootstrap-wysihtml5/bootstrap3-wysihtml5.min.css'
          });
        }

        // chartjs
        if (options.includeChartJS) {
          target.import({
            development: pluginsPath + '/chartjs/Chart.js',
            production: pluginsPath + '/chartjs/Chart.min.js'
          });
        }

        if (options.includeColorPicker) {
          // color picker
          target.import({
            development: pluginsPath + '/colorpicker/bootstrap-colorpicker.js',
            production: pluginsPath + '/colorpicker/bootstrap-colorpicker.min.js'
          });
          target.import({
            development: pluginsPath + '/colorpicker/bootstrap-colorpicker.css',
            production: pluginsPath + '/colorpicker/bootstrap-colorpicker.min.css'
          });
        }

        // dataTables

        // fastclick
        if (options.includeFastClick) {
          target.import({
            development: pluginsPath + '/fastclick/fastclick.js',
            production: pluginsPath + '/fastclick/fastclick.min.js'
          });
        }

        //flot

        // fullcalendar
        if (options.includeFullCalendar) {
          target.import({
            development: pluginsPath + '/fullcalendar/fullcalendar.js',
            production: pluginsPath + '/fullcalendar/fullcalendar.min.js'
          });
          target.import({
            development: pluginsPath + '/fullcalendar/fullcalendar.css',
            production: pluginsPath + '/fullcalendar/fullcalendar.min.css'
          });
        }

        // iCheck

        // input-mask

        // ionslider

        // jvectormap

        // knob
        if (options.includeJQueryKnob) {
          target.import({
            development: pluginsPath + '/knob/jquery.knob.js',
            production: pluginsPath + '/knob/jquery.knob.js'
          });
        }

        // morris
        if (options.includeMorris) {
          target.import({
            development: pluginsPath + '/morris/morris.js',
            production: pluginsPath + '/morris/morris.min.js'
          });
          target.import({
            development: pluginsPath + '/morris/morris.css',
            production: pluginsPath + '/morris/morris.css'
          });
        }

        //pace
        if (options.includePace) {
          target.import({
            development: pluginsPath + '/pace/pace.js',
            production: pluginsPath + '/pace/pace.min.js'
          });
          target.import({
            development: pluginsPath + '/pace/pace.css',
            production: pluginsPath + '/pace/pace.min.css'
          });
        }

        // select2
        if (options.includeSelect2) {
          target.import({
            development: pluginsPath + '/select2/select2.js',
            production: pluginsPath + '/select2/select2.min.js'
          });
          target.import({
            development: pluginsPath + '/select2/select2.css',
            production: pluginsPath + '/select2/select2.min.css'
          });
        }

        // sparkline
        if (options.includeSparkline) {
          target.import({
            development: pluginsPath + '/sparkline/jquery.sparkline.js',
            production: pluginsPath + '/sparkline/jquery.sparkline.min.js'
          });
        }

        // timepicker
        if (options.includeBSTimePicker) {
          target.import({
            development: pluginsPath + '/timepicker/bootstrap-timepicker.js',
            production: pluginsPath + '/timepicker/bootstrap-timepicker.min.js'
          });
          target.import({
            development: pluginsPath + '/timepicker/bootstrap-timepicker.css',
            production: pluginsPath + '/timepicker/bootstrap-timepicker.min.css'
          });
        }
      }


      // Include bootswatch css by default, opt-out option
      if (!options.excludeCSS) {
        target.import({
          development: adminltePath + '/css/AdminLTE.css',
          production: adminltePath + '/css/AdminLTE.min.css'
        });

        target.import({
          development: lessPath + '/AdminLTE.less',
          production: lessPath + '/AdminLTE.min.less'
        });

        target.import({
          development: adminltePath + '/css/skins/_all-skins.css',
          production: adminltePath + '/css/skins/_all-skins.min.css'
        });

        target.import({
          development: bootstrapPath + '/css/bootstrap.css',
          production: bootstrapPath + '/css/bootstrap.min.css'
        });

      } // if (!options.excludeCSS)


    } // :included


}; // module.exports
