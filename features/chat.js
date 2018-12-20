/* global firebasetools firebase */
firebasetools.onLoginChanged(loginChanged);

// A variable to store the signed in user
var signedInUser;

// Get a referecne to Firestore
var fs = firebase.firestore();

// A reference to our real-time update listener
var chatListener;

// A variable to store if and which chat is currently open
var chatOpen = null;

// A variable to hold the current chats
var allChats = [];

function loginChanged(user) {
  
  var loginAlertEl = document.querySelector("#loginAlert");
  var welcomeAlertEl = document.querySelector("#welcomeAlert");
  var newChatEl = document.querySelector("#newChat");
  var chatListEl = document.querySelector("#chatList");
  
  if(user) {
    signedInUser = user;
    loginAlertEl.setAttribute("hidden", "");    
    welcomeAlertEl.innerHTML = "Welcome <b>" + user.email + "</b>!";
    welcomeAlertEl.removeAttribute("hidden");
    newChatEl.removeAttribute("hidden");
    chatListEl.removeAttribute("hidden");
    
    // Start listen to chats
    listenToChats();
    
  }
  else {
    signedInUser = null;
    loginAlertEl.removeAttribute("hidden");
    welcomeAlertEl.setAttribute("hidden", "");
    newChatEl.setAttribute("hidden", "");
    chatListEl.setAttribute("hidden", "");
    
    // Stop listenting to chat changes when signed out
    chatListener();
  }
}

function createNewChat() {
  
  // Get the UID that was entered    
  var uidInputEl = document.querySelector("#userToChatWith");
  var uid = uidInputEl.value;
  
  // Check if the chat with this user already exists
  var chatExists = allChats.some((c) => {
    return getChatee(c.participants) == uid;
  });
  
  if(chatExists == true) {
    alert("Chat with user >" + uid + "< exists already");
    return;
  }
  
    
  // Get the text that was entered    
  var chatTextInputEl = document.querySelector("#chatText");
  var chatText = chatTextInputEl.value;
  
  // Create the message object
  var message = {
    from: signedInUser.uid,
    time: Date.now(),
    text: chatText
  }
  
  // Create the chat object
  var chatObject = {
    participants: [ signedInUser.uid, uid ],
    created_at: Date.now(),
    messages: [ message ]
  }
  
  // Create a new chat in Firestore
  fs.collection("chats").add(chatObject).then(() => {
    console.log("Added new chat");
  });
}

function listenToChats() {
  
  chatListener = fs.collection("chats").where("participants", "array-contains", signedInUser.uid)
    .onSnapshot(function(querySnapshot) {
        var chats = [];
        querySnapshot.forEach(function(doc) {
          var chat = doc.data();
          chat.id = doc.id;
          chats.push(chat);
        });

        refreshChatList(chats);
        refreshModal(chats);
        allChats = chats;
         
    });
}

function refreshChatList(chats) {
  
  var chatListEl = document.querySelector("#listOfChats");
  
  // Clear chat lists
  while(chatListEl.firstChild) {
    chatListEl.removeChild(chatListEl.firstChild);
  }
  
  for(var i = 0; i < chats.length; i++) {
    var chat = chats[i];
    
    var chatItem = document.createElement("li");
    // Add Bootstrap class
    chatItem.classList.add("list-group-item");   
    
    chatItem.innerHTML = 'Chat with user <tt>' + getChatee(chat.participants) +'</tt>';
    chatItem.addEventListener('click', showChatInModal.bind(this, chat), false);
    chatListEl.appendChild(chatItem);
  }
}

// This functions takes care of refreshing the model (if open)
function refreshModal(chats) {
  
  if(chatOpen !== null) {
    for(var i = 0; i < chats.length; i++) {
      if(chatOpen == chats[i].id) {
        showChatInModal(chats[i]);
        break;
      }
    }
  }
}

function showChatInModal(chat) {

  chatOpen = chat.id;
  
  var chatHistory = '';
  
  var modal = document.querySelector("#chatView");
  modal.querySelector('.modal-title').innerHTML = "Chat with <tt>" + getChatee(chat.participants) + "</tt>";
  
  // Iterate through all messages in chat
  chat.messages.forEach( (m) => {
    var messageDate = new Date(m.time);
    chatHistory += '<p><b>' + (m.from == signedInUser.uid ? "You" : "Him/Her") + '</b> [' + messageDate.getHours() + ':' + messageDate.getMinutes() +  ']: ' + m.text + '</p>';
  });

  // Add input and button for new chat messages
  var chatForm = '<hr><div class="form-row">' +
                    '<div class="col"><input id="chatMessageInput"type="text" class="form-control"></div>' +
                    '<div class="col-3"><button onclick="addChatMessage(\'' + chat.id + '\')" type="button" class="btn btn-secondary">Send</button>' +
                  '</div>';
  
  modal.querySelector('.modal-body').innerHTML = chatHistory + chatForm;  
  
  $('#chatView').modal('show');  
}

function addChatMessage(chatId) {
  
  var chatMessageInputField = document.querySelector("#chatMessageInput");

  var chatRef = fs.collection("chats").doc(chatId);
  
  var message = {
    from: signedInUser.uid,
    text: chatMessageInputField.value,
    time: Date.now()
  };

  // Add a new array entry to the messages array
  chatRef.update({
    messages: firebase.firestore.FieldValue.arrayUnion(message)
  });
}

// This function identifies the person that the current user speaks with
// NOTE: Works only if there are two participants, not more
function getChatee(participants) {
  for(var i = 0; i < participants.length; i++) {
    if(participants[i] !== signedInUser.uid)
      return participants[i];
  }
  return "N/A";
}

