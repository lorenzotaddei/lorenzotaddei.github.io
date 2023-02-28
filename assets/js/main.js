/*
	Strata by HTML5 UP
	html5up.net | @ajlkn
	Free for personal and commercial use under the CCA 3.0 license (html5up.net/license)
*/

(function($) {

	var $window = $(window),
		$body = $('body'),
		$header = $('#header'),
		$footer = $('#footer'),
		$main = $('#main'),
		settings = {

			// Parallax background effect?
				parallax: true,

			// Parallax factor (lower = more intense, higher = less intense).
				parallaxFactor: 20

		};

	// Breakpoints.
		breakpoints({
			xlarge:  [ '1281px',  '1800px' ],
			large:   [ '981px',   '1280px' ],
			medium:  [ '737px',   '980px'  ],
			small:   [ '481px',   '736px'  ],
			xsmall:  [ null,      '480px'  ],
		});

	// Play initial animations on page load.
		$window.on('load', function() {
			window.setTimeout(function() {
				$body.removeClass('is-preload');
			}, 100);
		});

	// Touch?
		if (browser.mobile) {

			// Turn on touch mode.
				$body.addClass('is-touch');

			// Height fix (mostly for iOS).
				window.setTimeout(function() {
					$window.scrollTop($window.scrollTop() + 1);
				}, 0);

		}

	// Footer.
		breakpoints.on('<=medium', function() {
			$footer.insertAfter($main);
		});

		breakpoints.on('>medium', function() {
			$footer.appendTo($header);
		});

	// Header.

		// Parallax background.

			// Disable parallax on IE (smooth scrolling is jerky), and on mobile platforms (= better performance).
				if (browser.name == 'ie'
				||	browser.mobile)
					settings.parallax = false;

			if (settings.parallax) {

				breakpoints.on('<=medium', function() {

					$window.off('scroll.strata_parallax');
					$header.css('background-position', '');

				});

				breakpoints.on('>medium', function() {

					$header.css('background-position', 'left 0px');

					$window.on('scroll.strata_parallax', function() {
						$header.css('background-position', 'left ' + (-1 * (parseInt($window.scrollTop()) / settings.parallaxFactor)) + 'px');
					});

				});

				$window.on('load', function() {
					$window.triggerHandler('scroll');
				});

			}

	// Main Sections: Two.

		// Lightbox gallery.
			/*$window.on('load', function() {

				$('#two').poptrox({
					caption: function($a) { return $a.next('h3').text(); },
					overlayColor: '#2c2c2c',
					overlayOpacity: 0.85,
					popupCloserText: '',
					popupLoaderText: '',
					selector: '.work-item a.image',
					usePopupCaption: true,
					usePopupDefaultStyling: false,
					usePopupEasyClose: false,
					usePopupNav: true,
					windowMargin: (breakpoints.active('<=small') ? 0 : 50)
				});

			});*/

})(jQuery);

function showModal(event, modalId, imgSrc) {
    event.preventDefault();

}


function openModal(modalID) {
	modal = document.getElementById(modalID)
	modal.style.display = "flex";
}

function closeAllModal() {
	var modals = document.getElementsByClassName("modal");
	for(i=0; i<modals.length; i++) {
		modals[i].style.display = "none"
	}
}

// When the user clicks anywhere outside of the modal, close it
window.onclick = function(event) {
	if (event.target == modal) {
	  modal.style.display = "none";
	}
  }










  // end of the page button 

// select the share-popup element
const sharePopup = document.getElementById('share-popup');

// select the close button
const closeBtn = sharePopup.querySelector('.close-btn');

// create a variable to track whether the pop-up has been closed
let isClosed = false;

// listen for scroll event on window
window.addEventListener('scroll', () => {
  // check if the user has scrolled to the bottom of the page and the pop-up hasn't been closed
  if (window.innerHeight + window.pageYOffset >= document.body.offsetHeight && !isClosed) {
    // show the share popup
    sharePopup.style.display = 'block';
  } else {
    // hide the share popup
    sharePopup.style.display = 'none';
  }
});

// add click event listener to close button
closeBtn.addEventListener('click', () => {
  // hide the share popup
  sharePopup.style.display = 'none';
  // set the isClosed variable to true
  isClosed = true;
});

// add click event listener to share popup
sharePopup.addEventListener('click', () => {
  // copy the current page's URL to the clipboard
  navigator.clipboard.writeText(window.location.href);
  
  // display a confirmation message to the user
  alert('The website URL has been copied to your clipboard. You can now share it with someone who might be interested. \n\nThank you for the support.');
  
  // hide the share popup
  sharePopup.style.display = 'none';
  // set the isClosed variable to true
  isClosed = true;
});

