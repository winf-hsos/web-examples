/* global firebasetools*/

firebasetools.getContentItemsRealTime("todos", todosReady);

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
  var taskList = document.querySelector("#tasklist");

  while (taskList.firstChild) {
    taskList.removeChild(taskList.firstChild);
  }
}

function todosReady(todos) {
  
  // If no todos present, do nothing
  if(todos == null)
    return;
 
  var numberTodos = todos.length;
  
  clearList();
    
  for(var i = 0; i < numberTodos; i++) {
    addTask(todos[i].title);
  }
}

function writeTask() {
  // 1. Wert aus Input-Feld auslesen
  var taskTitle = document.querySelector("#inputTaskName").value;
  
  // JSON Objekt für den Task erstellen
  var taskObject = {
    title: taskTitle
  };
  
  // 2. Wert als Task in die Datenbank schreiben
  firebasetools.addContentItem("todos", taskObject, taskSaved);
  
}

function taskSaved() {
  console.log("Task successfully saved in Firestore");
  document.querySelector("#inputTaskName").value = '';
  $('#addTaskModal').modal('hide');
}
  