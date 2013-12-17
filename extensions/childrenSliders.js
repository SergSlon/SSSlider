/**
 * @version 1.0
 *
 * @extension children sliders
 * @extends $.fn.SSSlider.plugins
 * @requires jQuery SSSlider plugin
 *
 * ======================================================
 *
 * add to the SSSlider "addChild" method(for adding children sliders),
 * and save to the element data information about slider parents and children
 *
 * @example
 *      var mainSlider = $('.slider').data('SSSlider');
 *      mainSlider.addChild('.child', { options }, inheritOptionsFromParent);
 *
 *      console.log($('.slider').data('children'));
 *      console.log($('.slider').data('parent'));
 *
 * inheritOptionsFromParent - {boolean}
 *
 * ======================================================
 *
 * @author Sergei Liamin https://github.com/SergSlon
 * @see https://github.com/SergSlon/SSSlider
 *
 * Copyright (c) 2013 Sergei Liamin
 *
 * Licensed under the MIT license:
 * http://www.opensource.org/licenses/mit-license.php
 **/

;(function () {
    "use strict";

    $.extend($.fn.SSSlider.extensions, {

        /**
         * childrenSliders
         *
         * @param SSSlider {object} reference to the SSSlider object
         */
        childrenSliders: function (SSSlider) {

            /**
             * method for adding children sliders
             *
             * @param sliderSelector {string}
             * @param sliderOptions {object}
             * @param inheritOptionsFromParent {boolean} @default true
             * @returns {*|jQuery}
             */
            SSSlider.addChild = function (sliderSelector, sliderOptions, inheritOptionsFromParent) {
                if (inheritOptionsFromParent === undefined)
                    inheritOptionsFromParent = true;

                var children = SSSlider.$element.data('children') || [],
                    self = SSSlider;

                $.each($(sliderSelector), function () {
                    var sliderSelector = this;
                    var $slider = self.findBySelector(sliderSelector),
                        options;

                    options = inheritOptionsFromParent ? $.extend(true, {}, self.options, sliderOptions) : sliderOptions;

                    if ($slider) {
                        children.push($slider[0]);
                        self.$element.data('children', children);
                        $slider.data('parent', self.$element[0]);

                        $slider.SSSlider(options);
                    }
                });

                return($(sliderSelector).last().data('SSSlider'));
            };

        }

    });
})();