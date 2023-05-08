async function includeHTML() {
    let includeElements = document.querySelectorAll('[w3-include-html]');
    for (let i = 0; i < includeElements.length; i++) {
        const element = includeElements[i];
        file = element.getAttribute("w3-include-html"); // "includes/header.html"
        let resp = await fetch(file);
        if (resp.ok) {
            element.innerHTML = await resp.text();
        } else {
            element.innerHTML = 'Page not found';
        }
    }
}

function showElement(elementID) {
    document.getElementById(elementID).classList.remove("dnone");
}

function hideElement(elementID) {
    document.getElementById(elementID).classList.add("dnone");
}


function capitalizeFirstLetter(str) {
    return str.charAt(0).toUpperCase() + str.slice(1);
}

function getCurrentUserVariable() {
    const queryString = window.location.search;
    const urlParams = new URLSearchParams(queryString);
    const user = urlParams.get('user');
    return user;
}

function saveUrlVariable() {
    // let currentUser = decodeURIComponent(window.location.search.split('=')[1]);
    let currentUser = getCurrentUserVariable();
    return currentUser;
}


function addUrlVariable(id) {
    let currentUrl = window.location.href = id;
    let newUrl = currentUrl + '?user=' + saveUrlVariable();
    window.location.href = newUrl;
}

function openAddTaskSiteWithoutContact() {
    window.open(`add_task.html?contactToAddIndex=-1&user=${saveUrlVariable()}`, "_self");
}