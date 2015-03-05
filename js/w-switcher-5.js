/*!
 * jQuery Cookie Plugin v1.3.1
 * https://github.com/carhartl/jquery-cookie
 *
 * Copyright 2013 Klaus Hartl
 * Released under the MIT license
 */
(function (factory) {
	if (typeof define === 'function' && define.amd) {
		// AMD. Register as anonymous module.
		define(['jquery'], factory);
	} else {
		// Browser globals.
		factory(jQuery);
	}
}(function ($) {

	var pluses = /\+/g;

	function raw(s) {
		return s;
	}

	function decoded(s) {
		return decodeURIComponent(s.replace(pluses, ' '));
	}

	function converted(s) {
		if (s.indexOf('"') === 0) {
			// This is a quoted cookie as according to RFC2068, unescape
			s = s.slice(1, -1).replace(/\\"/g, '"').replace(/\\\\/g, '\\');
		}
		try {
			return config.json ? JSON.parse(s) : s;
		} catch(er) {}
	}

	var config = $.cookie = function (key, value, options) {

		// write
		if (value !== undefined) {
			options = $.extend({}, config.defaults, options);

			if (typeof options.expires === 'number') {
				var days = options.expires, t = options.expires = new Date();
				t.setDate(t.getDate() + days);
			}

			value = config.json ? JSON.stringify(value) : String(value);

			return (document.cookie = [
				config.raw ? key : encodeURIComponent(key),
				'=',
				config.raw ? value : encodeURIComponent(value),
				options.expires ? '; expires=' + options.expires.toUTCString() : '', // use expires attribute, max-age is not supported by IE
				options.path    ? '; path=' + options.path : '',
				options.domain  ? '; domain=' + options.domain : '',
				options.secure  ? '; secure' : ''
			].join(''));
		}

		// read
		var decode = config.raw ? raw : decoded;
		var cookies = document.cookie.split('; ');
		var result = key ? undefined : {};
		for (var i = 0, l = cookies.length; i < l; i++) {
			var parts = cookies[i].split('=');
			var name = decode(parts.shift());
			var cookie = decode(parts.join('='));

			if (key && key === name) {
				result = converted(cookie);
				break;
			}

			if (!key) {
				result[name] = converted(cookie);
			}
		}

		return result;
	};

	config.defaults = {};

	$.removeCookie = function (key, options) {
		if ($.cookie(key) !== undefined) {
			// Must not alter options, thus extending a fresh object...
			$.cookie(key, '', $.extend({}, options, { expires: -1 }));
			return true;
		}
		return false;
	};

}));


(function ($) {
	$.fn.wSwitcher = function (options) {

		var defaultOptions = {},
			obj = $.extend(defaultOptions, options);

		var layouts = ['type_boxed', 'type_wide'];

		return this.each(function () {
			var switcher = $(this),
				control = switcher.find('.w-switcher-control'),
				canvas = $('.l-canvas');

			if ($.cookie('html_impreza_switcherIsOpen') == 1) {
				switcher.css('left', '0');
			}


			control.click(function(){
				if (switcher.css('left') == '0' || switcher.css('left') == '0px'){
					switcher.animate({ left: '-215px'}, 350);
					$.cookie('html_impreza_switcherIsOpen', 0, {expires: 1, path: '/'});
				} else {
					switcher.animate({ left: '0'}, 350);
					$.cookie('html_impreza_switcherIsOpen', 1, {expires: 1, path: '/'});
				}

			});

			if (window.body_layout == 'type_wide') {
				switcher.find('.layout_type_wide').addClass('active');
			} else {
				switcher.find('.layout_type_boxed').addClass('active');
			}

			if ($.cookie('html_impreza_switcherLayout') == 'type_wide') {
				canvas.removeClass('type_boxed');
				canvas.addClass('type_wide');

				switcher.find('.layout_type_boxed').removeClass('active');
				switcher.find('.layout_type_wide').addClass('active');
			}

			if ($.cookie('html_impreza_switcherLayout') == 'type_boxed') {
				canvas.removeClass('type_wide');
				canvas.addClass('type_boxed');

				switcher.find('.layout_type_wide').removeClass('active');
				switcher.find('.layout_type_boxed').addClass('active');
			}

			switcher.find('.w-switcher-section.for_layout .w-switcher-section-item').each(function(){
				$(this).click(function(){
					if ( ! $(this).hasClass('active')){
						var layout = $(this).attr('data-layout');

						switcher.find('.w-switcher-section.for_layout .w-switcher-section-item.active').removeClass('active');
						$(this).addClass('active');

						$.each(layouts, function(layoutIndex, layoutVal){
							if (layoutVal != layout && canvas.hasClass(layoutVal)) {
								canvas.removeClass(layoutVal);
							}
						});

						if (! canvas.hasClass(layout)) {
							canvas.addClass(layout);
							$.cookie('html_impreza_switcherLayout', layout, {expires: 1, path: '/'});

						}
					}

					// Redrawing all the Revolution Sliders
					if (window.revapi3 !== undefined){
						window.revapi3.revredraw();
					}
				});
			});

			if (window.color_scheme !== '') {
				$('.w-switcher-section.for_color .w-switcher-section-item.'+window.color_scheme).addClass('active');
			}

			var link = $('<link>', {rel: 'stylesheet', href: ''}).appendTo('body');

			if ($.cookie('html_impreza_switcherColors') != undefined) {
				switcher.find('.w-switcher-section.for_color .w-switcher-section-item.active').removeClass('active');
				$('.w-switcher-section.for_color .w-switcher-section-item.color_'+$.cookie('html_impreza_switcherColors')).addClass('active');

				$('.w-logo-img > img.for_default').attr('src', window.wp_template_dir_uri+'logos/logo_'+$.cookie('html_impreza_switcherColors')+'.png');

				$('#us_colors_inline').remove();

				link.attr('href', window.wp_template_dir_uri+'colors/color_'+$.cookie('html_impreza_switcherColors')+'.css');

			}

			switcher.find('.w-switcher-section.for_color .w-switcher-section-item').each(function(){
				$(this).click(function(){
					if ( ! $(this).hasClass('active')){
						$('#us_colors_inline').remove();
						var color = $(this).attr('data-color'),
							url = window.wp_template_dir_uri+'colors/color_'+color+'.css';

						$('.w-logo-img > img.for_default').attr('src', window.wp_template_dir_uri+'logos/logo_'+color+'.png');

						switcher.find('.w-switcher-section.for_color .w-switcher-section-item.active').removeClass('active');
						$(this).addClass('active');

						link.attr('href', url);

						$.cookie('html_impreza_switcherColors', color, {expires: 1, path: '/'});
					}
				});
			});

		});
	}
})(jQuery);

jQuery(document).ready(function() {
	jQuery('.w-switcher').wSwitcher();
});
