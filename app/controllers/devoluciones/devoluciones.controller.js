var devolucionesController = function($scope, $http) {
	
	$scope.dev = {};
	
	$scope.cargarEstados();

	$scope.devNueva = false;
    $scope.devSelect = false;
    $scope.preview = false;

	$scope.puestos = [
		"ADMINISTRADOR",
		"VENDEDOR",
		"ALMACENISTA"
	];
	
	$("#buscarDevInput").autocomplete({
		source: function (request, response)
	    {
	        $.ajax(
	        {
	            url: 'api/obtenerNumeroDevoluciones.php',
	            dataType: "json",
	            data:
	            {
	                keyword: $("#buscarDevInput").val(),
	            },
	            success: function (data)
	            {
	                var nombresArr = data.map( (obj) =>{ return {'label':obj.numeroDev,'id':obj.id_empleado, 'alldata':obj } });
	            	response(nombresArr);
	            }
	        });
	    },
	    select: function(evt, ui) {
	    	console.log(ui.item.alldata);
	    	$scope.selectedUserId = ui.item.id;
	    	/*$scope.dev = ui.item;
	    	$scope.preview = true;
	    	$scope.$apply();*/
	    	$http({
	    		url:'api/obtenerDevolucionesPorId.php',
	    		method:'post',
	    		data: ui.item.alldata
	    	}).then(function (resp) {
	    		console.log(resp.data);
	    		$scope.dev = resp.data;
	    		$scope.preview = true;
	    		// body...
	    	}, function (err) {
	    		// body...
	    	});
	    	
	    }
	});
	$scope.cerrar = function ($event) {
		$event.preventDefault();
		$scope.preview = false;
	}
    
    $("#buscarVenta").autocomplete({
		source: function (request, response)
	    {
	        $.ajax(
	        {
	            url: 'api/obtenerVentasParaDevolucion.php',
	            dataType: "json",
	            data:
	            {
	                keyword: $("#buscarVenta").val(),
	            },
	            success: function (data)
	            {
	                var nombresArr = data.map( (obj) =>{ return {'label':obj.numeroVenta,'id':obj.id_empleado} });
	            	response(nombresArr);
	            }
	        });
	    },
	    select: function(evt, ui) {
	    	$scope.selectedUserId = ui.item.id;
	    	//Cargar el usuario con ese ID
	    	$scope.no_venta = ui.item.label;
	    	$http({
	    		url:'api/obtenerProductosParaDevolucion.php',
	    		data: {id:ui.item.label},
	    		method: 'POST'
	    	}).then(function ok(resp) {
	    		//Convert timestamps to date
	    		$scope.dev = resp.data;
	    	},function err(error) {
	    		swal(error.data.msg, { icon: "error" } );
	    	})
	    	
	    }
	});

	$scope.agregar = function () {
		console.log($scope.dev);
		$http({
			url: "api/guardarDevolucion.php",
			method: "POST",
			data: {
				resp: $scope.dev,
				no_venta: $scope.no_venta
			}
		}).then(function (res) {
			swal(res.data.msg,{icon: "success"});
			$scope.cancelar();
		},function(err) {
			swal(err.data.msg,{icon:"error"});
		});
	}


	$scope.alta = function() {
		$scope.devNueva=true;
		//$scope.selectedUserId = undefined;
		$scope.dev = {};
	} 
    
    $scope.buscar=function(){
        $scope.devSelect=true;
        $scope.dev={};
    }
    

	$scope.cancelar = function($event) 
	{ 	
		if($event)
			$event.preventDefault();
		$scope.devNueva=false;
		$scope.selectedUserId = undefined;
		$("#buscarDevInput").val("");
	} 

	$scope.eliminar = function($event) {
		$event.preventDefault();
		swal({
			title: 'Seguro que quieres borrar el registro?',
			text: 'Si borrar el empleado toda su informacion se perderá',
			icon:'warning',
			buttons: ["Mmm... Mejor no!", true],}).then(
				function(result) {
					if(result) {
						$http({
							headers: { 'Content-Transfer-Encoding': 'utf-8' },
							url: 'api/eliminarEmpleadoPorId.php',
							method: 'POST',
							data: {id:$scope.selectedUserId}
						}).then(function ok(res) {
							swal("Registro eliminado!",
								"El registro del empleado fue eliminado.",
								"success");
							$scope.cancelar();
						}, function err(error) {
							swal(error.data.msg, { icon: "error" } );
						});
					}
			});
			
	}
}

devolucionesController.$inject = ['$scope', '$http'];
app.controller('devolucionesController', devolucionesController);
