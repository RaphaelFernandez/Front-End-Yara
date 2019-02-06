
//=========================    URL'S ===================================

var urlProduto = null;
var urlTipoProduto = null;

$.getJSON("assets/urls.json", function (data) {
    urlProduto = data.urlProduto;
    urlTipoProduto = data.urlTipoProduto;
});
//=========================   FIM URL'S ===================================

angular.module("yara")
    .controller("cadastroProdutosController", function ($scope, $http) {
        $scope.$on('$viewContentLoaded', function () {
            montaTabelaProdutos();
            selectTipo();
        });
    });

// ================================================ CADASTRAR NAVIO =================================================

function cadastrarProdutos() {

    var nome = $('#txtProduto').val();
    var tipo = $('#cmbTipoProduto').val();
    var ncm = $('#txtNCM').val();
    var sap = $('#txtSAP').val();

    if (nome != '' || ncm != '' || sap != '') {

        $.blockUI({
            message: '<img style="max-width:100px;max-height:100px;" src="assets/img/loading.gif" />',
            css: {
                border: 'none',
                backgroundColor: 'transparent'
            }
        });

        var data = {
            idCargaTipo: tipo,
            nmCarga: nome,
            numNcm: ncm,
            codSap: sap
        }

        $.ajax({
            type: "POST",
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            url: urlProduto,
            dataType: "json",
            data: JSON.stringify(data),
            success: function (sucesso) {
                swal("Cadastrado com sucesso!", "", "success");
                montaTabelaProdutos();
                $.unblockUI();
            },
            error: function (data) {
                $.unblockUI();
            }
        });
        $(document).ajaxStop($.unblockUI);
    } else {
        swal("Preencha todos os campos", "", "warning")
    }
}
// ================================================ FIM CADASTRAR NAVIO =======================================================

// ==========================================  SELECIONAR TIPO ==========================================
function selectTipo() {

    $('#cmbTipoProduto').find("option").remove();
    var request = $.ajax({
        url: urlTipoProduto,
        method: "GET"
    });

    request.done(function (data) {
        $('#cmbTipoProduto').append("<option value='0'>Selecione</option>");

        for (var i = 0; i < data.length; i++) {
            $('#cmbTipoProduto').append("<option value='" + data[i].idCargaTipo + "'>" + data[i].nmCargaTipo + "</option>");
        }
    })
}
// ==========================================  FIM SELECIONAR TIPO ==========================================

