
var newbacklogBinded = false, uploadBtnBinded = false, btnloginBinded = false,
    uploadBtnBinded2 = false, btnRegisterBinded = false, btnDeleteBinded = false,nuevoProductoIngresado=false, usuarioAdministrador=false;
var selectedBacklogItemID = "", totalGlobal=0, carritoBtnBinded=false;
var content, content3, html, html3, picFile,html2, usuarioID="";
var carrito=[];

$(document).on("mobileinit", function(e){
    $.mobile.loader.prototype.options.text = "Please Wait";
    $.mobile.loader.prototype.options.textVisible = true;

    $.ajaxSetup({
        xhrFields:{
            withCredentials:true
        }
    });
});

$(document).ajaxError(function(e, xhr, set, err){
    if(xhr.status===403){
        change_page("carrito");
    }
});

$(document).on("pagebeforechange", function(e, data) {
    if (typeof data.toPage === "object") {
        var pageid = data.toPage.attr("id");
        switch (pageid) {
              case "inicioDeSesion":
                if (btnloginBinded === true) {
                    data.toPage[0] = $("#cerrarSesion")[0];
                    $.extend(data.options, {
                        transition: "flip"
                    });
                }
                break;
              case "agregarProductos":
              if (btnloginBinded === false){
                  data.toPage[0] = $("#inicioDeSesion")[0];
                  $.extend(data.options, {
                      transition: "flip"
                  });
                }else {
                  if (usuarioAdministrador===false) {
                    alert("Necesita ser administrador para acceder a esta pagina.");
                  //  data.toPage[0] = $("#home")[0];
                    $.extend(data.options, {
                        transition: "flip"
                    });
                  }
                }
                break;
          case "picUpload":
            case "backlogdetail":
                if (selectedBacklogItemID === "") {
                    data.toPage[0] = $("#backlog")[0];
                    $.extend(data.options, {
                        transition: "flip"
                    });
                }
                break;
                case "detalleProducto":
                    if (selectedBacklogItemID === "") {
                        data.toPage[0] = $("#backlog")[0];
                        $.extend(data.options, {
                            transition: "flip"
                        });
                    }
                    break;
                case "backlog":
                if (btnloginBinded === false){
                    data.toPage[0] = $("#inicioDeSesion")[0];
                    $.extend(data.options, {
                        transition: "flip"
                    });
                  }else {
                    if (usuarioAdministrador===false) {
                      alert("Necesita ser administrador para acceder a esta pagina.");
                      data.toPage[0] = $("#home")[0];
                      $.extend(data.options, {
                          transition: "flip"
                      });
                    }
                  }
                  break;
                case "carrito":
                  if (btnloginBinded === false){
                      data.toPage[0] = $("#inicioDeSesion")[0];
                      $.extend(data.options, {
                          transition: "flip"
                      });
                    }
                  break;
                case "misOrdenes":
                  if (btnloginBinded === false){
                      data.toPage[0] = $("#inicioDeSesion")[0];
                      $.extend(data.options, {
                          transition: "flip"
                      });
                    }
                  break;
        }
    }
});

$(document).on("pagecontainerbeforeshow", function(e, ui) {
    var pageid = ui.toPage.attr("id");
    switch (pageid) {
        case "backlog":
          //....
          load_backlog_data(ui.toPage);
          break;
        case "carrito":
        if (!newbacklogBinded) {
            newbacklogBinded = true;
            load_backlog_dataCarrito(ui.toPage);
            $("#btnComprar").on("click", btnComprar_onClicked);
        }else {
            load_backlog_dataCarrito(ui.toPage);
        }
          break;
        case "backlogdetail":
            if (selectedBacklogItemID !== "") {
                load_backlogitem_data(ui.toPage);
            }
            break;
            case "detalleProducto":
                if (selectedBacklogItemID !== "") {
                    load_backlogitem_dataProducto(ui.toPage);
                }
                break;
        case "home":
            load_backlog_dataHome(ui.toPage);
            break;

        case "inicioDeSesion":
            //....
            if(!btnloginBinded){
                $("#inicioDeSesion-send").on("click", btnIniciarSesion);
            }
            break;

        case "cerrarSesion":
            if (btnloginBinded) {
              $("#cerrarDeSesion-send").on("click", btnCerrarSesion);
            }
          break;

        case "agregarProductos":
            $("#agregarPoducto-send").on("click", btnAgregarProducto);

          break;

        case "conocenos":
          cargarConocenos(ui.toPage);
          break;

        case "agregarUsuarios":
          $("#agregarUsuario-send").on("click", btnAgregarUsuario)
          break;

          case "picUpload":
          if (!uploadBtnBinded){
            uploadBtnBinded = true;
            $("#userpic").on("change", userpic_onchange);
            $("#agregarFoto-send").on("click", btnUpload_onClicked);
          }
        break;
        case "misOrdenes":
          load_backlog_dataOrdenes(ui.toPage);
          break;
    }
});

