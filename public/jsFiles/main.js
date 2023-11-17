const socket = io();


// const totalUsers=document.getElementById('totalUsers')
const messageForm=document.getElementById('messageForm')
const messageInput=document.getElementById('messageInput')
const messageContainer=document.getElementById('messageCont')
const messages=document.getElementById('messages')
const userId=document.getElementById('id')
const adminId=document.getElementById('adminId')

document.addEventListener("DOMContentLoaded",()=>{
    const data={
        id: userId.value,
        adminId: adminId?.value || null
    } 
    socket.emit('getId', data);
    scrollToBottom();
});


// socket.on('totalChat',(data)=>{
//     totalUsers.innerText=data
//     console.log(data)
// })

// socket.on('message',(data)=>{
//     // console.log(data)
// })

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
        adminId:adminId?.value||null,
        dateTime: new Date(),
    }
    socket.emit('message', data);
    addMessage(true,data);
    messageInput.value = ''
}

function addMessage(isOwn,data){
    try {
        // console.log(data)
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
    } catch (error) {
        console.log(error);
    }
}


function scrollToBottom() {
    messageContainer.scrollTo(0, messageContainer.scrollHeight)
  }