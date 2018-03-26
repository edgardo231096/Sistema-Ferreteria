<?php 
	require_once 'config.php';
	if(!isset($_GET['keyword'])) 
	{
		echoError("Error: Falta la keyword");
	}
	$keyword = $_GET['keyword'];
	$result = $con->query("SELECT concat(no_venta, ' ', fecha) AS numeroVenta FROM venta where no_venta like '%$keyword%';");
	

	echoMysqlResults($result);
?>
