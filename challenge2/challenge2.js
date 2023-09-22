//congruency:0 or 1
//red:1; yellow:2; blue:3; green:4

let jsPsych = initJsPsych({
    use_webaudio: false,
    on_finish: function() {
        jsPsych.data.get().localSave('csv', `data_${new Date().getTime()}.csv`);    // save as csv files
    }
})

//randomize the buttons for each subject
let button=["<button style='background-color:red; font-size:20pt; height:100px; width:100px; border-radius: 50%'></button>",
"<button style='background-color:yellow; font-size:20pt; height:100px; width:100px; border-radius: 50%'></button>",
"<button style='background-color:blue; font-size:20pt; height:100px; width:100px; border-radius: 50%'></button>",
"<button style='background-color:green; font-size:20pt; height:100px; width:100px; border-radius: 50%'></button>"];
var button_order=[], button_index=[0,1,2,3];
button_index.sort(() => Math.random() - 0.5); //randonmize the four colors
for(var i =0;i<=3;i++){
    button_order.push(button[button_index[i]]) //arrange the buttons
}

//glow button and dim button
let glowbutton=["<button style='box-shadow: 0px 0px 50px 5px red; background-color:red; font-size:20pt; height:100px; width:100px; border-radius: 50%'></button>",
"<button style='box-shadow: 0px 0px 50px 5px yellow; background-color:yellow; font-size:20pt; height:100px; width:100px; border-radius: 50%'></button>",
"<button style='box-shadow: 0px 0px 50px 5px blue; background-color:blue; font-size:20pt; height:100px; width:100px; border-radius: 50%'></button>",
"<button style='box-shadow: 0px 0px 50px 5px green; background-color:green; font-size:20pt; height:100px; width:100px; border-radius: 50%'></button>"];

let dimbutton=["<button style='background-color:rgba(255,0,0,0.3); font-size:20pt; height:100px; width:100px; border-radius: 50%'></button>",
"<button style='background-color:rgba(255,255,0,0.3); font-size:20pt; height:100px; width:100px; border-radius: 50%'></button>",
"<button style='background-color:rgba(0,0,255,0.3); font-size:20pt; height:100px; width:100px; border-radius: 50%'></button>",
"<button style='background-color:rgba(0,255,0,0.3); font-size:20pt; height:100px; width:100px; border-radius: 50%'></button>"];


//before parctice
var prac_button=[];
let redindex = button_index.indexOf(0), yellowindex = button_index.indexOf(1), blueindex = button_index.indexOf(2), greenindex = button_index.indexOf(3);

var prac_word=["RED","YELLOW","BLUE","GREEN"], prac_ink_color=['green','red','blue','yellow'];
//prac_word.sort(() => Math.random() - 0.5);
//prac_ink_color.sort(() => Math.random() - 0.5);
var timeline=[];

for (var prac_index=0; prac_index<=3; prac_index++){
    var stimulus1 = {
        stimulus: `
            <div style="font-size:20pt; color: white; position: absolute; top: 20px; left: 20px;">Examples</div>
            <p style="color:${prac_ink_color[prac_index]}; text-align: center; font: 64pt sans-serif;">${prac_word[prac_index]}</p>
            <p style="font-size:20pt; color: white; line-height: 2em; ">The word is printed in '${prac_ink_color[prac_index]}' ink.<br>
            Select the '${prac_ink_color[prac_index]}' circle.<br>
            </p>
            <div>${button_order}</div>`,                                
        trial_duration:3000
    };
    timeline.push(stimulus1)

    if (prac_ink_color[prac_index]=='red'){
        prac_button[redindex]=glowbutton[0]
        prac_button[yellowindex]=dimbutton[1]
        prac_button[blueindex]=dimbutton[2]
        prac_button[greenindex]=dimbutton[3]
    }
    else if(prac_ink_color[prac_index]=='yellow'){
        prac_button[redindex]=dimbutton[0]
        prac_button[yellowindex]=glowbutton[1]
        prac_button[blueindex]=dimbutton[2]
        prac_button[greenindex]=dimbutton[3]
    }
    else if(prac_ink_color[prac_index]=='blue'){
        prac_button[redindex]=dimbutton[0]
        prac_button[yellowindex]=dimbutton[1]
        prac_button[blueindex]=glowbutton[2]
        prac_button[greenindex]=dimbutton[3]
    }
    else if(prac_ink_color[prac_index]=='green'){
        prac_button[redindex]=dimbutton[0]
        prac_button[yellowindex]=dimbutton[1]
        prac_button[blueindex]=dimbutton[2]
        prac_button[greenindex]=glowbutton[3]
    };

    var stimulus2 = {
        stimulus:`
            <div style="font-size:20pt; color: white; position: absolute; top: 20px; left: 20px;">Examples</div>
            <p style="color:${prac_ink_color[prac_index]}; text-align: center; font: 64pt sans-serif;">${prac_word[prac_index]}</p>
            <p style="font-size:20pt; color: white; line-height: 2em; ">The word is printed in '${prac_ink_color[prac_index]}' ink.<br>
            Select the '${prac_ink_color[prac_index]}' circle.<br>
            </p>
            <div>${prac_button}</div>` , 
        trial_duration:1000
    };
    timeline.push(stimulus2)   

    if (prac_index==3){
        var start_exp = {
            type: jsPsychHtmlButtonResponse,
            stimulus: `<p style="font: 24pt times new roman; text-align: center; line-height: 1.6em; color:rgb(200,200,200)">
                If you understand the task, click 'Start experiment'. <br>
                Or, click 'See examples' again.<br>
                </p>`,
            choices:['',''],
            button_html:['<button style="background-color:rgb(255, 140, 186); color:white; font-size:40pt;">Start experiment</button>','<button style="background-color:rgb(0, 140, 186); color:white; font-size:40pt;">See examples</button>'],
        }
        timeline.push(start_exp)        
    }
}

