
//=========================    URL'S ===================================
var urlBerco = null;

$.getJSON("assets/urls.json", function (data) {
    urlBerco = data.urlBerco;
});
//=========================   FIM URL'S ===================================

angular.module("yara")
    .controller("cadastroBercoController", function ($scope, $http) {
        $scope.$on('$viewContentLoaded', function () {
            montaTabelaBerco();
        });
    });

// ================================================ CADASTRAR BERÇO =================================================

function cadastrarBerco() {

    var nome = $('#txtNome').val();
    var sigla = $('#txtSigla').val();

    if (nome != '' || sigla != '') {

        $.blockUI({
            message: '<img style="max-width:100px;max-height:100px;" src="assets/img/loading.gif" />',
            css: {
                border: 'none',
                backgroundColor: 'transparent'
            }
        });

        var data = {
            nmBerco: nome,
            nmSigla: sigla
        }

        $.ajax({
            type: "POST",
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            url: urlBerco,
            data: JSON.stringify(data),
            success: function (sucesso) {
                swal("Cadastrado com sucesso!", "", "success")
                montaTabelaBerco();
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
// ================================================ FIM CADASTRAR BERÇO =======================================================

// // ===================================================== MONTA TABELA =======================================================
function montaTabelaBerco() {

    var requestItens = $.ajax({
        url: urlBerco,
        method: "GET",
        crossDomain: true
    });

    //Table Structure//
    var table = "<table id='tblBerco' class='table table-striped table-bordered' cellspacing='0' width='100%'>" +
        "<thead>" +
        "<tr>" +
        "<th class='text-center'>Nome</th>" +
        "<th class='text-center'>Sigla</th>" +
        "<th class='text-center'>Opções</th>" +
        "</tr>" +
        "</thead>" +
        "<tbody>";

    requestItens.done(function (data) {

        console.log(data);

        //Body//
        for (var i = 0; i < data.length; i++) {
            table += '<tr  value="' + data[i].idBerco + '">' +
                '<td class="text-center">' + data[i].nmBerco + '</td>' +
                '<td class="text-center">' + data[i].nmSigla + '</td>' +
                '<td class="text-center">'+
                '<button type="button" rel="tooltip" class="btn btn-simple btn-round btn-icon btn-sm" id="btnEditar' + data[i].idBerco + '" data-toggle="modal" data-target="#exampleModal" onclick="editar_berco(\'' + data[i].nmBerco + '\',\'' + data[i].nmSigla + '\',' + data[i].idBerco + ')"><i class="fa fa-edit"></i></button>' +
                '<button type="button" rel="tooltip" class="btn btn-simple btn-round btn-icon btn-sm" id="btnExcluir' + data[i].idBerco + '" data-toggle="modal" data-target="#exampleModal" onclick="deletar_berco(' + data[i].idBerco + ')"><i class="now-ui-icons ui-1_simple-remove"></i></button>' +
                '</td>'+
                '</tr>';
        }

        //Close Table//
        table += '</tbody></table>';

        //Função que esconde div,instancia tabela e starta o Datatable//
        $('#div_tabela').fadeOut(500, function () {
            $(this).empty().hide().append(table).fadeIn("fast");

            $('#tblBerco').DataTable({
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

// // ===================================== EDITAR EMPRESA =================================================

function editar_berco(nome,sigla,idBerco) {

    Swal({
        title: 'Editar Produtos',
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
            '<div class="col-md-6">' +
            '<label>Nome</label>' +
            '<div class="form-group">' +
            '<input type="text" class="form-control" id="nomeEdit" value="' + nome + '"  placeholder="Nome...">' +
            '</div>' +
            '</div>' +

            '<div class="col-md-6">' +
            '<label>Número NCM</label>' +
            '<div class="form-group">' +
            '<input type="text" id="siglaEdit" class="form-control" value="' + sigla + '" placeholder="NCM...">' +
            '</div>' +
            '</div>' +
            '</div>',
        allowOutsideClick: () => !Swal.isLoading()
    }).then((result) => {

        if (result.value) {

        var nomeEdit = $('#nomeEdit').val();
        var siglaEdit = $('#siglaEdit').val();

        var data = {
            idBerco: idBerco,
            nmBerco: nomeEdit,
            nmSigla: siglaEdit,
        }

        $.ajax({
            type: "PUT",
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            data: JSON.stringify(data),
            url: urlBerco + "/" + idBerco,
            crossDomain: true,
            success: function (sucesso) {
                Swal.fire(
                    'Editado!',
                    'Embarcação editado com sucesso!',
                    'success'
                );
                montaTabelaBerco();
                $.unblockUI();
            },
            error: function (data) {
                Swal.fire(
                    'Erro!',
                    'Um erro ocorreu por favor tente novamente!',
                    'error'
                );
                $.unblockUI();
            }
        });
    }
    })
}

// // ===================================== FIM EDITAR EMPRESA ==================================================

// // ===================================== DELETAR BERÇO ==================================================

function deletar_berco(idBerco) {
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
            url: urlBerco+"/"+idBerco,
            crossDomain: true,
            success: function (sucesso) {
                montaTabelaBerco();
            },
            error: function (data) {
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

// // ===================================== FIM DELETAR BERÇO ==================================================
