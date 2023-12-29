
////////////////////////
////Import Dependencies////
///////////////////////
const express = require('express');
const cookieParser = require('cookie-parser');
const logger = ('morgan');
const path = require('path');
const createError = require ('http-errors');

////////////////////////
////Import Routers/////
///////////////////////
const indexRouter = ('./routes/index/');

/////////////////////////
//Create Express app + set up view enginge////
////////////////////////
const app = express();
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');



/////////////////////////
////Configure app.set///
///////////////////////


///////////////////////////
///////Middleware/////////
//////////////////////////


///////////////////////
///////routers////////
/////////////////////


app.get('/', function (req, res){
    res.send('<h1>Hello World</h1>')
});

app.listen(3000, function (){
    console.log('Listening on port 3000')
})