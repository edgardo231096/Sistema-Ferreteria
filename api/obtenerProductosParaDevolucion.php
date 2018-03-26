<?php
    require_once 'config.php';
    $sql="select codigo, marca, precio_vendido, cantidad, unidades from producto_venta where concat(no_venta, ' ', fecha)='$request->id'";
    $result = $con->query($sql);
	echoMysqlResults($result);
 
?>
