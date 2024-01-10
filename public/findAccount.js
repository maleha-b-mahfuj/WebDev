//client-side javascript for signup.pug & homepage.pug


function enableButton(){
    let userPass = document.getElementById("password");
    let username = document.getElementById("user");

    //enabling and disabling the sign-in button based on whether text was inputted in the username and password fields
    if (!((username.value.length == 0) || (userPass.value.length == 0))) {
        document.querySelector(".in").disabled = false;
    } else {
        document.querySelector(".in").disabled = true;
    }

    if (userPass.value.length > 0) {
        document.querySelector(".show").style.visibility = "visible";
    } else {
        document.querySelector(".show").style.visibility = "hidden";
    }
}

function newEnableButton(){
    let userPass = document.getElementById("newPass");
    let username = document.getElementById("newUser");

    //enabling and disabling the sign-in button based on whether text was inputted in the username and password fields
    if (!((username.value.length == 0) || (userPass.value.length == 0))) {
        document.querySelector(".newIn").disabled = false;
        document.querySelector(".newIn").style.cursor = "pointer";
    } else {
        document.querySelector(".newIn").disabled = true;
        document.querySelector(".newIn").style.cursor = "none";
    }

    if (userPass.value.length > 0) {
        document.querySelector(".show").style.visibility = "visible";
    } else {
        document.querySelector(".show").style.visibility = "hidden";
    }
}

function showPassword() {
    let userPass = document.getElementById("password");
    if (userPass.type === "password") {
        document.querySelector(".show").innerHTML = "Hide";
        userPass.type = "text";
    } else {
        document.querySelector(".show").innerHTML = "Show";
        userPass.type = "password";
    }
}

function openForm(){
    document.getElementById("SignInbox").style.display = "block";
    document.getElementById("boxes").style.opacity = "0.5";
    var buttons = document.getElementById("boxes").getElementsByTagName("button");
    for (var i = 0; i < buttons.length; i++) {
        buttons[i].disabled = true;
    }
}

function closeForm(){
    document.getElementById("SignInbox").style.display = "none";
    document.getElementById("boxes").style.opacity = "1";
    var buttons = document.getElementById("boxes").getElementsByTagName("button");
    for (var i = 0; i < buttons.length; i++) {
        buttons[i].disabled = false;
    }
    document.getElementById("newUser").value = "";
    document.getElementById("newPass").value = "";
}

function findAccount() {
    //when the sign-in button is clicked (from homepage.pug) 
    console.log("isnide");

    //getting the inputted text from the input fields
    let userPass = document.getElementById("password");
    let username = document.getElementById("user");
    document.getElementById("error").innerHTML = "";
    document.getElementById("toggle").style.display = "block";

    //creating an object with the inputted fields
    let account = {user: username.value, password: userPass.value};

    //sending a post request
    let req = new XMLHttpRequest();
	req.onreadystatechange = function(){
		if(this.readyState == 4 && this.status == 200){
            if (this.responseText === "Success") { 
                window.location.replace("/logIn/" + username.value);
            } else {  //if the username does not exist or the password does not match 
                let p = document.createElement("p");
                let text = document.createTextNode("ERROR: " +this.responseText);
                p.appendChild(text);
                p.style.margin = "0";
                p.style.padding = "0";
                document.getElementById("toggle").style.display = "none";
                document.getElementById("error").appendChild(p);
                return;
            }
		} else if (req.status === 500){ //if there was an error
            alert(this.responseText);
            return;
        }
	}
	req.open("POST", "http://localhost:3000/signIn"); 
	req.setRequestHeader("Content-type","application/json");
	req.send(JSON.stringify(account));  //sending the account to the server 
}

/*
function createAccount(){
    //when the sign up button is clicked (from signup.pug)
    let username = document.getElementById("user");
    let userPass = document.getElementById("password");
    document.getElementById("error").innerHTML = "";

    //creating a new account with the inputted fields
    let newAccount = {user: username.value, password: userPass.value};

    //sending a post request
    let req = new XMLHttpRequest();
	req.onreadystatechange = function(){
		if(this.readyState == 4 && this.status == 200){

            if (this.responseText === "Success") { 
                window.location.replace("/logIn/" + username.value);

            } else {  //if the username is a duplicate
                let p = document.createElement("p");
                let text = document.createTextNode(this.responseText);
                p.appendChild(text);
                document.getElementById("error").appendChild(p);
                return;
            }
		} else if (req.status === 500){  //if there was an error
            alert(this.responseText); 
            return;
        }
	}
	req.open("POST", "http://localhost:3000/signup"); 
	req.setRequestHeader("Content-type","application/json");
	req.send(JSON.stringify(newAccount));  //sending the new account to the server 

}
*/

function createAccount(){
    //when the sign up button is clicked (from signup.pug)
    let username = document.getElementById("newUser");
    let userPass = document.getElementById("newPass");
    document.getElementById("newError").innerHTML = "";

    //creating a new account with the inputted fields
    let newAccount = {user: username.value, password: userPass.value};

    //sending a post request
    let req = new XMLHttpRequest();
	req.onreadystatechange = function(){
		if(this.readyState == 4 && this.status == 200){

            if (this.responseText === "Success") { 
                window.location.replace("/logIn/" + username.value);

            } else {  //if the username is a duplicate
                let p = document.createElement("p");
                let text = document.createTextNode("ERROR: " + this.responseText);
                p.appendChild(text);
                document.getElementById("newError").appendChild(p);
                return;
            }
		} else if (req.status === 500){  //if there was an error
            alert(this.responseText); 
            return;
        }
	}
	req.open("POST", "http://localhost:3000/signup"); 
	req.setRequestHeader("Content-type","application/json");
	req.send(JSON.stringify(newAccount));  //sending the new account to the server 

}