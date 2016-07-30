var newbacklogBinded = false, uploadBtnBinded = false, btnloginBinded = false,
    btnRegisterBinded = false, btnDeleteBinded = false, nuevoProductoIngresado=false;
var selectedBacklogItemID = "";
var content, html, picFile;

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
        change_page("inicioDeSesion");
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
        }
    }
});


$(document).on("pagecontainerbeforeshow", function(e, ui) {
    var pageid = ui.toPage.attr("id");
    switch (pageid) {
        case "home":
            //....
            cargarHome(ui.toPage);
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

    }
});

function changePage(to){
  $(":mobile-pagecontainer").pagecontainer("change","#"+to);
}

function cargarHome(backlog_page) {
    showLoading();
    console.log(btnloginBinded);
    $.get(
      "/api/usuarios/obtenerUsuarios",
      {},
      function(usuarios, scsTxt, xhrq){
        if(usuarios){
          var htmlBuffer = usuarios.map(function(usuario, i){
            return "<li><a href> Nombre de usuario:" + usuario.nombreUsuario +", Contrasenia: "+usuario.contrasenia+"</a></li>";
          });
          $("#splash_listview").html(htmlBuffer.join("")).listview("refresh");
        }
      },
      'json'
    );
}

function btnIniciarSesion(e){
  e.preventDefault();
  e.stopPropagation();
  console.log(btnloginBinded);
  var formObject={};
  formObject.nombreUsuario= $("#txtNombreUsuario").val();
  formObject.contrasenia=$("#txtContrasenia").val();
  $.post(
    '/api/usuarios/inicioDeSesionParcial',
    formObject,
    function(usuarios, scsTxt, xhrq){
      if(usuarios){
        $.post(
          '/api/usuarios/inicioDeSesionTotal',
          formObject,
          function(usuarios,scsTxt,xhrq){
            if (usuarios) {
              btnloginBinded = true;
              alert("Ha iniciado sesion exitosamente.");
              changePage("home");
            }else {
              alert("Usuario o contrasenia invalidos.");
            }
          }
        )
      }else {
        alert("Usuario o contrasenia invalidos.");
      }
    },
    'json'
  );
}

function btnCerrarSesion(e){
  e.preventDefault();
  e.stopPropagation();
  btnloginBinded = false;
  console.log(btnloginBinded);
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
        alert("Usuario o contrasenia invalidos.");
      }
    },
    'json'
  );
}

function showLoading(){
    $.mobile.loading( 'show');
}
function hideLoading(){
    $.mobile.loading( 'hide');
}
