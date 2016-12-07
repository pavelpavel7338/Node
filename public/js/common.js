jQuery(document).ready(function($){
	$('.map').each(function(){
		var latlng = new google.maps.LatLng( 46.8462615, 35.3733005 );

		var args = {
			zoom		: 16,
			center		: latlng,
			mapTypeId	: google.maps.MapTypeId.ROADMAP,
			scrollwheel : false,
		};
		var map = new google.maps.Map( document.getElementById('map'), args);
		map.markers = [];

		var marker = new google.maps.Marker({
			position	: latlng,
			map			: map,
		});
		map.markers.push( marker );
		var infowindow = new google.maps.InfoWindow({
			content		: '<div class="marker">Gallery Search</div>'
		});
		google.maps.event.addListener(marker, 'click', function() {
			infowindow.open( map, marker );
		});	
	});

	$('.admin-delete').click(function(e){
		e.preventDefault();
		if ( confirm('Вы действительно хотите удалить эту картину?') ) {
			var id = $(this).attr('href').split('#')[1];
			$.ajax({
				type: 'delete',
				url: '/admin/',
				data: {id: id},
				success: function(msg) {
					if ( msg === 'ok' ) {
						window.location.reload();
					}
				}
			});
		}
	});

	$('.admin-edit').click(function(e){
		e.preventDefault();
		$(this).closest('li').next('li').slideToggle();
	});

});