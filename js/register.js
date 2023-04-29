let users = [];

function init() {
  loadEmailPassword();
  loadUsers();
}


function loadEmailPassword() {
  let email = document.getElementById("email-login");
  let password = document.getElementById("password-login");
  let checkbox = document.getElementById("login-checkbox");
  let rememberMeChecked = localStorage.getItem("rememberMeChecked");
  if (rememberMeChecked === "true") {
    checkbox.checked = true;
    email.value = localStorage.getItem("email");
    password.value = localStorage.getItem("password");
  } else {
    checkbox.checked = false;
    email.value = "";
    password.value = "";
  }
}


async function loadUsers() {
  users = JSON.parse(await getItem('users'));
}


function register() {
  document.getElementById('signup-btn').classList.remove('dnone');
  document.getElementById('login-section').classList.remove('dnone');
  document.getElementById('signup-section').classList.add('dnone');
  document.getElementById('forgot-password').classList.add('dnone');
}


async function signup() {
  registerBtn.disabled = true;
  let name = document.getElementById("name-signup");
  let email = document.getElementById("email-signup");
  let password = document.getElementById("password-signup");
  await loadUsers();
  users.push({
    name: name.value,
    email: email.value,
    password: password.value,
  });
  await setItem('users', JSON.stringify(users));
  resetSignup(name, email, password);
  register();
}


function resetSignup(name, email, password) {
  name.value = "";
  email.value = "";
  password.value = "";
  registerBtn.disabled = false;
}


async function login() {
  await loadUsers();
  let email = document.getElementById("email-login");
  let password = document.getElementById("password-login");
  let user = users.find( u => u.email == email.value && u.password == password.value);
  if(user) {
    rememberLogin(email.value, password.value);
    email.value = '';
    password.value = '';
    window.location.href = `summary.html?user=${user.name}`;
  } else {
    alert('try again')
  }
  users = [];
}


function rememberLogin(email, password) {
  let checkbox = document.getElementById("login-checkbox");
  if (checkbox.checked) {
    localStorage.setItem("email", email);
    localStorage.setItem("password", password);
    localStorage.setItem("rememberMeChecked", "true");
  } else {
    localStorage.removeItem("email");
    localStorage.removeItem("password");
    localStorage.setItem("rememberMeChecked", "false");
  }
}


async function loginGuest() {
  await loadUsers();
  let email = document.getElementById("email-login");
  let password = document.getElementById("password-login");
  email.value = "guest@guest.com";
  password.value = "123456";
  let user = users.find( u => u.email == email.value && u.password == password.value);
  currentUser = user.name;
  if(user) {
    email.value = '';
    password.value = '';
    window.location.href = `summary.html?user=${currentUser}`;
  }
  users = [];
}


function signupButton() {
  document.getElementById('signup-btn').classList.add('dnone');
  document.getElementById('login-section').classList.add('dnone');
  document.getElementById('forgot-password').classList.add('dnone');
  document.getElementById('signup-section').classList.remove('dnone');
}


function forgotPassword() {
  document.getElementById('signup-btn').classList.add('dnone');
  document.getElementById('login-section').classList.add('dnone');
  document.getElementById('signup-section').classList.add('dnone');
  document.getElementById('forgot-password').classList.remove('dnone');
}


function openLogout() {
  document.getElementById('logout-btn').classList.remove('dnone');
  setTimeout(() => {
    document.addEventListener('click', checkLogout);
  }, 0);
  
}


function closeLogout() {
  document.getElementById('logout-btn').classList.add('dnone');
  document.removeEventListener('click', checkLogout);
}


function checkLogout(event) {
  if (event.target.id !== 'logout-btn') {
    closeLogout();
  }
}


function logout() {
  window.location.href = 'index.html';
}


async function resetPassword(event) {
  event.preventDefault();
  let formData = new FormData(event.target);
  let response = await action(formData);
  if(response.ok) {
    alert('E-Mail has beend sent!');
  } else {
    alert('E-Mail was not sent!');
  }
}


function action(formData) {
  const input = 'https://gruppe-544.developerakademie.net/Join/send-mail.php';
  const requestInit = {
    method: 'post',
    body: formData
  };

  return fetch(
    input,
    requestInit
  );
}


function onPageLoad() {
  email = getEmailUrl();
  loadUsers();
}


function getEmailUrl() {
  const queryString = window.location.search;
  const urlParams = new URLSearchParams(queryString);
  const email = urlParams.get('email');
  return email;
}