var proveedoresController = function($scope, $http) {
	
	$scope.prov = {};
	
	$scope.cargarEstados();

	$scope.provNuevo = false;
    
    $scope.mostrar = false; 

	$scope.mostrarDatePikerActalizarFecha = false;

	$("#buscarProvInput").autocomplete({
		source: function (request, response)
	    {
	        $.ajax(
	        {
	            url: 'api/obtenerNombresProveedores.php',
	            dataType: "json",
	            data:
	            {
	                keyword: $("#buscarProvInput").val(),
	            },
	            success: function (data)
	            {
	                var nombresArr = data.map( (obj) =>{ return {'label':obj.nombreCompleto,'id':obj.id_prov} });
	            	response(nombresArr);
	            }
	        });
	    },
	    select: function(evt, ui) {
	    	$scope.selectedUserId = ui.item.id;
	    	//Cargar el usuario con ese ID
	    	$http({
	    		url:'api/obtenerProveedorPorId.php',
	    		data: {id:ui.item.id},
	    		method: 'POST'
	    	}).then(function ok(resp) {
	    		//Convert timestamps to date
	    		//resp.data[0].f_nac = new Date(parseInt(resp.data[0].fecha_ultima_visita)*1000);
	    		$scope.cargarMunicipioPorCveEnt(resp.data[0].cve_ent);
	    		$scope.prov = resp.data[0];
	    	},function err(error) {
	    		swal(error.data.msg, { icon: "error" } );
	    	})
	    	
	    }
	});
    
$scope.agregar = function () {
		$scope.prov.id = $scope.selectedUserId;
		var endpointUrl = "api/guardarProveedor.php";
		if($scope.selectedUserId != undefined) {
            $scope.prov.id = $scope.prov.rfc;
			endpointUrl = "api/actualizarProveedor.php";
		}
		$http({
			headers: { 'Content-Transfer-Encoding': 'utf-8' },
			url: endpointUrl,
			method: 'POST',
			data: $scope.prov
		}).then(function ok(res) {
			swal(res.data.msg, { icon: "success" } );
			if($scope.selectedUserId == undefined) 
				$scope.prov = {};
			
		}, function err(error) {
			swal(error.data.msg, { icon: "error" } );
		});
	}

	$scope.alta = function() {
		$scope.provNuevo=true;
		$scope.selectedUserId = undefined;
		$scope.prov = {};
        $scope.mostrar=false; 
	}  
    
   $scope.actualizarUltimaVisita = function($event) {
		$event.preventDefault();
		if($scope.nuevaUltimaFecha === undefined) {
			swal("Por favor ingrese una nueva fecha",{icon:"error"});
			return;
		}
		swal({
			title: 'Seguro que quieres actualizar el registro de la ultima visita?',
			text: 'Se sobreescribira la fecha de ultima visita con ' + $scope.nuevaUltimaFecha.toLocaleDateString(),
			icon:'warning',
			buttons: ["Mmm... Mejor no!", true]}).then(
				function(result) {
					if(result) {
						$http({
							headers: { 'Content-Transfer-Encoding': 'utf-8' },
							url: 'api/agregarUltimaFechaProveedor.php',
							method: 'POST',
							data: {
								id:$scope.selectedUserId,
								nuevaFecha: $scope.nuevaUltimaFecha.getTime() / 1000
							}
						}).then(function ok(res) {
							swal("Registro actualizado!",
								"El registro del proveedor fue actualizado.",
								"success");
							mostrarDatePikerActalizarFecha = false;
							$scope.cancelar();
						}, function err(error) {
							swal(error.data.msg, { icon: "error" } );
						});
					}
			});
	} 

	$scope.cancelar = function($event) 
	{ 	
		if($event)
			$event.preventDefault();
		$scope.provNuevo=false;
        $scope.mostrar=false; 
		$scope.selectedUserId = undefined;
		$("#buscarProvInput").val("");
	} 

	$scope.eliminar = function($event) {
		$event.preventDefault();
		swal({
			title: 'Seguro que quieres borrar el registro?',
			text: 'Si borrar el proveedor toda su informacion se perderá',
			icon:'warning',
			buttons: ["Mmm... Mejor no!", true],}).then(
				function(result) {
					if(result) {
						$http({
							headers: { 'Content-Transfer-Encoding': 'utf-8' },
							url: 'api/eliminarProveedorPorId.php',
							method: 'POST',
							data: {id:$scope.selectedUserId}
						}).then(function ok(res) {
							swal("Registro eliminado!",
								"El registro del proveedor fue eliminado.",
								"success");
							$scope.cancelar();
						}, function err(error) {
							swal(error.data.msg, { icon: "error" } );
						});
					}
			});
			
	}
} 

 // Esta función abre una ventana con tu propio contenido
$scope.seleccionarFecha = function() {
      var newWindow = window.open('', '', 'width=250, height=120'); 
      newWindow.document.write('<p>Ingrese nueva fecha:</p>');    
      newWindow.document.write('<input type="date" id="fecha">');
      var rfc=document.getElementById("rfc_oculto").value;        
      var fecha=newWindow.document.getElementById("fecha").value;    
      newWindow.document.write('<button ng-click="addUltimaVisitaFecha(fecha,rfc);" class="col col-xs-10 col-xs-offset-1 btn">Actualizar</button>');      
    }

proveedoresController.$inject = ['$scope', '$http'];
app.controller('proveedoresController', proveedoresController);
