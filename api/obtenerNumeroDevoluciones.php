<?php 
	require_once 'config.php';
	if(!isset($_GET['keyword'])) 
	{
		echoError("Error: Falta la keyword");
	}
	$keyword = $_GET['keyword'];
	$result = $con->query("SELECT concat(no_devolucion, ' ', fecha) AS numeroDev, devolucion.* FROM devolucion where no_devolucion like '%$keyword%';");
	

	echoMysqlResults($result);
?>
