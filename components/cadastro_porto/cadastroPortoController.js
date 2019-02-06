
//=========================    URL'S ===================================
var urlPorto = null;
var urlPais = null;

$.getJSON("assets/urls.json", function (data) {
    urlPorto = data.urlPorto;
    urlPais = data.urlPais;
});
//=========================   FIM URL'S ===================================

angular.module("yara")
    .controller("cadastroPortoController", function ($scope, $http) {
        $scope.$on('$viewContentLoaded', function () {
            selectPais();
            montaTabelaPorto();
        });
    });

// ================================================ CADASTRAR PORTO =================================================

function cadastrarPorto() {

    var nome = $('#txtNomePorto').val();
    var sigla = $('#txtSiglaPorto').val();
    var pais = $('#cmbPaisPorto').val();


    if (nome != '' || sigla != '') {

        $.blockUI({
            message: '<img style="max-width:100px;max-height:100px;" src="assets/img/loading.gif" />',
            css: {
                border: 'none',
                backgroundColor: 'transparent'
            }
        });

        var data = {
            nmPorto: nome,
            nmSigla: sigla,
            idPaisOri: pais
        }

        $.ajax({
            type: "POST",
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            url: urlPorto,
            data: JSON.stringify(data),
            done: function (response) {
                montaTabelaPorto();
                swal("Cadastrado com sucesso!", "", "success");
                $.unblockUI();
            }
        });
    } else {
        swal("Preencha todos os campos", "", "warning");
        $.unblockUI();
    }
}
// ================================================ FIM CADASTRAR PORTO =======================================================

// ==========================================  SELECIONAR PAIS ==========================================
function selectPais() {

    $('#cmbPaisPorto').find("option").remove();
    var request = $.ajax({
        url: urlPais,
        method: "GET"
    });

    request.done(function (data) {
        $('#cmbPaisPorto').append("<option value='0'>Selecione</option>");

        for (var i = 0; i < data.length; i++) {
            $('#cmbPaisPorto').append("<option value='" + data[i].idPais + "'>" + data[i].nmPais + "</option>");
        }
    })
}
// ==========================================  FIM SELECIONAR PAIS ==========================================

// // ===================================================== MONTA TABELA =======================================================
function montaTabelaPorto() {

    var requestItens = $.ajax({
        url: urlPorto,
        method: "GET",
        crossDomain: true
    });

    //Table Structure//
    var table = "<table id='tblPorto' class='table table-striped table-bordered' cellspacing='0' width='100%'>" +
        "<thead>" +
        "<tr>" +
        "<th class='text-center'>Nome</th>" +
        "<th class='text-center'>Sigla</th>" +
        "<th class='text-center'>Pais</th>" +
        "<th class='text-center'>Opções</th>" +
        "</tr>" +
        "</thead>" +
        "<tbody>";

    requestItens.done(function (data) {

        var requestPais = $.ajax({
            url: urlPais,
            method: "GET",
            crossDomain: true
        });

        requestPais.done(function (pais) {
            var paisesPorto;

            data.forEach(porto => {
                paisesPorto = pais.filter(x=>{
                    return x.idPais == porto.idPaisOri;
                })
                table += '<tr value="' + porto.idPorto + '">' +
                    '<td class="text-center">' + porto.nmPorto + '</td>' +
                    '<td class="text-center">' + porto.nmSigla + '</td>' +
                    '<td value="' + porto.idPaisOri + '" class="text-center">' + paisesPorto[0].nmPais + '</td>' +
                    '<td class="text-center">' +
                    '<button type="button" rel="tooltip" class="btn btn-simple btn-round btn-icon btn-sm" id="btnEditar' + porto.idDi + '" data-toggle="modal" data-target="#exampleModal" onclick="editar_porto(' + porto.codDi + ',' + porto.quantidade + ',' + porto.produto + ',' + porto.empresa + ',' + porto.site + ')"><i class="fa fa-edit"></i></button>' +
                    '<button type="button" rel="tooltip" class="btn btn-simple btn-round btn-icon btn-sm" id="btnExcluir' + porto.idDi + '" data-toggle="modal" data-target="#exampleModal" onclick="deletar_porto(' + porto.codDi + ')"><i class="now-ui-icons ui-1_simple-remove"></i></button>' +
                    '</td>'
                '</tr>';
            })   

            //Close Table//
            table += '</tbody></table>';

            //Função que esconde div,instancia tabela e starta o Datatable//
            $('#div_tabela').fadeOut(500, function () {
                $(this).empty().hide().append(table).fadeIn("fast");

                $('#tblPorto').DataTable({
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

// // ===================================== FIM MONTA TABELA ==================================================

// // ===================================== DELETAR PORTO ==================================================

function deletar_porto(idPorto) {
    const swalWithBootstrapButtons = Swal.mixin({
        confirmButtonClass: 'btn btn-success',
        cancelButtonClass: 'btn btn-danger',
        buttonsStyling: false,
    })

    swalWithBootstrapButtons({
        title: 'Deseja Realmente Excluir?',
        text: "Você não poderá reverter esta ação!",
        type: 'warning',
        showCancelButton: true,
        confirmButtonText: 'Sim, excluir!',
        cancelButtonText: 'Não, cancelar!',
        reverseButtons: true

        //Não Esquecer de colocar a call
    }).then((result) => {

        $.ajax({
            type: "PUT",
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            data: JSON.stringify(data),
            url: urlDeletePorto,
            dataType: "json",
            crossDomain: true,
            success: function (sucesso) {
                montaTabelaPorto();
                $.unblockUI();
            },
            error: function (data) {
                $.unblockUI();
            }
        });

        if (result.value) {
            swalWithBootstrapButtons(
                'Delete!',
                'O registro foi Excluído',
                'success'
            )
        } else if (result.dismiss === Swal.DismissReason.cancel) {
            swalWithBootstrapButtons(
                'Cancel',
                'O registro não foi excluído',
                'error'
            )
        }
    })
}

// // ===================================== FIM DELETAR PORTO ==================================================
