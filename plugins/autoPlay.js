/**
 * @version 1.1
 *
 * @extension auto play plugin
 * @extends $.fn.SSSlider.plugins
 * @requires jQuery SSSlider plugin
 *
 * ======================================================
 * add to the SSSlider "player" object,
 * which has play, stop, pause, restart, setStepTime, getStepTime, getRemaining methods.
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

/**
 * EVENTS
 * @event sss.player.init
 * @event sss.player.play
 * @event sss.player.stop
 * @event sss.player.restart
 * @event sss.player.pause
 * @event sss.player.resume
 **/

;(function (win) {
    "use strict";

    $.extend($.fn.SSSlider.plugins, {

        autoPlay: function (SSSlider, options) {
            var plugin = this,
                defaults = {
                    /**
                     * @property stepTime {number} - milliseconds, time of displaying each slide
                     */
                    stepTime: 2500,

                    /**
                     * @property pauseOnHover {boolean} - enable or disable auto play pause, when hovering or touching the slide
                     */
                    pauseOnHover: false,

                    /**
                     * @property addAdditionalClasses {boolean} - add classes(when paused and resumed) to the slider $element
                     */
                    addAdditionalClasses: false,

                    /**
                     * @property additionalClassesTime {number} - milliseconds, time of "living" resumed class
                     */
                    additionalClassesTime: 1500,

                    /**
                     * @property pauseOnHover {string} - class that adds to the slider when triggered pause on hover
                     */
                    pausedClass: 'paused',

                    /**
                     * @property resumedClass {string} - class that adds to the slider when pause on hover ends
                     */
                    resumedClass: 'resumed'
                };

            plugin.options = SSSlider.plugins.autoPlay.options = $.extend({}, defaults, options);

            /**
             * @param stepTime {number} - milliseconds, time of displaying each slide
             */
            var player = function (stepTime) {
                var start,
                    remaining = stepTime,
                    self = this;

                var playEvent = SSSlider.attachPreventableEvent('sss.player.init');
                if (!playEvent)
                    return;


                this.play = function () {
                    start = new Date();

                    SSSlider.playerID = win.setTimeout(function () {
                        remaining = stepTime;

                        var playEvent = SSSlider.attachPreventableEvent('sss.player.play');
                        if (!playEvent)
                            return;

                        self.play();

                    }, remaining);
                };

                this.stop = function () {
                    var playEvent = SSSlider.attachPreventableEvent('sss.player.stop');
                    if (!playEvent)
                        return;

                    win.clearTimeout(SSSlider.playerID);
                };

                this.pause = function () {
                    var playEvent = SSSlider.attachPreventableEvent('sss.player.pause');
                    if (!playEvent)
                        return;

                    this.stop();
                    remaining -= new Date() - start;
                };

                this.restart = function () {
                    this.stop();
                    remaining = stepTime;
                    this.play();
                    SSSlider.triggerEvent('sss.player.restart');
                };

                this.setStepTime = function (newStepTime) {
                    stepTime = newStepTime || stepTime;
                };

                this.getStepTime = function () {
                    return stepTime;
                };

                this.getRemaining = function () {
                    return remaining;
                }
            };

            plugin.checkPauseOnHover = function () {
                if (plugin.options.pauseOnHover) {
                    SSSlider.$element.one('mousemove touchmove', function () {
                        SSSlider.player.pause();
                    });

                    SSSlider.$element.on('mouseenter touchenter',function () {
                        SSSlider.player.pause();
                    }).on('mouseleave touchleave touchcancel', function () {
                            SSSlider.player.play();
                            SSSlider.triggerEvent('sss.player.resume');
                        });
                }
            };

            plugin.setupAutoPlayLogic = function () {
                var resumeTimerID;

                SSSlider.onEvent('sss.player.play', function () {
                    SSSlider.next();
                });

                SSSlider.onEvent('sss.player.pause', function () {
                    SSSlider.player.isPaused = true;

                    if (plugin.options.addAdditionalClasses)
                        SSSlider.$element.addClass(plugin.options.pausedClass);
                });

                SSSlider.onEvent('sss.player.resume', function () {
                    SSSlider.player.isPaused = false;

                    if (plugin.options.addAdditionalClasses) {
                        SSSlider.$element.
                            removeClass(plugin.options.pausedClass).
                            addClass(plugin.options.resumedClass);

                        if (resumeTimerID !== undefined)
                            win.clearTimeout(resumeTimerID);

                        resumeTimerID = win.setTimeout(
                            function () {
                                SSSlider.$element.removeClass(plugin.options.resumedClass);
                            }, plugin.options.additionalClassesTime
                        );
                    }
                });

                // restart player after change slide
                SSSlider.onEvent('sss.move', function () {
                    SSSlider.player.restart();
                    if (SSSlider.player.isPaused)
                        SSSlider.player.pause();
                });
            };

            plugin.enableAutoPlay = function () {
                var stepTime = Math.abs(plugin.options.stepTime);

                if (stepTime > 0) {
                    plugin.setupAutoPlayLogic();

                    SSSlider.player = new player(plugin.options.stepTime);
                    SSSlider.player.play();
                    SSSlider.player.isPaused = false;

                    plugin.checkPauseOnHover();
                }
            };

            plugin.enableAutoPlay();
        }

    });
})(window);