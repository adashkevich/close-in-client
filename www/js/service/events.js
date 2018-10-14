service.events = (function () {
    var events, participate, organize, area, bookings = {};

    function formatRange(area) {
        return 'ST_MakeEnvelope({left},{top},{right},{bottom})'
            .replace('{top}', area.top).replace('{bottom}', area.bottom).replace('{left}', area.left).replace('{right}', area.right);
    }

    function adoptBookings(data) {
        var result = {};
        data.forEach(function (booking) {
            result[booking.event_id] = {
                count: booking.count
            }
        });
        return result;
    }

    function mergeEvents(data) {
        data.forEach(function (event) {
           if(!service.events.get(event.id)) {
               events.push(event);
           }
        });
    }

    return {
        list: function (position, date, success, error) {
            area = {left: position.lat + 0.02, right: position.lat - 0.02, top: position.lng + 0.02, bottom: position.lng - 0.02};

            Framework7.request({
                url: app.cfg.endpoint + '/events',
                cache: false,
                contentType: 'application/json; charset=utf-8',
                dataType: 'json',
                data: {area: formatRange(area), date: date},
                success: function (data) {
                    mergeEvents(data);
                    success && success(data);
                },
                error: function (e) {
                    //TODO show error msg
                    console.log(e);
                    error && error(e)
                }
            });
        },

        participateList: function (success, error) {
            if(participate) {
                success(participate);
            } else {
                Framework7.request({
                    url: app.cfg.endpoint + '/events/participate',
                    cache: false,
                    contentType: 'application/json; charset=utf-8',
                    dataType: 'json',
                    success: function (data) {
                        mergeEvents(data);
                        success && success(data);
                    },
                    error: function (e) {
                        //TODO show error msg
                        console.log(e);
                        error && error(e)
                    }
                });
            }
        },

        organizeList: function (success, error) {
            if(organize) {
                success(organize);
            } else {
                Framework7.request({
                    url: app.cfg.endpoint + '/events/organize',
                    cache: false,
                    contentType: 'application/json; charset=utf-8',
                    dataType: 'json',
                    success: function (data) {
                        mergeEvents(data);
                        success && success(data);
                    },
                    error: function (e) {
                        //TODO show error msg
                        console.log(e);
                        error && error(e)
                    }
                });
            }
        },

        booking: function (success, error) {
            Framework7.request({
                url: app.cfg.endpoint + '/bookings',
                cache: false,
                contentType: 'application/json; charset=utf-8',
                dataType: 'json',
                success: function (data) {
                    success && success(bookings = adoptBookings(data));
                },
                error: function (e) {
                    //TODO show error msg
                    console.log(e);
                    error && error(e)
                }
            });
        },

        get: function (id) {
            return events.find(function (event) {
                if ('' + event.id === '' + id) {
                    event.booking = bookings[event.id];
                    return true;
                }
            });
        },

        inRange: function (rectangle) {
            return area && area.left > rectangle.left && area.right < rectangle.right && area.top > rectangle.top && area.bottom < rectangle.bottom;
        },

        clear: function () {
            area = null; events = [];
        }
    }
})();