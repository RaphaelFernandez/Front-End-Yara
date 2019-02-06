
//=========================    URL'S ===================================
var urlGetDepartamento = null;
var urlGetUsuario = null;
var urlGetPerfil = null;
var urlPutCadastraUsuario = null;
var urlPutEditaUsuario = null;
var urlDeletaUsuario = null;

$.getJSON( "assets/urls.json", function( data ) {
    urlGetDepartamento = data.urlGetDepartamento;
    urlGetUsuario = data.urlGetUsuario;
    urlPutCadastraUsuario = data.urlPutCadastraUsuario;
    urlPutEditaUsuario = data.urlPutEditaUsuario;
    urlDeletaUsuario = data.urlDeletaUsuario;
    urlGetPerfil = data.urlGetPerfil;
  });

//=========================   FIM URL'S ================================



angular.module("yara")
.controller("cadastroUsuariosController",function($scope, $http){
    $scope.$on('$viewContentLoaded', function(){
    
        getDepartamento("cadastraUsuarioDepartamento","");
        getAcesso("cadastraUsuarioAcesso","");
        montaTabelaCadastroUsuario();

    });
});

    
    // ==========================================  SELECIONAR ACESSO ==========================================
    function getAcesso(idInput,selectedOption){

        $('#'+idInput).find("option").remove();

        var request = $.ajax({
            url: urlGetPerfil,
            method: "GET",
            crossDomain:true
        });

        request.done(function (data){
            for (var i = 0; i < data.length; i++) {
                $('#'+idInput).append("<option value='" + data[i].idPerfil + "'>" + data[i].nmPerfil + "</option>");
            }
            if(selectedOption !="")
            {
                $('#'+idInput).val(selectedOption);

            }
        })
    }
    // ==========================================  FIM SELECIONAR ACESSO ==========================================

    // ==========================================  SELECIONAR DEPARTAMENTO ==========================================
    function getDepartamento(idInput,selectedOption){

        $('#'+idInput).find("option").remove();

        var request = $.ajax({
            url: urlGetDepartamento,
            method: "GET",
            crossDomain:true
        });

        request.done(function (data){
            for (var i = 0; i < data.length; i++) {
                $('#'+idInput).append("<option value='" + data[i].idDepartamento + "'>" + data[i].descDepartamento + "</option>");
            }
            if(selectedOption !="")
            {
                $('#'+idInput).val(selectedOption);

            }
        })
    }
    // ==========================================  FIM SELECIONAR DEPARTAMENTO ==========================================

    // ==========================================  CADASTRA USUARIO ==========================================
    function cadastraUsuario(){

        //Verifica se todos os campos foram preenchidos//
        if($("#cadastraUsuarioNome").val() != null && $("#cadastraUsuarioDepartamento :selected").val() != null && $("#cadastraUsuarioAcesso :selected").val() != null & $("#cadastraUsuarioCargo").val() != "" && $("#cadastraUsuarioEmail").val() !="" && $("#cadastraUsuarioLogin").val() !="" && $("#cadastraUsuarioSenha").val() !="" && $(".fileinput-preview img").attr("src") !== undefined){
            
            $.blockUI({
                message: '<img style="max-width:100px;max-height:100px;" src="assets/img/loading.gif" />',
                css: {
                    border: 'none',
                    backgroundColor: 'transparent'
                }
            });
            var data={
                "idUsuario": 0,
                "idPerfil": 1,
                "idDepartamento": $("#cadastraUsuarioDepartamento :selected").val(),
                "nmUsuario": $("#cadastraUsuarioNome").val(),
                "email": $("#cadastraUsuarioEmail").val(),
                "descCargo": $("#cadastraUsuarioCargo").val(),
                 "fileAssinatura": $(".fileinput-preview img").attr("src"),
                //"fileAssinatura": null,
                "login": $("#cadastraUsuarioLogin").val(),
                "senha": $("#cadastraUsuarioUsuario").val(),
                "dtCadastro": moment().format('YYYY-MM-DDTHH:mm:ss'),
                "dtUltAcesso": null,
                "ativo": true
            };
            console.log(data);

            var requestItens = $.ajax({
                url: urlPutCadastraUsuario,
                method: "POST",
                headers: { 
                    'Accept': 'application/json',
                    'Content-Type': 'application/json' 
                },
                data:JSON.stringify(data),
                crossDomain: true
            });
            
            requestItens.done(function (data) {
                console.log(data);
                Swal.fire({
                    type: 'success',
                    title: 'Usuario cadastrado com sucesso!',
                    showConfirmButton: false,
                    timer:1500
                });
                montaTabelaCadastroUsuario();
                $.unblockUI();
            });

            requestItens.fail(function (data) {
                Swal.fire({
                    type: 'error',
                    title: 'Houve um erro por favor tente novamente!',
                    showConfirmButton: false,
                    timer:1500
                });
                $.unblockUI();
            });     
        }
        else
        {
            Swal.fire({
                type: 'warning',
                title: 'Por Favor preencha todos os campos!',
                showConfirmButton: false,
                timer:1000
            });
        }
    }
    // ==========================================  FIM CADASTRA USUARIO ==========================================

    // ==========================================  SELECIONAR USUARIO ==========================================
    function montaTabelaCadastroUsuario(){

        var departamentos =[];
        var perfils =[];
        var requestDepartamento = $.ajax({
            url: urlGetDepartamento,
            method: "GET",
            crossDomain:true
        });

        requestDepartamento.done(function (departamento){

            for (var i = 0; i < departamento.length; i++) {
                departamentos[departamento[i].idDepartamento]=departamento[i].descDepartamento;
                
            }
            var requestPerfil = $.ajax({
                url: urlGetPerfil,
                method: "GET",
                crossDomain: true
            });
           
            requestPerfil.done(function (perfil) {
                for (var i = 0; i < perfil.length; i++) {
                    perfils[perfil[i].idPerfil]=perfil[i].nmPerfil;
                    
                }
                var requestUsuario = $.ajax({
                    url: urlGetUsuario,
                    method: "GET",
                    crossDomain: true
                });
        
                requestUsuario.done(function (usuario) {
                    //Table Structure//
                    var table=
                    '<div class="col-md-12">' +
                        '<div class="card">' +
                            '<div class="card-body"></div>' +
                            '<table id="usuariosTable" class="table table-striped table-bordered" cellspacing="0" width="100%">' +
                                '<thead>' +
                                    '<tr>' +
                                        '<th class="text-center">Nome</th>' +
                                        '<th class="text-center">Email</th>' +
                                        '<th class="text-center">Departamento</th>' +
                                        '<th class="text-center">Acesso</th>' +
                                        '<th class="text-center">Cargo</th>' +
                                        '<th class="text-center">Login</th>' +
                                        '<th class="text-center">Ativo</th>' +
                                    '</tr>' +
                                '</thead>' +
                                '<tbody>';

                    //Body//
                    for (var i = 0; i < usuario.length; i++) {
                        table += '<tr id='+usuario[i].idUsuario+' >' +      
                            '<td><center>'+ usuario[i].nmUsuario +'</center></td>' +
                            '<td><center>'+ usuario[i].email +'</center></td>' +
                            '<td id='+ usuario[i].idDepartamento+'><center>'+ departamentos[usuario[i].idDepartamento] +'</center></td>' +  
                            '<td id='+ usuario[i].idPerfil+'><center>'+ perfils[usuario[i].idPerfil] +'</center></td>' + 
                            //'<td id=\'1\'><center>Operador</center></td>' +   
                            '<td><center>'+ usuario[i].descCargo +'</center></td>' +
                            '<td><center>'+ usuario[i].login +'</center></td>' +
                            '<td><center>' +
                            '<button type="button" onclick="sweetUsuario(\'EDITAR\',\''+usuario[i].idUsuario+'\',\''+usuario[i].nmUsuario+'\',\''+usuario[i].email+'\',\''+usuario[i].idDepartamento+'\',\''+'2'+'\',\''+usuario[i].descCargo+'\',\''+usuario[i].login+'\')" class="btn btn-simple btn-round btn-icon btn-sm"><i class="fa fa-edit"></i></button>' +
                            '<button type="button" onclick="sweetUsuario(\'DELETAR\',\''+usuario[i].idUsuario+'\',\''+usuario[i].nmUsuario+'\',\''+usuario[i].email+'\',\''+usuario[i].idDepartamento+'\',\''+'2'+'\',\''+usuario[i].descCargo+'\',\''+usuario[i].login+'\')" class="btn btn-simple btn-round btn-icon btn-sm"><i class="now-ui-icons ui-1_simple-remove"></i></button>' +
                            '</td> ' +
                            '</tr>';
                    };

                    table+="</body></table></div></div></div>";

                    //Função que esconde div,instancia tabela e starta o Datatable//
                    $('#divTabelaUsuario').fadeOut(500, function() {
                        $(this).empty().hide().append(table).fadeIn("fast");
                        $('#usuariosTable').DataTable({
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
        });

    }
    // ==========================================  FIM SELECIONAR USUARIO ==========================================

    // ==========================================  SWEET ALERT ==========================================
    function sweetUsuario(acao,idUsuario,nome,email,idDepartamento,idAcesso,cargo,login){
        if(acao =="EDITAR")
        {
            Swal.fire({
                title: 'Editar Usuario',
                buttonsStyling: false,
                confirmButtonClass: "justify-content-center btn btn-success btn-round ",
                showCancelButton: true,
                cancelButtonText: 'Cancelar',
                cancelButtonClass: "justify-content-center btn btn-danger btn-round ",
                confirmButtonText: 'Salvar',
                width: "85%",
                html: '<div class="row">' +
                    '<div class="col-md-3">' +
                    '<label>Nome</label>' +
                    '<div class="form-group">' +
                    '<input id="editarCadastroUsuarioNome" type="text" value='+nome+' class="form-control" placeholder="Nome...">' +
                    '</div>' +
                    '</div>' +
    
                    '<div class="col-md-3">' +
                    '<label>Departamento</label>' +
                    '<div class="form-group">' +
                    '<select id="editarCadastroUsuarioDepartamento" type="text" class="form-control" placeholder="Departamento..."></select>' +
                    '</div>' +
                    '</div>' +
    
                    '<div class="col-md-3">' +
                    '<label>Acesso</label>' +
                    '<div class="form-group">' +
                    '<select id="editarCadastroUsuarioAcesso" type="text" class="form-control" placeholder="Acesso..."></option></select>' +
                    '</div>' +
                    '</div>' +
                    '<div class="col-md-3">' +
                    '<label>Cargo</label>' +
                    '<div class="form-group">' +
                    '<input id="editarCadastroUsuarioCargo" type="text" value="'+cargo+'" class="form-control" placeholder="Cargo...">' +
                    '</div>' +
                    '</div>' +
                    '</div>' +
    
                    '<div class="row">' +
                    
                    '<div class="col-md-4">' +
                    '<label>Email</label>' +
                    '<div class="form-group">' +
                    '<input id="editarCadastroUsuarioEmail" type="text" class="form-control" value='+email+' placeholder="Email...">' +
                    '</div>' +
                    '</div>' +

                    '<div class="col-md-4">' +
                    '<label>Login</label>' +
                    '<div class="form-group">' +
                    '<input id="editarCadastroUsuarioLogin" type="text" class="form-control" value='+login+' placeholder="Login...">' +
                    '</div>' +
                    '</div>' +
    
                    '<div class="col-md-4">' +
                    '<label>Senha</label>' +
                    '<div class="form-group">' +
                    '<input id="editarCadastroUsuarioSenha" type="password" class="form-control" placeholder="Senha...">' +
                    '</div>' +
                    '</div>' +
                    '</div>' +
                    '</div>',
                onOpen: () => {
                    getDepartamento("editarCadastroUsuarioDepartamento",idDepartamento);
                    getAcesso("editarCadastroUsuarioAcesso",idAcesso);
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
                    var data={
                        "idUsuario":parseInt(idUsuario),
                        "idPerfil": parseInt($("#editarCadastroUsuarioAcesso :selected").val()),
                        "idDepartamento": parseInt($("#editarCadastroUsuarioDepartamento :selected").val()),
                        "nmUsuario": $("#editarCadastroUsuarioNome").val(),
                        "email": $("#editarCadastroUsuarioEmail").val(),
                        "descCargo": $("#editarCadastroUsuarioCargo").val(),
                        "fileAssinatura": null,
                        "login": $("#editarCadastroUsuarioLogin").val(),
                        "senha": $("#editarCadastroUsuarioSenha").val(),
                        "dtCadastro": null,
                        "dtUltAcesso": null,
                        "ativo": true
                    };
                    var request = $.ajax({
                        url: urlPutEditaUsuario+"/"+idUsuario,
                        method: "PUT",
                        crossDomain:true,
                        headers: { 
                            'Accept': 'application/json',
                            'Content-Type': 'application/json' 
                        },
                        data:JSON.stringify(data),
                    });
            
                    request.done(function (data){
                        console.log(data);
                        Swal.fire(
                            'Editado!',
                            'Usuário editado com sucesso!',
                            'success'
                        );
                        montaTabelaCadastroUsuario();
                        $.unblockUI();    
                    })
                    request.fail(function (data){
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

        if(acao =="DELETAR")
        {
            Swal.fire({
                title: 'Você tem certeza?',
                text: "Esse usuário será deletedo permanentemente!",
                type: 'warning',
                showCancelButton: true,
                confirmButtonText: 'Sim',
                cancelButtonText: 'Não!',
                reverseButtons: false
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
                        url: urlDeletaUsuario+"/"+idUsuario,
                        method: "DELETE",
                        crossDomain:true
                    });
            
                    request.done(function (data){

                        Swal.fire(
                            'Deletado!',
                            'Usuário deletado com sucesso!',
                            'success'
                        )
                        montaTabelaCadastroUsuario();
                        $.unblockUI();

                    })
                    request.fail(function (data){
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
    }
    // ==========================================  FIM SWEET ALERT ==========================================



