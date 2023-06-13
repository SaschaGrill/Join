let contacts = [];
let chosenContact = 0;

/**
 * Splits a full name into an array of first name and last name.
 * 
 * @param {string} fullName - The full name to split.
 * @returns {string[]} An array containing the first name and last name.
 */
function firstAndLastNameAsArray(fullName) {
    const names = fullName.split(" ");
    const firstName = names[0];
    const lastName = names[names.length - 1];
    return [firstName, lastName];
}

/**
 * Gets the initials of a first name and last name.
 * 
 * @param {string} firstName - The first name.
 * @param {string} lastName - The last name.
 * @returns {string[]} An array containing the initials of the first name and last name.
 */
function getInitials(firstName, lastName) {
    return [firstName[0], lastName[0]];
}

/**
 * Checks if a user with the given email is in the contacts list.
 * 
 * @param {string} email - The email to search for.
 * @returns {boolean} Returns true if the user is found in the contacts list, false otherwise.
 */
function isUserInContacts(email) {
    for (let contact of contacts) {
        if (contact.email === email) {
            return true;
        }
    }
    return false;
}

/**
 * Adds a contact for every user that is not already in the contacts list.
 * 
 * @returns {Promise<void>} A promise that resolves once all contacts are added.
 */
async function addContactForEveryUser() {
    await loadUsers();
    for (let i = 0; i < users.length; i++) {
        const user = users[i];
        if (!isUserInContacts(user.email)) {
            let fullNameAsArray = firstAndLastNameAsArray(user.name);
            let contact = {
                firstName: fullNameAsArray[0],
                lastName: fullNameAsArray[1],
                color: getRandomColor(),
                initials: getInitials(fullNameAsArray[0], fullNameAsArray[1]),
                email: user.email,
                phone: "to be added",
            }
            contacts.push(contact);
        }
    }
}

/**
 * Initializes the contact management system.
 * 
 * @returns {Promise<void>} A promise that resolves once the initialization is complete.
 */
async function initializeContact() {
    includeHTML();
    await loadContacts();
    await addContactForEveryUser();
    renderContactsList();
    userFromURL(); //to save user in variable
    renderContactBig(contacts[0]);
    setNavBarLinks();
}

/**
 * Loads the contacts from storage.
 * 
 * @returns {Promise<void>} A promise that resolves once the contacts are loaded.
 */
async function loadContacts() {
    contacts = [];
    contacts = JSON.parse(await getItem('contacts'));
}

/**
 * Generates a random color.
 * 
 * @returns {string} The randomly generated color in hexadecimal format.
 */
