$(document).on('ready', function() {
	// Generate Pie Chart with D3.js 
	// https://d3js.org/
	function createPieChart(id) {
		// Chart holder DOM Element
		var container = document.getElementById(id);
		var $container = d3.select('#' + id);

		// Chart data is taken from the "data-source" attribute of the DOM element
		var data = JSON.parse(container.getAttribute('data-source'));
		
		// Chart dimensions
		// Pie charts are usually visualized as a circle 
		// That is why width and height are now a single value
		var dimensions = 216;
		var radius = dimensions / 2;

		// Chart layout using D3 pie layout
		var pie = d3.layout.pie()
			.sort(null);

		// Make the donut 46 pixels thick
		var arc = d3.svg.arc()
			.innerRadius(radius - 46)
			.outerRadius(radius);

		// Append the Legend
		var legend = $container.append('div')
			.attr('class', 'chart-legend')

		// Create the SVG
		var svg = $container
			.append('svg')
			.attr({
				'class': 'pie-graph',
				'width': dimensions,
				'height': dimensions
			})
				.append('g')
				.attr({
					'class': 'pie-canvas',
					'transform': 'translate(' + (dimensions / 2) + ',' + (dimensions / 2) + ')'
				});

		// Populate empty variables iterating over the chart data array
		var legendMarkup = ''; 
		var colors = [];
		var values = [];

		for ( var i = 0; i < data.length; i++ ) {
			values.push(data[i].value); // Will be used when creating the pie sectors

			colors.push(data[i].color); // Will set a color to each pie sector

			// Generate the legend markup
			legendMarkup += '<p><span class="chart-legend-icon" style="background-color: ' + data[i].color + '"></span>' + data[i].label + '\n';
		};

		legend.html(legendMarkup);

		var slices = svg.selectAll('.pie-slice')
			.data(pie(values))
			.enter()
			.append('g')
				.attr('class', 'pie-slice');

		// Create the pie sectors
		slices
			.append('path')
			.attr({
				'class': 'pie-chunk',
				'fill': function(d, i) {
					return colors[i];
				},
				'd': arc
			});

		// Create a label for each sector
		// The label shows the value of the sector
		slices.append('text')
			.attr({
				'transform': function(d) {
					d.outerRadius = radius + 30;
					d.innerRadius = radius + 45;

					return 'translate(' +  arc.centroid(d) + ')';
				},
				'dy': '.35em'
			})
			.text(function(d) {
				return d.value + '%';
			});

		// Toggle sector labels when mouse over the legend
		$(container)
			.on('mouseenter', '.chart-legend p', function(event) {
				var idx = $(this).index();

				d3.selectAll('.pie-slice')
					.attr('class', function(d, i) {
						if ( i === idx ) {
							return 'pie-slice hovered';
						} else {
							return 'pie-slice';
						};
					});
			})
			.on('mouseleave', '.chart-legend p', function(event) {
				d3.selectAll('.pie-slice').attr('class', 'pie-slice');
			});
	};

	//  Accordion
	$('.accordion-head h5').on('click', function() {

		$(this).closest('.accordion-section').toggleClass('expanded').siblings().removeClass('expanded');

		$(this).closest('.accordion-section').find('.accordion-body').slideToggle();
		$(this).closest('.accordion-section').siblings().find('.accordion-body').slideUp();		
	});

	// Open Popup
	if( $('.event').length ) {
		$('.event a').magnificPopup({
			type: 'ajax',
			removalDelay: 500,
			fixedContentPos: false,
			fixedBgPos: true,
			alignTop: true,
			mainClass: 'mfp-popup-article',
			callbacks: {
				parseAjax: function(mfpResponse) {
					mfpResponse.data = $(mfpResponse.data).find('.popup-article');
				},
				ajaxContentAdded: function() {
					$('.popup-article img').each(function() {
						$(this).attr('src', $(this).attr('src').replace(/^(\.\.\/)+/, ''));
					});

					if ( $('#pieChart').length ) {
						createPieChart('pieChart');
					};

					$('.counter-value').counterUp({
						 delay: 10,
			             time: 1500
					});

					// Toggle Accordion
					$('.accordion-head h5').on('click', function() {

						$(this).closest('.accordion-section').toggleClass('expanded').siblings().removeClass('expanded');

						$(this).closest('.accordion-section').find('.accordion-body').slideToggle();
						$(this).closest('.accordion-section').siblings().find('.accordion-body').slideUp();		
					});
				}
			}
		});
	}

	if( $('.counter').length ) {
		$('.counter-value').counterUp({
			 delay: 10,
             time: 1500
		});
	}

	$(window).on('load', function() {
		setTimeout(function() {
			$('body').addClass('loaded');
		}, 10);

		if ( $('#pieChart').length ) {
			createPieChart('pieChart');
		};

		$('<div class="slider-paging"></div>').appendTo( $('.la-slider') );

		if( $('.la-slider').length ) {
			var slides = $('.la-slider .slider-item').length;
			var sliderClone = $('.la-slider').clone();
			var slider = $('.la-slider').detach();
			sliderClone.prependTo('.front #zone1 .list-articles');

			for( var i = 0; i < slides; i++ ) {
				$('<a href="#"></a>').appendTo('.slider-paging');
			}

			$('<div class="slider-paging-hidden"></div>').appendTo( $('.la-slider') );

			$('<div class="slider-actions"><a href="#" class="slider-prev"><i class="ico-prev"></i></a><a href="#" class="slider-next"><i class="ico-next"></i></a></div>').appendTo( $('.la-slider') );

			$('.slider-paging a').eq(0).addClass('selected');

			$('.la-slider .slider-content').carouFredSel({
				width: '100%',
				circular: true,
				infinite: true,
				responsive: true,
				swipe: true,						
				auto: {
					play: true,
					timeoutDuration: 7000
				},
				swipe: {
					onTouch: true
				},
				pagination: {
					container: '.slider-paging-hidden',
					anchorBuilder: true
				},
				scroll: {
					pauseOnHover: false
				},
				onCreate: function( data ) {
					var $slider = $(this);
					$slider.find('.slider-item').eq(0).addClass('fadeIn easeInTop');

					$slider.find('.slider-item').each(function() {
						var url = $(this).find('img').attr('src');

						$(this).css('background-image', 'url(' + url + ')' );
					});

					// Handle Slider Paging
					$('.slider-paging a').on('click', function(event) {
						event.preventDefault();

						var idx = $(this).index();
						$(this).addClass('selected').siblings().removeClass('selected');

						$slider.find('.slider-item').removeClass('fadeIn');

						setTimeout(function() {
							$slider.trigger('prev');
						}, 750);
					});

					// Slider Arrows
					$('.slider-prev').on('click', function(event) {
						event.preventDefault();

						$slider.find('.slider-item').removeClass('fadeIn');

						setTimeout(function() {
							$slider.trigger('prev');
						}, 750);
					});

					$('.slider-next').on('click', function(event) {
						event.preventDefault();

						$slider.find('.slider-item').removeClass('fadeIn');

						setTimeout(function() {
							$slider.trigger('next');
						}, 750);
					});
				},
				scroll: {
					fx: 'fade',
					duration: 750,
					pauseOnHover: false,
					onBefore: function(data) {						
						var $paging = $(this).closest('.la-slider').find('.slider-paging');
						var $activeSlide = $(data.items.visible);
						var activeSlideTop = parseInt( $activeSlide.find('.la-item-content').offset().top ) + $activeSlide.find('.la-item-content').height() + 46;
						$paging.css('top', activeSlideTop);

						$('.la-slider .slider-item').removeClass('fadeIn easeInTop');

					},
					onAfter: function( data ) {
						var idx = $('.slider-paging-hidden a.selected').index();
						
						$(data.items.visible).addClass('fadeIn easeInTop');

						setTimeout(function() {
							$(data.items.visible).removeClass('fadeIn');
						}, 6000);

						$('.slider-paging a').eq(idx).addClass('selected').siblings().removeClass('selected');
					}
				}
			});

			setTimeout(function() {
				$('body').addClass('fade-in');				
			}, 1500);
		}

		//  Article Image as Body background

		if( $('body').hasClass('article') ) {
			if( $('.article-wrapper .article-title').length ) {
				var $img = $('.article-title img').clone();
				var articleBG = $('<div class="article-bg"></div>');

				articleBG.prependTo( $('body') );
				$img.appendTo( $('.article-bg') );
			}
		}

		if( $('.article-navigation').length ) {
			$('.article-navigation .an-item img').wrap('<div class="image"></div>');
		}
	});	
});
