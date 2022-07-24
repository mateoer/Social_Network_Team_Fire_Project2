//IMPORTS
// import * as helperModule from "./helper-methods";


//FIELDS
let picUrl = "";
let currentUser = null;
let currentUserProPic = null;
let currentProfile = null;
let currentProfileProPic = null;
let counter = 0;

//START UP FUNCTIONS
window.onload = function () {
    startUp();
    document.getElementById("submitPostBtn").addEventListener('click', createPost);

    document.getElementById("profilePictureMain").addEventListener('click', setModalPicture);
    document.getElementById("emailBtn").addEventListener('click', changeEmailFunction);
    document.getElementById("changeBirthDayBtn").addEventListener('click', changeBirthDayFunction);
    document.getElementById("firstNameParentBtn").addEventListener('click', changeFirstNameFunction);
    document.getElementById("lastNameParentBtn").addEventListener('click', changeLastNameFunction);
    document.getElementById("modalUpdateBtn").addEventListener('click', updateUserInfo);

    document.getElementById("logoutBtn").addEventListener('click', redirectToLoginPage);
}

function startUp() {
    console.log("In startup Function");

    let xhttp = new XMLHttpRequest();

    xhttp.onreadystatechange = function () {
        if (xhttp.readyState == 4 && xhttp.status == 200) {
            currentProfile = JSON.parse(xhttp.responseText);
            getCurrentUser();
            setUserInfo(currentProfile);
            setProfilePage(currentProfile);
            retrieveAllPosts();
        }
    }

    //THIS WILL GRAB THE END OF THE URI AND APPEND IT TO THIS CALL
    let currentURLArray = window.location.href.split("/");
    let length = currentURLArray.length;
    let URLEnd = currentURLArray[length - 1];

    xhttp.open('POST', "http://localhost:9001/get/profile/" + URLEnd);
    xhttp.setRequestHeader("content-type", "application/json");
    xhttp.send();
}

function getCurrentUser() {
    let xhttp = new XMLHttpRequest();

    xhttp.onreadystatechange = function () { 

        if (xhttp.readyState == 4 && xhttp.status == 200) {
            let query = JSON.parse(xhttp.responseText);
            currentUser = query;
            if (currentUser.profilePicName != null || currentUser.profilePicName != undefined) {
                currentUserProPic = getPhoto(currentUser.profilePicName);
                let navBarPic = document.querySelector("#navbarPic")
                navBarPic.setAttribute("src", currentUserProPic);
                navBarPic.addEventListener('click', redirectToOwnProfile)
            }
        }
    }

    xhttp.open('POST', 'http://localhost:9001/get/currentuser', false);
    xhttp.send();

}

function setUserInfo(currentProfile) {

    let emailChild = document.querySelector("#emailChild");
    emailChild.innerText = currentProfile.userEmail;

    let birthDayChild = document.querySelector("#birthDayChild");
    let tempDate = new Date(currentProfile.userBirthday).toLocaleDateString();
    birthDayChild.innerText = tempDate;

    let firstNameChild = document.querySelector("#firstNameChild");
    firstNameChild.innerText = currentProfile.firstName;

    let lastNameChild = document.querySelector("#lastNameChild");
    lastNameChild.innerText = currentProfile.lastName;

}

function setProfilePage(currentProfile) {
    console.log("In Set Profile Page Function");
    //username
    let usernameTitle = document.querySelector("#usernameTitle");
    usernameTitle.innerText = currentProfile.username;

    let usernameModal = document.querySelector("#usernameModal");
    usernameModal.innerText = currentProfile.username;

    //MODEL FROM PROFILE PAGE
    //email
    let userEmail = document.querySelector("#emailChild");
    userEmail.innerText = currentProfile.userEmail;

    //first
    let firstName = document.querySelector("#firstNameChild");
    firstName.innerText = currentProfile.firstName;

    //last
    let lastName = document.querySelector("#lastNameChild");
    lastName.innerText = currentProfile.lastName;


    //birthday
    let userBirthday = document.querySelector("#birthDayChild");
    let eventB = new Date(currentProfile.userBirthday).toLocaleDateString();
    userBirthday.innerText = eventB;

    //biography
    let userBio = document.querySelector("#userBiographyTextArea");
    userBio.innerText = currentProfile.userBio

    currentProfileProPic = getPhoto(currentProfile.profilePicName);
    document.querySelector("#profilePictureMain").setAttribute("src", currentProfileProPic);
    if (currentProfile.username == currentUser.username)
        document.querySelector("#navBarPic").setAttribute("src", currentUserProPic);
}

