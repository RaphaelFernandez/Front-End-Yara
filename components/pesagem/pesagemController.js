
//=========================    URL'S ===================================

var urlPesagemTabela = null;
var urlMedidor = null;
var urlEscalaDi = null;
var urlDescarga = null;

$.getJSON("assets/urls.json", function (data) {
    urlPesagemTabela = data.urlPesagemTabela;
    urlMedidor = data.urlMedidor;
    urlEscalaDi = data.urlEscalaDi;
    urlDescarga = data.urlDescarga;
});

//=========================   FIM URL'S ================================

angular.module("yara")
    .controller("pesagemController", function ($scope, $http) {
        $scope.$on('$viewContentLoaded', function () {

            demo.initDateTimePicker();
            if ($('.slider').length != 0) {
                demo.initSliders();
            }

            selectMedidor();
            selectDescarga();

            var table = $('#tblPesagem').DataTable();

            $('#tblPesagem tbody').on('click', 'tr', function () {
                $(this).toggleClass('selected');
                $("#numPesagens").text(table.rows('.selected').data().length);
            });
        });
    });

// // ===================================== MONTA TABELA ==================================================

function montaTabelaPesagem() {

    var data_inicio = $('#txtDataInicio').val();
    var data_fim = $('#txtDataFim').val();
    var medidor = $('#cmbMedidor').val();


    if (data_inicio != "" || data_fim != "" || medidor != "Selecione") {

        //Esvazia a tabela//
        $('#div_tabela').empty();

        //Table Structure//
        var table = "<table id='tblPesagem' class='table table-striped table-bordered' cellspacing='0' width='100%'>" +
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
            url: urlPesagemTabela,
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
                $('#tblPesagem').DataTable({
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
    } else {
        swal("Preencha Todos os Campos", "", "warning")
    }
}

// // ===================================== FIM MONTA TABELA ================================


// ==========================================  SELECIONAR MEDIDOR ==========================================
function selectMedidor() {

    $('#cmbMedidor').find("option").remove();
    var request = $.ajax({
        url: urlMedidor,
        method: "GET"
    });

    request.done(function (data) {
        $('#cmbMedidor').append("<option value='0'>Selecione</option>");

        for (var i = 0; i < data.length; i++) {
            $('#cmbMedidor').append("<option value='" + data[i].idMedidor + "'>" + data[i].nmMedidor + "</option>");
        }
    })
}
// ==========================================  FIM SELECIONAR MEDIDOR ==========================================

// ==========================================  SELECIONAR DESCARGA =============================================
function selectDescarga() {

    $('#cmbEscalaRF').find("option").remove();
    var request = $.ajax({
        url: urlDescarga,
        method: "GET"
    });

    request.done(function (data) {
        $('#cmbEscalaRF').append("<option value='0'>Selecione</option>");

        for (var i = 0; i < data.length; i++) {
            $('#cmbEscalaRF').append("<option value='" + data[i].idDescarga + "'>" + data[i].escalaRf + "</option>");
        }
    })
}
// ==========================================  FIM SELECIONAR DESCARGA ==========================================

// ==========================================  SELECIONAR MEDIDOR ==========================================
function selectPesagemDi() {
    $('#cmbDi').find("option").remove();
    var request = $.ajax({
        url: urlEscalaDi + $("#cmbEscalaRF option:selected").text(),
        method: "GET"
    });

    request.done(function (data) {

        console.log(data);

        $('#cmbDi').append("<option value='0'>Selecione</option>");

        for (var i = 0; i < data.length; i++) {
            $('#cmbDi').append("<option value='" + data[i].id_di + "'>" + data[i].num_di + "</option>");
        }
    })
}
// ==========================================  FIM SELECIONAR MEDIDOR ==========================================


// // ===================================== VINCULAR =================================================

function vincular() {
        var data = {
            pesagemIdsList: idCarga,
            idDI:$("#cmbDi").val(),
        }

        $.ajax({
            type: "PUT",
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            data: JSON.stringify(data),
            url: urlDeleteProdutos + "/" + idCarga,
            crossDomain: true,
            success: function (sucesso) {
                montaTabelaProdutos();
                $.unblockUI();
            },
            error: function (data) {
                $.unblockUI();
            }
        });
}

// // ===================================== FIM VINCULAR ==================================================
