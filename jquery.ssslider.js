/**
 * @version 0.2
 *
 * @extends jQuery.fn
 * @requires jQuery
 *
 * ======================================================
 * SSSlider - jQuery modular slider
 * ======================================================
 *
 * @author Sergei Liamin https://github.com/SergSlon
 * @mail liamin.web@gmail.com
 * @see https://github.com/SergSlon/SSSlider
 *
 * Copyright (c) 2013 Sergei Liamin
 *
 * Licensed under the MIT license:
 * http://www.opensource.org/licenses/mit-license.php
 **/

/**
 * EVENTS
 * @event sss.init              - fire when SSSlider was initialized
 * @event sss.prev              - fire before going to the previous slide (can be prevented)
 * @event sss.next              - fire before going to the next slide (can be prevented)
 * @event sss.beforeChangeSlide - fire before change slide
 * @event sss.move              - fire before change slide (can be prevented)
 * @event sss.afterChangeSlide  - fire after change slide
 **/

;(function ($, undefined) {
    "use strict";

    //==================================================================================================================
    /* Private functions */

    /**
     * preventing a piling up of event functions when using "onEvent" method in loops
     *
     * @private
     * @returns {boolean} true if duplicated
     */
    var _eventFunctionIsDuplicated = function (event, fn) {
        var duplicated = false,
            duplicatedIndex;

        $.each(this._events[event], function (idx) {
            if ("" + this == "" + fn) {
                duplicated = true;
                duplicatedIndex = idx;
                // finish the loop
                return false;
            }
        });

        if (duplicated)
            this._events[event][duplicatedIndex] = fn;

        return duplicated;
    };

    /**
     * for calling initialized plugins
     *
     * @private
     * @param pluginFunction {function}
     * @param pluginOptions {object}
     */
    var _callPlugin = function (pluginFunction, pluginOptions) {
        if ($.isFunction(pluginFunction)) {
            // inside plugin, assign "this" variable equals to the "pluginFunction" variable
            var callPlugin = $.proxy(pluginFunction, $.extend(true, {}, pluginFunction), this, pluginOptions);

            callPlugin();
        }
    };

    //==================================================================================================================

    var pluginDefaults = {

        /**
         * @property {string} slideSelector - slide selector
         */
        slideSelector: '.slide',

        /**
         * @property {string} activeClass - active slide class name
         */
        activeClass: 'active',

        /**
         * @property {number} step - slides per step
         */
        step: 1,

        /**
         * @property {bool} loop -  enable or disable loop
         */
        loop: true,

        /**
         * @property {object} plugins - for extending plugins
         *
         * @example
         *      pluginName:{
		 *          optionName:optionValue
		 *      }
         */
        plugins: {}
    };

    /**
     * main SSSlider class.
     *
     * @class SSSlider
     * @param {HTMLElement} element - HTML DOM object on which plugin will be applied
     * @param {Object} options - options that configure the plugin  @link {$.fn.SSSlider.defaults}
     * @param plugins {Object,String} - plugins that are connected to the page
     * @constructor
     */
    var SSSlider = function (element, options, plugins) {
        this.init(element, options, plugins);
    };

    /**
     * SSSlider methods
     */
    SSSlider.prototype = {
        constructor: SSSlider,

        /**
         * SSSlider initialization method
         *
         * @chainable
         * @param {HTMLElement} element - HTML DOM object on which plugin will be applied
         * @param {Object} options - options that configure the plugin  @link {$.fn.SSSlider.defaults}
         * @param plugins {Object,String} - plugins that are connected to the page
         */
        init: function (element, options, plugins) {
            this._events = this._events || [];
            this.update(element, options, 0, plugins);
            this.addPlugins();
            this.triggerEvent('sss.init');
            this.$element.trigger('sss.init');
            return this;
        },

        /**
         * if slide selector isn't defined, search slides by
         *  - first child element from slider layout
         *  or
         *  - first child class selector
         *
         * @returns {SSSlider.$slides}
         */
        getSlides: function () {
            this.options.slideSelector = this.options.slideSelector ||
                this.$element.children()[0].nodeName ||
                '.' + $(this.$element.children()[0]).attr('class');
            this.$slides = this.$element.find(this.options.slideSelector);
            return this.$slides;
        },

        /**
         * update SSSlider data - define main SSSlider variables
         *
         * @chainable
         * @param {HTMLElement} element - HTML DOM object on which plugin will be applied
         * @param {Object} options - options that configure the plugin @link {$.fn.SSSlider.defaults}
         * @param {number} activeSlideIndex - index of the active slide
         * @param plugins {Object,String} - plugins that are connected to the page
         * @returns {SSSlider}
         */
        update: function (element, options, activeSlideIndex, plugins) {
            this.element = element;
            this.$element = $(element);
            this.options = $.extend({}, $.fn.SSSlider.defaults, this.$element.data(), options);
            this.$slides = this.getSlides();
            this.plugins = plugins;

            activeSlideIndex = activeSlideIndex || false;
            this.setActiveSlide(activeSlideIndex);

            return this;
        },

        /**
         * initializes and call SSSlider plugins from SSSlider options,
         * and pass plugin options to them
         *
         * @chainable
         * @returns {SSSlider}
         */
        addPlugins: function () {
            var plugins = this.options.plugins,
                pluginFunction,
                pluginOptions;

            if ($.type(plugins) === 'object') {
                for (var plugin in plugins) {
                    pluginFunction = this.plugins[plugin];
                    pluginOptions = undefined;

                    if (!$.isEmptyObject(plugins[plugin]))
                        pluginOptions = plugins[plugin];

                    _callPlugin.call(this, pluginFunction, pluginOptions);
                }
            }
            return this;
        },

        /**
         * add handler for the event, this is like $.on,
         * but for specific slider (in cases when you have slider in slider)
         *
         * @chainable
         * @param events {string}
         * @param fn {function}
         * @returns {SSSlider}
         */
        onEvent: function (events, fn) {
            var self = this,
                eventsArray = events.split(' ');

            $.each(eventsArray, function (idx, event) {
                if (event) {
                    if (!self._events[event])
                        self._events[event] = [];

                    if (!_eventFunctionIsDuplicated.call(self, event, fn))
                        self._events[event].push(fn);
                }
            });

            return this;
        },

        /**
         * call handlers for the event which added by "onEvent" method
         *
         * @chainable
         * @param event {string}
         * @returns {SSSlider}
         */
        triggerEvent: function (event) {
            if (this._events[event] !== undefined) {
                var functions = this._events[event];
                $.each(functions, function (idx, func) {
                    func();
                });
            }

            return this;
        },

        /**
         * return FALSE if event was prevented
         *
         * @param eventName {string}
         * @example
         *      var newEvent = this.attachPreventableEvent('eventName');
         *      if (!newEvent)
         *          return;
         * @returns {boolean}
         */
        attachPreventableEvent: function (eventName) {
            var event = $.Event(eventName);

            this.triggerEvent(eventName);
            this.$element.trigger(event);

            return (event.isDefaultPrevented() ? false : true);
        },

        /**
         * @param slideIndex {number}
         * @returns {number} correct slide index
         */
        validateSlideIndex: function (slideIndex) {
            var defaultSlideIndex = 0,
                slidesCount = this.$slides.length,
                maxIndex = slidesCount - 1;

            slideIndex = (slideIndex === false ? defaultSlideIndex : slideIndex);

            if (slideIndex > maxIndex)
                slideIndex = slideIndex - slidesCount;
            else if (slideIndex < 0)
                slideIndex = slidesCount + slideIndex;

            return slideIndex;
        },

        /**
         * remove all added data from the active slide
         *
         * @chainable
         * @returns {SSSlider}
         */
        removeActiveSlideData: function () {
            if (this.$activeSlide)
                this.$activeSlide.removeAttr('data-active').removeClass(this.options.activeClass);
            return this;
        },

        /**
         * add data to the active slide
         *
         * @returns {SSSlider}
         */
        setActiveSlideData: function () {
            if (this.$activeSlide)
                this.$activeSlide.attr('data-active', true).addClass(this.options.activeClass);
            return this;
        },

        /**
         * @chainable
         * @param activeSlideIndex {number}
         * @returns {SSSlider}
         */
        setActiveSlide: function (activeSlideIndex) {
            activeSlideIndex = this.validateSlideIndex(activeSlideIndex);

            this.removeActiveSlideData();
            this.$activeSlide = this.$slides.eq(activeSlideIndex);
            this.setActiveSlideData();
            return this;
        },

        /**
         * @returns {number} active slide index
         */
        getActiveSlideIndex: function () {
            var activeSlideIndex = this.$slides.index(this.$activeSlide);

            //if not defined, set active slide to 0(first element)
            if (activeSlideIndex === -1) {
                this.setActiveSlide();
                activeSlideIndex = 0;
            }

            return activeSlideIndex;
        },

        /**
         * at first - search element by selector in slider layout,
         * if nothing is found - search element in the whole document
         *
         * @param selector
         * @returns {*|object} jQuery Object
         */
        findBySelector: function (selector) {
            // for searching elements outside slider layout
            var $obj;
            $obj = this.$element.find(selector);
            $obj = $obj.length == 0 ? $(selector) : $obj;

            if ($obj.length !== 0)
                return $obj;
        },

        /**
         * check if can move to the given slide index
         *
         * @param slideIndex {number}
         * @returns {boolean}
         */
        canMoveTo: function (slideIndex) {
            var loop = this.options.loop,
                maxIndex = this.$slides.length - 1;

            return !!((loop == false && slideIndex <= maxIndex && slideIndex >= 0) || (loop == true));
        },


        /**
         * change active slide index to the given,
         * assign "this.futureSlideIndex" and "this.$futureSlide" variables for using with "sss.beforeChangeSlide" event
         *
         * @chainable
         * @param slideIndex {number}
         * @returns {SSSlider}
         */
        moveTo: function (slideIndex) {

            if (this.canMoveTo(slideIndex)) {

                this.futureSlideIndex = slideIndex;
                this.$futureSlide = this.$slides.eq(slideIndex);

                if (this.getActiveSlideIndex() === this.futureSlideIndex)
                    return this;

                this.triggerEvent('sss.beforeChangeSlide');
                this.$element.trigger('sss.beforeChangeSlide');

                var moveEvent = this.attachPreventableEvent('sss.move');
                if (!moveEvent)
                    return;

                this.setActiveSlide(slideIndex);

                delete this.futureSlideIndex;
                delete this.$futureSlide;

                this.triggerEvent('sss.afterChangeSlide');
                this.$element.trigger('sss.afterChangeSlide');

                return this;
            }

            return this;
        },

        /**
         * move to the prev slide
         *
         * @chainable
         * @returns {SSSlider}
         */
        prev: function () {
            var futureSlideIndex = this.getActiveSlideIndex() - this.options.step,
                prevEvent = this.attachPreventableEvent('sss.prev');

            if (!prevEvent)
                return;

            this.moveTo(futureSlideIndex);
            return this;
        },

        /**
         * move to the next slide
         *
         * @chainable
         * @returns {SSSlider}
         */
        next: function () {
            var futureSlideIndex = this.getActiveSlideIndex() + this.options.step,
                nextEvent = this.attachPreventableEvent('sss.next');

            if (!nextEvent)
                return;

            this.moveTo(futureSlideIndex);
            return this;
        },

        /**
         * restart the plugin with the given options
         *
         * @chainable
         * @param activeSlideIndex {number}
         * @param plugins {object}
         * @returns {SSSlider}
         */
        restart: function (activeSlideIndex, plugins) {
            this.removeActiveSlideData();
            this.update(this.element, this.options, activeSlideIndex, plugins);
            return this;
        }
    };

//======================================================================================================================

    /**
     * applies SSSlider plugin to one or more jQuery objects.
     * @example
     *          $('.slider').SSSlider({...});
     *          var slider = $('.slider').data('SSSlider');
     *          slider(method, options)
     *
     * @param option
     * @param param
     * @returns {*}
     * @constructor
     */
    $.fn.SSSlider = function (option, param) {
        return this.each(function () {
            var $this = $(this),
                data = $this.data('SSSlider'),
                options = typeof option == 'object' && option,
                plugins = $.extend({}, $.fn.SSSlider.plugins);
            if (!data) $this.data('SSSlider', (data = new SSSlider(this, options, plugins)));
            if (typeof option == 'string') data[option].apply(data, param);
        });
    };

    /**
     * set the constructor
     * @type {Function}
     */
    $.fn.SSSlider.Constructor = SSSlider;

    /**
     * set default options
     *
     * @type {{slideSelector: string, activeClass: string, step: number, loop: boolean, plugins: {}}}
     */
    $.fn.SSSlider.defaults = pluginDefaults;

    /**
     * set default plugins
     */
    $.fn.SSSlider.plugins = {};

})(window.jQuery);