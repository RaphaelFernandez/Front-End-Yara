
//=========================    URL'S ===================================
var urlConsultaRF = null;

$.getJSON("assets/urls.json", function (data) {
    urlConsultaRF = data.urlConsultaRF;
});

//=========================   FIM URL'S ================================

angular.module("yara")
    .controller("consultaRFController", function ($scope, $http) {
        $scope.$on('$viewContentLoaded', function () {

            montaTabelaConsultaRF();

        });
    });

// // ===================================== MONTA TABELA ================================
function montaTabelaConsultaRF() {

    var requestItens = $.ajax({
        url: urlConsultaRF + "?st_operacao=CRIADA",
        method: "GET",
        crossDomain: true
    });

    //Table Structure//
    var table = "<table id='tblConsulta' class='table table-striped table-bordered' cellspacing='0' width='100%'>" +
        "<thead>" +
        "<tr value='"+idDescarga+"'>" +
        "<th class='text-center'>Navio</th>" +
        "<th class='text-center'>Escala RF</th>" +
        "<th class='text-center'>Di</th>" +
        "<th class='text-center'>Datas</th>" +
        "<th class='text-center'>Responsável</th>" +
        "<th class='text-center'>Observação</th>" +
        "<th class='text-center'>Opções</th>" +
        "</tr>" +
        "</thead>" +
        "<tbody>";

    requestItens.done(function (data) {

        //Body//
        for (var i = 0; i < data.length; i++) {
            table += '<tr  value="' + data[i].idEscala + '">' +
                '<td class="text-center">' + data[i].navio + '</td>' +
                '<td class="text-center">' + data[i].escalaRf + '</td>' +
                '<td class="text-center">' + data[i].di + '</td>' +
                '<td class="text-center">' + data[i].datas + '</td>' +
                '<td class="text-center">' + data[i].responsavel + '</td>' +
                '<td class="text-center"><textarea rows="4" cols="80" class="form-control" placeholder="Here can be your description" value="Mike">'+data[i].observacao+'</textarea> </td>' +
                '<td class="text-center"><button type="button" rel="tooltip" class="btn btn-simple btn-round btn-success" data-original-title="" title="" onclick="finalizar_escala(' + data[i].idDi + ')">Finalizar</button></td> ' +
                '</tr>';
        }

        //Close Table//
        table += '</tbody></table>';

        //Função que esconde div,instancia tabela e starta o Datatable//
        $('#div_tabela').fadeOut(500, function () {
            $(this).empty().hide().append(table).fadeIn("fast");

            $('#tblConsulta').DataTable({
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
    });
}

// // ===================================== FIM MONTA TABELA ================================

// // ===================================== FINALIZAR ESCALA ================================
function finalizar_escala(idDi) {
    const swalWithBootstrapButtons = Swal.mixin({
        confirmButtonClass: 'btn btn-success',
        cancelButtonClass: 'btn btn-danger',
        buttonsStyling: false,
    })

    swalWithBootstrapButtons({
        title: 'Deseja Realmente Transferir?',
        text: "Você não poderá reverter esta ação!",
        type: 'warning',
        showCancelButton: true,
        confirmButtonText: 'Sim, transferir!',
        cancelButtonText: 'Não, cancelar!',
        reverseButtons: true

    }).then((result) => {
        if (result.value) {

            $.ajax({
                type: "PUT",
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                },
                data: JSON.stringify(data),
                url: urlConsultaRF + id_descarga + "/changestatus/LIBERADA",
                dataType: "json",
                crossDomain: true,
                success: function (sucesso) {
                    montaTabela();
                    $.unblockUI();
                },
                error: function (data) {
                    $.unblockUI();
                }
            });

            swalWithBootstrapButtons(
                'Liberado!',
                'O plano foi enviado para a operação',
                'success'
            )
        } else if (result.dismiss === Swal.DismissReason.cancel) {
            swalWithBootstrapButtons(
                'Cancel',
                'O plano não foi liberado',
                'error'
            )
        }
    })
}
// // ===================================== FIM FINALIZAR ESCALA ================================