function changePage(to){
  $(":mobile-pagecontainer").pagecontainer("change","#"+to);
}


function load_backlogitem_data(backlogitem_page) {
    showLoading();
    $.get(
        "/api/productos/obtenerUnProducto/" + selectedBacklogItemID, {},
        function(doc, status, xhr) {
            if(!content){
                content = $(backlogitem_page).find(".ui-content");
                html = content.html();
            }

            var htmlObj = $(html);
            for (var i in doc) {
                htmlObj.find("#d_" + i).html(doc[i]);
            }
            if(doc.fotos){
                for (var k = 0; k< doc.fotos.length ; k ++){
                    htmlObj.append('<div><img src="'+doc.fotos[k]+'" /></div>');
                }
            }
            content.html(htmlObj).find("#btnDelete").on("click", btnDelete_onclick);
            hideLoading();
        },
        "json"
    ).fail(
        function(xhr, status, doc) {
            hideLoading();
            changePage("backlog");
        }
    );
}

function btnComprar_onClicked(e){
  e.preventDefault();
  e.stopPropagation();
  console.log(carrito);
  var formObject2 ={
    "total":$("#txtTotal").val(),
    "usuarioID":usuarioID,
    "productos":carrito
  };
  console.log(formObject2);
  $.ajax({
  type: 'POST',
  data: JSON.stringify(formObject2),
  contentType: 'application/json',
  url: '/api/usuarios/ingresarOrden',
  dataType: 'json',
  processData: false,
  cache: false,
  success: function(data, success, xhr) {
      hideLoading();
      changePage("misOrdenes");
  },
  error: function(xhr, fail, data) {
      hideLoading();
      alert("Error");
  }

});
}

function load_backlogitem_dataProducto(backlogitem_page) {
    showLoading();
    $.get(
        "/api/productos/obtenerUnProducto/" + selectedBacklogItemID, {},
        function(doc, status, xhr) {
            if(!content){
                content = $(backlogitem_page).find(".ui-content");
                content2 = $(backlogitem_page).find(".ui-content2");
                html = content.html();
                html2 =content2.html();

            }

            var htmlObj2=$(html2);
            var htmlObj = $(html);
            for (var i in doc) {
                htmlObj.find("#d_" + i).html(doc[i]);
            }

          //  htmlObj.append('<div class="valHld"><input type="range" name="slider-fill" class="valHld" id="d_stock" value="1" min="1" max="'+doc.stock+'" step="1" data-highlight="true"></div>');

            if(doc.fotos){
                for (var k = 0; k< doc.fotos.length ; k ++){
                    htmlObj.append('<div><img src="'+doc.fotos[k]+'" /></div>');
                }
            }
        //    content2.html(htmlObj2).find("#txtStock");

            content.html(htmlObj).find("#btnAgregarAlCarro").on("click", btnCarrito);
            hideLoading();
        },
        "json"
    ).fail(
        function(xhr, status, doc) {
            hideLoading();
            changePage("home");
        }
    );
}

function load_backlog_data(backlog_page) {
    showLoading();
    $.get(
        "/api/productos/obtenerProductos", {},
        function(docs, success, xhr) {

            if (docs) {
                var htmlstr = '<ul>';
                for (var i = 0; i < docs.length; i++) {
                    var backlogitem = docs[i];
                    htmlstr += '<li><a href="#backlogdetail" data-id="' + backlogitem._id + '">' + backlogitem.nombre +"  "+ backlogitem.precioVenta+'</a></li>';
                }
                htmlstr += '</ul>';
                $(backlog_page)
                    .find("#backlog_container")
                    .html(htmlstr)
                    .find("ul")
                    .listview()
                    .find("a")
                    .click(function(e) {
                        selectedBacklogItemID = $(this).data("id");
                    });
            }
            hideLoading();
        },
        "json"
    );
}

