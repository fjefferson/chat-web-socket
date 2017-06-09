angular.module("chatApp",[])
    .controller("chatController", function($scope,$http){
        $scope.salas=[];
        $http({
            url: "http://www.jestudio.com.br/chat/assets/salas.json",
            method: "GET"
        }).then(function(response) {
            $(response.data).each(function(index, element){
                $scope.salas.push(element);
            });
        });
        
    });