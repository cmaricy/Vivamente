/*
* Este script representa o controller do Angular da 
* view questionario.ejs.
*/ 

// Criando um modulo que será chamado vivamente
var app = angular.module("vivavamente",[]);

// Adicionando um controlador ao modulo e passando como argumento
// o escopo e o http do angular.js
app.controller("QuestController",function($scope, $http){

	// Setando as variaveis de escopo 
	$scope.dados = {};
	$scope.dados.respostas = {};
	$scope.mensagem = '';
	$scope.confirmacao = false;

	// A função enviar envia os dados do questionário para o Node.js
	$scope.enviar = function(){

		// Invoca a função que valida os dados de entrada
		if ( validarEntrada() ){
			
			// Se verdadeiro, exibe o gif carregando na tela
			$("#imgCarregando").css("display", "inline");

			// Faz a chamada http a rota do express
			$http({
				method: "POST",
				url: "/questionario/salvar",
				headers: {
			        "Content-Type": "application/json"
			    },
				data: $scope.dados
			}).success(function(data){

				// Em caso de sucesso seta a mensagem retornada pelo controller do node.js
				$scope.mensagem = data;

				// Em caso de processamento bem sucedido
				if (data == "Respostas enviadas com sucesso"){
					$scope.confirmacao = true;
					$scope.dados = {};
					$scope.dados.respostas = {};
				}

				// Esconde o gif carregando
				$("#imgCarregando").css("display", "none");

				// Clica no botão que exibe o modal com a mensagem para o usuário
				$("#btnAbrirModal").click();
			}).error(function(err){

				// Em caso de erro seta a mensagem, esconde o gid de carregando e abre o modal 
				// com a mensagem ao usuário
				$scope.mensagem = "Erro ao salvar, tente novamente mais tarde. " + err;
				console.log(err);
				$("#imgCarregando").css("display", "none");
				$("#btnAbrirModal").click();
			});
		} else{
			// Existe o modal com a mensagem ao usuário informando qual campo não foi
			// preenchido
			$("#btnAbrirModal").click();
		}
	}

	// Esta função verifica se todos os campos de entrada são válidos
	// e retorna true ou falso para quem chamou.
	function validarEntrada(){
		if ( !$scope.dados.sexo )
				$scope.mensagem = "Sexo não preenchido";
		 else if( !$scope.dados.idade )
		 		$scope.mensagem = "Idade não preenchida";
		 else if ( parseFloat($scope.dados.idade) < 18 || parseFloat($scope.dados.idade) > 99)
		 		$scope.mensagem = "Idade não pode ser menor do que 18 e maior que 99";
		 else if ( !$scope.dados.autoriza )
		 		$scope.mensagem = "Autorização não preenchida";
		 else if ( !$scope.dados.respostas.agitacao )
		 		$scope.mensagem = "Agitação não preenchida";
		 else if ( !$scope.dados.respostas.apetite )
		 		$scope.mensagem = "Apetite não preenchido";
		 else if ( !$scope.dados.respostas.choro )
		 		$scope.mensagem = "Choro não preenchido";
		 else if ( !$scope.dados.respostas.concentracao )
		 		$scope.mensagem = "Idade não preenchida";
		 else if ( !$scope.dados.respostas.critica )
		 		$scope.mensagem = "Crítica não preenchida";
		 else if ( !$scope.dados.respostas.culpa )
		 		$scope.mensagem = "Culpa não preenchida";
		 else if ( !$scope.dados.respostas.desvalorizacao )
		 		$scope.mensagem = "Desvalorização não preenchida";
		 else if ( !$scope.dados.respostas.energia )
		 		$scope.mensagem = "Energia não preenchida";
		 else if ( !$scope.dados.respostas.estima )
		 		$scope.mensagem = "Autoestima não preenchida";
		 else if ( !$scope.dados.respostas.fadiga )
		 		$scope.mensagem = "Fadiga não preenchida";
		 else if ( !$scope.dados.respostas.fracasso )
		 		$scope.mensagem = "Fracasso não preenchido";
		 else if ( !$scope.dados.respostas.indecisao )
		 		$scope.mensagem = "Indecisão não preenchida";
		 else if ( !$scope.dados.respostas.int_sexo )
		 		$scope.mensagem = "Interesse por sexo não preenchido";
		 else if ( !$scope.dados.respostas.interesse )
		 		$scope.mensagem = "Perda de interesse não preenchido";
		 else if ( !$scope.dados.respostas.irritabilidade )
		 		$scope.mensagem = "Irritabilidade não preenchida";
		 else if ( !$scope.dados.respostas.pessimismo )
		 		$scope.mensagem = "Pessimismo não preenchido";
		 else if ( !$scope.dados.respostas.prazer )
		 		$scope.mensagem = "Prazer não preenchido";
		 else if ( !$scope.dados.respostas.punicao )
		 		$scope.mensagem = "Punição não preenchida";
		 else if ( !$scope.dados.respostas.sono )
		 		$scope.mensagem = "Alteraçao no padrão de sono não preenchido";
		 else if ( !$scope.dados.respostas.suicida )
		 		$scope.mensagem = "Pensamentos suicída não preenchido";
		 else if ( !$scope.dados.respostas.tristeza )
		 		$scope.mensagem = "Tristeza não preenchida";	
		 else 
			return true;

		return false;
	}

});