/* G-Alert */
(function ($) {
	"use strict";

	$.fn.gAlert = function () {

		return this.each(function () {
			var alert = $(this),
				alertClose = alert.find('.g-alert-close');

			if (alertClose) {
				alertClose.click(function(){
					alert.animate({ height: '0', margin: 0}, 400, function(){
						alert.css('display', 'none');
					});
				});
			}
		});
	};
})(jQuery);

jQuery(document).ready(function() {
	"use strict";

	jQuery('.g-alert').gAlert();
});

/* MD Ripples */
(function ($) {
	"use strict";

	var $body = document.body || document.documentElement,
		$bodyStyle = $body.style,
		isTransitionsSupported = $bodyStyle.transition !== undefined || $bodyStyle.WebkitTransition !== undefined,
		isTouch = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent),
		removeRipple = function($ripple) {
			$ripple.off();

			if (isTransitionsSupported) {
				$ripple.addClass("ripple-out");
			} else {
				$ripple.animate({
					"opacity": 0
				}, 100, function() {
					$ripple.trigger("transitionend");
				});
			}

			$ripple.on("transitionend webkitTransitionEnd oTransitionEnd MSTransitionEnd", function(){
				$ripple.remove();
			});
		};

	$.fn.mdRipple = function(){
		return this.each(function(){
			var $element = $(this),
				$container, containerOffset,
				startTimer = null;

			if ( ! $element.find(".ripple-container").length){
				$element.append('<span class="ripple-container"></span>');
			}

			$container = $element.find(".ripple-container");

			$element.on('mousedown touchstart', function(e){
				var offsetLeft, offsetTop,
					$ripple = $('<span class="ripple"></span>'),
					rippleSide = Math.max($element.outerWidth(), $element.outerHeight()),
					rippleSize = Math.max($element.outerWidth(), $element.outerHeight()) / Math.max(20, $ripple.outerWidth()) * 2.5;

				containerOffset = $container.offset();

				// get pointer position
				if ( ! isTouch){
					offsetLeft = e.pageX - containerOffset.left;
					offsetTop = e.pageY - containerOffset.top;
				} else {
					e = e.originalEvent;
					if (e.touches.length === 1) {
						offsetLeft = e.touches[0].pageX - containerOffset.left;
						offsetTop = e.touches[0].pageY - containerOffset.top;
					} else {
						return;
					}
				}

				$ripple.css({left: offsetLeft, top: offsetTop});
				(function() { return window.getComputedStyle($ripple[0]).opacity; })();
				$container.append($ripple);

				startTimer = setTimeout(function(){
					$ripple.css({
						"-webkit-transform": "scale(" + rippleSize + ")",
						"transform": "scale(" + rippleSize + ")"
					});
					$ripple.addClass("ripple-on");
					$ripple.data("animating", "on");
					$ripple.data("mousedown", "on");
				}, 25);

				setTimeout(function() {
					$ripple.data("animating", "off");
					if ($ripple.data("mousedown") == "off") {
						removeRipple($ripple);
					}
				}, 700);

			});

			$element.on('mouseup mouseleave', function(e){
				clearTimeout(startTimer);
				$element.find('.ripple').each(function(){
					var $ripple = $(this);
					$ripple.data("mousedown", "off");
					if ($ripple.data("animating") == "off"){
						removeRipple($ripple);
					}
				});

			});


		});
	};
})(jQuery);

jQuery(document).ready(function() {
	"use strict";

	jQuery('.g-btn, .l-header .w-nav-anchor, .w-portfolio-item-h, .w-tabs-item').mdRipple();
});

/* W-Lang */
(function ($) {
	"use strict";

	$.fn.wLang = function () {

		return this.each(function () {
			var langWidget = $(this),
				langList = langWidget.find('.w-lang-list'),
				currentLang = langWidget.find('.w-lang-current');

			langList.slideUp(0);

			currentLang.click(function() {
				langWidget.addClass('active');
				langList.slideDown(200);
			});

			$(document).mouseup(function (e)
			{
				if (langWidget.has(e.target).length === 0)
				{
					langList.slideUp(200, function() {
						langWidget.removeClass('active');
					});
				}
			});
		});
	};
})(jQuery);

jQuery(document).ready(function() {
	"use strict";

	jQuery('.w-lang').wLang();
});

