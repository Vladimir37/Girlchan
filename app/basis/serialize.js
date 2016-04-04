function serialize(status, body) {
    body = body || null;
    var result = {
        status,
        body
    };
    return JSON.stringify(result);
}

module.exports = serialize;