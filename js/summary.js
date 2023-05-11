async function initSummary() {
    includeHTML();
    greet();
    await loadTasksOnline();
    const taskCounts = getTaskCounts();
    updateTaskCounts(taskCounts);
    const urgentAndDeadlineInfo = getUrgentAndUpcomingDeadline();
    updateUrgentAndUpcomingDeadline(urgentAndDeadlineInfo);
    saveUrlVariable();
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

function getMonthName(monthIndex) {
    const monthNames = [
        "January", "February", "March", "April", "May", "June",
        "July", "August", "September", "October", "November", "December"
    ];
    return monthNames[monthIndex];
}

function updateTaskCounts(taskCounts) {
    document.getElementById('to-do').innerText = taskCounts.openTasks;
    document.getElementById('done').innerText = taskCounts.closedTasks;
    document.getElementById('total').innerText = taskCounts.total;
    document.getElementById('in-progress').innerText = taskCounts.inProgress;
    document.getElementById('awaiting-feedback').innerText = taskCounts.awaitingFeedback;
}

function getUrgentAndUpcomingDeadline() {
    let urgentTasks = 0;
    let upcomingDeadline = null;

    for (let task of toDoArray) {
        if (task.priority === 'urgent') {
            urgentTasks++;
        }

        if (task.dueDate) {
            const taskDueDate = new Date(task.dueDate);
            if (upcomingDeadline === null || taskDueDate < upcomingDeadline) {
                upcomingDeadline = taskDueDate;
            }
        }
    }

    return {
        urgentTasks: urgentTasks,
        upcomingDeadline: upcomingDeadline
    };
}

function updateUrgentAndUpcomingDeadline(info) {
    document.getElementById('urgentTasks').innerText = info.urgentTasks;
    if (info.upcomingDeadline !== null) {
        const formattedDate = `${getMonthName(info.upcomingDeadline.getMonth())} ${info.upcomingDeadline.getDate()}, ${info.upcomingDeadline.getFullYear()}`;
        document.getElementById('upcomingDeadline').innerText = formattedDate;
    } else {
        document.getElementById('upcomingDeadline').innerText = 'No deadlines';
    }
}