/* W-Search */
(function ($) {
	"use strict";

	$.fn.wSearch = function () {

		return this.each(function(){
			var $this = $(this),
				searchForm = $this.find('.w-search-form'),
				searchShow = $this.find('.w-search-show'),
				searchClose = $this.find('.w-search-close'),
				searchInput = searchForm.find('.w-search-input input'),
				searchOverlay = $this.find('.w-search-form-overlay'),
				$window = $(window),
				searchOverlayInitRadius = 25,
				$body = document.body || document.documentElement,
				$bodyStyle = $body.style,
				showHideTimer = null,
				searchHide = function(){
					searchForm.css({
						'-webkit-transition': 'opacity 0.4s',
						transition: 'opacity 0.4s'
					});
					window.setTimeout(function(){
						searchOverlay
							.removeClass('overlay-on')
							.addClass('overlay-out')
							.css({
								"-webkit-transform": "scale(0.1)",
								"transform": "scale(0.1)"
							});
						searchForm.css('opacity', 0);
						clearTimeout(showHideTimer);
						showHideTimer = window.setTimeout(function(){
							searchForm.css('display', 'none');
							searchOverlay.css('display', 'none');
						}, 700);
					}, 25);
				};

			// Handling virtual keyboards at touch devices
			if ( ! jQuery('html').hasClass('no-touch')){
				searchInput
					.on('focus', function(){
						// Transforming hex to rgba
						var originalColor = searchOverlay.css('background-color'),
							overlayOpacity = searchOverlay.css('opacity'),
							matches;
						// RGB Format
						if (matches = /^rgb\((\d+), (\d+), (\d+)\)$/.exec(originalColor)){
							searchForm.css('background-color', "rgba("+parseInt(matches[1])+","+parseInt(matches[2])+","+parseInt(matches[3])+", "+overlayOpacity+")");
						}
						// Hex format
						else if (matches = /^#([\da-fA-F]{2})([\da-fA-F]{2})([\da-fA-F]{2})$/.exec(originalColor)){
							searchForm.css('background-color', "rgba("+parseInt(matches[1], 16)+","+parseInt(matches[2], 16)+","+parseInt(matches[3], 16)+", "+overlayOpacity+")");
						}
						// Fault tolerance
						else {
							searchForm.css('background-color', originalColor);
						}
						searchOverlay.addClass('mobilefocus');
					})
					.on('blur', function(){
						searchOverlay.removeClass('mobilefocus');
						searchForm.css('background-color', 'transparent');
					});
			}

			searchShow.click(function(){
				var searchPos = searchShow.offset(),
					searchWidth = searchShow.width(),
					searchHeight = searchShow.height();
				// Preserving scroll position
				searchPos.top -= $window.scrollTop();
				searchPos.left -= $window.scrollLeft();
				var overlayX = searchPos.left+searchWidth/2,
					overlayY = searchPos.top+searchHeight/2,
					winWidth = $window.width(),
					winHeight = $window.height(),
					// Counting distance to the nearest screen corner
					overlayRadius = Math.sqrt(Math.pow(Math.max(winWidth - overlayX, overlayX), 2) + Math.pow(Math.max(winHeight - overlayY, overlayY), 2)),
					overlayScale = (overlayRadius+15)/searchOverlayInitRadius;

				searchOverlay.css({
					width: searchOverlayInitRadius*2,
					height: searchOverlayInitRadius*2,
					left: overlayX,
					top: overlayY,
					"margin-left": -searchOverlayInitRadius,
					"margin-top": -searchOverlayInitRadius
				});
				searchOverlay
					.removeClass('overlay-out')
					.show();
				searchForm.css({
					opacity: 0,
					display: 'block',
					'-webkit-transition': 'opacity 0.4s 0.3s',
					transition: 'opacity 0.4s 0.3s'
				});
				window.setTimeout(function(){
					searchOverlay
						.addClass('overlay-on')
						.css({
							"-webkit-transform": "scale(" + overlayScale + ")",
							"transform": "scale(" + overlayScale + ")"
						});
					searchForm.css('opacity', 1);
					clearInterval(showHideTimer);
					showHideTimer = window.setTimeout(function() {
						searchInput.focus();
					}, 700);
				}, 25);
			});

			searchInput.keyup(function(e) {
				if (e.keyCode == 27) searchHide();
			});

			searchClose.click(searchHide);
		});
	};
})(jQuery);

jQuery(document).ready(function() {
	"use strict";

	jQuery('.l-header .w-search').wSearch();
});

