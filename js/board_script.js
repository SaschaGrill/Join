let toDoArray = [{
    category: "design",
    title: "Website redesign",
    description: "Modify the contents of the main website...",
    subtasks: [
        { title: "testSubTask1", done: true },
        { title: "testSubTask2", done: false },
        { title: "testSubTask2", done: false }],
    priority: "low",
    contactsInTask: [contacts[0]],
    status: "to-do",
    dueDate: "",
},
{
    category: "sales",
    title: "Call potential clients",
    description: "Make the product presentation to prospective buyers",
    subtasks: [],
    priority: "urgent",
    contactsInTask: [contacts[0], contacts[1]],
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
    contactsInTask: [contacts[0]],
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

let currentlyDraggedCardIndex = null;

async function initializeBoard() {
    includeHTML();
    renderToDos();
    await addContactForEveryUser();
    saveUrlVariable();
}

async function renderToDos(keyword = "") {
    await loadTasksOnline();
    emptyBoardHTML();

    for (let i = 0; i < toDoArray.length; i++) {
        const toDo = toDoArray[i];
        let pinSpaceToUse = getRightPinSpace(toDo["status"], i);

        if (nameOrDescriptionContainsKeyword(i, keyword.toLowerCase()))
            pinSpaceToUse.innerHTML += smallCardHTML(toDo, i);
    }
}

function searchForKeyword() {
    let inputField = document.getElementById("searchbarInput");
    renderToDos(inputField.value);
}

function emptyBoardHTML() {
    for (let i = 0; i < pinSpaceArray.length; i++) {
        document.getElementById(pinSpaceArray[i]).innerHTML = "";
    }
}

function nameOrDescriptionContainsKeyword(cardIndex, keyword) {
    let bool = false;
    let title = toDoArray[cardIndex].title.toLowerCase();
    let description = toDoArray[cardIndex].description.toLowerCase();

    if (title.includes(keyword) || description.includes(keyword))
        bool = true;

    return bool;
}

function getTaskCounts() {
    let openTasks = 0;
    let closedTasks = 0;
    let inProgressTasks = 0;
    let awaitingFeedbackTasks = 0;

    for (let task of toDoArray) {
        if (task.status === 'to-do') {
            openTasks++;
        } else if (task.status === 'done') {
            closedTasks++;
        } else if (task.status === 'in-progress') {
            inProgressTasks++;
        } else if (task.status === 'awaiting-feedback') {
            awaitingFeedbackTasks++;
        }
    }

    return {
        openTasks: openTasks,
        closedTasks: closedTasks,
        inProgress: inProgressTasks,
        awaitingFeedback: awaitingFeedbackTasks,
        total: openTasks + closedTasks + inProgressTasks + awaitingFeedbackTasks
    };
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

function smallCardHTML(toDo, index) {
    return /*html*/`
<div class="small-card pointer" onclick="openBigCard(${index})" draggable="true" ondragstart="startDragCard(${index})">
        <span class="small-card-category" style="background-color: var(--${toDo["category"]}-color)"> ${toDo["category"]}</span>
        <h4>${toDo["title"]}</h4>
        <p class="small-card-description"> 
        ${toDo["description"]}
        </p>
        ${subtaskHTML(toDo)}
        <div class="small-card-bottom">
          ${contacsHTML(toDo)} 
            <img src="assets/img/priority${toDo["priority"]}.png" alt="" class="small-card-priority">
        </div>
</div>
`
}

function allowDrop(ev) {
    ev.preventDefault();
}

function highlightDropZone(id) {
    document.getElementById(id).classList.add("dropzone-highlight");
}

function highlightDropZoneEnd(id) {
    document.getElementById(id).classList.remove("dropzone-highlight");
}

function startDragCard(toDoIndexInArray) {
    currentlyDraggedCardIndex = toDoIndexInArray;
}

async function endDragCard(pinSpaceStatus) {
    if (currentlyDraggedCardIndex == -1) return;
    toDoArray[currentlyDraggedCardIndex].status = pinSpaceStatus;

    await saveTasksOnline();

    await renderToDos();
    currentlyDraggedCardIndex = -1;
}

function openBigCard(cardIndex) {
    document.getElementById("bigCardPopUp").innerHTML += bigCardHTML(cardIndex);
    showElement("Overlay");
    document.getElementById("boardContainer").classList.add("overflow-visible");
}

function closeBigCard() {
    document.getElementById("bigCardPopUp").innerHTML = "";
    hideElement("Overlay");
    document.getElementById("boardContainer").classList.remove("overflow-visible");
    renderToDos();
}

function bigCardHTML(cardIndex) {
    return /*html*/`
    <div class="big-card-Container">
        <button class="big-card-close-button pointer" onclick="closeBigCard()"> <img src="assets/img/cross.png" alt="">
        </button>
        <h1 class="headlines">${toDoArray[cardIndex]["title"]}</h1>
        <p>${toDoArray[cardIndex]["description"]}</p>
        <div class="dflex align-center gap20">
           <p class="bold">Due date:</p>
           <p>${toDoArray[cardIndex]["dueDate"]}</p>
        </div>

        <div  class=" dflex align-center gap20">
            <p class="bold">Priority:</p>
            <div class="prio-container dflex align-center pointer">
                ${capitalizeFirstLetter(toDoArray[cardIndex]["priority"])} 
                <img src="assets/img/priority${toDoArray[cardIndex]["priority"]}.png">
            </div>
        </div>
        
        <div  class="assigned-to-field">
            <p class="bold">Assigned To:</p>
             ${assignedToContentBigCard(toDoArray[cardIndex].contactsInTask)}
        </div>

        <div >
            <p class="bold">Subtasks:</p>
            <br>
            ${subtaskBigCardHTML(cardIndex)} 
        </div >
       
        <div class="big-card-button-container">
          <button class="pointer"><img src="assets/img/delete.png" alt="" onclick="deleteToDo(${cardIndex})"></button>
          <button class="pointer"><img src="assets/img/pen.png" alt="" onclick="openEditTaskPopUp(${cardIndex})"></button>
        </div>
    </div >
    `;
}

function assignedToContentBigCard(contacts) {
    let string = "";
    for (let i = 0; i < contacts.length; i++) {
        string += contactCircleHTML(contacts[i]);
    }
    return string;
}

// function assignedToItemHTML(contact) {
//     return /*html*/`
//     <div class="assigned-to-item" >
//         <div class="card-member" style="background-color: ${contact.color}">${contact.initials}</div>
//                 ${contact.firstName} ${contact.lastName}
//             </div >
//     `;
// }

function subtaskBigCardHTML(cardIndex) {
    let subtasks = toDoArray[cardIndex].subtasks;
    let string = "";

    for (let i = 0; i < subtasks.length; i++) {
        string += /*html*/`
        <div class="dflex align-center gap10" >
        ${getRightRectangleColor(cardIndex, i)}
        ${subtasks[i].title}
        <img src="assets/img/cross.png" alt="" class="subTask-delete-button" id="subTaskDelete_${i}" onclick="checkSubTaskUndone(${cardIndex}, ${i})">
        <img src="assets/img/doneFullcolorInverted.png" alt="" class="subTask-done-button" id="subTaskDone_${i}" onclick="checkSubTaskDone(${cardIndex}, ${i})">
        </div > `;
    }

    return string;
}

function getRightRectangleColor(cardIndex, subTaskIndex) {
    let done = toDoArray[cardIndex].subtasks[subTaskIndex].done;
    if (!done) return `<div class="rectangle"></div>`;
    else if (done) return `<div class="rectangle-done"></div>`
}
// onclick="deleteSubTask(${cardIndex}, ${i})"

function deleteSubTask(cardIndex, subTaskIndex) {
    toDoArray[cardIndex].subtasks.splice(subTaskIndex, 1);
    openBigCard(cardIndex);
    saveTasksOnline();
}

function checkSubTaskDone(cardIndex, subTaskIndex) {
    toDoArray[cardIndex].subtasks[subTaskIndex].done = true;
    openBigCard(cardIndex);
    saveTasksOnline();
}

function checkSubTaskUndone(cardIndex, subTaskIndex) {
    toDoArray[cardIndex].subtasks[subTaskIndex].done = false;
    openBigCard(cardIndex);
    saveTasksOnline();
}



