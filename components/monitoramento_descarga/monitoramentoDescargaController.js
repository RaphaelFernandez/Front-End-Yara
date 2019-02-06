
//=========================    URL'S ===================================
var urlGetProdutos = null;
var urlGetTotal = null;
var urlGetProduto = null;
var urlStatusDi = null;
var urlStatusRF = null;
var urlGetDiBerco = null;
var urlGetUsuarioReceita = null;
var urlGetBarcaca = null;
var urlAtracacao = null;
var urlDraft = null;

$.getJSON("assets/urls.json", function (data) {
    urlGetBerco = data.urlGetBerco;
    urlGetTotal = data.urlGetTotal;
    urlGetProduto = data.urlGetProduto;
    urlStatusDi = data.urlStatusDi;
    urlStatusRF = data.urlStatusRF;
    urlGetDiBerco = data.urlGetDiBerco;
    urlGetUsuarioReceita = data.urlGetUsuarioReceita;
    urlGetBarcaca = data.urlGetBarcaca;
    urlAtracacao = data.urlAtracacao;
    urlDraft = data.urlDraft;
});

//Variavel da função de refresh das informações da tela//
var refresh;

//=========================   FIM URL'S ================================

angular.module("yara")
    .controller("monitoramentoDescargaController", function ($scope, $http) {
        $scope.$on('$viewContentLoaded', function () {
            pegaBerco("norte");
            pegaBerco("sul");
        
            refresh = setInterval(function () {
                pegaBerco("norte");
                pegaBerco("sul");
            }, 30000);
        });

        $scope.$on("$destroy", function(){
            clearInterval(refresh);
        });
    });


// ===================================== MONTA BERÇO ================================
function pegaBerco(hemisferio)
{
    //Request Ajax//
    var requestItens = $.ajax({
        url: urlGetBerco+hemisferio,
        method: "GET",
        crossDomain: true
    });

    //Sucesso//
    requestItens.done(function (data) {

        //Verifica se existe um RF naquele berço//
        if(data)
        {
            //Monta o cabeçalho//
            pegaCabecalho(data[0].id_berco,hemisferio,data[0].id_descarga,data[0].escala_rf);
            
            //Monta os cards de produtos//
            pegaProdutos(data[0].id_descarga,hemisferio);

            //Monta tabela de Dis//
            montaTabelaOperacacao(hemisferio,data[0].escala_rf);
        }
        else{
            if(hemisferio =="norte")
            {
                //Monta o cabeçalho//
                pegaCabecalho("2",hemisferio,"","");
            }
            else{
                //Monta o cabeçalho//
                pegaCabecalho("1",hemisferio,"","");
            }

            //Esvazia o card de total,os cards de produtos e a tabela de Dis//
            $('#totalNavio'+hemisferio).empty();
            $('#produtos'+hemisferio).empty();
            $('#tabela'+hemisferio).empty();
        }
        
    });

    //Erro//
    requestItens.fail(function (data) {
        Swal.fire({
            type: 'error',
            title: 'Erro!',
            text:'Um erro ocorreu por favor tente novamente!',
            timer:1000,
            showConfirmButton: false,
        });
    });
}
// ===================================== FIM MONTA BERÇO ================================

