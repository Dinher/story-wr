var connection = null;
var clientID = 0;
var WebSocket = WebSocket;

function connectSocket(){
  var serverUrl = "ws://" + window.location.hostname + ":4000";

  connection = new WebSocket(serverUrl);

  connection.onopen = function(evt) {
    console.log("Connection Open: "+JSON.stringify(evt));
  };
  connection.onmessage = function(server) {
    var text = "";
    var message = JSON.parse(server.data);
    
    switch(message.type) {
      case "connectionSuccess":
        if(message.id == 1){
          isAdmin = true;
          showMenu();
        }
        console.log(message);
      case "test":
        console.log(message);
      case "updateWord":
        //alert(JSON.stringify(message));
        console.log(message);
        modifiedWord = message.modifiedWord;  
        wordIndex = message.wordIndex;
        sentenceIndex = message.sentenceIndex;
        pageIndex = message.pageIndex;
        updateWord();
        break;
      case "updateFont":
        //alert(JSON.stringify(message));
        console.log(message);
        fontSize = message.newFontSize;
        letterSpacing = message.newLetterSpacing;
        wordSpacing = message.newWordSpacing;
        lineHeight = message.newlineHeight;
        pictogramSize = message.pictogramSize;
        updateFont();
        break;
    }
  };
  
}

// test function for sending socket
function sendSocket() {
  var text = document.getElementById('socketInput').value;
  let toServer = {
    text: text,
    type: "test"
  };
  connection.send(JSON.stringify(toServer));
}

function saveSettings(){
  let toServer = null;
  switch(currentOpenMenu){
    case "highlight": break;
    case "notes": break;
    case "syntax": break;
    case "display":
      toServer = {
        type: "updateFont",
        newFontSize: fontSize,
        newLetterSpacing: letterSpacing,
        newWordSpacing: wordSpacing,
        newLineHeight: lineHeight,
        newPictoSize: pictogramSize
      }
      break;
    case "search": break;
    case "settings": break;
    case "editWord":
      toServer = {
        type: "updateWord",
        modifiedWord: modifiedWord,
        wordIndex: wordIndex,
        sentenceIndex: sentenceIndex,
        pageIndex: pageIndex
      }
      break;
    default: break;
  }
  connection.send(JSON.stringify(toServer));
  toServer = "";
}

function showMenu(){
  if(isAdmin){
    document.getElementById('menu').setAttribute('style','display:inherit;');
  }
}

connectSocket();
