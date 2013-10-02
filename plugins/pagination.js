/* * * *
 * pagination buttons (one button for each slide)
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

		pagination: function (SSSlider, options) {
			var plugin = this,
				defaults = {
					// [bool] enable or disable buttons for the each slide
					buttons: true,
					// [bool] show the number of the button
					buttonNumber: false,
					// [bool] show the text of the button
					buttonText: true,

					// [string] active button class
					activeButtonClass: 'active',

					selectors: {
						// [string] slider buttons container selector
						container: '.buttons',
						// [string] slide button selector
						button: '.slide-btn',
						// [string] slide button number container selector
						buttonNumber: '.number',
						// [string] slide button text container selector
						buttonText: '.text'
					}
				};

			plugin.options = $.extend(true, {}, defaults, options);

			plugin.enableSliderButtons = function () {
				var $buttonsContainer = SSSlider.findBySelector(plugin.options.selectors.container),
					buttonS = plugin.options.selectors.button,
					buttonsHTML = '',
					$buttons,
					slidesCount = SSSlider.$slides.length;

				var prepareNumberHtml = function (slideIndex) {
					if (plugin.options.buttonNumber) {
						var numberHtml;
						numberHtml =
							'<div class="' + plugin.options.selectors.buttonNumber.slice(1) + '">' +
								(slideIndex + 1) +
							'</div>';
						return numberHtml;
					}
					return '';
				};

				var prepareTextHtml = function (slideIndex) {
					if (plugin.options.buttonText) {
						var buttonText = SSSlider.$slides.eq(slideIndex).data('text'),
							textHtml;
						if (buttonText !== undefined) {
							textHtml =
								'<div class="' + plugin.options.selectors.buttonText.slice(1) + '">' +
									buttonText +
								'</div>';
							return textHtml;
						}
					}
					return '';
				};

				var generateButtonsHtml = function () {
					for (var slideIndex = 0; slideIndex < slidesCount; slideIndex++) {
						buttonsHTML += '<div class="' + buttonS.slice(1) + '">';
							buttonsHTML += prepareNumberHtml(slideIndex);
							buttonsHTML += prepareTextHtml(slideIndex);
						buttonsHTML += '</div>';
					}
				};

				generateButtonsHtml();
				$buttonsContainer.append(buttonsHTML);
				$buttons = $buttonsContainer.find(buttonS);

				var addActiveClass = function (buttonIndex) {
					$buttons.eq(buttonIndex).addClass(plugin.options.activeButtonClass);
				};

				var removeActiveClass = function (buttonIndex) {
					$buttons.eq(buttonIndex).removeClass(plugin.options.activeButtonClass);
				};

				SSSlider.$element.on('sss.init', function () {
					var currentIndex = SSSlider.getActiveSlideIndex();
					addActiveClass(currentIndex);
				});

				SSSlider.$element.on('sss.beforeChangeSlide', function () {
					var oldIndex = SSSlider.getActiveSlideIndex();
					removeActiveClass(oldIndex);
				});

				SSSlider.$element.on('sss.afterChangeSlide', function () {
					var currentIndex = SSSlider.getActiveSlideIndex();
					addActiveClass(currentIndex);
				});

				$buttonsContainer.on('click touch', buttonS, function () {
					var newIndex = $buttons.index(this);
					SSSlider.moveTo(newIndex);
				});
			};

			if (plugin.options.buttons)
				plugin.enableSliderButtons();

		}

	});
})();