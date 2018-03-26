var ordenController = function($scope, $http, $routeParams) {

	$scope.editando = false;
	

	$scope.cargarOrdenPorId = function(id) {
		$http({
			url: 'api/obtenerOrdenPorNo.php',
            method: 'POST',
            data: {id: id}
		}).then(function(resp) {
            $scope.oc = resp.data[0];
            $scope.oc.fecha_orden = new Date(parseInt($scope.oc.anio)*1000);
            $scope.oc.no_orden = parseInt($scope.oc.no_orden);
            $scope.selectedOCId = $scope.oc.no_orden;
		},function(err) {
			swal(err.data.msg, { icon: "error" } );			
		})
    }


	$scope.agregar = function () {
		//$scope.cat.anio_timestamp = $scope.cat.anio.getYear();

		var endpointUrl = "api/guardarOrden.php";
        $scope.oc.fecha_orden_timestamp = $scope.oc.fecha_orden.getTime()/1000;
		$http({
			headers: { 'Content-Transfer-Encoding': 'utf-8' },
			url: endpointUrl,
			method: 'POST',
			data: $scope.oc
		}).then(function ok(res) {
			swal(res.data.msg, { icon: "success" } );
			$scope.oc = {};
			
		}, function err(error) {
			swal(error.data.msg, { icon: "error" } );
		});
	}


	$scope.ensubmit = function() {
		if($scope.editando) {
			$scope.actualizar();
		}
		else {
			$scope.agregar();
		}
	}


	$scope.alta = function() {
		$scope.ocNuevo=true;
		$scope.selectedOCId = undefined;
		$scope.oc = {};
	} 
    

	$scope.cancelar = function($event) 
	{ 	
		if($event)
			$event.preventDefault();
		window.location.hash="#!/ordenes_compra";
		
		$scope.oc.id_prov = undefined;
		$scope.ocNuevo=false;
		$scope.editando = false;
	} 
	
	$scope.cargarProductosPorOrden = function(no_orden,fecha_orden) {
		$http({
			url: 'api/obtenerProductosPorNoOrden.php',
            method: 'POST',
            data: {no_orden: no_orden,
            	fecha_orden: fecha_orden}
		}).then(function(resp) {
			$scope.resultados = resp.data;
		},function(err) {
			swal(err.data.msg, { icon: "error" } );			
		})
	}
	$scope.eliminar = function($event,$index) {
		$event.preventDefault();
		swal({
			title: 'Seguro que quieres borrar la orden de compra?',
			text: 'Si al borrar la orden de compra toda su informacion se perderá',
			icon:'warning',
			buttons: ["Mmm... Mejor no!", true],}).then(
				function(result) {
					if(result) {
						$http({
							headers: { 'Content-Transfer-Encoding': 'utf-8' },
							url: 'api/eliminarOrden.php',
							method: 'POST',
							data: $scope.ordenlista[$index]						}).then(function ok(res) {
							swal("Registro eliminado!",
								"El registro de la orden de compra fue eliminada.",
								"success");
							$scope.cancelar();
						}, function err(error) {
							swal(error.data.msg, { icon: "error" } );
						});
					}
			});
			
	}

	$scope.cargarProveedores();
	if(!$routeParams || !$routeParams.id) {
		$scope.oc = {};
		
		$scope.ocNuevo = false;
	} else {
		$scope.ocNuevo = false;
		$scope.editando = true;
		$scope.cargarOrdenPorId($routeParams.id);
	}

	$scope.verProductosOrden = function($event, indice) {
		$event.preventDefault();
		var orden = $scope.ordenlista[indice];
		$scope.cargarProductosPorOrden(orden.no_orden, orden.fecha_orden);
	}	
}

empleadosController.$inject = ['$scope', '$http', '$routeParams'];
app.controller('ordenController', ordenController);
