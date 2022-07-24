window.onload = function () {

    document.getElementById('login').addEventListener("click", loginCheck);
    document.getElementById('modalUpdateBtn').addEventListener('click', passwordReset)

}

function preventBack() {
    window.history.forward();
}

setTimeout("preventBack()", 0);

window.onunload = () => {
    // window.localStorage.clear();
    null;
}




function noEmptyFields(userName, passWord) {

    if (userName == "" || passWord == "") {
        return false;
    } else {
        return true;
    }
}

function loginCheck() {

      
    var userName = document.querySelector("#username").value;
    var passWord = document.querySelector("#password").value;


    if (noEmptyFields(userName, passWord)) {
        userLogin(userName, passWord);
    } else {
        document.getElementById('texto').innerHTML = "All fields must be filled";

    }
}

function userLogin(userName, passWord) {

    let xhttp = new XMLHttpRequest;

    xhttp.open('POST', `http://54.147.157.227:9001/l-authentication`);
    xhttp.setRequestHeader("content-type", "application/json");

    xhttp.onreadystatechange = function () {
        if (xhttp.readyState == 4 && xhttp.status == 200) {

            // let regObj = xhttp.responseText;
            // console.log(regObj);

            ///use this if the response text is the URI for user home page

            console.log("I'm in!")
            var urlBase = "http://54.147.157.227:9001"
            window.location = urlBase + xhttp.responseText;

            ///this if response text only says valid or invalid
            //maybe go with the above line instead of this one
            /////////this part should redirect to user home page after successfull login
            // window.location.replace("../html/logout.html");

        }
    }

    // var userPassword = passWord;
    // var encryptedPassword = CryptoJS.AES.encrypt(userPassword, "Secret Passphrase");
    // var encryptedPassword = CryptoJS.AES.encrypt(userPassword, "Secret Passphrase");
    // var encryptedPasswordString = encryptedPassword.toString();
    // console.log(encryptedPasswordString);

    var key = "MayTheForceBeWithYou";  
    var userPassword = document.querySelector("#password").value;
    // var encryptedPassword = CryptoJS.AES.encrypt(userPassword, "Secret Passphrase");
    var encryptedPassword = fakeMathRandom(() => CryptoJS.AES.encrypt(userPassword, key));
    var encryptedPasswordString = encryptedPassword.toString();
    
    //no field is empty
    let userValidation = {
        "username": userName,
        "password": encryptedPasswordString
    }
    
    // & passwordMatching()
    if (noEmptyFields()) {


        // console.log("Inside the json block");
        xhttp.send(JSON.stringify(userValidation));
    }

}

function passwordReset() {
    let email = document.querySelector("#resetEmail").value;
    console.log(email);

    let xhttp = new XMLHttpRequest();

    xhttp.onreadystatechange = function() {
        if (xhttp.readyState == 4 && xhttp.status == 200) {
            document.getElementById('texto').innerHTML = "Email Sent Successfully!";
        }
    }

    xhttp.open('POST', "http://54.147.157.227:9001/sendemail") 

    xhttp.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
    let params = "emailName=" + email;

    xhttp.send(params);

}

function fakeMathRandom(callBack) {
    if (!callBack) throw new Error("Must provide callBack function");
    let seed = 0;
    const randomOutputs = [
      0.04, 0.08, 0.15, 0.16, 0.23, 0.42, 0.52, 0.65, 0.79, 0.89,
    ];
    const Math_random = Math.random;
    Math.random = function () {
      return randomOutputs[seed++ % 10];
    };
    const callbackOutput = callBack();
    Math.random = Math_random;
    return callbackOutput;
  }