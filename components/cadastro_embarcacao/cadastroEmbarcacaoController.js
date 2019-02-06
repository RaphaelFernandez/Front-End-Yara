
//=========================    URL'S ===================================

var urlPais = null;
var urlEmbarcacao = null;

$.getJSON("assets/urls.json", function (data) {

    urlPais = data.urlPais;
    urlEmbarcacao = data.urlEmbarcacao;

});
//=========================   FIM URL'S ===================================

angular.module("yara")
    .controller("cadastroEmbarcacaoController", function ($scope, $http) {
        $scope.$on('$viewContentLoaded', function () {
            selectPaisEmbarcacao();
            montaTabelaEmbarcacao();
        });
    });

// ==========================================  SELECIONAR PAIS ==========================================
function selectPaisEmbarcacao() {

    $('#cmbPaisEmbarcacao').find("option").remove();
    var request = $.ajax({
        url: urlPais,
        method: "GET"
    });

    request.done(function (data) {

        $('#cmbPaisEmbarcacao').append("<option value='0'>Selecione</option>");

        for (var i = 0; i < data.length; i++) {
            $('#cmbPaisEmbarcacao').append("<option value='" + data[i].idPais + "'>" + data[i].nmPais + "</option>");
        }
    })
}
// ==========================================  FIM SELECIONAR PAIS ==========================================

// ================================================ CADASTRAR NAVIO =================================================

function cadastrarNavio() {

    var nome = $('#txtNome').val();
    var nome_abreviado = $('#txtAbreviado').val();
    var pais = $('#cmbPaisEmbarcacao').val();
    var tipo = $('#cmbTipo').val();
    var imo = $('#txtIMO').val();


    if (nome != '' || nome_abreviado != '' || imo != '') {

        $.blockUI({
            message: '<img style="max-width:100px;max-height:100px;" src="assets/img/loading.gif" />',
            css: {
                border: 'none',
                backgroundColor: 'transparent'
            }
        });

        var data = {
            numImo: imo,
            nmAbreviado: nome_abreviado,
            nmEmbarcacao: nome,
            tpEmbarcacao: tipo,
            idPais: pais
        }

        $.ajax({
            type: "POST",
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            url: urlEmbarcacao,
            data: JSON.stringify(data),
            success: function (sucesso) {
                swal("Cadastrado com sucesso!", "", "success");
                montaTabelaEmbarcacao();
                $.unblockUI();
            },
            error: function (data) {
                $.unblockUI();
            }
        });
        $(document).ajaxStop($.unblockUI);
    } else {
        swal("Preencha todos os campos", "", "warning");
        montaTabelaEmbarcacao();
    }
}
// ================================================ FIM CADASTRAR NAVIO =======================================================

