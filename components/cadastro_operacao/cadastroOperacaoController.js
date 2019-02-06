
//===================================================== URL'S =================================================================
var urlGetNavio = null;
var urlGetPaisPorto = null;
var urlGetRF = null;
var urlGetEmpresa = null;
var urlGetCarga = null;
var urlGetMedidor = null;
var urlGetDi = null;
var urlPostRF = null;
var urlPostDi = null;
var urlGetTerminal = null;
var urlDeleteDi = null;
var urlUpdateDi = null;
var urlUpdateDescarga = null;
var urlSequenciaDi = null;

$.getJSON( "assets/urls.json", function( data ) {
    urlGetNavio = data.urlGetNavio;
    urlGetAgencia = data.urlGetAgencia;
    urlGetRF = data.urlGetRF;
    urlGetEmpresa = data.urlGetEmpresa;
    urlGetCarga = data.urlGetCarga;
    urlGetMedidor = data.urlGetMedidor;
    urlGetPorto = data.urlGetPorto;
    urlPostRF= data.urlPostRF;
    urlPostDi =data.urlPostDi;
    urlGetDi = data.urlGetDi;
    urlGetTerminal = data.urlGetTerminal;
    urlDeleteDi =data.urlDeleteDi;
    urlUpdateDi = data.urlUpdateDi;
    urlUpdateDescarga = data.urlUpdateDescarga;
    urlSequenciaDi =data.urlSequenciaDi;
  });

//==================================================== FIM URL'S ==============================================================

//Quantidade de Dis naquele Rf,para ser adicionado na sequencia correta//
var quantidade_di=0;

angular.module("yara")
.controller("cadastroOperacaoController",function($scope, $http){
    $scope.$on('$viewContentLoaded', function(){

        //Pega as agencias e navios do form de registro de RF//
        getAgencia();
        getNavio();
        
    });      
});

// ========================================== COMEÇAR SELECIONAR NAVIO ========================================================
function getNavio(){

    //Remove qualquer conteudo anterior do dropdown//
    $('#rfNavio').find("option").remove();

    //Request Ajax//
    var request = $.ajax({
        url: urlGetNavio+"?IdTipoEmbarcacao=1",
        method: "GET",
        crossDomain:true
    });

    //Sucesso//
    request.done(function (data){
        for (var i = 0; i < data.length; i++) {
            $('#rfNavio').append("<option value='" + data[i].idEmbarcacao + "'>" + data[i].nmEmbarcacao +" - "+data[i].numImo+"</option>");
        }
    });

    //Erro//
    request.fail(function () {
        Swal.fire({
                type: 'error',
                title: 'Nenhum RF encontrado!',
                timer:1000,
                showConfirmButton: false  
        });
    });
}
// ==========================================  FIM SELECIONAR NAVIO ===========================================================

// ========================================== COMEÇAR SELECIONAR AGENCIA ======================================================
function getAgencia(){

    //Remove qualquer conteudo anterior do dropdown//
    $('#rfAgencia').find("option").remove();

    //Request Ajax//
    var request = $.ajax({
        url: urlGetAgencia,
        method: "GET",
        crossDomain:true
    });

    //Sucesso//
    request.done(function (data){
        for (var i = 0; i < data.length; i++) {
            $('#rfAgencia').append("<option value='" + data[i].idAgencia + "'>" + data[i].nmAgencia + "</option>");
        }
    });

    //Erro//
    request.fail(function () {
        Swal.fire({
            type: 'warning',
            title: 'Por Favor preencha todos os campos!',
            timer:1000,
            showConfirmButton: false,
        });
    });
}
// ==========================================  FIM SELECIONAR AGENCIA =========================================================

// ============================================== COMEÇAR CADASTRA RF =========================================================
function cadastraRF(){ 
    
    //Verifica se todos os inputs possuem um valor valido,o uso do sweet alerts pode ser substituido pelo form do bootstrap//
    if($("#rfAgencia :selected").val() != null && $("#rfAgencia :selected").text() != null && $("#rfNavio :selected").val() != null & $("#rfNavio :selected").text() != null && $("#txtNome").val() !=""){
        
        //Bloqueia a tela do usuario e inseri um gif de loading//
        $.blockUI({
            message: '<img style="max-width:100px;max-height:100px;" src="assets/img/loading.gif" />',
            css: {
                border: 'none',
                backgroundColor: 'transparent'
            }
        });

        //Prepara as informações que serão inseridas no banco//
        var data={
            "idDescarga": 0,
            "idEmbarcacao": $("#rfNavio :selected").val(),
            "idUsuarioCad": 1,
            "idStatus": null,
            "idAgenciaNav": $("#rfAgencia :selected").val(),
            "escalaRf": $("#txtNome").val(),
            "numBl": "1",
            "dtCadastro": null,
            "dtLibera": null,
            "idUsuarioLibera": 1,
            "dtInicio": null,
            "dtFim": null,
            "dtHora": null,
            "idEmbarcacaoNavigation": null,
            "idUsuarioCadNavigation": null,
            "spiTbDescargaAtracacao": [],
            "spiTbDescargaDi": []
        };

        //Request Ajax//
        var requestItens = $.ajax({
            url: urlPostRF,
            method: "POST",
            headers: { 
                'Accept': 'application/json',
                'Content-Type': 'application/json' 
            },
            data:JSON.stringify(data),
            crossDomain: true
        });
        
        //Sucesso//
        requestItens.done(function (data) {
            Swal.fire({
                type: 'success',
                title: 'RF cadastrado com sucesso!',
                timer:1000,
                showConfirmButton: false,
            });
            
            //Remonta o formulario de cadastro de Di,contendo as informações da nova RF cadastrada//
            montaCadastroDI(data.idDescarga,data.idStatus,data.escalaRf,data.idEmbarcacao,data.idAgenciaNav);

           
            //Monta a tabela contendo todos os Dis daquele RF//
            montaTabelaCadastro(data.idDescarga);

            $("#txtNome").val("");

            //Desbloqueia a tela do usuario//
            $.unblockUI();
        });

        //Erro//
        requestItens.fail(function () {
            Swal.fire({
                    type: 'error',
                    title: 'Um erro ocorreu, por favor tente novamente!',
                    timer:1000,
                    showConfirmButton: false,
                    
            });

            //Desbloqueia a tela do usuario//
            $.unblockUI();
        });
    }
    else
    {   
        //Campos faltantes//
        Swal.fire({
            type: 'warning',
            title: 'Por Favor preencha todos os campos!',
            timer:1000,
            showConfirmButton: false,
        });
    }
}
// ================================================ FIM CADASTRA RF ===========================================================

