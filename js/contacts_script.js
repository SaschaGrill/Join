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

async function addContactForEveryUser() {
    await loadUsers();
    console.log("load Users");
    for (let i = 0; i < users.length; i++) {
        const user = users[i];
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
    document.getElementById("contactBigContainer").innerHTML = "";
    document.getElementById("contactBigContainer").innerHTML += contactsBigHTML(contact);
}

function openAddTaskSiteWithContact(contactIndex) {
    window.open(`add_task.html?contactToAddIndex=${contactIndex}&user=${saveUrlVariable()}`, "_self");
}

function contactsBigHTML(contact) {
    let contactIndex = contacts.indexOf(contact);
    return /*html*/`
    <div class="contacts-header">
                        <h1 class="headlines">Contacts</h1>
                        <p class="contacts-headline-line"></p>
                        <p>Better with a team</p>
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
                            <img src="assets/img/pen_black.png" alt="">Edit Contact
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

                    <div class="new-contact-button">
                        <button id="new-contact-button" onclick="openAddContactForm()">New contact
                            <img src="assets/img/newContact.svg" alt="">
                        </button>
                    </div>
    `;
}

// von Gloria eingefügt

// Öffnet das Formular zum Hinzufügen eines neuen Kontakts
function openAddContactForm() {
    const formHTML = `
    <div class="overlay-contacts" onclick="closeOverlay(event)">
        <div class="overlay-contact-form">
            <div class="newContactLeft">
                <img src="assets/img/joinlogobright.svg">
                <h1>Add Contact</h1>
                <p>Tasks are better with a team!</p>
            </div>
            <div class="newContactRight">
                <div class="newContactImg">
                    <img src="assets/img/newContactGrey.svg">
                </div>
                <div class="newContactInput">    
                    <input type="text" id="add-name" placeholder="Name">
                    <input type="email" id="add-email" placeholder="Email">
                    <input type="text" id="add-phone" placeholder="Phone">
                    <div class="addContactButtons">
                        <button class="cancel" onclick="closeOverlay(event)">Cancel<img src="assets/img/cancel.svg"></button>
                        <button class="createContact" onclick="addNewContact()">Create Contact<img src="assets/img/apply.svg"</button>
                    </div>
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
async function addNewContact() {
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
}

// Öffnet das Formular zum Bearbeiten eines Kontakts
function openEditContactForm(contact) {
    const contactIndex = contacts.indexOf(contact);
    const formHTML = `
        <div class="overlay-contacts" onclick="closeOverlay(event)">
            <div class="overlay-contact-form">    
                <div class="editContactLeft">
                    <img src="assets/img/joinlogobright.svg">
                    <h1>Edit Contact</h1>
                    <p>Tasks are better with a team!</p>
                </div>
                <div class="editContactRight">
                    <div class="contacts-big-circle margin-right" style="background-color: ${contact.color}">
                    ${contact.initials}
                </div>
                <div class="editContactInput"> 
                    <input type="text" id="edit-name" value="${contact.firstName} ${contact.lastName}" placeholder="Name">
                    <input type="email" id="edit-email" value="${contact.email}" placeholder="Email">
                    <input type="text" id="edit-phone" value="${contact.phone}" placeholder="Phone">
                    <div class="addContactButtons">
                        <button class="delete" onclick="delete()">Delete</button>
                        <button class="save" onclick="editContact(${contactIndex})">Save</button>
                    </div>
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
function closeOverlay(event) {
    if (event.target.matches('.overlay-contacts')) {
        const overlayContainer = document.getElementById('overlay-container');
        document.body.removeChild(overlayContainer);
    }
}

// Bearbeitet einen Kontakt im contacts Array
function editContact(contactIndex) {
    const name = document.getElementById('edit-name').value;
    const [firstName, lastName] = firstAndLastNameAsArray(name);
    const email = document.getElementById('edit-email').value;
    const phone = document.getElementById('edit-phone').value;

    contacts[contactIndex].firstName = firstName;
    contacts[contactIndex].lastName = lastName;
    contacts[contactIndex].initials = getInitials(firstName, lastName);
    contacts[contactIndex].email = email;
}