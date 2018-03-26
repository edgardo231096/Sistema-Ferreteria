delimiter //
create procedure prox_no_devolucion ()
begin
	set @no_devolucion = (Select (count(no_devolucion)+1) as cont from devolucion where fecha=curdate());
	select @no_devolucion as no_devolucion;
end;//
