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
