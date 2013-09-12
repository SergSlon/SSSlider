/* * * *
 * SSSlider - jQuery modular slider
 *
 * Copyright (c) 2013 Sergei Lyamin
 * https://github.com/SergSlon
 *
 * Licensed under the MIT license:
 * http://www.opensource.org/licenses/mit-license.php
 * */

/*
* EVENTS
* ▬ sss.init
* ▬ sss.beforeChangeSlide
* ▬ sss.afterChangeSlide
* ▬ sss.move
* ▬ sss.prev
* ▬ sss.next
* */

;(function ($, win, doc, undefined) {
	"use strict";

	//==================================================================================================================
	/* Private functions */

	var getSlides = function () {
		// if slide selector isn't defined,
		// search slides by
		// - first child element from slider layout
		// or
		// - first child class selector
		this.options.activeSlide = this.options.activeSlide ||
			this.$element.children()[0].nodeName ||
			'.' + $(this.$element.children()[0]).attr('class');
		this.$slides = this.$element.find(this.options.activeSlide);
		return this.$slides;
	};

	//==================================================================================================================

	var pluginDefaults = {

		// [string] active slide selector
		activeSlide: '.slide',

		// [string] active slide class name
		activeClass: 'active',

		// [int] slides per step
		step: 1,

		// [bool] enable or disable loop
		loop: true,

		// [object] for extending plugins
		// example: autoPlay:{speed:200}
		plugins: ''
	};

	// Constructor function
	var SSSlider = function (element, options, plugins) {
		this.init('SSSlider', element, options, plugins);
	};

	SSSlider.prototype = {
		constructor: SSSlider,

		// SSSlider initialization function
		init: function (name, element, options, plugins) {
			// name is passed for extendability
			this.name = name;
			this.update(element, options, 0 ,plugins).addPlugins();
			this.$element.trigger('sss.init');
			return this;
		},

		// update SSSlider data
		update: function (element, options, activeSlideIndex, plugins) {
			this.element = element;
			this.$element = $(element);
			this.options = $.extend({}, $.fn[this.name].defaults, this.$element.data(), options);
			this.plugins = $.extend({}, $.fn[this.name].plugins, this.$element.data(), plugins);
			this.$slides = getSlides.call(this);

			// define this.$activeSlide
			activeSlideIndex = activeSlideIndex || false;
			this.setActiveSlide(activeSlideIndex);
			return this;
		},

		// initializes SSSlider plugins
		// and pass options to them
		addPlugins: function () {
			var plugins = this.options.plugins,
				pluginOptions;

			if ($.type(plugins) === 'object'){
				for (var plugin in plugins) {
					pluginOptions = undefined;

					if (!$.isEmptyObject(plugins[plugin]))
						pluginOptions = plugins[plugin];

					if ($.isFunction(this.plugins[plugin]))
						this.plugins[plugin](this, pluginOptions, $, win, doc, undefined);
				}
			}
			return this;
		},

		// return FALSE if event was prevented
		/*
		* EXAMPLE:
		*
		* var newEvent = this.attachPreventableEvent(newEvent);
		* if (!newEvent)
		*   return
		* */
		attachPreventableEvent: function (eventName) {
			var event = $.Event(eventName);

			this.$element.trigger(event);
			return (event.isDefaultPrevented() ? false : true);
		},

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

		removeActiveSlideData: function () {
			if (this.$activeSlide)
				this.$activeSlide.removeAttr('data-active').removeClass(this.options.activeClass);
			return this;
		},

		setActiveSlideData: function () {
			if (this.$activeSlide)
				this.$activeSlide.attr('data-active', true).addClass(this.options.activeClass);
			return this;
		},

		setActiveSlide: function (activeSlideIndex) {
			activeSlideIndex = this.validateSlideIndex(activeSlideIndex);

			this.removeActiveSlideData();
			this.$activeSlide = this.$slides.eq(activeSlideIndex);
			this.setActiveSlideData();
			return this;
		},

		getActiveSlideIndex: function () {
			var activeSlideIndex = this.$slides.index(this.$activeSlide);

			//if not defined, set active slide to 0(first element)
			if (activeSlideIndex === -1) {
				this.setActiveSlide();
				activeSlideIndex = 0;
			}

			return activeSlideIndex;
		},

		// at first - search element by selector in slider layout,
		// if nothing is found - search element in the whole document
		// returns jQuery Object
		findBySelector: function(selector){
			// for searching elements outside slider layout
			var $obj;
			$obj = this.$element.find(selector);
			$obj = $obj.length == 0 ? $(selector) : $obj;
			return $obj;
		},

		// method == prev || next
		getFutureSlideIndex: function (method) {
			var operation = (method == 'next') ? '+' : '-';

			switch (operation){
				case '-':
					return ( this.getActiveSlideIndex() - this.options.step );
					break;
				case '+':
					return ( this.getActiveSlideIndex() + this.options.step );
					break;
			}
			return ;
		},

		// change active slide index to the given
		moveTo: function (slideIndex) {
			var loop = this.options.loop,
				maxIndex = this.$slides.length - 1;

			// move or stay in current position
			if ((loop == false && slideIndex <= maxIndex && slideIndex >= 0) || (loop == true)){
				this.$element.trigger('sss.beforeChangeSlide');

				var moveEvent = this.attachPreventableEvent('sss.move');
				if(!moveEvent)
					return;

				this.setActiveSlide(slideIndex);

				this.$element.trigger('sss.afterChangeSlide');
			}
			return this;
		},

		prev: function(){
			var futureSlideIndex = this.getFutureSlideIndex('prev'),
				prevEvent = this.attachPreventableEvent('sss.prev');

			if(!prevEvent)
				return;

			this.moveTo(futureSlideIndex);
			return this;
		},

		next: function(){
			var futureSlideIndex = this.getFutureSlideIndex('next'),
				nextEvent = this.attachPreventableEvent('sss.next');

			if(!nextEvent)
				return;

			this.moveTo(futureSlideIndex);
			return this;
		},

		restart: function (activeSlideIndex, plugins) {
			this.removeActiveSlideData();
			this.update(this.element, this.options, activeSlideIndex, plugins);
			return this;
		}
	};

//======================================================================================================================

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

	// constructor
	$.fn.SSSlider.Constructor = SSSlider;

	// default options
	$.fn.SSSlider.defaults = pluginDefaults;

	// default plugins
	$.fn.SSSlider.plugins = {};

})(window.jQuery, window, document);
