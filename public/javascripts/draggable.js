let timeline = document.getElementById("timeline");
let images = document.getElementById("images");

let isLibraryActive = true;
let isStoryWriterActive = false;
let isStoryReaderActive = false;
let wasElementDropped = false;  // only changed when storyWrite is open
let currentPage = 1;

// Sound variables
const audio_pickup = new Audio("../public/audio/BubblePo-Benjamin-8920_hifi.mp3");
const audio_putdown_timeline = new Audio("../public/audio/ambient_-agent_vi-8701_hifi.mp3");
const audio_putdown_images = audio_putdown_timeline;
const audio_writer = new Audio("../public/audio/Pop_26-S_Bainbr-7954_hifi.mp3");
const audio_focusTextarea = new Audio("../public/audio/pop-SodaBush-7991_hifi.mp3");
const audio_pageTurn = new Audio("../public/audio/page_turn.mp3");
const audio_bookClose = new Audio("../public/audio/book_close.mp3");
const audio_bookChange = new Audio("../public/audio/Pop-J_Fairba-8421_hifi.mp3");

let book = haircut;

// Dragula element registration
var drake = dragula([document.querySelector('#images'), document.querySelector('#timeline')],{revertOnSpill:true, direction:'horzontal'});

// Element drop
drake.on('drop',function(element,target,source,sibling){
  if(target.id == "timeline"){
    audio_putdown_timeline.play();  
  }else if(target.id == "images"){
    audio_putdown_images.play();
  }
  if(target.id == 'timeline' && isStoryWriterActive){
    wasElementDropped = true;
    storyWriter();
  }
});

// element pickup
drake.on('drag',function(element,source){
  audio_pickup.play();
  // if node is being edited, shrink it back down
  if(element.className.search('images_node') != -1 && source.id == 'timeline'){
    let nodesList = source.getElementsByClassName('images_node');
    for(let node = 0; node < nodesList.length; node++){
      nodesList[node].classList.remove('growFocusNode');
    }
  }
});

// Populates images
function fillImages(){
  for(var i = 1;i <= book.meta.numberPages; i++){
    let timeline_node = "<li class='timeline_node' id=timeline_node_id_"+i+">"+i+"</li>";
    let images_node = "<li class='images_node' id=images_node_id_"+i+"><img src='../public/images/illustrations/"+book.meta.title+"/"+i+".jpg' /></li>";
    //timeline.innerHTML += timeline_node;
    images.innerHTML += images_node;
  }
}

// opens story writer
function storyWriter(){
  // shut it down  
  if(isStoryWriterActive && wasElementDropped == false){
    let timeline_textarea = timeline.getElementsByTagName('textarea');
    
    // hides textarea
    for(let node = 0; node < timeline_textarea.length; node++){
      Object.assign(timeline_textarea[node].style,{borderWidth:'0px',height:'0px'});
    }
    
    // shrinks nodes
    let timeline_node = timeline.getElementsByTagName('li');
    for(let node = 0; node < timeline_node.length; node++){
      timeline_node[node].classList.toggle('growTimelineNode');
    }
    
    audio_writer.play();
    
    // move button
    Object.assign(document.getElementById('write_button').style,{marginTop:"155px",transform:"rotateX(0deg)"});
    Object.assign(document.getElementById('read_button').style,{marginTop:"155px",transform:"rotateX(0deg)"});
    Object.assign(document.getElementById('library_button').style,{marginTop:"155px",transform:"rotateY(0deg)"});
    
    // shrink contianer
    timeline.style.height = "";
    
    
    isStoryWriterActive = false;
  
  // write is already open, but new image dropped
  }else if(wasElementDropped == true){
    let timeline_images = timeline.getElementsByClassName("images_node");
    for(let node = 0; node < timeline_images.length; node++){
      if(timeline_images[node].getElementsByTagName('textarea').length == 0){
        timeline_images[node].innerHTML += "<textarea onfocus='changeNodeSize(this);' onfocusout='changeNodeSize(this);'></textarea>";
        timeline_images[node].classList.toggle('growTimelineNode'); 
      }
    }
    
    wasElementDropped = false;
  // open story writer
  }else{
    audio_writer.play();
    
    // move button
    Object.assign(document.getElementById('write_button').style,{marginTop:"470px",transform:"rotateX(180deg)"});
    Object.assign(document.getElementById('read_button').style,{marginTop:"470px",transform:"rotateY(180deg)"});
    Object.assign(document.getElementById('library_button').style,{marginTop:"470px",transform:"rotateY(180deg)"});
    timeline.style.height = "500px";
    
    // add text area to node
    let timeline_images = timeline.getElementsByClassName("images_node");
    for(let node = 0; node < timeline_images.length; node++){
      // only apply one text area
      if(timeline_images[node].getElementsByTagName('textarea').length == 0){
        timeline_images[node].innerHTML += "<textarea onfocus='changeNodeSize(this);' onfocusout='changeNodeSize(this);'></textarea>";
      }else{
        let textarea = timeline_images[node].getElementsByTagName('textarea')[0];
        Object.assign(textarea.style,{borderWidth:'1px',height:'100px'});
      }
      timeline_images[node].classList.toggle('growTimelineNode');
    }
    
    isStoryWriterActive = true;
  }
}