// // ===================================================== MONTA TABELA =======================================================
function montaTabelaProdutos() {

    var requestItens = $.ajax({
        url: urlProduto,
        method: "GET",
        crossDomain: true
    });

    //Table Structure//
    var table = "<table id='tblProdutos' class='table table-striped table-bordered' cellspacing='0' width='100%'>" +
        "<thead>" +
        "<tr>" +
        "<th class='text-center'>Nome</th>" +
        "<th class='text-center'>Tipo de Produto</th>" +
        "<th class='text-center'>Número NCM</th>" +
        "<th class='text-center'>Código SAP</th>" +
        "<th class='text-center'>Opções</th>" +
        "</tr>" +
        "</thead>" +
        "<tbody>";

    requestItens.done(function (data) {

        var requestTipo = $.ajax({
            url: urlTipoProduto,
            method: "GET",
            crossDomain: true
        });

        requestTipo.done(function (tipo) {
            var tipoProduto;

            data.forEach(produto => {
                tipoProduto = tipo.filter(x=>{
                    return x.idCargaTipo == produto.idCargaTipo;
                })

            //Body//
                table += '<tr  value="' + produto.idCarga + '">' +
                    '<td class="text-center">' + produto.nmCarga + '</td>' +
                    '<td class="text-center" value='+produto.idCargaTipo+'>' + tipoProduto[0].nmCargaTipo + '</td>' +
                    '<td class="text-center">' + produto.numNcm + '</td>' +
                    '<td class="text-center">' + produto.codSap + '</td>' +
                    '<td class="text-center">' +
                    '<button type="button" rel="tooltip" class="btn btn-simple btn-round btn-icon btn-sm" id="btnEditar' + produto.idCarga + '" data-toggle="modal" data-target="#exampleModal" onclick="editar_produto(' +produto.idCargaTipo + ',\'' + produto.nmCarga + '\',\'' + produto.numNcm + '\',\'' + produto.codSap + '\',' + produto.idCarga + ',)"><i class="fa fa-edit"></i></button>' +
                    '<button type="button" rel="tooltip" class="btn btn-simple btn-round btn-icon btn-sm" id="btnExcluir' + produto.idCarga + '" data-toggle="modal" data-target="#exampleModal" onclick="deletar_produto(' + produto.idCarga + ')"><i class="now-ui-icons ui-1_simple-remove"></i></button>' +
                    '</td>' +
                    '</tr>';

        })   

            //Close Table//
            table += '</tbody></table>';

            //Função que esconde div,instancia tabela e starta o Datatable//
            $('#div_tabela').fadeOut(500, function () {
                $(this).empty().hide().append(table).fadeIn("fast");

                $('#tblProdutos').DataTable({
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

// // ===================================== EDITAR PRODUTOS =================================================

function editar_produto(tipo, nome, ncm, cod_sap, id) {

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
            '<input type="text" class="form-control" id="nomeEdit" value="' + nome + '" name="info_porta_enxerto" placeholder="Nome...">' +
            '</div>' +
            '</div>' +

            '<div class="col-md-6">' +
            '<label class="col-form-label">Tipo</label>' +
            '<select id="cmbTipoEdit" type="text" class="form-control">' +
            '<option value="Todos">A Granel</option>' +
            '<option value="MQ1">Liquido</option>' +
            '</select>' +
            '</div>' +

            '<div class="col-md-6">' +
            '<label>Número NCM</label>' +
            '<div class="form-group">' +
            '<input type="text" id="ncmEdit" class="form-control" value="' + ncm + '" placeholder="NCM...">' +
            '</div>' +
            '</div>' +

            '<div class="col-md-6">' +
            '<label>Código SAP</label>' +
            '<div class="form-group">' +
            '<input type="text" id="sapEdit" class="form-control" value="' + cod_sap + '"  placeholder="SAP...">' +
            '</div>' +
            '</div>' +
            '</div>',
            onOpen: () => {
                $('#cmbTipoEdit').find("option").remove();
                var request = $.ajax({
                    url: urlTipoProduto,
                    method: "GET"
                });
    
                request.done(function (data) {
    
                    $('#cmbTipoEdit').append("<option value='0'>Selecione</option>");
    
                    for (var i = 0; i < data.length; i++) {
                        $('#cmbTipoEdit').append("<option value='" + data[i].idCargaTipo + "'>" + data[i].nmCargaTipo + "</option>");
                    }
    
                    $('#cmbTipoEdit').val(tipo);
                })
            }
    }).then((result) => {

        var nomeEdit = $('#nomeEdit').val();
        var tipoEdit = $('#cmbTipoEdit').val();
        var sapEdit = $('#sapEdit').val();
        var ncmEdit = $('#ncmEdit').val();

        var data = {
            idCarga: id,
            idCargaTipo: tipoEdit,
            nmCarga: nomeEdit,
            numNcm: ncmEdit,
            codSap:sapEdit
        }

        $.ajax({
            type: "PUT",
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            data: JSON.stringify(data),
            url: urlProduto + "/" + id,
            crossDomain: true,
            success: function (sucesso) {
                montaTabelaProdutos();
                $.unblockUI();
            },
            error: function (data) {
                $.unblockUI();
            }
        });
    })
}

// // ===================================== FIM EDITAR PRODUTOS ==================================================

function deletar_produto(idCarga) {
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
                url: urlProduto + "/" + idCarga,
                crossDomain: true,
                success: function (sucesso) {
                    montaTabelaProdutos();
                    $.unblockUI();
                },
                error: function (data) {
                    $.unblockUI();
                }
            });
            if (result.value) {
                swalWithBootstrapButtons(
                    'Deletado!',
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