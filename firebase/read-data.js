/* global firebasetools*/

firebasetools.getContentItems("todos", todosReady);

function clearTask(event) {
  var clickedListItem = event.target;
  
  // Prüfen ob Task bereits abgehakt wurde
  if (!clickedListItem.classList.contains("cleared")) {
    // Grau stylen
    clickedListItem.classList.add("cleared");
    // An das Ende verschieben 
    var taskList = clickedListItem.parentNode;
    taskList.appendChild(clickedListItem);
  
  }
  else {
    clickedListItem.classList.remove("cleared"); 
    // An den Anfang verschieben
    var taskList = clickedListItem.parentNode;
    taskList.insertBefore(clickedListItem, taskList.firstChild);
    
  } 
  
}

function addTask(taskName) {
  if (!taskName) {
    // Soll nur ausgeführt werden wenn Parameter "taskName" nicht gesetzt
    taskName = prompt("New task");
  }
  
  var taskItem = document.createElement("li");
  
  // Den Task mit Textinhalt und Eventlistener ausstatten
  taskItem.textContent = taskName;
  taskItem.addEventListener("click", clearTask);
  var taskList = document.querySelector("#tasklist");
  taskList.insertBefore(taskItem, taskList.firstChild);
}

function clearList() {
  console.log("Inside clear list");

  var taskList = document.querySelector("#tasklist");

  while (taskList.firstChild) {
    taskList.removeChild(taskList.firstChild);
  }
}

function todosReady(todos) {
 
  var numberTodos = todos.length;
    
  for(var i = 0; i < numberTodos; i++) {
    addTask(todos[i].title);
  }
}
  