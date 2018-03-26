var productosController = function($scope, $http, $routeParams) {
	$scope.modo_busqueda = true;
	$scope.modo_edicion = false;
	$scope.modo_agregacion = false;   
	$scope.busqueda = {cargando: false};
	$scope.buscarProductos = function() {
		$scope.busqueda.cargando = true;
		if($scope.busqueda.keyword != '')
			$http({
				url:'api/obtenerProductos.php',
				method:'GET',
				params:{keyword: $scope.busqueda.keyword}
			}).then(function(res){
				$scope.busqueda.cargando = false;
				$scope.busqueda.resultados = res.data;
			},function(err) {
				if(error != undefined && error.data  != undefined && error.data.msg  != undefined)
					swal(error.data.msg, { icon: "error" } );
				else
					$scope.commonError();
			});
	}
	$scope.setOrdenCompra = function(no_orden_compra) {
		$scope.prod.orden = $scope.ordenlista[no_orden_compra];
	}

	$scope.eliminar = function($event) {
		if($event)
			$event.preventDefault();
		swal({
			title: 'Seguro que quieres borrar el registro?',
			text: 'Si borrar el producto toda su informacion se perderá',
			icon:'warning',
			buttons: ["Mmm... Mejor no!", true],}).then(
				function(result) {
					if(result) {
						$http({
							headers: { 'Content-Transfer-Encoding': 'utf-8' },
							url: 'api/eliminarProductoPorCodigo.php',
							method: 'POST',
							data: {id:$scope.prod.codigo}
						}).then(function ok(res) {
							swal("Registro eliminado!",
								"El registro del empleado fue eliminado.",
								"success");
							$scope.prod = undefined;
							$scope.cancelar();
						}, function err(error) {
							swal(error.data.msg, { icon: "error" } );
						});
					}
			});
	}

	$scope.detalles = function(index) {
		$scope.cargarProveedores(function() {
			$scope.prod = $scope.busqueda.resultados[index];
			$scope.id_prov = $scope.prod.id_prov.toString();
			$scope.cargarOrdenPorIdProv($scope.id_prov);
			$scope.cargarCatalogoPorIdProv($scope.id_prov,function() {
				$scope.prod.no_catalogo = $scope.prod.no_catalogo.toString();
				$scope.cargarCatalogoAniosPorNoCat($scope.prod.no_catalogo);
				$scope.prod.anio = $scope.prod.anio.toString();
			});
		});

		
		$scope.modo_busqueda = false;
		$scope.modo_edicion = true;
		$scope.modo_agregacion = false;   
	}

	$scope.alta = function () {
		$http({
			url:'api/guardarProducto.php',
			method:'POST',
			data: $scope.prod
		}).then(function (res) {
			if(res && res.data  && res.data.msg){
				swal(res.data.msg, { icon: "success" } );
				$scope.prod = {};
			}
			else 
				$scope.commonError();
		},
		function (error) {
			if(error != undefined && error.data  != undefined && error.data.msg  != undefined)
				swal(error.data.msg, { icon: "error" } );
			else
				$scope.commonError();
		});
	}
	
	$scope.update = function () {
		$http({
			url:'api/actualizarProducto.php',
			method:'POST',
			data: $scope.prod
		}).then(function (res) {
			if(res && res.data  && res.data.msg){
				swal(res.data.msg, { icon: "success" } );
			}
			else 
				$scope.commonError();
		},
		function (error) {
			if(error != undefined && error.data  != undefined && error.data.msg  != undefined)
				swal(error.data.msg, { icon: "error" } );
			else
				$scope.commonError();
		});
	}

	$scope.onsumbit = function() {
		if($scope.modo_agregacion) {
			$scope.alta();
		} else if ($scope.modo_edicion) {
			$scope.update();
		}
	}
	$scope.setModoBusqueda = function() {
		$scope.modo_busqueda = true;
		$scope.modo_edicion = false;
		$scope.modo_agregacion = false;   	
	}	

	$scope.setModoEdicion = function() {
		$scope.modo_busqueda = false;
		$scope.modo_edicion = true;
		$scope.modo_agregacion = false;   	
	}	

	$scope.onkeywordchanged = function() {
		$scope.buscarProductos();
	}

	$scope.setModoAgregacion = function() {
		$scope.modo_busqueda = false;
		$scope.modo_edicion = false;
		$scope.modo_agregacion = true;   	
		
		$scope.cargarProveedores();
		//TODO: Descomentar la siguiente linea
		//$scope.prod = {};

		//TODO: Borrar la siguiente linea
		$scope.mockProducto();
	}	

	$scope.cancelar = function($event) {
		if($event)
			$event.preventDefault();
		$scope.buscarProductos();
		$scope.setModoBusqueda();
	}
	//TODO: Borrar esto despues del testing
	$scope.mockProducto = function () {
		$scope.id_prov = 2525225;
		$scope.prod = {
			codigo:Math.floor((Math.random()*1000) + 10000),
			marca:"Trupper (test)",
			nombre:"Desarmador trupper (test)",
			unidades_medicion:"n/a (test)",
			nombre_categoria:"Herramientas (test)",
			no_serie:Math.floor((Math.random()*1000000) + 1000000),
			descripcion:`Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo`,
			precio_venta: 35.4,
			no_caja:1,
			no_seccion:1,
			no_estante:1,
			no_repisa:1,
			existencia_bodega:20,
			existencia_caja:2,
			existencia_repisa:2,
			no_catalogo: 123,
			anio: 2010,
			limite_inferior:10,
			limite_superior:40
		}
	}
	$scope.mockResultadosBusqueda = function () {
		$scope.busqueda = {
			resultados: [{
				codigo:Math.floor((Math.random()*1000) + 10000),
				nombre:"Desarmador trupper (test)",
				descripcion:`Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo`,
				precio_venta: 35.4,
				no_catalogo:20230,
				anio:2017,
				no_caja:1,
				no_seccion:2,
				no_estante:3,
				no_repisa:2,
				existencia: 3,
			},
			{
				codigo:Math.floor((Math.random()*1000) + 10000),
				nombre:"Prueba trupper (test)",
				descripcion:`Consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo`,
				precio_venta:200,
				no_catalogo:21231,
				anio:2017,
				no_caja:2,
				no_seccion:1,
				no_estante:4,
				no_repisa:2,
				existencia: 3,
			}
			]
		}
	}

	$scope.mockResultadosBusqueda();
}

productosController.$inject = ['$scope', '$http', '$routeParams'];
app.controller('productosController', productosController);
