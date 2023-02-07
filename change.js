const animateText = document.getElementById("animate");
const redAnimate = document.getElementById("animateRed");
const greenAnimate = document.getElementById("animateGreen");

redAnimate.addEventListener("click", function(){
    animateText.style.color = 'red';
});

function changeGreen(){
    animateText.style.color = 'green';
}

