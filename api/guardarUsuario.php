<?php 
	require_once 'config.php';

	//Checar que recibimos los parametros obligatorios
	if(
		!property_exists($request,'nombre') ||
		!property_exists($request,'a_paterno') ||
		!property_exists($request,'a_materno') ||
		!property_exists($request,'correo') ||
		!property_exists($request,'telefono') ||
		!property_exists($request,'f_nac_timestamp') ||
		!property_exists($request,'f_ingreso_timestamp') ||
		!property_exists($request,'puesto') ||
		!property_exists($request,'calle') ||
		!property_exists($request,'colonia') ||
		!property_exists($request,'num_domicilio_ext') ||
		!property_exists($request,'cp') ||
		!property_exists($request,'cve_mun') ||
		!property_exists($request,'pass') ||
		!property_exists($request,'cve_ent')
	) {
		echoError("No se pudo guardar el usuario: Parametros incompletos");
	}

	//Obtener el último id
	$res1 = $con->query("SELECT IFNULL( MAX(id_empleado), 0) as lastid FROM empleado;");
	if($row = mysqli_fetch_assoc($res1)) {
		$lastid = $row['lastid'] + 1;
	}
	$num_domicilio_int = "NULL";
	if(property_exists($request,'num_domicilio_int')) {
		$num_domicilio_int = "'".$request->num_domicilio_int."'";
	}
	$f_nac = new DateTime("@$request->f_nac_timestamp");
	$f_ingreso = new DateTime("@$request->f_ingreso_timestamp");
	//$f_ingreso = new DateTime($request->f_ingreso);
	$sql = "
		INSERT INTO 
		empleado
		SET 
		id_empleado = $lastid,
		nombre='$request->nombre',
		a_paterno='$request->a_paterno',
		a_materno='$request->a_materno',
		correo='$request->correo',
		telefono='$request->telefono',
		f_nac='".$f_nac->format('Y-m-d')."',
		f_ingreso='".$f_ingreso->format('Y-m-d')."',
		puesto='$request->puesto',
		calle='$request->calle',
		colonia='$request->colonia',
		num_domicilio_int=$num_domicilio_int,
		num_domicilio_ext='$request->num_domicilio_ext',
		cp='$request->cp',
		cve_mun='$request->cve_mun',
		cve_ent='$request->cve_ent',
		pass=sha1('$request->pass');";

	$result = $con->query($sql);

	if($result){ 
		echoMessage("Insercion Correcta ");
	} else {
		echoError("Error al guardar el registro");
	}
?>