class Chat{
	constructor(usuario, regiao, IdRegiao, dataEntrada){
		this.usuario = usuario;
		this.regiao = regiao;
		this.IdRegiao = IdRegiao;
		this.dataEntrada = dataEntrada;
	}

	getJSONChat(text=null){
		return {"usuario":this.usuario, "regiao":this.regiao, "idRegiao":this.IdRegiao,"dataEntrada":this.dataEntrada,"text":text}
	}

	setJSonChat(usuario, regiao, IdRegiao, dataEntrada){
		return {"usuario":usuario, "regiao":regiao, "idRegiao":IdRegiao,"dataEntrada":dataEntrada}
	}



}

/* Set the width of the side navigation to 250px */
function abreUSuarioLista() {
    document.getElementById("listaDeUsuarios").style.width = "250px";
}

/* Set the width of the side navigation to 0 */
function fechaUsuarioLista() {
    document.getElementById("listaDeUsuarios").style.width = "0";
}

$(document).ready(function(){
	var socket = io.connect("https://chat-pereira-corps.herokuapp.com");
    var ready = false;
	var chatCliente;

	function lpad(num) {
		return (num <= 9) ? "0"+num : num;
	}	

    $("#submit").submit(function(e) {
		e.preventDefault();
		$("#nick").fadeOut();
		$("#chat").fadeIn();
		$("#chat-container").fadeIn();

		var name = $("#nickname").val();
		var room = $("#sala :selected");
		var time = new Date();
		$("#name").html(name + " | " + room.text());
		$("#time").html('Horário de entrada: ' + lpad(time.getHours()) + ':' + lpad(time.getMinutes()));
		ready = true;
		chatCliente = new Chat(name, room.text(),room.val(), new Date());
		socket.emit("join", chatCliente.getJSONChat());
		$(".regiaoNome").text(room.text());
		
		//pega a quantidade de usuarios
		$.getJSON("https://chat-pereira-corps.herokuapp.com/user/" + document.getElementById("sala").value,(r)=>{
			$(".userCount").html(r.length)		
		})
		


	});

	$("#textarea").keypress(function(e){
        if(e.which == 13) {

        	var text = $("#textarea").val();
			var room = $("#sala :selected");
			if(text.length > 0){
        		$("#textarea").val('');
				var time = new Date();
				var html = '<li class="self"><div class="msg"><span>'+$("#nickname").val() +':</span><p>'+text+'</p><time>'+lpad(time.getHours())+':'+lpad(time.getMinutes())+'</time></div></li>';
				$(".chat").append(html);
				socket.emit("send", chatCliente.getJSONChat(text)); //passa objeto com text
				jQuery("body").scrollTop($("#chat").get(0).scrollHeight);
			}

        }
    });


    socket.on("update", function(json) {
		var room = $("#sala :selected");
		if (ready) {
			if(room.val() == json.user.idRegiao){
					$('.chat').append('<li class="info"><div class="alert alert-info"><span class="glyphicon glyphicon-exclamation-sign"></span> ' + json.msg + '</div></li>');
					jQuery("body").scrollTop($("#chat").get(0).scrollHeight);
						$.getJSON("https://chat-pereira-corps.herokuapp.com/user/" + document.getElementById("sala").value,(r)=>{
							$(".userCount").html(r.length)		
						})

			  }
    	}
    }); 

    socket.on("chat", function(client,json) {
		console.log(json);
		var room = $("#sala :selected");
		if (ready && (room.val() == json.idRegiao) ) {
	    	var time = new Date();
	    	$(".chat").append('<li class="other"><div class="msg"><span>' + json.usuario + ':</span><p>' + json.text + '</p><time>' + lpad(time.getHours()) + ':' + lpad(time.getMinutes())+ '</time></div></li>');
				jQuery("body").scrollTop($("#chat").get(0).scrollHeight);
    	}
    });


});

