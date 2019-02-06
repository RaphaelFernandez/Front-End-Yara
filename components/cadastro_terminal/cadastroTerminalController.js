
//=========================    URL'S ===================================

var urlPortoTerminal = null;

$.getJSON("assets/urls.json", function (data) {
    urlPortoTerminal = data.urlPortoTerminal;
});
//=========================   FIM URL'S ===================================

angular.module("yara")
    .controller("cadastroTerminalController", function ($scope, $http) {
        $scope.$on('$viewContentLoaded', function () {
            montaTabelaTerminal();
            selectPorto();
        });
    });


// ================================================ CADASTRAR TERMINAL =================================================

function cadastrarPortoTerminal() {

    var porto = $('#cmbPorto').val();
    var terminal = $('#txtTerminal').val();
    var sigla = $('#numSigla').val();

    if (porto != '' || terminal != '' || sigla != '') {

        $.blockUI({
            message: '<img style="max-width:100px;max-height:100px;" src="assets/img/loading.gif" />',
            css: {
                border: 'none',
                backgroundColor: 'transparent'
            }
        });

        var data = {
            idPorto: porto,
            nmTerminal: terminal,
            nmSigla: sigla
        }

        $.ajax({
            type: "POST",
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            url: urlPortoTerminal,
            dataType: "json",
            data: JSON.stringify(data),
            success: function (sucesso) {
                montaTabelaTerminal();
                $.unblockUI();
                swal("Cadastrado com sucesso!", "", "success");
            },
            error: function (data) {
                $.unblockUI();
                swal("Houve um erro com o cadastro!", "", "error");
            }
        });
        $(document).ajaxStop($.unblockUI);
    } else {
        swal("Preencha todos os campos", "", "warning")
    }
}
// ================================================ FIM CADASTRAR TERMINAL =======================================================

// // ===================================================== MONTA TABELA =======================================================
function montaTabelaTerminal() {

    var requestItens = $.ajax({
        url: urlPortoTerminal,
        method: "GET",
        crossDomain: true
    });

    //Table Structure//
    var table = "<table id='tblTerminal' class='table table-striped table-bordered' cellspacing='0' width='100%'>" +
        "<thead>" +
        '<tr>' +
        '<th class="text-center">Porto</th>' +
        '<th class="text-center">Terminal</th>' +
        '<th class="text-center">Sigla</th>' +
        '<th class="text-center">Opções</th>' +
        '</tr>' +
        "</thead>" +
        "<tbody>";

    requestItens.done(function (data) {

        var requestPorto = $.ajax({
            url: urlPorto,
            method: "GET",
            crossDomain: true
        });

        requestPorto.done(function (porto) {
            var terminalPorto;

            data.forEach(terminal => {
                terminalPorto = porto.filter(x => {
                    return x.idPorto == terminal.idPorto;
                })
                //Body//
                table += '<tr  value="' + terminal.idPortoTerminal + '">' +
                    '<td class="text-center">' + terminalPorto[0].nmPorto + '</td>' +
                    '<td class="text-center">' + terminal.nmTerminal + '</td>' +
                    '<td class="text-center">' + terminal.nmSigla + '</td>' +
                    '<td class="text-center">' +
                    '<button type="button" rel="tooltip" class="btn btn-simple btn-round btn-icon btn-sm" id="btnExcluir' + terminal.idPortoTerminal + '" data-toggle="modal" data-target="#exampleModal" onclick="deletar_PortoTerminal(' + terminal.idPortoTerminal + ')">' +
                    '<i class="now-ui-icons ui-1_simple-remove"></i>' +
                    '</button>' +
                    '</td>' +
                    '</tr>';

            })


            //Close Table//
            table += '</tbody></table>';

            //Função que esconde div,instancia tabela e starta o Datatable//
            $('#div_tabela').fadeOut(500, function () {
                $(this).empty().hide().append(table).fadeIn("fast");

                $('#tblTerminal').DataTable({
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

// ==========================================  SELECIONAR PORTO ==========================================
function selectPorto() {

    $('#cmbPorto').find("option").remove();
    var request = $.ajax({
        url: urlPorto,
        method: "GET"
    });

    request.done(function (data) {
        $('#cmbPorto').append("<option value='0'>Selecione</option>");

        for (var i = 0; i < data.length; i++) {
            $('#cmbPorto').append("<option value='" + data[i].idPorto + "'>" + data[i].nmPorto + "</option>");
        }
    })
}
// ==========================================  FIM SELECIONAR PORTO ==========================================


// // ===================================== FIM EDITAR EMPRESA ==================================================

function deletar_PortoTerminal(idPortoTerminal) {
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
            url: urlPortoTerminal + "/" + idPortoTerminal,
            crossDomain: true,
            success: function (sucesso) {
                montaTabelaTerminal();
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
                'Cancelado',
                'O registro não foi excluído',
                'error'
            )
        }
    })
}