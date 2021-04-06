const chatList = document.querySelector('#chatList')
const chatInput = document.querySelector('#chatInput')
const socket = io()
const roomId = document.querySelector('.chat-room-title').getAttribute('data-id')
const form = document.querySelector('.chat-form')
const feedback = document.getElementById('feedback')


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
    chatHistory(message, roomId)
    socket.emit('chatMessage', message)
    event.target.elements.chatInput.value = ''
    event.target.elements.chatInput.focus()
})

// "Typing" section
chatInput.addEventListener('keypress', function(){
    socket.emit('typing')
})

socket.on('typing', function(data) {
    feedback.innerHTML = '<p><em>' + data + ' is typing a message...</em></p>'
    
})

function outputMessage(message) {

    const list = document.createElement('li')
    list.textContent = message
    //   messages.push(message)
    chatList.append(list)
    feedback.innerHTML = "";
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
    document.querySelector(`#room-users li[data-id="${user.id}"`).remove()
})

//post chat history
async function chatHistory(message) {
    let room_id = getRoomId()
    const response = await fetch("/api/chats", {
        method: "POST",
        body: JSON.stringify({
            room_id,
            user_id,
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
  console.log(room_id)
    // let newData = data.filter(item => item.room_id === room_id)
    // renderData(newData)
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
    data.map(data => {
        const list = document.createElement('li')
        list.textContent = data.message
        chatList.append(list)
    })
}

