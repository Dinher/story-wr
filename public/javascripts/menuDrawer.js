// MENU FUNCTIONS
var isAdmin = true;
var isMenuOpen = false;
var currentOpenMenu = "settings";
var fontSize = 1.5;
var letterSpacing = 2;
var wordSpacing = 10;
var lineHeight = 2;
var pictogramSize = 40;
var modifiedWord, defaultWord;
var wordElement, sentenceElement, pageElement;
var wordIndex, sentenceIndex, pageIndex;


function modifyFontSize(){
  fontSize = document.getElementById("inputFontSize").value;
  var pages = document.getElementsByClassName('sentence');
  for(var i = 0; i < pages.length; i++){
    var words = pages[i].getElementsByTagName('li');
    for (var j = 0; j < words.length;j++){
      words[j].setAttribute('style','margin: 0px '+wordSpacing+'px; font-size:'+fontSize+'vw;line-height:'+lineHeight+'vw'); 
    }
  }
  document.getElementById('displayFontSize').innerText = fontSize;
}

function modifyLetterSpacing(){
  letterSpacing = document.getElementById("inputLetterSpacing").value;
  var pages = document.getElementsByClassName('sentence');
  for(var i = 0; i < pages.length; i++){
    pages[i].setAttribute('style','letter-spacing:'+letterSpacing+'px;');
  }
  document.getElementById('displayLetterSpacing').innerText = letterSpacing;
}

function modifyWordSpacing(){
  wordSpacing = document.getElementById("inputWordSpacing").value;
  var pages = document.getElementsByClassName('sentence');
  for(var i = 0; i < pages.length; i++){
    var words = pages[i].getElementsByTagName('li');
    for (var j = 0; j < words.length;j++){
      words[j].setAttribute('style','margin: 0px '+wordSpacing+'px; font-size:'+fontSize+'vw;line-height:'+lineHeight+'vw'); 
    }
  }
  document.getElementById('displayWordSpacing').innerText = wordSpacing;
}

function modifyLineHeight(){
  lineHeight = document.getElementById("inputLineHeight").value;
  var pages = document.getElementsByClassName('sentence');
  for(var i = 0; i < pages.length; i++){
    var words = pages[i].getElementsByTagName('li');
    for (var j = 0; j < words.length;j++){
      words[j].setAttribute('style','margin: 0px '+wordSpacing+'px; font-size:'+fontSize+'vw;line-height:'+lineHeight+'vw'); 
    }
  }
  document.getElementById('displayLineHeight').innerText = lineHeight;
}

function modifyPictogramSize() {
  pictogramSize = document.getElementById('inputPictogramSize').value;
  var sentence = document.getElementsByClassName('sentence');
  for (var i = 0; i < sentence.length; i++){
    var img = sentence[i].getElementsByTagName('img');
    for (var j = 0; j < img.length; j++){
      img[j].setAttribute('style','width:'+pictogramSize+'px;');
    }
  }
  document.getElementById('displayPictogramSize').innerText = pictogramSize;
}


function selectMenu(selection){
  document.getElementById(currentOpenMenu).classList.remove('visibleMenu');
  document.getElementById(selection).classList.add('visibleMenu');
  currentOpenMenu = selection;
  if(!isMenuOpen){
    toggleMenu(); 
  }
}

function toggleMenu(){
  document.getElementById('menu').classList.toggle('openMenu');
  if(isMenuOpen) {
    isMenuOpen = false;
  }else {
    isMenuOpen = true;
  }
}

function search(){
  document.getElementById('searchOutput').style.opacity = "1";
  
  var query = document.getElementById('inputSearch').value.toUpperCase();
  var count = 0, tempString;
  
  //resets everything for next search display
  document.getElementById('searchOutput').innerHTML = "<h2 id='searchCount'></h2>";
  var sentences = document.getElementsByClassName('sentence');
  for(var i = 0; i < sentences.length; i++){
    var words = sentences[i].getElementsByTagName('li');
    for(var j = 0; j < words.length; j++){
      //words[j].setAttribute('style','background-color: white;'); 
      words[j].classList.remove('highlightWord');
    }
    //listSentences[i].setAttribute('style','border: 2px solid transparent;');
    sentences[i].classList.remove('highlightSentence');
  }   
  
  // ignores empty query
  if(query !=""){
    for(var i = 0; i <= numberPages; i++){
      var foundSentences = [];
      var page = document.getElementById('page_'+i);
      var sentences = page.getElementsByClassName('sentence');
      var foundQuery = false;
    
      for(var j = 0; j < sentences.length;j++){
        var words = sentences[j].getElementsByTagName('li');
      
        for(var k = 0; k < words.length; k++){
          tempString = words[k].innerHTML.toUpperCase();
          if(tempString.search(query) >= 0 ){
            //words[j].setAttribute('style','background-color: yellow;'); 
            //sentences[j].setAttribute('style','border: 2px solid orangered;');
            words[k].classList.add('highlightWord');
            sentences[j].classList.add('highlightSentence');
            count++;
            foundQuery = true;
          }
        }
        if(foundQuery){
          foundSentences.push(sentences[j].innerText);
          foundQuery = false;
        }
      }
      if(foundSentences.length > 0){
        document.getElementById('searchOutput').innerHTML += "<h3 onclick=\"changePage("+i+")\">Page "+(i+1)+"</h3>";
        for(var l = 0; l < foundSentences.length;l++){
          document.getElementById('searchOutput').innerHTML += "<p>"+foundSentences[l]+"</p>";
        }
      }
    }  
  }
  
  document.getElementById('searchCount').innerHTML = "Found: "+count+"";
}

function changeWord(word){
  if(isAdmin){
    currentOpenMenu = "editWord";
    
    // get document elements
    wordElement = word;
    sentenceElement = word.parentElement;
    pageElement = sentenceElement.parentElement;
    modifiedWord = word.innerHTML;
    defaultWord = word.innerText;
    
    // get index of element
    wordIndex = Array.prototype.indexOf.call(sentenceElement.children, wordElement);
    sentenceIndex = Array.prototype.indexOf.call(pageElement.children, sentenceElement);
    pageIndex = pageElement.id;
    
    document.getElementById("inputEditWord").value = modifiedWord;
    selectMenu("editWord"); 
  }
}

// on server message
function updateWord(){
  document.getElementById(pageIndex).children[sentenceIndex].children[wordIndex].innerHTML = modifiedWord;
}

// on server message
function updateFont(){
  var pages = document.getElementsByClassName('sentence');
  for(var i = 0; i < pages.length; i++){
    var words = pages[i].getElementsByTagName('li');
    for (var j = 0; j < words.length;j++){
      words[j].setAttribute('style','margin: 0px '+wordSpacing+'px; font-size:'+fontSize+'vw;line-height:'+lineHeight+'vw'); 
    }
    pages[i].setAttribute('style','letter-spacing:'+letterSpacing+'px;');
  }
}

// keypress??
function oninputEditWord(input){
  modifiedWord = wordElement.innerHTML = input.value;
}

function addImage(element){
  var imageSource = element.getAttribute("src");
  wordElement.innerHTML = "<img class='paragraphImage' src="+imageSource+">";
  modifiedWord = "<img class='paragraphImage' src="+imageSource+">";
}