// ============================================== COMEÇAR CONSULTA RF =========================================================
function consultaRF(){ 
    
    //Checa se o campo de nome do RF esta vazio//
    if($("#txtNome").val() !=""){
        
        //Bloqueia a tela do usuario e inseri um gif de loading//
        $.blockUI({
            message: '<img style="max-width:100px;max-height:100px;" src="assets/img/loading.gif" />',
            css: {
                border: 'none',
                backgroundColor: 'transparent'
            }
        });

        //Request Ajax//
        var requestItens = $.ajax({
            url: urlGetRF+"/search?numRF="+$("#txtNome").val(),
            method: "GET",
            crossDomain: true
        });
        
         //Sucesso//
        requestItens.done(function (data) {
            Swal.fire({
                type: 'success',
                title: 'RF encontrado com sucesso!',
                timer:1000,
                showConfirmButton: false,
            });

            //Remonta o formulario de cadastro de Di,contendo as informações da RF consultada//
            montaCadastroDI(data.idDescarga,data.idStatus,data.escalaRf,data.idEmbarcacao,data.idAgenciaNav);

            //Monta a tabela contendo todos os Dis daquele RF//
            montaTabelaCadastro(data.idDescarga);

            $("#txtNome").val("");

            //Desbloqueia a tela do usuario//
            $.unblockUI();
        });

        //Erro//
        requestItens.fail(function () {
            Swal.fire({
                    type: 'error',
                    title: 'Nenhum RF encontrado!',
                    timer:1000,
                    showConfirmButton: false
                    
            });

            //Desbloqueia a tela do usuario//
            $.unblockUI();
        });
    }
    else
    {
        //Campos Faltantes//
        Swal.fire({
            type: 'warning',
            title: 'Por Favor insira um RF!',
            timer:1000,
            showConfirmButton: false
        });
    }
}
// ================================================== FIM CONSULTA RF =========================================================

// ============================================= COMEÇAR MONTA CADASTRO DI ====================================================
function montaCadastroDI(idRF,idStatusRF,numeroRF,idNavio,idAgencia){ 

    //Estrutura de Di//
    var di='<div class="col-md-12">' +
    '<div class="card card-stats">' +
        '<div class="card-body">' +
            '<h5 style="display: inline-block;" id="formCadastroDi" class="card-title">Cadastro de Di (Escala RF '+numeroRF+')</h5>' +
            '<button onclick="editarRF(\''+idRF+'\',\''+idStatusRF+'\',\''+numeroRF+'\',\''+idNavio+'\',\''+idAgencia+'\')" class="justify-content-center btn  btn-info">Editar RF</button>' +
            '<div class="justify-content-center row">' +
                '<div class="form-group col-sm-3">' +
                    '<label class="col-form-label">Número</label>' +
                    '<input type="text" class="form-control" placeholder="Número..." id="CadastraDiNumero">' +
                '</div>' +
                '<div class="form-group col-sm-3">' +
                    '<label class="col-form-label">Produto</label>';
    
    //Função que retorna um dropdown contendo todos os produtos//
    selectProdutoCadastro("CadastraDiCarga",function(produto){
        di+=produto;
        di +='</div>' +
            '<div class="form-group col-sm-3">' +
                '<label class="col-form-label">Peso</label>' +
                '<input type="number" min="0" value="0" class="form-control" placeholder="Peso..." id="CadastraDiPeso">' +
            '</div>' +
            '<div class="form-group col-sm-3">' +
                '<label class="col-form-label">Importador</label>';

        //Função que retorna um dropdown contendo todas as empresas//
        selectEmpresaCadastro("CadastraDiEmpresa",function(empresa){
            di+=empresa;
            di+='</div>' +
            '</div>' +
            '<div class="justify-content-center row">' +
                '<div class="form-group col-sm-3">' +
                    '<label class="col-form-label">Medidor</label>';

            //Função que retorna um dropdown contendo todos os medidores//
            selectMedidorCadastro("CadastraDiMedidor",function(medidor){
                di+=medidor;
                di+='</div>' +
                '<div class="form-group col-sm-3">' +
                    '<label class="col-form-label">Número BL</label>' +
                    '<input type="text" value="0" class="form-control" placeholder="Número BL..." id="CadastraDiBL">' +
                '</div>' +
                '<div class="form-group col-sm-3">' +
                '<label class="col-form-label">Agencia</label>';

                //Função que retorna um dropdown contendo todas as agencias//
                selectPaisPortoCadastro("CadastraDiAgencia",function(agencia){
                    di+=agencia;
                    di+='</div>'+
                    '<div class="form-group col-sm-3">'+
                        '<label class="col-form-label">Terminal de Origem</label>';

                    //Função que retorna um dropdown contendo todos os terminais//
                    selectTerminalCadastro("CadastraDiPorto",function(terminal){
                        di+=terminal;
                            di+='</div>' +
                                '</div>' +
                                '<div class="card-footer text-right">' +
                                    '<div  class="form-check pull-left">' +
                                        '<label class="form-check-label">' +
                                            '<input id ="alfandega" class="form-check-input" type="checkbox" name="optionCheckboxes" required="">' +
                                            '<span class="form-check-sign"></span>' +
                                            'Alfândegada' +
                                        '</label>' +
                                    '</div>' +
                                    '<button class="justify-content-center btn btn-success" onclick="cadastrarDi('+idRF+')">Cadastrar</button>' +
                                '</div>' +
                            '</div>' +
                        '</div>' +
                        '</div>';

                        //Insere a estrutura do formulario de Di em seu div correspondente//
                        $('#cadastroDi').empty().append(di);
                    });
                });
            });
        });
    });
}
// =========================================== FIM MONTA CADASTRO DI ==========================================================

