/**
 * This function will load templates to your html
 */
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


/**
 * Shows an element by removing the "dnone" class.
 * 
 * @param {string} elementID - The ID of the element to show.
 */
function showElement(elementID) {
    document.getElementById(elementID).classList.remove("dnone");
}


/**
 * Hides an element by adding the "dnone" class.
 * 
 * @param {string} elementID - The ID of the element to hide.
 */
function hideElement(elementID) {
    document.getElementById(elementID).classList.add("dnone");
}


/**
 * Capitalizes the first letter of a string.
 * 
 * @param {string} str - The input string.
 * @returns {string} The input string with the first letter capitalized.
 */
function capitalizeFirstLetter(str) {
    return str.charAt(0).toUpperCase() + str.slice(1);
}


/**
 * Retrieves the value of the "user" URL parameter from the current page URL.
 * 
 * @returns {string|null} The value of the "user" URL parameter, or null if it is not found.
 */
function getCurrentUserVariable() {
    const queryString = window.location.search;
    const urlParams = new URLSearchParams(queryString);
    const user = urlParams.get('user');
    return user;
}


/**
 * Saves the value of the "user" URL parameter from the current page URL.
 * 
 * @returns {string|null} The value of the "user" URL parameter, or null if it is not found.
 */
function userFromURL() {
    let currentUser = getCurrentUserVariable();
    return currentUser;
}


/**
 * Adds the "user" URL parameter with the specified ID to the according href.
 * 
 * @param {string} id - The ID to append as the "user" URL parameter.
 */
function addUrlVariable(id) {
    let currentUrl = window.location.href;
    console.log(currentUrl);
    let newUrl = currentUrl + '?user=' + userFromURL();
    return newUrl;
}

function setNavBarLinks() {
    console.log("setLinks");
    let summaryLink;
    let boardLink;
    let addTaskLink;
    let contactsLink;

    if (window.innerWidth > 999) {
        summaryLink = document.getElementById("summaryHTML");
        boardLink = document.getElementById("boardHTML");
        addTaskLink = document.getElementById("addTaskHTML");
        contactsLink = document.getElementById("contactsHTML");
    }
    else {
        console.log("smal");
        summaryLink = document.getElementById("summaryHTML_mobile");
        boardLink = document.getElementById("boardHTML_mobile");
        addTaskLink = document.getElementById("addTaskHTML_mobile");
        contactsLink = document.getElementById("contactsHTML_mobile");
    }


    summaryLink.href = openSummaryLink();
    boardLink.href = openBoardLink();
    addTaskLink.href = addTaskSiteWithoutContactLink();
    contactsLink.href = openContactLink();
}

/**
 * Opens the "add_task.html" page without specifying a contact to add.
 */
function addTaskSiteWithoutContactLink() {
    return `add_task.html?contactToAddIndex=-1&user=${userFromURL()}`;
}


function openSummaryLink() {
    return `summary.html?user=${userFromURL()}`;
}

function openContactLink() {
    return `contacts.html?user=${userFromURL()}`;
}

/**
 * Opens the "board.html" page.
 * 
 */
function openBoardLink() {
    return `board.html?contactToAddIndex=-1&user=${userFromURL()}`;
}

function goToBoard() {
    window.open(openBoardLink(), "_self");
}

/**
 * Opens the "big_card_mobile.html" page with the specified card index.
 * 
 * @param {number} cardIndex - The index of the card to display.
 */
function openBigCardMobile(cardIndex) {
    window.open(`big_card_mobile.html?user=${userFromURL()}&card_ind=${cardIndex}`, "_self");
}

/**
 * Navigates the user back to the previous page in their browser history.
 *
 * @function
 * @name goBack
 * @returns {void}
 */
function goBack() {
    window.history.back();
  }   
