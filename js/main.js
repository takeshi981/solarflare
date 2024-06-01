const home = document.querySelector(".home"),
        formOpenBtn = document.querySelector("#login-picture"),
         formContainer = document.querySelector(".form_container"),
         user = document.querySelector("#user"),

        formCloseBtn = document.querySelector("#form-close");

let current_user = 0;
const userForm = document.getElementById("user_form");
var default_session = lightdm.default_session;
const addedUsers = new Set(); // Create a set to store added user IDs
formOpenBtn.addEventListener("click", () => home.classList.add("show"));
formOpenBtn.addEventListener("click", function(){
  formContainer.classList.add("show");
  list_users();
});

formCloseBtn.addEventListener("click", () => removeContainer());

function removeContainer(){
  home.classList.remove("show");
  formContainer.classList.remove("show");
}

function display_user_picture(current_user){

  

    document.getElementById("login-picture").style.opacity = 0;
  
        setTimeout(function(){
          if ( lightdm.users[current_user].image != null ){
            document.getElementById("login-picture").src = lightdm.users[current_user].image;
          } else {
            document.getElementById("login-picture").setAttribute("src", "static/profile.png");
          }
          
          document.getElementById("login-picture").addEventListener("load", function(){
            document.getElementById("login-picture").style.opacity = 1;
          });
        }, 350);
        user.value = lightdm.users[current_user].display_name;


        
        document.getElementById("pass").focus();
      }

      function list_users() {
        // Check if the user_form element already exists


        for (let i = 0; i < lightdm.users.length; i++) {
          const userId = lightdm.users[i].name; // Get the user ID

          if (!addedUsers.has(userId)) {
            // Add the user ID to the set
            addedUsers.add(userId);


            // Create and append the user entry
            const userEntry = document.createElement("table");
            if (userEntry) {
              userEntry.innerHTML = `
              <tr>
              <td>
              <img class="user-picture" draggable="false" src="static/profile.png" onerror="this.onerror=null; this.src='static/profile.png'" type="img-button">
              </td>
              <td><span class="user-name">${lightdm.users[i].name}</span></td>
              </tr>
              `;
              userForm.appendChild(userEntry);

              // Set user picture and name
              const userPictures = document.getElementsByClassName("user-picture");
              const userNames = document.getElementsByClassName("user-name");
              userPictures[i].src = lightdm.users[i].image;
              userNames[i].textContent = lightdm.users[i].display_name;

              // Add click event listener
              userPictures[i].addEventListener('click', function() {
                select_user(i);
              });
            }
          }
        }
      }



function select_user(i){


    home.classList.remove("show");
    formContainer.classList.remove("show");
    (document.getElementById("login-picture").src = lightdm.users[i].image || "static/profile.png");

    user.value = lightdm.users[i].display_name;
    
    current_user = i;


}
function populate_drop_down(){

 lightdm.sessions.forEach(function(session, index){




    let session_name = lightdm.sessions[index].key;

    document.getElementById("list").insertAdjacentHTML("beforeend", `
  <li class="option">
                <span class="option-text">`+session_name+`</span>
              </li>`);

 });

}
const optionMenu = document.querySelector(".select-menu"),
  selectBtn = optionMenu.querySelector(".select-btn"),

  sBtn_text = optionMenu.querySelector(".sBtn-text");

selectBtn.addEventListener("click", () =>
  optionMenu.classList.toggle("active")
);
document.onreadystatechange = () => {
  if (document.readyState == "complete") {
  const options = optionMenu.querySelectorAll(".option");

  options.forEach((option) => {

    option.addEventListener("click",  () => {

      let selectedOption = option.querySelector(".option-text").innerText;
      sBtn_text.innerText = selectedOption;

     optionMenu.classList.toggle("active");


     default_session = selectedOption;

    });
  });
}
}

function handleEnter(e){
  if (e.keyCode === 13){
    respond();
    e.preventDefault();
  }
}
function start_authentication(user){

 lightdm.authenticate(user);


}
function respond(){
  let password = pass.value || null;
  if(password !== null) {
    lightdm.respond(password);
    authenticationDone();
  } else {
    lightdm.cancel_authentication();

  }
}
function authenticationDone(){
 lightdm.authentication_complete.connect(() => {
    if (lightdm.is_authenticated) {

      authentication_complete();

    }
    else {

      authentication_failed();

    }

  });
}
async function authentication_complete()
{

  lightdm.start_session(default_session);


}

async function authentication_failed(){

  lightdm.cancel_authentication();

  start_authentication(user.value);

}
display_user_picture(current_user);
authenticationDone();
start_authentication(user.value);
populate_drop_down();
