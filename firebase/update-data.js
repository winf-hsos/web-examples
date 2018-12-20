/* global firebasetools*/

firebasetools.getContentItemsRealTime("todos", todosReady);

function toggleTaskStatus(event) {
  var clickedListItem = event.target;
  var taskId = clickedListItem.dataset.id;
  
  var newStatus;
  if(clickedListItem.dataset.done == "true") {
    newStatus = false;
  }
  else {
    newStatus = true;
  }
    
  var updatedTask =  {
    done: newStatus
  };
  
  // Letzter Schritt: Ändern des aktuellen Tasks in der Datenbank
  firebasetools.updateContentItem("todos", taskId, updatedTask, taskUpdated);
 
}

function taskUpdated() {
  console.log("Task successfully updated.");
}

function addTask(task) {
    
  var taskItem = document.createElement("li");
  
  // Den Task mit Textinhalt und Eventlistener ausstatten
  taskItem.textContent = task.title;
  taskItem.addEventListener("click", toggleTaskStatus);
  taskItem.dataset.id = task.id;
  taskItem.dataset.done = task.done;
  
  var taskList = document.querySelector("#tasklist");
    
  // Style task je nach status
  if(task.done == true) {
    taskItem.classList.add("cleared"); 
    taskList.appendChild(taskItem);
  }
  else {
    taskList.insertBefore(taskItem, taskList.firstChild);
  
  }
  
    /*
  // Prüfen ob Task bereits abgehakt wurde
  if (!clickedListItem.classList.contains("cleared")) {
    // Grau stylen
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
*/
}

// Diese Funktion entfernt alle abgehakten Tasks
// aus der Datenbank
function cleanList() {
  
  // 1. Schritt: Suche nach Elementen in der <ul> mit data-done = true
  var taskList = document.querySelector("#tasklist");
  var numberTodos = taskList.children.length;
  
  for(var i = 0; i < numberTodos; i++) {
    var done = taskList.children[i].dataset.done;
    
    if(done == "true") {
      firebasetools.removeContentItem("todos", taskList.children[i].dataset.id, taskDeleted); 
    }
  }
 
}

function taskDeleted() {
  console.log("Task successfully deleted!");
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
    addTask(todos[i]);
  }
}

function writeTask() {
  // 1. Wert aus Input-Feld auslesen
  var taskTitle = document.querySelector("#inputTaskName").value;
  
  if(taskTitle.length >= 10) {
    alert("Task ist zu lang");
    return;
  }
  
  // JSON Objekt für den Task erstellen
  var taskObject = {
    title: taskTitle,
    done: false
  };
  
  // 2. Wert als Task in die Datenbank schreiben
  firebasetools.addContentItem("todos", taskObject, taskSaved);
  
}

function taskSaved() {
  console.log("Task successfully saved in Firestore");
  document.querySelector("#inputTaskName").value = '';
  $('#addTaskModal').modal('hide');
}
  