/* W-Tabs */
(function ($) {
	"use strict";

	$.fn.wTabs = function () {

		return this.each(function () {
			var tabs = $(this),
				itemsList = tabs.find('.w-tabs-list'),
				items = tabs.find('.w-tabs-item'),
				sections = tabs.find('.w-tabs-section'),
				resizeTimer = null,
				itemsWidths = [],
				running = false,
				firstActiveItem = tabs.find('.w-tabs-item.active').first(),
				firstActiveSection = tabs.find('.w-tabs-section.active').first(),
				activeIndex = null,
				lineCSS = '',
				tabsID = tabs.attr('id'),
				measureWidths = function(){
					// We hide active line temporarily to count tab sizes properly
					tabs.addClass('measure');
					itemsWidths = [];
					items.each(function(){
						itemsWidths.push($(this).outerWidth(true));
					});
					tabs.removeClass('measure');
				};

			if (itemsList.length) {
				var itemsCount = itemsList.find('.w-tabs-item').length;
				if (itemsCount) {
					itemsList.addClass('items_'+itemsCount);
				}
			}

			if ( ! tabs.hasClass('layout_accordion')) {
				if ( ! firstActiveSection.length) {
					firstActiveItem = tabs.find('.w-tabs-item').first();
					firstActiveSection = tabs.find('.w-tabs-section').first();
				}

				tabs.find('.w-tabs-item.active').removeClass('active');
				tabs.find('.w-tabs-section.active').removeClass('active');

				firstActiveItem.addClass('active');
				firstActiveSection.addClass('active');

				lineCSS = '<style>';

				for (var i = 1; i < itemsCount; i++) {
					var shift = (itemsCount - i) * 100;
					lineCSS += ' #'+tabsID+' .w-tabs-list .w-tabs-item:nth-child('+i+').active ~ .w-tabs-item:last-child::before {'+
							'-webkit-transform: translate3d(-'+shift+'%,0,0);'+
							'transform: translate3d(-'+shift+'%,0,0); }';
				}

				lineCSS += '</style>';

				tabs.append(lineCSS);


			} else {
				$(sections).each(function(sectionIndex, section) {
					if ($(section).hasClass('active')) {
						activeIndex = sectionIndex;
					}
				});
			}

			measureWidths();

			function tabs_resize(){
				if (tabs.hasClass('layout_accordion') && ! tabs.data('accordionLayoutDynamic')) return;
				if ( ! tabs.hasClass('layout_accordion')) measureWidths();
				var maxTabWidth = Math.floor(tabs.width() / itemsWidths.length),
					overflown = false;
				for (var i = 0; i < itemsWidths.length; i++){
					if (itemsWidths[i] >= maxTabWidth) overflown = true;
				}

				tabs.data('accordionLayoutDynamic', overflown);
				tabs.toggleClass('layout_accordion', overflown);
			}

			tabs_resize();

			$(window).resize(function(){
				window.clearTimeout(resizeTimer);
				resizeTimer = window.setTimeout(function(){
					tabs_resize();
				}, 50);

			});

			sections.each(function(index){
				var item = $(items[index]),
					section = $(sections[index]),
					section_title = section.find('.w-tabs-section-header'),
					section_content = section.find('.w-tabs-section-content');

				if (section.hasClass('active')) {
					section_content.slideDown();
				}

				section_title.click(function(){
					var currentHeight = 0;

					if (tabs.hasClass('type_toggle')) {
						if ( ! running) {
							if (section.hasClass('active')) {
								running = true;
								if (item) {
									item.removeClass('active');
								}
								section_content.slideUp(null, function(){
									section.removeClass('active');
									running = false;
									$(window).resize();
								});
							} else {
								running = true;
								if (item) {
									item.addClass('active');
								}
								section_content.slideDown(null, function(){
									section.addClass('active');
									running = false;
									section.find('.w-map').each(function(map){
										var mapObj = jQuery(this).data('gMap.reference'),
											center = mapObj.getCenter();

										google.maps.event.trigger(jQuery(this)[0], 'resize');
										if (jQuery(this).data('gMap.infoWindows').length) {
											jQuery(this).data('gMap.infoWindows')[0].open(mapObj, jQuery(this).data('gMap.overlays')[0]);
										}
										mapObj.setCenter(center);
									});

//									section.find(".fotorama").fotorama();

									$(window).resize();
								});
							}
						}


					} else if (( ! section.hasClass('active')) && ( ! running)) {
						running = true;
						items.each(function(){
							if ($(this).hasClass('active')) {
								$(this).removeClass('active');
							}
						});

						if (item) {
							item.addClass('active');
						}

						sections.each(function(){
							if ($(this).hasClass('active')) {
								currentHeight = $(this).find('.w-tabs-section-content').height();
								if ( ! tabs.hasClass('layout_accordion')) {
									tabs.css({'height': tabs.height(), 'overflow': 'hidden'});
									setTimeout(function(){ tabs.css({'height': '', 'overflow': ''}); }, 300);
								}
								$(this).find('.w-tabs-section-content').slideUp();
							}
						});



						section_content.slideDown(null, function(){
							sections.each(function(){
								if ($(this).hasClass('active')) {
									$(this).removeClass('active');
								}
							});
							section.addClass('active');
							activeIndex = index;

							if (tabs.hasClass('layout_accordion') && jQuery(window).width() < 768) {
								jQuery("html, body").animate({
									scrollTop: section.offset().top-(jQuery('.l-header').height())+"px"
								}, {
									duration: 1200,
									easing: "easeInOutQuint"
								});
							}

							running = false;
							section.find('.w-map').each(function(map){
								var mapObj = jQuery(this).data('gMap.reference'),
									center = mapObj.getCenter();

								google.maps.event.trigger(jQuery(this)[0], 'resize');
								if (jQuery(this).data('gMap.infoWindows').length) {
									jQuery(this).data('gMap.infoWindows')[0].open(mapObj, jQuery(this).data('gMap.overlays')[0]);
								}
								mapObj.setCenter(center);
							});

//							section.find(".fotorama").fotorama();

							$(window).resize();
						});



					}

				});

				if (item)
				{
					item.click(function(){
						section_title.click();
					});
				}


			});

		});
	};
})(jQuery);

