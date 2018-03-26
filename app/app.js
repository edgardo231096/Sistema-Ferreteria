var app = angular.module('app', ['ngRoute']);

app.config(function($routeProvider,$locationProvider) {
    console.log($locationProvider);
    $routeProvider
    .when('/empleados', {
        templateUrl: 'app/controllers/empleados/empleados.html',
        controller: 'empleadosController'
    })
    .when('/proveedores', {
        templateUrl: 'app/controllers/proveedores/proveedores.html',
        controller: 'proveedoresController'
    })
    .when('/catalogos/:id', {
        templateUrl: 'app/controllers/catalogos/catalogo.html',
        controller: 'catalogoController'
    })
    .when('/catalogos', {
        templateUrl: 'app/controllers/catalogos/catalogo.html',
        controller: 'catalogoController'
    })
    .when('/ordenes_compra/:id', {
        templateUrl: 'app/controllers/ordenes_compra/orden.html',
        controller: 'ordenController'
    })
    .when('/ordenes_compra', {
        templateUrl: 'app/controllers/ordenes_compra/orden.html',
        controller: 'ordenController'
    })
    .when('/facturas/:id', {
        templateUrl: 'app/controllers/facturas/factura.html',
        controller: 'facturaController'
    })
    .when('/facturas', {
        templateUrl: 'app/controllers/facturas/factura.html',
        controller: 'facturaController'
    })
    .when('/clientes', {
        templateUrl: 'app/controllers/clientes/clientes.html',
        controller: 'clientesController'
    })
    .when('/productos', {
        templateUrl: 'app/controllers/productos/productos.html',
        controller: 'productosController'
    })
    .when('/ventas', {
        templateUrl: 'app/controllers/ventas/ventas.html',
        controller: 'ventasController'
    })
    .when('/devoluciones', {
        templateUrl: 'app/controllers/devoluciones/devoluciones.html',
        controller: 'devolucionesController'
    })
    .otherwise({
        templateUrl: 'app/controllers/dashboard/dashboard.html',
        controller: 'dashboardController'
    });
});

