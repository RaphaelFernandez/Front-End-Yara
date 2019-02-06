
//=========================    URL'S ===================================
var urlCadastrarEmpresa = null;
var urlCadastrarEmpresaSite = null;
var urlTabelaEmpresaSite = null;
var urlUpdateEmpresa = null;
var urlUpdateEmpresaSite = null;
var urlPutEmpresaSite = null;
var urlDeleteEmpresaSite = null;

$.getJSON("assets/urls.json", function (data) {
    urlCadastrarEmpresa = data.urlCadastrarEmpresa;
    urlCadastrarEmpresaSite = data.urlCadastrarEmpresaSite;
    urlTabelaEmpresaSite = data.urlTabelaEmpresaSite;
    urlUpdateEmpresa = data.urlUpdateEmpresa;
    urlUpdateEmpresaSite = data.urlUpdateEmpresaSite;
    urlPutEmpresaSite = data.urlPutEmpresaSite;
    urlDeleteEmpresaSite = data.urlDeleteEmpresaSite;
});
//=========================   FIM URL'S ===================================

angular.module("yara")
    .controller("cadastroEmpresasController", function ($scope, $http) {
        $scope.$on('$viewContentLoaded', function () {
            montaFormularioSite("bola8","McDonalds","MC");
        });
    });

// ================================================ CADASTRAR EMPRESA =======================================

function cadastrarEmpresa() {

    var nome = $('#cadastroEmpresaNome').val();
    var nomeFantasia = $('#cadastroEmpresaAbreviado').val();

    if (nome != '' && nomeFantasia !=''){

        $.blockUI({
            message: '<img style="max-width:100px;max-height:100px;" src="assets/img/loading.gif" />',
            css: {
                border: 'none',
                backgroundColor: 'transparent'
            }
        });

        var data = {
            tipoNavio: nome,
            tipoNavio: tipo,
            txtNome: nomeFantasia,
            txtNome: cnpj,
            txtNome: inscricao,
            txtDescricao: descricao
        }

        var requestItens = $.ajax({
            url: urlCadastrarEmpresa,
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            method: "PUT",
            crossDomain: true,
            dataType: "json",
            data: JSON.stringify(data),
        });
        
        requestItens.done(function (data){
            nome.val("");
            nomeFantasia.val("");
            Swal.fire({
                type: 'success',
                title: 'Empresa cadastrada com sucesso!',
                timer:1500
            });
            $.unblockUI();
        });

        requestItens.fail(function (data){
            Swal.fire({
                type: 'error',
                title: 'Houve algum erro por favor tente novamente!',
                timer:1500
            });
            $.unblockUI();
        });
    } else {
        Swal.fire("Preencha todos os campos", "", "warning")
    }
}
// ================================================ FIM CADASTRAR EMPRESA ===================================


