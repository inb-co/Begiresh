'use strict';

const extend = require('xtend/mutable');
const q = require('component-query');
const doc = require('get-doc');
const cookie = require('cookie-cutter');
const ua = require('ua-parser-js');

/* global navigator */
let userLangAttribute = navigator.language || navigator.userLanguage || navigator.browserLanguage;
const userLang = userLangAttribute.slice(0, 2) || 'fa';
let root = doc && doc.documentElement;

// market dependent functionality
let mixins = {
	googlePlay: {
    name: 'گوگل‌پلی',
		appMeta: 'google-play-app',
		iconRels: ['android-touch-icon', 'apple-touch-icon-precomposed', 'apple-touch-icon'],
		getStoreLink: function () {
			return 'http://play.google.com/store/apps/details?id=' + this.appId + '&hl=' + this.options.appStoreLanguage;
		}
	},
  cafeBazaar: {
    name: 'کافه‌بازار',
		appMeta: 'cafe-bazaar-app',
    iconRels: ['android-touch-icon', 'apple-touch-icon-precomposed', 'apple-touch-icon'],
		getStoreLink: function () {
			return 'https://cafebazaar.ir/app/' + this.appId + '/?l=' + this.options.appStoreLanguage;
		}
	}
};

let Begiresh = function (options) {

	const agent = ua(navigator.userAgent);
	this.options = extend({}, {
		daysHidden: 15,
		daysReminder: 90,
		appStoreLanguage: userLang, // Language code for App Store
    store: 'googlePlay',
		price: 'رایگان',
		button: 'بگیرش', // Text for the install button
		icon: '', // full path to icon image if not using website icon image
		force: false,
	}, options || {});

  if (agent.os.name === 'Android') this.type = 'android';

	// Don't show banner on ANY of the following conditions:
	// - device os is not supported,
	// - running on standalone mode
	// - user dismissed banner
	const unsupported = !this.type;
	const runningStandAlone = navigator.standalone;
	const userDismissed = cookie.get('begiresh-closed');
	const userInstalled = cookie.get('begiresh-installed')

	if (!this.options.force && (unsupported || runningStandAlone || userDismissed || userInstalled)) return;

	extend(this, mixins[this.options.store]);

	// - If we dont have app id in meta, dont display the banner
	if (!this.parseAppId()) return;

	this.create();
	this.show();
};

Begiresh.prototype = {
	constructor: Begiresh,

	create: function () {

		const link = this.getStoreLink();
		const inStore = this.options.price + ' در ' + this.name;
		let icon;

		if (this.options.icon) {
			icon = this.options.icon;
		} else {
			for (let i = 0; i < this.iconRels.length; i++) {
				const rel = q('link[rel="' + this.iconRels[i] + '"]');
				if (rel) {
					icon = rel.getAttribute('href');
					break;
				}
			}
		}

		let banner = doc.createElement('div');
		var theme = this.options.store;

		banner.className = 'begiresh begiresh-' + theme;
		banner.innerHTML = '<div class="begiresh-container">' +
							'<a href="javascript:void(0);" class="begiresh-close">&times;</a>' +
							'<span class="begiresh-icon" style="background-image: url(' + icon + ')"></span>' +
							'<div class="begiresh-info">' +
								'<div class="begiresh-title">' + this.options.title + '</div>' +
								'<div>' + this.options.author + '</div>' +
								'<span>' + inStore + '</span>' +
							'</div>' +
							'<a href="' + link + '" class="begiresh-button">' +
								'<span class="begiresh-button-text">' + this.options.button + '</span>' +
							'</a>' +
						'</div>';

		// there isn’t neccessary a body
		if (doc.body) {
			doc.body.appendChild(banner);
		}		else if (doc) {
			doc.addEventListener('DOMContentLoaded', function () {
				doc.body.appendChild(banner);
			});
		}

		q('.begiresh-button', banner).addEventListener('click', this.install.bind(this), false);
		q('.begiresh-close', banner).addEventListener('click', this.close.bind(this), false);
	},
	hide: function () {
		root.classList.remove('begiresh-show');
	},
	show: function () {
		root.classList.add('begiresh-show');
	},
	close: function () {
		this.hide();
		cookie.set('begiresh-closed', 'true', {
			path: '/',
			expires: new Date(Number(new Date()) + (this.options.daysHidden * 1000 * 60 * 60 * 24))
		});
	},
	install: function () {
		this.hide();
		cookie.set('begiresh-installed', 'true', {
			path: '/',
			expires: new Date(Number(new Date()) + (this.options.daysReminder * 1000 * 60 * 60 * 24))
		});
	},
	parseAppId: function () {
		let meta = q('meta[name="' + this.appMeta + '"]');
		if (!meta) return;

		this.appId = /app-id=([^\s,]+)/.exec(meta.getAttribute('content'))[1];

		return this.appId;
	}
};

module.exports = Begiresh;
