function addWorkshop(){
    let title = document.getElementById("title");

    let userId = document.querySelector("body").id;

    let workshop = {"title": title.value, "artist": userId, enroll: []};

    let req = new XMLHttpRequest();
	req.onreadystatechange = function(){
		if(this.readyState == 4 && this.status == 200){
            if (this.responseText === "Success"){
                alert("Workshop was created");
                window.location.replace("http://localhost:3000/" + userId + "/workshop/" + title.value);
            } else {
                alert(this.responseText);
            }
		} else if (req.status === 500){ //if the username is a duplicate
            alert(this.responseText);
            return;
        }
	}

	req.open("POST", "http://localhost:3000/" + userId + "/addWorkshop"); //or /signup
	req.setRequestHeader("Content-type","application/json");
	req.send(JSON.stringify(workshop)); 
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
    let userId = document.querySelector("body").id;  //username
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