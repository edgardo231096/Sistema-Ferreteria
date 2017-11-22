<?php 
	require_once 'config.php';

	//Checar que recibimos los parametros obligatorios
	if(
		!property_exists($request,'id') ||
		!property_exists($request,'nuevaFecha')
	) {
		echoError("No se pudo actualizar la fecha: Parametros incompletos");
	}

	$nueva_fecha = new DateTime("@$request->nuevaFecha");
    
	$sql = "
		UPDATE 
		proveedor SET 
		fecha_ultima_visita='".$nueva_fecha->format("Y-m-d")."' WHERE
		id_prov = $request->id";

	$result = $con->query($sql);

	if($result){ 
		echoMessage("Fecha actualizada correctamente");
	} else {
		echoError("Error al guardar el registro: ".$sql);
	}
?>