// ========================================== COMEÇAR SELECIONAR PRODUTO ======================================================
function selectProdutoCadastro(id,callback){

    //Request Ajax//
    var request = $.ajax({
        url: urlGetCarga,
        method: "GET"
    });
    
    //Sucesso//
    request.done(function (data){
        var produto='<select type="text" class="form-control" id="'+id+'"> ';
        for (var i = 0; i < data.length; i++) {
            produto+="<option value='" + data[i].idCarga + "'>" + data[i].nmCarga + "</option>";
        }
        produto+="</select>";
        callback(produto);
       
    });

    //Erro//
    request.fail(function () {
        Swal.fire({
                type: 'error',
                title: 'Nenhum RF encontrado!',
                timer:1000,
                showConfirmButton: false  
        });
    });

}
// ========================================== FIM SELECIONAR PRODUTO ==========================================================

// ========================================== COMEÇAR SELECIONAR EMPRESA ======================================================
function selectEmpresaCadastro(id,callback){

    //Request Ajax//
    var request = $.ajax({
        url: urlGetEmpresa,
        method: "GET"
    });

    //Sucesso//
    request.done(function (data){
        var empresa='<select type="text" class="form-control" id="'+id+'"> ';
        for (var i = 0; i < data.length; i++) {
            empresa+="<option value='" + data[i].idEmpresa + "'>" + data[i].nmEmpresa + "</option>";
        }
        empresa+="</select>";
        callback(empresa);
    });

    //Erro//
    request.fail(function () {
        Swal.fire({
                type: 'error',
                title: 'Nenhum RF encontrado!',
                timer:1000,
                showConfirmButton: false  
        });
    });
    
}
// ========================================== FIM SELECIONAR EMPRESA ==========================================================

// ========================================== COMEÇAR SELECIONAR PAIS =========================================================
function selectPaisPortoCadastro(id,callback){

    //Request Ajax//
    var request = $.ajax({
        url: urlGetAgencia,
        method: "GET"
    });

    //Sucesso//
    request.done(function (data){
        var agencia='<select type="text" class="form-control" id="'+id+'"> ';
        for (var i = 0; i < data.length; i++) {
            agencia+="<option value='" + data[i].idAgencia + "'>" + data[i].nmAgencia + "</option>";
        }
        agencia+="</select>";
        callback(agencia);
    });

    //Erro//
    request.fail(function () {
        Swal.fire({
                type: 'error',
                title: 'Nenhum RF encontrado!',
                timer:1000,
                showConfirmButton: false  
        });
    });
}
// ========================================== FIM SELECIONAR PAIS =============================================================

// ========================================== COMEÇAR SELECIONAR PORTO ========================================================
function selectTerminalCadastro(id,callback){

    //Request Ajax//
    var request = $.ajax({
        url: urlGetTerminal,
        method: "GET"
    });

    //Sucesso//
    request.done(function (data){
        var porto='<select type="text" class="form-control" id="'+id+'"> ';
        for (var i = 0; i < data.length; i++) {
            porto+="<option value='" + data[i].idPortoTerminal + "'>" + data[i].nmTerminal + "</option>";
        }
        porto+="</select>";
        callback(porto);
    });

    //Erro//
    request.fail(function () {
        Swal.fire({
                type: 'error',
                title: 'Nenhum RF encontrado!',
                timer:1000,
                showConfirmButton: false  
        });
    });
}
// ==========================================  FIM SELECIONAR PORTO ===========================================================

// ========================================== COMEÇAR SELECIONAR MEDIDOR ======================================================
function selectMedidorCadastro(id,callback){

    //Request Ajax//
    var request = $.ajax({
        url: urlGetMedidor,
        method: "GET"
    });

    //Sucesso//
    request.done(function (data){
        var medidor='<select type="text" class="form-control" id="'+id+'"> ';
        for (var i = 0; i < data.length; i++) {
            medidor+="<option value='" + data[i].idMedidor + "'>" + data[i].nmMedidor + "</option>";
        }
        medidor+="</select>";
        callback(medidor);
    });

    //Erro//
    request.fail(function () {
        Swal.fire({
                type: 'error',
                title: 'Nenhum RF encontrado!',
                timer:1000,
                showConfirmButton: false  
        });
    });
}
// ==========================================  FIM SELECIONAR MEDIDOR =========================================================

