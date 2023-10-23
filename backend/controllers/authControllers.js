const User = require("../models/UserSchema");
const Userverification = require("../models/verifyaccountsSchema");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const cookieParser = require("cookie-parser");
const nodemailer = require("nodemailer");
const { v4: uuidv4 } = require("uuid");
const validation = require('../util/validation_schema')

require("dotenv").config();
const axios = require("axios");

let transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.AUTH_EMAIL,
    pass: process.env.AUTH_PASS_APP,
  },
});

transporter.verify((err, success) => {
  if (err) {
    console.log(err);
  } else {
    console.log("ready for messages");
    console.log(success);
  }
});

function options(type, currentUrl, uniqueString, Email, _id) {
  let obj;
  var longUrl;
  if (type == "forgotPassword") {
    longUrl = currentUrl + "/reset_password/" + _id + "/" + uniqueString;
  } else {
    longUrl = currentUrl + "/verify/" + _id + "/" + uniqueString;
  }

  // const headers = {
  //   "Authorization": "Bearer 8mqLsjnHm3wryZMvtzTAsRkI29devaXCg9hv1AuowabAC9W65KyBFZG8QSOG",
  //   "Content-Type": "application/json",
  //   "accept": "application/json",
  // };

  // const body = {
  //   "long_url": "https://www.npmjs.com/package/shorturl",
  //   "expire_at_views" : 2
  // };

  // try {
  //   var response = await axios.post("https://t.ly/api/v1/link/shorten", body, { headers });
  //   console.log(response.data);
  // } catch (error) {
  //   console.error('Error making request:', error);
  // }
  // var ShortUrl = response.data.short_url ;
  var ShortUrl = longUrl;
  if (type == "forgotPassword") {
    obj = {
      from: process.env.AUTH_EMAIL,
      to: Email,
      subject: "Reset Your Passwords",
      html: `<!DOCTYPE html>
      <html>
      <head>
      
        <meta charset="utf-8">
        <meta http-equiv="x-ua-compatible" content="ie=edge">
        <title>Reset Password</title>
        <meta name="viewport" content="width=device-width, initial-scale=1">
        <style type="text/css">
        /**
         * Google webfonts. Recommended to include the .woff version for cross-client compatibility.
         */
        @media screen {
          @font-face {
            font-family: 'Source Sans Pro';
            font-style: normal;
            font-weight: 400;
            src: local('Source Sans Pro Regular'), local('SourceSansPro-Regular'), url(https://fonts.gstatic.com/s/sourcesanspro/v10/ODelI1aHBYDBqgeIAH2zlBM0YzuT7MdOe03otPbuUS0.woff) format('woff');
          }
          @font-face {
            font-family: 'Source Sans Pro';
            font-style: normal;
            font-weight: 700;
            src: local('Source Sans Pro Bold'), local('SourceSansPro-Bold'), url(https://fonts.gstatic.com/s/sourcesanspro/v10/toadOcfmlt9b38dHJxOBGFkQc6VGVFSmCnC_l7QZG60.woff) format('woff');
          }
        }
        /**
         * Avoid browser level font resizing.
         * 1. Windows Mobile
         * 2. iOS / OSX
         */
        body,
        table,
        td,
        a {
          -ms-text-size-adjust: 100%; /* 1 */
          -webkit-text-size-adjust: 100%; /* 2 */
        }
        /**
         * Remove extra space added to tables and cells in Outlook.
         */
        table,
        td {
          mso-table-rspace: 0pt;
          mso-table-lspace: 0pt;
        }
        /**
         * Better fluid images in Internet Explorer.
         */
        img {
          -ms-interpolation-mode: bicubic;
        }
        /**
         * Remove blue links for iOS devices.
         */
        a[x-apple-data-detectors] {
          font-family: inherit !important;
          font-size: inherit !important;
          font-weight: inherit !important;
          line-height: inherit !important;
          color: inherit !important;
          text-decoration: none !important;
        }
        /**
         * Fix centering issues in Android 4.4.
         */
        div[style*="margin: 16px 0;"] {
          margin: 0 !important;
        }
        body {
          width: 100% !important;
          height: 100% !important;
          padding: 0 !important;
          margin: 0 !important;
        }
        /**
         * Collapse table borders to avoid space between cells.
         */
        table {
          border-collapse: collapse !important;
        }
        a {
          color: #1a82e2;
        }
        img {
          height: auto;
          line-height: 100%;
          text-decoration: none;
          border: 0;
          outline: none;
        }
        </style>
      
      </head>
      <body style="background-color: #e9ecef;">
      
        <!-- start preheader -->
        <div class="preheader" style="display: none; max-width: 0; max-height: 0; overflow: hidden; font-size: 1px; line-height: 1px; color: #fff; opacity: 0;">
          A preheader is the short summary text that follows the subject line when an email is viewed in the inbox.
        </div>
        <!-- end preheader -->
      
        <!-- start body -->
        <table border="0" cellpadding="0" cellspacing="0" width="100%">
      
          <!-- start logo -->
          <tr>
            <td align="center" bgcolor="#e9ecef">
              <!--[if (gte mso 9)|(IE)]>
              <table align="center" border="0" cellpadding="0" cellspacing="0" width="600">
              <tr>
              <td align="center" valign="top" width="600">
              <![endif]-->
              <table border="0" cellpadding="0" cellspacing="0" width="100%" style="max-width: 600px;">
                <tr>
                  <td align="center" valign="top" style="padding: 36px 24px;">
                    <a href="https://www.blogdesire.com" target="_blank" style="display: inline-block;">
                      <img src="https://www.blogdesire.com/wp-content/uploads/2019/07/blogdesire-1.png" alt="Logo" border="0" width="48" style="display: block; width: 48px; max-width: 48px; min-width: 48px;">
                    </a>
                  </td>
                </tr>
              </table>
              <!--[if (gte mso 9)|(IE)]>
              </td>
              </tr>
              </table>
              <![endif]-->
            </td>
          </tr>
          <!-- end logo -->
      
          <!-- start hero -->
          <tr>
            <td align="center" bgcolor="#e9ecef">
              <!--[if (gte mso 9)|(IE)]>
              <table align="center" border="0" cellpadding="0" cellspacing="0" width="600">
              <tr>
              <td align="center" valign="top" width="600">
              <![endif]-->
              <table border="0" cellpadding="0" cellspacing="0" width="100%" style="max-width: 600px;">
                <tr>
                  <td align="left" bgcolor="#ffffff" style="padding: 36px 24px 0; font-family: 'Source Sans Pro', Helvetica, Arial, sans-serif; border-top: 3px solid #d4dadf;">
                    <h1 style="margin: 0; font-size: 32px; font-weight: 700; letter-spacing: -1px; line-height: 48px;">Reset your Password</h1>
                  </td>
                </tr>
              </table>
              <!--[if (gte mso 9)|(IE)]>
              </td>
              </tr>
              </table>
              <![endif]-->
            </td>
          </tr>
          <!-- end hero -->
      
          <!-- start copy block -->
          <tr>
            <td align="center" bgcolor="#e9ecef">
              <!--[if (gte mso 9)|(IE)]>
              <table align="center" border="0" cellpadding="0" cellspacing="0" width="600">
              <tr>
              <td align="center" valign="top" width="600">
              <![endif]-->
              <table border="0" cellpadding="0" cellspacing="0" width="100%" style="max-width: 600px;">
      
                <!-- start copy -->
                <tr>
                  <td align="left" bgcolor="#ffffff" style="padding: 24px; font-family: 'Source Sans Pro', Helvetica, Arial, sans-serif; font-size: 16px; line-height: 24px;">
                    <p style="margin: 0;">Tap the button below to reset your Password</p>
                  </td>
                </tr>
                <!-- end copy -->
      
                <!-- start button -->
                <tr>
                  <td align="left" bgcolor="#ffffff">
                    <table border="0" cellpadding="0" cellspacing="0" width="100%">
                      <tr>
                        <td align="center" bgcolor="#ffffff" style="padding: 12px;">
                          <table border="0" cellpadding="0" cellspacing="0">
                            <tr>
                              <td align="center" bgcolor="#1a82e2" style="border-radius: 6px;">
                                <a target="_blank" style="display: inline-block; padding: 16px 36px; font-family: 'Source Sans Pro', Helvetica, Arial, sans-serif; font-size: 16px; color: #ffffff; text-decoration: none; border-radius: 6px;" href=${ShortUrl}>Reset Password</a>
                              </td>
                            </tr>
                          </table>
                        </td>
                      </tr>
                    </table>
                  </td>
                </tr>
                <!-- end button -->
      
                <!-- start copy -->
                <tr>
                  <td align="left" bgcolor="#ffffff" style="padding: 24px; font-family: 'Source Sans Pro', Helvetica, Arial, sans-serif; font-size: 16px; line-height: 24px;">
                  <p style="margin: 0;">If that doesn't work, <a target="_blank" href=${ShortUrl}>
                    Click here
    </a></p>
                  </td>
                </tr>
                <!-- end copy -->
      
                <!-- start copy -->
                <tr>
                  <td align="left" bgcolor="#ffffff" style="padding: 24px; font-family: 'Source Sans Pro', Helvetica, Arial, sans-serif; font-size: 16px; line-height: 24px; border-bottom: 3px solid #d4dadf">
                    <p style="margin: 0;">Cheers,<br> </p>
                  </td>
                </tr>
                <!-- end copy -->
      
              </table>
              <!--[if (gte mso 9)|(IE)]>
              </td>
              </tr>
              </table>
              <![endif]-->
            </td>
          </tr>
          <!-- end copy block -->
      
          <!-- start footer -->
          <tr>
            <td align="center" bgcolor="#e9ecef" style="padding: 24px;">
              <!--[if (gte mso 9)|(IE)]>
              <table align="center" border="0" cellpadding="0" cellspacing="0" width="600">
              <tr>
              <td align="center" valign="top" width="600">
              <![endif]-->
              <table border="0" cellpadding="0" cellspacing="0" width="100%" style="max-width: 600px;">
      
                <!-- start permission -->
                <tr>
                  <td align="center" bgcolor="#e9ecef" style="padding: 12px 24px; font-family: 'Source Sans Pro', Helvetica, Arial, sans-serif; font-size: 14px; line-height: 20px; color: #666;">
                    <p style="margin: 0;">You received this email because we received a request for [type_of_action] for your account. If you didn't request [type_of_action] you can safely delete this email.</p>
                  </td>
                </tr>
                <!-- end permission -->
      
                <!-- start unsubscribe -->
                <tr>
                  <td align="center" bgcolor="#e9ecef" style="padding: 12px 24px; font-family: 'Source Sans Pro', Helvetica, Arial, sans-serif; font-size: 14px; line-height: 20px; color: #666;">
                    <p style="margin: 0;">To stop receiving these emails, you can <a href="https://www.blogdesire.com" target="_blank">unsubscribe</a> at any time.</p>
                    <p style="margin: 0;">Paste 1234 S. Broadway St. City, State 12345</p>
                  </td>
                </tr>
                <!-- end unsubscribe -->
      
              </table>
              <!--[if (gte mso 9)|(IE)]>
              </td>
              </tr>
              </table>
              <![endif]-->
            </td>
          </tr>
          <!-- end footer -->
      
        </table>
        <!-- end body -->
      
      </body>
      </html>`,
    };
  } else {
    obj = {
      from: process.env.AUTH_EMAIL,
      to: Email,
      subject: "Verify your Email",
      html: `<!DOCTYPE html>
      <html>
      <head>
      
        <meta charset="utf-8">
        <meta http-equiv="x-ua-compatible" content="ie=edge">
        <title>Email Confirmation</title>
        <meta name="viewport" content="width=device-width, initial-scale=1">
        <style type="text/css">
        /**
         * Google webfonts. Recommended to include the .woff version for cross-client compatibility.
         */
        @media screen {
          @font-face {
            font-family: 'Source Sans Pro';
            font-style: normal;
            font-weight: 400;
            src: local('Source Sans Pro Regular'), local('SourceSansPro-Regular'), url(https://fonts.gstatic.com/s/sourcesanspro/v10/ODelI1aHBYDBqgeIAH2zlBM0YzuT7MdOe03otPbuUS0.woff) format('woff');
          }
          @font-face {
            font-family: 'Source Sans Pro';
            font-style: normal;
            font-weight: 700;
            src: local('Source Sans Pro Bold'), local('SourceSansPro-Bold'), url(https://fonts.gstatic.com/s/sourcesanspro/v10/toadOcfmlt9b38dHJxOBGFkQc6VGVFSmCnC_l7QZG60.woff) format('woff');
          }
        }
        /**
         * Avoid browser level font resizing.
         * 1. Windows Mobile
         * 2. iOS / OSX
         */
        body,
        table,
        td,
        a {
          -ms-text-size-adjust: 100%; /* 1 */
          -webkit-text-size-adjust: 100%; /* 2 */
        }
        /**
         * Remove extra space added to tables and cells in Outlook.
         */
        table,
        td {
          mso-table-rspace: 0pt;
          mso-table-lspace: 0pt;
        }
        /**
         * Better fluid images in Internet Explorer.
         */
        img {
          -ms-interpolation-mode: bicubic;
        }
        /**
         * Remove blue links for iOS devices.
         */
        a[x-apple-data-detectors] {
          font-family: inherit !important;
          font-size: inherit !important;
          font-weight: inherit !important;
          line-height: inherit !important;
          color: inherit !important;
          text-decoration: none !important;
        }
        /**
         * Fix centering issues in Android 4.4.
         */
        div[style*="margin: 16px 0;"] {
          margin: 0 !important;
        }
        body {
          width: 100% !important;
          height: 100% !important;
          padding: 0 !important;
          margin: 0 !important;
        }
        /**
         * Collapse table borders to avoid space between cells.
         */
        table {
          border-collapse: collapse !important;
        }
        a {
          color: #1a82e2;
        }
        img {
          height: auto;
          line-height: 100%;
          text-decoration: none;
          border: 0;
          outline: none;
        }
        </style>
      
      </head>
      <body style="background-color: #e9ecef;">
      
        <!-- start preheader -->
        <div class="preheader" style="display: none; max-width: 0; max-height: 0; overflow: hidden; font-size: 1px; line-height: 1px; color: #fff; opacity: 0;">
          A preheader is the short summary text that follows the subject line when an email is viewed in the inbox.
        </div>
        <!-- end preheader -->
      
        <!-- start body -->
        <table border="0" cellpadding="0" cellspacing="0" width="100%">
      
          <!-- start logo -->
          <tr>
            <td align="center" bgcolor="#e9ecef">
              <!--[if (gte mso 9)|(IE)]>
              <table align="center" border="0" cellpadding="0" cellspacing="0" width="600">
              <tr>
              <td align="center" valign="top" width="600">
              <![endif]-->
              <table border="0" cellpadding="0" cellspacing="0" width="100%" style="max-width: 600px;">
                <tr>
                  <td align="center" valign="top" style="padding: 36px 24px;">
                    <a href="https://www.blogdesire.com" target="_blank" style="display: inline-block;">
                      <img src="https://www.blogdesire.com/wp-content/uploads/2019/07/blogdesire-1.png" alt="Logo" border="0" width="48" style="display: block; width: 48px; max-width: 48px; min-width: 48px;">
                    </a>
                  </td>
                </tr>
              </table>
              <!--[if (gte mso 9)|(IE)]>
              </td>
              </tr>
              </table>
              <![endif]-->
            </td>
          </tr>
          <!-- end logo -->
      
          <!-- start hero -->
          <tr>
            <td align="center" bgcolor="#e9ecef">
              <!--[if (gte mso 9)|(IE)]>
              <table align="center" border="0" cellpadding="0" cellspacing="0" width="600">
              <tr>
              <td align="center" valign="top" width="600">
              <![endif]-->
              <table border="0" cellpadding="0" cellspacing="0" width="100%" style="max-width: 600px;">
                <tr>
                  <td align="left" bgcolor="#ffffff" style="padding: 36px 24px 0; font-family: 'Source Sans Pro', Helvetica, Arial, sans-serif; border-top: 3px solid #d4dadf;">
                    <h1 style="margin: 0; font-size: 32px; font-weight: 700; letter-spacing: -1px; line-height: 48px;">Confirm Your Email Address</h1>
                  </td>
                </tr>
              </table>
              <!--[if (gte mso 9)|(IE)]>
              </td>
              </tr>
              </table>
              <![endif]-->
            </td>
          </tr>
          <!-- end hero -->
      
          <!-- start copy block -->
          <tr>
            <td align="center" bgcolor="#e9ecef">
              <!--[if (gte mso 9)|(IE)]>
              <table align="center" border="0" cellpadding="0" cellspacing="0" width="600">
              <tr>
              <td align="center" valign="top" width="600">
              <![endif]-->
              <table border="0" cellpadding="0" cellspacing="0" width="100%" style="max-width: 600px;">
      
                <!-- start copy -->
                <tr>
                  <td align="left" bgcolor="#ffffff" style="padding: 24px; font-family: 'Source Sans Pro', Helvetica, Arial, sans-serif; font-size: 16px; line-height: 24px;">
                    <p style="margin: 0;">Tap the button below to confirm your email address</p>
                  </td>
                </tr>
                <!-- end copy -->
      
                <!-- start button -->
                <tr>
                  <td align="left" bgcolor="#ffffff">
                    <table border="0" cellpadding="0" cellspacing="0" width="100%">
                      <tr>
                        <td align="center" bgcolor="#ffffff" style="padding: 12px;">
                          <table border="0" cellpadding="0" cellspacing="0">
                            <tr>
                              <td align="center" bgcolor="#1a82e2" style="border-radius: 6px;">
                                <a target="_blank" style="display: inline-block; padding: 16px 36px; font-family: 'Source Sans Pro', Helvetica, Arial, sans-serif; font-size: 16px; color: #ffffff; text-decoration: none; border-radius: 6px;" href=${ShortUrl}>Activate Account</a>
                              </td>
                            </tr>
                          </table>
                        </td>
                      </tr>
                    </table>
                  </td>
                </tr>
                <!-- end button -->
      
                <!-- start copy -->
                <tr>
                  <td align="left" bgcolor="#ffffff" style="padding: 24px; font-family: 'Source Sans Pro', Helvetica, Arial, sans-serif; font-size: 16px; line-height: 24px;">
                    <p style="margin: 0;">If that doesn't work, <a target="_blank" href=${ShortUrl}>
                      Click here
      </a></p>
                    
                  </td>
                </tr>
                <!-- end copy -->
      
                <!-- start copy -->
                <tr>
                  <td align="left" bgcolor="#ffffff" style="padding: 24px; font-family: 'Source Sans Pro', Helvetica, Arial, sans-serif; font-size: 16px; line-height: 24px; border-bottom: 3px solid #d4dadf">
                    <p style="margin: 0;">Cheers,<br> </p>
                  </td>
                </tr>
                <!-- end copy -->
      
              </table>
              <!--[if (gte mso 9)|(IE)]>
              </td>
              </tr>
              </table>
              <![endif]-->
            </td>
          </tr>
          <!-- end copy block -->
      
          <!-- start footer -->
          <tr>
            <td align="center" bgcolor="#e9ecef" style="padding: 24px;">
              <!--[if (gte mso 9)|(IE)]>
              <table align="center" border="0" cellpadding="0" cellspacing="0" width="600">
              <tr>
              <td align="center" valign="top" width="600">
              <![endif]-->
              <table border="0" cellpadding="0" cellspacing="0" width="100%" style="max-width: 600px;">
      
                <!-- start permission -->
                <tr>
                  <td align="center" bgcolor="#e9ecef" style="padding: 12px 24px; font-family: 'Source Sans Pro', Helvetica, Arial, sans-serif; font-size: 14px; line-height: 20px; color: #666;">
                    <p style="margin: 0;">You received this email because we received a request for [type_of_action] for your account. If you didn't request [type_of_action] you can safely delete this email.</p>
                  </td>
                </tr>
                <!-- end permission -->
      
                <!-- start unsubscribe -->
                <tr>
                  <td align="center" bgcolor="#e9ecef" style="padding: 12px 24px; font-family: 'Source Sans Pro', Helvetica, Arial, sans-serif; font-size: 14px; line-height: 20px; color: #666;">
                    <p style="margin: 0;">To stop receiving these emails, you can <a href="https://www.blogdesire.com" target="_blank">unsubscribe</a> at any time.</p>
                    <p style="margin: 0;">Paste 1234 S. Broadway St. City, State 12345</p>
                  </td>
                </tr>
                <!-- end unsubscribe -->
      
              </table>
              <!--[if (gte mso 9)|(IE)]>
              </td>
              </tr>
              </table>
              <![endif]-->
            </td>
          </tr>
          <!-- end footer -->
      
        </table>
        <!-- end body -->
      
      </body>
      </html>`,
    };
  }
  return obj;
}

