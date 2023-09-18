//target=1:白色在左；target=2:白色在右
//distractor=1:红色干扰；distractor=2:绿色干扰 

let jsPsych = initJsPsych({
    use_webaudio: false,
    on_finish: function() {
        jsPsych.data.get().localSave('csv', `data_${new Date().getTime()}.csv`);    // 将结果保存为csv文件
    }
})

let left='position: fixed; top: 50%; left: 25%; margin-left: -50px; margin-top: -50px; width: 100px; height: 100px',
right='position: fixed; top: 50%; right: 25%; margin-right: -50px; margin-top: -50px; width: 100px; height: 100px';

let trial_array=[[1,1],[1,2],[2,1],[2,2],[1,1],[1,2],[2,1],[2,2]];
trial_array.sort(() => Math.random() - 0.5);


let instructions = {
    type: jsPsychHtmlButtonResponse,
    stimulus: `
        <p style="font: 20pt times new roman; text-align: center; line-height: 1.6em">
        Welcome!<br>
        In this task, you will see a white square appearing on either side of the screen.<br>
        Press "L" key if the square appeared on the left.<br>
        Press "R" key if the square appeared on the right.<br>
        Click the "start" button to start the experiment.<br>
        </p>`,
        choices:[''],
        button_html:[
            '<button style="background-color:rgb(0, 140, 186); color:white; font-size:20pt;">start</button>'
        ],
    post_trial_gap: 2000 
};

let ThankYouMessage = {
    type: jsPsychHtmlKeyboardResponse,    
        stimulus: function() {
            document.body.style.backgroundColor = 'white';
            return `<p style="font: 36pt times new roman; text-align: center; font-weight: bold; color: red">
                Thank you for your paticipation!
                </p>`
        },
};

function timeline_variables() {
    var stimulus_list = []
    for (var i = 0, len = trial_array.length; i < len; i++) {
        stimulus_list.push({
            'id': parseInt(i+1),
            'target_place': parseInt(trial_array[i][0]),
            'distractor_color': parseInt(trial_array[i][1]),
        })
    };
    return stimulus_list
}


let trials = {
    type: jsPsychHtmlKeyboardResponse,
    timeline: [
        {
            stimulus: function() {
                document.body.style.backgroundColor = 'gray';
                return '+'
            },
            choices:'NO_KEYS', 
            trial_duration:500
        },       
        {
            stimulus: function() {
                if (jsPsych.timelineVariable('target_place')==1) { //target=1:白色在左
                    if (jsPsych.timelineVariable('distractor_color')==1) { //distractor=1:红色干扰
                        page_body =`<div id="div" style="${left}; background-color: white;"></div><div id="div2" style="${right}; background-color: red;"></div>`                      
                    }
                    else{ //distractor=2:绿色干扰
                        page_body =`<div id="div" style="${left}; background-color: white;"></div><div id="div2" style="${right}; background-color: green;"></div>`
                    }
                }
                else{ //target=2:白色在右
                    if (jsPsych.timelineVariable('distractor_color')==1) { //distractor=1:红色干扰
                        page_body =`<div id="div" style="${right}; background-color: white;"></div><div id="div2" style="${left}; background-color: red;"></div>`
                    }
                    else{
                        page_body =`<div id="div" style="${right}; background-color: white;"></div><div id="div2" style="${left}; background-color: green;"></div>`
                    }
                }
                setTimeout(function(){ document.getElementById('div').style.display='none'; }, 250);
                setTimeout(function(){ document.getElementById('div2').style.display='none'; }, 250);
                return page_body
            },
            choices: ['l', 'r'],

            on_load: function() {
                this.start_time = new Date().getTime()
            },

            on_finish: function(data) {
                let finish_time = new Date().getTime();
                data.r_t = finish_time - this.start_time;
                data.id = jsPsych.timelineVariable('id');
                data.target_place = jsPsych.timelineVariable('target_place');
                data.distractor_color = jsPsych.timelineVariable('distractor_color');
                if ((data.response == 'l' && jsPsych.timelineVariable('target_place')==1) || data.response == 'r' && jsPsych.timelineVariable('target_place')==2){
                    data.correct = 1;
                } else {
                    data.correct = 0; 
                }
            },
            post_trial_gap: 500,
        },
    ],
    timeline_variables: timeline_variables()  
};


jsPsych.run([
    instructions,
    trials,
    ThankYouMessage
]);