// grow timeline node for writing
function changeNodeSize(child){
  let parent = child.parentElement;
  parent.classList.toggle('growFocusNode');
  audio_focusTextarea.play();
}

// popup story reader
function storyReader(){
  // close reader
  let reader = document.getElementById('readerContainer');
  
  if(isStoryReaderActive){
    audio_bookClose.play();
    Object.assign(document.getElementById('read_button').style,{transform:"rotateY(180deg)",backgroundColor:"#23a24d"});
    
    document.getElementsByTagName('body')[0].style.overflow = '';
    reader.classList.remove('showReader');
    
    isStoryReaderActive = false;
    
  // open reader
  }else{
    audio_pageTurn.play();
    Object.assign(document.getElementById('read_button').style,{transform:"rotateY(0deg)",backgroundColor:"aquamarine"});
    
    document.getElementsByTagName('body')[0].style.overflow = 'hidden';
    reader.classList.add('showReader');
    
    isStoryReaderActive = true;
  }
}

//populate book
function populateBook(){
  let pagination = document.getElementById('readerPagination');
  let readerBook = document.getElementById('readerBook'); 
  
  let numPages = book.meta.numberPages;
  let title = book.meta.title;
  
  for(let i = 1; i <= numPages; i++){
    if(i == 1){
      pagination.innerHTML += '<li id="pagination' + i + '" onclick="turnPage(' + i + ')" class="paginationCurrent">' + 1 + '</li>'
      
      let image = '<img src="../public/images/illustrations/'+title+'/'+i+'.jpg" alt="">';
      let text = '<p>' + book.pages[i] + '</p>'
      let page = '<li id="page' + i + '" class="page showPage">' + image + text + '</li>';
  
      readerBook.innerHTML += page;
    }else{
      pagination.innerHTML += '<li id="pagination' + i + '" onclick="turnPage(' + i + ')">' + i + '</li>'
    
      let image = '<img src="../public/images/illustrations/'+title+'/'+i+'.jpg" alt="">';
      let text = '<p>' + book.pages[i] + '</p>'
      let page = '<li id="page' + i + '" class="page">' + image + text + '</li>';
  
      readerBook.innerHTML += page;
    }
  }
}

// turn page
function turnPage(page){
  console.log("page:"+page+" current:"+currentPage);
  if(page < 1){
    page = 1;
    return;
  }else if(page > book.meta.numberPages){
    page = book.meta.numberPages;
    return;
  }else if(page != currentPage){
    audio_pageTurn.play();
    // change styles of previous
    document.getElementById("pagination"+currentPage).classList.toggle('paginationCurrent');
    document.getElementById("page"+currentPage).classList.toggle('showPage');
  
    // add styles to current
    document.getElementById("page"+page).classList.toggle('showPage');
    document.getElementById("pagination"+page).classList.toggle('paginationCurrent');
  
    currentPage = page;
  }
}

function openLibrary(){
  audio_bookClose.play();
  
  if(isLibraryActive){
    document.getElementById('libraryContainer').classList.toggle('visible');
    let library = document.getElementById('library_button');
    Object.assign(library.style,{zIndex:"1",transform:"rotateY(0deg)"});
    document.getElementsByTagName('body')[0].style.overflow = '';

    isLibraryActive = false;
  }else{
    document.getElementById('libraryContainer').classList.toggle('visible');
    let library = document.getElementById('library_button')
    Object.assign(library.style,{zIndex:"15",transform:"rotateY(180deg)"});
    document.getElementsByTagName('body')[0].style.overflow = 'hidden';

    isLibraryActive = true;
  }
}

function changeBook(newBook){
  audio_bookChange.play();
  book = newBook;
  // clear previous
  images.innerHTML = "";
  timeline.innerHTML = "";
  document.getElementById('readerPagination').innerHTML = "";
  document.getElementById('readerBook').innerHTML = "";
  
  // repopulate everything
  populateBook();
  fillImages();
};

fillImages();
populateBook();