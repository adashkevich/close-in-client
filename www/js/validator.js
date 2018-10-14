var validator = function () {

    var validation_map = {
        phone: {
            '+375': {
                length: 9,
                start_with: /^(44)|(33)|(29)/
            },
            '+7': {
                length: 9
            },
            '+380': {
                length: 10
            }
        }
    };

    return {
        phone: function (country_code, phone) {
            var validation_cfg = validation_map['phone'][country_code];

            if (!phone) {
                return false;
            }

            if (!validation_cfg) {
                return phone.length !== 0;
            }

            if (validation_cfg.length && phone.length !== validation_cfg.length) {
                return false;
            }

            if (validation_cfg.start_with && !phone.match(validation_cfg.start_with)) {
                return false;
            }

            return true;
        }
    }
}();
