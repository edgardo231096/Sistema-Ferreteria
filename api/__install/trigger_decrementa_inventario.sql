delimiter //
drop trigger resta_producto;//
create trigger resta_producto after insert on producto_venta
	for each row
	begin
	declare cant int;
	set cant=new.cantidad;
	update producto set existencia_bodega=(existencia_bodega-cant) where codigo=new.codigo;
	
end;
//
