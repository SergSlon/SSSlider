/* * * *
 * navigation buttons (prev and next)
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
		navigation: function (SSSlider, options) {

			(function (SSSlider, options) {
				var plugin = {},
					defaults = {
						// [bool] enable or disable handler of the next slide button
						nextButton: true,
						// [bool] enable or disable handler of the previous slide button
						prevButton: true,

						selectors: {
							// [string] next slide button selector
							next: '.next',
							// [string] prev slide button selector
							prev: '.prev'
						}
					};

				plugin.options = $.extend(true, {}, defaults, options);

				plugin.enableNextButton = function () {
					var $nextButton = SSSlider.findBySelector(plugin.options.selectors.next);
					$nextButton.on('click touch', function () {
						SSSlider.next();
					});
				};

				plugin.enablePrevButton = function () {
					var $prevButton = SSSlider.findBySelector(plugin.options.selectors.prev);
					$prevButton.on('click touch', function () {
						SSSlider.prev();
					});
				};

				if (plugin.options.nextButton)
					plugin.enableNextButton();

				if (plugin.options.prevButton)
					plugin.enablePrevButton();

			}(SSSlider, options, $));

		}
	});

})();