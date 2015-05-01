$(document).ready(function ($) {

	jQuery.fn.rotate = function (degrees) {
		$(this).css({'-webkit-transform': 'rotate(' + degrees + 'deg)',
			'-moz-transform': 'rotate(' + degrees + 'deg)',
			'-ms-transform': 'rotate(' + degrees + 'deg)',
			'transform': 'rotate(' + degrees + 'deg)'});
		return $(this);
	};
	$.widget("ui.menu", $.ui.menu, {
		_create: function () {
			this._super('_create');
			if (this.options.justify === undefined) {
				this.options.justify = true;
			}
			if (this.options.submenu_marker_class === undefined) {
				this.options.submenu_marker_class = "ui-icon-caret-1-e";
			}
			if (this.options.submenu_icon_rotate === undefined) {
				this.options.submenu_icon_rotate = 90;
			}
			if (this.options.ul_height_pixels === undefined) {
				this.options.ul_height_pixels = 2;
			}
			var topoptions = this.options;
			this.element.children('li').each(function () {
				$(this).children('a:has(span.' + topoptions.submenu_marker_class + ')')
					.children('span').rotate(topoptions.submenu_icon_rotate);
				$(this).children('span').first().rotate(topoptions.submenu_icon_rotate);
			});
			if (this.options.justify) {
				if (this.options.justify_link_css === undefined) {
					this.options.justify_link_css = {'text-align': 'center', 'margin-left': '1em', 'margin-right': '1em'};
				}
				var itemwidth = 100 / this.element.children().length
				topoptions = this.options;
				this.element.children().each(function () {
					$(this).css({width: itemwidth + '%', 'padding-left': '0px', 'padding-right': '0px'});
					$(this).children('a').css(topoptions.justify_link_css);
				});
			}
			this.element.children().each(function () {
				$(this).css('float', 'left');
				$(this).css('	box-sizing', 'border-box');
				if (topoptions.link_css !== undefined 
					&& topoptions.link_css !== null
					&& typeof topoptions.link_css === 'object') {
					$(this).find('a').each(function () {
						$(this).css(topoptions.link_css);
					});
				}
			});
			this.element.css({'min-height': this.element.children()
					.first().outerHeight() + this.options.ul_height_pixels});
			this.pwith = this.element.children().first().outerWidth();
		},
		_open: function (submenu) {
			var pos = {
				my: '',
				at: ''
			};
			if (submenu.parent().parent().attr('id') === this.element.attr('id') ||
				submenu.parent().parent().attr('class') === this.element.attr('class')) {
				pos.my = "left top";
				pos.at = "left bottom";
			}
			else {
				pos = this.options.position;
			}
			var position = $.extend({
				of: this.active
			}, pos);
			clearTimeout(this.timer);
			this.element.find(".ui-menu").not(submenu.parents(".ui-menu"))
				.hide()
				.attr("aria-hidden", "true");

			submenu
				.show()
				.removeAttr("aria-hidden")
				.attr("aria-expanded", "true")
				.position(position);

			if (this.options.submenu_css !== undefined 
					&& this.options.submenu_css !== null
					&& typeof this.options.submenu_css === 'object'
					&& this.options.auto_width === false
					) {
				submenu.children().css(this.options.submenu_css);
			}			
			if (this.options.auto_width) {
				var lgtharray = [];
				var str;
				submenu.children('li').each(function () {
					str = $(this).children('a').text();
					lgtharray.push(str.length);
				});
				lgtharray.sort(function (a, b) {
					return b - a;
				});
//				console.log(lgtharray[0]);
				if (this.options.char_width === undefined) {
					this.options.char_width = {char_eq: 1, char_unit: 'em', max_chars: 15};
//					this.options.char_width = {char_eq: 10, char_unit: 'px', max_chars: 15};
				}
				if (this.options.width_from_parent === undefined) {
					this.options.width_from_parent = false;
				}
				var topt = this.options.char_width;
				var wfpopt = this.options.width_from_parent;
				var pwith = this.pwith;
				if (lgtharray[0] > topt.max_chars) {
					lgtharray[0] = topt.max_chars;
				}
				var l = parseInt(lgtharray[0] * topt.char_eq);
				submenu.children('li').each(function () {
					if (wfpopt) {
						$(this).css('width', pwith);
					}
					else {
						$(this).css('width', l + topt.char_unit);
					}
				});
			}
		}
	});
});
