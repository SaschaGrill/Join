let contacts = [{
    firstName: "Anton",
    lastName: "Mayer",
    color: "var(--design-color)",
    initials: "AM",
    email: "antom@gmail.com",
    phone: "+49 1111 111 11 1",
},
{
    firstName: "Danny",
    lastName: "Simsek",
    color: "var(--sales-color)",
    initials: "DS",
    email: "simsek95@yahoo.de",
    phone: "+49 123141 11 1",
}]

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
    await addContactForEveryUser();
    renderContactsList();
    saveUrlVariable();
    renderContactBig(contacts[0]);
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
    for (let i = 0; i < alphabet.length; i++) {
        const letter = alphabet[i];
        let contactsIncludingLetter = [];
        for (let j = 0; j < contacts.length; j++) {
            if (contacts[j].firstName[0].toLowerCase() == letter)
                contactsIncludingLetter.push(contacts[j]);
        }

        let contactList = document.getElementById("contact-list");

        if (contactsIncludingLetter.length > 0)
            contactList.innerHTML += contactListLetterHTML(letter.toUpperCase());

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
    <div class="contact" onclick="renderContactBig(contacts[${contactIndex}])">
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
    window.open(`add_task.html?contactToAddIndex=${contactIndex}`, "_self");
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
                        <span class="edit-task-contact"><img src="assets/img/pen_black.png" alt="">Edit Contact</span>
                    </div>

                    <div class="dflex-col gap10 padding-bt10">
                        <span class="bold">
                        Email
                        </span>
                        <span class="contact-list-mail pointer">
                        ${contact.email}
                        </span>
                    </div>

                    <div class="dflex-col gap10 padding-bt10">
                        <span class="bold">
                        Phone
                        </span>
                        <span>
                        ${contact.phone}
                        </span>
                    </div>

                    <div class="new-contact-button">
                        <button id="new-contact-button">New contact
                            <img src="assets/img/newContact.svg" alt="">
                        </button>
                    </div>
    `;
}


