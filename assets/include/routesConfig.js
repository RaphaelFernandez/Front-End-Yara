angular.module("yara", ["ngRoute"]).config(function ($routeProvider, $locationProvider) {
	$routeProvider.when('/monitoramento_descarga', {
		templateUrl: 'components/monitoramento_descarga/monitoramento_descarga.html',
		controller: 'monitoramentoDescargaController',

	})

		.when('/cadastro_usuarios', {
			templateUrl: 'components/cadastro_usuarios/cadastro_usuarios.html',
			controller: 'cadastroUsuariosController'
		})

		.when('/cadastro_embarcacao', {
			templateUrl: 'components/cadastro_embarcacao/cadastro_embarcacao.html',
			controller: 'cadastroEmbarcacaoController'
		})

		.when('/cadastro_terminal', {
			templateUrl: 'components/cadastro_terminal/cadastro_terminal.html',
			controller: 'cadastroTerminalController'
		})

		.when('/cadastro_produtos', {
			templateUrl: 'components/cadastro_produtos/cadastro_produtos.html',
			controller: 'cadastroProdutosController'
		})

		.when('/liberacao_descarga', {
			templateUrl: 'components/liberacao_descarga/liberacao_descarga.html',
			controller: 'liberacaoDescargaController'
		})
		.when('/tela_monitoramento_rfb', {
			templateUrl: 'components/tela_monitoramento_rfb/tela_monitoriamento_rfb.html',
			controller: 'monitoramentoRFBController'
		})
		.when('/cadastro_operacao', {
			templateUrl: 'components/cadastro_operacao/cadastro_operacao.html',
			controller: 'cadastroOperacaoController'
		})
		.when('/relatorio', {
			templateUrl: 'components/relatorio/relatorio.html',
			controller: 'relatorioController'
		})
		.when('/ajuda', {
			templateUrl: 'components/ajuda/ajuda.html',
			controller: 'ajudaController'
		})
		.when('/consulta_rf', {
			templateUrl: 'components/consulta_rf/consulta_rf.html',
			controller: 'consultaRFController'
		})
		.when('/cadastro_berco', {
			templateUrl: 'components/cadastro_berco/cadastro_berco.html',
			controller: 'cadastroBercoController'
		})
		.when('/pesagem', {
			templateUrl: 'components/pesagem/pesagem.html',
			controller: 'pesagemController'
		})
		.when('/cadastro_porto', {
			templateUrl: 'components/cadastro_porto/cadastro_porto.html',
			controller: 'cadastroPortoController'
		})
		.when('/relatorio_diario_terminal', {
			templateUrl: 'components/relatorio_diario_terminal/relatorio_diario_terminal.html',
			controller: 'relatorioDiarioTerminalController'
		})
		.when('/transferencia_pesagem', {
			templateUrl: 'components/transferencia_pesagem/transferencia_pesagem.html',
			controller: 'transferenciaPesagemController'
		})
		.when('/rateio', {
			templateUrl: 'components/rateio/rateio.html',
			controller: 'rateioController'
		})

		.when('/monitoramento_descarga', {
			templateUrl: 'components/monitoramento_descarga/monitoramento_descarga.html',
			controller: 'monitoramentoDescargaController'
		})

		.when('/cadastro_tolerancia', {
			templateUrl: 'components/cadastro_tolerancia/cadastro_tolerancia.html',
			controller: 'cadastroToleranciaController'
		})
		
		.when('/descarga_manual', {

			templateUrl: 'components/descarga_manual/descarga_manual.html',

			controller: 'descargaManualController'

		})

		.when('/cadastro_empresas', {
			templateUrl: 'components/cadastro_empresas/cadastro_empresas.html',
			controller: 'cadastroEmpresasController'
		});
	//Rota Padrao a definir//
	// $routeProvider.otherwise({redirectTo:"/clone"});
	$locationProvider.hashPrefix('');
});