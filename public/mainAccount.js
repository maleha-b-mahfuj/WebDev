function unfollowArt(){
    //if the user clicks on the unfollow button from account.pug
    let id = event.target.id;   //getting the artist's name (also unique)
    console.log(id);

    let userId = window.location.pathname;  //getting the username from the URL

    //sending a PUT request as we want to update a User document 
    let req = new XMLHttpRequest();
    req.onreadystatechange = function(){
    if(this.readyState == 4 && this.status == 201){
        alert(this.responseText);
        //window.location.replace("/items");
        document.location.reload();
        } else if (req.status === 500){
          alert(this.responseText);
        }
    }
    req.open("PUT", "http://localhost:3000" + userId + "/unfollow", true);
    req.setRequestHeader("Content-type","application/json");
    req.send(JSON.stringify({"artID": id})); // we are sending the name of the artist   

}
function upgrade(){
  let userId = window.location.pathname; //username

  let req = new XMLHttpRequest();
    req.onreadystatechange = function(){
    if(this.readyState == 4 && this.status == 201){
        if (this.responseText === "Success"){ //if the update was successful
          alert("You are now an artist!. Please add an artwork now"); //come back here  
          document.location.reload();
        }
        //window.location.replace("/items");
      } else if (req.status === 500){ //if there was an error
        alert(this.responseText);
      }
    }
    req.open("PUT", "http://localhost:3000" + userId + "/upgrade", true);
    req.setRequestHeader("Content-type","application/json");
    req.send(JSON.stringify({})); // we send an empty body 
}

function patron(){
  let userId = window.location.pathname; //username
  let req = new XMLHttpRequest();
    req.onreadystatechange = function(){
      if(this.readyState == 4 && this.status == 201){
          console.log(this.responseText);
          if (this.responseText === "Success"){
            alert("You are back to being a patron!");
            document.location.reload();}
          //window.location.replace("/items");
      } else if (req.status === 500){ //if there was an error
        alert(this.responseText);}
    }
    req.open("PUT", "http://localhost:3000" + userId + "/patron", true);
    req.setRequestHeader("Content-type","application/json");
    req.send(JSON.stringify({})); // we send an empty body
}

function unLikeArt(){
    //if the user clicks on the dislike button from account.pug
    let id = event.target.id;   //id of the artwork
    let userId = window.location.pathname;  //username

    let req = new XMLHttpRequest();
    req.onreadystatechange = function(){
    if(this.readyState == 4 && this.status == 201){
        alert(this.responseText);
        //window.location.replace("/items");
        document.location.reload();
        } else if (req.status === 500){
          alert(this.responseText);
        }
    }
    req.open("PUT", "http://localhost:3000" + userId + "/unlike", true);
    req.setRequestHeader("Content-type","application/json");
    req.send(JSON.stringify({"artID": id})); //sending the id of the artwork to the server     
}


function enableButton(){
  let search = document.getElementById("searchText");

  if (search.value == 0){
    document.getElementById("searchButton").disabled = true;
    document.getElementById("searchButton").style.cursor = "none";
  } else {
    document.getElementById("searchButton").disabled = false;
    document.getElementById("searchButton").style.cursor = "pointer";
  }
}

function searchButton(){
  let search = document.getElementById("searchText").value;
  let userId = window.location.pathname;  //username
  userId = userId.replace("/logIn", "");
  console.log(userId);

  //sending a post request
  let req = new XMLHttpRequest();
	req.onreadystatechange = function(){
		if(this.readyState == 4 && this.status == 200){
      console.log("it worked");
      window.location.replace("http://localhost:3000" + userId + "/search/" + search);
		} else if (req.status === 500){ //if there was an error
            alert(this.responseText);
            return;
        }
	}
	req.open("GET", "http://localhost:3000" + userId + "/search/" + search); 
	req.send();  //sending the account to the server 
}

function removeReview(){
  let review = event.target.id;
  let key = event.target.parentElement.id;
  console.log(key);
  let userId = window.location.pathname;  //username
  console.log(userId);

    let req = new XMLHttpRequest();
    req.onreadystatechange = function(){
    if(this.readyState == 4 && this.status == 201){
        if (this.responseText === "Success"){
          alert("review has been removed");
        }
        //window.location.replace("/items");
        document.location.reload();
        } else if (req.status === 500){
          alert(this.responseText);
        }
    }
    req.open("PUT", "http://localhost:3000" + userId + "/removeReview", true);
    req.setRequestHeader("Content-type","application/json");
    req.send(JSON.stringify({"review": review, "id": key})); //sending the id of the artwork to the server  
}