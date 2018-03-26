delimiter //
create trigger suma_devoluciones before insert on devolucion_producto
	for each row
	begin
	declare cant int;
	set cant=new.cantidad;
	if new.motivo!='defecto' then
		update producto set existencia_bodega=(existencia_bodega+cant) where codigo=new.codigo;
	end if;
end;
//
