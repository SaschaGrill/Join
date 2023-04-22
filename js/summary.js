window.onload = function() {
    greet();
    updateTaskCounts(toDoArray);
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
}

function goToBoard() {
    window.location.href = "board.html";
}

function getTaskCounts(toDoArray) {
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
    document.querySelector(".summary-content-left-top .onethirdbox:nth-child(1) .summary-content-big-number").textContent = taskCounts.todo;
    document.querySelector(".summary-content-left-top .onethirdbox:nth-child(2) .summary-content-big-number").textContent = taskCounts.inProgress;
    document.querySelector(".summary-content-left-top .onethirdbox:nth-child(3) .summary-content-big-number").textContent = taskCounts.awaitingFeedback;
    document.querySelector(".summary-content-left-bottom .fiftyfiftybox:nth-child(1) .summary-content-big-number").textContent = taskCounts.todo;
    document.querySelector(".summary-content-left-bottom .fiftyfiftybox:nth-child(2) .summary-content-big-number").textContent = taskCounts.done;
  }  
