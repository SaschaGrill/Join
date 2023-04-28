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
        console.log(user);
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
// von Gloria eingefügt

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


