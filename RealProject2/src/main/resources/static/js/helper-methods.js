

export function createAllPosts(query) {
    console.log("In the helper-methods file/createAllPosts")
    let myBody = document.querySelector("#myBody")
    let postHolder = document.createElement("div");
    postHolder.setAttribute("id", "postHolder")
    myBody.appendChild(postHolder);
    if (query.length > 0) {
        for (i = 0; i < query.length; i++) {
            createPostHelper(query[i])

        }
    }

}

export function createPostHelper(query) {

    let postHolder = document.querySelector("#postHolder");
    // Create Variables
    flameCount = query.postRating;
    console.log(flameCount);


    //Create Elements
    let newPostDiv = document.createElement("div"); // Container
    newPostDiv.classList.add("container-sm", "row", "border", "rounded", "mx-auto", "py-3", "my-3"); //div creation

    let newRatingDiv = document.createElement("div"); // Rating Div
    newRatingDiv.classList.add("col-auto");

    let newCard = document.createElement("div"); // Card Div
    newCard.classList.add("card");
    newCard.style = "width: 15rem;";

    let newPoster = document.createElement("img"); // img div
    newPoster.classList.add("card-img-top");
    newPoster.setAttribute("alt", "poster");
    newPoster.setAttribute("src", getPhoto(query.pictureURL)); // The DOM for the Poster goes here.

    let newCardBody = document.createElement("div"); // Container
    newCardBody.classList.add("card-body");

    let newh5 = document.createElement("h5");
    newPoster.classList.add("card-title");
    newh5.innerText = query.reviewItem; // DOM for the Title goes here.


    let newFlamesDiv = document.createElement("div");
    newPoster.classList.add("text-center");

    let newStrong = document.createElement("strong")
    let newP = document.createElement("p");
    if (flameCount == 0) 
        newP.innerText = "Dumpster Fire"; // DOM for the Flames Flavortest goes here
    else if (flameCount === 1)
        newP.innerText = "Hot Garbage"; // DOM for the Flames Flavortest goes here
    else if (flameCount == 2)
        newP.innerText = "Wet Fire"; // DOM for the Flames Flavortest goes here
    else if (flameCount == 3)
        newP.innerText = "Kindling"; // DOM for the Flames Flavortest goes here
    else if (flameCount == 4)
        newP.innerText = "On Fire"; // DOM for the Flames Flavortest goes here
    else if (flameCount == 5)
        newP.innerText = "Ablaze"; // DOM for the Flames Flavortest goes here
    else
        newP.innerText = "Bad Number";

    let newPostContent = document.createElement("div");
    newPostContent.classList.add("col", "mx-3");

    let newPostReview = document.createElement("p");
    newPostReview.classList.add("mx-auto");
    newPostReview.innerText.postContent; // DOM for the text review itself

    let newProfileDiv = document.createElement("div");
    newProfileDiv.classList.add("img-thumbnail", "rounded", "float-end", "mx-2", "py-3", "px-3");

    let newProfileImg = document.createElement("img");
    let postOwner = getPostOwnerPic(query.postId);
    let pic = getPhoto(postOwner[1]);
    newProfileImg.setAttribute("src", pic); // DOM for profile pic
    newProfileImg.setAttribute("height", "100px");
    newProfileImg.setAttribute("width", "100px");
    newProfileImg.setAttribute("alt", "Profile Picture");
    newProfileImg.addEventListener("click", proPicRedirect)

    let newStrong2 = document.createElement("strong")

    let newP2 = document.createElement("p");
    newP2.classList.add("pt-3", "text-center");
    newP2.innerText = postOwner[0];

    // Appending
    newPostDiv.appendChild(newRatingDiv);

    newRatingDiv.appendChild(newCard);

    newCard.appendChild(newPoster);
    newCard.appendChild(newCardBody);

    newCardBody.appendChild(newh5);
    newCardBody.appendChild(newFlamesDiv);
    for (let i = 0; i < flameCount && flameCount <= 5; i++) {
        // Add Flames
        let imgFlames = document.createElement("img");
        imgFlames.setAttribute("src", "../favicon-32x32.png")
        newFlamesDiv.append(imgFlames);

    }

    newCardBody.appendChild(newStrong);

    newStrong.appendChild(newP);

    newPostDiv.appendChild(newPostContent);

    newPostContent.appendChild(newPostReview);
    newPostContent.appendChild(newProfileDiv);

    newProfileDiv.appendChild(newProfileImg);
    newProfileDiv.appendChild(newStrong2);
    newStrong2.appendChild(newP2);

    // Prepending to Document Body

    postHolder.prependChild(newPostDiv);
}

export function getPhoto(picName) {
    let xhttp = new XMLHttpRequest();
    let query = "";
    xhttp.onreadystatechange = function () { // This step is second last. We are only setting up here before calling it later.

        if (xhttp.readyState == 4 && xhttp.status == 200) {
            query = xhttp.responseText;
            return query;

        }
    }
    let params = "?picName=" + picName;

    xhttp.open('POST', 'http://localhost:9001/photo' + params, false);
    xhttp.send();
    return query;
}

export function createPost() {
    let myTitle = document.querySelector("#myTitle").value;
    let myReview = document.querySelector("#floatingTextarea").value;
    let myPhoto = document.querySelector("#formFile").files[0];
    let myFlames = document.querySelector("#flame-count").value;
    let itemtype = document.querySelector('input[name="enum"]:checked').value;
    let myPost = {
        "reviewItem": myTitle,
        "postContent": myReview,
        "postRating": myFlames,
        "itemType": itemtype
    }




    let formData = new FormData();
    let xhttp = new XMLHttpRequest();

    xhttp.onreadystatechange = function () {

        if (xhttp.readyState == 4 && xhttp.status == 200) {
            let respObj = JSON.parse(xhttp.responseText);
            if (myPhoto != null || myPhoto != undefined) {
                formData.append("file", myPhoto);
                createPostPhoto(formData, respObj.postId);
            } else
                createPostHelper(respObj);
        }
    }

    xhttp.open('POST', 'http://localhost:9001/post');
    xhttp.setRequestHeader("Content-Type", "application/json")

    xhttp.send(JSON.stringify(myPost));
}

export function createPostPhoto(formData, postId) {
    let xhttp = new XMLHttpRequest();

    xhttp.onreadystatechange = function () {

        if (xhttp.readyState == 4 && xhttp.status == 200) {
            let respObj = JSON.parse(xhttp.responseText);
            console.log("respObj form picture: ");
            console.log(respObj);
            createPostHelper(respObj);
        }
    }

    xhttp.open('POST', 'http://localhost:9001/post/photo/' + postId);


    xhttp.send(formData);
}

export function getPostOwnerPic(respObj) {
    let xhttp = new XMLHttpRequest();
    let query = "";
    xhttp.onreadystatechange = function () { // This step is second last. We are only setting up here before calling it later.

        if (xhttp.readyState == 4 && xhttp.status == 200) {
            query = xhttp.responseText.split("|");
            return query;

        }
    }
    let params = respObj;

    xhttp.open('POST', 'http://localhost:9001/get/postownerpic/' + params, false);
    xhttp.send();
    return query;

}


function proPicRedirect(data) {
    console.log(data);
    // window.location.replace('http://localhost:9001/user/' + redirectUsername);

}