const sendVerificationEmail = async ({ _id, Email }, type, res) => {
  const currentUrl = "https://chess-tournament.onrender.com";
  const uniqueString = uuidv4() + _id;
  
  
  //console.log(uniqueString);

  if(type=="forgotPassword")
  {  
    const alreadySendCheck = await Userverification.findOne({ userId: _id });
    if (alreadySendCheck) {
      return res.status(402).json({
        message: "You have already sent a password reset email",
      });
    }else
    {
      res.json({
        status: "pending",
        message: "Password reset email sent. Check your inbox",
      });
    }
  }else
  {
    res.json({
      status: "pending",
      message: "verification email sent",
    });
  }
  console.log(type)
  const mailOptions = options(type, currentUrl, uniqueString, Email, _id);
  bcrypt.hash(uniqueString, 10, (err, hashedUniqueString) => {
    if (err) {
      res.json({
        status: "failed",
        message: "an error occurred while hashing email data !",
      });
    } else {
      const newVerification = new Userverification({
        userId: _id,
        uniqueString: hashedUniqueString,
        createdAt: Date.now(),
        expireAt: Date.now() + 21600000,
      });
      newVerification
        .save()
        .then(() => {
          transporter
            .sendMail(mailOptions)
            .then(() => {
            
            })
            .catch((err) => {
              console.log(err);
            });
        })
        .catch((err) => {
          console.log(err);
          res.json({
            status: "failed",
            message:
              "an error occurred while saving verification email   data !",
          });
        });
    }
  });
};

