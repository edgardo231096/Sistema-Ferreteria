<?php 
	require_once 'config.php';
if(
		!property_exists($request,'no_orden') ||
		!property_exists($request,'fecha_orden') 
	) {
		echoError("No se pudo guardar el usuario: Parametros incompletos");
	}
	$sql = "SELECT * FROM producto, producto_orden_compra WHERE producto_orden_compra.codigo = producto.codigo and producto_orden_compra.marca = producto.marca AND producto_orden_compra.no_orden = '$request->no_orden' AND producto_orden_compra.fecha_orden = '$request->fecha_orden' order by producto.codigo;";
	$result = $con->query($sql);

	echoMysqlResults($result);
?>