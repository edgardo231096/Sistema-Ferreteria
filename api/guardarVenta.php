<?php 
	require_once 'config.php';
	//Checar que recibimos los parametros obligatorios
	if(
		!property_exists($request,'fecha') ||
		!property_exists($request,'hora') ||
		!property_exists($request,'monto') ||
		!property_exists($request,'tipo') ||
		!property_exists($request,'id_empleado') ||
		!property_exists($request, 'carritocompras')
	) {
		echoError("No se pudo guardar el usuario: Parametros incompletos");
	}

	if( count($request->carritocompras) == 0 ) {
		echoError("Debe añadir por lo menos un articulo al carrito de compras");
	}

	$RFC = property_exists($request, 'rfc')?"'".$request->rfc."'":"null";
	$es_a_credito = property_exists($request, 'es_a_credito')?$request->es_a_credito:false;
	$fecha = new DateTime("@$request->fecha");
	$fecha_limite_pago = new DateTime("@$request->fecha_limite_pago_timestamp");
	
	$con->multi_query("call ultimo_no_venta();");
	$result_store = $con->store_result();
	$no_venta = intval($result_store->fetch_object()->no_venta) + 1;	
	$result_store->free();
	mysqli_next_result($con);

	$sql = "
		INSERT INTO `venta` (`no_venta`, `fecha`, `hora`, `monto`, `tipo`, `es_a_credito`, `descuento`, `fecha_limite_pago`, `id_empleado`, `RFC`) VALUES ('$no_venta', curdate(), '$request->hora', '$request->monto', '$request->tipo', '$es_a_credito', '$request->descuento', '".$fecha_limite_pago->format('Y-m-d')."', '$request->id_empleado', $RFC);
		"; 
	$result = $con->query($sql);
	if($result) {
		foreach($request->carritocompras as $articulo) {
			$sql1 = "
			INSERT INTO `producto_venta` (`codigo`, `marca`, `no_venta`, `fecha`, `precio_vendido`, `cantidad`, `unidades`) VALUES ('".$articulo->codigo."', '".$articulo->marca."', '".$no_venta."', curdate(), '".$articulo->precio."', '".$articulo->cantidad."', '".$articulo->unidades."');
			";
			$tmpResult = $con->query($sql1);
			if(!$tmpResult) {
				echoError("Error al insertar un articulo: " . $sql1);
			}
		}
	}

	if($result){ 
		echoMessage("Insercion Correcta ");
	} else {
		echoError("Error al guardar el registro ".$sql);
	}
?>