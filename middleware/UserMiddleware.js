const asyncHandler = require("./async");
const UtilityHelper = require("../helper/utilfunc");
const { REGISTRATION_STATUS, RESPONSE_CODES } = require("../helper/vars");




exports.VALIDATE_TOKEN = asyncHandler(async (req, res, next) => {
    let header = req.headers
    let {session_token} = header;
   // console.log("request token token here: ")
   // console.log(session_token)
    let token = await UtilityHelper.verifyToken(session_token);
   // console.log("XXXXXXXXXXXX token here: ")
    //console.log(token)
    if(!token)
        {
            let resp = {
                status : RESPONSE_CODES.SESSION_EXPIRED,
                message : "Invalid user"
            };
    
            return UtilityHelper.sendResponse(res, 200, resp.message, resp)
        }


   let User_ID = token.User_ID;




  var loginUrl = process.env.DB_BASE_URL +"user/by-id/"+User_ID; 
 
    


  let newJob = await UtilityHelper.makeHttpRequest("GET",loginUrl);



      if(!newJob)
       {
           var resp = {
               status : RESPONSE_CODES.FAILED,
               message : "Failed to connect to user services",
               data : continents
           };
           return UtilityHelper.sendResponse(res, 200, resp.message, resp);
       }


          
       if(newJob.status != RESPONSE_CODES.SUCCESS){
        return UtilityHelper.sendResponse(res, 200, newJob.message, newJob);
     }


     let user = newJob.data;
     req.user  = user;

    return next()
})