$(document).ready(function(){
    $('.remove-button').on('click', function(){
        var id = $(this).data('id');
        var url = '/todos/' + id;
        $.ajax({
            type: 'DELETE',
            url: url,
            success: function(data){
                location.reload();
            }
        });
    });
});