// ========================================== COMEÇAR SELECIONAR NAVIO ========================================================
function selectNavioCadastro(id,callback){

    //Request Ajax//
    var request = $.ajax({
        url: urlGetNavio,
        method: "GET"
    });

    //Sucesso//
    request.done(function (data){
        var embarcacao='<select type="text" class="form-control" id="'+id+'"> ';
        for (var i = 0; i < data.length; i++) {
            embarcacao+="<option value='" + data[i].idEmbarcacao + "'>" + data[i].nmEmbarcacao + "</option>";
        }
        embarcacao+="</select>";
        callback(embarcacao);
    });

    //Erro//
    request.fail(function () {
        Swal.fire({
                type: 'error',
                title: 'Nenhum RF encontrado!',
                timer:1000,
                showConfirmButton: false  
        });
    });
}
// ================================================ FIM SELECIONAR NAVIO ======================================================

// ================================================ COMEÇO CADASTRAR DI =======================================================
function cadastrarDi(idRF) {

    //Verifica se todos os campos foram preenchidos//
    if($("#CadastraDiNumero").val() != "" && $("#CadastraDiCarga :selected").val() != null && $("#CadastraDiPeso").val() != "" && $("#CadastraDiEmpresa :selected").val() != null && $("#CadastraDiMedidor :selected").val() !=null && $("#CadastraDiBL").val() !="" && $("#CadastraDiAgencia :selected").val() != null && $("#CadastraDiPorto :selected").val() != null){
        
        //Bloqueia a tela do usuario e inseri um gif de loading//
        $.blockUI({
            message: '<img style="max-width:100px;max-height:100px;" src="assets/img/loading.gif" />',
            css: {
                border: 'none',
                backgroundColor: 'transparent'
            }
        });

        //Prepara as informações que serão inseridas no banco//
        var data={
                "idDescargaDi": 0, 
                "idDescarga": idRF,
                "idMedidor": parseInt($("#CadastraDiMedidor :selected").val()),
                "idCarga": parseInt($("#CadastraDiCarga :selected").val()),
                "idPortoTerOri": parseInt($("#CadastraDiPorto :selected").val()),
                "idImportador": parseInt($("#CadastraDiEmpresa :selected").val()),
                "idAgenciaNav": parseInt($("#CadastraDiAgencia :selected").val()),
                "idUsuario": 1,
                "idStatus": 1,
                "numDi": $("#CadastraDiNumero").val(),
                "seqDescarga": quantidade_di,
                "qtdPlanejado": $("#CadastraDiPeso").val(),
                "qtdReal": 0,
                "difTon": 0,
                "difPorcento": 0,
                "carregadoPorcento": 0,
                "qtdRealRateio": 0,
                "difTonRateio": 0,
                "difPorcentoRateio": 0,
                "qtdRfRateio": 0,
                "numBl": $("#CadastraDiBL").val(),
                "dtHora": moment().format('YYYY-MM-DDTHH:mm:ss'),
                "idAgenciaNavNavigation": null,
                "idCargaNavigation": null,
                "idDescargaNavigation": null,
                "idImportadorNavigation": null,
                "idMedidorNavigation": null,
                "idPortoTerOriNavigation": null,
                "idStatusNavigation": null,
                "spiTbDiDraft": [],
                "spiTbDiPesagem": []
        };


        //Request Ajax//
        var requestItens = $.ajax({
            url: urlPostDi,
            method: "POST",
            headers: { 
                'Accept': 'application/json',
                'Content-Type': 'application/json' 
            },
            data:JSON.stringify(data),
            crossDomain: true
        });
        
        //Sucesso//
        requestItens.done(function (data) {
            Swal.fire({
                type: 'success',
                title: 'DI cadastrada com sucesso!',
                showConfirmButton: false,
                timer:1000
            });

            //Remonta a tabela contendo todos os Dis daquele RF//
            montaTabelaCadastro(idRF);

            //Desbloqueia a tela do usuario//
            $.unblockUI();   
        });


        //Erro//
        requestItens.fail(function () {
            Swal.fire({
                type: 'error',
                title: 'Houve um erro por favor tente novamente!',
                showConfirmButton: false,
                timer:1000
            });

            //Desbloqueia a tela do usuario//
            $.unblockUI();
        });     
    }
    else
    {   
        //Campos Faltantes//
        Swal.fire({
            type: 'warning',
            title: 'Por Favor preencha todos os campos!',
            showConfirmButton: false,
            timer:1000
        });
    }
}
// ================================================== FIM CADASTRO DI =========================================================

