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

/**
 * Initializes the board by including HTML, loading contacts, adding a contact for every user, and rendering todos.
 */
async function initializeBoard() {
    includeHTML();
    await loadContacts();
    await addContactForEveryUser();
    saveUrlVariable();
    renderToDos();
}


/**
 * Initializes the big card for mobile by loading tasks online, including HTML, loading contacts, adding a contact for every user,
 * saving URL variables, and rendering the big card.
 */
async function initializeBigCardMobile() {
    await loadTasksOnline();
    includeHTML();
    await loadContacts();
    await addContactForEveryUser();
    saveUrlVariable();
    renderBigCardMobile(getBigCardIndexFromURL());
    document.getElementById("editButtonMobile").onclick = () => { openEditTaskMobile(getBigCardIndexFromURL()) };
}


/**
 * Retrieves the big card index from the URL query string.
 * 
 * @returns {string} - The big card index.
 */
function getBigCardIndexFromURL() {
    const queryString = window.location.search;
    const urlParams = new URLSearchParams(queryString);
    const user = urlParams.get('card_ind');
    return user;
}


/**
 * Renders the todos on the board based on a keyword.
 * 
 * @param {string} keyword - The keyword to filter todos.
 */
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


/**
 * Searches for todos based on a keyword entered in the search bar.
 */
function searchForKeyword() {
    let inputField = document.getElementById("searchbarInput");
    renderToDos(inputField.value);
}


/**
 * Clears the HTML content of the board.
 */
function emptyBoardHTML() {
    for (let i = 0; i < pinSpaceArray.length; i++) {
        document.getElementById(pinSpaceArray[i]).innerHTML = "";
    }
}


/**
 * Checks if the title or description of a card contains a keyword.
 * 
 * @param {number} cardIndex - The index of the card.
 * @param {string} keyword - The keyword to search for.
 * @returns {boolean} - True if the title or description contains the keyword, false otherwise.
 */
function nameOrDescriptionContainsKeyword(cardIndex, keyword) {
    let bool = false;
    let title = toDoArray[cardIndex].title.toLowerCase();
    let description = toDoArray[cardIndex].description.toLowerCase();

    if (title.includes(keyword) || description.includes(keyword))
        bool = true;

    return bool;
}


/**
 * Retrieves the counts of tasks based on their status.
 * 
 * @returns {Object} - An object containing the counts of tasks.
 */
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


/**
 * Retrieves the correct pin space element based on the task status.
 * 
 * @param {string} status - The status of the task.
 * @returns {HTMLElement} - The pin space element.
 */
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
            alert("not a valid status of toDo. Status: ", status);
            break;
    }
}


/**
 * Generates the HTML code for a small card representing a todo.
 * 
 * @param {Object} toDo - The todo object.
 * @param {number} index - The index of the todo.
 * @returns {string} - The HTML code for the small card.
 */
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
          ${contactsHTMLsmallCard(toDo, false)}
            <img src="assets/img/priority${capitalizeFirstLetter(toDo["priority"])}.png" alt="" class="small-card-priority">
        </div>
