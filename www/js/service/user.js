service.user = (function () {

    return {
        list: function (success, error) {
            db.transaction(function (tx) {
                tx.executeSql('SELECT * FROM users', [], function (tx, results) {
                    var users = utils.sqlResultSetToArray(results);
                    success && success(users);
                }, function (tx, e) {
                    error && error(e);
                });
            });
        },

        getByIds: function (ids) {
            return app.data.users.filter(function (user) {
                return ids.indexOf(user.id) !== -1;
            });
        },

        get: function (id) {
            return app.data.users.find(function (user) {
                return user.id === id;
            });
        },

        create: function (data, success, error) {
            var userData = [
                data.id,
                data.name,
                data.country_code,
                data.phone
            ];
            db.transaction(function (tx) {
                tx.executeSql('INSERT INTO users (id, name, country_code, phone) VALUES (?, ?, ?, ?)', userData, function (tx, results) {
                    app.data.users.push(app.utils.extend({}, data));
                    success && success(service.user.get(data.id));
                }, function (tx, e) {
                    error && error(e);
                });
            });
        },

        update: function (data, success, error) {
            var userData = [
                data.id,
                data.name,
                data.country_code,
                data.phone
            ];
            db.transaction(function (tx) {
                tx.executeSql('UPDATE users SET name=?, country_code=?, phone=? WHERE id=?', userData, function (tx, results) {
                    var result = app.utils.extend(service.user.get(data.id), data);

                    success && success(result);
                }, function (tx, e) {
                    error && error(e);
                });
            });
        }
    }
})();