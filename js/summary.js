async function initSummary() {
    includeHTML();
    greet();
    setCurrentDate();
    await loadTasksOnline(); // Laden der Aufgaben
    updateTaskCounts(toDoArray); // Aktualisieren der Anzeige der Aufgabenanzahl
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
    let currentUser = decodeURIComponent(window.location.search.split('=')[1]);
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

function updateTaskCounts(toDoArray) {
    let total = 0;
    let inProgress = 0;
    let awaitingFeedback = 0;
    let toDo = 0;
    let done = 0;

    for (let task of toDoArray) {
        total++;
        if (task.status === 'in-progress') {
            inProgress++;
        } else if (task.status === 'awaiting-feedback') {
            awaitingFeedback++;
        } else if (task.status === 'to-do') {
            toDo++;
        } else if (task.status === 'done') {
            done++;
        }
    }

    document.getElementById('total').innerText = total;
    document.getElementById('in-progress').innerText = inProgress;
    document.getElementById('awaiting-feedback').innerText = awaitingFeedback;
    document.getElementById('to-do').innerText = toDo;
    document.getElementById('done').innerText = done;
}


