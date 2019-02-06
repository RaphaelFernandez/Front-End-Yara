
//=========================    URL'S ===================================
var url_cadastrar_plano = null;
var urlPutRegistroPlano = null;
var urlGetDi = null;
var urlGetNavio = null;
var urlGetPortoOrigem = null;
var urlGetTerminalOrigem = null;
var urlGetBercoDestino = null;
var urlDeleteRegistro = null;
var urlTabelaPlano = null;
var urlDeleteRegistroPlano = null;

$.getJSON("assets/urls.json", function (data) {
    url_cadastrar_plano = data.url_cadastrar_plano;
    urlGetDi = data.urlGetDi;
    urlGetNavio = data.urlGetNavio;
    urlGetPortoOrigem = data.urlGetPortoOrigem;
    urlGetTerminalOrigem = data.urlGetTerminalOrigem;
    urlGetBercoDestino = data.urlGetBercoDestino;
    urlTabelaPlano = data.urlTabela;
    urlPutRegistroPlano = data.urlPutRegistro;
    urlDeleteRegistroPlano = data.urlDeleteRegistro;
});
//=========================   FIM URL'S ===================================
angular.module("yara")
    .controller("planoDescargaController", function ($scope, $http) {
        $scope.$on('$viewContentLoaded', function () {

            

            montaTabela('Todos');
            selectDi();
            selectNavio();
            selectBercoDestino();
            selectTerminalOrigem();
            selectPortoOrigem();
        });
    });


// ==========================================  SELECIONAR DI ==========================================
function selectDi() {

    $('#cmbDi').find("option").remove();

    var request = $.ajax({
        url: urlGetDi,
        method: "GET"
    });

    request.done(function (data) {
        $('#cmbDi').append("<option value='0'>Selecione</option>");

        for (var i = 0; i < data.length; i++) {
            $('#cmbDi').append("<option value='" + data[i].idDi + "'>" + data[i].descDi + "</option>");
        }
    })
}
// ==========================================  FIM SELECIONAR DI ==========================================

// ==========================================  SELECIONAR NAVIO ==========================================
function selectNavio() {

    $('#cmbNavio').find("option").remove();
    $('#cmbNavioFiltro').find("option").remove();


    var request = $.ajax({
        url: urlGetNavio,
        method: "GET",
        crossDomain:true
    });

    request.done(function (data) {
        $('#cmbNavio').append("<option value='0'>Selecione</option>");
        $('#cmbNavioFiltro').append("<option value='0'>Todos</option>");

        for (var i = 0; i < data.length; i++) {
            $('#cmbNavio').append("<option value='" + data[i].idNavio + "'>" + data[i].descNavio + "</option>");
            $('#cmbNavioFiltro').append("<option value='" + data[i].idNavio + "'>" + data[i].descNavio + "</option>");
        }
    }
    )

}
// ==========================================  FIM SELECIONAR NAVIO ==========================================

// ==========================================  SELECIONAR BERÇO DESTINO ==========================================
function selectBercoDestino() {

    $('#cmbBercoDestino').find("option").remove();

    var request = $.ajax({
        url: urlGetNavio,
        method: "GET"
    });

    request.done(function (data) {
        $('#cmbBercoDestino').append("<option value='0'>Selecione</option>");

        for (var i = 0; i < data.length; i++) {
            $('#cmbBercoDestino').append("<option value='" + data[i].idBercoDestino + "'>" + data[i].descBercoDestino + "</option>");
        }
    }
    )

}
// ==========================================  FIM SELECIONAR BERÇO DESTINO ==========================================

// ==========================================  SELECIONAR TERMINAL ORIGEM ==========================================
function selectTerminalOrigem() {

    $('#cmbTerminalOrigem').find("option").remove();

    var request = $.ajax({
        url: urlGetTerminalOrigem,
        method: "GET"
    });

    request.done(function (data) {
        $('#cmbTerminalOrigem').append("<option value='0'>Selecione</option>");

        for (var i = 0; i < data.length; i++) {
            $('#cmbTerminalOrigem').append("<option value='" + data[i].idTerminalOrigem + "'>" + data[i].descTerminalOrigem + "</option>");
        }
    }
    )

}
// ==========================================  FIM TERMINAL ORIGEM ==========================================

