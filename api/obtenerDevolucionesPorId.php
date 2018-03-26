<?php 
require_once 'config.php';
	$sql = "
		SELECT * FROM devolucion_producto 
		WHERE no_devolucion = '$request->no_devolucion' and fecha = '$request->fecha'";
	$result = $con->query($sql);
	echoMysqlResults($result);	
?>