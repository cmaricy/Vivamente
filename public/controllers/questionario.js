var app = angular.module("vivavamente",[]);

app.controller("QuestController",function($scope, $http){

	$scope.dados = {};
	$scope.dados.respostas = {};
	$scope.mensagem = '';
	$scope.confirmacao = false;

	$scope.enviar = function(){
		if ( validarEntrada() ){
			$("#imgCarregando").css("display", "inline");
			$http({
				method: "POST",
				url: "/questionario/salvar",
				headers: {
			        "Content-Type": "application/json"
			    },
				data: $scope.dados
			}).success(function(data){
				$scope.mensagem = data;
				if (data == "Salvo com sucesso"){
					$scope.confirmacao = true;
					$scope.dados = {};
					$scope.dados.respostas = {};
				}
				$("#imgCarregando").css("display", "none");
				$("#btnAbrirModal").click();
			}).error(function(err){
				$scope.mensagem = "Erro: " + err;
				$("#imgCarregando").css("display", "none");
				$("#btnAbrirModal").click();
			});
		} else{
			$("#btnAbrirModal").click();
		}
	}

	function validarEntrada(){
		if ( !$scope.dados.sexo )
				$scope.mensagem = "Sexo não preenchido";
		 else if( !$scope.dados.idade )
		 		$scope.mensagem = "Idade não preenchida";
		 else if ( parseFloat($scope.dados.idade) < 1 || parseFloat($scope.dados.idade) > 130)
		 		$scope.mensagem = "Idade não pode ser menor do que 0 e maior que 130";
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