function getRandomColor() {
    const letters = '0123456789ABCDEF';
    let color = '#';
    for (let i = 0; i < 6; i++) {
        color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
}

/**
 * Gets the color corresponding to the initials of a name.
 * 
 * @param {string} firstName - The first name.
 * @param {string} lastName - The last name.
 * @returns {string} The color corresponding to the initials of the name.
 */
function getColorForName(firstName, lastName) {
    const initials = firstName.charAt(0) + lastName.charAt(0);
    return getColorForInitials(initials);
}

/**
 * Gets the color corresponding to the initials.
 * 
 * @param {string} initials - The initials.
 * @returns {string} The color corresponding to the initials.
 */
function getColorForInitials(initials) {
    const colors = {};
    if (!colors[initials]) {
        colors[initials] = getRandomColor();
    }
    return colors[initials];
}

/**
 * Renders the contacts list on the left side.
 */
function renderContactsList() {
    let alphabet = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm', 'n', 'o', 'p', 'q', 'r', 's', 't', 'u', 'v', 'w', 'x', 'y', 'z'];

    let contactList = document.getElementById("contact-list");
    contactList.innerHTML = "";

    for (let i = 0; i < alphabet.length; i++) {
        const letter = alphabet[i];
        let contactsIncludingLetter = [];
        for (let j = 0; j < contacts.length; j++) {
            if (contacts[j].firstName && contacts[j].firstName[0].toLowerCase() == letter) {
                contactsIncludingLetter.push(contacts[j]);
            }
        }

        let contactList = document.getElementById("contact-list");

        if (contactsIncludingLetter.length > 0) {
            contactList.innerHTML += contactListLetterHTML(letter.toUpperCase());
        }

        for (let k = 0; k < contactsIncludingLetter.length; k++) {
            contactList.innerHTML += contactInListHTML(contactsIncludingLetter[k]);
        }
    }
}

/**
 * Generates the HTML for a contact list letter.
 * 
 * @param {string} letter - The letter.
 * @returns {string} The HTML for the contact list letter.
 */
function contactListLetterHTML(letter = "no Letter") {
    return /*html*/`
    <div class="contact-list-letter">
    <span>${letter}</span>
    </div>`;
}

/**
 * Generates the HTML for a contact in the contact list.
 * 
 * @param {object} contact - The contact object.
 * @returns {string} The HTML for the contact in the contact list.
 */
function contactInListHTML(contact) {
    let contactIndex = contacts.indexOf(contact);
    return /*html*/`
    <div class="contact pointer" id="contactInList_${contactIndex}" onclick="renderContactBig(contacts[${contactIndex}], ${contactIndex})">
        ${contactCircleHTML(contact, false)}
        <div class="contact-details">
            <span class="contact-list-name">${contact.firstName} ${contact.lastName}</span>
            <span class="contact-list-mail pointer">${contact.email}</span>
        </div>
    </div>
    `;
}

function markChosenContact(contactIndex = 0) {
    let chosenContactElement = document.getElementById(`contactInList_${chosenContact}`);
    chosenContactElement.classList.remove("contact-activated");
    chosenContactElement = document.getElementById(`contactInList_${contactIndex}`)
    chosenContactElement.classList.add("contact-activated");
    chosenContact = contactIndex;
}

/**
 * Renders the big contact view.
 * 
 * @param {object} contact - The contact object.
 */
function renderContactBig(contact, contactIndex) {
    let contactBigContainer = document.getElementById('contactBigContainer');
    let contactList = document.getElementById('contactList');

    markChosenContact(contactIndex);

    if (isMobileView()) {
        contactList.classList.add('dnone');
        contactBigContainer.classList.remove('dnone');
    }

    contactBigContainer.innerHTML = "";

    if (isMobileView()) {
        let contactIndex = contacts.indexOf(contact);
        contactBigContainer.innerHTML += `
        <img src="assets/img/arrow-left-line.svg" class="return-icon" id="return-icon" onclick="returnToListView()">
        <div class="mobile-delete-button pointer" id="mobile-delete-button" onclick="deleteContact(${contactIndex}, event); returnToListView()"><img src="assets/img/delete.png"></div>`;
    }

    contactBigContainer.innerHTML += contactsBigHTML(contact);
}

/**
 * Opens the add task site with the selected contact.
 * 
 * @param {number} contactIndex - The index of the contact to add the task for.
 */
function openAddTaskSiteWithContact(contactIndex) {
    window.open(`add_task.html?contactToAddIndex=${contactIndex}&user=${userFromURL()}`, "_self");
}

/**
 * Generates the HTML for the big contact view.
 * 
 * @param {object} contact - The contact object.
 * @returns {string} The HTML for the big contact view.
 */
function contactsBigHTML(contact) {
    let contactIndex = contacts.indexOf(contact);
    return /*html*/`
    <div class="contacts-header">
                        <p class="dnone" id="kanbanboard-head">Kanban Project Management Tool</p>
                        <h1 class="headlines">Contacts</h1>
                            <div class="mobile-contacts-header">
                                <p class="contacts-headline-line"></p>
                                <p>Better with a team</p>
                            </div>
                    </div>

                    <div class="contact-name-container-big">
                        <div class="contacts-big-circle" style="background-color: ${contact.color}">
                            ${contact.initials.join('')}
                        </div>
                        <div>
                           ${contact.firstName}  ${contact.lastName}
                            <div class="contact-add-task" onclick="openAddTaskSiteWithContact(${contactIndex})">+ Add Task</div>
                        </div>
                    </div>

                    <div class="contact-information padding-bt10">
                        <span>Contact Information</span>
                        <span class="edit-task-contact" onclick="openEditContactForm(contacts[${contactIndex}])">
                            <img src="assets/img/pen_black.png" alt=""><p>Edit Contact</p>
                        </span>
                    </div>

                    <div class="dflex-col gap10 padding-bt10">
                        <span class="bold">
                        Email
                        </span>
                        <a href='mailto:${contact.email}' class="contact-list-link pointer">
                        ${contact.email}
                        </a>
                    </div>

                    <div class="dflex-col gap10 padding-bt10">
                        <span class="bold">
                        Phone
                        </span>
                        <a href='tel:${contact.phone}' class="contact-list-link pointer">
                        ${contact.phone}
                        </a>
                    </div>
    `;
}

/**
 * Opens the form for adding a new contact.
 */
function openAddContactForm() {
    const oldOverlay = document.getElementById('overlay-container');
    if (oldOverlay) {
        oldOverlay.remove();
    }

    const formHTML = `
    <div class="overlay-contacts">
        <div class="overlay-contact-form">
            <div class="newContactLeft">
                <img src="assets/img/joinlogobright.svg">
                <h1>Add Contact</h1>
                <p>Tasks are better with a team!</p>
                <div class="blue-line"></div>
            </div>
            <div class="newContactRight">
                <img class="contactCancel" src="assets/img/cancel.svg" onclick="closeOverlay(event)">
                <div class="newContactImg">
                    <img src="assets/img/newContactGrey.svg">
                </div>
                <div class="newContactInput">
                    <form onsubmit="addNewContact(event); return false;">    
                        <input class="contacts-user" type="text" id="add-name" placeholder="Name" pattern="[A-Za-z]+" required>
                        <input class="contacts-email" type="email" id="add-email" placeholder="Email" required>
                        <input class="contacts-phone" type="number" id="add-phone" placeholder="Phone" required>
                        <div class="addContactButtons">
                            <button class="cancel" onclick="closeOverlay(event)" formnovalidate>Cancel<img src="assets/img/cancel.svg"></button>
                            <button class="createContact">Create Contact<img src="assets/img/apply.svg"></button>
                        </div>
                    </form>    
                </div>
            </div>
    </div>
    `;
    const overlayDiv = document.createElement('div');
    overlayDiv.id = 'overlay-container';
    overlayDiv.innerHTML = formHTML;
    document.body.appendChild(overlayDiv);
}

/**
 * Adds a new contact to the contacts array.
 * 
 * @param {Event} event - The event object.
 */
async function addNewContact(event) {
    event.preventDefault();
    const name = document.getElementById('add-name').value;
    const [firstName, lastName] = firstAndLastNameAsArray(name);
    const email = document.getElementById('add-email').value;
    const phone = document.getElementById('add-phone').value;

    const contact = {
        firstName,
        lastName,
        color: getRandomColor(),
        initials: getInitials(firstName, lastName),
        email,
        phone,
    };

    contacts.push(contact);
    await setItem('contacts', JSON.stringify(contacts));
    renderContactsList();
    closeOverlay(event);
    renderContactBig(contact);
    showNotification("Contact succesfully created");
}

/* */
function showNotification(message) {
    const notification = document.createElement("div");
    notification.classList.add("notification");
    notification.textContent = message;
    document.body.appendChild(notification);
    setTimeout(() => {
        if (notification.parentElement === document.body) {
            document.body.removeChild(notification);
        }
    }, 4000);
}

/**
 * Opens the form for editing a contact.
 * 
 * @param {object} contact - The contact object to be edited.
 */
function openEditContactForm(contact) {
    const contactIndex = contacts.indexOf(contact);
    const formHTML = `
        <div class="overlay-contacts">
            <div class="overlay-contact-form">    
                <div class="editContactLeft">
                    <img src="assets/img/joinlogobright.svg">
                    <h1>Edit Contact</h1>
                    <div class="blue-line"></div>
                </div>
                <div class="editContactRight">
                    <img class="contactCancel" src="assets/img/cancel.svg" onclick="closeOverlay(event)">
                    <div class="contacts-big-circle margin-right" style="background-color: ${contact.color}">
                    ${contact.initials.join('')}
                </div>
                <div class="editContactInput">
                    <form onsubmit="editContact(${contactIndex}, event, contacts[${contactIndex}]); return false;">
                        <input class="contacts-user" type="text" id="edit-name" value="${contact.firstName} ${contact.lastName}" placeholder="Name">
                        <input class="contacts-email" type="email" id="edit-email" value="${contact.email}" placeholder="Email">
                        <input class="contacts-phone" type="number" id="edit-phone" value="${contact.phone}" placeholder="Phone">
                        <div class="addContactButtons">
                            <button class="delete" onclick="deleteContact(${contactIndex}, event); closeOverlay(event)" formnovalidate>Delete</button>
                            <button class="save">Save</button>
                        </div>
                    </form>    
                </div>
            </div> 
        </div>       
    `;
    const overlayDiv = document.createElement('div');
    overlayDiv.id = 'overlay-container';
    overlayDiv.innerHTML = formHTML;
    document.body.appendChild(overlayDiv);
}

/**
 * Closes the overlay when clicked outside the form.
 */
function closeOverlay() {
    const overlayContainer = document.getElementById('overlay-container');
    if (overlayContainer && overlayContainer.parentElement === document.body) {
        document.body.removeChild(overlayContainer);
    }
}


/**
 * Edits a contact in the contacts array.
 * 
 * @param {number} contactIndex - The index of the contact to be edited.
 * @param {Event} event - The event object.
 * @param {object} contact - The contact object being edited.
 */
async function editContact(contactIndex, event, contact) {
    event.preventDefault();
    const name = document.getElementById('edit-name').value;
    const [firstName, lastName] = firstAndLastNameAsArray(name);
    const email = document.getElementById('edit-email').value;
    const phone = document.getElementById('edit-phone').value;

    contacts[contactIndex].firstName = firstName;
    contacts[contactIndex].lastName = lastName;
    contacts[contactIndex].initials = getInitials(firstName, lastName);
    contacts[contactIndex].email = email;
    contacts[contactIndex].phone = phone;
    await setItem('contacts', JSON.stringify(contacts));
    renderContactsList();
    closeOverlay(event);
    renderContactBig(contact);
}

/**
 * Deletes a contact from the "contacts" array, updates the online storage, and closes the overlay.
 * 
 * @param {number} contactIndex - The index of the contact to be deleted.
 * @param {Event} event - The event object.
 */
async function deleteContact(contactIndex, event) {
    contacts.splice(contactIndex, 1);
    await setItem('contacts', JSON.stringify(contacts));
    renderContactsList();
    if (!isMobileView() && contacts.length > 0) {
        renderContactBig(contacts[0]);
    } else if (isMobileView()) {
        returnToListView();
    }
    if (event) closeOverlay(event);
}

/**
 * Checks if width is under 1000px
 */
function isMobileView() {
    return window.innerWidth < 1000;
}

/**
 * Returns to List
 */
function returnToListView() {
    let contactBigContainer = document.getElementById('contactBigContainer');
    let contactList = document.getElementById('contactList');
    let kanbanboard = document.getElementById('kanbanboard-head');

    if (isMobileView()) {
        contactBigContainer.classList.add('dnone');
        contactList.classList.remove('dnone');
        kanbanboard.classList.remove('dnone');
    } else {
        kanbanboard.classList.add('dnone');
    }
}

/**
 * Event listener for window 'resize' event.
 * Toggles visibility of specific DOM elements based on the current view (Mobile or Desktop).
 *
 * @param {Event} event - The Event object representing the 'resize' event.
 */
window.addEventListener('resize', function () {
    let contactBigContainer = document.getElementById("contactBigContainer");
    let contactList = document.getElementById('contactList');
    let returnIcon = document.getElementById('return-icon');
    let mobileDeleteButton = document.getElementById('mobile-delete-button');

    if (isMobileView()) {
        if (contactBigContainer)
            contactBigContainer.classList.add('dnone');
        if (contactList)
            contactList.classList.remove('dnone');
    } else {
        if (contactBigContainer)
            contactBigContainer.classList.remove('dnone');
        if (contactList)
            contactList.classList.remove('dnone');
        if (returnIcon) {
            returnIcon.classList.add('dnone');
        }
        if (mobileDeleteButton) {
            mobileDeleteButton.classList.add('dnone');
        }
    }
});