function load_backlog_dataHome(backlog_page) {

    showLoading();
    $.get(
        "/api/productos/obtenerProductos", {},
        function(docs, success, xhr) {

            if (docs) {
                var htmlstr = '<ul>';
                for (var i = 0; i < docs.length; i++) {
                    var backlogitem = docs[i];
                    foto =backlogitem.fotos[0];
                    htmlstr += '<li><a href="#detalleProducto" data-id="' + backlogitem._id + '">' + backlogitem.nombre+"</br> Precio:"+backlogitem.precioVenta+"</br> Unidades Disponibles:"+backlogitem.stock +"</br><img src='"+foto+"'/>"+'</a></li>';
                }
                htmlstr += '</ul>';
                $(backlog_page)
                    .find("#backlog_containerHome")
                    .html(htmlstr)
                    .find("ul")
                    .listview()
                    .find("a")
                    .click(function(e) {
                        selectedBacklogItemID = $(this).data("id");
                    });
            }
            hideLoading();
        },
        "json"
    );
}

function load_backlog_dataOrdenes(backlog_page) {
    showLoading();
    var formObject={
      "usuarioID":usuarioID
    }
    $.get(
        "/api/usuarios/obtenerOrdenes/"+usuarioID, {},
        function(docs, success, xhr) {
            if (docs) {
                var htmlstr = '<ul>';
                for (var i = 0; i < docs.ordenes.length; i++) {
                    var backlogitem = docs.ordenes[i];
                    htmlstr+='<li><a>Total Orden: '+backlogitem.total+'';
                    for (var x = 0; x < docs.ordenes[i].productos.length; x++){
                    htmlstr += '</br>Producto: "'+docs.ordenes[i].productos[x].nombre+'" </br> Cantidad:"'+docs.ordenes[i].productos[x].Cantidad +'"</br><img src="'+docs.ordenes[i].productos[x].fotos+'"/>';
                    }
                    htmlstr+='</br></a></li>';
                }
                htmlstr += '</ul>';
                $(backlog_page)
                    .find("#backlog_containerOrdenes")
                    .html(htmlstr)
                    .find("ul")
                    .listview()
                    .find("a")
                    .click(function(e) {

                    });
            }
            hideLoading();
        },
        "json"
    );
}

function load_backlog_dataCarrito(backlog_page) {
    showLoading();
      var total=0;
            if (carrito.length!=0) {
            //  content.html(htmlObj).find("#btnComprar").on("click", btnComprar_onClicked);
                var htmlstr = '<ul>';
                for (var i = 0; i < carrito.length; i++) {
                    var backlogitem = carrito[i];
                    total+=backlogitem.subTotalProducto;
                    foto =backlogitem.fotos;
                    htmlstr += '<li><a href="#detalleProducto" data-id="' + backlogitem._id + '">' + backlogitem.nombre+"</br> Precio:"+backlogitem.precioVenta+"</br> Lleva:"+backlogitem.cantidad +" Productos</br>Sub total del Producto: "+backlogitem.subTotalProducto+ "</br><img src='"+foto+"'/>"+'</a></li>';
                }
                htmlstr += '</ul>';
                htmlstr += '</br><div class="label">Total: </div><div><input type="number" name="txtTotal" pattern="[0-9]*" id="txtTotal" value="'+total+'"></div>';
                $(backlog_page)
                    .find("#backlog_containerCarrito")
                    .html(htmlstr)
                    .find("ul")
                    .listview()
                    .find("a")
                    .click(function(e) {
                        selectedBacklogItemID = $(this).data("id");
                    });
            }
            hideLoading();
}

function btnAgregarUsuario(e){
  e.preventDefault();
  e.stopPropagation();
  var formObject={};

  formObject.correoElectronico= $("#txtCorreoElectronico").val();
  formObject.nombre= $("#txtNombre").val();
  formObject.apellido= $("#txtApellido").val();
  formObject.contrasenia=$("#txtPassword").val();
  formObject.confirmacionContrasenia=$("#txtConfirmacionContrasenia").val();

  if (formObject.correoElectronico.length===0 || formObject.nombre.length===0 || formObject.apellido.length===0 ||formObject.contrasenia.length===0 ||formObject.confirmacionContrasenia.length===0) {
    alert("Ningun campo puede estart vacio");
  }else {
    if (formObject.contrasenia===formObject.confirmacionContrasenia) {
      $.post(
        '/api/usuarios/ingresarUsuarios',
        formObject,
        function(doc, scsTxt, xhrq){
          if(doc){
            changePage("home");
            alert("Te has registrado exitosamente.");
          }else {
            alert("Error al registrarte.");
          }
        },
        'json'
      );
    }else {
      alert("Las contrasenias no coinciden.");
    }
  }

}