// ===================================== MONTA CABEÇALHO ================================
function pegaCabecalho(idHemisferio,hemisferio,idRF,nomeRF){

    //Esvazia os elementos que serão populados//
    $('#input'+hemisferio).empty();
    $('#botao'+hemisferio).empty();
    $('#datepicker'+hemisferio).empty();

    //Checa se ja temos um navio naquele porto//
    if(idRF !="" && nomeRF !="")
    {   
        //Popula o div do input de RF//
        var rf = '<input id="'+idRF+'" type="text" class="form-control form-group" value="'+nomeRF+'" disabled>';

        //Popula o div do botao de Pausa de Descarga//
        var botao ='<button onclick="trocaStatusBerco(\'PAUSAR\',\''+idRF+'\',\''+idHemisferio+'\',\''+hemisferio+'\')" class="btn btn-success" style="margin:0px;">'+
                '<span class="btn-label">'+
                    '<i class="now-ui-icons media-1_button-pause"></i>'+
                '</span>'+
                'Pausar descarga'+
            '</button>';

        //Popula o div do botao de definir datas//
        var datepicker='<button class="btn btn-info" onclick="alteraData(\''+idRF+'\',\''+idHemisferio+'\')" style="margin:0px; margin-left:10px;">' +
                '<span class="btn-label">' +
                    '<i class="now-ui-icons ui-1_calendar-60"></i>' +
                '</span>' +
                'Datas' +
            '</button>';

        $('#input'+hemisferio).empty().append(rf);
        $('#botao'+hemisferio).empty().append(botao);
        $('#datepicker'+hemisferio).empty().append(datepicker);
    }
    else
    {
        //Request Ajax//
        var requestItens = $.ajax({
            url: urlStatusRF,
            method: "GET",
            crossDomain: true
        });

        //Sucesso//
        requestItens.done(function (data) {

            //Começo da estrutura de select do RF//
            var rf='<div class="form-group" id="input'+hemisferio+'">' +
                '<select id="selecionaRF'+hemisferio+'" type="text" class="form-control form-group">';

            //Popula o select do RF//
            for (var i = 0; i < data.length; i++) {
                if(data[i].idStatus != "3")
                {
                    rf+='<option value="'+data[i].idDescarga+'">'+data[i].escalaRf+'</option>';   
                }
                
            }

            //Fecha o select do RF//
            rf+='</select></div>';

            //Popula o div do botao de Definir Descarga//
            var botao ='<button onclick="trocaStatusBerco(\'INICIAR\',\'\',\''+idHemisferio+'\',\''+hemisferio+'\')" class="btn btn-info" style="margin:0px;">'+
                '<span class="btn-label">'+
                    '<i class="now-ui-icons media-1_button-play"></i>'+
                '</span>'+
                'Iniciar descarga';

            //Insere as estruturas em seus divs correspondente//
            $('#input'+hemisferio).empty().append(rf);
            $('#botao'+hemisferio).empty().append(botao);
        });
    }   
}
// ===================================== FIM MONTA CABEÇALHO ================================

// ===================================== MONTA TOTAL ================================
function pegaTotal(hemisferio,nomeNavio){

    //Esvazia o elemento que sera populado//
    $('#totalNavio'+hemisferio).empty();

    //Request Ajax//
    var requestItens = $.ajax({
        url: urlGetTotal+hemisferio,
        method: "GET",
        crossDomain: true
    });
    
    requestItens.done(function (data) {
        var total ='<div class="card card-stats" style="-webkit-box-shadow: 0px 0px 7px 2px rgba(255,178,54,1); -moz-box-shadow: 0px 0px 7px 2px rgba(255,178,54,1); box-shadow: 0px 0px 7px 2px rgba(255,178,54,1);">' +
                        '<div class="card-body ">' +
                            '<div class="statistics statistics-horizontal">' +
                                '<div class="info info-horizontal">' +
                                    '<div class="row">' +
                                        '<div class="col-3">' +
                                            '<div class="icon icon-warning icon-circle">' +
                                                '<i class="now-ui-icons objects_support-17"></i>' +
                                            '</div>' +
                                        '</div>' +
                                        '<div class="col-7">' +
                                            '<p class="info-title text-center" style="font-size:1.2vw; white-space: nowrap">Total do Navio '+nomeNavio+'</p>' +
                                            '<div id="porcentagemTotal'+hemisferio+'" class="progress progress-bar" role="progressbar" style="width: 100%;" aria-valuenow="100" aria-valuemin="0" aria-valuemax="100">'+data[0].porcento+'%</div>' +
                                        '</div>' +
                                    '</div>' +
                                '</div>'+
                            '</div>' +
                        '</div>' +
                        '<hr>' +
                        '<div class="card-footer ">' +
                            '<div class="stats text-center">' +
                                '<i class="now-ui-icons ui-1_check"></i>Descarregado:</br>' +
                                '<span id="qtdDescarregada'+hemisferio+'">'+data[0].real+'</span> de <span id="qtdTotalProdutoTotal'+hemisferio+'">'+data[0].prev+'</span>' +
                            '</div>' +
                        '</div>';
        // $('#totalNavio'+hemisferio).fadeOut(500, function() {
        //     $(this).empty().hide().append(total).fadeIn("fast");
        // });

        $('#totalNavio'+hemisferio).empty().append(total);
    });
}
// ===================================== FIM MONTA TOTAL ================================