function retrieveAllPosts() {
    let xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function () { // This step is second last. We are only setting up here before calling it later.
        if (xhttp.readyState == 4 && xhttp.status == 200) {
            query = JSON.parse(xhttp.responseText);
            createAllPosts(query);
        }
    }

    let currentURLArray = window.location.href.split("/");
    let length = currentURLArray.length;
    let URLEnd = currentURLArray[length - 1];

    xhttp.open('Post', 'http://localhost:9001/getall/userposts/' + URLEnd);
    xhttp.send();
}

function serverSendAndGetPhoto() {
    let file = document.getElementById('fileupload').files[0];
    let formData = new FormData();
    formData.append("file", file);

    let xhttp = new XMLHttpRequest();

    xhttp.onreadystatechange = function () {

        if (xhttp.readyState == 4 && xhttp.status == 200) {
            let respObj = xhttp.responseText;
            document.querySelector("#profilePictureMain").setAttribute("src", respObj);
            picUrl = respObj;
            if (currentProfile.username == currentUser.username)
                document.querySelector("#navBarPic").setAttribute("src", respObj);
        }
    }
    xhttp.open('POST', `http://54.147.157.227:9001/profile/picture`)

    xhttp.send(formData);
}


function changeAvatarPictureFunction() {
    if (currentProfile.username == currentUser.username) {

        //REMOVE
        let ParentProfilePictureModalPictureUpload = document.querySelector("#ParentProfilePictureModalPictureUpload");

        let childModalPicture = document.querySelector("#childModalPicture");
        childModalPicture.removeEventListener('click', changeAvatarPictureFunction);
        childModalPicture.remove();

        //REPLACE
        childModalPictureDescrpt = document.createElement("p");
        childModalPictureDescrpt.setAttribute("id", "picModalDesc")
        childModalPictureDescrpt.innerText = "Please choose file to upload";
        ParentProfilePictureModalPictureUpload.appendChild(childModalPictureDescrpt);

        let childFileUpload = document.createElement("input")
        childFileUpload.setAttribute("id", "fileupload")
        childFileUpload.setAttribute("type", "file");
        childFileUpload.setAttribute("name", "fileupload");
        ParentProfilePictureModalPictureUpload.appendChild(childFileUpload);

        let childFileSubmitBtn = document.createElement("button");
        childFileSubmitBtn.setAttribute("id", "uploadButton")
        childFileSubmitBtn.setAttribute("type", "submit");
        childFileSubmitBtn.innerText = "Upload";
        ParentProfilePictureModalPictureUpload.appendChild(childFileSubmitBtn);

        document.getElementById("uploadButton").addEventListener('click', serverSendAndGetPhoto);
    }

}

function setModalPicture() {
    if (currentProfile.username == currentUser.username || counter < 1) {
        let ParentProfilePictureModalPictureUpload = document.querySelector("#ParentProfilePictureModalPictureUpload");
        //REMOVE
        let childModalPictureDescrpt = document.querySelector("#picModalDesc");
        childModalPictureDescrpt.remove();

        let childFileUpload = document.querySelector("#fileupload")
        childFileUpload.remove();

        let childFileSubmitBtn = document.querySelector("#uploadButton");
        childFileSubmitBtn.remove();

        //REPLACE
        childModalPicture = document.createElement("img")

        childModalPicture.setAttribute("id", "childModalPicture");
        childModalPicture.setAttribute("src", currentProfileProPic);
        childModalPicture.setAttribute("height", "300px");
        childModalPicture.setAttribute("width", "300px");
        ParentProfilePictureModalPictureUpload.appendChild(childModalPicture);


        (childModalPicture).addEventListener('click', changeAvatarPictureFunction);
        counter++;
    }
}

