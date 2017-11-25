var app = angular.module('app', ['ngRoute']);

app.config(function($routeProvider) {
    $routeProvider
    .when('/empleados', {
        templateUrl: 'app/controllers/empleados/empleados.html',
        controller: 'empleadosController'
    })
     .when('/proveedores', {
        templateUrl: 'app/controllers/proveedores/proveedores.html',
        controller: 'proveedoresController'
    })
    .when('/catalogos', {
        templateUrl: 'app/controllers/catalogos/catalogo.html',
        controller: 'catalogoController'
    })
    .otherwise({
        templateUrl: 'app/controllers/dashboard/dashboard.html',
        controller: 'dashboardController'
    });
});

app.controller('mainController', ['$scope','$http', function($scope, $http) {
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
    
    $scope.cargarProveedores = function() {
		$scope.proveedoreslista = [];
		$http({
			url: 'api/obtenerNombresProveedores.php',
			method: 'get'
		}).then(function(resp) {
            $scope.proveedoreslista = resp.data;
            console.log($scope.proveedoreslista );
		},function(err) {
			swal(err.data.msg, { icon: "error" } );			
		})
    }
    $scope.cargarCatalogoPorId = function(id_prov) {
        console.log(id_prov);
		$http({
			url: 'api/obtenerCatalogoPorIdProveedor.php',
            method: 'POST',
            data: {id_prov: id_prov}
		}).then(function(resp) {
            $scope.catalogoslista = resp.data;
            console.log($scope.proveedoreslista );
		},function(err) {
			swal(err.data.msg, { icon: "error" } );			
		})
    }
    
     $scope.menuItems=[
        {itemName: "Dashboard", logo: "pe-7s-graph", clase: "menuItem active", referencia: "#"},
        {itemName: "Empleados", logo: "pe-7s-user", clase: "menuItem", referencia: "#!/empleados"}, 
        {itemName: "Proveedores", logo: "pe-7s-user", clase: "menuItem", referencia: "#!/proveedores"},
        {itemName: "Ventas", logo: "pe-7s-note2", clase: "menuItem", referencia:"#"},
        {itemName: "Inventario", logo: "pe-7s-news-paper", clase: "menuItem", referencia: "#"},
        {itemName: "Catálogos", logo: "pe-7s-news-paper", clase: "menuItem", referencia: "#" }
    ]
	$scope.menuItemsEmpleado=[
        {itemName: "Dashboard", logo: "pe-7s-graph", clase: "menuItem active", referencia: "#"}, 
        {itemName: "Ventas", logo: "pe-7s-note2", clase: "menuItem", referencia:"#"},
        {itemName: "Catálogos", logo: "pe-7s-news-paper", clase: "menuItem", referencia: "#" }
    ]
     $scope.menuItemsAlmacenista=[
        {itemName: "Dashboard", logo: "pe-7s-graph", clase: "menuItem active", referencia: "#"}, 
        {itemName: "Proveedores", logo: "pe-7s-user", clase: "menuItem", referencia: "#!/proveedores"},
        {itemName: "Inventario", logo: "pe-7s-news-paper", clase: "menuItem", referencia: "#"}
    ]

}]);
