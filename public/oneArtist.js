function followArtist(){
    let id = event.target.id;
    console.log(id);

    let user = event.target.parentElement.id;
    console.log(user);

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
    req.open("PUT", "http://localhost:3000/" + user + "/follow", true);
    req.setRequestHeader("Content-type","application/json");
    req.send(JSON.stringify({"artID": id})); // we send     

}

function enrollWorkshop(){
  let title = event.target.id;

  let user = document.querySelector(".main").id;
  console.log(user);

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
  req.open("PUT", "http://localhost:3000/" + user + "/enroll", true);
  req.setRequestHeader("Content-type","application/json");
  req.send(JSON.stringify({"id": title})); // we send     
}


function enableButton(){
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
	req.send();  //sending the account to the server 
}