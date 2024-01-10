

function likeArt(){
    let artId = event.target.parentElement.id;  //retrieving the unique database-generated ID of the artwork
    let userId = (window.location.pathname).replace("art", ""); //username
    console.log("http://localhost:3000" + userId + "like");

    //let userId = (window.location.pathname).replace("/items/", ""); //getting the object id from the url

    //Request
    
    let req = new XMLHttpRequest();
    req.onreadystatechange = function(){
      if(this.readyState == 4 && this.status == 201){
          alert(this.responseText);
      } else if (req.status === 500){
          alert(this.responseText);
      }
    }
    req.open("PUT", "http://localhost:3000" + userId + "like", true);
    req.setRequestHeader("Content-type","application/json");
    req.send(JSON.stringify({"artID": artId})); // sending the art ID to the server 
} 

function reviewed(){
  let artId = event.target.parentElement.id;
  let text = event.target.parentElement.querySelector("input");
  console.log(text);
  
  let userId = (window.location.pathname).replace("art", "");
  let req = new XMLHttpRequest();
    req.onreadystatechange = function(){
    if(this.readyState == 4 && this.status == 201){
        if (this.responseText === "Success"){
          text.value = "";
          alert("Review has been added");
        }
        } else if (req.status === 500){
          alert(this.responseText);
        }
    }
    req.open("PUT", "http://localhost:3000" + userId + "review", true);
    req.setRequestHeader("Content-type","application/json");
    req.send(JSON.stringify({"artID": artId, "review": text.value})); // we send the updated item to the server 

}


function followArtist(){
  let artId = event.target.id; //retrieving the artist's name from the button's id
  let userId = (window.location.pathname).replace("art", ""); //username

  let req = new XMLHttpRequest();
    req.onreadystatechange = function(){
      if(this.readyState == 4 && this.status == 201){
          alert(this.responseText);
      } else if (req.status === 500){
          alert(this.responseText);
      }
    }
    req.open("PUT", "http://localhost:3000" + userId + "follow", true);
    req.setRequestHeader("Content-type","application/json");
    req.send(JSON.stringify({"artID": artId})); //sending the artist's name to the server 

}

function enableButton(){
  //if the search field in the header is empty, disables the submit button
  let search = document.getElementById("searchText");

  if (search.value == 0){
    document.getElementById("searchButton").disabled = true;
  } else {
    document.getElementById("searchButton").disabled = false;
  }
}

function searchButton(){
  let search = document.getElementById("searchText").value;
  let userId = document.querySelector("body").id;
  console.log(userId);

  let req = new XMLHttpRequest();
	req.onreadystatechange = function(){
		if(this.readyState == 4 && this.status == 200){
      console.log("it worked");
      window.location.replace("http://localhost:3000/" + userId + "/search/" + search);
		} else if (req.status === 500){ //if there was an error
            alert(this.responseText);
            return;
        }
	}
	req.open("GET", "http://localhost:3000/" + userId + "/search/" + search); 
	req.send();  
}