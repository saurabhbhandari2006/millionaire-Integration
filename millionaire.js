var base = new Environment("base");
var ladder = new Environment("ladder");
var lifelines = new Environment("lifelines");
var kbc_lifeline = new Environment("kbc_lifeline");
var poll = new Environment("poll");
var player = new Entity("player");
var pollSelected;
var halfSelected;
var changeSelected;
var flag;
var pointsEarned;

$(function () {

    initTheme();
    initGame();
    parent.setGameAttempt(parent.currentIntegratedGame,parent.currentUid);
    playGame();
    console.log("init fs")

    window.ondragstart = function() {return false}
});

function initTheme() {
    loadConfig(base);
    $("#message").css({"background": "url(" + getImg("kbc-endgame-back")+ ")"});

    loadConfig(ladder);
    $("#ladder").css({"background": "url(" + getImg("kbc-modal-back") + ")"});

    loadConfig(lifelines);
    $("#lifelines .location").addClass("lifeline");
    $("#kbc-lifeline-panel").removeClass("lifeline");
    $("#kbc-lifeline-panel").css({"background": "url(" + getImg("kbc-right-back1") + ")"})

    loadConfig(kbc_lifeline);
    $("#kbc_lifeline").attr("id", "kbc-lifeline");
    $("#kbc-lifeline").css({"background": "url(" + getImg("kbc-right-back1") + ")"});

    loadConfig(poll);
    $("#poll").css({"background": "url(" + getImg("kbc-right-back1") + ")"});

    initQuiz();

    loadConfig(player);

    runGlobalObservers();
    player.setState('1');
    player.location(ladder.kbc_ladder01_text);
    var lives = new Currency("lives");
    player.createWallet(lives, 0, 1, 1);
    $("#base img").attr("id", "kbc-back")
}

function runGlobalObservers() {
    $("#kbc-lifeline1-img").mouseover(function() {
        $("#lifelines").append($('<div />', {id: "life1", class:"lifeline-text", text: "Audience Poll"}));
    });

    $("#kbc-lifeline2-img").mouseover(function() {
        $("#lifelines").append($('<div />', {id: "life2", class:"lifeline-text", text: "50-50"}));
    });

    $("#kbc-lifeline3-img").mouseover(function() {
        $("#lifelines").append($('<div />', {id: "life3", class:"lifeline-text", text: "Change Question"}));
    });

    $("#lifelines .location").mouseout(function() {
        $(".lifeline-text").remove();
    });

}

function initGame() {
    pollSelected = false;
    halfSelected = false;
    changeSelected = false;
    flag = 0;
    pointsEarned = 0;
    quizShuffle();

}

function quizShuffle() {
    for(var i in Question.all)  {
        Question.all[i].options = shuffle(Question.all[i].options);
    }


    Question.all = shuffle(Question.all);
}

function answerHover() {
    $(".kbc-answer-block").mouseover(function() {
        $(this).find('img').attr('src', getImg("kbc-answer-hover-back"));
    });
    $(".kbc-answer-block").mouseout(function() {
        $(this).find('img').attr('src', getImg("kbc-answer-back"));
    });
}

