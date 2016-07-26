$("#splash").on("pagecreate",function(e){
  $.get(
    "/api/usuarios/obtenerUsuarios",
    {},
    function(usuarios, scsTxt, xhrq){
      //aqui vamos renderizar los libros
      if(usuarios){
        var htmlBuffer = usuarios.map(function(usuario, i){
          return "<li><a href>" + usuario.nombreUsuario +"</a></li>";
        }); //end map
        $("#splash_listview").html(htmlBuffer.join("")).listview("refresh");

      }
    },
    'json'
  );
});

$("#inicioDeSesion").on('pagecreate', function(e){
  $("#inicioDeSesion-send").on('click',function(e){
    var formObject={};
    formObject.nombreUsuario= $("#txtNombreUsuario").val();
    formObject.contrasenia=$("#txtContrasenia").val();

    $.get(
      "/api/usuarios/inicioDeSesionParcial/:"+formObject.nombreUsuario,
      {},
      function(documento, scsTxt,xhrq){
        console.log(documento);
        if (documento) {
          alert("fdfdf");
        }
      },
      'json'
    );
  });
});

function changePage(to){
  $(":mobile-pagecontainer").pagecontainer("change","#"+to);
}