// ===================================================== MONTA FORMULARIO EMPRESA SITE ======================
function montaFormularioSite(idEmpresa,nomeEmpresa,nomeAbreviado) {


    var form='<div class="col-md-12">' +
        '<div class="card card-stats">' +
            '<div class="card-body">' +
            
                '<h5 style="display: inline-block;" class="card-title">Cadastro de Site ('+nomeEmpresa+')</h5>' +
                '<button onclick="montaEditarEmpresa(\''+idEmpresa+'\',\' '+nomeEmpresa+'\',\''+nomeAbreviado+'\')" class="justify-content-center btn  btn-info">Editar Empresa</button>' +

                '<div class="justify-content-center row">' +
                    '<div class="form-group col-sm-4">' +
                        '<label class="col-form-label">Nome</label>' +
                        '<input id="cadastroSiteNome" type="text" class="form-control" placeholder="Nome...">' +
                    '</div>' +
                    '<div class="form-group col-sm-4">' +
                        '<label class="col-form-label">Nome do Contato</label>' +
                        '<input id="cadastroSiteContato" type="text" class="form-control" placeholder="Nome do Contato...">' +
                    '</div>' +
                    '<div class="form-group col-sm-4">' +
                        '<label class="col-form-label">Email</label>' +
                        '<input id="cadastroSiteEmail" type="text" class="form-control" placeholder="Email">' +
                    '</div>' +
                '</div>' +

                '<div class="justify-content-center row">' +
                    '<div class="form-group col-sm-4">' +
                        '<label class="col-form-label">País</label>' +
                        '<input id="cadastroSitePais" type="text" class="form-control" placeholder="País...">' +
                    '</div>' +
                    '<div class="form-group col-sm-4">' +
                        '<label class="col-form-label">Cidade</label>' +
                        '<input id="cadastroSiteCidade" type="text" class="form-control" placeholder="Cidade...">' +
                    '</div>' +
                    '<div class="form-group col-sm-4">' +
                        '<label class="col-form-label">CEP</label>' +
                        '<input id="cadastroSiteCEP" type="text" class="form-control" placeholder="CEP">' +
                    '</div>' +
                '</div>' +

                '<div class="justify-content-center row">' +
                    '<div class="form-group col-sm-4">' +
                        '<label class="col-form-label">Nome da Rua</label>' +
                        '<input id="cadastroSiteNomeRua" type="text" class="form-control" placeholder="Nome da Rua">' +
                    '</div>' +
                    '<div class="form-group col-sm-4">' +
                        '<label class="col-form-label">Número da Rua</label>' +
                        '<input id="cadastroSiteNumeroRua" type="text" class="form-control" placeholder="Número da Rua">' +
                    '</div>' +
                    '<div class="form-group col-sm-4">' +
                        '<label class="col-form-label">Número de Telefone</label>' +
                        '<input id="cadastroSiteNumeroTelefone" type="text" class="form-control" placeholder="Número de Telefone...">' +
                   ' </div>' +
                '</div>' +
                '<div class="justify-content-center row">' +
                    '<button onclick="cadastraEmpresaSite('+idEmpresa+')" class="justify-content-center btn btn-success">Cadastrar</button>' +
                '</div>' +
            '</div>' +
        '</div>' +
    '</div>';
        //Função que esconde div,instancia tabela e starta o Datatable//
        $('#formularioCadastraSite').fadeOut(500, function () {
            $(this).empty().hide().append(form).fadeIn("fast");            
        });
}

// ===================================== FIM MONTA FORMULARIO EMPRESA SITE ==================================


