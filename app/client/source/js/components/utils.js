function error_handling(context) {
    return function(err) {
        console.log(err);
        context.setState({
            error: true
        });
    }
}

export default function(url, data, type, context, success) {
    var emptyFunction = function(){};
    console.log(url);
    success = success || emptyFunction;
    data = data || {};
    $.ajax({
        url,
        type,
        data,
        dataType: 'json',
        error: error_handling(context),
        success(raw_data) {
            console.log(raw_data);
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
                console.log('Read error');
                error_handling(context)(err);
            }
        }
    });
};