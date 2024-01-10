let submit = document.getElementById("submit");
submit.onclick = createAccount;

function createAccount(){
    let username = document.getElementById("user");
    let userPass = document.getElementById("password");

    if (username.value.length == 0){
        alert("Please enter a username");
        return;
    }
    if (userPass.value.length == 0){
        alert("Please enter a password");
        return;
    }

    let newAccount = {user: username.value, password: userPass.value};
    console.log(newAccount);

    let req = new XMLHttpRequest();
	req.onreadystatechange = function(){
		if(this.readyState == 4 && this.status == 200){
            console.log(this.responseText);
            window.location.replace("/" + this.responseText); //responseText == username
		} else if (this.readyState == 4 && req.status === 500){ //if the username is a duplicate
            alert(this.responseText + "Try again");
            username.value = "";
            userPass.value = "";
            return;
        }
	}

	req.open("POST", "http://localhost:3000/signup"); //or /signup
	req.setRequestHeader("Content-type","application/json");
	req.send(JSON.stringify(newAccount)); 

}


