$('#todo-form').submit(function () {
    $.post({
        url: '/save',
        data: {"item": $('#todo-input').val()},
        dataType: 'json'
    })
});

var getUrl ="/delete/";
$(document).on('click', 'button.delete', function (event) {
    var id = $(this).attr("id")
    var tid = $()
    //$.ajax({
    //    url: "/" + id,
    //    type: 'DELETE'
    //});
	getUrl = "/delete/" + id;
	getAllItems();
})




function getAllItems() {
	$.getJSON({
		url: getUrl,
        success: function (data){
			console.log(data);
			var delItem = getUrl.substring(8, getUrl.length);
            console.log(delItem);
			var list = [];
			$( "li" ).each(function( index ) {
				if (!$( this ).text().includes(delItem)) {
					 list.push($( this ).text());
				} else {
					$( this ).replaceWith("");
				}
			});		
        },
    });
}