// ===================================== MONTA PRODUTOS ================================
function pegaProdutos(idRF,hemisferio){
    $('#produtos'+hemisferio).empty();
    
    var requestItens = $.ajax({
        url: urlGetProduto+hemisferio+"&idDescarga="+idRF,
        method: "GET",
        crossDomain: true
    });
    console.log(urlGetProduto+hemisferio+"&idDescarga="+idRF);
    requestItens.done(function (data) {
        var produtos="<div class='row'>";
       for (var i = 0; i < data.length; i++) {
            produtos +='<div id="produto"'+i+ '" class="col-md-3">'+
                '<div class="card card-stats">'+
                    '<div class="card-body ">'+
                        '<div class="statistics statistics-horizontal">'+
                            '<div class="info info-horizontal">'+
                                '<div class="row">'+
                                    '<div class="col-5">'+
                                        '<div class="icon icon-info icon-circle">'+
                                            '<i class="now-ui-icons shopping_tag-content"></i>'+
                                        '</div>'+
                                    '</div>'+
                                    '<div class="col-7">'+
                                        '<h3 id="'+hemisferio+i+'" class="info-title text-center" style="font-size:1.2vw; white-space: nowrap" >'+data[i].nm_carga+'</h3>'+
                                        '<div id="porcentagem"'+i+ '" class=" progress progress-bar" role="progressbar" style="width: 100%;" aria-valuenow="'+data[i].carregado_porcento+'" aria-valuemin="0" aria-valuemax="100">'+data[i].carregado_porcento +'%</div>'+
                                    '</div>'+
                                '</div>'+
                            '</div>'+
                        '</div>'+
                    '</div>'+
                    '<hr>'+
                    '<div class="card-footer ">'+
                        '<div class="stats text-center">'+
                            '<i class="now-ui-icons ui-1_check"></i> Descarregado:</br>'+
                            '<span id="qtdDescarregada"'+i+ '">'+data[i].qtd_real+'</span> de <span id="qtdTProdutoTotal"'+i+ '">'+data[i].qtd_planejado+'</span>'+
                        '</div>'+
                    '</div>'+
                '</div>'+
            '</div>';
        }
        produtos+="</div>";
        $('#produtos'+hemisferio).empty().append(produtos);
    });
    
    // $('#produtos'+hemisferio).fadeOut(500, function() {
    //     $(this).empty().hide().append(produtos).fadeIn("fast");
    // });
    
}
// ===================================== FIM MONTA PRODUTOS ================================

// ===================================== SELECIONA USUARIO ================================
function selecionaUsuario(empresa,callback){
    
    var requestItens = $.ajax({
        url: urlGetUsuarioReceita+empresa,
        method: "GET",
        crossDomain: true
    });
    
    requestItens.done(function (data){
        var usuario='<select type="text" class="form-control" id="adicionaDraftUsuario"> ';
        for (var i = 0; i < data.length; i++) {
            usuario+="<option value='" + data[i].id_usuario + "'>" + data[i].nm_usuario + "</option>";
        }
        usuario+="</select>";
        callback(usuario);
    });   
}
// ===================================== FIM SELECIONA USUARIO ================================

// ===================================== SELECIONA BARCAÇA ================================
function selecionaBarcaca(callback){
    
    var requestItens = $.ajax({
        url: urlGetBarcaca,
        method: "GET",
        crossDomain: true
    });
    
    requestItens.done(function (data){
        var barcaca='<select type="text" class="form-control" id="adicionaDraftBarcaca"><option value="null">Nenhum</option> ';
        for (var i = 0; i < data.length; i++) {
            if(data[i].tpEmbarcacao == "2")
            {
                barcaca+="<option value='" + data[i].idEmbarcacao + "'>" + data[i].nmEmbarcacao + "</option>";
            }
            
        }
        barcaca+="</select>";
        callback(barcaca);
    });   
}
// ===================================== FIM SELECIONA BARCAÇA ================================

