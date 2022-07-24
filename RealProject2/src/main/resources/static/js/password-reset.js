window.onload = function () {
    document.getElementById('confirmBtn').addEventListener('click', resetPasswordConfirm);

}

window.onunload = () => {
    window.localStorage.clear();
}


function resetPasswordConfirm() {
    let username = document.querySelector('#username').value;
    let password = document.querySelector('#password').value;
    let rPassword = document.querySelector('#rPassword').value;
    if (passwordsMatch(password, rPassword)) {

        let xhttp = new XMLHttpRequest();

        xhttp.onreadystatechange = function () {
            if (xhttp.readyState == 4 && xhttp.status == 200) {
                if (xhttp.responseText) {
                    let text = document.querySelector('#texto');
                    text.innerText = "Password Reset Successfully"
                    window.location = "http://54.147.157.227:9001/login"
                }

            }
        }

        var key = "MayTheForceBeWithYou";
        // var userPassword = document.querySelector("#password").value;
        // var encryptedPassword = CryptoJS.AES.encrypt(userPassword, "Secret Passphrase");
        var encryptedPassword = fakeMathRandom(() => CryptoJS.AES.encrypt(password, key));
        var encryptedPasswordString = encryptedPassword.toString();
        
        let currentURLArray = window.location.href.split("/");
        let length = currentURLArray.length;
        let URLEnd = currentURLArray[length - 1];

        xhttp.open('POST', "http://54.147.157.227:9001/profile/passwordreset/" + URLEnd)

        let reqObj = {
            "username": username,
            "password": encryptedPasswordString
        }
        xhttp.setRequestHeader("content-type", "application/json");

        xhttp.send(JSON.stringify(reqObj));

    }


}



function passwordsMatch(password, rPassword) {
    let text = document.querySelector('#texto');
    if (password.length < 8) {
        text.innerHTML = "Password is not long enough";
        return false;
    }
    if (password != rPassword) {
        text.innerHTML = "Passwords do no match";
        return false;
    }
    return true;
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