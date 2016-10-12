var app = angular.module("vivavamente",[]);

app.controller("QuestController",function($scope, $http){

	$scope.enviar = function(){
		console.log("chegou");
	}

});