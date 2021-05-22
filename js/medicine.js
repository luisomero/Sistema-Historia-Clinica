var medicine_table;

function filterGlobal() {
    $('#medicine_table').DataTable().search(
        $('#global_filter').val(),
    ).draw();
}

function ListMedicine(){
    medicine_table = $("#medicine_table").DataTable({
       "ordering":false,
       "paging": false,
       "searching": { "regex": true },
       "lengthMenu": [ [10, 25, 50, 100, -1], [10, 25, 50, 100, "All"] ],
       "pageLength": 10,
       "destroy":true,
       "async": false ,
       "processing": true,
       "ajax":{
           "url":"../controller/medicine/list_medicine.php",
           type:'POST'
       },
       "order":[[1, 'asc']],
       "columns":[
           {"defaultContent":""},
           {"data":"name"},
           {"data":"alias"},
           {"data":"stock"},
           {"data":"register_date"},
           {"data":"status",
           render: function (data, type, row ) {
               if(data=='ACTIVO'){
                   return "<span class='label label-success'>"+data+"</span>";                   
                }
               if(data=='INACTIVO'){
                 return "<span class='label label-danger'>"+data+"</span>";                 
                }
               if(data=='AGOTADO'){
                return "<span class='label label-black' style='background: black;'>"+data+"</span>";                 
                }
            }
            },  
           {"defaultContent":"<button style='font-size:13px;' type='button' class='edit btn btn-primary'><i class='fa fa-edit'></i>"}
       ],

       "language":idioma_espanol,
       select: true
   });

   document.getElementById("medicine_table_filter").style.display="none";

    $('input.global_filter').on( 'keyup click', function () {
        filterGlobal();
    } );

    $('input.column_filter').on( 'keyup click', function () {
        filterColumn( $(this).parents('tr').attr('data-column') );
    });

    medicine_table.on( 'draw.dt', function () {
    var PageInfo = $('#medicine_table').DataTable().page.info();
    medicine_table.column(0, { page: 'current' }).nodes().each( function (cell, i) {
        cell.innerHTML = i + 1 + PageInfo.start;
    } );
    } );
}

function OpenModalRegister(){
    $("#register_modal").modal({backdrop: 'static', keyboard: false});
    $("#register_modal").modal('show');
}

function CleanRegister(){
    $("#txtName").val("");
    $("#txtAlias").val("");
    $("#txtStock").val("");
}

function RegisterMedicine(){
    var name = $("#txtName").val();
    var alias = $("#txtAlias").val();
    var stock = $("#txtStock").val();
    var status = $("#cbxStatus").val();

    if(stock.length < 0){
        return Swal.fire("Mensaje de Advertencia", "El stock no puede ser negativo", "warning");
    }

    if(name.length == 0 || alias.length == 0 || stock.length == 0){
        return Swal.fire("Mensaje de Advertencia", "Llenar los campos vacíos", "warning");
    }

    $.ajax({
        url:'../controller/medicine/register_medicine.php',
        type: 'POST',
        data: {
            name: name,
            alias: alias,
            stock: stock,
            status: status
        }
    }).done(function(resp){
        if(resp>0){
            if(resp==1){
                $("#register_modal").modal('hide');
                ListMedicine();
                CleanRegister();
                Swal.fire("Mensaje de Confirmación", "Datos guardados correctamente", "success");
            }else{
                CleanRegister();
                Swal.fire("Mensaje de Advertencia", "Lo sentimos, el medicamento ya se encuentra registrado", "warning");
            }
        }else{
            Swal.fire("Mensaje de Error", "Lo sentimos, no se pudo completar el registro", "error");
        }
    })
}

