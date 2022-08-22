window.addEventListener('load', function(){
  $('#cancel_button').on("click", function() {
    $('input').val('');
    $("#project_descriptions").val('');
  });
});
