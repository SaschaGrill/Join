let contactsToAdd = [];
let subTasksToAdd = [];
let priorityToAdd = "low";
let priorityToEdit = "low";



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

function contacsHTML(toDo) {
    let members = toDo["contactsInTask"];
    let string = "";
    for (let i = 0; i < members.length; i++) {
        let member = members[i];
        string += `<div class="card-member" style="background-color:${member["color"]}">${member["initials"]}</div>`
    }

    return /*html*/`
     <div class="small-card-members-container">
        ${string}
    </div>
    `
}

function openAddTaskMenu() {
    showElement("addTaskPopUp");
    showElement("Overlay");
    updateAddTaskMemberSelection();
    document.getElementById("boardContainer").classList.add("overflow-visible");
}

function closeAddTaskMenu() {
    hideElement("addTaskPopUp");
    hideElement("Overlay");
    document.getElementById("boardContainer").classList.remove("overflow-visible");
}

function updateAddTaskMemberSelection() {
    let selection = document.getElementById("addTaskSelection");
    selection.innerHTML = "";
    selection.innerHTML += `<option value="-1">Select contacts to assign </option>`;

    for (let i = 0; i < contacts.length; i++) {
        const member = contacts[i];
        selection.innerHTML += addMemberHTML(i);
    }
}

function addMemberHTML(index) {
    return /*html*/`
    <option value="${index}">${contacts[index]['firstName']}</option>
    `;
}

async function addTask() {
    let titleInput = document.getElementById("addTaskTitle");
    let descriptionInput = document.getElementById("addTaskDescription");
    let categoryInput = document.getElementById("addTaskCategory");

    let JSON = {
        category: categoryInput.value.toLowerCase(),
        title: titleInput.value,
        description: descriptionInput.value,
        subtasks: subTasksToAdd,
        priority: priorityToAdd,
        contactsInTask: contactsToAdd,
        status: "to-do",
        dueDate: "",
    }

    toDoArray.push(JSON);
    closeAddTaskMenu();
    await saveTasksOnline();
    renderToDos();

}

async function saveTasksOnline() {
    await setItem("taskArray", JSON.stringify(toDoArray));
}

async function loadTasksOnline() {
    toDoArray = JSON.parse(await getItem("taskArray"));
}

function addMemberToTask() {
    let inputField = document.getElementById("addTaskSelection");
    let memberIndex = inputField.value;
    if (memberIndex == -1) return;
    if (contactsToAdd.includes(contacts[memberIndex])) return;

    contactsToAdd.push(contacts[memberIndex]);
    let circleHTML = memberCircleHTML(contacts[memberIndex]);
    let membersDiv = document.getElementById("addTaskAssignedMembers");


    membersDiv.innerHTML += circleHTML;
}

function memberCircleHTML(contact) {
    return `<div class="card-member" style="background-color:${contact["color"]}">${contact["initials"]}</div>`
}

function addSubTask() {
    let addSubTaskInputField = document.getElementById("subTaskInput");
    let subTaskToAdd = { title: addSubTaskInputField.value, done: false };
    subTasksToAdd.push(subTaskToAdd);


    let subTaskPreviewContainer = document.getElementById("subTaskPreviewContainer");
    subTaskPreviewContainer.innerHTML += subTaskPreviewHTML(addSubTaskInputField.value);

    addSubTaskInputField.value = "";
}

function subTaskPreviewHTML(subTaskName) {
    return/*html*/`
    <div class="dflex align-center">
        <div class="rectangle"></div>
        ${subTaskName}
    </div>`
}

function selectPrio(prio) {
    let currentSelectedPrio = document.getElementById(`prioButton_${priorityToAdd}`);
    let prioButton = document.getElementById(`prioButton_${prio}`);

    currentSelectedPrio.classList.remove("selected-prio-container");
    prioButton.classList.add("selected-prio-container")

    priorityToAdd = prio;
}

function selectPrioInEdit(prio) {
    let currentSelectedPrio = document.getElementById(`prioButton_${priorityToEdit}_edit`);
    let prioButton = document.getElementById(`prioButton_${prio}_edit`);

    currentSelectedPrio.classList.remove("selected-prio-container");
    prioButton.classList.add("selected-prio-container")

    priorityToEdit = prio;
}

// EDIT TASK!!

function addedMembersHTML(toDoIndex) {
    let string = "";
    for (let i = 0; i < toDoArray[toDoIndex].contactsInTask.length; i++) {
        string += memberCircleHTML(toDoArray[toDoIndex].contactsInTask[i]);
    }

    return string;
}

function addedSubTasksHTML(toDoIndex) {
    let string = "";
    for (let i = 0; i < toDoArray[toDoIndex].subtasks.length; i++) {
        string += subTaskPreviewHTML(toDoArray[toDoIndex].subtasks[i].title);
    }

    return string;
}

function highlightChosenPrio(toDoIndex) {
    let prio = toDoArray[toDoIndex].priority;
    priorityToEdit = prio;
    document.getElementById(`prioButton_${prio}_edit`).classList.add("selected-prio-container");
}