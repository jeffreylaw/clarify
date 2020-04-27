const RequestService = require('../Services/RequestService');

exports.Index = async function(req, res) {
    let reqInfo = RequestService.reqHelper(req);
    return res.render('Home/Index', { reqInfo:reqInfo });
};
