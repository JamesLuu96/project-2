const chatList = document.querySelector('#chatList')
const chatInput = document.querySelector('#chatInput')
const socket = io('http://localhost:3000')
const roomId = document.querySelector('.chat-room-title').getAttribute('data-id')
const form = document.querySelector('.chat-form')

// Get a Blob somehow...

const {
    user_id,
    username
} = JSON.parse(sessionStorage.getItem("userInfo"))

socket.emit('joinRoom', {
    roomId,
    username
})


form.addEventListener('submit', (event) => {
    event.preventDefault()
    
    const message = chatInput.value
    chatHistory(message,'')
    socket.emit('chatMessage', message)
    // chatInput.value = ''
    // chatInput.focus()
})

function outputMessage(message) {
    // console.log(message)
    const list = document.createElement('li')
    list.textContent = message
    //   messages.push(message)
    chatList.append(list)
}

//join room
socket.on('joinRoom', user => {
    const list = document.createElement('li')
    list.setAttribute('data-id', user.id)
    list.innerHTML = `<i class="far fa-user pull-right mr-2 chat-text" id=""></i>${user.username}`
    document.querySelector('#room-users ul').append(list)
})


socket.on('message', message => {
    outputMessage(message)
})

//leave chat room
socket.on('leaveRoom', user => {
    // document.querySelector(`#room-users li[data-id="${user.id}"`).remove()
})

//post chat history
async function chatHistory(message,image) {
    let room_id = getRoomId()
    const response = await fetch("/api/chats", {
        method: "POST",
        body: JSON.stringify({
            room_id,
            user_id,
            image,
            message
        }),
        headers: {
            "Content-Type": "application/json",
        },
    });
    if (response.ok) {
        console.log("success")
    } else {
        console.log("fail")
    }
}

//fetch and render the data when the page reloads 
if (window.performance) {
    let room_id = getRoomId()
    fetchChatHistory(room_id)
    // deleteOldHistory(room_id)
}
 function fetchChatHistory(room_id){
 fetch(`/api/chats/${room_id}`, {
    method: "GET",
    headers: {
        "Content-Type": "application/json",
    },
}).then(data => {
    return data.json()
}).then(data => {
  console.log(data)
//   console.log(room_id)
    // let newData = data.filter(item => item.room_id === room_id)
    renderData(data)
})
}

// function deleteOldHistory(room_id){
//   fetch(`/api/chats/${room_id}`,{
//     method: "DELETE",
//     headers: {
//         "Content-Type": "application/json",
//     },
//   }).then(data=>{
//     console.log(data)
//   })
// }


//get room id 
function getRoomId() {
    let room_id = window.location.toString().split("/");

    //check if the url last is '/' or not
    if (room_id[room_id.length - 1] === "") {
        room_id = room_id[room_id.length - 2];
    } else {
        room_id = room_id[room_id.length - 1];
    }
    return room_id;
}

//render data 
 function renderData(data) {
     console.log(data)
    data.map(data => {
        
        const list = document.createElement('li')
        const image = document.createElement('img')
 
        image.setAttribute('class', 'image');
        image.src=data.image
        list.textContent = data.message
        chatList.append(list)
        chatList.append(image)
    
    })
}

//variable declaration
var filesUpload = null;
var file = null;

var send = false;

if (window.File && window.FileReader && window.FileList) {
    //HTML5 File API ready
    init();
} else {
    //browser has no support for HTML5 File API
    //send a error message or something like that
    console.log("erro")
    //TODO
}

/**
 * Initialize the listeners and send the file if have.
 */
function init() {
    filesUpload = document.querySelector('.input-files');
    filesUpload.addEventListener('change', fileHandler, false);
}


function fileHandler(e) {
    var files = e.target.files || e.dataTransfer.files;
//   console.log(files)
    if (files) {
        //send only the first one
        file = files[0];
    }
}

function sendFile() {
    if (file) {
        //read the file content and prepare to send it
        var reader = new FileReader();
        
        reader.onload = function(e) {
            console.log('Sending file...');
            //get all content
            const base64 = this.result.replace(/.*base64,/, '');
            chatHistory("",base64)
        //    console.log(base64)
            socket.emit('image', base64);
        
        };
        // readAsBinaryString
        reader.readAsDataURL(file);
    }
}



let imageChunks = [];
socket.on('image', image => {
    // create image with
    const img = new Image();

    img.setAttribute('src' , `data:image/png;base64,${image}`);
    img.setAttribute('class', 'image');
    // Insert it into the DOM
    const chatList = document.querySelector('#chatList')
    chatList.append(img);
    
});


socket.on('sendImage',message=>{
    //console.log(message)
    renderImage(message)
})

function renderImage(message){
    const img=document.createElement('img');
    img.className="image";
    // chatHistory("",message)
    img.src=`data:image/png;base64, ${message} alt="Red dot"`;
    chatList.append(img);
}
document.querySelector('.image-upload').addEventListener('click',sendFile)
