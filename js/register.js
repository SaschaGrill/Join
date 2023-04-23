let users = [];
let currentUser;

async function loadUsers() {
  users = JSON.parse(await getItem('users'));
}

function register() {
  document.getElementById('signup-btn').classList.remove('dnone');
  document.getElementById('login-section').classList.remove('dnone');
  document.getElementById('signup-section').classList.add('dnone');
}

async function signup() {
  registerBtn.disabled = true;
  let name = document.getElementById("name-signup");
  let email = document.getElementById("email-signup");
  let password = document.getElementById("password-signup");
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
  currentUser = user.name;
  if(user) {
    email.value = '';
    password.value = '';
    window.location.href = `summary.html?user=${currentUser}`;
  } else {
    alert('try again')
  }
  users = [];
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
  document.getElementById('signup-section').classList.remove('dnone');
}

