service.auth = (function () {

    return {

        getLogIn: function (success, error) {
            db.transaction(function (tx) {
                tx.executeSql('SELECT * FROM auth', [], function (tx, results) {
                    if(!results.rows.length) {
                        success && success();
                    } else if (results.rows.length === 1) {
                        var result = results.rows[0];

                        Framework7.request.setup({headers: {'Authorization': result.auth_token}});
                        success && success(result);
                    } else {
                        tx.executeSql('DELETE FROM auth', [], function (tx, results) {
                            success && success();
                        });
                    }
                }, function (tx, e) {
                    error && error(e);
                });
            });
        },

        logIn: function (data, xmlHttpRequest, success, error) {
            var auth_token = xmlHttpRequest.getResponseHeader('Authorization');

            service.user.create(data, function (user) {
                db.transaction(function (tx) {
                    tx.executeSql('INSERT INTO auth (user_id, auth_token) VALUES (?, ?)', [data.id, auth_token], function (tx, results) {
                        app.data.current_user = user;

                        Framework7.request.setup({headers: {'Authorization': auth_token}});
                        success && success(app.data.current_user);
                    }, function (tx, e) {
                        error && error(e);
                    });
                });
            });
        },

        logOut: function (success, error) {
            Framework7.request({
                url: app.cfg.endpoint + '/logout',
                method: 'DELETE',
                contentType: 'application/json; charset=utf-8',
                dataType: 'json',
                success: function () {
                    success && success();
                },
                error: function (e) {
                    //TODO show error msg
                    console.log(e);
                    error && error(e)
                }
            });
        }
    }
})();