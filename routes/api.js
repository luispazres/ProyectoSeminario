var express = require('express');
var path = require('path');
var router = express.Router();
var ObjectID = require('mongodb').ObjectID;
var md5 = require('md5');
var multer = require('multer');
var regexpt = /^((image)|(video))\/\w*$/i;
var fs = require('fs');
var validator = require('validator');
var upload = multer({dest:"public/images/",
                     limits:{
                         fileSize: (1024 * 1024 * 10)
                     },
                     fileFilter: function(req, file, cb){
                         if(regexpt.test(file.mimetype)){
                             cb(null, true);
                         }else{
                             cb(null, false);
                         }
                     }
                 });
var assign = require('object-assign');
var crypto = require('crypto');


/* GET home page. */
function initApiRoute(db){

  var usuarios = db.collection('usuarios');
  var productos=db.collection('productos');

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

  router.get('/productos/obtenerProductos', function(req,res,next){
    productos.find({}).toArray(function(err,docs){
      if (err) {
        console.log(err);
        res.status(500).json({"error":"Error al obtener documentos"});
      }
      else {
        res.status(200).json(docs);
      }
    });//end to arry
  });//final Obtener Usuarios

  router.get("/productos/obtenerUnProducto/:backlogId", function(req,res){
      var query = {_id: new ObjectID(req.params.backlogId)};
      productos.findOne(query,function(err, doc){
          if(err){
              res.status(500).json({"error":"Error al extraer el Backlog"});
          }else{
              res.status(200).json(doc);
          }
      });
  });

  router.post('/usuarios/inicioDeSesionParcial',function(req,res,next){
    var doc={"correoElectronico":""};
    doc.correoElectronico=req.body.correoElectronico;
    usuarios.findOne(doc,
                    {"fields":{"_id":1}} ,
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
    var doc={
      "correoElectronico":"",
      "contrasenia":""
    };
    doc.correoElectronico=req.body.correoElectronico;
    doc.contrasenia=crypto.createHash('md5').update(req.body.contrasenia+"por eso le suplicamos a Dios que nos libre de Dios, y que concibamos la verdad y gocemos eternamente de ella.").digest("hex");
    usuarios.findOne(doc,
                    {"fields":{"_id":1,"usuarioRol":1}} ,
                    function(err, doc){
      if(err){
        console.log(err);
        res.status(500).json({"error":"no se puede obtener documentos"});
      }else{
        res.status(200).json(doc);
      }
    });
  });

  router.post('/usuarios/validarUsuarios',function(req,res,next){
      if(validator.isNull(req.body.nombre)){
        console.log(validator.isNull(req.body.nombre));
        res.status(500);
      }else{
        res.status(200);
      }

  });

  router.post('/productos/ingresarProducto', function(req, res, next){
          var doc = {"nombre":"",
           "precioCompra":"",
           "precioVenta":"",
           "stock" :"",
           "impuestoMedico":"",
           "fotos":[]
         };

         doc.nombre=req.body.nombreProducto;
         doc.precioCompra=req.body.precioCompra;
         doc.precioVenta=req.body.precioVenta;
         doc.stock=req.body.stock;
         doc.impuestoMedico=req.body.impuestoMedico;

          productos.insertOne(doc,function(err, result){
            if(err){
              console.log(err);
              res.status(500).json({"error": "Ocurrio un error al agregar los datos"});
            }else{
              console.log(doc);
              res.status(200).json(doc);
            }
          });
      });//end CREATEPRODUCTS

      router.post('/usuarios/ingresarUsuarios', function(req, res, next){
              var doc = {
               "nombre":"",
               "apellido":"",
               "correoElectronico":"",
               "contrasenia":"",
               "ordenes":[],
               "usuarioRol":"admin"
             };

             doc.nombre = req.body.nombre;
             doc.apellido=req.body.apellido;
             doc.correoElectronico = req.body.correoElectronico;
             doc.contrasenia = crypto.createHash('md5').update(req.body.contrasenia+"por eso le suplicamos a Dios que nos libre de Dios, y que concibamos la verdad y gocemos eternamente de ella.").digest("hex");


             usuarios.insertOne(doc,function(err, result){
               if(err){
                 console.log(err);
                 res.status(500).json({"error": "Ocurrio un error al agregar los datos"});
               }else{
                 res.status(200).json({"Inserted": "ok"});
               }
             });
           }); //end

//ObjectId("579ea540c9db483448d99b9a")
router.post("/upload",
                upload.single('userpic'),
                function(req,res){
                        if(req.file){
                            var query = {_id: new ObjectID(req.body.backlogid)};
                            productos.updateOne(
                                query,
                                {"$push":{"fotos":("images/" + req.file.filename)}},
                                {w:1},
                                function(err,result){
                                    if(err){
                                        res.status(500).json({"error":err});
                                    }else{
                                        res.status(200).json({"path":("images/"+req.file.filename)});
                                    }
                                }
                            );
                        }else{
                            res.status(500).json({"error":"Filesize or Type Error"});
                        }
                });

  return router;
}

module.exports = initApiRoute;
