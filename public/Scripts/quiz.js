//creating an array to store anxiety scores
let arr = [0,
    0,
    0,
    0];

/*
index 0: Relationships
index 1: Work
index 2: health
index 3: loss
*/
var quiz = {
    // (A) PROPERTIES 
    // (A1) QUESTIONS & ANSWERS
    // Q = QUESTION, O = OPTIONS, A = Category
    data: [
        {
            q: "How do you feel when you are surrounded by family/friends?",
            o: [
                "They complete my world, I feel supper happy with them",
                "I just feel Normal",
                "I feel they do not value me for who I am",
                "I have no close family and friends"
            ],
            a: 0 // Category 0 meaning relationships
        },
        {
            q: "Are you having trouble making a decision?",
            o: [
                "Not at All",
                "Yes, just for hard decisions",
                "Yes, for most decisions",
                "Yes, for every simple decision"
            ],
            a: 3 //loss
        },
        {
            q: "How do you feel at the end of a working day?",
            o: [
                "I enjoy my work and look forward to the next day",
                "Work is just a part of my life ",
                "I am really exhausted and tired",
                "I would rather not work if I had a choice"
            ],
            a: 1  // category work
        },

        {
            q: "How do you respond when a friend calls and wants to talk?",
            o: [
                "Answer and talk over for an hour",
                "Answer but the conversation lasts only about 5 minutes",
                "Ignore the call or wish he/she shouldn't have called",
                "I do not get any calls from friends"
            ],
            a: 0 //relationships
        },
        {
            q: "What would you like to do on a bright and pleasant day?",
            o: [
                "Go out and do something fun",
                "Finish my houselhold chores",
                "Stay at home and binge watch my favourite series",
                "Stay in bed the entire day"
            ],
            a: 2 //health
        },
        {
            q: "Do you feel you are valued for at work?",
            o: [
                "Yes, I believe I'm an integral part of my company",
                "I feel I'm valued, but I do not really like my work",
                "I do not feel appreciated for what I do",
                "I hate my job and look forward towards weekends"
            ],
            a: 1 //work
        },
        {
            q: "Is your sleeping pattern disturbed?",
            o: [
                "Not at All",
                "A few days",
                "More than half a week",
                "Everyday"
            ],
            a: 3 //loss
        },
        {
            q: "What are your eathing habbits?",
            o: [
                "I avoid excessive salts and sugar whenever I can",
                "I usually eat healthy food with exceptions on certain occasions",
                "I prefer eating junk food",
                "I usually eat food with excessive spices and oils"
            ],
            a: 2 //health
        }
    ],


    // (A2) HTML ELEMENTS
    hWrap: null, // HTML quiz container
    hQn: null, // HTML question wrapper
    hAns: null, // HTML answers wrapper

    // (A3) GAME FLAGS
    now: 0, // current question
    score: 0, // current score

    // (B) INIT QUIZ HTML
    init: function () {
        // (B1) WRAPPER
        quiz.hWrap = document.getElementById("quizWrap");

        // (B2) QUESTIONS SECTION
        quiz.hQn = document.createElement("div");
        quiz.hQn.id = "quizQn";
        quiz.hWrap.appendChild(quiz.hQn);

        // (B3) ANSWERS SECTION
        quiz.hAns = document.createElement("div");
        quiz.hAns.id = "quizAns";
        quiz.hWrap.appendChild(quiz.hAns);

        // (B4) GO!
        quiz.draw();
    },

    // (C) DRAW QUESTION
    draw: function () {
        // (C1) QUESTION
        quiz.hQn.innerHTML = quiz.data[quiz.now].q;

        // (C2) OPTIONS
        quiz.hAns.innerHTML = "";
        for (let i in quiz.data[quiz.now].o) {
            let radio = document.createElement("input");
            radio.type = "radio";
            radio.name = "quiz";
            radio.id = "quizo" + i;
            quiz.hAns.appendChild(radio);
            let label = document.createElement("label");
            label.innerHTML = quiz.data[quiz.now].o[i];
            label.setAttribute("for", "quizo" + i);
            label.dataset.idx = i;
            label.addEventListener("click", quiz.select);
            quiz.hAns.appendChild(label);
        }
    },

    // (D) OPTION SELECTED
    select: function () {
        // (D1) DETACH ALL ONCLICK
        let all = quiz.hAns.getElementsByTagName("label");
        for (let label of all) {
            label.removeEventListener("click", quiz.select);
        }

        // (D2) CHECK Category
        let category = quiz.data[quiz.now].a;
        console.log(this.dataset.idx);


        let option = this.dataset.idx;
        switch (option) {

            case '0':
                arr[category] += 0;
                break;
            case '1':
                arr[category] += 2;
                break;
            case '2':
                arr[category] += 10;
                break;
            case '3':
                arr[category] += 15;



        }
        console.log(arr);

        // (D3) NEXT QUESTION OR END Quiz
        quiz.now++;
        setTimeout(function () {
            if (quiz.now < quiz.data.length) { quiz.draw(); }
            else {
                quiz.hQn.innerHTML = `This is the end of quiz. Please visit home to see you personalized field`;
                quiz.hAns.innerHTML = "";

                var http = new XMLHttpRequest();
                var url = '/categories';
                var params = `cat=${arr}`;
                http.open('POST', url, true);

                //Send the proper header information along with the request
                http.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');

                http.onreadystatechange = function () {//Call a function when the state changes.
                    if (http.readyState == 4 && http.status == 200) {
                        alert(http.responseText);
                    }
                }
                http.send(params);

            }
        }, 1000);
    }
};
window.addEventListener("load", quiz.init);