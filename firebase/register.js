/* global firebasetools */

firebasetools.onLoginChanged(loginChanged);

function loginChanged(user) {
  if(user) {
    console.log("User " + user.email + " has logged in");
    
    firebasetools.getUserProfile(fillProfileForm);
    
  }
  else {
    console.log("Nobody currently signed in.");
    // Zeige die Sign-Up Form und verstecke die Profilansicht
    document.querySelector('#signupForm').removeAttribute("hidden");
    document.querySelector('#userProfileForm').setAttribute("hidden", "");
  }
}

function fillProfileForm(userProfile) {
  // Befülle die Input-Felder mit den Werten aus dem Profil
  console.dir(userProfile);
  
  document.querySelector('#firstname').value = userProfile.firstname || "";
  document.querySelector('#lastname').value = userProfile.lastname || "";
  document.querySelector('#roleInput').value = userProfile.role || "Student";

  // Zeige die Profilansicht und verstecke die Sign-Up Form
  // #signupForm #userProfileForm
  document.querySelector('#userProfileForm').removeAttribute("hidden");
  document.querySelector('#signupForm').setAttribute("hidden", "");
 
}

function signup() {
  
  console.log("Signup started.");
  
  firebasetools.register();
}

function saveProfile() {
 
  // 1. Schritt: Lese Informationen aus Formular
  // #firstname, #lastname, #roleInput
  
  var firstName = document.querySelector('#firstname').value;
  var lastName = document.querySelector('#lastname').value;
  var role = document.querySelector('#roleInput').value;

  // 2. Schritt: Erzeuge JSON Objekt
  var userProfileJson = {
    firstname: firstName,
    lastname: lastName,
    role: role  
  }
  
  // 3. Schritt: Speichere JSON Objekt in Firestore
  firebasetools.setUserProfile(userProfileJson);
   
}

function logout() {
  firebasetools.logout();
}
