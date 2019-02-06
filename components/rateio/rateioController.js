
//=========================    URL'S ===================================
var urlExecutaRateio = null;
var urlRateio = null;
var urlCalculaRateio = null;
var urlDescarga = null;

$.getJSON("assets/urls.json", function (data) {

    urlExecutaRateio = data.urlTransPesagem;
    urlRateio = data.urlRateio;
    urlCalculaRateio = data.urlCalculaRateio;
    urlDescarga = data.urlDescarga;
});

//=========================   FIM URL'S ================================

angular.module("yara")
    .controller("rateioController", function ($scope, $http) {
        $scope.$on('$viewContentLoaded', function () {
        });
    });

// // ===================================== MONTA TABELA ==================================================

function montaTabelaRateio() {

    var escala_rf = $('#txtEscalaRF').val();

    if (escala_rf != "") {

        //Esvazia a tabela//
        $('#div_tabela').empty();

        //Table Structure//
        var table = "<table id='datatableRateio' class='table table-striped table-bordered' cellspacing='0' width='100%'>" +
            "<thead>" +
            "<tr>" +
            "<th class='text-center'>DI</th>" +
            "<th class='text-center'>QTD Prod</th>" +
            "<th class='text-center'>QTD Real</th>" +
            "<th class='text-center'>Diferença</th>" +
            "</tr>" +
            "</thead>" +
            "<tbody>";

        var requestItens = $.ajax({
            url: urlRateio + "?escala_rf=" + escala_rf,
            method: "GET",
            crossDomain: true
        });

        requestItens.done(function (data) {

            //Body//
            for (var i = 0; i < data.length; i++) {
                table += '<tr value="' + data[i].id_descarga + '">' +
                    '<td class="text-center">' + data[i].num_di + '</td>' +
                    '<td class="text-center">' + data[i].qtd_planejado + '</td>' +
                    '<td class="text-center">' + data[i].qtd_real + '</td>' +
                    '<td class="text-center">' + data[i].dif_ton + '</td>' +
                    '</tr>';
            }

            //Close Table//
            table += '</tbody></table>';

            //Função que esconde div,instancia tabela e starta o Datatable//
            $('#div_tabela').fadeOut(500, function () {
                $(this).empty().hide().append(table).fadeIn("fast");
                $('#datatableRateio').DataTable({
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

        var botao = '<button onclick="gerar_rateio()" class="justify-content-center btn btn-success">Gerar Rateio</button>';
        $('#buttonFooter').empty().append(botao);

    } else {
        swal("Preencha a Escala RF", "", "warning")
    }
}

// // ===================================== FIM MONTA TABELA ================================

// // ===================================== GERAR RATEIO ====================================
function gerar_rateio() {

    var escala_rf = $('#txtEscalaRF').val();

    const swalWithBootstrapButtons = Swal.mixin({
        confirmButtonClass: 'btn btn-success',
        cancelButtonClass: 'btn btn-danger',
        buttonsStyling: false,
    })

    swalWithBootstrapButtons({
        title: 'Deseja Realmente Gerar o Rateio?',
        text: "O mesmo irá sobrescrever a tabela atual!",
        type: 'warning',
        showCancelButton: true,
        confirmButtonText: 'Sim, gerar!',
        cancelButtonText: 'Não, cancelar!',
        reverseButtons: true
    }).then((result) => {
        if (result.value) {

            //Esvazia a tabela//
            $('#div_tabela').empty();

            //Table Structure//
            var table = "<table id='datatableRateio' class='table table-striped table-bordered' cellspacing='0' width='100%'>" +
                "<thead>" +
                "<tr>" +
                "<th class='text-center'>DI</th>" +
                "<th class='text-center'>QTD Prod</th>" +
                "<th class='text-center'>QTD Real</th>" +
                "<th class='text-center'>Diferença</th>" +
                "<th class='text-center'>QTD Real (Rateio)</th>" +
                "<th class='text-center'>Diferença (Rateio)</th>" +
                "<th class='text-center'>QTD RF (Rateio)</th>" +
                "</tr>" +
                "</thead>" +
                "<tbody>";

            var requestItens = $.ajax({
                url: urlCalculaRateio + "?escala_rf=" + escala_rf,
                method: "POST",
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                },
                crossDomain: true
            });

            requestItens.done(function () {

                var requestItens = $.ajax({
                    url: urlRateio + "?escala_rf=" + escala_rf,
                    method: "GET",
                    crossDomain: true
                });

                requestItens.done(function (data) {

                    //Body//
                    for (var i = 0; i < data.length; i++) {
                        table += '<tr value="' + data[i].id_descarga + '">' +
                            '<td class="text-center">' + data[i].num_di + '</td>' +
                            '<td class="text-center">' + data[i].qtd_planejado + '</td>' +
                            '<td class="text-center">' + data[i].qtd_real + '</td>' +
                            '<td class="text-center">' + data[i].dif_ton + '</td>' +
                            '<td class="text-center">' + data[i].qtd_real_rateio + '</td>' +
                            '<td class="text-center">' + data[i].dif_ton_rateio + '</td>' +
                            '<td class="text-center">' + data[i].qtd_rf_rateio + '</td>' +

                            '</tr>';
                    }

                    //Close Table//
                    table += '</tbody></table>';

                    //Função que esconde div,instancia tabela e starta o Datatable//
                    $('#div_tabela').fadeOut(500, function () {
                        $(this).empty().hide().append(table).fadeIn("fast");
                        $('#datatableRateio').DataTable({
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

            swalWithBootstrapButtons(
                'Rateio automático gerado com sucesso!',
                'O rateio foi gerado e você podera confirmar o mesmo ou enviar para análise',
                'success'
            )

            var botao = '<button onclick="enviar_analise()" class="justify-content-center btn btn-info">Enviar para Análise</button>' +
                '<button onclick="aprovar_rateio()" class="justify-content-center btn btn-success">Aprovar Rateio</button>';
            $('#buttonFooter').empty().append(botao);

        } else if (result.dismiss === Swal.DismissReason.cancel) {
            swalWithBootstrapButtons(
                'Cancelar',
                'O rateio não gerado',
                'error'
            )
        }
    });

}
// // ===================================== FIM GERAR RATEIO ================================

// // ===================================== ENVIAR PARA ANÁLISE ================================

function enviar_analise() {

    var escala_rf = $('#txtEscalaRF').val();

    const swalWithBootstrapButtons = Swal.mixin({
        confirmButtonClass: 'btn btn-success',
        cancelButtonClass: 'btn btn-danger',
        buttonsStyling: false,
    })

    swalWithBootstrapButtons({
        title: 'Deseja submeter este rateio à análise?',
        text: "Você não poderá reverter esta ação!",
        type: 'warning',
        showCancelButton: true,
        confirmButtonText: 'Enviar',
        cancelButtonText: 'Cancelar',
        reverseButtons: true

    }).then((result) => {
        if (result.value) {

            var requestEscalaId = $.ajax({
                url: urlDescarga + "/search?numrf=" + escala_rf,
                method: "GET",
                crossDomain: true
            });

            requestEscalaId.done(function (id) {

                $.ajax({
                    type: "PUT",
                    headers: {
                        'Accept': 'application/json',
                        'Content-Type': 'application/json'
                    },
                    url: urlDescarga + "/" + id.idDescarga + "/changestatus/EM ANALISE",
                    crossDomain: true,
                    success: function (sucesso) {
                        $('#div_tabela').empty();
                        $('#buttonFooter').empty();
                        $.unblockUI();
                    },
                    error: function (data) {
                        $.unblockUI();
                    }
                });

                swalWithBootstrapButtons(
                    'Enviado com sucesso!',
                    'O rateio foi para análise',
                    'success'
                )
            });

        } else if (result.dismiss === Swal.DismissReason.cancel) {
            swalWithBootstrapButtons(
                'Cancelar',
                'O rateio não foi enviado',
                'error'
            )
        }
    })
}

// // ===================================== FIM ENVIAR PARA ANÁLISE ================================

// // ===================================== APROVAR RATEIO ================================

function aprovar_rateio() {

    const swalWithBootstrapButtons = Swal.mixin({
        confirmButtonClass: 'btn btn-success',
        cancelButtonClass: 'btn btn-danger',
        buttonsStyling: false,
    })

    swalWithBootstrapButtons({
        title: 'Deseja aprovar este rateio?',
        text: "Você não poderá reverter esta ação!",
        type: 'warning',
        showCancelButton: true,
        confirmButtonText: 'Aprovar',
        cancelButtonText: 'Cancelar',
        reverseButtons: true

    }).then((result) => {
        if (result.value) {

            var escala_rf = $('#txtEscalaRF').val();

            var requestItens = $.ajax({
                url: urlExecutaRateio + "?escala_rf=" + escala_rf,
                method: "POST",
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                },
                crossDomain: true
            });

            requestItens.done(function (data) {

                $('#div_tabela').empty();
                $('#buttonFooter').empty();

                swalWithBootstrapButtons(
                    'Aprovado com sucesso!',
                    'O rateio foi aprovado',
                    'success'
                )
            });
        } else if (result.dismiss === Swal.DismissReason.cancel) {
            swalWithBootstrapButtons(
                'Cancelar',
                'O rateio não foi aprovado',
                'error'
            )
        }
    })
}

// // ===================================== FIM APROVAR RATEIO ================================