// ==========================================  SELECIONAR PORTO DE ORIGEM ==========================================
function selectPortoOrigem() {

    $('#cmbPortoOrigem').find("option").remove();
    var request = $.ajax({
        url: urlGetPortoOrigem,
        method: "GET"
    });

    request.done(function (data) {
        $('#cmbPortoOrigem').append("<option value='0'>Selecione</option>");

        for (var i = 0; i < data.length; i++) {
            $('#cmbPortoOrigem').append("<option value='" + data[i].idPortoOrigem + "'>" + data[i].descPortoOrigem + "</option>");
        }
    })
}
// ==========================================  FIM SELECIONAR PORTO DE ORIGEM ==========================================

// // ===================================== MONTA TABELA ================================

function montaTabela(){ 
    //Table Structure//
    var table="<table id='tblPlanoDescarga' class='table table-striped table-bordered' cellspacing='0' width='100%'>" +
    "<thead>" +
        "<tr>" +
            "<th class='text-center'>Navio</th>" +
            "<th class='text-center'>Porto Origem</th>" +
            "<th class='text-center'>Terminal Origem</th>" +
            "<th class='text-center'>Medidor</th>" +
            "<th class='text-center'>Ordenação</th>" +
            "<th class='text-center'>Berço de Destino</th>" +
            "<th class='text-center'>Opções</th>" +
        "</tr>" +
    "</thead>" +
    "<tbody>";

    var requestItens = $.ajax({
        url: urlTabela,
        method: "GET",
        crossDomain: true
    });

    requestItens.done(function (data) {

        //Body//
        for (var i = 0; i < data.length; i++) {
            table += '<tr  value="' + data[i].idDi + '">' +
            '<td >' + data[i].codDi + '</td>' +
            '<td >' + data[i].navio + '</td>' +
            '<td >' + data[i].porto_origem + '</td>' +
            '<td >' + data[i].terminal_origem + '</td>' +
            '<td >' + data[i].medidor + '</td>' +
            '<td >' + data[i].ordenacao + '</td>' +
            '<td >' + data[i].berco_destino + '</td>' +
            '<td><button type="button" rel="tooltip" class="btn btn-simple btn-round btn-icon btn-sm" id="btnEditar' + data[i].idDi + '" data-toggle="modal" data-target="#exampleModal" onclick="editar_di(' + data[i].codDi + ',' + data[i].porto_origem + ',' + data[i].terminal_origem + ',' + data[i].medidor + ',' + data[i].ordenacao + ',' + data[i].berco_destino + ')"><i class="fa fa-edit"></i></button>' +
            '<button type="button" rel="tooltip" class="btn btn-simple btn-round btn-icon btn-sm" id="btnExcluir' + data[i].idDi + '" data-toggle="modal" data-target="#exampleModal" onclick="deletar_di(' + data[i].idPlano + ')"><i class="now-ui-icons ui-1_simple-remove"></i></button>' +
            '</td> ' +
            '</tr>';
        }

        //Close Table//
        table+='</tbody></table>';

        //Função que esconde div,instancia tabela e starta o Datatable//
        $('#div_tabela').fadeOut(500, function() {
            $(this).empty().hide().append(table).fadeIn("fast");
            $('#datatables').DataTable({
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


// ================================================ CADASTRAR PLANO =================================================
function cadastrarPlano() {

    $.blockUI({
        message: '<img style="max-width:100px;max-height:100px;" src="assets/img/loading.gif" />',
        css: {
            border: 'none',
            backgroundColor: 'transparent'
        }
    });

    var di = $('#cmbDi').val();
    var navio = $('#cmbNavio').val();
    var porto_origem = $('#cmbPortoOrigem').val();
    var terminal_origem = $('#cmbTerminalOrigem').val();
    var medidor = $('#cmbMedidor').val();
    var ordenacao = $('#txtOrdenacao').val();
    var berco_destino = $('#cmbBercoDestino').val();

    if (di == 'Selecione' || navio == 'Selecione' || porto_origem == 'Selecione' || terminal_origem == 'Selecione' || medidor == 'Selecione' || ordenacao == '' || berco_destino == 'Selecione') {
        swal("Preencha todos os campos", "", "warning")
        $.unblockUI();
    } else {
        var data = {
            Di: di,
            Navio: navio,
            PortoOrigem: porto_origem,
            TerminalOrigem: terminal_origem,
            Medidor: medidor,
            Ordenacao: ordenacao,
            BercoDestino: berco_destino
        }

        $.ajax({
            type: "POST",
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            data: JSON.stringify(data),
            url: url_cadastrar_plano,
            dataType: "json",
            crossDomain: true,
            success: function (sucesso) {
                swal("Cadastro salvo com sucesso!", "", "success");
                montaTabela();
                $.unblockUI();
            },
            error: function (data) {
                swal("Cadastro não realizado! " + data.responseText, "", "error");
                $.unblockUI();
            }
        });
    }
}




// ================================================ FIM CADASTRO PLANO=======================================================

// ================================================ EDITAR PLANO =======================================================

function editar_plano(di, navio, porto_origem, terminal_origem, medidor, ordenacao, berco_destino) {

    Swal({
        title: 'Editar Plano',
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
            '<div class="form-group col-sm-2">' +
            '<label class="col-form-label">DI</label>' +
            '<input type="text" value="' + di + '" class="form-control" >' +
            '</div>' +
            '<div class="form-group col-sm-2">' +
            '<label class="col-form-label">Navio</label>' +
            '<input type="text" value="' + navio + '" class="form-control" >' +
            '</div>' +
            '<div class="form-group col-sm-4">' +
            '<label class="col-form-label">Porto de Origem</label>' +
            '<input type="text" value="' + porto_origem + '" class="form-control" >' +
            '</div>' +
            '<div class="form-group col-sm-4">' +
            '<label class="col-form-label">Terminal de Origem</label>' +
            '<input type="text" value="' + terminal_origem + '" class="form-control" >' +
            '</div>' +
            '</div>' +
            '<div class="justify-content-center row">' +
            '<div class="form-group col-sm-4">' +
            '<label class="col-form-label">Berço de Destino</label>' +
            '<input type="text" value="' + berco_destino + '" class="form-control" >' +
            '</div>' +
            '<div class="form-group col-sm-4">' +
            '<label class="col-form-label">Medidor</label>' +
            '<input type="text" value="' + medidor + '" class="form-control">' +
            '</div>' +
            '<div class="form-group col-sm-4">' +
            '<label class="col-form-label">Ordenação</label>' +
            '<input type="number" value="' + ordenacao + '" class="form-control">' +
            '</div>' +
            '</div>' +
            '</div>' +
            '</div>',
        preConfirm: () => {
            return fetch(urlPutRegistro)
                .then(response => {
                    if (!response.ok) {
                        throw new Error(response.statusText)
                    }
                    return response.json()
                })
                .catch(error => {
                    Swal.showValidationMessage(
                        `Request failed: ${error}`
                    )
                })
        },
        allowOutsideClick: () => !Swal.isLoading()
    }).then((result) => {
        if (result.value) {
            var resultado = "";
            for (i in result.value) {
                console.log(result[i]);
                resultado += "<p>idLocalMedicao" + result.value[i].idLocalMedicao + "descLocalMedicao " + result.value[i].descLocalMedicao + "</p>";
            }
            console.log(resultado);
            swal({
                html: resultado
            })
        }
    })
}

// ================================================ FIM EDITAR PLANO =======================================================

// ================================================ DELETAR PLANO =======================================================

function deletar_plano(di) {
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
        //      urlDeleteRegistro += di;
        // $.ajax({
        //     type: "PUT",
        //     headers: {
        //         'Accept': 'application/json',
        //         'Content-Type': 'application/json'
        //     },
        //     data:JSON.stringify(data),
        //     url: urlDeleteRegistro,
        //     dataType: "json",
        //     crossDomain: true,
        //     success: function (sucesso){
        //         montaTabela();      
        //         $.unblockUI();                                                           
        //     },
        //     error: function(data){     
        //         $.unblockUI();                     
        //     }
        // });
    }).then((result) => {
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

// ================================================ FIM DELETAR PLANO =======================================================
