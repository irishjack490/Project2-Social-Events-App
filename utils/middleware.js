/////////////////////////
//Import dependencies////
/////////////////////////
const express = require('express'); //express framework 
const morgan = require('morgan');
const session = require('express-session');//express session package
const MongoStore = require('connect-mongo'); //connect-mongo for the session 
require('dotenv').config();
const methodOverride = require('method-override');// for forms and CRUD


//////////////////////////////
////middleware function///////
//////////////////////////////
const middleware = (app) => {   //middleware runs before all apps 
    app.use(methodOverride('_method'))
     //will allow to get data from the forms as req.body
    app.use(express.urlencoded({extended: true}));
    app.use(morgan('tiny'))
    app.use(express.static('public')) //line of code that allowes for css styles inside public folder to run
    app.use(express.json())


    app.use(
    session({
    secret: process.env.SECRET,
    store: MongoStore.create({
        mongoUrl: process.env.DATABASE_URL
    }),
    saveUninitialized: true,
    resave: false
        })
    )

}

  

module.exports = middleware; 