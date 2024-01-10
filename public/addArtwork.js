function addArtwork(){
    document.getElementById("error").innerHTML = "";  //in case there are errors
    let name = document.getElementById("name");      
    let category = document.getElementById("category");
    let descript = document.getElementById("description");
    let year = document.getElementById("year");
    let medium = document.getElementById("medium");
    let image = document.getElementById("image");
    let artist = document.querySelector("body").id;

    console.log(artist);
    let userId = (window.location.pathname).replace("/addArtwork", "");
    userId = userId.replace("/", "");  //getting the username from the URL
    console.log(userId);

    //in case some fields were left unanswered 
    if (name.value.length == 0 || category.value.length == 0 || descript.value.length == 0 || year.value.length == 0 || medium.value.length == 0 || image.value.length == 0){
        let p = document.createElement("p"); //
        let text = document.createTextNode("Not everything has been filled. Please fill everything");
        p.appendChild(text);
        document.getElementById("error").appendChild(p);
        return;
    }

    let newArt = {name: name.value, artist: artist, category: category.value, description: descript.value, year: year.value, medium: medium.value, image: image.value};

    
    let req = new XMLHttpRequest();
	req.onreadystatechange = function(){
		if(this.readyState == 4 && this.status == 200){
            alert(this.responseText);
            name.value = "";  //clearing the fields 
            medium.value ="";
            year.value = "";
            image.value = "";
            descript.value = "";
            category.value = "";
            //window.location.replace("/" + this.responseText); //responseText == username
		} else if (req.status === 500){ 
            alert(this.responseText);
            return;
        }
	}

	req.open("POST", "http://localhost:3000/addArtwork"); 
	req.setRequestHeader("Content-type","application/json");
	req.send(JSON.stringify(newArt));   //sending the new art object to the server
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
    let search = document.getElementById("searchText").value;  //getting the search text
    let userId = document.querySelector("body").id;  //username
    console.log(userId);
  
    //sending a post request
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