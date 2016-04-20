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

export function markdown(text) {
    var result = text.replace(/\*\*([\s\S]+?)\*\*/gm, '<b>$1</b>');
    result = result.replace(/\*([\s\S]+?)\*/gm, '<i>$1</i>');
    result = result.replace(/__([\s\S]+?)__/g, '<span class="crossed">$1</span>');
    result = result.replace(/%%([\s\S]+?)%%/g, '<span class="spoiler">$1</span>');
    result = result.replace(/(^|\n)(>.+?)(\n|$)/gm, '$1<article class="quote">$2</article>');
    return {__html: result};
}