// ================================================== MONTA TABELA DI =========================================================
function montaTabelaCadastro(idRF){ 
    $("#tabela_di").empty();
    //Request Ajax//
    var requestDi = $.ajax({
        url: urlGetDi+"="+idRF,
        method: "GET",
        crossDomain: true
    });
    
    //Sucesso//
    requestDi.done(function (di) {

        //Estrutura Inicial da tabela//
        var table= '<div class="col-md-12">' +
        '<div class="card">' +
            '<div class="card-body" >' +
            '<button onclick="editarSequencia(\''+idRF+'\')" class="justify-content-center btn  btn-info">Editar Sequencia de DIs</button>'+
        "<table id='diTable' class='table table-striped table-bordered' cellspacing='0' width='100%'>" +
        "<thead>" +
            "<tr>" +
                '<th class="text-center">Seq</th>' +
                '<th class="text-center">Di</th>' +
                '<th class="text-center">Produto</th>' +
                '<th class="text-center">Peso</th>' +
                '<th class="text-center">Importador</th>' +
                '<th class="text-center">Medidor</th>' +
                '<th class="text-center">Bl</th>' +
                '<th class="text-center">Agencia</th>' +
                '<th class="text-center">Terminal Origem</th>' +
                '<th class="text-center">Opções</th>' +
            "</tr>" +
        "</thead>" +
        "<tbody>";
        
        //Decide qual será a sequencia da proxima Di a ser cadastrada nessa RF//
        if(di)
        {
            quantidade_di =di.length+1;
       
            //Loop para inserção das linhas do body da tabela,como não temos uma view para isso, temos que utilizar um nest de requests//
            for (var i = 0; i < di.length; i++) {

                
                
                //Request Ajax//
                var requestImportador = $.ajax({
                    url: urlGetEmpresa+"/"+di[i].idImportador,
                    method: "GET",
                    async:false,
                    crossDomain: true
                });

                //Sucesso//
                requestImportador.done(function (importador) {
                    var requestCarga = $.ajax({
                        url: urlGetCarga+"/"+di[i].idCarga,
                        method: "GET",
                        async:false,
                        crossDomain: true
                    });

                    //Sucesso//
                    requestCarga.done(function (carga) {
                        var requestTerminal = $.ajax({
                            url: urlGetTerminal+"/"+di[i].idPortoTerOri,
                            method: "GET",
                            async:false,
                            crossDomain: true
                        });

                        //Sucesso//
                        requestTerminal.done(function (terminal) {
                            var requestAgencia = $.ajax({
                                url: urlGetAgencia+"/"+di[i].idAgenciaNav,
                                method: "GET",
                                async:false,
                                crossDomain: true
                            });

                            //Sucesso//
                            requestAgencia.done(function (agencia) {

                                var requestMedidor = $.ajax({
                                    url: urlGetMedidor+"/"+di[i].idMedidor,
                                    method: "GET",
                                    async:false,
                                    crossDomain: true
                                });

                                //Sucesso//
                                requestMedidor.done(function (medidor) {

                                    //Monta as linhas da tabela com o resultados de todos os gets//
                                    table += '<tr id="'+di[i].idDescargaDi+'" >' +     
                                    '<td><center>'+ di[i].seqDescarga +'</center></td>' +
                                    '<td id ='+di[i].idDescargaDi+' ><center>'+ di[i].numDi +'</center></td>' +  
                                    '<td id ='+di[i].idCarga+' ><center>'+ carga.nmCarga +'</center></td>' +  
                                    '<td><center>'+ di[i].qtdPlanejado +'</center></td>' +
                                    '<td id ='+di[i].idImportador+' ><center>'+ importador.nmEmpresa +'</center></td>' +
                                    '<td id ='+di[i].idMedidor+' ><center>'+ medidor.nmMedidor +'</center></td>' + 
                                    '<td><center>'+ di[i].numBl +'</center></td>' +
                                    '<td id ='+di[i].idAgenciaNav+' ><center>'+ agencia.nmAgencia +'</center></td>' + 
                                    '<td id ='+di[i].idPortoTerOri+' ><center>'+ terminal.nmTerminal +'</center></td>' +
                                    '<td><center>' +
                                        '<button type="button" rel="tooltip" class="btn btn-simple btn-round btn-icon btn-sm"   onclick="editarDi(\''+idRF+'\',\''+di[i].seqDescarga+'\',\''+di[i].idStatus+'\',\''+di[i].idDescargaDi+'\',\''+di[i].numDi+'\',\''+di[i].idCarga+'\',\''+di[i].qtdPlanejado+'\',\''+di[i].idImportador+'\',\''+di[i].idMedidor+'\',\''+di[i].numBl+'\',\''+di[i].idAgenciaNav+'\',\''+di[i].idPortoTerOri+'\')"><i class="fa fa-edit"></i></button>' +
                                        '<button type="button" rel="tooltip" class="btn btn-simple btn-round btn-icon btn-sm"  onclick="deletarDi(\''+ di[i].idDescargaDi +'\',\''+idRF+'\')"><i class="now-ui-icons ui-1_simple-remove"></i></button>' +
                                    '</td> ' +
                                    '</tr>';
                                });

                                //Erro//
                                requestMedidor.fail(function () {
                                    Swal.fire({
                                        type: 'error',
                                        title: 'Houve um erro por favor tente novamente!',
                                        showConfirmButton: false,
                                        timer:1000
                                    });
                                }); 

                            });

                            //Erro//
                            requestAgencia.fail(function () {
                                Swal.fire({
                                    type: 'error',
                                    title: 'Houve um erro por favor tente novamente!',
                                    showConfirmButton: false,
                                    timer:1000
                                });
                            }); 

                        });

                        //Erro//
                        requestTerminal.fail(function () {
                            Swal.fire({
                                type: 'error',
                                title: 'Houve um erro por favor tente novamente!',
                                showConfirmButton: false,
                                timer:1000
                            });
                        }); 

                    });

                    //Erro//
                    requestCarga.fail(function () {
                        Swal.fire({
                            type: 'error',
                            title: 'Houve um erro por favor tente novamente!',
                            showConfirmButton: false,
                            timer:1000
                        });
                    }); 


                });

                //Erro//
                requestImportador.fail(function () {
                    Swal.fire({
                        type: 'error',
                        title: 'Houve um erro por favor tente novamente!',
                        showConfirmButton: false,
                        timer:1000
                    });
                }); 

                
            }
            //Close Table//
            table += '</tbody></table></div></div></div>';

            //Função que esconde div,instancia tabela e starta o Datatable//
            $('#tabela_di').fadeOut(500, function() {
                $(this).empty().hide().append(table).fadeIn("fast");
                $('#diTable').DataTable({
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
                    rowReorder: true,
                    responsive: true,
                });
            });
        }
        else
        {
            quantidade_di=1;
        }

    });
}
// ================================================ FIM MONTA TABELA DI =======================================================

// ================================================ COMEÇO SWEET ALERTS =======================================================

