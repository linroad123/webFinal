var date = new Date();
var month = date.getMonth()+1;

var monthControl = document.querySelector('input[type="month"]');
monthControl.value = month;

function checkWeek() {
    var s = document.getElementById('dString').value;
    var m = moment(s, 'YYYY-MM-DD');
    document.getElementById('momentWeek').value = m.format('W');
    document.getElementById('answerWeek').value = m.toDate().getWeekNumber();      
}
