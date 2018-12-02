<?php 
	require_once 'config.php';

	//Checar que recibimos los parametros obligatorios
	if(
		!property_exists($request,'id') ||
		!property_exists($request,'nombre') ||
		!property_exists($request,'a_paterno') ||
		!property_exists($request,'a_materno') ||
		!property_exists($request,'correo') ||
		!property_exists($request,'telefono') ||
		!property_exists($request,'f_nac') ||
		!property_exists($request,'f_ingreso') ||
		!property_exists($request,'puesto') ||
		!property_exists($request,'calle') ||
		!property_exists($request,'colonia') ||
		!property_exists($request,'num_domicilio_ext') ||
		!property_exists($request,'cp') ||
		!property_exists($request,'cve_mun') ||
		!property_exists($request,'cve_ent')||
		!property_exists($request,'pass')
	) {
		echoError("No se pudo guardar el usuario: Parametros incompletos");
	}

	$num_domicilio_int = "NULL";
	if(property_exists($request,'num_domicilio_int')) {
		$num_domicilio_int = "'".$request->num_domicilio_int."'";
	}
	
	$f_nac = new DateTime("@$request->f_nac_timestamp");
    $f_ingreso = new DateTime("@$request->f_ingreso_timestamp");
    
	$sql = "
		UPDATE 
		empleado SET 
		nombre='$request->nombre',
		a_paterno='$request->a_paterno',
		a_materno='$request->a_materno',
		correo='$request->correo',
		telefono='$request->telefono',
		f_nac='".$f_nac->format("Y-m-d")."',
		f_ingreso='".$f_ingreso->format("Y-m-d")."',
		puesto='$request->puesto',
		calle='$request->calle',
		colonia='$request->colonia',
		num_domicilio_int=$num_domicilio_int,
		num_domicilio_ext='$request->num_domicilio_ext',
		cp='$request->cp',
		cve_mun='$request->cve_mun',
		pass=sha1('$request->pass'),
		cve_ent='$request->cve_ent' WHERE
		id_empleado = $request->id";

	$result = $con->query($sql);

	if($result){ 
		echoMessage("Cambios guardados correctamente");
	} else {
		echoError("Error al guardar el registro: ".$sql);
	}
?>
