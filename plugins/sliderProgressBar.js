/* * * *
 * progress bar for slider
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

		sliderProgressBar: function (SSSlider, options) {
			var plugin = this,
				defaults = {
					// [bool] enable or disable progress bar for whole slider
					sliderBar: true,

					selectors: {
						// [string] slider progress bar selector
						slider: '.slider-progress-bar',
						// [string] filled area class name
						filledArea: '.filled'
					}
				};

			plugin.options = $.extend(true, {}, defaults, options);

			plugin.sliderBar = function () {
				if (plugin.options.sliderBar) {
					var slidesCount = SSSlider.$slides.length,
						slideFilledArea = Math.abs(100 / slidesCount),
						progressBarS = plugin.options.selectors.slider,
						filledAreaS = plugin.options.selectors.filledArea,
						$bar = SSSlider.findBySelector(progressBarS + ' ' + filledAreaS),
						filled;

					SSSlider.$element.on('sss.afterChangeSlide sss.init', function () {
						var currentSlideNumber = SSSlider.$slides.index(SSSlider.$activeSlide) + 1;
						filled = currentSlideNumber * slideFilledArea;

						$bar.css('width', filled + '%');
					});
				}
			};

			plugin.sliderBar();

		}

	});
})();