var express = require('express');
var router = express.Router();

/* GET home page. */
function initIndexRoute(db){

  router.get('/', function(req, res, next){
    res.render('mobile_index', {layout:'layout_mobile',title: 'Express'});
  });

  router.get('/desktop', function(req,res,next){
    res.render('index',{title:"Landing Page"});
  });

  return router;
}

module.exports = initIndexRoute;
