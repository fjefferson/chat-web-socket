angular.module("chatApp",[])
    .controller("chatController", function($scope,$http){
        $scope.salas=[];
        $http({
            url: "salas.json",
            method: "GET"
        }).then(function(response) {
            $(response.data).each(function(index, element){
                $scope.salas.push(element);
            });
        });
        
    });