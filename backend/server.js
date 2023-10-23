const express = require("express");
const app = express();
require("dotenv").config();
const ip = "localhost";
const Port = process.env.PORT || 3000 ;
const cookieParser = require("cookie-parser");
const mongoose = require("mongoose");
const session = require('express-session')
const helmet = require('helmet')
const path = require('path');
const cors = require('cors')
const bodyParser = require('body-parser')
const rateLimit = require('express-rate-limit')


const { notFound, errorHandler } = require("./middleware/errorMiddleware");
const HomeRoutes = require('./routes/public/Home')
const UserRoutes = require('./routes/private/User')
const AdminRoutes = require('./routes/private/Admin')
//const User = require('./models/UserSchema')

//app.use(express.static("public"));
const corsOptions = {
  origin: [
    'https://chess-tournament.onrender.com',
    'https://lichess.org',
    'http://localhost:3001',
    '*'
    
    
    

    // your origins here
  ],
  credentials: true,
  exposedHeaders: ['set-cookie'],
};

const limiter = rateLimit({
	windowMs: 15 * 60 * 1000, // 15 minutes
	max: 100, // Limit each IP to 100 requests per `window` (here, per 15 minutes)
	standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
	legacyHeaders: false, // Disable the `X-RateLimit-*` headers
  message : {message: "Too much request"},
  keyGenerator: (req) => {
    // Use the first IP address from X-Forwarded-For header
    return req.headers['x-forwarded-for']?.split(',')[0] || req.ip;
  },
  
	// store: ... , // Use an external store for more precise rate limiting
})

// Apply the rate limiting middleware to all requests
app.use(limiter)

app.use(express.json()) //can remove
app.use(express.urlencoded({ 
  extended: true,
  limit: '10mb' // Set your preferred limit here
}));
app.use(cookieParser());
app.use(helmet())
// app.use(helmet({
//   contentSecurityPolicy: {
//     directives: {
//       defaultSrc: ["'self'"],
//       connectSrc: ["'self'", 'https://lichess.org/', 'https://chess-tournament.onrender.com/' , 'http://localhost:3001','*' ]
//     }
//   }
// }));

// app.use(cors(corsOptions))
app.use(bodyParser.json())
app.use(session({
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: false,
}));


// app.get("/" , (req,res) => {
//   res.send("hello world")
// }
// )

app.use("/api",HomeRoutes)
app.use("/api" , UserRoutes )
app.use("/api/Admin" , AdminRoutes)

// app.use(express.static(path.join(__dirname , '../client/build')))
// app.get("*" , function (req,res) {
//   res.sendFile(path.join(__dirname, '../client/build/index.html'))
  
// }
// )


app.use(notFound);
app.use(errorHandler);


mongoose
  .connect(process.env.DB_CONN, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then((result) => {
    app.listen(Port, () => {
      console.log(`App listening at http://${ip}:${Port}`);
      console.log("Database Connected : " , result.connection.host,result.connection.name)
        let val = "Amr006" ;
    });
  })
  .catch((err) => {
    console.log(err);
  });


//last to catch any wrong url ( needs cool 404 page :) ) 