// // ===================================================== MONTA TABELA =======================================================
function montaTabelaEmbarcacao() {

    var requestItens = $.ajax({
        url: urlEmbarcacao,
        method: "GET",
        crossDomain: true
    });

    //Table Structure//
    var table = "<table id='tblEmbarcacao' class='table table-striped table-bordered' cellspacing='0' width='100%'>" +
        "<thead>" +
        "<tr>" +
        "<th class='text-center'>Nome</th>" +
        "<th class='text-center'>Nome Abreviado</th>" +
        "<th class='text-center'>Tipo</th>" +
        "<th class='text-center'>Pais</th>" +
        "<th class='text-center'>IMO</th>" +
        "<th class='text-center'>Opções</th>" +
        "</tr>" +
        "</thead>" +
        "<tbody>";

    requestItens.done(function (data) {

        //Body//
        for (var i = 0; i < data.length; i++) {
            table += '<tr  value="' + data[i].idEmbarcacao + '">' +
                '<td class="text-center">' + data[i].nmEmbarcacao + '</td>' +
                '<td class="text-center">' + data[i].nmAbreviado + '</td>' +
                '<td class="text-center">' + data[i].tpEmbarcacao + '</td>' +
                '<td class="text-center">' + data[i].idPais + '</td>' +
                '<td class="text-center">' + data[i].numImo + '</td>' +
                '<td class="text-center">' +
                '<button type="button" rel="tooltip" class="btn btn-simple btn-round btn-icon btn-sm" id="btnEditar' + data[i].idEmbarcacao + '" data-toggle="modal" data-target="#exampleModal" onclick="editar_embarcacao(' + data[i].tpEmbarcacao + ',\'' + data[i].nmEmbarcacao + '\',\'' + data[i].nmAbreviado + '\',\'' + data[i].numImo + '\',' + data[i].idPais +","+ data[i].idEmbarcacao + ')"><i class="fa fa-edit"></i></button>' +
                '<button type="button" rel="tooltip" class="btn btn-simple btn-round btn-icon btn-sm" id="btnExcluir' + data[i].idEmbarcacao + '" data-toggle="modal" data-target="#exampleModal" onclick="deletar_embarcacao(' + data[i].idEmbarcacao + ')"><i class="now-ui-icons ui-1_simple-remove"></i></button>' +
                '</td>' +
                '</tr>';
        }

        //Close Table//
        table += '</tbody></table>';

        //Função que esconde div,instancia tabela e starta o Datatable//
        $('#div_tabela').fadeOut(500, function () {
            $(this).empty().hide().append(table).fadeIn("fast");

            $('#tblEmbarcacao').DataTable({
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

// // ===================================== EDITAR EMBARCAÇÃO =================================================

function editar_embarcacao(tipo, nome, nome_abreviado, imo, pais, id) {

    Swal({
        title: 'Editar Embarcações',
        showCancelButton: true,
        confirmButtonClass: "justify-content-center btn btn-success btn-round ",
        confirmButtonText: 'Confirmar',
        cancelButtonClass: "justify-content-center btn btn-danger btn-round",
        cancelButtonText: 'Cancelar',
        showLoaderOnConfirm: true,
        buttonsStyling: false,
        width: "85%",
        html:
            '<div class="row">' +
            '<div class="col-md-12">' +
            '<div class="justify-content-center row">' +
            '<div class="form-group col-sm-4">' +
            '<label class="col-form-label">Nome</label>' +
            '<input type="text" value="' + nome + '" class="form-control" >' +
            '</div>' +
            '<div class="form-group col-sm-4">' +
            '<label class="col-form-label">Nome Abreviado</label>' +
            '<input type="text" value="' + nome_abreviado + '" class="form-control" >' +
            '</div>' +
            '<div class="form-group col-sm-4">' +
            '<label class="col-form-label">Número IMO</label>' +
            '<input type="text" value="' + imo + '" class="form-control" >' +
            '</div>' +
            '</div>' +
            '<div class="justify-content-center row">' +
            '<div class="form-group col-sm-6">' +
            '<label class="col-form-label">Tipo</label>' +
            '<select id="cmbTipo" type="text" class="form-control">' +
            '<option value="Todos">Navio</option>' +
            '<option value="MQ1">Barcaça</option>' +
            '</select>' +
            '</div>' +
            '<div class="form-group col-sm-6">' +
            '<label class="col-form-label">Pais</label>' +
            '<select id="cmbPaisEdit" type="text" class="form-control">' +
            '<option>Selecione</option>' +
            '</select>' +
            '</div>' +
            '</div>' +
            '</div>',
        onOpen: () => {

            $('#cmbPaisEdit').find("option").remove();
            var request = $.ajax({
                url: urlPais,
                method: "GET"
            });

            request.done(function (data) {

                $('#cmbPaisEdit').append("<option value='0'>Selecione</option>");

                for (var i = 0; i < data.length; i++) {
                    $('#cmbPaisEdit').append("<option value='" + data[i].idPais + "'>" + data[i].nmPais + "</option>");
                }

                $('#cmbPaisEdit').val(pais);
            })
        }
    }).then((result) => {
        if (result.value) {
            $.blockUI({
                message: '<img style="max-width:100px;max-height:100px;" src="assets/img/loading.gif" />',
                css: {
                    border: 'none',
                    backgroundColor: 'transparent'
                }
            });
            var data = {
                idEmbarcacao: id,
                numImo: imo,
                nmAbreviado: nome_abreviado,
                nmEmbarcacao: nome,
                tpEmbarcacao: tipo,
                idPais: pais
            };
            var request = $.ajax({
                url: urlEmbarcacao + "/" + id,
                method: "PUT",
                crossDomain: true,
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                },
                data: JSON.stringify(data),
            });

            request.done(function (data) {
                console.log(data);
                Swal.fire(
                    'Editado!',
                    'Embarcação editado com sucesso!',
                    'success'
                );
                montaTabelaCadastroUsuario();
                $.unblockUI();
            })
            request.fail(function (data) {
                Swal.fire(
                    'Erro!',
                    'Um erro ocorreu por favor tente novamente!',
                    'error'
                );
                $.unblockUI();
            })

        }
    })
}

// // ===================================== FIM EDITAR EMBARCAÇÃO ==================================================

function deletar_embarcacao(idEmbarcacao) {
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
            type: "DELETE",
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            url: urlEmbarcacao + "/" + idEmbarcacao,
            crossDomain: true,
            success: function (sucesso) {
                montaTabelaEmbarcacao();
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