// ===================================== MONTA TABELA ================================
function montaTabelaOperacacao(hemisferio,escalaRF) {

    var requestItens = $.ajax({
        url: urlGetDiBerco+hemisferio+"&escala_rf="+escalaRF,
        method: "GET",
        crossDomain: true
    });
    requestItens.done(function (data) {


        //Monta total desde RF//
        pegaTotal(hemisferio,data[0].navio);

        //Esvazia a tabela//
        $('#tabela'+hemisferio).empty();

        //Cabeçalhos Tabelas//
        var tabela= '<div class="col-md-12">' +
        '<div class="card-stats">' +
            '<div class="row">' +
                '<div class="col-md-12">' +
                    '<div class="card">' +
                        '<div class="card-body">' +
                        '<table id="datatable'+hemisferio+'" class="table  table-bordered" cellspacing="0" width="100%">' +
        '<thead>' +
            '<tr>' +
                '<th class="text-center">DI</th>' +
                '<th class="text-center">Importador</th>' +
                '<th class="text-center">Produto</th>' +
                '<th class="text-center">Quantidade</th>' +
                '<th class="text-center">Descarregado</th>' +
                '<th class="text-center">Saldo</th>' +
                '<th class="text-center">Progresso</th>' +
                '<th class="text-center">Opções</th>' +
            '</tr>' +
        '</thead><tbody>';

        //Popula os Trs com as devidas informações e respectivos botoes//
        for (var i = 0; i < data.length; i++) {
            
            //Trs da tabela//
            tabela +='<tr  value="' + data[i].id_descarga_di + '">' +
            '<td>' + data[i].num_di + '</td>' +
            '<td>' + data[i].importador + '</td>' +
            '<td>' + data[i].nm_carga + '</td>' +
            '<td>' + data[i].qtd_planejado + '</td>' +
            '<td>' + data[i].qtd_real + '</td>' +
            '<td>' + data[i].dif_ton + '</td>' +
            '<td ><div class="progress">' +
            '<div class="progress-bar" role="progressbar" style="width:' + data[i].carregado_porcento + '%;" aria-valuenow="' + data[i].carregado_porcento + '" aria-valuemin="0" aria-valuemax="100">' + data[i].carregado_porcento + '%</div>' +
            '</div></td>';


            //Logica dos botões//
            if (data[i].st_di == "CRIADA" || data[i].st_di == "PARALIZADA") 
            {
                tabela +='<td class="text-center" style="white-space:nowrap;">' +
                '<button type="button" rel="tooltip" class="btn btn-simple btn-success btn-round btn-icon btn-sm"   data-original-title="Iniciar" title="" onclick="editarStatus(\'COMECAR\',\''+data[i].id_descarga_di+'\',\''+data[i].id_descarga+'\',\''+hemisferio+'\')">' +
                '<i class="now-ui-icons media-1_button-play"></i>' +
                '</button>' +
                '<button type="button" rel="tooltip" class="btn btn-simple btn-round btn-icon btn-sm " onclick="adicionarDraft(\'' + data[i].id_descarga_di + '\',\''+hemisferio+'\')" data-original-title="Adicionar Peso Draft" title="">' +
                '<i class="now-ui-icons ui-1_simple-add"></i>' +
                '</button>' +
                '</td>' +
                '</tr>'
            
            }
            if(data[i].st_di == "CARREGANDO")
            {   
                tabela +='<td class="text-center" style="white-space:nowrap;">' +
                '<button type="button" rel="tooltip" class="btn btn-simple btn-success btn-round btn-icon btn-sm"   data-original-title="Iniciar" title="" onclick="editarStatus(\'PAUSAR\',\''+data[i].id_descarga_di+'\',\''+data[i].id_descarga+'\',\''+hemisferio+'\')">' +
                '<i class="now-ui-icons media-1_button-pause"></i>' +
                '</button>' +
                '<button type="button" rel="tooltip" class="btn btn-simple btn-round btn-icon btn-sm " onclick="adicionarDraft(\'' + data[i].id_descarga_di + '\',\''+hemisferio+'\')" data-original-title="Adicionar Peso Draft" title="">' +
                '<i class="now-ui-icons ui-1_simple-add"></i>' +
                '</button>' +
                '</td>' +
                '</tr>'
            }

            if(data[i].status == "FINALIZADA")
            {
                tabela +='<td><p style=margin-bottom: 0px;>Finalizado</p></td></tr>';
            }

        }
        //Fecha tabela//
        tabela +='</tbody></table></div></div></div></div></div>';

        $('#tabela'+hemisferio).empty().append(tabela);
        $('#datatable'+hemisferio).DataTable({
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
}
// ===================================== FIM MONTA TABELA ================================

// ========================================== COMEÇO ALTERA STATUS DI ==========================================
function editarStatus(acao,idDi,idRF,hemisferio){

    if(acao =="PAUSAR")
    {
        Swal.fire({
            title: 'Pausar DI?',
            text: "Essa Di será pausada!",
            type: 'warning',
            showCancelButton: true,
            confirmButtonText: 'Sim',
            cancelButtonText: 'Não!',
        }).then((result) => {
            if (result.value) {

                $.blockUI({
                    message: '<img style="max-width:100px;max-height:100px;" src="assets/img/loading.gif" />',
                    css: {
                        border: 'none',
                        backgroundColor: 'transparent'
                    }
                });

                var request = $.ajax({
                    url: urlStatusDi+"/"+idDi+"/changestatus/PARALIZADA",
                    method: "PUT",
                    crossDomain:true
                });
        
                request.done(function (data){
                    Swal.fire({
                        type: 'success',
                        title: 'Sucesso!',
                        text:'DI pausada com sucesso!',
                        timer:1000,
                        showConfirmButton: false,
                    });
                    pegaBerco(hemisferio);
                    $.unblockUI();

                })
                request.fail(function (data){
                    Swal.fire({
                        type: 'error',
                        title: 'Erro!',
                        text:'Um erro ocorreu por favor tente novamente!',
                        timer:1000,
                        showConfirmButton: false,
                    });
                    $.unblockUI();
                })
                
            } 
        })
    }

    if(acao =="COMECAR")
    {
        Swal.fire({
            title: 'Começar DI?',
            text: "Caso outro DI esteja carregando o mesmo será pausado!",
            type: 'warning',
            showCancelButton: true,
            confirmButtonText: 'Sim',
            cancelButtonText: 'Não!',
        }).then((result) => {
            if (result.value) {

                $.blockUI({
                    message: '<img style="max-width:100px;max-height:100px;" src="assets/img/loading.gif" />',
                    css: {
                        border: 'none',
                        backgroundColor: 'transparent'
                    }
                });

                var requestStatus = $.ajax({
                    url: urlStatusDi+"?status=CARREGANDO&descargaId="+idRF,
                    method: "GET",
                    crossDomain:true
                });
        
                requestStatus.done(function (stop){
                    console.log(stop);
                    if(stop)
                    {
                        var requestChangeStop = $.ajax({
                            url: urlStatusDi+"/"+stop[0].idDescargaDi+"/changestatus/PARALIZADA",
                            method: "PUT",
                            crossDomain:true
                        });

                        requestChangeStop.done(function (){
                            var requestChangePlay = $.ajax({
                                url: urlStatusDi+"/"+idDi+"/changestatus/CARREGANDO",
                                method: "PUT",
                                crossDomain:true
                            });
                            
                            requestChangePlay.done(function (){
                                Swal.fire({
                                    type: 'success',
                                    title: 'Sucesso!',
                                    text:'DI startada com sucesso!',
                                    timer:1000,
                                    showConfirmButton: false,
                                });
                                pegaBerco(hemisferio);
                                $.unblockUI();

                            });

                            requestChangePlay.fail(function (data){
                                Swal.fire({
                                    type: 'error',
                                    title: 'Erro!',
                                    text:'Um erro ocorreu por favor tente novamente!',
                                    timer:1000,
                                    showConfirmButton: false,
                                });
                                $.unblockUI();
                            })


                        });

                        requestChangeStop.fail(function (data){
                            Swal.fire({
                                type: 'error',
                                title: 'Erro!',
                                text:'Um erro ocorreu por favor tente novamente!',
                                timer:1000,
                                showConfirmButton: false,
                            });
                            $.unblockUI();
                        })
                    }
                    else{
                        console.log("nao tem nenhuma rodando");
                        var requestChangePlay = $.ajax({
                            url: urlStatusDi+"/"+idDi+"/changestatus/CARREGANDO",
                            method: "PUT",
                            crossDomain:true
                        });

                        requestChangePlay.done(function (){
                            Swal.fire(
                                'Sucesso!',
                                'DI startada com sucesso!',
                                'success'
                            )

                            Swal.fire({
                                type: 'success',
                                title: 'Sucesso!',
                                text:'DI inciada com sucesso!',
                                timer:1000,
                                showConfirmButton: false,
                            });
                            pegaBerco(hemisferio);
                            $.unblockUI();

                        });

                        requestChangePlay.fail(function (data){
                            Swal.fire({
                                type: 'error',
                                title: 'Erro!',
                                text:'Um erro ocorreu por favor tente novamente!',
                                timer:1000,
                                showConfirmButton: false,
                            });
                            $.unblockUI();
                        })

                    }
                    

                });
                requestStatus.fail(function (data){
                    Swal.fire({
                        type: 'error',
                        title: 'Erro!',
                        text:'Um erro ocorreu por favor tente novamente!',
                        timer:1000,
                        showConfirmButton: false,
                    });
                    $.unblockUI();
                })
                
            } 
        })
    }
}
// ==========================================  FIM ALTERA STATUS DI ==========================================

// ===================================== ADIÇÃO DE DRAFT ================================
function adicionarDraft(idDi,hemisferio) {
    var draft="";
    selecionaUsuario("RF",function(usuario){
        selecionaBarcaca(function(barcaca){
            draft='<div class="row">' +
            '<div class="col-md-4">' +
            '<label>Barcaça</label>' +
            '<div class="form-group">' +
            barcaca +
            '</div>' +
            '</div>' +
            '<div class="col-md-4">' +
            '<label>Peso Draft</label>' +
            '<div class="form-group">' +
            '<input type="text" id="adicionaDraftPeso" class="form-control" placeholder="Peso Draft...">' +
            '</div>' +
            '</div>' +
            '<div class="col-md-4">' +
            '<label>Responsável pelo Laudo</label>' +
            '<div class="form-group">' +
            usuario+
            '</div>' +
            '</div>' +
            '</div>' +
            '</div>' +
            '</div>';

            Swal.fire({
                title: 'Adicionar Draft',
                buttonsStyling: false,
                confirmButtonClass: "justify-content-center btn btn-success btn-round ",
                showCancelButton: true,
                cancelButtonText: 'Cancelar',
                cancelButtonClass: "justify-content-center btn btn-danger btn-round ",
                confirmButtonText: 'Salvar',
                width: "85%",
                html: draft,
            }).then((result) => {
                if (result.value) {

                    var idBarcaca;
                    if($("#adicionaDraftUsuario").val()==null)
                    {
                        barcaca = null;
                    }
                    else{
                        barcaca = $("#adicionaDraftUsuario").val();
                    }
                    $.blockUI({
                        message: '<img style="max-width:100px;max-height:100px;" src="assets/img/loading.gif" />',
                        css: {
                            border: 'none',
                            backgroundColor: 'transparent'
                        }
                    });
                    
                    var data =
                    {
                        "idDraft": 0,
                        "idDescargaDi": parseInt(idDi),
                        "idStatus": null,
                        "idEmbarcacao":barcaca,
                        "qtdProd": parseInt($("#adicionaDraftPeso").val()),
                        "idUsuario": 1,
                        "idEngRf": parseInt($("#adicionaDraftUsuario").val()),
                        "dtDraft": moment().format("YYYY-MM-DDTHH:MM:ss"),
                        "dtHora": moment().format("YYYY-MM-DDTHH:MM:ss"),
                        "idDescargaDiNavigation": null
                    };

                    var request = $.ajax({
                        url: urlDraft,
                        method: "POST",
                        crossDomain:true,
                        headers: { 
                            'Accept': 'application/json',
                            'Content-Type': 'application/json' 
                        },
                        data:JSON.stringify(data),
                    });
            
                    request.done(function (){

                        Swal.fire({
                            type: 'success',
                            title: 'RF encontrado com sucesso!',
                            text:'Di editada com sucesso!',
                            timer:1000,
                            showConfirmButton: false,
                        });
                        pegaBerco(hemisferio);
                        $.unblockUI();    
                    })
                    request.fail(function (data){
                       
                        Swal.fire({
                            type: 'error',
                            title: 'Um erro ocorreu por favor tente novamente!',
                            timer:1000,
                            showConfirmButton: false
                            
                        });
                        $.unblockUI();
                    })
                }
            })
        });
    });
    
    
   

    //montaTabela();
}
// ===================================== FIM ADIÇÃO DE DRAFT ================================

// ===================================== COMEÇO ALTERA STATUS BERÇO ================================
function trocaStatusBerco(acao,idRF,idHemisferio,hemisferio){
    if(acao =="PAUSAR")
    {
        Swal.fire({
            title: 'Remover RF?',
            text: "Esse RF será removido do berço!",
            type: 'warning',
            showCancelButton: true,
            confirmButtonText: 'Sim',
            cancelButtonText: 'Não!',
        }).then((result) => {
            if (result.value) {

                $.blockUI({
                    message: '<img style="max-width:100px;max-height:100px;" src="assets/img/loading.gif" />',
                    css: {
                        border: 'none',
                        backgroundColor: 'transparent'
                    }
                });

                var requestStatus = $.ajax({
                    url: urlStatusRF+"/"+idRF+"/changestatus/PARALIZADA",
                    method: "PUT",
                    crossDomain:true
                });
                
                requestStatus.done(function (){

                    var requestAtracacao = $.ajax({
                        url: urlAtracacao+"?descarga="+idRF+"&berco="+idHemisferio,
                        method: "DELETE",
                        crossDomain:true
                    });

                    requestAtracacao.done(function (){
                        Swal.fire({
                            type: 'success',
                            title: 'Sucesso!',
                            text:'O plano RF foi removido do berço!',
                            timer:1000,
                            showConfirmButton: false,
                        });
                        pegaBerco(hemisferio);
                        $.unblockUI();
                    });

                    requestAtracacao.fail(function (){

                        Swal.fire({
                            type: 'error',
                            title: 'Erro!',
                            text:'Um erro ocorreu por favor tente novamente!',
                            timer:1000,
                            showConfirmButton: false,
                        });
                        $.unblockUI();
                    });
                    

                });

                requestDescarga.fail(function (data){
                    Swal.fire({
                        type: 'error',
                        title: 'Erro!',
                        text:'Um erro ocorreu por favor tente novamente!',
                        timer:1000,
                        showConfirmButton: false,
                    });
                    $.unblockUI();
                });
                
            } 
        })
    }

    if(acao =="INICIAR")
    {
        Swal.fire({
            title: 'Começar RF?',
            text: "Este RF será colocado no berço!",
            type: 'warning',
            showCancelButton: true,
            confirmButtonText: 'Sim',
            cancelButtonText: 'Não!',
        }).then((result) => {
            if (result.value) {
                
                $.blockUI({
                    message: '<img style="max-width:100px;max-height:100px;" src="assets/img/loading.gif" />',
                    css: {
                        border: 'none',
                        backgroundColor: 'transparent'
                    }
                });

                var requestStatus = $.ajax({
                    url: urlStatusRF+"/"+$("#selecionaRF"+hemisferio).val()+"/changestatus/CARREGANDO",
                    method: "PUT",
                    crossDomain:true
                });
                
                requestStatus.done(function (){
                     var data={
                            "idDescargaAtracacao": 0,
                            "idDescarga": $("#selecionaRF"+hemisferio).val(),
                            "idBerco": idHemisferio,
                            "idUsuario": 1,
                            "ativo": true,
                            "dtAtracacao": moment().format("YYYY-MM-DDTHH:mm:ss"),
                            "dtDesatracacao": moment().format("YYYY-MM-DDTHH:mm:ss"),
                            "dtHora": moment().format("YYYY-MM-DDTHH:mm:ss"),
                            "idBercoNavigation": null,
                            "idDescargaNavigation": null
                        };urlAtracacao
                    
                    var requestAtracacao = $.ajax({
                        url: urlAtracacao,
                        method: "POST",
                        headers: { 
                            'Accept': 'application/json',
                            'Content-Type': 'application/json' 
                        },
                        data:JSON.stringify(data),
                        crossDomain: true
                    });

                    requestAtracacao.done(function (){

                        Swal.fire({
                            type: 'success',
                            title: 'Sucesso!',
                            text:'O plano RF foi inserido no berço!',
                            timer:1000,
                            showConfirmButton: false,
                        });
                        pegaBerco(hemisferio);
                        $.unblockUI();
                    });

                    requestStatus.fail(function (data){
                        Swal.fire({
                            type: 'error',
                            title: 'Erro!',
                            text:'Um erro ocorreu por favor tente novamente!',
                            timer:1000,
                            showConfirmButton: false,
                        });
                        $.unblockUI();
                    });

                    

                });
                
                requestStatus.fail(function (data){
                    Swal.fire({
                        type: 'error',
                        title: 'Erro!',
                        text:'Um erro ocorreu por favor tente novamente!',
                        timer:1000,
                        showConfirmButton: false,
                    });
                    $.unblockUI();
                });
                
            } 
        })
    }
}
// ===================================== FIM ALTERA STATUS BERÇO ================================

// ===================================== COMEÇO ALTERA DATA ================================
function alteraData(idRf,idHemisferio){
    var informacaoAtracacao;

    Swal.fire({
        title: 'Editar Data',
        buttonsStyling: false,
        confirmButtonClass: "justify-content-center btn btn-success btn-round ",
        showCancelButton: true,
        cancelButtonText: 'Cancelar',
        cancelButtonClass: "justify-content-center btn btn-danger btn-round ",
        confirmButtonText: 'Salvar',
        width: "85%",
        html: '<div class="col-md-12">' +
        '<div class="justify-content-center row">' +
            '<div class="form-group col-sm-3">' +
            '<label class="col-form-label">Data de Atracação</label>' +
            '<input type="text" class="form-control" id="dataAtracacao">' +
            '</div>'+
            '<div class="form-group col-sm-3">' +
            '<label class="col-form-label">Data de Desatracação</label>' +
            '<input type="text" class="form-control" id="dataDesatracacao">' +
            '</div>'+
            '</div></div>',
        onOpen: () => {
            var request = $.ajax({
                    url: urlAtracacao+"?descarga="+idRf+"&berco="+idHemisferio,
                    method: "GET",
                    crossDomain:true
                });

            request.done(function (data){
                informacaoAtracacao=data;
                $('#dataAtracacao').datetimepicker({
                    format: 'DD/MM/YYYY HH:mm',
                    defaultDate:moment(data[0].dtAtracacao,'YYYY-MM-DDTHH:mm:ss').format('MM/DD/YYYY HH:mm'),
                    
                });
                $('#dataDesatracacao').datetimepicker({
                    format: 'DD/MM/YYYY HH:mm' ,
                    defaultDate:moment(data[0].dtDesatracacao,'YYYY-MM-DDTHH:mm:ss').format('MM/DD/YYYY HH:mm'),
                    
                });
            });
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
            informacaoAtracacao[0].dtAtracacao=moment($("#dataAtracacao").val(),'DD/MM/YYYY HH:mm').format("YYYY-MM-DDTHH:mm:ss");
            informacaoAtracacao[0].dtDesatracacao=moment($("#dataDesatracacao").val(),'DD/MM/YYYY HH:mm').format("YYYY-MM-DDTHH:mm:ss");
         
            var request = $.ajax({
                url: urlAtracacao+"/"+informacaoAtracacao[0].idDescargaAtracacao,
                method: "PUT",
                crossDomain:true,
                headers: { 
                    'Accept': 'application/json',
                    'Content-Type': 'application/json' 
                },
                data:JSON.stringify(informacaoAtracacao[0]),
            });
    
            request.done(function (data){

                Swal.fire({
                    type: 'success',
                    title: 'Data alterada com sucesso!',
                    timer:1000,
                    showConfirmButton: false,
                });
                $.unblockUI();    
            })
            request.fail(function (data){
               
                Swal.fire({
                    type: 'error',
                    title: 'Um erro ocorreu por favor tente novamente!',
                    timer:1000,
                    showConfirmButton: false
                    
                });
                $.unblockUI();
            })
            
        }
    })
}
// ===================================== FIM ALTERA DATA ================================
 