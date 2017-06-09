
$(document).ready(function(){   
    var socket = io.connect("https://chat-pereira-corps.herokuapp.com");
    var ready = false;

    $("#submit").submit(function(e) {
		e.preventDefault();
		$("#nick").fadeOut();
		$("#chat").fadeIn();
		$("#chat-container").fadeIn();

		var name = $("#nickname").val();
		var room = $("#sala :selected");
		var time = new Date();
		$("#name").html(name + " | " + room.text());
		$("#time").html('Horario de entrada: ' + time.getHours() + ':' + time.getMinutes());

		ready = true;
		var json = '{"name": "' +  name + '" , "room":"'+ room.text() + '", "roomId":'+ room.val() +'}';
		socket.emit("join",json);

	});

	$("#textarea").keypress(function(e){
        if(e.which == 13) {
        	var text = $("#textarea").val();
					var room = $("#sala :selected");
        	$("#textarea").val('');
        	var time = new Date();
        	$(".chat").append('<li class="self"><div class="msg"><span>' + $("#nickname").val() + ':</span><p>' + text + '</p><time>' + time.getHours() + ':' + time.getMinutes() + '</time></div></li>');
			var json = '{"roomId":'+ room.val() +',"room":"'+ room.text() +'","text":"'+ text +'"}';
        	socket.emit("send", json);
			jQuery("body").scrollTop($("#chat").get(0).scrollHeight);
        }
    });


    socket.on("update", function(json) {
		var room = $("#sala :selected");
		if (ready) {
			if(room.val() == json.roomId){
					$('.chat').append('<li class="info"><div class="alert alert-info"><span class="glyphicon glyphicon-exclamation-sign"></span> ' + json.msg + '</div></li>');
					jQuery("body").scrollTop($("#chat").get(0).scrollHeight);
			  }
    	}
    }); 

    socket.on("chat", function(client,msg) {
		var room = $("#sala :selected");
		if (ready && (msg.roomId == room.val() ) ) {
	    	var time = new Date();
	    	$(".chat").append('<li class="other"><div class="msg"><span>' + client + ':</span><p>' + msg.text + '</p><time>' + time.getHours() + ':' + time.getMinutes() + '</time></div></li>');
				jQuery("body").scrollTop($("#chat").get(0).scrollHeight);
    	}
    });


});

