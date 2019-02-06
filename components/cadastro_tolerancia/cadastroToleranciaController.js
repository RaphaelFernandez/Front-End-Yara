
//=========================    URL'S ===================================
var urlTolerancia = null;

$.getJSON("assets/urls.json", function (data) {
    urlTolerancia = data.urlTolerancia;
});
//=========================   FIM URL'S ===================================

angular.module("yara")
    .controller("cadastroToleranciaController", function ($scope, $http) {
        $scope.$on('$viewContentLoaded', function () {

            if ($('.slider').length != 0) {
                demo.initSliders();
            }

            $('#txtTolerancia').mask('000');


            montaTabelaTolerancia();
        });
    });

// ================================================ CADASTRAR TOLERÂNCIA =================================================

function cadastrarTolerancia() {

    var tolerancia = $('#txtTolerancia').val();

    if (tolerancia != '') {

        $.blockUI({
            message: '<img style="max-width:100px;max-height:100px;" src="assets/img/loading.gif" />',
            css: {
                border: 'none',
                backgroundColor: 'transparent'
            }
        });

        var data = {
            vlTolerancia: tolerancia
        }

        $.ajax({
            type: "POST",
            headers: { //faz o header puxar o conteúdo da aplicação
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            url: urlTolerancia,
            data: JSON.stringify(data),
            success: function (sucesso) {
                swal("Cadastrado com sucesso!", "", "success")
                montaTabelaTolerancia();
                $.unblockUI();
            },
            error: function (data) {
                swal("Houve um erro para salvar o dado", "", "error")
                $.unblockUI();
            }
        });
    } else {
        swal("Preencha todos os campos", "", "warning")
    }
}
// ================================================ FIM CADASTRAR TOLERÂNCIA =======================================================

// // ===================================================== MONTA TABELA =======================================================
function montaTabelaTolerancia() {

    var requestItens = $.ajax({
        url: urlTolerancia,
        method: "GET",
        crossDomain: true
    });

    //Table Structure//
    var table = "<table id='tblTolerancia' class='table table-striped table-bordered' cellspacing='0' width='100%'>" +
        "<thead>" +
        "<tr>" +
        "<th class='text-center'>Tolerância</th>" +
        "<th class='text-center'>Data de Cadastro</th>" +
        "</tr>" +
        "</thead>" +
        "<tbody>";

    requestItens.done(function (data) {

        //Body//
        for (var i = 0; i < data.length; i++) {

            if (data[i].ativo == true) {
                table += '<tr style="background:green; color:white;" value="' + data[i].idTolerancia + '">';
            } else {
                table += '<tr value="' + data[i].idTolerancia + '">';
            }
            table += '<td class="text-center">' + data[i].vlTolerancia + '%</td>' +
                '<td class="text-center">' + formatDate(data[i].dtCadastro) + '</td>' +
                '</tr>';
        }


        //Close Table//
        table += '</tbody></table>';

        //Função que esconde div,instancia tabela e starta o Datatable//
        $('#div_tabela').fadeOut(500, function () {
            $(this).empty().hide().append(table).fadeIn("fast");

            $('#tblTolerancia').DataTable({
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

// // ===================================== FIM MONTA TABELA ==================================================

// // ===================================== FORMATAR DATA ==================================================

function formatDate(date) {
    var d = new Date(date),
        month = '' + (d.getMonth() + 1),
        day = '' + d.getDate(),
        year = d.getFullYear();

    if (month.length < 2) month = '0' + month;
    if (day.length < 2) day = '0' + day;

    return [day, month, year].join('/');
}
// // ===================================== FIM FORMATAR DATA ==================================================

