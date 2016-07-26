var express = require('express');
var router = express.Router();
var assign = require('object-assign');

/* GET home page. */
function initApiRoute(db){

  var usuarios = db.collection('usuarios');

  router.get('/usuarios/obtenerUsuarios', function(req,res,next){
    usuarios.find({}).toArray(function(err,docs){
      if (err) {
        console.log(err);
        res.status(500).json({"error":"Error al obtener documentos"});
      }
      else {
        res.status(200).json(docs);
      }
    });//end to arry
  });//final Obtener Usuarios

  router.get('/usuarios/inicioDeSesionParcial/:usuario', function(req,res,next){
    usuarios.findOne({"nombreUsuario":req.params.usuario}).toArray(function(err,docs){
        if (err) {
          console.log(err);
          res.status(500).json({"error":"Error al obtener documentos"});
        }
        else {
          res.status(200).json(docs);
        }
    });
  });

  return router;
}

module.exports = initApiRoute;
