/* * * *
 * random slide
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

		randomSlide: function (SSSlider, options) {
			var plugin = this,
				defaults = {
					// [bool] enable or disable random slide (next or prev slide will be chosen randomly)
					alwaysRandom: true,
					// [bool] enable or disable random slide button
					randomSlideButton: false,

					selectors: {
						// [string] random slide button selector
						random: '.random-slide'
					}
				};

			plugin.options = $.extend(true, {}, defaults, options);

			plugin.getRandomSlide = function () {
				var slidesCount = SSSlider.$slides.length,
					numberOfLastIndexesToRemember = Math.floor(slidesCount / 2),
					current = SSSlider.getActiveSlideIndex(),
					newIndex;

				this.getRandomIndex = function () {
					return (Math.floor(Math.random() * slidesCount))
				};

				this.getLastIndexes = function () {
					this.lastIndexes = this.lastIndexes || [current];
					if (this.lastIndexes.length > numberOfLastIndexesToRemember)
						this.lastIndexes.length = numberOfLastIndexesToRemember;
				};

				this.getNewIndex = function () {
					newIndex = this.getRandomIndex();
					this.getLastIndexes();
					// if new index isn't in the last indexes array
					while ($.inArray(newIndex, this.lastIndexes) !== -1) {
						newIndex = this.getRandomIndex();
					}
					this.lastIndexes.unshift(newIndex);
					return newIndex;
				};

				newIndex = this.getNewIndex();

				return(newIndex);
			};

			plugin.enableRandomSlideButton = function () {
				var $randomButton = SSSlider.findBySelector(plugin.options.selectors.random),
					newIndex;

				$randomButton.on('click touch', function () {
					newIndex = plugin.getRandomSlide();
					SSSlider.moveTo(newIndex);
				});
			};

			plugin.enableRandomSlide = function () {
				SSSlider.getFutureSlideIndex = (function (fn) {
					return function () {
						return plugin.getRandomSlide();
					};
				})(SSSlider.getFutureSlideIndex);
			};

			if (plugin.options.alwaysRandom)
				plugin.enableRandomSlide();

			if (plugin.options.randomSlideButton)
				plugin.enableRandomSlideButton();

		}

	});
})();