app.controller('mainController', ['$scope','$http','$q','$location', function($scope, $http, $q,$location) {
    $scope.nombreApp = "Sistema Ferretería";

    $scope.cargarEstados = function() {
        $http({
            method: 'GET',
            url: 'api/obtenerEstados.php'
        }).then(function ok(resp) {
            $scope.estados = resp.data;
        },function err(argument) {
            $scope.estados = {};
            $scope.errorInminente();
        });
    }

    $scope.cargarMunicipioPorCveEnt = function(cveEnt) {
        $http({
            method: 'POST',
            url: 'api/obtenerMunicipiosPorCveEnt.php',
            data: {cve_ent: cveEnt}
        }).then(function ok(resp) {
            $scope.cve_mun = undefined;
            $scope.municipios = resp.data;
        },function err(argument) {
            $scope.municipios = {};
            $scope.errorInminente();
        });
    }

    $scope.errorInminente = function(msg) {
        msg = msg || "Se produjo un error inminente! Estamos trabajando para solucionarlo...";
        swal(msg, { icon: "error" } ).then(function() {
            window.location.pathname="Sistema-Ferreteria/login.php";
        });
        
    } 
    $scope.commonError = function() {
        swal("Se produjo un error desconocido! Estamos trabajando para solucionarlo...", { icon: "error" } );
    } 
    
   $scope.addUltimaVisitaFecha = function(fech,id_prov) {
		var url = 'api/agregarUltimaFechaProveedor.php';
		$http({
			headers: { 'Content-Transfer-Encoding': 'utf-8' },
			url: url,
			method: 'POST',
			data: {
				id_prov: id_prov,
				fecha: fech
			}
		}).then(function ok(res) {
			swal(res.data.msg, { icon: "success" } );
			//El codigo que quieras meter cuando este ok la modificacion	
           window.location.hash="#!/proveedores";
		}, function err(error) {
			swal(error.data.msg, { icon: "error" } );
			//El codigo que quieras meter cuando falle la modificacion
             window.location.hash="#!/proveedores";
		});
	}   
    
    $scope.cargarProveedores = function(callback) {
		$scope.proveedoreslista = [];
		$http({
			url: 'api/obtenerNombresProveedores.php',
			method: 'get'
		}).then(function(resp) {
            $scope.proveedoreslista = resp.data;
            if(callback && typeof callback == 'function') {
                callback();
            }
		},function(err) {
			swal(err.data.msg, { icon: "error" } );			
		})
    } 
    
     $scope.cargarFacturas = function(callback) {
		$scope.facturaslista = [];
		$http({
			url: 'api/obtenerFacturas.php',
			method: 'get'
		}).then(function(resp) {
            $scope.facturaslista = resp.data;
            if(callback && typeof callback == 'function') {
                callback();
            }
		},function(err) {
			swal(err.data.msg, { icon: "error" } );			
		})
    }
    
    $scope.cargarOrdenes = function(callback) {
		$scope.ordeneslista = [];
		$http({
			url: 'api/obtenerOrdenes.php',
			method: 'get'
		}).then(function(resp) {
            $scope.ordeneslista = resp.data;
            if(callback && typeof callback == 'function') {
                callback();
            }
		},function(err) {
			swal(err.data.msg, { icon: "error" } );			
		})
    }

    $scope.cargarCatalogoPorIdProv = function(id_prov, callback) {
        if(id_prov && id_prov.toString() != '' )
    		$http({
    			url: 'api/obtenerCatalogoPorIdProveedor.php',
                method: 'POST',
                data: {id_prov: id_prov}
    		}).then(function(resp) {
                if(resp && resp.data){
                    $scope.catalogoslista = resp.data;
                    if(callback && typeof callback == 'function'){
                        callback();
                    }
                }
    		},function(err) {
    			swal(err.data.msg, { icon: "error" } );			
    		})
    }

     $scope.cargarOrdenPorIdProv = function(id_prov, callback) {
        if(id_prov && id_prov.toString() != '' )
    		$http({
    			url: 'api/obtenerOrdenPorIdProveedor.php',
                method: 'POST',
                data: {id_prov: id_prov}
    		}).then(function(resp) {

                console.log(resp);
                if(resp && resp.data){
                    $scope.ordenlista = resp.data;
                    if(callback && typeof callback == 'function'){
                        callback();
                    }
                }
    		},function(err) {
    			swal(err.data.msg, { icon: "error" } );			
    		})
    }

    $scope.cargarCatalogoAniosPorNoCat = function(no_cat) {
        if($scope.catalogoslista != undefined){
            var anios = [];
        
            $scope.catalogoslista.forEach( (cat) => {
                if(cat.no_catalogo.toString() == no_cat.toString()) {
                    anios.push(cat.anio);
                }
            });
        } 

        if(anios && anios.length > 0)
            $scope.catalogosanioslista = anios;
    }
     
     $scope.cargarOrdenFechaPorNo = function(no_orden) {
        if($scope.ordenlista != undefined){
            var fechas = [];
        
            $scope.ordenlista.forEach( (oc) => {
                if(oc.no_orden.toString() == no_orden.toString()) {
                    fechas.push(oc.fecha_orden);
                }
            });
        } 

        if(fechas && fechas.length > 0)
            $scope.ordenesfechaslista = fechas;
    } 
     
      $scope.cargarOrdenFechaPorNo = function(no_orden) {
        if($scope.ordenlista != undefined){
            var fechas = [];
        
            $scope.ordenlista.forEach( (oc) => {
                if(oc.no_orden.toString() == no_orden.toString()) {
                    fechas.push(oc.fecha_orden);
                }
            });
        } 

        if(fechas && fechas.length > 0)
            $scope.ordenesfechaslista = fechas;
    } 
     
     $scope.menuItems=[
        {itemName: "Dashboard", logo: "pe-7s-graph", clase: "menuItem active", referencia: "#"},
        {itemName: "Empleados", logo: "pe-7s-user", clase: "menuItem", referencia: "#!/empleados"}, 
        {itemName: "Proveedores", logo: "pe-7s-user", clase: "menuItem", referencia: "#!/proveedores"},
        {itemName: "Clientes", logo: "pe-7s-user", clase: "menuItem", referencia: "#!/clientes"},
        {itemName: "Ventas", logo: "pe-7s-note2", clase: "menuItem", referencia:"#!/ventas"},
        {itemName: "Inventario", logo: "pe-7s-news-paper", clase: "menuItem", referencia: "#"},
        {itemName: "Catálogos", logo: "pe-7s-news-paper", clase: "menuItem", referencia: "#!/catalogos" },
        {itemName: "Órdenes de compra", logo: "pe-7s-news-paper", clase: "menuItem", referencia: "#!/ordenes_compra" },  
        {itemName: "Facturas de Proveedores", logo: "pe-7s-news-paper", clase: "menuItem", referencia: "#!/facturas" }, 
        {itemName: "Productos", logo: "pe-7s-tools", clase: "menuItem", referencia: "#!/productos" },
	{itemName: "Devoluciones", logo:"pe-7s-albums", clase:"menuItem", referencia:"#!/devoluciones"}
    ]
	$scope.menuItemsEmpleado=[
        {itemName: "Dashboard", logo: "pe-7s-graph", clase: "menuItem active", referencia: "#"}, 
        {itemName: "Ventas", logo: "pe-7s-note2", clase: "menuItem", referencia:"#"},
        {itemName: "Catálogos", logo: "pe-7s-news-paper", clase: "menuItem", referencia: "#!/catalogos" },
        {itemName: "Facturas de Proveedores", logo: "pe-7s-news-paper", clase: "menuItem", referencia: "#!/facturas" },
	{itemName: "Devoluciones", logo:"pe-7s-albums", clase:"menuItem", referencia:"#!/devoluciones"}
    ]
     $scope.menuItemsAlmacenista=[
        {itemName: "Dashboard", logo: "pe-7s-graph", clase: "menuItem active", referencia: "#"}, 
        {itemName: "Proveedores", logo: "pe-7s-user", clase: "menuItem", referencia: "#!/proveedores"},
        {itemName: "Ordenes de compra", logo: "pe-7s-news-paper", clase: "menuItem", referencia: "#!/ordenes_compra" }, 
        {itemName: "Inventario", logo: "pe-7s-news-paper", clase: "menuItem", referencia: "#"},
        {itemName: "Facturas de Proveedores", logo: "pe-7s-news-paper", clase: "menuItem", referencia: "#!/facturas" }  
    ]
                                 
}]);
