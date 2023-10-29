const socket = io('http://localhost:5000/', { transports: ['websocket', 'polling', 'flashsocket'] });


// const totalUsers=document.getElementById('totalUsers')
const messageForm=document.getElementById('messageForm')
const messageContainer=document.getElementById('messageCont')
const messageInput=document.getElementById('messageInput')
const messages=document.getElementById('messages')
const userId=document.getElementById('id')
const user=document.getElementById('userId')

document.addEventListener("DOMContentLoaded",()=>{
    const data={
        id:userId.value,
        user:user?.value||null
    } 
    socket.emit('getId',(data))
    scrollToBottom()
})

// socket.on('totalChat',(data)=>{
//     totalUsers.innerText=data
//     console.log(data)
// })

socket.on('message',(data)=>{
    console.log(data)
})

socket.on('chatMessage',(data)=>{
    // console.log(data)
    addMessage(false,data)
})

messageForm.addEventListener('submit', (e) => {
    e.preventDefault()
    sendMessage()
})

function sendMessage() {
    if (messageInput.value === '') return
    
    const data = {
        userId:userId.value,
        message: messageInput.value,
        user:user?.value||null,
        dateTime: new Date(),
    }
    socket.emit('message', data);
    addMessage(true,data);
    messageInput.value = ''
}

function addMessage(isOwn,data){
    console.log(data)
    const element = `
    <li class="${isOwn ? 'text-end ms-auto messageRight' : 'text-start me-auto messageLeft' } ">
          <p class="message">
            ${data.message}
            <span class="dataAndTime">${moment(data.dateTime).fromNow()}</span>
          </p>
    </li>
        `
        messages.innerHTML+=element;
        scrollToBottom()
}


function scrollToBottom() {
    messageContainer.scrollTo(0, messageContainer.scrollHeight)
  }