function playGame() {
    $("#player").css({"background": "url(" + getImg("kbc-player-back") + ")"});
    question = Question.getQuestion(1, flag);
    $('#quiz').fadeIn(function () {
        Question.showQuizPanel(quiz, question);
        console.log(question)
        $("#kbc-question").css({"background": "url(" + getImg("kbc-question-back") + ")"});
        $(".kbc-answer-block").find('img').attr('src', getImg("kbc-answer-back"));
        parent.setQuestionAttempt(question.id);

        answerHover();
    });
    $(question).unbind('answered').on('answered', function (e, data) {
        flag++;
        if (data.correct == "true") {
            //parent.markQuestionAttemptCorrect();
            $(data.$this).find('img').attr('src', getImg("kbc-answer-right-back"));

            pointsEarned += parseInt(data.points);
            $("#quiz").delay(250).fadeOut(function () {
                quiz.setState('default');
                ladder[player.location().name].setState('complete');
                if (player.location().name == 'kbc_ladder10_text')
                    victory();
                else {
                    player.location(ladder.nextLocation(player.location()));
                    playGame();
                }

            });
        } else {
            player.lives.is(-1);
        }
    });

    $(player.lives).unbind('min').on('min', function () {
        defeat();
    });


    //---------------lifeline function----------------------


    $("#kbc-lifeline1-img").unbind('click').on('click', function () {
        if(pollSelected == false) {
            lifelines["kbc-lifeline-panel"].setState("kbc-lifeline-1");
            $("#lifelines .lifeline").css({"pointer-events": "none"});

            setLifeline(1);

            $("#kbc-lifeline-1").html("<span id='life1-span'>This lifeline shows what Audience consider as the 'Right' answer in the form of a Bar Graph.</span>").fadeIn();
            $("#life1-span").append(   '<p><span id="messageOk">Use</span>' +
                '<span id="messageCancel">Cancel</span></p>');



            $("#messageOk").unbind('click').on('click', function () {
                $("#poll").css({"background": "url(" + getImg("kbc-right-back3") + ")"});
                $("#poll").fadeIn();
                $("#poll").append('<div id="messageOk2">OK</div>');
                pollSelected = true;
                $("#kbc-lifeline-1 span").css({
                    opacity: 0
                });

                usePoll();

                $("#messageOk2").unbind('click').on('click', function () {
                    $("#lifelines .lifeline").css({"pointer-events": "auto"});
                    $("#poll").fadeOut();
                    lifelines["kbc-lifeline-panel"].setState("default");
                    lifelines["kbc-lifeline1-img"].setState("complete");
                    setLifeline();
                });

            });
            $("#messageCancel").unbind('click').on('click', function (){
                $("#lifelines .lifeline").css({"pointer-events": "auto"});
                lifelines["kbc-lifeline-panel"].setState("default");
                setLifeline();
            });

        }
    });


    $("#kbc-lifeline2-img").unbind('click').on('click', function () {
        if(halfSelected == false) {
            lifelines["kbc-lifeline-panel"].setState("kbc-lifeline-2");
            $("#lifelines .lifeline").css({"pointer-events": "none"});

            setLifeline(1);

            $("#kbc-lifeline-2").html("<span id='life2-span'>This lifeline eliminates two 'Wrong' answers.</span>").fadeIn();
            $("#life2-span").append(   '<p><span id="messageOk">Use</span>' +
                '<span id="messageCancel">Cancel</span></p>');

            $("#messageOk").unbind('click').on('click', function () {
                halfSelected = true;
                $("#lifelines .location").css({"pointer-events": "auto"});
                useHalf();
                lifelines["kbc-lifeline2-img"].setState("complete");
                lifelines["kbc-lifeline-panel"].setState("default");
                setLifeline();

            });
            $("#messageCancel").unbind('click').on('click', function (){
                $("#lifelines .lifeline").css({"pointer-events": "auto"});
                lifelines["kbc-lifeline-panel"].setState("default");
                setLifeline();
            });
        }
    });
    $("#kbc-lifeline3-img").unbind('click').on('click', function () {

        if(changeSelected == false) {
            lifelines["kbc-lifeline-panel"].setState("kbc-lifeline-3");
            $("#lifelines .lifeline").css({"pointer-events": "none"});

            setLifeline(1);

            $("#kbc-lifeline-3").html("<span id='life3-span'>This lifeline discards the current question and presents a new question without any cost.</span>").fadeIn();
            $("#life3-span").append(   '<p><span id="messageOk">Use</span>' +
                '<span id="messageCancel">Cancel</span></p>');

            $("#messageOk").unbind('click').on('click', function () {
                changeSelected = true;
                $("#lifelines .lifeline").css({"pointer-events": "auto"});
                flag++;
                playGame();
                lifelines["kbc-lifeline3-img"].setState("complete");
                lifelines["kbc-lifeline-panel"].setState("default");
                setLifeline();
            });
        }
        $("#messageCancel").unbind('click').on('click', function (){
            $("#lifelines .lifeline").css({"pointer-events": "auto"});
            lifelines["kbc-lifeline-panel"].setState("default");
            setLifeline();
        });
    });
}

