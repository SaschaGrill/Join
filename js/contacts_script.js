let contacts = [];

function firstAndLastNameAsArray(fullName) {
    const names = fullName.split(" ");
    const firstName = names[0];
    const lastName = names[names.length - 1];
    return [firstName, lastName];
}

function getInitials(firstName, lastName) {
    return [firstName[0], lastName[0]];
}

function isUserInContacts(email) {
    for (let contact of contacts) {
        if (contact.email === email) {
            return true;
        }
    }
    return false;
}

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

async function initializeContact() {
    includeHTML();
    await loadContacts();
    await addContactForEveryUser();
    renderContactsList();
    saveUrlVariable();
    renderContactBig(contacts[0])
}

async function loadContacts() {
    contacts = [];
    contacts = JSON.parse(await getItem('contacts'));
}

// generiert zufällige Farbe
function getRandomColor() {
    const letters = '0123456789ABCDEF';
    let color = '#';
    for (let i = 0; i < 6; i++) {
        color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
}

// Wandelt erste Buchstaben von Vor- und Nachname in Initialen um
function getColorForName(firstName, lastName) {
    const initials = firstName.charAt(0) + lastName.charAt(0);
    return getColorForInitials(initials);
}

// wandelt Initialen in Farben um
function getColorForInitials(initials) {
    const colors = {};
    if (!colors[initials]) {
        colors[initials] = getRandomColor();
    }
    return colors[initials];
}

//rendert die Liste Aller Kontakte am Linken Rand
function renderContactsList() {
    var alphabet = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm', 'n', 'o', 'p', 'q', 'r', 's', 't', 'u', 'v', 'w', 'x', 'y', 'z'];

    // Kontaktliste leeren
    let contactList = document.getElementById("contact-list");
    contactList.innerHTML = "";

    for (let i = 0; i < alphabet.length; i++) {
        const letter = alphabet[i];
        let contactsIncludingLetter = [];
        for (let j = 0; j < contacts.length; j++) {
            // Überprüfen, ob contacts[j].firstName definiert ist
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

function contactListLetterHTML(letter = "no Letter") {
    return /*html*/`
    <div class="contact-list-letter">
    <span>${letter}</span>
    </div>`;
}

function contactInListHTML(contact) {
    let contactIndex = contacts.indexOf(contact);
    return /*html*/`
    <div class="contact pointer" onclick="renderContactBig(contacts[${contactIndex}])">
        ${contactCircleHTML(contact, false)}
        <div class="contact-details">
            <span class="contact-list-name">${contact.firstName} ${contact.lastName}</span>
            <span class="contact-list-mail pointer">${contact.email}</span>
        </div>
    </div>
    `;
}

//rendert einen Kontakt in der großen Anzeige
function renderContactBig(contact) {
    let contactBigContainer = document.getElementById('contactBigContainer');
    let contactList = document.getElementById('contactList');

    // Blendet die Kontaktliste aus und den großen Kontakt-Container ein, wenn die Fenstergröße kleiner als 1000px ist
    if (window.innerWidth < 1000) {
        contactList.classList.add('dnone');
        contactBigContainer.classList.remove('dnone');
    }

    contactBigContainer.innerHTML = "";

    // Fügt das Rückkehr-Symbol und den "Löschen"-Button hinzu, wenn die Fenstergröße kleiner als 1000px ist
    if (window.innerWidth < 1000) {
        let contactIndex = contacts.indexOf(contact);
        contactBigContainer.innerHTML += `
        <img src="assets/img/arrow-left-line.svg" class="return-icon" id="return-icon" onclick="returnToListView()">
        <div class="mobile-delete-button" onclick="deleteContact(${contactIndex}, event); returnToListView()"><img src="assets/img/delete.png"></div>`;
    }

    contactBigContainer.innerHTML += contactsBigHTML(contact);
}

function openAddTaskSiteWithContact(contactIndex) {
    window.open(`add_task.html?contactToAddIndex=${contactIndex}&user=${saveUrlVariable()}`, "_self");
}

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
                            ${contact.initials}
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



// von Gloria eingefügt

// Öffnet das Formular zum Hinzufügen eines neuen Kontakts
function openAddContactForm() {
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
                        <input class="contacts-user" type="text" id="add-name" placeholder="Name" required>
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

// Fügt einen neuen Kontakt zum contacts Array hinzu
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

    contacts.push(contact); // Hinzufügen des neuen Kontakts zum Array
    await setItem('contacts', JSON.stringify(contacts)); // Speichern des aktualisierten Arrays online
    console.log("Contact added");
    renderContactsList();
    closeOverlay(event);
    renderContactBig(contact);
}

// Öffnet das Formular zum Bearbeiten eines Kontakts
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
                    ${contact.initials}
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

// Schließt das Overlay, wenn außerhalb des Formulars geklickt wird
function closeOverlay() {
    const overlayContainer = document.getElementById('overlay-container');
    if (overlayContainer.parentElement === document.body) {
        document.body.removeChild(overlayContainer);
    }
}

// Bearbeitet einen Kontakt im contacts Array
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

// Löscht einen Kontakt aus dem "contacts"-Array, aktualisiert den Onlinespeicher und schließt das Overlay
async function deleteContact(contactIndex, event) {
    contacts.splice(contactIndex, 1);
    await setItem('contacts', JSON.stringify(contacts));
    renderContactsList();
    if (contacts.length > 0) {
        renderContactBig(contacts[0]);
    }
    if (event) closeOverlay(event);
}

// Die Funktion zum Zurückkehren zur Listenansicht
function returnToListView() {
    let contactBigContainer = document.getElementById('contactBigContainer');
    let contactList = document.getElementById('contactList');
    let kanbanboard = document.getElementById('kanbanboard-head');

    // Blendet den großen Kontakt-Container aus und die Kontaktliste ein, wenn die Fenstergröße kleiner als 1000px ist
    if (window.innerWidth < 1000) {
        contactBigContainer.classList.add('dnone');
        contactList.classList.remove('dnone');
        kanbanboard.classList.remove('dnone');
    }
}

window.addEventListener('resize', function() {
    let contactBigContainer = document.getElementById("contactBigContainer");
    let contactList = document.getElementById('contactList');
    let returnIcon = document.getElementById('return-icon');

    if (window.innerWidth < 1000) {
        // Stellt sicher, dass der große Kontakt-Container ausgeblendet ist, wenn das Fenster verkleinert wird
        contactBigContainer.classList.add('dnone');
        contactList.classList.remove('dnone');
    } else {
        // Stellt sicher, dass beide Elemente angezeigt werden, wenn das Fenster vergrößert wird
        contactBigContainer.classList.remove('dnone');
        contactList.classList.remove('dnone');
        if (returnIcon) {
            returnIcon.style.display = "none"; // Hide the icon when width is greater than 1000px
        }
    }
});
