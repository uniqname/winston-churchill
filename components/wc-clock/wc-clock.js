( function () {
	var interval,
		Clock = WC.register( 'wc-clock' );

	Clock.prototype.on( 'attached', function () {
		var clock = this,
			time = this.getAttribute('time');

		if ( !time || time === 'current' ) {

			interval = window.setInterval(setTheTime, 1000);
			setTheTime();
		}

		function setTheTime() {
			var time = new Date(),
				leadingZero = function ( num ) {
					return ( num < 10 ? '0' : '' ) + num;
				};
			clock.data = {
				hour: leadingZero( time.getHours() ),
				minute: leadingZero( time.getMinutes() ),
				second: leadingZero( time.getSeconds() )
			};
		}
	});

	Clock.prototype.on( 'detached', function () {
		window.clearInterval( interval );
	} );
} )();
