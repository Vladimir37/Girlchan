function error_handling(context) {
    return function(err) {
        console.log(err);
        context.setState({
            error: true
        });
    }
}

export default function(data, url, type, context, success) {
    var emptyFunction = function(){};
    success = success || emptyFunction;
    data = data || {};
    $.ajax({
        url,
        type,
        data,
        dataType: 'json',
        error: error_handling(context),
        success(raw_data) {
            try {
                var data = JSON.parse(raw_data);
                if(data.status == 0) {
                    success(data.body);
                }
                else {
                    error_handling(context)(data.status);
                }
            }
            catch(err) {
                error_handling(context)(err);
            }
        }
    });
};