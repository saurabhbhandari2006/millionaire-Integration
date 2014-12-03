var config = {};
config.base = {
    type: "environment",
    states: [
        {name: "default", representation: "<img src='" + getImg("kbc-back") + "'/>"}
    ],
    locations: [
        {name: "message-box", states: [
            {name: "message", representation: "<div id='message'></div>"}
        ]}
    ]
};
config.ladder = {
    type: "environment",
    states: [
        {name: "default", representation: ""}
    ],
    locations: [
        {name: "kbc_ladder10_text", sequence: 9, states: [
            {name: "complete", representation: "<span class='completed'>" + getText("kbc-ladder10-text") + "</span>"},
            {name: "default", representation: "<span>" + getText("kbc-ladder10-text") + "</span>"}

        ]},
        {name: "kbc_ladder09_text", sequence: 8, states: [
            {name: "complete", representation: "<span class='completed'>" + getText("kbc-ladder09-text") + "</span>"},
            {name: "default", representation: "<span>" + getText("kbc-ladder09-text") + "</span>"}
        ]},
        {name: "kbc_ladder08_text", sequence: 7, states: [
            {name: "complete", representation: "<span class='completed'>" + getText("kbc-ladder08-text") + "</span>"},
            {name: "default", representation: "<span>" + getText("kbc-ladder08-text") + "</span>"}
        ]},
        {name: "kbc_ladder07_text", sequence: 6, states: [
            {name: "complete", representation: "<span class='completed'>" + getText("kbc-ladder07-text") + "</span>"},
            {name: "default", representation: "<span>" + getText("kbc-ladder07-text") + "</span>"}

        ]},
        {name: "kbc_ladder06_text", sequence: 5, states: [
            {name: "complete", representation: "<span class='completed'>" + getText("kbc-ladder06-text") + "</span>"},
            {name: "default", representation: "<span>" + getText("kbc-ladder06-text") + "</span>"}

        ]},
        {name: "kbc_ladder05_text", sequence: 4, states: [
            {name: "complete", representation: "<span class='completed'>" + getText("kbc-ladder05-text") + "</span>"},
            {name: "default", representation: "<span>" + getText("kbc-ladder05-text") + "</span>"}

        ]},
        {name: "kbc_ladder04_text", sequence: 3, states: [
            {name: "complete", representation: "<span class='completed'>" + getText("kbc-ladder04-text") + "</span>"},
            {name: "default", representation: "<span>" + getText("kbc-ladder04-text") + "</span>"}

        ]},
        {name: "kbc_ladder03_text", sequence: 2, states: [
            {name: "complete", representation: "<span class='completed'>" + getText("kbc-ladder03-text") + "</span>"},
            {name: "default", representation: "<span>" + getText("kbc-ladder03-text") + "</span>"}

        ]},
        {name: "kbc_ladder02_text", sequence: 1, states: [
            {name: "complete", representation: "<span class='completed'>" + getText("kbc-ladder02-text") + "</span>"},
            {name: "default", representation: "<span>" + getText("kbc-ladder02-text") + "</span>"}

        ]},
        {name: "kbc_ladder01_text", sequence: 0, states: [
            {name: "complete", representation: "<span class='completed'>" + getText("kbc-ladder01-text") + "</span>"},
            {name: "default", representation: "<span>" + getText("kbc-ladder01-text") + "</span>"}

        ]}
    ]
};

config.lifelines = {
    type: "environment",
    states: [
        {name: "default", representation: ""}

    ],
    locations: [
        {name: "kbc-lifeline-panel", sequence: 0, states: [
            {name: "kbc-lifeline-3", representation: "<div id='kbc-lifeline-3' class='kbc-lifeline-3-space'></div>"},
            {name: "kbc-lifeline-2", representation: "<div id='kbc-lifeline-2' class='kbc-lifeline-2-space'></div>"},
            {name: "kbc-lifeline-1", representation: "<div id='kbc-lifeline-1' class='kbc-lifeline-1-space'></div>"},
            {name: "default", representation: "<span id='default'>Choose any of the Lifeline to help you win the game.</span>"}
        ]},

        {name: "kbc-lifeline1-img", sequence: 0, states: [
            {name: "complete", representation: "<img class='complete' src='" + getImg("kbc-lifeline1-off-img") + "'/>"},
            {name: "default", representation: "<img class='default' src='" + getImg("kbc-lifeline1-img") + "'/>"}
        ]},
        {name: "kbc-lifeline2-img", sequence: 0, states: [
            {name: "complete", representation: "<img class='complete' src='" + getImg("kbc-lifeline2-off-img") + "'/>"},
            {name: "default", representation: "<img class='default' src='" + getImg("kbc-lifeline2-img") + "'/>"}
        ]},
        {name: "kbc-lifeline3-img", sequence: 0, states: [
            {name: "complete", representation: "<img class='complete' src='" + getImg("kbc-lifeline3-off-img") + "'/>"},
            {name: "default", representation: "<img class='default' src='" + getImg("kbc-lifeline3-img") + "'/>"}
        ]}
    ]
};


config.player = {
    type: "entity",
    states: [
        {name: "default", representation: ""}
    ]
};

config.kbc_lifeline = {
    type:"environment",
    states:[
        {name:"kbc_lifeline_text",representation:""}
    ]
};

config.poll = {
    type:"environment",
    states:[
        {name:"poll",representation:"<canvas id='abc' width='182' height='145'></canvas>"}
    ]
}
