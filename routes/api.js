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

  router.post('/usuarios/inicioDeSesionParcial',function(req,res,next){
    var doc={"nombreUsuario":""};
    doc.nombreUsuario=req.body.nombreUsuario;
    usuarios.findOne(doc,
                    {"fields":{"_id":1,"sesion":1}} ,
                    function(err, doc){
      if(err){
        console.log(err);
        res.status(500).json({"error":"no se puede obtener documentos"});
      }else{
        res.status(200).json(doc);
      }
    });
  });

  router.post('/usuarios/inicioDeSesionTotal',function(req,res,next){
    var doc={"nombreUsuario":"", "contrasenia":""};
    doc.nombreUsuario=req.body.nombreUsuario;
    doc.contrasenia=req.body.contrasenia;
    usuarios.findOne(doc,
                    {"fields":{"_id":1,"sesion":1}} ,
                    function(err, doc){
      if(err){
        console.log(err);
        res.status(500).json({"error":"no se puede obtener documentos"});
      }else{
        res.status(200).json(doc);
      }
    });
  });

  return router;
}

module.exports = initApiRoute;
