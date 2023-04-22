function initSummary() {
    includeHTML();
    greet();
    setCurrentDate();
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
    greetingElement.innerHTML = getGreeting();

    // Retrieve the user's name from localStorage
    const currentUser = JSON.parse(localStorage.getItem('currentUser'));
    if (currentUser) {
        const userElement = document.getElementById('user');
        userElement.innerHTML = currentUser.name;
    }
}

function goToBoard() {
    window.location.href = "board.html";
}

function getTaskCounts() {
    const toDoArray = window.toDoArray;

    let taskCounts = {
        todo: 0,
        inProgress: 0,
        awaitingFeedback: 0,
        done: 0
    };

    taskCounts.todo = toDoArray.filter(task => task.status === "to-do").length;
    taskCounts.inProgress = toDoArray.filter(task => task.status === "in-progress").length;
    taskCounts.awaitingFeedback = toDoArray.filter(task => task.status === "awaiting-feedback").length;
    taskCounts.done = toDoArray.filter(task => task.status === "done").length;

    return taskCounts;
}

function updateTaskCounts() {
    const taskCounts = getTaskCounts(toDoArray);

    document.querySelector(".summary-content-big-number[data-task='total']").textContent = toDoArray.length;
    document.querySelector(".summary-content-big-number[data-task='in-progress']").textContent = taskCounts.inProgress;
    document.querySelector(".summary-content-big-number[data-task='awaiting-feedback']").textContent = taskCounts.awaitingFeedback;
    document.querySelector(".summary-content-big-number[data-task='to-do']").textContent = taskCounts.todo;
    document.querySelector(".summary-content-big-number[data-task='done']").textContent = taskCounts.done;
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



