$(document).ready(function(){
    var i=1;
    var MyDate = new Date();
        var MyDateString;
        MyDate.setDate(MyDate.getDate());
        MyDateString = MyDate.getFullYear() + '-' + ('0' + (MyDate.getMonth() + 1)).slice(-2) + '-' + ('0' + MyDate.getDate()).slice(-2);
        
   $("#add_row").click(function(){
    $('#addr'+i).html("<td>"+ (i+1) +"</td><td><input name='name"+i+"'  value="+(MyDateString)+" class='form-control input-md'  required/> </td><td><input  name='mobile"+i+"' type='text' placeholder='Task'  class='form-control input-md' reqiured></td>");

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