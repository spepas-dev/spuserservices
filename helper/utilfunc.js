const { logger } = require("../logs/winston");
const otpGenerator = require('otp-generator');
const {RESPONSE_CODES } = require("../helper/vars");
const {createHash} = require('crypto');
const crypto = require('crypto');
const ldap = require('ldapjs');
const jwt = require('jsonwebtoken');
const axios = require('axios');

let ussd = {};






ussd.sendResponse = (res, code,message, data) => {

    /*
    if(session)
    {
     //there is a session update last update time of session
     let session_id = session.session_id;

     session.date_ended = new Date();
      sessionModel.update(session_id,session );
    }
if(log)
{
//update log here
log.date_ended = new Date();
sessionModel.addLog(log);
}
*/

   data?.status == RESPONSE_CODES.FAILED ? logger.error(message) : logger.info(message)
   res.status(code).json(data)
};


    ussd.sha256Encrypt = (textPhrase) => {

      //console.log("raw text here: "+ textPhrase)
        const hash = createHash('sha256');
        for (let i = 0; i < textPhrase.length; i++) {
          const rawText = textPhrase[i].trim(); // remove leading/trailing whitespace
          if (rawText === '') continue; // skip empty lines
          hash.write(rawText); // write a single line to the buffer
        }
      
        return hash.digest('base64'); 
     };



     ussd.generateOTP = (length) => {
      const OTP = otpGenerator.generate(length);
      console.log('otp here: ' + OTP);



      if(length == 4)
      {
         return '1234'
      }else{
         return '123456'
      }

     // return OTP;
    };





     ussd.formatPhone = (phone) => {

      console.log("++++++++= phone: "+ phone)
      if(phone.startsWith('0') && phone.length == 10)
      {
        phone = phone.substring(1);
        phone =  "233" + phone;
      }else if(!phone.startsWith('0') && phone.length == 9)
      {
         phone = phone.substring(2);
         phone =  "233" + phone;
      }else if(phone.startsWith('+233'))
      {
         phone = phone.substring(1);
      }else  if(phone.startsWith('2330') && phone.length == 13)
      {
        phone = phone.substring(4);
        phone =  "233" + phone;
      }else  if(phone.startsWith('00233') && phone.length == 14)
      {
        phone = phone.substring(5);
        phone =  "233" + phone;
      }else  if(phone.startsWith('0233') && phone.length == 13)
      {
        phone = phone.substring(4);
        phone =  "233" + phone;
      }else if(phone.startsWith('+'))
      {
         phone = phone.substring(1);
      }
     
      phone = phone.replace(/ /g, '');
        return phone; 
     };





    ussd.formateUser = (userReg) => {

      delete userReg["id"];
      delete userReg["user_id"];
      delete userReg["password"];
      delete userReg["cloudinary_data"];
       
        return userReg; 
     };


     ussd.authenticate  = async (username, password) =>{
      

      /*
      return new Promise((resolve, reject) => {
        // LDAP server details
        const domain = process.env.LDAPDOMAIN;
        const ldapUrl = process.env.LDAPURL;

        // Create the LDAP client
        const client = ldap.createClient({
            url: ldapUrl,
            timeout: 5000,           // 5 seconds timeout for operations
            connectTimeout: 10000    // 10 seconds timeout for connecting
        });

        // Handle client connection errors and timeouts
        client.on('error', (err) => {
            console.error('LDAP client error:', err.message);
            reject('Failed to connect to LDAP server');
        });

        client.on('timeout', () => {
            console.error('LDAP client connection timed out');
            reject('LDAP server connection timed out');
        });

        // Construct the DN (Distinguished Name) for the user
        const domainAndUsername = `${domain}\\${username}`;
        
        // Perform a simple bind (authentication)
        client.bind(domainAndUsername, password, (err) => {
            if (err) {
                console.error('LDAP bind failed:', err.message);
                client.unbind(() => reject('Authentication failed')); // Ensure client unbinds on failure
                return;
            }

            // If bind is successful, search for the user
            const searchOptions = {
                filter: `(SAMAccountName=${username})`,
                scope: 'sub'
            };
            
            client.search('CN=Users,DC=championgh,DC=com', searchOptions, (searchErr, searchRes) => {
                if (searchErr) {
                    console.error('LDAP search failed:', searchErr.message);
                    client.unbind(() => reject('Search failed')); // Ensure client unbinds on failure
                    return;
                }

                searchRes.on('searchEntry', (entry) => {
                    if (entry) {
                        // If user found
                        console.log('User found:', entry.object);
                        client.unbind(() => resolve(true)); // Resolve with true if user is found
                    } else {
                        // If user not found
                        client.unbind(() => resolve(false)); // Resolve with false if user is not found
                    }
                });

                searchRes.on('error', (err) => {
                    console.error('Search error:', err.message);
                    client.unbind(() => reject('Search error')); // Ensure client unbinds on failure
                });

                searchRes.on('end', () => {
                    console.log('Search completed');
                });
            });
        });
    });
*/






      return new Promise((resolve, reject) => {
        // Create the LDAP client with a timeout configuration
        const client = ldap.createClient({
            url: process.env.LDAPURL, // Your LDAP server URL
            timeout: 5000,                // 5 seconds timeout for operations
            connectTimeout: 10000         // 10 seconds timeout for connecting
        });

        // Handle client connection errors and timeouts
        client.on('error', (err) => {
            console.error('LDAP client error:', err.message);
            reject('Failed to connect to LDAP server');
        });

        client.on('timeout', () => {
            console.error('LDAP client connection timed out');
            reject('LDAP server connection timed out');
        });

        // Define the DN (Distinguished Name) for the user
        //const dn = `cn=${username},dc=${process.env.LDAPDOMAIN}`; // Adjust this format as per your LDAP structure

        console.log("client here")
        console.log(dn);
        const dn = `CN=${username},CN=Users,DC=${process.env.LDAPDOMAIN},DC=com`
        // Perform a simple bind (authentication)
        client.bind(dn, password, (err) => {
            if (err) {
                console.error('LDAP bind failed:', err.message);
                reject('Authentication failed');
            } else {
                console.log('LDAP bind successful');
                resolve('Authentication successful');
            }

            // Unbind the client after authentication to free up resources
            client.unbind((unbindErr) => {
                if (unbindErr) {
                    console.error('Failed to unbind client:', unbindErr.message);
                }
            });
        });
    });

  
  }






  ussd.AESEncrypt = (privateString, userkey) => {

    const GCM_IV_LENGTH = 12; // 96-bit IV
  const GCM_TAG_LENGTH = 16; // 128-bit authentication tag

  // Use your 16-byte key (AES-128)
  const key = Buffer.from('KPr42187Bar22999', 'utf-8'); // 16-byte key (128 bits)
  const iv = crypto.randomBytes(GCM_IV_LENGTH); // Generate IV
  
  const cipher = crypto.createCipheriv('aes-128-gcm', key, iv, { authTagLength: GCM_TAG_LENGTH });
  
  let encrypted = cipher.update(privateString, 'utf8');
  encrypted = Buffer.concat([encrypted, cipher.final()]);
  
  const tag = cipher.getAuthTag(); // Get the authentication tag
  
  // Combine IV, encrypted message, and authentication tag into one buffer
  const result = Buffer.concat([iv, encrypted, tag]);

  // Convert to Base64 for readability
  return result.toString('base64');
   };







   ussd.makeHttpRequest = async (method, url, data = null) => {
    
    try {
        const options = {
          method: method.toUpperCase(),
          url,
          ...(method.toUpperCase() === 'POST' && { data }),
        };
    
        const response = await axios(options);
        return response.data;
      } catch (error) {
        console.error(`Error in ${method} request to ${url}:`, error.message);
        throw error; // Propagate error for further handling
      }


};


ussd.verifyTokenRefresh = (token) => {

    try {
      if (!token) {
          throw new Error('No token provided.');
      }
      const decoded = jwt.verify(token, process.env.JWT_TOKEN_REFRESH); // Verifies the token
      return decoded; // Returns the decoded token payload
  } catch (error) {
      throw new Error(error.message || 'Invalid or expired token.');
  }
  
  
  };
  
  ussd.verifyToken = (token) => {
  
    try {
      if (!token) {
          throw new Error('No token provided.');
      }
      const decoded = jwt.verify(token, process.env.JWT_TOKEN); // Verifies the token
      return decoded; // Returns the decoded token payload
  } catch (error) {
      throw new Error(error.message || 'Invalid or expired token.');
  }
  
  
  };
  

    
module.exports = ussd
