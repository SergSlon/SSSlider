/**
 * @version 1.1
 *
 * @extension ccs property prefixer
 * @extends $.fn.SSSlider.plugins
 * @requires jQuery SSSlider plugin
 *
 * ======================================================
 * add vendor prefixes to the given property,
 * set given value to this prefixed css properties
 * and apply css rules to the given $element
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

;(function () {
    "use strict";

    $.extend($.fn.SSSlider.extensions, {

        /**
         * @param SSSlider {object} reference to the SSSlider object
         */
        cssPropPrefixer: function (SSSlider) {

            /**
             *
             * @param $element {*|jQuery} element for which the rules will be applied
             * @param cssProp {string} css property that will be prefixed
             * @param propValue {string} css property value
             */
            SSSlider.setPrefixedCssRules = function ($element, cssProp, propValue) {
                var prefixes = ['-webkit-','-moz-','-ms-','-o-',''];

                if($element !== undefined){
                    $.each(prefixes, function(){
                        $element.css(this + cssProp, propValue);
                    });
                } else
                    $.error('can\'t find object ' + $element);
            };

        }

    });
})();