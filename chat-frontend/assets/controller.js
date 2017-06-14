angular.module("chatApp",[])
    .controller("chatController", function($scope,$http){
        $scope.salas=[];
        $scope.usuarios = [];

        $http({
            url: "https://chat-pereira-corps.herokuapp.com/chat-rom",
            method: "GET"
        }).then(function(response) {
            $(response.data).each(function(index, element){
                $scope.salas.push(element);
            });
        });


        $scope.listaUser = ()=>{
             $scope.usuarios = [];
             var numUser = 0;
            $http({
                url: "https://chat-pereira-corps.herokuapp.com/user/" + document.getElementById("sala").value,
                method: "GET"
            }).then((response)=>{                
                $(response.data).each((index, element)=>{
                            $scope.usuarios.push(element);
                            $(".userCount").html(response.data.length);
                });
            });
            
            
            
            
        }
        
    }).controller("controllerChatMain",function($scope){
        
        
       


    });