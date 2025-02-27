const asyncHandler = require("./async");



exports.NoneUserCheck = asyncHandler(async (req, res, next) => {
    let header = req.headers
    let {token, key} = header;

    //let userAgentObj =  JSON.parse(useragent);

    //req.userAgent = userAgentObj;
    //req.platform = platform;
    /*

     let resp = {
            status : RESPONSE_CODES.SESSION_EXPIRED,
            message : "Invalid user"
        };

        return UtilityHelper.sendResponse(res, 200, resp.message, resp)
    */
 
    return next()
})