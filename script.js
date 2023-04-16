axios.defaults.headers.common['Authorization'] = 'mnAwsXuL5brrrSMP21IIYkpu';
const feed = document.querySelector("#feed");
const userOptions = document.querySelector(".contacts-options");
var username = 0;

// entrar no chat e enviar o nome;
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
        );
    };
    setInterval(stayOnline, 5000);

    const idScreen = document.querySelector(".id-screen");
    idScreen.classList.add("hidden");
}
    //

    //envio de mensagem;
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


function searchMessages(){
    const promise = axios.get('https://mock-api.driven.com.br/api/vm/uol/messages');
    promise.then(processarResposta); 

    function processarResposta(resposta) {
        console.log(resposta.data);
        for (i=0; i<resposta.data.length; i++){
            const receivedMessage = resposta.data[i];
            console.log(receivedMessage);

            printMessages(receivedMessage);
            
        }
    }

    function printMessages(recebido){
        const messageBox = document.createElement("div");
            
        messageBox.className = "text-box";
        feed.appendChild(messageBox);

        const headerId = idGenerator(26)
        const header = document.createElement("span");
        header.className = "header";
        header.setAttribute('id', headerId);
        messageBox.appendChild(header);

        const messageAt = document.createElement("span");
        messageAt.className = "time";
        messageAt.innerText = "(" + recebido.time + ")";
        header.appendChild(messageAt);
        
        const messageFrom = document.createElement("span");
        messageFrom.className = "names";
        messageFrom.innerText = recebido.from;
        header.appendChild(messageFrom);

        const textingType = document.createElement("span");
        textingType.className = "texting-type";
        textingType.innerText = recebido.type;
        header.appendChild(textingType);

        const messageTo = document.createElement("span");
        messageTo.className = "names";
        messageTo.innerText = recebido.to + ":";
        header.appendChild(messageTo);

        const thisId = idGenerator(100);
        const messageText = document.createElement("span");
        messageText.setAttribute("id", thisId);
        messageText.innerText = recebido.text;

        messageBox.appendChild(header);
        messageBox.appendChild(messageText);

        const headerWidth = document.getElementById(headerId).offsetWidth;

        const indent = headerWidth + 5 + "px";
        console.log(thisId)
        document.getElementById(thisId).style.textIndent = indent;
    }
    
}
setInterval(searchMessages, 3000);

const temporaryBackground = document.querySelector(".ready-to-chat");
const contactsList = document.querySelector(".contacts-list");

function openContactsList(){
   
    contactsList.classList.add("show");
    contactsList.classList.remove("hide");
    temporaryBackground.classList.remove("hidden");
}

function backToChat(){
    contactsList.classList.remove("show");
    temporaryBackground.classList.add("hidden");
    contactsList.classList.add("hide");    
}



// ver e registrar os usuários online
function updateUsers(){
    const promise = axios.get("https://mock-api.driven.com.br/api/vm/uol/participants");
    promise.then(onlineUsers);
    function onlineUsers(resposta) {
        const usernames = [];
        for (i=0; i<resposta.data.length; i++){

            const usernameFound = resposta.data[i].name;
            usernames.push(usernameFound);
        }   
    
        for (i=0; i<usernames.length; i++){
            const verify = usernames[i];
            var verifiedWith=0

            for (x=0; x<userOptions.children.length; x++){
                if (verify === userOptions.children[x].innerText){
                    verifiedWith = -100;
                } else{
                    verifiedWith++;
                }
            }
            if (verifiedWith === userOptions.children.length){
                const onlineUser = document.createElement("div");
                onlineUser.className = "user-box";
                userOptions.appendChild(onlineUser);
                    
                const onlineUserIcon = document.createElement("img");
                onlineUserIcon.className = "contacts-list-icons";
                onlineUserIcon.setAttribute("src", "images/person-circle.svg");
            
                const onlineUserName = document.createElement("span");
                onlineUserName.className = "online-user-name";
                onlineUserName.innerText = verify;
            
                onlineUser.appendChild(onlineUserIcon);
                onlineUser.appendChild(onlineUserName);
                onlineUser.setAttribute("onclick", "selectedOptionUser(this)");
                userOptions.appendChild(onlineUser);
            
            } else{}
        } 
        
        for (x=1; x<userOptions.children.length; x++){
            const testUser = userOptions.children[x]
            const testUserT = testUser.innerText;
            var verified = 0;   
            for (i=0; i<usernames.length; i++){
                if(testUserT === usernames[i]){
                    verified = -100;
                } else {
                    verified++;
                }
            }
            if (verified === usernames.length){
                userOptions.removeChild(testUser);
            }

        }
        

    }

    
}

setInterval(updateUsers, 3000);

//





//colocar o check

function selectedOptionUser(userOption){
    const onlineUsersOptions = document.querySelectorAll(".user-box");
    checkIcon = document.createElement("img");
    checkIcon.setAttribute("src", "images/checkmark.svg")
    checkIcon.classList.add("check");
    checkIcon.setAttribute("id", "user-check-marked")

    for (i=0; i< onlineUsersOptions.length; i++){
        if (onlineUsersOptions[i] !== userOption && onlineUsersOptions[i].querySelector("#user-check-marked")){
         onlineUsersOptions[i].removeChild(document.getElementById("user-check-marked")) 
        }

    }
    if (userOption.childElementCount === 3){    
    } else{
    userOption.appendChild(checkIcon);
    }
}

function selectedOptionType(typeOption){
    const onlineTypesOptions = document.querySelectorAll(".type-box");
    checkIcon = document.createElement("img");
    checkIcon.setAttribute("src", "images/checkmark.svg")
    checkIcon.classList.add("check");
    checkIcon.setAttribute("id", "type-check-marked")

    for (i=0; i< onlineTypesOptions.length; i++){
        if (onlineTypesOptions[i] !== typeOption && onlineTypesOptions[i].querySelector("#type-check-marked")){
         onlineTypesOptions[i].removeChild(document.getElementById("type-check-marked")) 
        }

    }
    if (typeOption.childElementCount === 3){    
    } else{
    typeOption.appendChild(checkIcon);
    }

        
}

// 


/*
            const receivedMessage = resposta.data[i];
            
            const messageBox = document.createElement("div");
            
            messageBox.className = "text-box";
            feed.appendChild(messageBox);

            const header = document.createElement("span");
            header.setAttribute('id', 'header');
            messageBox.appendChild(header);

            const messageAt = receivedMessage.time;
            header.appendChild(messageAt);

            const messageFrom = document.createElement("span");
            messageFrom.className = "names";
            messageFrom.innerText = receivedMessage.from;
            header.appendChild(messageFrom);

            const textingType = document.createElement("span");
            textingType.className = "texting-type";
            textingType.innerHTML = "para";
            header.appendChild(textingType);

            const messageTo = document.createElement("span");
            messageTo.className = "names";
            messageTo.innerText = receivedMessage.to + ":";
            header.appendChild(messageTo);

            const thisId = idGenerator(26);
            const messageText = document.createElement("span");
            messageText.setAttribute("id", thisId);
            messageText.innerText = receivedMessage.text;

            messageBox.appendChild(header);
            messageBox.appendChild(messageText);

            var headerWidth = document.getElementById("header").offsetWidth;

            var indent = headerWidth + 5 + "px";

            document.getElementById(thisId).style.textIndent = indent;
            */
            