function changeEmailFunction() {
    let emailParent = document.querySelector("#emailParent");
    let emailChild = document.querySelector("#emailChild");
    emailChild.remove();
    emailChild = document.createElement("input");
    emailChild.setAttribute("id", "emailChild");
    emailChild.setAttribute("type", "email");
    emailChild.setAttribute("placeholder", "New Email Address");
    emailChild.setAttribute("name", "childEmailValue");
    emailChild.innerText = "(Filled From DB)";
    emailParent.appendChild(emailChild);
}

function changeBirthDayFunction() {
    let birthDayParent = document.querySelector("#birthDayParent");
    let birthDayChild = document.querySelector("#birthDayChild");
    birthDayChild.remove();
    birthDayChild = document.createElement("input");
    birthDayChild.setAttribute("id", "birthDayChild");
    birthDayChild.setAttribute("type", "date");
    birthDayChild.setAttribute("placeholder", "New Birthdate");
    birthDayChild.setAttribute("name", "birthDayValue");
    birthDayChild.innerText = "(Filled From DB)";
    birthDayParent.appendChild(birthDayChild);
}

function changeFirstNameFunction() {
    let firstNameParent = document.querySelector("#firstNameParent");
    let firstNameChild = document.querySelector("#firstNameChild");
    firstNameChild.remove();
    firstNameChild = document.createElement("input");
    firstNameChild.setAttribute("id", "firstNameChild");
    firstNameChild.setAttribute("type", "text");
    firstNameChild.setAttribute("placeholder", "New First Name");
    firstNameChild.setAttribute("name", "firstNameValue");
    firstNameChild.innerText = "(Filled From DB)";
    firstNameParent.appendChild(firstNameChild);
}

function changeLastNameFunction() {
    let lastNameParent = document.querySelector("#lastNameParent");
    let lastNameChild = document.querySelector("#lastNameChild");
    lastNameChild.remove();
    lastNameChild = document.createElement("input");
    lastNameChild.setAttribute("id", "lastNameChild");
    lastNameChild.setAttribute("type", "text");
    lastNameChild.setAttribute("placeholder", "New Last Name");
    lastNameChild.setAttribute("name", "lastNameValue");
    lastNameChild.innerText = "(Filled From DB)";
    lastNameParent.appendChild(lastNameChild);
}

function updateUserInfo() {
    let childEmailValue = document.querySelector("#emailChild").value;
    let firstNameValue = document.querySelector("#firstNameChild").value;
    let lastNameValue = document.querySelector("#lastNameChild").value;
    let userBirthday = document.querySelector("#birthDayChild").value;
    let userBiographyTextAreaValue = document.querySelector("#userBiographyTextArea").value;

    let userObject = {
        "userEmail": childEmailValue,
        "firstName": firstNameValue,
        "lastName": lastNameValue,
        "userBirthday": userBirthday,
        "userBio": userBiographyTextAreaValue
    };

    let xhttp = new XMLHttpRequest();



    xhttp.onreadystatechange = function () {

        if (xhttp.readyState == 4 && xhttp.status == 200) {
            console.log("readyState is 4!!! AND status is 200!!!");
        }
    }

    xhttp.open('POST', `http://54.147.157.227:9001/profile/update`);

    xhttp.setRequestHeader("content-type", "application/json");


    xhttp.send(JSON.stringify(userObject));

}

//REDIRECTS
    function redirectToLoginPage() {
        window.localStorage.clear();
        window.location.replace("http://localhost:9001/login");
}

function createAllPosts(query) {
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

function createPostHelper(query) {

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
    newPostReview.innerText = query.postContent; // DOM for the text review itself

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

    postHolder.prepend(newPostDiv);
}

function getPhoto(picName) {
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

function createPost() {
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

function createPostPhoto(formData, postId) {
    let xhttp = new XMLHttpRequest();

    xhttp.onreadystatechange = function () {

        if (xhttp.readyState == 4 && xhttp.status == 200) {
            let respObj = JSON.parse(xhttp.responseText);
            createPostHelper(respObj);
        }
    }

    xhttp.open('POST', 'http://localhost:9001/post/photo/' + postId);


    xhttp.send(formData);
}

function getPostOwnerPic(respObj) {
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
    console.log(data.path[4]);
    console.log(data.path[4].id);
    // window.location.replace('http://localhost:9001/user/' + redirectUsername);

}