</div>
`;
}


/**
 * Prevents the default behavior of the dragover event.
 * 
 * @param {Event} ev - The dragover event object.
 */
function allowDrop(ev) {
    ev.preventDefault();
}


/**
 * Highlights the specified drop zone element.
 * 
 * @param {string} id - The ID of the drop zone element.
 */
function highlightDropZone(id) {
    document.getElementById(id).classList.add("dropzone-highlight");
}


/**
 * Removes the highlight from the specified drop zone element.
 * 
 * @param {string} id - The ID of the drop zone element.
 */
function highlightDropZoneEnd(id) {
    document.getElementById(id).classList.remove("dropzone-highlight");
}


/**
 * Sets the currently dragged card index.
 * 
 * @param {number} toDoIndexInArray - The index of the card being dragged.
 */
function startDragCard(toDoIndexInArray) {
    currentlyDraggedCardIndex = toDoIndexInArray;
}


/**
 * Ends the dragging of the card and updates its status.
 * 
 * @param {string} pinSpaceStatus - The status of the drop zone where the card is dropped.
 */
async function endDragCard(pinSpaceStatus) {
    if (currentlyDraggedCardIndex == -1) return;
    toDoArray[currentlyDraggedCardIndex].status = pinSpaceStatus;

    await saveTasksOnline();

    await renderToDos();
    currentlyDraggedCardIndex = -1;
}


/**
 * Opens the big card for the specified card index.
 * 
 * @param {number} cardIndex - The index of the card to open.
 */
function openBigCard(cardIndex) {
    if (!(window.innerWidth < 1000)) {
        document.getElementById("bigCardPopUp").innerHTML += bigCardHTML(cardIndex);
        showElement("Overlay");
        document.getElementById("boardContainer").classList.add("overflow-visible");
    } else {
        openBigCardMobile(cardIndex);
    }
}


/**
 * Closes the big card.
 */
function closeBigCard() {
    if (window.innerWidth > 1000) {
        document.getElementById("bigCardPopUp").innerHTML = "";
        hideElement("Overlay");
        document.getElementById("boardContainer").classList.remove("overflow-visible");
        renderToDos();
    } else {
        openBoard();
    }
}


/**
 * Generates the HTML code for the big card.
 * 
 * @param {number} cardIndex - The index of the card.
 * @returns {string} - The HTML code for the big card.
 */
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
             ${assignedToContentBigCardHTML(cardIndex)}
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



/**
 * Generates the HTML code for the assigned contacts in the big card.
 * 
 * @param {number} toDoIndex - The index of the to-do task.
 * @returns {string} - The HTML code for the assigned contacts.
 */
function assignedToContentBigCardHTML(toDoIndex) {
    let string = " <p class='bold'>Assigned To:</p>";
    for (let i = 0; i < toDoArray[toDoIndex].contactsInTask.length; i++) {
        string += bigCardContactHTML(toDoIndex, i);
    }
    return string;
}


/**
 * Generates the HTML code for a contact in the big card.
 * 
 * @param {number} toDoIndex - The index of the to-do task.
 * @param {number} contactIndex - The index of the contact.
 * @returns {string} - The HTML code for the contact.
 */
function bigCardContactHTML(toDoIndex, contactIndex) {
    let contact = toDoArray[toDoIndex].contactsInTask[contactIndex];
    return /*html*/`
    <div class="big-card-contact">
        ${contactCircleHTML(contact, false)}
        <p>${contact.firstName} ${contact.lastName}</p>
    </div>
    `;
}


/**
 * Generates the HTML code for the subtasks in the big card.
 * 
 * @param {number} cardIndex - The index of the card.
 * @returns {string} - The HTML code for the subtasks.
 */
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


/**
 * Returns the HTML code for the correct rectangle color based on subtask completion.
 * 
 * @param {number} cardIndex - The index of the card.
 * @param {number} subTaskIndex - The index of the subtask.
 * @returns {string} - The HTML code for the rectangle color.
 */
function getRightRectangleColor(cardIndex, subTaskIndex) {
    let done = toDoArray[cardIndex].subtasks[subTaskIndex].done;
    if (!done) return `<div class="rectangle"></div>`;
    else if (done) return `<div class="rectangle-done"></div>`;
}


/**
 * Deletes a subtask from a card.
 * 
 * @param {number} cardIndex - The index of the card.
 * @param {number} subTaskIndex - The index of the subtask.
 */
function deleteSubTask(cardIndex, subTaskIndex) {
    toDoArray[cardIndex].subtasks.splice(subTaskIndex, 1);
    openBigCard(cardIndex);
    saveTasksOnline();
}


/**
 * Marks a subtask as done.
 * 
 * @param {number} cardIndex - The index of the card.
 * @param {number} subTaskIndex - The index of the subtask.
 */
function checkSubTaskDone(cardIndex, subTaskIndex) {
    toDoArray[cardIndex].subtasks[subTaskIndex].done = true;
    openBigCard(cardIndex);
    saveTasksOnline();
}


/**
 * Marks a subtask as undone.
 * 
 * @param {number} cardIndex - The index of the card.
 * @param {number} subTaskIndex - The index of the subtask.
 */
function checkSubTaskUndone(cardIndex, subTaskIndex) {
    toDoArray[cardIndex].subtasks[subTaskIndex].done = false;
    openBigCard(cardIndex);
    saveTasksOnline();
}


/**
 * Renders the content of the big card for mobile view.
 * 
 * @param {number} cardIndex - The index of the card.
 */
function renderBigCardMobile(cardIndex) {
    let toDo = toDoArray[cardIndex];
    let title = document.getElementById("bigCardTitel");
    let description = document.getElementById("bigCardDescription");
    let dueDate = document.getElementById("bigCardDueDate");
    let prio = document.getElementById("bigCardPrio");
    let category = document.getElementById("bigCardCategoryMobile");
    let assignedToField = document.getElementById("assignedToFieldMobile");
    let subTaskField = document.getElementById("subTaskPreviewContainer_edit_mobile");

    title.innerHTML = toDo.title;
    description.innerHTML = toDo.description;
    dueDate.innerHTML = toDo.dueDate;
    prio.innerHTML = bigCardPrioHTMLMobile(cardIndex);
    category.innerHTML = capitalizeFirstLetter(toDo.category);
    category.style = `background-color: var(--${toDo.category}-color)`;
    assignedToField.innerHTML = assignedToContentBigCardHTML(cardIndex);
    subTaskField.innerHTML = bigCardSubTaskHTMLMobile(cardIndex);
}


/**
 * Generates the HTML code for the priority section in the big card for mobile view.
 * 
 * @param {number} cardIndex - The index of the card.
 * @returns {string} - The HTML code for the priority section.
 */
function bigCardPrioHTMLMobile(cardIndex) {
    let prio = toDoArray[cardIndex].priority;
    return /*html*/`
    <p class="bold">Priority:</p>
    <div class="prio-container-big-card dflex align-center pointer">
        ${capitalizeFirstLetter(prio)}
        <img src="assets/img/priority${prio}.png">
    </div>
    `;
}


/**
 * Generates the HTML code for the subtasks section in the big card for mobile view.
 * 
 * @param {number} cardIndex - The index of the card.
 * @returns {string} - The HTML code for the subtasks section.
 */
function bigCardSubTaskHTMLMobile(cardIndex) {
    return /*html*/`
    <p class="bold">Subtasks:</p>
        <br>
    ${subtaskBigCardHTML(cardIndex)}
    `;
}
