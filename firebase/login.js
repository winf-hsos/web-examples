/* global firebasetools */

/* Tell Firebase to call the function 'loginChanged'
 * when a user logs in or out 
 */
firebasetools.onLoginChanged(loginChanged);

/* This function is called when the user clicks
 * the login button 
 */
function login() {
  console.log("Someone clicked login.");
  firebasetools.login();
}

/* Firebase will call this function when
 * the login status changes.
 */
function loginChanged(user) {
  
  // If a user signed in, this object is present
  if(user) {
    console.log("Login changed");
    console.log(user.email);
    //alert("Willkommen " + user.email);
    var welcomeTextDiv = document.querySelector("#welcometext");
    welcomeTextDiv.textContent = "Hello " + user.email + ". You are successully logged in!";
    welcomeTextDiv.removeAttribute("hidden");
  }
  // If no user is signed in
  else {
    console.log("Nobody signed in currently.");
    var welcomeTextDiv = document.querySelector("#welcometext");
    welcomeTextDiv.setAttribute("hidden", "");
  }
}

/* This function is called when the user clicks
 * the logout button
 */
function logout() {
  firebasetools.logout();
}
