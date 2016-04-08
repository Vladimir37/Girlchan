export default function(data, url, type, success, data_error, system_error) {
    var emptyFunction = function(){};
    success = success || emptyFunction;
    error = error || emptyFunction;
    complete = complete || emptyFunction;
    data = data || {};
    $.ajax({
        url,
        type,
        data,
        dataType: 'json',
        error: system_error,
        success(raw_data) {
            try {
                var data = JSON.parse(raw_data);
                if(data.status == 0) {
                    success(data.body);
                }
                else {
                    data_error(data.status);
                }
            }
            catch(err) {
                system_error(err);
            }
        }
    });
};