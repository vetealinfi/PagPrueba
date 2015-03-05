(function ($) {
	$.fn.wSwitcher = function (options) {

		var defaultOptions = {},
			obj = $.extend(defaultOptions, options);

		var layouts = ['type_boxed', 'type_wide'];

		return this.each(function () {
			var switcher = $(this),
				control = switcher.find('.w-switcher-control'),
				canvas = $('.l-canvas');


			control.click(function(){
				if (switcher.css('left') == '0' || switcher.css('left') == '0px'){
					switcher.animate({ left: '-215px'}, 350);
				} else {
					switcher.animate({ left: '0'}, 350);
				}

			});

			if (window.body_layout == 'type_wide') {
				switcher.find('.layout_type_wide').addClass('active');
			} else {
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

			switcher.find('.w-switcher-section.for_color .w-switcher-section-item').each(function(){
				$(this).click(function(){
					if ( ! $(this).hasClass('active')){
						$('#us_colors_inline').remove();
						var color = $(this).attr('data-color'),
							url = window.wp_template_dir_uri+'colors/color_'+color+'.css';

						$('.w-logo-img').attr('src', window.wp_template_dir_uri+'logos/logo_'+color+'.png');

						switcher.find('.w-switcher-section.for_color .w-switcher-section-item.active').removeClass('active');
						$(this).addClass('active');

						link.attr('href', url);
					}
				});
			});

		});
	}
})(jQuery);

jQuery(document).ready(function() {
	jQuery('.w-switcher').wSwitcher();
});
