service.map = (function () {
    var marked_events = [];

    function getLatLng(location_str) {
        var coordinates = location_str.replace('POINT (', '').replace(')', '').split(' ');
        return {lat: +coordinates[0], lng: +coordinates[1]};
    }

    return {
        clear: function () {

        },

        setEvents: function (events) {
            events.forEach(function (event) {
                event.marker = new google.maps.Marker({
                    position: getLatLng(event.location),
                    title: event.title,
                    map: app.google_map
                });
                marked_events.push(event);

                event.marker.addListener('click', function () {
                    console.log(event);
                    $$('#google-map').trigger('event:show', event);
                });
            });
        },

        getBounds: function () {
            return {
                top: app.google_map.getBounds().b.f,
                bottom: app.google_map.getBounds().b.b,
                left: app.google_map.getBounds().f.f,
                right: app.google_map.getBounds().f.b
            }
        }
    }
})();