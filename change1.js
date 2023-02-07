
const widthImage = document.getElementById("secondImage");
const increaseWidth = document.getElementById("increase");
const decreaseWidth = document.getElementById("decrease");


increaseWidth.addEventListener("click", function(){
    const h = widthImage.clientHeight;
    widthImage.style.width = (widthImage.clientWidth + 20) + "px";
    widthImage.style.height = h + "px";
    var text = document.getElementById("tx");
    text.style.backgroundColor = "green";
    setTimeout(function() {
      text.style.backgroundColor = "";
    }, 1000);
    
});

decreaseWidth.addEventListener("click", function(){const h = widthImage.clientHeight;
    if(widthImage.clientWidth > 20){
    widthImage.style.width = (widthImage.clientWidth - 20) + "px";
    widthImage.style.height = h + "px";
    var text = document.getElementById("tx");
    text.style.backgroundColor = "red";
    setTimeout(function() {
      text.style.backgroundColor = "";
    }, 1000);
    }
});
    