const register = async(req, res, next) => {
  

  User.findOne({ Name: req.body.username }).then((result) => {
    if (result) {
      res.status(403).json({
        message: "Username Already Exists!",
      });
    } else {
      bcrypt.hash(req.body.password, 10, function (err, hashedPass) {
        if (err) {
          res.status(404).json({
            error: err,
          });
        }
        let user = new User({
          Name: req.body.username,
          Password: hashedPass,
          Email: req.body.email,
        });
        user
          .save()
          .then((result) => {
            sendVerificationEmail(result, "EmailVerification", res);
            //res.status(200).json({message:"Account Created Successfully"})
          })
          .catch((err) => {
            res.status(403).json({
              message: err.message,
            });
          });
      });
    }
  });
};

const verify = (req, res, next) => {
  let { userId, uniqueString } = req.params;
  Userverification.find({ userId })
    .then((result) => {
      if (result.length) {
        const { expireAt } = result[0];
        const hashedUniqueString = result[0].uniqueString;
        console.log(hashedUniqueString);
        if (expireAt < Date.now()) {
          Userverification.deleteOne({ _id: userId })
            .then((result) => {
              User.deleteOne({ _id: userId })
                .then((result) => {
                  res.status(404).json({
                    message: "link has expired please sign up again",
                  });
                })
                .catch((err) => {
                  res.status(404).json({
                    error: err,
                  });
                });
              console.log("deleted verification successfully");
            })
            .catch((err) => {
              res.status(404).json({
                error: err,
              });
            });
        } else {
          bcrypt.compare(uniqueString, hashedUniqueString, (err, result) => {
            if (err) {
              res.status(404).json({
                message: err,
              });
            } else {
              if (result) {
                User.updateOne(
                  { _id: userId },
                  { verified: true },
                  { new: true }
                )
                  .then((result) => {
                    Userverification.deleteOne({ userId: userId })
                      .then((result) => {
                        res
                          .status(200)
                          .json({ message: "the email is verified" });
                      })
                      .catch((err) => {
                        console.log("error while deleting verification");
                        res
                          .status(403)
                          .json({
                            message: "error while deleting verification",
                          });
                      });
                  })
                  .catch((err) => {
                    console.log("couldn't update verified");
                    res
                      .status(403)
                      .json({ message: "couldn't update verified" });
                  });
              } else {
                console.log("incorrect verification");
                res.status(403).json({ message: "incorrect verification" });
              }
            }
          });
        }
      } else {
        console.log("couldnt find Userverification or already verified");
        res
          .status(404)
          .json({
            message: "couldn't find Userverification or already verified",
          });
      }
    })
    .catch((err) => {
      console.log(err);
      res.status(404).json({ message: err });
    });
};

