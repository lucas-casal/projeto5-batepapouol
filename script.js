axios.defaults.headers.common['Authorization'] = 'mnAwsXuL5brrrSMP21IIYkpu';
const feed = document.querySelector("#feed");
var username = 0;
function enterChat(){
    username = document.querySelector("#username").value;
    const usernameSent={
        name: username
    };


    const promise = axios.post(
        "https://mock-api.driven.com.br/api/vm/uol/participants",
        usernameSent
    );

    function stayOnline(){
        const promiseOnline = axios.post(
            "https://mock-api.driven.com.br/api/vm/uol/status",
            usernameSent
        )
        promise.then(console.log(promise));
    };
    setInterval(stayOnline, 5000);

    const idScreen = document.querySelector(".id-screen");
    idScreen.classList.add("hidden");
    console.log(username);
}


function idGenerator(size) {
    var randomString = '';
    var characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz';
    
    for (var i = 0; i < size; i++) {
        randomString += characters.charAt(Math.floor(Math.random() * characters.length));
    }
    return randomString;
}


function message(){
    if (document.querySelector("#message-input").value !== ""){
    const text = document.querySelector("#message-input").value;

    function addZero(i){
        if(i<10){
            i="0"+i
        }
        return i;
    }
    const sentBox = document.createElement("div");
    sentBox.className = "text-box";
    feed.appendChild(sentBox);

    const header = document.createElement("span");
    header.setAttribute('id', 'header')

    const instant = new Date();
    const hours = addZero(instant.getHours())
    const minutes = addZero(instant.getMinutes());
    const seconds = addZero(instant.getSeconds());
    const sentAt = document.createElement("span");
    sentAt.className = "time";
    sentAt.innerHTML = "(" + hours + ":" + minutes + ":" + seconds + ")"  
    header.appendChild(sentAt);

    const sentFrom = document.createElement("span");
    sentFrom.className = "names";
    sentFrom.innerHTML = username;
    header.appendChild(sentFrom);

    const textingType = document.createElement("span");
    textingType.className = "texting-type";
    textingType.innerHTML = "para";
    header.appendChild(textingType);

    const sentTo = document.createElement("span");
    sentTo.className = "names";
    sentTo.innerHTML = "Amanda" + ":";
    header.appendChild(sentTo);

    const thisId = idGenerator(26);
    const sentText = document.createElement("span");
    sentText.setAttribute("id", thisId);
    sentText.innerHTML = text;

    sentBox.appendChild(header);
    sentBox.appendChild(sentText);

    var headerWidth = document.getElementById("header").offsetWidth;

    var indent = headerWidth + 5 + "px";

    document.getElementById(thisId).style.textIndent = indent;    
     
    } else{}
}


const temporaryBackground = document.querySelector(".ready-to-chat");
const contactsList = document.querySelector(".contacts-list");

function openContactsList(){
   
    contactsList.classList.add("show");
    contactsList.classList.remove("hide");
    temporaryBackground.classList.remove("hidden");
    console.log(contactsList);
}

function backToChat(){
    contactsList.classList.remove("show");
    temporaryBackground.classList.add("hidden");
    contactsList.classList.add("hide");
    console.log(contactsList)
}

const onlineUser = document.createElement("div");
onlineUser.className = "online-user-box";
contactsList.appendChild(onlineUser);

const onlineUserName = document.createElement("span");
onlineUserName.className = "online-user-name";

const onlineUserIcon = document.createElement("span");
onlineUserIcon.className = "online-user-icon"
onlineUserIcon.setAttribute("img", "images/");

function selectedOption(option){
    checkIcon = document.createElement("img");
    checkIcon.setAttribute("src", "images/checkmark.svg")
    checkIcon.classList.add("check");

    console.log(option.children[0]);
        if (option.childElementCount === 2){
            console.log(option.children[1]);
            option.removeChild(option.children[1]);
        } else{
            option.appendChild(checkIcon);
        }


    console.log(checkIcon);
    console.log(option);
}

