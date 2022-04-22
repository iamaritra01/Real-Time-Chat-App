/* const io = require('socket.io')(8000); */
const socket = io('http://localhost:8000');

//Get DOM elements in respective JS Variables
const form = document.getElementById('send-container');
const messageInput  = document.getElementById('messageinp');
const messageContainer = document.querySelector(".container");

// Audio that will Play on Receiving messages
var audio = new Audio('ting.mp3')
const append = (message, position)=>{
    const messageElement  = document.createElement('div');
    messageElement.innerHTML = message;
    messageElement.classList.add('message');
    messageElement.classList.add(position);
    messageContainer.append(messageElement);
    if(position == 'left')
    {
        audio.play();
    } 
}

//If the form gets submitted, send the server
form.addEventListener('submit', (e)=>{
     e.preventDefault();
     const message = messageInput.value;
     append(`You : ${message}`, 'right');
     socket.emit('send', message);
     messageInput.value= '';
})

//Ask new user for his/her name and let the server know
const userName = prompt("Enter your Name to join : ")
socket.emit('new-user-joined',  userName);

// If a new user joins, receive his/her name from the server
socket.on('user-joined', userName =>{
    append(`${userName} joined the chat`,'right')
});

// If server sends a message , receive it
socket.on('receive', data =>{
    append(`${data.name} : ${data.message}`,'left');
});

// If a user leaves the chat, append the info to the container
socket.on('left', userName =>{
    append(`${userName} left the chat`, 'left');
})