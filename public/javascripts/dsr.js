$(document).ready(function(){
    var i=1;
    
   $("#add_row").click(function(){
    $('#addr'+i).html("<td>"+ (i+1) +"</td><td><input name='name"+i+"' type='time' placeholder='Name' class='form-control input-md'  required/> </td><td><input  name='mail"+i+"' type='time' placeholder='Mail'  class='form-control input-md' required></td><td><input  name='mobile"+i+"' type='text' placeholder='Task'  class='form-control input-md' reqiured></td>");

    $('#tab_logic').append('<tr id="addr'+(i+1)+'"></tr>');
    i++; 
});
   $("#delete_row").click(function(){
       if(i>1){
       $("#addr"+(i-1)).html('');
       i--;
       }
   });

});