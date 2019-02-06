
//=========================    URL'S ===================================
var urlDescarga = null;
var urlEmbarcacao = null;

$.getJSON("assets/urls.json", function (data) {
    urlDescarga = data.urlDescarga;
    urlEmbarcacao = data.urlEmbarcacao;
});

//=========================   FIM URL'S ================================

angular.module("yara")
    .controller("liberacaoDescargaController", function ($scope, $http) {
        $scope.$on('$viewContentLoaded', function () {

            montaTabelaLiberacao();

        });
    });

// // ===================================== MONTA TABELA ================================
function montaTabelaLiberacao() {
    var navios =[];

    var requestItens = $.ajax({
        url: urlDescarga + "?status=CRIADA",
        method: "GET",
        crossDomain: true
    });

    //Table Structure//
    var table = "<table id='tblLiberar' class='table table-striped table-bordered' cellspacing='0' width='100%'>" +
        "<thead>" +
        "<tr>" +
        "<th class='text-center'>Navio</th>" +
        "<th class='text-center'>Escala RF</th>" +
        "<th class='text-center'>Opções</th>" +
        "</tr>" +
        "</thead>" +
        "<tbody>";


    requestItens.done(function (data) {
        
        var requestNavio = $.ajax({
            url: urlEmbarcacao,
            method: "GET",
            crossDomain: true,
            async: false,
        });
        requestNavio.done(function (navio) {
            for (var i = 0; i < navio.length; i++) {
               navios[navio[i].idEmbarcacao]=navio[i];
            }
            for (var i = 0; i < data.length; i++) {
            //Body//
            table += '<tr value="' + data[i].idDescarga + '">' +
                '<td class="text-center">' +navios[data[i].idEmbarcacao].nmEmbarcacao + '</td>' +
                '<td class="text-center">' + data[i].escalaRf + '</td>' +
                '<td class="text-center"><button type="button" rel="tooltip" class="btn btn-simple btn-round btn-success" data-original-title="" title="" onclick="liberar_plano(' + data[i].idDescarga + ')"> Liberar Descarga</button></td> ' +
                '</tr>';

            }
            //Close Table//
            table += '</tbody></table>';

            //Função que esconde div,instancia tabela e starta o Datatable//
            $('#div_tabela').fadeOut(500, function () {
                $(this).empty().hide().append(table).fadeIn("fast");

                $('#tblLiberar').DataTable({
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
        

           

            
    });

}

// // ===================================== FIM MONTA TABELA ================================

// // ===================================== LIBERAR DESCARGA ================================
function liberar_plano(idDescarga) {
    const swalWithBootstrapButtons = Swal.mixin({
        confirmButtonClass: 'btn btn-success',
        cancelButtonClass: 'btn btn-danger',
        buttonsStyling: false,
    })

    swalWithBootstrapButtons({
        title: 'Deseja Realmente Liberar a Descarga?',
        text: "Você não poderá reverter esta ação!",
        type: 'warning',
        showCancelButton: true,
        confirmButtonText: 'Sim, liberar!',
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
                url: urlDescarga+"/" + idDescarga + "/changestatus/LIBERADA",
                crossDomain: true,
                success: function (sucesso) {
                    montaTabelaLiberacao();
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
// // ===================================== LIBERAR DESCARGA ================================
