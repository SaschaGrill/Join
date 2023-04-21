let toDoArray = [{
    category: "design",
    title: "Website redesign",
    description: "Modify the contents of the main website...",
    subtasks: [
        { title: "testSubTask1", done: true },
        { title: "testSubTask2", done: false },
        { title: "testSubTask2", done: false }],
    priority: "low",
    members: ["Gloria", "Sascha", "Danny"],
    status: "to-do",
    dueDate: "",
},
{
    category: "sales",
    title: "Call potential clients",
    description: "Make the product presentation to prospective buyers",
    subtasks: [],
    priority: "urgent",
    members: ["Gloria", "Sascha"],
    status: "in-progress",
    dueDate: "",
},
{
    category: "backoffice",
    title: "Accounting invoices",
    description: "Write open invoices for customer",
    subtasks: [
        { title: "testSubTask1", done: true },
        { title: "testSubTask2", done: true },
        { title: "testSubTask2", done: false }],
    priority: "medium",
    members: ["Gloria", "Sascha"],
    status: "awaiting-feedback",
    dueDate: "",
}
]

let pinSpaceArray = [
    "pinSpace-ToDo",
    "pinSpace-InProgress",
    "pinSpace-AwaitingFeedback",
    "pinSpace-Done"
]

function initializeBoard() {
    includeHTML();
    renderToDos();
}

function renderToDos() {
    for (let i = 0; i < pinSpaceArray.length; i++) {
        const element = pinSpaceArray[i];
        document.getElementById(pinSpaceArray[i]).innerHTML = "";
    }

    for (let i = 0; i < toDoArray.length; i++) {
        const toDo = toDoArray[i];
        let pinSpaceToUse = getRightPinSpace(toDo["status"]);
        pinSpaceToUse.innerHTML += smallCardHTML(toDo);
    }
}

function getRightPinSpace(status) {
    let pinSpace_ToDo = document.getElementById("pinSpace-ToDo");
    let pinSpace_InProgress = document.getElementById("pinSpace-InProgress");
    let pinSpace_AwaitingFeedback = document.getElementById("pinSpace-AwaitingFeedback");
    let pinSpace_Done = document.getElementById("pinSpace-Done");

    switch (status) {
        case "to-do":
            return pinSpace_ToDo;

        case "in-progress":
            return pinSpace_InProgress;

        case "awaiting-feedback":
            return pinSpace_AwaitingFeedback;

        case "done":
            return pinSpace_Done;

        default:
            alert("not a valid status of toDo. Status: ", status)
            break;



    }
}

function smallCardHTML(toDo) {
    return /*html*/`
<div class="small-card pointer">
        <span class="small-card-category" style="background-color: var(--${toDo["category"]}-color)"> ${toDo["category"]}</span>
        <h4>${toDo["title"]}</h4>
        <p class="small-card-description"> 
        ${toDo["description"]}
        </p>
        ${subtaskHTML(toDo)}
        <div class="small-card-bottom">
          ${membersHTML(toDo)} 
            <img src="assets/img/priority${toDo["priority"]}.png" alt="" class="small-card-priority">
        </div>
</div>
`
}

function subtaskHTML(toDo) {
    let totalTaskCount = toDo["subtasks"].length;
    let finishedTasks = getFinishedTaskCount(toDo["subtasks"]);

    if (totalTaskCount != 0) {

        return /*html*/`
        <div class="progress-bar">
           <div class="bar-with-fill">
            <div class="fill" style="transform: scaleX(${calculateFillPercentage(toDo["subtasks"])}%);"></div>
           </div>
           <p>${finishedTasks}/${totalTaskCount} Done</p>
        </div>`
    }
    else return "";
}

function getFinishedTaskCount(subTaskArray) {
    let finishedTasks = 0;
    for (let i = 0; i < subTaskArray.length; i++) {
        const subTask = subTaskArray[i];
        if (subTask["done"]) finishedTasks++;
    }
    return finishedTasks;
}

function calculateFillPercentage(subTaskArray) {
    let totalTaskCount = subTaskArray.length;
    let finishedTasks = getFinishedTaskCount(subTaskArray);

    let percentage = (finishedTasks / totalTaskCount);
    return percentage * 100;
}

function membersHTML(toDo) {
    let members = toDo["members"];
    let string = "";
    for (let i = 0; i < members.length; i++) {
        let member = members[i];
        string += `<div class="card-member">${member[0]}</div>`
    }

    return /*html*/`
     <div class="small-card-members-container">
        ${string}
    </div>
    `
}

function openAddTaskMenu() {
    showElement("addTaskPopUp");
    showElement("addTaskOverlay");
}

function closeAddTaskMenu() {
    hideElement("addTaskPopUp");
    hideElement("addTaskOverlay");
}

function addTask() {
    let titleInput = document.getElementById("addTaskTitle");
    let descriptionInput = document.getElementById("addTaskDescription");
    let categoryInput = document.getElementById("addTaskCategory");

    let JSON = {
        category: categoryInput.value.toLowerCase(),
        title: titleInput.value,
        description: descriptionInput.value,
        subtasks: [],
        priority: "urgent",
        members: ["Gloria", "Sascha"],
        status: "to-do",
        dueDate: "",
    }

    toDoArray.push(JSON);
    console.log(toDoArray);
    closeAddTaskMenu();
    renderToDos();
}

function addTaskTest() {
    let titleInput = document.getElementById("addTaskTitle");
    let descriptionInput = document.getElementById("addTaskDescription");
    let categoryInput = document.getElementById("addTaskCategory");

    let JSON = {
        category: "sales",
        title: "TESTEST",
        description: "DAS IST EIN TEST",
        subtasks: [],
        priority: "urgent",
        members: ["Gloria", "Sascha"],
        status: "to-do",
        dueDate: "",
    }

    toDoArray.push(JSON);
    console.log(toDoArray);
    closeAddTaskMenu();
    renderToDos();
}