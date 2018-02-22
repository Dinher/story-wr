var currentPage = 0;
var numberPages = 0;

function changePage(page){
  if(page < 0){
    page = 0;
  }else if(page > numberPages){
    page = numberPages;
  }
  if(page != currentPage){
    document.getElementById("page_"+currentPage).classList.remove("visible");
    document.getElementById("page_"+currentPage).classList.add("hidden");
    document.getElementById("nav_"+currentPage).classList.toggle('currentPage');
    
    document.getElementById("page_"+page).classList.remove("hidden");
    document.getElementById("page_"+page).classList.add("visible");
    currentPage = page;
    
    document.getElementById("nav_"+currentPage).classList.toggle('currentPage');
  }
}

function populateText(){
  Object.keys(book.pages).forEach(function(k){
    if(k == 0){
      var meta = book.pages[k];
      var out = "<ul class='bookTitle'>"+meta+"</ul>";
      document.getElementById("page_"+k).innerHTML += out;    
    }else{
      numberPages++;
      var sentence = book.pages[k];
      sentence = sentence.split(" ");
      var words = "";
      for(var i = 0; i < sentence.length;i++){
        if(sentence[i][0] == "—"){
          words += "</ul><ul class='sentence'><li>"+sentence[i]+"</li>";  
        }else if(sentence[i][sentence[i].length-1] == "." && sentence[i+1] != null && sentence[i+1][0] != "—"){
          words += "<li onclick='changeWord(this)'>"+sentence[i]+"</li></ul><ul class='sentence'>";  
        }else{
          words += "<li onclick='changeWord(this)'>"+sentence[i]+"</li>";
        }
      }
      var out = "<ul class='sentence'>"+words+"</ul>";
      document.getElementById("page_"+k).innerHTML += out;    
    }
  });
  addPagination();
};

function addPagination(){
  for(var i = 0; i <= numberPages; i++){
    if(i == 0){
      document.getElementById('pagination').innerHTML +="<li class='currentPage' onclick='changePage(0)' id='nav_0'>1</li>";  
    }else{
      document.getElementById('pagination').innerHTML +="<li onclick='changePage("+i+")' id='nav_"+i+"'>"+(i+1)+"</li>";
    }
  }
}

populateText();


