const { render } = require('ejs');
const routes = require('routes');

router.get(function (req, res, next){
    res.render('/', 'index');
})