jQuery(document).ready(function() {
	"use strict";

	jQuery('.w-tabs').wTabs();
});

/* W-Timeline */
(function ($) {
	"use strict";

	$.fn.wTimeline = function () {

		return this.each(function () {
			var timeline = $(this),
				items = timeline.find('.w-timeline-item'),
				sections = timeline.find('.w-timeline-section'),
				running = false,
				sectionsWrapper = timeline.find('.w-timeline-sections'),
				sumWidth = 0,
				sectionsContainer = $('<div></div>', {id: 'section_container'}).css({position: 'relative'}),
				resizeTimer = null,
				sectionsPadding = $(sections[0]).innerWidth() - $(sections[0]).width(),
				activeIndex = 0,
				activeIndexFound = 0,
				sectionsContainerPresent,
				firstActiveItem = timeline.find('.w-timeline-item.active').first(),
				firstActiveSection = timeline.find('.w-timeline-section.active').first();

			if ( ! firstActiveItem.length) {
				firstActiveItem = timeline.find('.w-timeline-item').first();
				firstActiveSection = timeline.find('.w-timeline-section').first();
			}

			timeline.find('.w-timeline-item.active').removeClass('active');
			timeline.find('.w-timeline-section.active').removeClass('active');

			firstActiveItem.addClass('active');
			firstActiveSection.addClass('active');

			$(sections).each(function(sectionIndex, section) {
				if ($(section).hasClass('active')) {
					activeIndex = sectionIndex;
				}
			});

			$(sections).css({display: 'block'});
			$(sectionsWrapper).css({position: 'relative'});



			function timeline_resize(){
				sectionsWrapper.css({width: timeline.innerWidth()-sectionsWrapper.css('border-left-width')-sectionsWrapper.css('border-right-width')+'px'});
				$(sections).css({width: sectionsWrapper.innerWidth()-sectionsPadding+'px'});

				if ($(window).width() < 768 && ( ! window.disableResponsiveLayout)) {
					if ( ! timeline.hasClass('type_vertical')) {
						timeline.addClass('type_vertical');
					}
					if (sectionsContainerPresent === true || sectionsContainerPresent === undefined ){
						sectionsWrapper.css({ height: 'auto', overflow: 'visible'});
						$(sections).css({float: 'none'});
						$(sections).each(function(sectionIndex, section) {
							var section_content = $(section).find('.w-timeline-section-content');
							if (!$(section).hasClass('active')) {
								section_content.css('display', 'none');
							}
							sectionsWrapper.append(section);
						});
						sectionsContainer.remove();
						sectionsContainerPresent = false;
					}
				} else {
					if (timeline.hasClass('type_vertical')) {
						timeline.removeClass('type_vertical');
					}
					sectionsWrapper.css({ height: $(sections[activeIndex]).outerHeight()+'px', overflow: 'hidden'});
					sumWidth = sections.length*(sectionsWrapper.innerWidth());
					var leftPos = -activeIndex*(sectionsWrapper.innerWidth());
					sectionsContainer.css({width: sumWidth+'px', height: $(sections[activeIndex]).outerHeight()+'px', left: leftPos});
					if (sectionsContainerPresent === false || sectionsContainerPresent === undefined){
						sectionsContainer = $('<div></div>', {id: 'section_container'}).css({position: 'relative'});
						$(sections).css({float: 'left'});
						$(sections).each(function(sectionIndex, section) {
							var section_content = $(section).find('.w-timeline-section-content');
							section_content.css({'display': 'block', 'height': 'auto'});
							sectionsContainer.append(section);
						});

						sectionsContainer.css({width: sumWidth+'px', height: $(sections[activeIndex]).outerHeight()+'px', left: leftPos});
						sectionsWrapper.append(sectionsContainer);
						sectionsContainerPresent = true;
					}
				}
			}

			timeline_resize();

			$(window).resize(function(){
				window.clearTimeout(resizeTimer);
				resizeTimer = window.setTimeout(function(){
					timeline_resize();
				}, 50);

			});

			sections.each(function(index, element){
				var section = $(element),
					item = $(items[index]),
					section_title = section.find('.w-timeline-section-title'),
					section_content = section.find('.w-timeline-section-content');

				if(item.length)
				{
					item.click(function(){
						if (( ! section.hasClass('active')) && ( ! running)) {
							running = true;
							items.each(function(){
								if ($(this).hasClass('active')) {
									$(this).removeClass('active');
								}
							});
							if (item.length) {
								item.addClass('active');
							}

							var leftPos = -index*(sectionsWrapper.innerWidth());
							sectionsWrapper.animate({height: section.outerHeight()}, 300);
							sectionsContainer.animate({left: leftPos}, 300, function(){
								sections.each(function(){
									if ($(this).hasClass('active')) {
										$(this).removeClass('active');
									}
								});
								section.addClass('active');
								activeIndex = index;
								running = false;
							});

						}
					});
				}

				if(section_title.length)
				{
					section_title.click(function() {
						if (( ! section.hasClass('active')) && ( ! running)) {
							running = true;
							var currentHeight, newHeight;
							items.each(function(){
								if ($(this).hasClass('active')) {
									$(this).removeClass('active');
								}
							});
							if (item.length) {
								item.addClass('active');
							}

							sections.each(function(){
								if ($(this).hasClass('active')) {
									currentHeight = $(this).find('.w-timeline-section-content').height();
									$(this).find('.w-timeline-section-content').slideUp();
								}
							});

							newHeight = section_content.height();

							section_content.slideDown(null, function(){
								sections.each(function(){
									if ($(this).hasClass('active')) {
										$(this).removeClass('active');
									}
								});
								section.addClass('active');
								activeIndex = index;

								jQuery("html, body").animate({
									scrollTop: section.offset().top-(jQuery('.l-header').height())+"px"
								}, {
									duration: 1200,
									easing: "easeInOutQuint"
								});

								running = false;
							});

						}
					});
				}


			});

		});
	};

	// Fixing contact form 7 semantics, when requested
	jQuery('.wpcf7').each(function(){
		var $form = jQuery(this);

		// Removing excess wrappers
		$form.find('.w-form-field > .wpcf7-form-control-wrap > .wpcf7-form-control').each(function(){
			var $input = jQuery(this);
			if (($input.attr('type')||'').match(/^(text|email|url|tel|number|date|quiz|captcha)$/) || $input.is('textarea')){
				// Moving wrapper classes to .w-form-field, and removing the span wrapper
				var wrapperClasses = $input.parent().get(0).className;
				$input.unwrap();
				$input.parent().get(0).className += ' '+wrapperClasses;
			}
		});

		// Transforming submit button
		$form.find('.w-form-field > .wpcf7-submit').each(function(){
			var $input = jQuery(this),
				classes = $input.attr('class').split(' '),
				value = $input.attr('value') || '';
			$input.siblings('p').remove();
			if (jQuery.inArray('g-btn', classes) == -1){
				classes.push('g-btn');
			}
			var buttonHtml = '<button id="message_send" class="'+classes.join(' ')+'">' +
				'<div class="w-preloader type_2"></div>' +
				'<span class="g-btn-label">'+value+'</span>' +
				'<span class="ripple-container"></span>' +
				'</button>';
			$input.replaceWith(buttonHtml);
		});

		// Adjusting proper wrapper for select controller
		$form.find('.wpcf7-form-control-wrap > select').each(function(){
			var $select = jQuery(this);
			if ( ! $select.attr('multiple')) $select.parent().addClass('type_select');
		});
	});
})(jQuery);

jQuery(document).ready(function() {
	"use strict";

	jQuery('.w-timeline').wTimeline();
});
