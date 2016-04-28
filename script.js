// DOCTYPE JS

function modify_num_cases(val) {
    //var num_cases = localStorage.getItem('num_cases',num_cases)
    var num_cases = document.getElementById('num_cases').value;
    var new_num_cases = parseInt(num_cases,10) + val;
    
    if (new_num_cases < 0) {
        new_num_cases = 0;
    } else {
        document.getElementById('num_cases').value = new_num_cases;
    localStorage.setItem('num_cases',new_num_cases);
    return new_num_cases;
    }
}

function modify_num_parties(val) {
    var num_parties = document.getElementById('num_parties').value;
    var new_num_parties = parseInt(num_parties,10) + val;
    
    if (new_num_parties < 0) {
        new_num_parties = 0;
    }
    
    document.getElementById('num_parties').value = new_num_parties;
    return new_num_parties;
}

function modify_num_interviews(val) {
    var num_interviews = document.getElementById('num_interviews').value;
    var new_num_interviews = parseInt(num_interviews,10) + val;
    
    if (new_num_interviews < 0) {
        new_num_interviews = 0;
    }
    
    document.getElementById('num_interviews').value = new_num_interviews;
    return new_num_interviews;
}