delimiter //
create procedure password(contra varchar(250), email varchar(30))
begin 
declare tuPass varchar(250);
declare contra2 varchar(250);
set contra2=(sha1(contra));
set tuPass=(select pass from empleado where correo=email limit 1);
if tuPass=contra2 then
set @X=1;
else
set @X=0;
end if;
select @X;
end;//