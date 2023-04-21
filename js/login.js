let accounts = [];

document.addEventListener("DOMContentLoaded", function () {
  let form = document.getElementById("signup-form");
  form.addEventListener("submit", signup);

  function signup(event) {
    event.preventDefault();
    let name = document.getElementById("name-signup");
    let email = document.getElementById("email-signup");
    let password = document.getElementById("password-signup");
    let account = {
      name: name.value,
      email: email.value,
      password: password.value,
    };
    accounts.push(account);
    name.value = "";
    email.value = "";
    password.value = "";
  }
});
