
function likeArt(){
  let artId = event.target.id;  //retrieving the unique database-generated ID of the artwork

  let userId = (window.location.pathname).replace("/art", ""); //username
  userId = (userId).replace(artId, ""); //username

  //Request
  
  let req = new XMLHttpRequest();
  req.onreadystatechange = function(){
    if(this.readyState == 4 && this.status == 201){
        alert(this.responseText);
        document.location.reload();
    } else if (req.status === 500){
        alert(this.responseText);
    }
  }
  req.open("PUT", "http://localhost:3000" + userId + "like", true);
  req.setRequestHeader("Content-type","application/json");
  req.send(JSON.stringify({"artID": artId})); // sending the art ID to the server 

} 

function reviewed(){
  let artId = event.target.id;  //retrieving the unique database-generated ID of the artwork
  let text = document.getElementById("review");  //retrieving what the user wrote
  
  let userId = (window.location.pathname).replace("/art", "");
  userId = (userId).replace(artId, ""); //username
  
  let req = new XMLHttpRequest();
    req.onreadystatechange = function(){
    if(this.readyState == 4 && this.status == 201){
        if (this.responseText === "Success"){
          alert("Review has been added");
          window.location.reload();
        }
        } else if (req.status === 500){
          alert(this.responseText);
        }
    }
    req.open("PUT", "http://localhost:3000" + userId + "review", true);
    req.setRequestHeader("Content-type","application/json");
    req.send(JSON.stringify({"artID": artId, "review": text.value})); 
}

function enableButton(){
  //disables/enables the search button in the header
  let search = document.getElementById("searchText");

  if (search.value == 0){
    document.getElementById("searchButton").disabled = true;
  } else {
    document.getElementById("searchButton").disabled = false;
  }
}

function searchButton(){
  let search = document.getElementById("searchText").value;
  let userId = document.querySelector("body").id;  //username

  let req = new XMLHttpRequest();
	req.onreadystatechange = function(){
		if(this.readyState == 4 && this.status == 200){
      window.location.replace("http://localhost:3000/" + userId + "/search/" + search);
		} else if (req.status === 500){ //if there was an error
            alert(this.responseText);
            return;
        }
	}
	req.open("GET", "http://localhost:3000/" + userId + "/search/" + search); 
	req.send(); 
}