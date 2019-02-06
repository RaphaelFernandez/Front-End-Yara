
//=========================    URL'S ===================================
var urlEscalaDi = null;
var urlTransPesagem = null;
var urlRateio = null;

$.getJSON("assets/urls.json", function (data) {
    urlEscalaDi = data.urlEscalaDi;
    urlTransPesagem = data.urlTransPesagem;
    urlRateio = data.urlRateio;
});

//=========================   FIM URL'S ================================

angular.module("yara")
    .controller("transerencia_pesagem", function ($scope, $http) {
        $scope.$on('$viewContentLoaded', function () {
        });
    });

// // ===================================== MONTA TABELA ==================================================

function montaTabelaTransf(){
    
    var escala_rf = $('#txtEscalaRF').val();

    //Table Structure//
    var table="<table id='tblTransPesa' class='table table-striped table-bordered' cellspacing='0' width='100%'>" +
    "<thead>" +
        "<tr>" +
            "<th class='text-center'>DI</th>" +
            "<th class='text-center'>QTD Prod</th>" +
            "<th class='text-center'>QTD Real</th>" +
            "<th class='text-center'>Diferença</th>" +
            "<th class='text-center'>De</th>" +
            "<th class='text-center'>Para</th>" +
        "</tr>" +
    "</thead>" +
    "<tbody>";

    var requestItens = $.ajax({
        url: urlEscalaDi+escala_rf,
        method: "GET",
        crossDomain: true
    });

    requestItens.done(function (data) {

        //Body//
        for (var i = 0; i < data.length; i++) {
            table += '<tr value="' + data[i].id_descarga_di + '">' +
            '<td class="text-center">' + data[i].num_di + '</td>' +
            '<td class="text-center">' + data[i].qtd_planejado + '</td>' +
            '<td class="text-center">' + data[i].qtd_real + '</td>' +
            '<td class="text-center">' + data[i].dif_ton + '</td>' +
            '<td class="text-center"><input type="radio" id=' + data[i].id_descarga_di + ' value=' + data[i].num_di + ' name="deradio"></input></td>' +
            '<td class="text-center"><input type="radio" id=' + data[i].id_descarga_di + ' value=' + data[i].num_di + ' name="pararadio"></input></td>' +
            '</tr>';
        }

        //Close Table//
        table+='</tbody></table>';

        //Função que esconde div,instancia tabela e starta o Datatable//
        $('#div_tabela').fadeOut(500, function() {
            $(this).empty().hide().append(table).fadeIn("fast");
            $('#tblTransPesa').DataTable({
                "language": {
                    "decimal": "",
                    "emptyTable": "Nenhum resultado encontrado",
                    "info": "Mostrando _START_ à _END_ de _TOTAL_ resultados",
                    "infoEmpty": "Mostrando 0 à 0 de 0 resultados",
                    "infoFiltered": "(filtrado de _MAX_ total resultados)",
                    "infoPostFix": "",
                    "thousands": ",",
                    "lengthMenu": "Mostrar _MENU_ resultados",
                    "loadingRecords": "Carregando...",
                    "processing": "Processando...",
                    "search": "Procurar entrada:",
                    "zeroRecords": "Nenhum resultado encontrado com a busca",
                    "paginate": {
                        "first": "Primeira",
                        "last": "Última",
                        "next": "Próxima",
                        "previous": "Anterior"
                    },
                    "aria": {
                        "sortAscending": ": Ative para ordenar a coluna em ordem crescente",
                        "sortDescending": ": Ative para ordenar a coluna em ordem decrescente"
                    }
                },
                "pagingType": "full_numbers",
                "lengthMenu": [
                    [10, 25, 50, -1],
                    [10, 25, 50, "All"]
                ],
                responsive: true,
            });
        });
        var botao = '<button onclick="rateioDraft()" class="justify-content-center btn btn-success">Confirmar</button>';
        $('#buttonFooter').empty().append(botao);
    });
}

// // ===================================== FIM MONTA TABELA ================================

// // ===================================== RATEIO ================================
function rateioDraft() {
    if ($("input[name='deradio']:checked").val() == undefined || $("input[name='pararadio']:checked").val() == undefined) {
        swal("Preencha todos os campos", "", "warning")
    } else {
        Swal({
            title: 'Rateio',
            showCancelButton: true,
            confirmButtonClass: "justify-content-center btn btn-success btn-round ",
            confirmButtonText: 'Confirmar',
            cancelButtonClass: "justify-content-center btn btn-danger btn-round",
            cancelButtonText: 'Cancelar',
            showLoaderOnConfirm: true,
            buttonsStyling: false,
            width: "85%",
            html: '<div class="row justify-content-center">' +
                '<div class="col-md-4">' +
                '<label>Da Di</label>' +
                '<div class="form-group">' +
                '<input type="text" class="form-control" disabled placeholder=' + $("input[name='deradio']:checked").val() + '>' +
                '</div>' +
                '</div>' +
                '<div class="col-md-4">' +
                '<label>Para a Di</label>' +
                '<div class="form-group">' +
                '<input type="text" class="form-control" disabled placeholder=' + $("input[name='pararadio']:checked").val() + '>' +
                '</div>' +
                '</div>' +
                '<div class="col-md-4">' +
                '<label>Quantidade</label>' +
                '<div class="form-group">' +
                '<input type="number" class="form-control" id="txtQuantidade" placeholder="Quantidade...">' +
                '</div>' +
                '</div>' +
                '</div>' +
                '</div>' +
                '</div>',
        }).then((result) => {
            if (result.value) {
                
                console.log( urlTransPesagem+"?idOrigem="+$("input[name='deradio']:checked").attr('id')+"&idDestino="+$("input[name='pararadio']:checked").attr('id')+"&quantidade="+ $('#txtQuantidade').val());

                var requestItens = $.ajax({
                    url: urlTransPesagem+"?idOrigem="+$("input[name='deradio']:checked").attr('id')+"&idDestino="+$("input[name='pararadio']:checked").attr('id')+"&quantidade="+ $('#txtQuantidade').val(),
                    method: "POST",
                    headers: {
                        'Accept': 'application/json',
                        'Content-Type': 'application/json'
                    },
                    crossDomain: true
                });
    
                requestItens.done(function (data) {

                    montaTabelaTransf();
                    $.unblockUI();
    
                    Swal.fire(
                        'Aprovado com sucesso!',
                        'O rateio foi aprovado',
                        'success'
                    )
                });
            } else if (result.dismiss === Swal.DismissReason.cancel) {

                $.unblockUI();

                Swal.fire(
                    'Cancelar',
                    'O rateio não foi aprovado',
                    'error'
                )
            }
        })
    }
}
// // ===================================== FIM RATEIO ================================

