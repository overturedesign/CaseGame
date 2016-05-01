// DOCTYPE JS
// game state vars
var game_state;
var all_achievements;
var all_results;
var game_finished = false;
var end_week= 10; //# of weeks at the end of the game
var end_day=4; //index in array days_of_the_week
var end_hour=23;

//initialization vars
var default_cases = 0;
var default_parties = 0;
var default_sleep_debt = 0;
var default_hour = 0;
var default_day =0;
var default_week =1;


//default number vars
var hours_per_case = 4;
var hours_per_party = 10;
var days_in_a_week = 5;
var day_of_the_week = ['Monday','Tuesday','Wednesday','Thursday','Friday']; //an array
var most_sleep_debt_allowed = 10;

// parameter & calculation vars
var aca_pts = 0; //Baker scholar or hit the screen?
var social_pts =0; 
var health_pts = 0;



all_achievements = {

    //Academic Achievements
    first_case_read: [function(){
        if(game_state['num_cases']>=1){
            return true;
        }
    }, "First case read!"],

    first_comment: [function(){
        if(aca_pts>=3){
            return true;
        }
    }, "First comment in class!"],

    scribe: [function(){
        if(aca_pts>=10){
            return true;
        }
    }, "Friends with the scribe ;)"],

    first_quiz: [function(){
        if(aca_pts>=20){
            return true;
        }
    }, "Nailed your first FIN quiz!"],

    cold_call: [function(){
        if(aca_pts>=30){
            return true;
        }
    }, "Nailed your first cold call!"],

    ed_rep: [function(){
        if(aca_pts>=40){
            return true;
        }
    }, "You are elected Ed Rep of your section."],

    memory_loss: [function(){
        if(game_state['num_cases'] - aca_pts > 5){
            return true;
        }
    }, "You are suffering from memory loss caused by too many hangovers. Partied much recently?"],

    brain_damange: [function(){
        if(game_state['num_cases'] - aca_pts > 10){
            return true;
        }
    }, "Your doctor suggests that you are experiencing some brain damage. Too many parties maybe?"],


    //Social Achievements
    first_party_attended: [function(){
        if(game_state['num_parties']>=1){
            return true;
        }
    }, "Color Block party attended! Way to kick off your HBS social life!"],

    first_party_attended: [function(){
        if(game_state['num_parties']>=1){
            return true;
        }
    }, "Color Block party attended! Way to kick off your HBS social life!"],
}

all_results = {
    baker_scholar: [function(){
        if(aca_pts>=15){ //max possible: 20
            return true;
       }
    }, "You are a Baker Scholar!"],

    hit_the_screen: [function(){
        if(aca_pts <=5){ //lowest possible:0
            return true;
        }
    }, "You hit the screen!"],

    got_all_twos: [function(){
        if(aca_pts>5 & aca_pts <15){
            return true;
        }
    }, "You got all 2's."],

    social_butterfly:[function(){
        if(social_pts>70){ //max parties: 80+, you are not going to classes
            return true;
        }
    }, "You are a social social butterfly!"],

    anti_social:[function(){
        if(social_pts<=10){ //max parties: 80+, you are not going to classes
            return true;
        }
    }, "Anti-social: you are not a big fan of parties, are you?"],

    introvert:[function(){
        if(social_pts>10 && social_pts <= 40){ //max parties: 80+, you are not going to classes
            return true;
        }
    }, "Introvert: parties are not your priority."],

    friendly:[function(){
        if(social_pts>40 && social_pts <=70){ //max parties: 80+, you are not going to classes
            return true;
        }
    }, "Friendly: you enjoyed many parties and developed long-lasting friendship."],
    
    burnt_out:[function(){
        if(health_pts < -50){ // max social 91, health -73, aca 0;
            return true;
        }
    }, "Burnt out: you basically destroyed your health."],

    sleeping_beauty:[function(){
        if(health_pts > 80){ //max sleep 150
            return true;
        }
    }, "Sleeping Beauty: you enjoyed your beauty sleep and afternoon naps. Nothing worries you."], 

    flu:[function(){
        if(health_pts > -50 && health_pts < 0){ //max sleep 150
            return true;
        }
    }, "You caught the yacht week flu a couple of times."], 

    strong_horse:[function(){
        if(health_pts > 0 && health_pts< 80){ //max sleep 150
            return true;
        }
    }, "Strong as a horse."],
}

function load(){ //loads game state from localStorage or default
    if (localStorage.getItem('game_state')) {
        game_state = JSON.parse(localStorage.getItem('game_state')); //converting localStorage into an object
    } else {
        game_state = {num_cases:default_cases,num_parties: default_parties,
            num_sleep_debt: default_sleep_debt, hour: default_hour, day: default_day, week: default_week, 
            aca: aca_pts, social: social_pts,
            my_achievements:[],
            my_result:[]}; //defualt game state
    }
}

