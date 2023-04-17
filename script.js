axios.defaults.headers.common['Authorization'] = 'Sz9geys35NfoLDyLNU8wOlUm';
const feed = document.querySelector("#feed");
const userOptions = document.querySelector(".contacts-options");
var username = 0;
var destinatary = "Todos";
var MessageType = "message";
var typeSelected = "Público";
const usernames = [];

document.addEventListener("keypress", function(e){
    if (e.key === "Enter"){ 
        if (document.querySelector(".id-screen").classList.contains("hidden")){
        message();
        } else{ 
        enterChat();
        } 
    }
}
)

// entrar no chat e enviar o nome;
function enterChat(){
    username = document.querySelector("#username").value;

    const usernameSent={
        name: username
    };
    
    function changeUsername(){
        const usernameBox = document.querySelector('#username');
        usernameBox.value = '';
        usernameBox.setAttribute("placeholder", "Por favor, insira outro nome")
    }

    if (usernames.includes(username)){

        changeUsername()
    } else{
    const promise = axios.post(
        "https://mock-api.driven.com.br/api/vm/uol/participants",
        usernameSent
    );

    promise.then(confirmUsername);
    promise.catch(changeUsername);
    function confirmUsername(){
        const idScreen = document.querySelector(".id-screen");
        idScreen.classList.add("hidden");
        searchMessages();
        setInterval(searchMessages, 3000);
    }

    function stayOnline(){
        const promiseOnline = axios.post(
            "https://mock-api.driven.com.br/api/vm/uol/status",
            usernameSent
        );
    };
    setInterval(stayOnline, 5000);

}
}
    //


    //gerador aleatório de id;
function idGenerator(size) {
    var randomString = '';
    var characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz';
    
    for (var i = 0; i < size; i++) {
        randomString += characters.charAt(Math.floor(Math.random() * characters.length));
    }
    return randomString;
}

// enviando mensagem
function message(){
    if (typeSelected === "Público"){
        messageType = "message";
    } else {
        messageType = "private_message";
    }
    const messageWrote = document.querySelector("#message-input").value;
    
    if (message !== ""){
    const messageSent={
        from: username,
        to: destinatary,
        text: messageWrote,
        type: messageType 
        
    };
    const promise = axios.post(
        "https://mock-api.driven.com.br/api/vm/uol/messages",
        messageSent
    );
    searchMessages();
} else{}
document.querySelector("#message-input").value = '';
}


function searchMessages(){
    const promise = axios.get('https://mock-api.driven.com.br/api/vm/uol/messages');
    promise.then(processarResposta); 
    promise.catch(reload);

    function processarResposta(resposta) {
        console.log(resposta.data)
        feed.innerHTML = '';
        for (i=0; i<resposta.data.length; i++){
            const receivedMessage = resposta.data[i];
            if (receivedMessage.from === username || receivedMessage.to === username || receivedMessage.type !== "private_message") {
                printMessages(receivedMessage);
                const lastMessageIndex = feed.children.length - 1;
                feed.children[lastMessageIndex].scrollIntoView()
            }
                
            
        }
    };

    function printMessages(recebido){
        const messageBox = document.createElement("div");
        messageBox.className = "text-box";
        messageBox.setAttribute("data-test", "message")
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

        var typeSent = 0;
        if (recebido.type === "message"){
            typeSent = "para";
        } else {
            typeSent = "reservadamente para"
            messageBox.classList.add("private-box");
        } 

        const textingType = document.createElement("span");
        textingType.className = "texting-type";
        textingType.innerText = typeSent;
        header.appendChild(textingType);

        const messageTo = document.createElement("span");
        messageTo.className = "names";
        messageTo.innerText = recebido.to + ":";
        header.appendChild(messageTo);

        if (recebido.type === "status"){
            header.removeChild(textingType);
            header.removeChild(messageTo);
            if(messageBox.classList.contains("private-box")){
                messageBox.classList.remove("private-box")
            }
            messageBox.classList.add("status-box"); 
        }

        const thisId = idGenerator(100);
        const messageText = document.createElement("span");
        messageText.setAttribute("id", thisId);
        messageText.className = "texto"
        messageText.innerText = recebido.text;

        messageBox.appendChild(header);
        messageBox.appendChild(messageText);

        const headerWidth = document.getElementById(headerId).offsetWidth;

        const indent = headerWidth + 5 + "px";
        document.getElementById(thisId).style.textIndent = indent;

    
    }
}


const temporaryBackground = document.querySelector(".ready-to-chat");
const contactsList = document.querySelector(".contacts-list");

function openContactsList(){
   
    contactsList.classList.add("show");
    contactsList.classList.remove("hide");
    contactsList.classList.remove("hidden");
    temporaryBackground.classList.remove("hidden");
}

function backToChat(){
    contactsList.classList.remove("show");
    temporaryBackground.classList.add("hidden");
    contactsList.classList.add("hide");
    function hiding(){
        contactsList.classList.add("hidden")
    }
    setTimeout(hiding, 800); 
}

function reload(){
    setTimeout(window.location.reload, 2000);
}



// ver e registrar os usuários online
function updateUsers(){
    const promise = axios.get("https://mock-api.driven.com.br/api/vm/uol/participants");
    promise.then(onlineUsers);
    function onlineUsers(resposta) {
        console.log(resposta.data)
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
                onlineUser.setAttribute("data-test", "participant")
                userOptions.appendChild(onlineUser);
                    
                const onlineUserIcon = document.createElement("ion-icon");
                onlineUserIcon.className = "contacts-list-icons";
                onlineUserIcon.setAttribute("name", "person-circle");
            
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
setTimeout(updateUsers, 500);
setInterval(updateUsers, 10000);

//

updateUsers();



//colocar o check

function selectedOptionUser(userOption){
    const onlineUsersOptions = document.querySelectorAll(".user-box");
    checkIcon = document.createElement("ion-icon");
    checkIcon.setAttribute("name", "checkmark")
    checkIcon.setAttribute("data-test", "check")
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
    destinatary = userOption.children[1].innerText;
    }
}

function selectedOptionType(typeOption){
    const onlineTypesOptions = document.querySelectorAll(".type-box");
    checkIcon = document.createElement("ion-icon");
    checkIcon.setAttribute("name", "checkmark")
    checkIcon.setAttribute("data-test", "check")
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
    typeSelected = typeOption.children[1].innerText;
    }
}

function updateLayoutWritingTo(){
    const writingTo = document.querySelector(".writing-to");
    if (typeSelected === "Público"){
    writingTo.innerText = "Enviando para " + destinatary;
    } else {
        writingTo.innerText = "Enviando para " + destinatary + " (reservadamente)"
    }
}   
setInterval (updateLayoutWritingTo, 500);
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
            