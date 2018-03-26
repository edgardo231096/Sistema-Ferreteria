<?php
require_once 'config.php';
    $prox_no_dev=$con->query("call prox_no_devolucion();");
    $res_procedure = $prox_no_dev->fetch_array(MYSQLI_NUM);

    mysqli_next_result($con);
    $conteo=sizeof($request->resp)-1;
    $venta=(explode(' ',$request->no_venta,2));
    $sql="insert into devolucion (no_devolucion,fecha,hora,no_venta,fecha_venta) values
    ('$res_procedure[0]',curdate(),curtime(),'$venta[0]','$venta[1]');";
    $con->query($sql);
    $resp=$request->resp;
    while($conteo>=0){

        $producto = $resp[$conteo];
        if(property_exists($producto, "seleccionado") && $producto->seleccionado == true){
            $motivo = "";
            if(property_exists($producto, "motivo")) 
                $motivo = $producto->motivo;
            $descripcion = "";
            if(property_exists($producto, "descripcion")) 
                $descripcion = $producto->descripcion;
            
            $sql="insert into devolucion_producto (codigo,marca,no_devolucion,fecha,cantidad,unidades,motivo,descripcion_motivo) values
            ('$producto->codigo','$producto->marca','$res_procedure[0]',curdate(),'$producto->cantidad','$producto->unidades','$motivo','$descripcion');";
            $result = $con->query($sql);
            if(!$result) {

                echoError("Errors al guardar el registro ".$sql);
            }
        }
        $result = true;
        $conteo = $conteo-1;
    }


	if($result){ 
		echoMessage("Insercion Correcta ");
	} else {
		echoError("Error al guardar el registro ".$sql);
	}
?>
