/**
 * @version 1.4
 *
 * @extension plugin Example
 * @extends $.fn.SSSlider.plugins
 * @requires jQuery SSSlider plugin
 *
 * ======================================================
 * PLUGIN DESCRIPTION HERE
 * ======================================================
 *
 * @author Sergei Liamin https://github.com/SergSlon
 * @see https://github.com/SergSlon/SSSlider
 *
 * Copyright (c) 2013 Sergei Liamin
 *
 * Licensed under the MIT license:
 * http://www.opensource.org/licenses/mit-license.php
 *
 * this file is a part of SSSlider - jQuery modular slider
 **/

/* !!! ============ !!!
 * !!! DEPENDENCIES !!!
 * !!! ============ !!!
 *
 *  ▬ "dependency plugin(library) name"
 *    @author author name
 *    @url    plugin(library) url
 */

;(function () {
    "use strict";

    $.extend($.fn.SSSlider.plugins, {

        /**
         * pluginExample - plugin name, the same as filename, but without .js
         *
         * @param SSSlider {object} reference to the SSSlider object
         * @param options {object} options that passed to the plugin function from SSSlider plugin initialization
         */
        pluginExample: function (SSSlider, options) {
            var plugin = this,

                /**
                 * default plugin options
                 */
                    defaults = {
                    pluginOption: 'pluginOptionValue'
                };

            /**
             * plugin options
             * =========================================================================================================
             * SSSlider.plugins.pluginExample.options passes for possibility change options after slider initialization
             * =========================================================================================================
             * use
             *      plugin.options = SSSlider.plugins.pluginExample.options = $.extend(true, {}, defaults, options);
             * for deep copy
             */
            plugin.options = SSSlider.plugins.pluginExample.options = $.extend({}, defaults, options);

            /**
             * add new SSSlider method
             *    or
             * completely change SSSlider method
             */
            SSSlider.methodName = function () {
                console.log('pluginName methodName called');
            };

            /**
             * add new plugin method
             */
            plugin.method = function () {
                //method code
            };

            /**
             * add new functionality to SSSlider methods by extending them
             */
            SSSlider.next = (function (fn) {
                return function () {
                    fn.call(this);
                    console.log('next called');
                };
            })(SSSlider.next);

            /**
             * events usage
             */
            SSSlider.onEvent('sss.init', function () {
                console.group("SSSlider");
                console.log("Hello world !!! ");
                console.groupEnd()
            });

        }

    });
})();