const login = (req, res, next) => {

  User.findOne({ Name: req.body.username })
    .then((user) => {
      if (user) {
        if (!user.verified) {
          res.status(403).json({
            status: "failed",
            message: "Email is not verified",
          });
        } else {
          bcrypt.compare(
            req.body.password,
            user.Password,
            function (err, result) {
              if (err) {
                res.status(403).json({
                  error: err,
                });
              }
              if (result) {
                let token = jwt.sign(
                  { Id: user.id, Name: user.Name, Role: user.role },
                  process.env.SECRET_KEY,
                  {
                    expiresIn: "30h",
                  }
                );
                res.cookie("token", token);
                res.status(200).json({
                  message: "login successfully !",
                  token: token,
                  role: user.role,
                  tutorial: user.tutorial,
                });
              } else {
                res.status(403).json({
                  message: "Username or Password is incorrect",
                });
              }
            }
          );
        }
      } else {
        res.status(404).json({
          message: "Username or Password is incorrect",
        });
      }
    })
    .catch((err) => {
      res.status(500).json(err);
    });
};

const forgetPassword = (req, res, next) => {
  const userName = req.body.username;

  User.findOne({ Name: userName })
    .then((result) => {
      if (result) {
        sendVerificationEmail(result, "forgotPassword", res);
      } else {
        res.status(404).json({ message: "User isn't Exist!" });
      }
    })
    .catch((err) => {
      res.status(403).json({ message: "Error!" });
    });
};