function editarDi (idRF,idSeq,idStatus,idDi,nomeDi,idProduto,peso,idImportador,idMedidor,BL,idAgencia,idTerminal){
       
    //Estrutura de Editar Di//
    var form ='<div class="col-md-12">' +
            '<div class="justify-content-center row">' +
                '<div class="form-group col-sm-3">' +
                    '<label class="col-form-label">Número</label>' +
                    '<input type="text" class="form-control" value=\''+nomeDi+'\' placeholder="Número..." id="EditaDiNumero">' +
                '</div>' +
                '<div class="form-group col-sm-3">' +
                    '<label class="col-form-label">Produto</label>';
    
    //Função que retorna um dropdown contendo todos os produtos//
    selectProdutoCadastro("EditaDiCarga",function(produto){
        form+=produto;
        form+='</div>' +
            '<div class="form-group col-sm-3">' +
                '<label class="col-form-label">Peso</label>' +
                '<input type="number" min="0" value="'+peso+'" class="form-control" placeholder="Peso..." id="EditaDiPeso">' +
            '</div>' +
            '<div class="form-group col-sm-3">' +
                '<label class="col-form-label">Importador</label>';
        
        //Função que retorna um dropdown contendo todas as empresas//
        selectEmpresaCadastro("EditaDiEmpresa",function(empresa){
            form+=empresa;
            form+='</div>' +
            '</div>' +
            '<div class="justify-content-center row">' +
                '<div class="form-group col-sm-3">' +
                    '<label class="col-form-label">Medidor</label>';

            //Função que retorna um dropdown contendo todos os medidores//
            selectMedidorCadastro("EditaDiMedidor",function(medidor){
                form+=medidor;
                form+='</div>' +
                '<div class="form-group col-sm-3">' +
                    '<label class="col-form-label">Número BL</label>' +
                    '<input type="text" class="form-control" value="'+BL+'" placeholder="Número BL..." id="EditaDiBL">' +
                '</div>' +
                '<div class="form-group col-sm-3">' +
                '<label class="col-form-label">Agencia</label>';

                //Função que retorna um dropdown contendo todas as Agencias//
                selectPaisPortoCadastro("EditaDiAgencia",function(agencia){
                    form+=agencia;
                    form+='</div>'+
                    '<div class="form-group col-sm-3">'+
                        '<label class="col-form-label">Porto de Origem</label>';

                        //Função que retorna um dropdown contendo todos os terminais//
                        selectTerminalCadastro("EditaDiPorto",function(terminal){
                        form+=terminal;
                        form+='</div>' +
                                '</div>' +
                                '<div class="text-right">' +
                                    '<div  class="form-check pull-left">' +
                                        '<label class="form-check-label">' +
                                            '<input id ="Editaralfandega" class="form-check-input" type="checkbox" name="optionCheckboxes" required="">' +
                                            '<span class="form-check-sign"></span>' +
                                            'Alfândegada' +
                                        '</label>' +
                                    '</div>' +
                                '</div>';
                        
                        //Sweet Alerts contendo a estrutura de editar Di recem montada//
                        Swal.fire({
                            title: 'Editar Di',
                            buttonsStyling: false,
                            confirmButtonClass: "justify-content-center btn btn-success btn-round ",
                            showCancelButton: true,
                            cancelButtonText: 'Cancelar',
                            cancelButtonClass: "justify-content-center btn btn-danger btn-round ",
                            confirmButtonText: 'Salvar',
                            width: "85%",
                            html: form,
                            reverseButtons:false, 
                            onOpen: () => {
                                //Após a montagem do HTML, os dropdowns são setados para os valores do elemento que esta sendo editado//
                                $("#EditaDiPorto").val(idTerminal);
                                $("#EditaDiCarga").val(idProduto);
                                $("#EditaDiEmpresa").val(idImportador);
                                $("#EditaDiAgencia").val(idAgencia);
                                $("#EditaDiMedidor").val(idMedidor);
                            }
                        }).then((result) => {
                            if (result.value) {

                                //Bloqueia a tela do usuario e inseri um gif de loading//
                                $.blockUI({
                                    message: '<img style="max-width:100px;max-height:100px;" src="assets/img/loading.gif" />',
                                    css: {
                                        border: 'none',
                                        backgroundColor: 'transparent'
                                    }
                                });

                                //Prepara as informações que serão inseridas no banco//
                                var data={
                                    "idDescargaDi": idDi, 
                                    "idDescarga": idRF,
                                    "idMedidor": $("#EditaDiMedidor").val(),
                                    "idCarga": $("#EditaDiCarga").val(),
                                    "idPortoTerOri": $("#EditaDiPorto").val(),
                                    "idImportador": $("#EditaDiEmpresa").val(),
                                    "idAgenciaNav": $("#EditaDiAgencia").val(),
                                    "idUsuario": 1,
                                    "idStatus":idStatus,
                                    "numDi": $("#EditaDiNumero").val(),
                                    "seqDescarga": idSeq,
                                    "qtdPlanejado": $("#EditaDiPeso").val(),
                                    "qtdReal": 0,
                                    "difTon": 0,
                                    "difPorcento": 0,
                                    "carregadoPorcento": 0,
                                    "qtdRealRateio": 0,
                                    "difTonRateio": 0,
                                    "difPorcentoRateio": 0,
                                    "qtdRfRateio": 0,
                                    "numBl": $("#EditaDiBL").val(),
                                    "dtHora": moment().format('YYYY-MM-DDTHH:mm:ss'),
                                    "idAgenciaNavNavigation": null,
                                    "idCargaNavigation": null,
                                    "idDescargaNavigation": null,
                                    "idImportadorNavigation": null,
                                    "idMedidorNavigation": null,
                                    "idPortoTerOriNavigation": null,
                                    "idStatusNavigation": null,
                                    "spiTbDiDraft": [],
                                    "spiTbDiPesagem": []
                                };

                                //Request Ajax//
                                var request = $.ajax({
                                    url: urlUpdateDi+"/"+idDi,
                                    method: "PUT",
                                    crossDomain:true,
                                    headers: { 
                                        'Accept': 'application/json',
                                        'Content-Type': 'application/json' 
                                    },
                                    data:JSON.stringify(data),
                                });
                                
                                //Sucesso//
                                request.done(function (data){

                                    Swal.fire({
                                        type: 'success',
                                        title: 'RF encontrado com sucesso!',
                                        text:'Di editada com sucesso!',
                                        timer:1000,
                                        showConfirmButton: false,
                                    });

                                    //Remonta a tabela contendo todos os Dis daquele RF//
                                    montaTabelaCadastro(idRF);

                                    //Desbloqueia a tela do usuario//
                                    $.unblockUI();    
                                });

                                //Erro//
                                request.fail(function (data){
                                
                                    Swal.fire({
                                        type: 'error',
                                        title: 'Um erro ocorreu por favor tente novamente!',
                                        timer:1000,
                                        showConfirmButton: false
                                        
                                    });

                                    //Desbloqueia a tela do usuario//
                                    $.unblockUI();
                                })   
                            };
                        });
                    });
                });
            });
        });
    });   
}

