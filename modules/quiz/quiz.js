var quiz;

config.quiz = {
    type: "environment",
    states: [
        {name: "default", representation: "<div id='kbc-question'></div><div id='options-area'></div><div id='kbc-learn-more'>Learn More</div>"}
//        {name: "correct", representation: "<div id='msgWindow'></div>"},
//        {name: "wrong", representation: "<img src='img/questionwrong.png'/>"}
    ]
};

function initQuiz() {
    quiz = new Environment("quiz");
    loadConfig(quiz);
    quiz.setState('default');
    loadQuestionBank();
}

function loadQuestionBank() {
    for (var i in questionbank.questions) {
        var q = questionbank.questions[i];
        var opts = ["a", "b", "c", "d"];
        var optsz = ["", "correct", "points"];
        var options = [];
        var optiones = {};
        for(var i=0; i<opts.length; i++) {
            var temp1 = "opt" + opts[i] + optsz[0];
            var temp2 = "opt" + opts[i] + optsz[1];
            var temp3 = "opt" + opts[i] + optsz[2];
            optiones.option = i+1;
            optiones.name = q[temp1];
            optiones.correct = q[temp2];
            optiones.points = q[temp3];
            options.push(optiones);
            optiones = {}
        }
        //new Question(q.statement, q.image, q.weight, options, q.help, q.slide_id, q.id);
        new Question(q.name, q.image, q.weight, options, q.help, q.slide_id, q.id);
    }
    return true;
};


var Question = Class({
  initialize: function (name, image, weight, options, help, slide_id, id) {
    this.name = name;
    this.image = image;
    this.weight = weight || 1;
    this.options = options;
    this.help = help;
    this.slide_id = slide_id;
    this.id  = id;
    Question.all.push(this);
    log.add('Question: ' + name + ' created')
  },
  checkAnswer: function ($this, option) {
    var thisAnswer = $.grep(this.options, function (a) {
      return ( a == option );
    })[0];
    return {$this: $this, correct: thisAnswer.correct, weight: this.weight, points: thisAnswer.points, help: this.help}
  }
});


Question.all = [];

Question.getByWeight = function (weight) {
    var questions = $.grep(Question.all, function (a) {
        return ( a.weight == weight );
    });
    return questions[randBetween(0, questions.length - 1)]
};

Question.getQuestion = function(weight, flag) {
    var questions = $.grep(Question.all, function (a) {
        return ( a.weight == weight );
    });
    return questions[flag];
};

Question.showQuizPanel = function (obj, question) {
    $('#kbc-question').html("<div><span>"+question.name+"</span></div>");
    $('#options-area').empty();
    for (var i in question.options) {
        $('#options-area').append('<div class="kbc-answer-block" id="kbc-answer-block-' + i + '"><div>' + question.options[i].name + '</div></div>');
        $('#kbc-answer-block-'+i).prepend('<img src= "" />');

    }
    $('.kbc-answer-block').unbind('click').on('click', function () {
        $this = $(this);
        $(question).trigger("answered", [question.checkAnswer($(this), question.options[parseInt($this.attr("id").split("kbc-answer-block-")[1])], $this.attr("id"))]);
    });


    $('#kbc-learn-more').attr('template-id',question.slide_id);
    $("#kbc-learn-more").unbind('click').on('click', function(e) {
      templateId = $(e.currentTarget).attr('template-id');
      console.log(templateId);
      parent.learnModal(templateId);
      parent.recordKmClick();
    });
};