function cargarPic(backlog_page){
  showLoading();
}

function cargarConocenos(backlog_page){
  showLoading();
}

function cargarHome(backlog_page) {
    showLoading();
    console.log(carrito);
}

function btnIniciarSesion(e){
  e.preventDefault();
  e.stopPropagation();
  var formObject={};
  formObject.correoElectronico= $("#txtCorreo").val();
  formObject.contrasenia=$("#txtContrasenia").val();
  $.post(
    '/api/usuarios/inicioDeSesionParcial',
    formObject,
    function(usuarios, scsTxt, xhrq){
      if(usuarios){
        $.post(
          '/api/usuarios/inicioDeSesionTotal',
          formObject,
          function(usuarios, scsTxt, xhrq){
            if (usuarios) {
              btnloginBinded=true;
              usuarioID=usuarios._id;
              if (usuarios.usuarioRol==="admin") {
                usuarioAdministrador=true;
              }
              carrito=[];
              changePage("home");
            }else {
              alert("Usuario o contrasenia invalidos.");
            }
          }
        )
      }
    },
    'json'
  );
}

function btnCerrarSesion(e){
  e.preventDefault();
  e.stopPropagation();
  btnloginBinded = false;
  usuarioAdministrador=false;
  changePage("home");
}

function btnAgregarProducto(e){
  e.preventDefault();
  e.stopPropagation();

  var formObject={};
  formObject.nombreProducto= $("#txtNombreProducto").val();
  formObject.precioCompra=$("#txtPrecioCompra").val();
  formObject.precioVenta=$("#txtPrecioVenta").val();
  formObject.stock=$("#txtStock").val();
  formObject.impuestoMedico=$("#txtImpuestoMedico").val();

  $.post(
    '/api/productos/ingresarProducto',
    formObject,
    function(docs, scsTxt, xhrq){
      if(docs){
        alert("Producto ingresado correctamente");
        changePage("home");
      }else {
        alert("Producto no se pudo insertar");
      }
    },
    'json'
  );
}

function userpic_onchange(e) {
  picFile = e.target.files;
  var htmlstr = "";
  htmlstr += "<span><b>Size:</b> ~" + Math.ceil(picFile[0].size / 1024) + "kb </span><br/>";
  htmlstr += "<span><b>Type:</b> " + picFile[0].type + " </span><br/>";
  $("#picMsg").html(htmlstr);
}

function btnUpload_onClicked(e) {
  e.preventDefault();
  e.stopPropagation();
  if (picFile) {
      var formBody = new FormData();
      $.each(picFile, function(llave, valor) {
          formBody.append("userpic", valor);
      });
      formBody.append("backlogid", selectedBacklogItemID);
      showLoading();
      $.ajax({
          url: "api/upload",
          type: "POST",
          data: formBody,
          cache: false,
          dataType: 'json',
          processData: false,
          contentType: false,
          success: function(data, success, xhr) {
              $("#frm_agregarFoto").get()[0].reset();
              hideLoading();
              change_page("backlogdetail");
          },
          error: function(xhr, fail, data) {
              hideLoading();
              alert("Error while uploading evidence file. Try again latter!");
          }
      });
  } else {
      alert("Must select an evidence file!");
  }
}

function btnCarrito(e){
    e.preventDefault();
    e.stopPropagation();
    showLoading();
    var formObject ={};
    formObject.cantidad=$("#txtCantidad").val();
    $.get(
          "/api/productos/obtenerUnProducto/" + selectedBacklogItemID, {},
        function(docs, success, xhr){
            if (docs) {
              formObject._id=docs._id;
              formObject.nombre=docs.nombre;
              formObject.stock=docs.stock;
              formObject.precioVenta=docs.precioVenta;
              formObject.fotos=docs.fotos[0];
              formObject.subTotalProducto=formObject.cantidad*formObject.precioVenta;
              console.log(formObject.stock);
              console.log(formObject.cantidad);
                carrito.push(formObject);
                changePage("carrito");
            }else {
              alert("error");
            }
            hideLoading();
        },
        "json"
    );
}


function showLoading(){
    $.mobile.loading( 'show');
}
function hideLoading(){
    $.mobile.loading( 'hide');
}
