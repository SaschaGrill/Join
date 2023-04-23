function initSummary() {
    includeHTML();
    greet();
    setCurrentDate();
    // updateTaskCounts(window.toDoArray);
}

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
    let currentUser = window.location.search.split('=')[1];
    greetingElement.innerHTML = getGreeting();
    let greetUser = document.getElementById('user');
    greetUser.innerHTML = currentUser;
}

function goToBoard() {
    window.location.href = "board.html";
}

function getMonthName(monthIndex) {
    const monthNames = [
        "January", "February", "March", "April", "May", "June",
        "July", "August", "September", "October", "November", "December"
    ];
    return monthNames[monthIndex];
}

function setCurrentDate() {
    const date = new Date();

    let day = date.getDate();
    let month = getMonthName(date.getMonth());
    let year = date.getFullYear();

    let fullDate = `${month} ${day}, ${year}`;
    document.getElementById('currentDate').innerHTML = fullDate;
}

// muss Fall noch abfangen, falls keine Deadline



