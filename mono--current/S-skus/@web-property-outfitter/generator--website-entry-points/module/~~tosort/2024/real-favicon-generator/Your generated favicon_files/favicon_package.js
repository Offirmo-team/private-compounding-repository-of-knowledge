
var techData = {
	grunt: {
		url: 'https://realfavicongenerator.net/favicon/grunt',
		title: 'Favicon Generator for Grunt',
		description: 'Generate icons for all major platforms at once: iOS, Android, desktop... and integrate them into your Grunt build'
	},
	gulp: {
		url: 'https://realfavicongenerator.net/favicon/gulp',
		title: 'Favicon Generator for Gulp',
		description: 'Generate favicon for all major platforms at once: iOS, Android, desktop... and integrate them into your Gulp build'
	},
	ror: {
		url: 'https://realfavicongenerator.net/favicon/ruby_on_rails',
		title: 'Favicon Generator for Ruby on Rails',
		description: 'Generate icons for all major platforms (iOS, Android, desktop...) and integrate them into your Ruby on Rails project'
	},
	node_cli: {
		url: 'https://realfavicongenerator.net/favicon/node_cli',
		title: 'Favicon Generator for Node.js command line interface',
		description: 'Generate favicon for all platforms (Android, iOS, desktop browsers...) via the command line with a Node.js CLI'
	},
	aspnet_core: {
		url: 'https://realfavicongenerator.net/favicon/aspnet_core',
		title: 'Favicon Generator for ASP.NET Core',
		description: 'Generate icons for all platforms (Windows, iOS, Android...) and integrate them into your ASP.NET Core project'
	},
	gwsk: {
		url: 'https://realfavicongenerator.net/favicon/google_web_starter_kit',
		title: 'Favicon Generator for Google Web Starter Kit',
		description: 'Generate icons for all platforms (iOS, Android, desktop...) and integrate them into your Web Starter Kit project'
	},
};

var defaultShareUrl;
var defaultShareTitle;
var defaultShareDescription;

var entityMap = {
	"&": "&amp;",
	"<": "&lt;",
	">": "&gt;",
	'"': '&quot;',
	"'": '&#39;',
	"/": '&#x2F;'
};

var donationPanelShown = false;

function escapeHtml(string) {
	return String(string).replace(/[&<>"'\/]/g, function (s) {
		return entityMap[s];
	});
}

(function ($) {
	defaultShareUrl = $('.addthis_toolbox').attr('addthis:url');
	defaultShareTitle = $('.addthis_toolbox').attr('addthis:title');
	defaultShareDescription = $('.addthis_toolbox').attr('addthis:description');

	loadEverything();
})(jQuery);

function loadEverything() {
	$.ajax({
		url: "/generate_favicon?file_id=4c9b40641d55db33c0f19bd1a3d8718b2644a490",
	}).done(function(json) {
		$('.favicon_package_link').attr('href', json.favicon_package_url);
		if (json.compression_ratio != null) {
			if (json.compression_ratio > 0) {
				$('.package_package_container .favicon_compression_ratio').html(json.compression_ratio);
				$('.package_package_container .favicon_compression_notice').show();
			}
			else {
				$('.package_package_container .favicon_compression_failed_notice').show();
			}
		}
		$('.package_spinner').fadeOut(function() {
			$('.package_package_container .favicon_package').fadeIn();
			// Make sure they are all hidden, including the ones in non-displayed tabs
			$('.package_spinner').hide();
		});
		if (json.favicon_preview_url != null) {
			$('#share_on_pinterest_link').attr('href',
				'//www.pinterest.com/pin/create/button/?url=http%3A%2F%2Frealfavicongenerator.net%2F&media=' +
				'https://realfavicongenerator.net' + json.favicon_preview_url +
				'&description=Freshly%20generated%20favicon%20here!');
			$('#share_favicon_modal .preview').attr('src', json.favicon_preview_url);
			$('#sharing_with_preview_container').fadeIn();
			$('.share-favicon-instruction').fadeIn();
		}
		else {
			$('#sharing_without_preview_container').fadeIn();
		}
	});

  $('a[data-toggle="tab"]').on('shown.bs.tab', function (e) {
  	var id = 'instructions_' + $(e.target).data('code-format');
		loadCode($('#' + id));
  });

	var currentTab = $('.tab-pane.in.active');
	if (currentTab) {
		loadCode(currentTab);
	}
}

function doPrettify(element, onlyVisible, callback) {
	element.find('.to_prettify' + (onlyVisible ? ':visible' : '')).each(function() {
		$(this).removeClass('to_prettify');
		$(this).addClass('prettyprint');
		if ($(this).is("code") && $(this).parent().is("pre")) {
			$(this).parent().addClass('prettyprint_container');
		}
	});
	prettyPrint(function() {
		if (callback) {
			callback();
		}
	});
}

function loadCode(element) {
	if (element.data('code-loaded')) {
		return;
	}
	element.data('code-loaded', true);

	doPrettify(element, true);

	var format = element.data('code-format');

	if (techData[format] != undefined) {
		$('.addthis_toolbox').attr('addthis:url', techData[format].url);
		$('.addthis_toolbox').attr('addthis:title', techData[format].title);
		$('.addthis_toolbox').attr('addthis:description', techData[format].description);
	}
	else {
		$('.addthis_toolbox').attr('addthis:url', defaultShareUrl);
		$('.addthis_toolbox').attr('addthis:title', defaultShareTitle);
		$('.addthis_toolbox').attr('addthis:description', defaultShareDescription);
	}

	$.ajax({
		url: "/favicon_code?file_id=4c9b40641d55db33c0f19bd1a3d8718b2644a490&format=" + format,
	}).done(function(content) {
		element.find('.favicon_code').html(escapeHtml(content));
		doPrettify(element, false, function() {
			element.find('.code_spinner').fadeOut(function () {
				element.find('.favicon_code_container').slideDown(function() {
					if (! donationPanelShown) {
						donationPanelShown = true;
						setTimeout(function() {
							if (typeof showDonationPanel !== 'undefined') {
								showDonationPanel();
							}
						}, 1000);
					}
				});
			});
		});
	});
}