// ===================================================== MONTA TABELA =======================================
function montaTabelaSite() {

    var requestItens = $.ajax({
        url: urlTabelaSite,
        method: "GET",
        crossDomain: true
    });

    //Table Structure//
    var table = "<table id='tblEmpresa' class='table table-striped table-bordered' cellspacing='0' width='100%'>" +
        "<thead>" +
        "<tr>" +
        "<th class='text-center'>Nome</th>" +
        "<th class='text-center'>Nome Fantasia</th>" +
        "<th class='text-center'>CNPJ</th>" +
        "<th class='text-center'>Inscrição Estadual</th>" +
        "<th class='text-center'>Tipo de Serviço</th>" +
        "<th class='text-center'>Opções</th>"+
        "</tr>" +
        "</thead>" +
        "<tbody>";

    requestItens.done(function (data) {

        //Body//
        for (var i = 0; i < data.length; i++) {
            table += '<tr  value="' + data[i].id + '">' +
                '<td >' + data[i].nomeNavio + '</td>' +
                '<td >' + data[i].numDescarga + '</td>' +
                '<td >' + data[i].numDescarga + '</td>' +
                '<td >' + data[i].numDescarga + '</td>' +
                '<td >' + data[i].numDescarga + '</td>' +
                '<button type="button" rel="tooltip" class="btn btn-simple btn-round btn-icon btn-sm" id="btnEditar' + data[i].idDi + '" data-toggle="modal" data-target="#exampleModal" onclick="editar_empresa(' + data[i].codDi + ',' + data[i].quantidade + ',' + data[i].produto + ',' + data[i].empresa + ',' + data[i].site + ')"><i class="fa fa-edit"></i></button>' +
                '<button type="button" rel="tooltip" class="btn btn-simple btn-round btn-icon btn-sm" id="btnExcluir' + data[i].idDi + '" data-toggle="modal" data-target="#exampleModal" onclick="deletar_empresa(' + data[i].codDi + ')"><i class="now-ui-icons ui-1_simple-remove"></i></button>' +
                '</tr>';
        }

        //Close Table//
        table += '</tbody></table>';

        //Função que esconde div,instancia tabela e starta o Datatable//
        $('#div_tabela').fadeOut(500, function () {
            $(this).empty().hide().append(table).fadeIn("fast");

            $('#tblEmpresa').DataTable({
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

// ===================================== FIM MONTA TABELA ===================================================

// ==================================== MONTA EDITAR EMPRESA ================================================
function montaEditarEmpresa(idEmpresa,nomeEmpresa,nomeAbreviado) {

    Swal.fire({
        title: 'Editar Empresa',
        buttonsStyling: false,
        confirmButtonClass: "justify-content-center btn btn-success btn-round ",
        showCancelButton: true,
        cancelButtonText: 'Cancelar',
        cancelButtonClass: "justify-content-center btn btn-danger btn-round ",
        confirmButtonText: 'Salvar',
        width: "85%",
        html: '<div class="row justify-content-md-center">' +
            '<div class="col-md- 4 ">' +
            '<label>Nome</label>' +
            '<div class="form-group">' +
            '<input id="editarEmpresaNome" type="text" value='+nomeEmpresa+' class="form-control" placeholder="Nome...">' +
            '</div>' +
            '</div>' +

            '<div class="col-md-4 ">' +
            '<label>Nome Abreviado</label>' +
            '<div class="form-group">' +
            '<input id="editarEmpresaNomeAbreviado" value='+nomeAbreviado+' type="text" class="form-control" placeholder="Nome Abreviado...">'+
            '</div>' +
            '</div>' +
            '</div>',

        onOpen: () => {
           
        }
    }).then((result) => {
        if (result.value) {

            var data={
                id_empresa:idEmpresa,
                nm_empresa:nomeEmpresa,
                nm_abreviado:nomeAbreviado
            }

            var request = $.ajax({
                url: urlUpdateEmpresa,
                type: "PUT",
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                },
                data: JSON.stringify(data),
                
                dataType: "json",
                crossDomain: true,
            });

            request.done(function (data){
                Swal.fire(
                    'Editado!',
                    'Empresa editada com sucesso!',
                    'success'
                );
                montaFormularioSite(data[0].id_empresa,data[0].nm_empresa);

            
            })
            request.fail(function (data){
                Swal.fire(
                    'Erro!',
                    'Um erro ocorreu por favor tente novamente!',
                    'error'
                )
            })
        }
    })
}

// ===================================== FIM EDITAR EMPRESA =================================================


// ===================================== EDITAR EMPRESA =====================================================

function editarEmpresa(tipo, nome, descricao) {

    Swal({
        title: 'Editar Empresa',
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
        '<div class="col-md-4">' +
        '<label>Nome</label>' +
        '<div class="form-group">' +
        '<input type="text" class="form-control" value="' + nome + '" placeholder="Nome...">' +
        '</div>' +
        '</div>' +

        '<div class="col-md-4">' +
        '<label>Descrição</label>' +
        '<div class="form-group">' +
        '<input type="text" class="form-control" value="' + descricao + '" placeholder="Descrição...">' +
        '</div>' +
        '</div>' +

        '<div class="col-md-4">' +
        '<label class="col-form-label">Tipo de Serviço</label>' +
        '<select id="cmbTipo" value="' + tipo + '" type="text" class="form-control">' +
        '<option value="Todos">A Granel</option>' +
        '<option value="MQ1">Liquido</option>' +
        '</select>' +
        '</div>' +

        '<div class="row">' +
        '<div class="col-md-4">' +
        '<label>Unidade de Medida</label>' +
        '<div class="form-group">' +
        '<input type="text" class="form-control" value="' + cnpj + '" placeholder="CNPJ...">' +
        '</div>' +
        '</div>' +

        '<div class="row">' +
        '<div class="col-md-4">' +
        '<label>Código SAP</label>' +
        '<div class="form-group">' +
        '<input type="text" class="form-control" value="' + inscricao_estadual + '" placeholder="Inscrição Estadual...">' +
        '</div>' +
        '</div>' +
        '</div>' +
        '</div>',
        allowOutsideClick: () => !Swal.isLoading()
    }).then((result) => {
        $.ajax({
            type: "PUT",
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            data: JSON.stringify(data),
            url: urlEditarProdutos + idProdutos,
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
    })
}

// ===================================== FIM EDITAR EMPRESA =================================================

function deletarEmpresa(idEmpresa) {
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
            url: urlDeleteEmpresa + idEmpresa,
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


