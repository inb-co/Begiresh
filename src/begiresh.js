'use strict';

const extend = require('xtend/mutable');
const q = require('component-query');
const doc = require('get-doc');
const cookie = require('cookie-cutter');
const ga = require('./analytics')

// global navigator
const userAgentAttribute = navigator.userAgent || navigator.vendor || window.opera;
const userLangAttribute = navigator.language || navigator.userLanguage || navigator.browserLanguage;
const userLang = userLangAttribute.slice(0, 2) || 'fa';

// date parsing
const msInOneDay = 1000 * 60 * 60 * 24;
const today = Number(new Date());

// root and Dom
let root = doc && doc.documentElement;

// market dependent functionality
let mixins = {
	googlePlay: {
    name: 'گوگل‌پلی',
		appMeta: 'google-play-app',
		getStoreLink: function () {
			return 'http://play.google.com/store/apps/details?id=' + this.appId + '&hl=' + this.options.storeLang;
		}
	},
  cafeBazaar: {
    name: 'کافه‌بازار',
		appMeta: 'cafe-bazaar-app',
		getStoreLink: function () {
			return 'https://cafebazaar.ir/app/' + this.appId + '/?l=' + this.options.storeLang;
		}
	},
  myket: {
    name: 'مایکت',
		appMeta: 'myket-app',
		getStoreLink: function () {
			return 'https://myket.ir/app/' + this.appId + '/?lang=' + this.options.storeLang;
		}
	}
};

// favicons as icon
const iconRels = ['android-touch-icon', 'apple-touch-icon-precomposed', 'apple-touch-icon'];

let Begiresh = function (options) {

	this.options = extend({}, {
		price: 'رایگان', // Price of app
		icon: '', // full path to icon image if not using website icon image
		daysHidden: 15, // Numbers of days to hide banner after dismissed
		daysReminder: 90, // Numbers of days to hide banner after downloaded
		storeLang: userLang, // Language code for app store
    store: 'googlePlay', // App store
		button: 'بگیرش', // Text for the install button
		theme: 'default', // Theme of the banner
		force: false, // always show banner
		onDownload: function(){}, // After download callback
		onClose: function() {}, // After dismiss callback
		appStoreLanguage: null, // Backward compatibility
	}, options || arguments[0] || {});

	if (this.options.appStoreLanguage != null) this.options.storeLang = this.options.appStoreLanguage;

	if (!/windows phone/i.test(userAgentAttribute) && /android/i.test(userAgentAttribute)) this.type = 'android'

	// Don't show banner on ANY of the following conditions:
	// - device os is not supported (Android),
	// - running on standalone mode,
	// - user dismissed banner,
	// - user installed banner
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

		this.options.icon ? icon = this.options.icon : icon = this.getIcon();

		let banner = doc.createElement('div');

		banner.className = 'begiresh';
		banner.classList.add('theme-' + this.options.theme);
		banner.innerHTML = '<div class="begiresh-container">' +
							'<a href="javascript:void(0);" class="begiresh-close"></a>' +
							'<div class="begiresh-info">' +
								'<span class="begiresh-icon" style="background-image: url(' + icon + ')"></span>' +
								'<div class="begiresh-meta">' +
									'<span class="begiresh-title">' + this.options.title + '</span>' +
									'<span class="begiresh-author">' + this.options.author + '</span>' +
									'<span class="begiresh-store">' + inStore + '</span>' +
								'</div>' +
							'</div>' +
							'<a href="' + link + '" class="begiresh-download">' +
								'<span class="begiresh-download-text">' + this.options.button + '</span>' +
							'</a>' +
						'</div>';

		// there isn’t neccessary a body
		if (doc.body) {
			doc.body.appendChild(banner);
		}	else if (doc) {
			doc.addEventListener('DOMContentLoaded', function () {
				doc.body.appendChild(banner);
			});
		}

		q('.begiresh-download', banner).addEventListener('click', this.install.bind(this), false);
		q('.begiresh-close', banner).addEventListener('click', this.close.bind(this), false);
	},
	hide: function () {
		root.classList.remove('begiresh-show');
	},
	show: function () {
		root.classList.add('begiresh-show');
	},
	close: function () {
		this.options.onClose.call();
		this.hide();
		cookie.set('begiresh-closed', 'true', {
			path: '/',
			expires: this.getExpirationDate(this.options.daysHidden)
		});
		ga.track({category:'begiresh', action:'click', label:'close'})
	},
	install: function () {
		this.options.onDownload.call();
		this.hide();
		cookie.set('begiresh-installed', 'true', {
			path: '/',
			expires: this.getExpirationDate(this.options.daysReminder)
		});
        ga.track({category:'begiresh', action:'click', label:'install'})
	},
	parseAppId: function () {
		let meta = q('meta[name="' + this.appMeta + '"]');
		if (!meta) return;

		this.appId = /app-id=([^\s,]+)/.exec(meta.getAttribute('content'))[1];

		return this.appId;
	},
	getExpirationDate: function (remainingDays) {
		return new Date(today + (remainingDays * msInOneDay))
	},
	getIcon: function (){
		for (let i = 0; i < iconRels.length; i++) {
			const rel = q('link[rel="' + iconRels[i] + '"]');
			if (rel) return rel.getAttribute('href');
		}
	}
};

module.exports = Begiresh;
