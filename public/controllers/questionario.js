var app = angular.module("vivavamente",[]);

app.controller("QuestController",function($scope, $http){

	$scope.dados = {};
	$scope.dados.respostas = {};

	$scope.enviar = function(){
		if ( true == true ){
			console.log($scope.dados);
			$http({
				method: "POST",
				url: "/questionario/salvar",
				headers: {
			        "Content-Type": "application/json"
			    },
				data: $scope.dados
			}).success(function(data){

			}).error(function(err){
				alert("Erro encontrado");
			});

		} else {
			alert("Ainda existem a serem preenchidos");
		}
	}

	function validarEntrada(){
		if ( $scope.dados.sexo && $scope.dados.idade 
		 && $scope.dados.autoriza 
		 && $scope.dados.respostas.agitacao
		 && $scope.dados.respostas.apetite
		 && $scope.dados.respostas.choro
		 && $scope.dados.respostas.concentracao
		 && $scope.dados.respostas.critica
		 && $scope.dados.respostas.culpa
		 && $scope.dados.respostas.desvalorizacao
		 && $scope.dados.respostas.energia
		 && $scope.dados.respostas.estima
		 && $scope.dados.respostas.fadiga
		 && $scope.dados.respostas.fracasso
		 && $scope.dados.respostas.indecisao
		 && $scope.dados.respostas.int_sexo
		 && $scope.dados.respostas.interesse
		 && $scope.dados.respostas.irritabilidade
		 && $scope.dados.respostas.pessimismo
		 && $scope.dados.respostas.prazer
		 && $scope.dados.respostas.punicao
		 && $scope.dados.respostas.sono
		 && $scope.dados.respostas.suicida
		 && $scope.dados.respostas.tristeza ){
			return true;
		} else {
			return false;
		}
	}

});