// detects keypress and focuses search field
document.onkeydown = function (e) {
  var key = e.which || e.keyCode;  
  // Next page, '['
  if (key === 221) {
    if(currentPage >= numberPages){
      currentPage = numberPages;
    }else{
      changePage(currentPage+1);
    }
  // previous page ']'
  } else if (key === 219) {
    if(currentPage <= 0){
      currentPage = 0;
    }else{
      changePage(currentPage-1); 
    }
  }else if(key === 13 && (document.getElementById('inputSearch')== document.activeElement)){
    search();
  }else if(key === 13 && (document.getElementById('inputEditWord')== document.activeElement)){
    alert('applied change');
  }
};
