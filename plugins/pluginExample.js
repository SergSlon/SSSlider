/* * * *
 * plugin Example
 *
 * this file is a part of SSSlider - jQuery modular slider
 *
 * Copyright (c) 2013 Sergei Lyamin
 * https://github.com/SergSlon
 *
 * Licensed under the MIT license:
 * http://www.opensource.org/licenses/mit-license.php
 * */

;(function () {
	"use strict";

	$.extend($.fn.SSSlider.plugins, {
		// plugin name
		pluginExample: function (SSSlider, options) {

			(function(SSSlider, options){
				var plugin = {},

					// default options
					defaults = {
						pluginOption: 'pluginOptionValue'
					};

				// plugin options
				// use
				//     plugin.options = $.extend(true, {}, defaults, options);
				// for deep copy
				plugin.options = $.extend({}, defaults, options);

				// add new SSSlider method
				// or
				// completely change SSSlider method
				SSSlider.methodName = function () {
					console.log('pluginName methodName called');
				};

				// add new plugin method
				plugin.method = function(){
					//method code
				};

				// add new functionality to SSSlider methods by extending them
				SSSlider.next = (function (fn) {
					return function () {
						fn.call(this);
						console.log('next called');
					};
				})(SSSlider.next);

				//events usage
				SSSlider.$element.on('sss.init', function () {
					console.group("SSSlider");
					console.log("Hello world !!! ");
					console.groupEnd()
				});

			}(SSSlider, options));

		}
	});
})();