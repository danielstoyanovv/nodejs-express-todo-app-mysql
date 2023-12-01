$(document).ready(function(){
    $('.remove-button').on('click', function(){
        var id = $(this).data('id');
        var url = '/todo/' + id;
        $.ajax({
            type: 'DELETE',
            url: url,
            success: function(data){
                location.reload();
            }
        });
    });
});