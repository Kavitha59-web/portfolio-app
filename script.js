const menuButton = document.getElementById("menuButton");

const navLinks = document.querySelector(".nav-links");


menuButton.addEventListener("click", function () {

    navLinks.classList.toggle("show");

});