function getImg(str){
    if(parent.getImageInGame(parent.currentIntegratedGame,str) === 403)
        return defaultImages.path+defaultImages[str]
    else
        return parent.getImageInGame(parent.currentIntegratedGame,str)
}

function getText(str){
    if(parent.getTextInGame(parent.currentIntegratedGame,str) === 403)
        return defaultText[str]
    else
        return parent.getTextInGame(parent.currentIntegratedGame,str)
}

window.getImg= getImg
window.getText = getText

//this is the object which contains path for default text and images
defaultImages  ={}
defaultImages.path = "img/"
defaultImages["kbc-back"] = "background.jpg";
defaultImages["kbc-question-back"] = "kbc-question-texture.png";
defaultImages["kbc-answer-back"] = "kbc-answer-texture.png";
defaultImages["kbc-answer-hover-back"] = "kbc-answer-hover-texture.png";
defaultImages["kbc-answer-right-back"] = "kbc-answer-right-texture.png";
defaultImages["kbc-modal-back"] = "kbc-modal-texture.png";
defaultImages["kbc-right-back1"] = "kbc-lifeline-panel1-texture.png";
defaultImages["kbc-right-back2"] = "kbc-lifeline-panel2-texture.png";
defaultImages["kbc-right-back3"] = "kbc-lifeline-panel3-texture.png";
defaultImages["kbc-lifeline1-img"] = "poll.png";
defaultImages["kbc-lifeline1-off-img"] = "poll-disabled.png";
defaultImages["kbc-lifeline2-img"] = "50-50.png";
defaultImages["kbc-lifeline2-off-img"] = "50-50-disabled.png";
defaultImages["kbc-lifeline3-img"] = "change.png";
defaultImages["kbc-lifeline3-off-img"] = "change-disabled.png";
defaultImages["kbc-endgame-back"] = "kbc-endgame-texture.png";
defaultImages["kbc-player-back"] = "kbc-player-texture.png";



defaultText = {};
defaultText["kbc-ladder01-text"] = "$ 1,000";
defaultText["kbc-ladder02-text"] = "$ 2,000";
defaultText["kbc-ladder03-text"] = "$ 5,000";
defaultText["kbc-ladder04-text"] = "$ 10,000";
defaultText["kbc-ladder05-text"] = "$ 20,000";
defaultText["kbc-ladder06-text"] = "$ 50,000";
defaultText["kbc-ladder07-text"] = "$ 100,000";
defaultText["kbc-ladder08-text"] = "$ 200,000";
defaultText["kbc-ladder09-text"] = "$ 500,000";
defaultText["kbc-ladder10-text"] = "$ 1,000,000";





window.defaultImages = defaultImages;