// ================================================ COMEÇO DELETAR DI ==================================================
function deletarDi(idDi,idRF){

    //Sweet Alerts de Confirmação//
    Swal.fire({
        title: 'Você tem certeza?',
        text: "Essa Di será deleteda permanentemente!",
        type: 'warning',
        showCancelButton: true,
        confirmButtonText: 'Sim',
        cancelButtonText: 'Não!',
        reverseButtons: false
    }).then((result) => {
        if (result.value) {

            //Bloqueia a tela do usuario e inseri um gif de loading//
            $.blockUI({
                message: '<img style="max-width:100px;max-height:100px;" src="assets/img/loading.gif" />',
                css: {
                    border: 'none',
                    backgroundColor: 'transparent'
                }
            });

            //Request Ajax//
            var request = $.ajax({
                url: urlDeleteDi+"/"+idDi,
                method: "DELETE",
                crossDomain:true
            });
    
            //Sucesso//
            request.done(function (data){
                Swal.fire({
                    type: 'success',
                    title: 'Deletado!',
                    text:'Usuário deletado com sucesso!',
                    timer:1000,
                    showConfirmButton: false,
                });
                
                //Remonta a tabela contendo todos os Dis daquele RF//
                montaTabelaCadastro(idRF);

                //Desbloqueia a tela do usuario//
                $.unblockUI();

            })

            //Erro//
            request.fail(function (data){
                Swal.fire({
                    type: 'error',
                    title: 'Um erro ocorreu por favor tente novamente!',
                    timer:1000,
                    showConfirmButton: false
                    
                });

                //Desbloqueia a tela do usuario//
                $.unblockUI();
            })
            
        } 
    });
}
// ================================================ FIM DELETAR DI=======================================================

// ================================================ COMEÇO EDITAR RF ==================================================
function editarRF (idRF,idStatusRF,numeroRF,idNavio,idAgencia){

    //Estrutra de Editar RF//
    var form ='<div class="col-md-12">' +
            '<div class="justify-content-center row">' +
                '<div class="form-group col-sm-3">' +
                    '<label class="col-form-label">EscalaRF</label>' +
                    '<input type="text" class="form-control" value="'+numeroRF+'" placeholder="Número..." id="EditaDescargaNumero">' +
                '</div>' +
                '<div class="form-group col-sm-3">' +
                    '<label class="col-form-label">Navio</label>';
    
    //Função que retorna um dropdown contendo todos os navios//
    selectNavioCadastro("EditaDescargaNavio",function(navio){
        form+=navio;
        form+='</div>' +
            '<div class="form-group col-sm-3">' +
                '<label class="col-form-label">Agência</label>';

        //Função que retorna um dropdown contendo todas as agencias//
        selectAgenciaCadastro("EditaDescargaAgencia",function(agencia){
            form+=agencia;
            form+='</div>' +
            '</div>' +
            '</div>';
            
            //Sweet Alerts contendo a estrutura de editar RF recem montada//
            Swal.fire({
                title: 'Editar RF',
                buttonsStyling: false,
                confirmButtonClass: "justify-content-center btn btn-success btn-round ",
                showCancelButton: true,
                cancelButtonText: 'Cancelar',
                cancelButtonClass: "justify-content-center btn btn-danger btn-round ",
                confirmButtonText: 'Salvar',
                width: "85%",
                html: form,
                reverseButtons:false, 
                onOpen: () => {
                    //Após a montagem do HTML, os dropdowns são setados para os valores do elemento que esta sendo editado//
                    $("#EditaDescargaNavio").val(idNavio);
                    $("#EditaDescargaAgencia").val(idAgencia);
                }
            }).then((result) => {
                if (result.value) {

                    //Bloqueia a tela do usuario e inseri um gif de loading//
                    $.blockUI({
                        message: '<img style="max-width:100px;max-height:100px;" src="assets/img/loading.gif" />',
                        css: {
                            border: 'none',
                            backgroundColor: 'transparent'
                        }
                    });

                    //Prepara as informações que serão inseridas no banco//
                    var data={
                        "idDescarga":parseInt(idRF),
                        "idEmbarcacao":parseInt($("#EditaDescargaNavio").val()),
                        "idUsuarioCad": 1,
                        "idStatus":parseInt(idStatusRF),
                        "idAgenciaNav":parseInt($("#EditaDescargaAgencia").val()),
                        "escalaRf":$("#EditaDescargaNumero").val(),
                        "dtCadastro": "2019-01-15T00:00:00",
                        "dtLibera": null,
                        "idUsuarioLibera": 1,
                        "dtInicio": null,
                        "dtFim": null,
                        "dtHora": "2019-01-15T00:00:00",
                        "idEmbarcacaoNavigation": null,
                        "idUsuarioCadNavigation": null,
                        "spiTbDescargaAtracacao": [],
                        "spiTbDescargaDi": []
                    };
                    
                    //Request Ajax//
                    var request = $.ajax({
                        url: urlUpdateDescarga+"/"+idRF,
                        method: "PUT",
                        crossDomain:true,
                        headers: { 
                            'Accept': 'application/json',
                            'Content-Type': 'application/json' 
                        },
                        data:JSON.stringify(data),
                    });
                    

                    //Sucesso//
                    request.done(function (data){
                        Swal.fire({
                            type: 'success',
                            title: 'Editado!',
                            text:'Di editada com sucesso!',
                            timer:1000,
                            showConfirmButton: false,
                        });

                        //Remonta a tabela contendo todos os Dis daquele RF//
                        montaTabelaCadastro(data.idDescarga);

                        montaCadastroDI(data.idDescarga,data.idStatus,data.escalaRf,data.idEmbarcacao,data.idAgenciaNav);
                        $.unblockUI();    
                    });

                    //Error//
                    request.fail(function (data){
                        Swal.fire({
                            type: 'error',
                            title: 'Um erro ocorreu por favor tente novamente!',
                            timer:1000,
                            showConfirmButton: false
                            
                        });

                        //Desbloqueia a tela do usuario//
                        $.unblockUI();
                    })
                    
                }
            })
        });
    });   
}
// ================================================ FIM EDITAR RF=======================================================

