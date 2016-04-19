import toastr from "toastr";

function error_handling(context) {
    return function(err) {
        console.log(err);
        context.setState({
            error: true
        });
    }
}

export function Request(url, data, type, context, success, error) {
    console.log(url);
    console.log(data);
    var emptyFunction = function(){};
    success = success || emptyFunction;
    if(error) {
        error = function(err) {
            console.log(err);
            return error
        }
    }
    else {
        error = error_handling;
    }
    data = data || {};
    $.ajax({
        url,
        type,
        data,
        dataType: 'json',
        error: error(context),
        success(data) {
            if(data.status == 0) {
                success(data.body);
            }
            else {
                error(context)(data.status);
            }
        }
    });
};

export function toast(text, is_bad) {
    toastr.options = {
        "closeButton": true,
        "debug": false,
        "newestOnTop": true,
        "progressBar": false,
        "positionClass": "toast-top-right",
        "preventDuplicates": false,
        "onclick": null,
        "showDuration": "300",
        "hideDuration": "1000",
        "timeOut": "5000",
        "extendedTimeOut": "1000",
        "showEasing": "swing",
        "hideEasing": "linear",
        "showMethod": "fadeIn",
        "hideMethod": "fadeOut"
    };
    var type = is_bad ? "error" : "success";
    toastr[type](text);
}