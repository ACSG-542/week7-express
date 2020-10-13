$('#todo-form').submit(function () {
    $.post({
        url: '/save',
        data: {"item": $('#todo-input').val()},
        dataType: 'json'
    })
});

var getUrl ="/";

$(document).on('click', 'button.delete', function (event) {
	var id =event.target.id;
    $.ajax({
        url: "/" + id,
        type: 'DELETE',
		dataType: 'json'
    });
	getUrl = "/delete/" + id;
	getAllItems();
})

function getAllItems() {
	$.getJSON({
		url: getUrl,
        success: function (data){
			var delItem = getUrl.substring(8, getUrl.length);
			var remItem = data.message;
			var list = [];
			var thisLi = "";
			$( "li" ).each(function( index ) {
				thisLi = $( this ).text();
				var thisItem = thisLi.substring(0, thisLi.length -2);	
				if (thisItem == delItem) {
					$( this ).replaceWith("");
				} else {
					 list.push($( this ).text());
				}
			});		
        },
    });
}