function setLifeline(lifeline) {
    switch(lifeline) {
        case 1:
            $("#lifelines").animate({
                position: "absolute",
                top: "55%",
                height: "50%"

            });
            $("#kbc-lifeline-panel").css({
                height: "56%",
                background: "url(" + getImg("kbc-right-back2") + ")"
            });
            break;

        case 2:
            $("#lifelines").animate({
                position: "absolute",
                top: "54%",
                height: "35.5%"

            });
            $("#kbc-lifeline-panel").css({
                height: "58%"
            });
            break;

        default:
            $("#lifelines").animate({
                position: "relative",
                top: "68%",
                height: "29%"
            });
            setTimeout(function() {
                $("#kbc-lifeline-panel").css({
                    height: "52%",
                    background: "url(" + getImg("kbc-right-back1") + ")"
                });
            }, 400)

            $("#kbc-lifeline-1 span").css({
                opacity: 1
            });
    }

}

function usePoll() {
    var chr = String.fromCharCode(65 + 1);
    var sum = 0;
    var ctx = $("#abc").get(0).getContext("2d");
    var data = {
        labels: ["A", "B", "C", "D"],
        datasets: [
            {
                label: "Poll",
                fillColor: "rgba(220,220,220,0.5)",
                strokeColor: "rgba(220,220,220,0.8)",
                highlightFill: "rgba(220,220,220,0.75)",
                highlightStroke: "rgba(220,220,220,1)",
                data: []
            }
        ]
    };

    for(var i = 0; i < question.options.length; i++) {
        if(i != question.options.length-1) {
            if(question.options[i].correct == "true") {
                var random = randBetween(45, 100);
                if((sum+random) > 100)
                    random -= ((sum+random)-100);
                sum += random;
                data.datasets[0].data.push(random);
                $("#bar"+String.fromCharCode(65 + i)).css({width: (random*0.9)+"%"});
            } else {
                var random = randBetween(0, 50);
                if((sum+random) > 100)
                    random -= ((sum+random)-100);
                sum += random;
                data.datasets[0].data.push(random);
                $("#bar"+String.fromCharCode(65 + i)).css({width: (random*0.9)+"%"});
            }
        } else {
            random = (100-sum);
            data.datasets[0].data.push(random);
            $("#bar"+String.fromCharCode(65 + i)).css({width: (random*0.9)+"%"});
        }
    }

    var myBarChart = new Chart(ctx).Bar(data, {

    });
}

function useHalf() {
    while(true) {
        var random1 = randBetween(0,100)%4;
        var random2 = randBetween(0,100)%4;
        while(random1 == random2) {
            random2 = randBetween(0,100)%4;
        }

        if((question.options[random1].correct == "false") && (question.options[random2].correct == "false")) {
            console.log(random1, random2);
            $(".kbc-answer-block").eq(random1).hide();
            $(".kbc-answer-block").eq(random2).hide();
            break;
        }
    }
}

function victory() {
    $("#message-box").fadeIn();
    $("#message").html("<span>You Win!</span>" +
        "<p><i>You scored " + pointsEarned + " Points.</i></p>");
    console.log(pointsEarned);
}

function defeat() {
    $("#message-box").fadeIn();
    $("#message").html("<span>You Lose!</span>" +
        "<p><i>You scored " + pointsEarned + " Points.</i></p>");
    console.log(pointsEarned);

}
