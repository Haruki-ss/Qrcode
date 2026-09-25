function showSignup() {

    document.getElementById("loginForm").style.display = "none";

    document.getElementById("signupForm").style.display = "block";
}


function showLogin() {

    document.getElementById("signupForm").style.display = "none";

    document.getElementById("loginForm").style.display = "block";
}


function login() {

    window.location.href = "http://127.0.0.1:5500/TEACHER%20INTERFACE/CLASSLIST/teacherclass.html";
}


function signup() {

    alert("Sign Up button clicked!");
}