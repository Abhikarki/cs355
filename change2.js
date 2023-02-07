const selectPeter = document.getElementById("peterImg");
const petForward = document.getElementById("peterForward");
const petReverse = document.getElementById("peterReverse");

const changeWhite = document.getElementById("whiteLine");
const changeBlack = document.getElementById("blackLine");

const first = document.getElementById("box1");
const second = document.getElementById("box2");
const third = document.getElementById("box3");

petForward.addEventListener("click", function(){
    selectPeter.style.animation = "movePeter 5s infinite";
    
});

petReverse.addEventListener("click", function(){
    selectPeter.style.animation = "movePeterReverse 5s infinite";
    
});

changeWhite.addEventListener("click", function(){
    first.style.borderBottom = "4px solid white";
    first.style.borderRight = "4px solid white";
    second.style.borderTop = "4px solid white";
    second.style.borderRight = "4px solid white";
    third.style.borderBottom = "4px solid white";

});

changeBlack.addEventListener("click", function(){
    first.style.borderBottom = "4px solid black";
    first.style.borderRight = "4px solid black";
    second.style.borderTop = "4px solid black";
    second.style.borderRight = "4px solid black";
    third.style.borderBottom = "4px solid black";
})