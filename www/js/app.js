var $$ = Dom7,
    db = window.openDatabase("travel_wallet", "1.0", "Close In DB", 1000000);

var app = new Framework7({
    root: '#app',
    name: 'Close In',
    id: 'com.adashkevich.phonegap.closein',
    version: '1.0.0',
    panel: {
        swipe: 'left'
    },

    routes: [
        {
            path: '/login-screen/',
            loginScreen: {
                componentUrl: './pages/login-screen.html'
            }
        },
        {
            path: '/main/',
            componentUrl: './pages/main.html',
            tabs: [
                {
                    path: '/',
                    id: 'map-tab',
                    componentUrl: './pages/events/map.html'
                },
                {
                    path: '/events/',
                    id: 'events-tab',
                    componentUrl: './pages/events/index.html'
                },
                {
                    path: '/notification/',
                    id: 'notification-tab',
                    componentUrl: './pages/notifications/index.html'
                },
                {
                    path: '/menu/',
                    id: 'menu-tab',
                    componentUrl: './pages/menu/show.html'
                }
            ]
        },
        {
            path: '/events/new/',
            componentUrl: './pages/events/new.html'
        },
        {
            path: '/events/show/:event_id/',
            componentUrl: './pages/events/show.html'
        },
        {
            path: '/events/participate/:event_id/',
            componentUrl: './pages/events/show.html'
        },
        {
            path: '/events/organize/:event_id/',
            componentUrl: './pages/events/edit.html'
        },
    ],
    data: function () {
        return {
            users: [],
            events: [],
            locale_str: utils.localeStr(),
            device: app.device
        };
    }
});

app.cfg = {
    endpoint: 'http://127.0.0.1:3000'
};

app.views.create('.view-main');

db.transaction(function (tx) {
    tx.executeSql('CREATE TABLE IF NOT EXISTS auth (user_id, auth_token)');
    tx.executeSql('CREATE TABLE IF NOT EXISTS users (id UNIQUE, name, country_code, phone)');
    tx.executeSql('CREATE TABLE IF NOT EXISTS events (id UNIQUE, title, category, location, start_time, ent_time, cost, capacity)');
    tx.executeSql('CREATE TABLE IF NOT EXISTS geo_location (lan, lat)');
});

db.transaction(function (tx) {
//53.902496, 27.561481
});

function initAppData() {

    service.init.add(service.user.list, function (users) {
        app.data.users = users;
        service.init.finish('users');
    }, 'users');

    service.init.add(service.auth.getLogIn, function (details) {
        if(details) {
            app.data.current_user = service.user.get(details.user_id);
        }
        service.init.finish('current_user');
    }, 'current_user', ['users']);

    service.init.add(function () {
        if (!app.data.current_user) {
            app.views.current.router.navigate('/login-screen/', {
                animate: false
            });
        } else {
            service.init.finish('login');
        }
    }, [], 'login', ['current_user']);

    service.init.start(function () {
        console.log('start');

        service.events.booking();

        app.google_map = new google.maps.Map(document.getElementById('google-map'), {
            center: {lat: 53.902496, lng: 27.561481},
            zoom: 15,
            zoomControlOptions: {
                position: google.maps.ControlPosition.LEFT_CENTER
            },
            fullscreenControl: false
        });

        google.maps.event.addListener(app.google_map, 'bounds_changed', function () {
            var position = {
                lat: app.google_map.getCenter().lat(),
                lng: app.google_map.getCenter().lng()
            }, date = new Date().format();

            if(!service.events.inRange(service.map.getBounds())) {
                service.events.list(position, date, function (events) {
                    console.log(events);
                    service.map.setEvents(events);
                }, function (error) {
                    //TODO implement error handling
                    console.log(error);
                })
            }

            $$(document).on('event:show', '#google-map', function (event, data) {
                //TODO implement navigation logic
                app.views.current.router.navigate('/events/show/:event_id/'.replace(':event_id', data.id));
            });
        });


        app.views.current.router.navigate('/main/', {
            animate: false
        });
    });
}

$$(document).once('page:init', '.page[data-name="init"]', function (e) {
    initAppData();
});