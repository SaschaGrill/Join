function getGreeting() {
    const currentHour = new Date().getHours();
    let greeting;

    if (currentHour >= 4 && currentHour < 11) {
        greeting = 'Good morning,';
    } else if (currentHour >= 11 && currentHour < 15) {
        greeting = 'Hello,';
    } else if (currentHour >= 15 && currentHour < 18) {
        greeting = 'Good afternoon,';
    } else {
        greeting = 'Good evening,';
    }

    return greeting;
}

function greet() {
    const greetingElement = document.getElementById('greeting');
    greetingElement.innerHTML = getGreeting();
}

function goToBoard() {
    window.location.href = "board.html";
}