load();

function calculate_sleep_debt(start, duration){
    if (duration>24) {
        game_state['num_sleep_debt'] += Math.floor(duration/24)*8;
        //missed 8 hours a day for x number of days, added to total sleep debt
        duration = duration%24
    }
    if (start + duration < 16) {
        game_state['num_sleep_debt'] += 0;
    } else if (start + duration >= 24) {
        if (start>= 24){
            game_state['num_sleep_debt'] +=0;
        } else if (start < 16) {
            game_state['num_sleep_debt'] +=8;
        } else { // 16 <= start<24
            game_state['num_sleep_debt'] += 24-start;
        }
    } else{ // 16< end pt < 24
        game_state['num_sleep_debt'] += Math.min(duration+start-16, duration);
    } 

    health_pts -= game_state['num_sleep_debt']/most_sleep_debt_allowed; //-1 health_pts for every time you max out your sleep debt

    //prevent sleep debt from going crazy
    if (document.getElementById('num_sleep_debt').value>=most_sleep_debt_allowed){
        alert('You are exhausted and grumpy. Get some sleep now!');
        return false;
    }

    //console.log('num_sleep_debt: '+ game_state['num_sleep_debt'] + ' Hour: ' + game_state['hour'] +'start: ' + start + ' duration: ' + duration); 
}
   

function save() { //pushing global state to UI and localStorage

    if (game_state['hour']>=24){
        game_state['day'] += Math.floor(game_state['hour']/24);
        game_state['hour'] = game_state['hour']%24;
    }

    if (game_state['day']> days_in_a_week - 1){
        game_state['week'] += Math.ceil(game_state['day']/days_in_a_week) ; //Math.ceil goes up 1 integar. +1 since week starts from 0
        game_state['day'] = game_state['day']%days_in_a_week;
    }

    for (var key in game_state){
        if (document.getElementById(key) != null) {
            document.getElementById(key).value = game_state[key]; //saves game state to HTML
        }
    }  
    localStorage.setItem('game_state',JSON.stringify(game_state)); //saving to localStorage
    document.getElementById('display_time').value = 'Week ' + game_state['week'] +', '+ 
            day_of_the_week[game_state['day']] + ', time ' + game_state['hour'] + ':00';

    for (var achievement in all_achievements){
        if (all_achievements[achievement][0]() == true && //has met achievement requirement
            game_state['my_achievements'].indexOf(achievement) == -1) { //has not previously achieved
                div=document.createElement('div');
                div.innerHTML= (all_achievements[achievement][1]);
                document.getElementById('achievements').appendChild(div); 
                game_state['my_achievements'].push(achievement); //add to game state
        }
    }

    if (game_state['week'] >= end_week &&
        game_state['day'] >= end_day){
        game_finished = true; //finished game
        display_end_of_game_message();
    }
}

function display_end_of_game_message(){
    document.getElementById('all_boxes').style.display='none'; //hide exhisiting boxes
    calculate_result();
}

function calculate_result(){
    for (var result in all_results){
        if (all_results[result][0]() == true){ //has met result requirement
            div=document.createElement('div');
            div.innerHTML=(all_results[result][1]);
            document.getElementById('result').appendChild(div); 
            game_state['my_result'].push(result); //add to game state
        }
    }
}

function read_a_case() {
    if (calculate_sleep_debt(game_state['hour'], hours_per_party) == false || //too much sleep debt
        game_finished == true){ //game has finished
        return;
    }
    game_state['num_cases']+=1;
    game_state['hour']+= hours_per_case;
    aca_pts +=1;
    social_pts -= hours_per_case/hours_per_party;
    health_pts -= 0.1;
    save();
    console.log(aca_pts, social_pts, health_pts);
}

function go_to_a_party(){
    if (calculate_sleep_debt(game_state['hour'], hours_per_party) == false ||
        game_finished == true){
        return;
    }
    game_state['num_parties'] +=1;
    game_state['hour'] += hours_per_party;
    aca_pts -= 0.1;
    social_pts +=1;
    health_pts -=0.5;
    save();
    console.log(aca_pts, social_pts, health_pts);
}

function sleep() {
    if (game_finished == true) return; //if game has finished
    if (game_state['num_sleep_debt'] <=0){
       game_state['hour'] += 8; // sleep 8 hours
    } else {
       game_state['hour'] += game_state['num_sleep_debt'];
       game_state['num_sleep_debt'] = 0; 
       document.getElementById('num_sleep_debt').value =0;
    }
    social_pts -=0.2;
    health_pts +=1;   
    save();
    console.log(aca_pts, social_pts, health_pts);
}

function clear_all_data (){
    localStorage.clear();
    document.getElementById('achievements').innerHTML= '';
    document.getElementById('all_boxes').style.display='';
    load();
    save();
}