const resetEmail = (req, res, next) => {
  let { userId, uniqueString } = req.params;
  //console.log(userId);
  Userverification.find({ userId: userId })
    .then((result) => {
      if (result.length) {
        const { expireAt } = result[0];
        const hashedUniqueString = result[0].uniqueString;
        console.log(result);

        if (expireAt < Date.now()) {
          Userverification.deleteOne({ _id: userId })
            .then((result) => {
              User.deleteOne({ _id: userId })
                .then((result) => {
                  res.status(404).json({
                    message: "link has expired",
                  });
                })
                .catch((err) => {
                  console.log(err);
                });
              //console.log("deleted verification successfully");
            })
            .catch((err) => {
              console.log(err);
            });
        } else {
          //console.log(uniqueString);
          //console.log(hashedUniqueString);
          bcrypt.compare(uniqueString, hashedUniqueString, (err, result) => {
            if (err) {
              res.status(404).json({
                error: err,
                message: "server error",
              });
            } else {
              if (result) {
                // Userverification.deleteOne({ userId: userId })
                //   .then((result) => {
                //   //  console.log("the email is verified");
                //   })
                //   .catch((err) => {
                //     //console.log("error while deleting verification");
                //   });
                
                  
                  res.status(200).json({user_id :hashedUniqueString
                  })
              
                
              } else {
                //console.log("incorrect verification");
              }
            }
          });
        }
      } else {
        console.log("couldnt find Userverification or already verified");
      }
    })
    .catch((err) => {
      console.log(err);
    });
};

const resetPassword = async(req, res, next) => {
  const userId = req.body.user_id;
  console.log(userId);
  
  const data = await Userverification.findOne({ uniqueString: userId });
  if (data) {
    await Userverification.deleteOne({ uniqueString: userId })
    const newPassword = req.body.password;
    console.log(data._id);
    bcrypt.hash(newPassword, 10, (err, hashedPass) => {
      if (err) {
        res.json({
          status: "failed",
          message: "an error occurred while hashing email data !",
        });
      } else {
        User.findOneAndUpdate(
          { _id: data.userId },
          { Password: hashedPass },
          { new: true }
        )
          .then((result) => {
            console.log(result);
            if (result)
              res.json({
                status: "success",
                message: "Password changed successfully",
              });
            else
              res.json({
                status: "failed",
                message: "error while reseting the password",
              });
          })
          .catch((err) => {
            console.log(err);
            //res.send("error while reseting the password");
          });
      }
    });
  } else {
    res.status(400).json({
      message: "error while reseting the password",
    });
  }
};

module.exports = {
  register,
  verify,
  login,
  resetEmail,
  resetPassword,
  forgetPassword,
};