let practice = {
    type: jsPsychHtmlKeyboardResponse,
    timeline:timeline,
    loop_function: function (data) {
        let dataArray = data.values();
        return dataArray[dataArray.length - 1].response === 1;
    },  
}

//matrix for the formal experiment
let word=["RED","YELLOW","BLUE","GREEN"], ink_color=['red','yellow','blue','green'], trial_array=[];
var wordcolor=1, inkcolor=1;
for (var i=0;i<=3;i++){    //congruent   
    trial_array.push([1, wordcolor, inkcolor]);   
    trial_array.push([1, wordcolor, inkcolor]);   
    trial_array.push([1, wordcolor++, inkcolor++]); 
}
for (var wordcolor=1; wordcolor<=4; wordcolor++){ //not congruent
    for (var inkcolor=1; inkcolor<=4; inkcolor++){
        if (inkcolor==wordcolor){
            continue;
        }
        else{
            trial_array.push([0, wordcolor, inkcolor]);
        }
    }
}
trial_array.sort(() => Math.random() - 0.5);

//the formal experiment
//bonus：在这里搞一个conditional_function: function ()，只有正确了才可以继续
let trials = {
    type: jsPsychHtmlButtonResponse,
    timeline: [
        {
            stimulus: function(){
                return`<p style="color:${ink_color[jsPsych.timelineVariable('ink_color')-1]}; text-align: center; font: 64pt sans-serif;">${word[jsPsych.timelineVariable('word')-1]}</p>`;               
            },                     
            choices:['','','',''],
            button_html:[button_order[0], button_order[1], button_order[2], button_order[3]],

            on_finish: function(data) {
                data.id = jsPsych.timelineVariable('id');
                data.congruency = jsPsych.timelineVariable('congruency');
                data.word = jsPsych.timelineVariable('word');
                data.ink_color = jsPsych.timelineVariable('ink_color');
                data.choice = button_index[data.response]+1;
                if (data.choice==data.ink_color){
                    data.correct = 1;
                } else {
                    data.correct = 0; 
                }
            },
            post_trial_gap: 500,
        }
    ],


    timeline_variables: timeline_variables()
};

function timeline_variables() {
    var stimulus_list = []
    for (var i = 0; i < trial_array.length; i++) {
        stimulus_list.push({
            'id': parseInt(i+1),
            'congruency': parseInt(trial_array[i][0]),
            'word': parseInt(trial_array[i][1]),
            'ink_color': parseInt(trial_array[i][2]),
        })
    };
    return stimulus_list
}

let instructions = {
    type: jsPsychHtmlButtonResponse,
    stimulus: `
        <p style="font: 24pt times new roman; text-align: center; line-height: 1.6em; color:rgb(200,200,200)">
        Welcome!<br>
        In this task, you will see a color word printed in a colored ink.<br>
        Please click on the square that matches the INK of the word.<br>
        Please make the response as fast as you can.<br>
        </p>`,
        choices:[''],
        button_html:['<button style="background-color:rgb(0, 140, 186); color:white; font-size:40pt;">See examples</button>'],
};

let ThankYouMessage = {
    type: jsPsychHtmlKeyboardResponse,    
        stimulus: function() {
            return `<p style="font: 36pt times new roman; text-align: center; font-weight: bold; color: red">
                Thank you for your paticipation!</p>`
        },
};

var main_timeline=[
instructions,
practice,
trials,
ThankYouMessage
]

jsPsych.run(main_timeline);