// ================================================ COMEÇO EDITAR SEQUENCIA ==================================================
function editarSequencia(idRF){

    //Sweet Alert de confirmação//
    Swal.fire({
        title: 'Reordenar DIs?',
        type: 'warning',
        showCancelButton: true,
        confirmButtonText: 'Sim',
        cancelButtonText: 'Não!',
        reverseButtons: false,
        
    }).then((result) => {
        if (result.value) {
            
            //Dicionario contendo as sequencias das Dis que serao reordenadas//
            var sequencia =[];

            //Bloqueia a tela do usuario e inseri um gif de loading//
            $.blockUI({
                message: '<img style="max-width:100px;max-height:100px;" src="assets/img/loading.gif" />',
                css: {
                    border: 'none',
                    backgroundColor: 'transparent'
                }
            });

            //Varre a tabela e pega todas as Dis e suas sequencias//
            $('#diTable tr').each(function (i, row) {
                sequencia[$(this).attr("id")]=$(this).find('td').eq(0).text();
            });

            //Request Ajax//
            var requestDi = $.ajax({
                url: urlGetDi+"="+idRF,
                method: "GET",
                crossDomain: true
            });

            //Sucesso//
            requestDi.done(function (di) {

                //Popula o dicionario//
                for (var i = 0; i < di.length; i++) {
                    di[i].seqDescarga =sequencia[di[i].idDescargaDi];
                }

                //Request Ajax//
                var requestSequencia = $.ajax({
                    url: urlSequenciaDi,
                    method: "POST",
                    headers: { 
                        'Accept': 'application/json',
                        'Content-Type': 'application/json' 
                    },
                    data:JSON.stringify(di),
                    crossDomain: true
                });

                //Sucesso//
                requestSequencia.done(function (data) {
                    Swal.fire({
                        type: 'success',
                        title: 'Sucesso!',
                        text:'Dis reordenadas com sucesso!',
                        timer:1000,
                        showConfirmButton: false,
                    });

                    //Remonta a tabela contendo todos os Dis daquele RF//
                    montaTabelaCadastro(idRF);

                    //Desbloqueia a tela do usuario//
                    $.unblockUI();
                });

                //Erro//
                requestSequencia.fail(function (){
                    Swal.fire({
                        type: 'error',
                        title: 'Um erro ocorreu por favor tente novamente!',
                        timer:1000,
                        showConfirmButton: false
                        
                    });

                    //Desbloqueia a tela do usuario//
                    $.unblockUI();
                });

            });

            //Erro//
            requestDi.fail(function (){
                Swal.fire({
                    type: 'error',
                    title: 'Um erro ocorreu por favor tente novamente!',
                    timer:1000,
                    showConfirmButton: false
                    
                });

                //Desbloqueia a tela do usuario//
                $.unblockUI();
            });  
        } 
    })
 
}
// ================================================ FIM EDITAR SEQUENCIA=======================================================

// ================================================ COMEÇO NUMERO ALFANDEGA ===================================================
$('body').on('click', '#alfandega', function() {

    //Checa se o checkbox foi selecionado e altera o campo de nome de DI para um valor padrao//
    if ($(this).is(':checked')) {
      $("#CadastraDiNumero").val("2019/2222");
      $("#CadastraDiNumero").prop('disabled', true);
    }
    else{
        $("#CadastraDiNumero").val("");
        $("#CadastraDiNumero").prop('disabled', false);
    }
});

$('body').on('click', '#Editaralfandega', function() {
    //Checa se o checkbox foi selecionado e altera o campo de nome de DI do form editar para um valor padrao//
    if ($(this).is(':checked')) {
      $("#EditaDiNumero").val("2019/2222");
      $("#EditaDiNumero").prop('disabled', true);
    }
    else{
        $("#EditaDiNumero").val("");
        $("#EditaDiNumero").prop('disabled', false);
    }
});
// ================================================ FIM NUMERO ALFANDEGA =======================================================