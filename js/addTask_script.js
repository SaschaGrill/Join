let contactsToAdd = [];
let subTasksToAdd = [];

let contactsToEdit = [];
let subTasksToEdit = [];

let priorityToAdd = "low";
let priorityToEdit = "low";

let currentChoosenCategoryToEdit = document.getElementById("category_edit_0");


/**
 * Initializes the add task site.
 */
async function initializeAddTaskSite() {
    includeHTML();
    await loadContacts();
    await addContactForEveryUser();
    updateAddTaskMemberSelection("addTaskSite");
    userFromURL()
    if (getUserToAddFromURL() == null) console.log("null");

    if (getUserToAddFromURL() != -1)
        addMemberToTaskWithIndex(getUserToAddFromURL());

    setTimeout(setNavBarLinks(), 200);
    setMinimumDateForInputFields();
}


/**
 * Retrieves the user index to add from the URL query string.
 *
 * @returns {number|null} - The user index to add or null if not found.
 */
function getUserToAddFromURL() {
    const queryString = window.location.search;
    const urlParams = new URLSearchParams(queryString);
    const userIndex = urlParams.get('contactToAddIndex');
    return Number(userIndex);
}


/**
 * Generates the HTML code for the subtask section in a small card.
 *
 * @param {object} toDo - The to-do object.
 * @returns {string} - The HTML code for the subtask section.
 */
function subtaskHTML(toDo) {
    let totalTaskCount = toDo["subtasks"].length;
    let finishedTasks = getFinishedTaskCount(toDo["subtasks"]);

    if (totalTaskCount !== 0) {
        return /*html*/ `
        <div class="progress-bar">
            <div class="bar-with-fill">
                <div class="fill" style="transform: scaleX(${calculateFillPercentage(toDo["subtasks"])}%);"></div>
            </div>
            <p>${finishedTasks}/${totalTaskCount} Done</p>
        </div>`;
    } else {
        return "";
    }
}


/**
 * Returns the number of finished tasks in a subtask array.
 *
 * @param {Array} subTaskArray - The subtask array.
 * @returns {number} - The number of finished tasks.
 */
function getFinishedTaskCount(subTaskArray) {
    let finishedTasks = 0;
    for (let i = 0; i < subTaskArray.length; i++) {
        const subTask = subTaskArray[i];
        if (subTask["done"]) {
            finishedTasks++;
        }
    }
    return finishedTasks;
}


/**
 * Calculates the fill percentage for the subtask progress bar.
 *
 * @param {Array} subTaskArray - The subtask array.
 * @returns {number} - The fill percentage.
 */
function calculateFillPercentage(subTaskArray) {
    let totalTaskCount = subTaskArray.length;
    let finishedTasks = getFinishedTaskCount(subTaskArray);

    let percentage = (finishedTasks / totalTaskCount);
    return percentage * 100;
}


/**
 * Generates the HTML code for the contacts section in a small card.
 *
 * @param {object} toDo - The to-do object.
 * @param {boolean} deletable - Indicates if the contacts are deletable.
 * @returns {string} - The HTML code for the contacts section.
 */
function contactsHTMLsmallCard(toDo, deletable = true) {
    let members = toDo["contactsInTask"];
    let string = "";
    for (let i = 0; i < members.length; i++) {
        let member = members[i];
        if (member == null) return "";
        string += contactCircleHTML(member, deletable);
    }

    return /*html*/ `
    <div class="small-card-members-container">
        ${string}
    </div>`;
}


/**
 * Generates the HTML code for the contact circle in a small card.
 *
 * @param {object} member - The member object.
 * @param {boolean} deletable - Indicates if the contact is deletable.
 * @param {boolean} edit - Indicates if it's an edit mode.
 * @returns {string} - The HTML code for the contact circle.
 */
function contactCircleHTML(member, deletable = true, edit = false) {
    let colorID = getRandomColor();
    let idToAdd = `${member.initials}_${colorID}`;
    if (deletable) {
        return /*html*/ `
        <div class="pos-rel" id="${idToAdd}" onclick="removeContact('${member.firstName}', '${member.lastName}', ${edit}, '${idToAdd}')">
            <span class="delete-btn-member">X</span>
            <div class="card-member" style="background-color:${member["color"]}">${member["initials"][0]}${member["initials"][1]}</div>
        </div>`;
    } else {
        return /*html*/ `
        <div class="pos-rel" id="${idToAdd}">
            <div class="card-member" style="background-color:${member["color"]}">${member["initials"][0]}${member["initials"][1]}</div>
        </div>`;
    }
}


/**
 * Removes a contact from the contactsToAdd or contactsToEdit array.
 *
 * @param {string} firstName - The first name of the contact to remove.
 * @param {string} lastName - The last name of the contact to remove.
 * @param {boolean} edit - Indicates if it's an edit mode.
 * @param {string} id - The ID of the HTML element to remove.
 */
function removeContact(firstName, lastName, edit = false, id) {
    let contactArray = edit ? contactsToEdit : contactsToAdd;
    for (let i = 0; i < contactArray.length; i++) {
        if (contactArray[i].firstName === firstName && contactArray[i].lastName === lastName) {
            contactArray.splice(i, 1);
            break;
        }
    }
    document.getElementById(id).remove();
}


/**
 * Opens the add task menu.
 *
 * @param {string} status - The status of the task.
 */
function openAddTaskMenu(status = "to-do") {
    contactsToAdd = [];

    setMinimumDateForInputFields();
    if (!(window.innerWidth < 1000)) {
        showElement("addTaskPopUp");
        showElement("Overlay");
        updateAddTaskMemberSelection("popUp");
        document.getElementById("boardContainer").classList.add("overflow-visible");
        document.getElementById("addTaskButton_popUp").onclick = function () { addTaskFromPopUp(status) };
    } else {
        // Open AddTaskPage when width is less than 1200px
        let URL = `add_task.html?contactToAddIndex=-1&user=${userFromURL()}`;
        window.open(URL, "_self");
    }
}


/**
 * Closes the add task menu.
 */
function closeAddTaskMenu() {
    hideElement("addTaskPopUp");
    hideElement("Overlay");
    document.getElementById("boardContainer").classList.remove("overflow-visible");
}


/**
 * Updates the member selection in the add task menu.
 *
 * @param {string} openedFromString - The source from where the menu was opened.
 */
function updateAddTaskMemberSelection(openedFromString) {
    let selection;

    if (openedFromString === "popUp") selection = document.getElementById("addTaskSelection_popUp");
    else if (openedFromString === "addTaskSite") selection = document.getElementById("addTaskSelection_site");
    else if (openedFromString === "editTask") selection = document.getElementById("addTaskSelection_edit");
    else if (openedFromString === "editTaskMobile") selection = document.getElementById("addTaskSelection_edit_mobile");
    else console.log(openedFromString);

    selection.innerHTML = `<option value = "-1"> Select contacts to assign</option >`;

    for (let i = 0; i < contacts.length; i++) selection.innerHTML += addMemberHTML(i);
}


/**
 * Generates the HTML code for a member option in the member selection.
 *
 * @param {number} index - The index of the contact.
 * @returns {string} - The HTML code for the member option.
 */
function addMemberHTML(index) {
    return /*html*/ `
        <option value = "${index}" > ${contacts[index]['firstName']}</option>
        `;
}


function addTaskFieldsAreFilled(source = "popUp") {
    let titleInput = document.getElementById("addTaskTitle");
    let descriptionInput = document.getElementById("addTaskDescription");
    let categoryInput = document.getElementById("addTaskCategory");
    let dateInput = (source == "popUp") ? document.getElementById("dueDateInput_addTaskPopUp") : document.getElementById("dueDateInput_addTaskSite");

    return !(titleInput.value == "" ||
        descriptionInput.value == "" ||
        categoryInput.value == "0" ||
        dateInput.value == "");

}

/**
 * Adds a task from the pop-up menu.
 *
 * @param {string} status - The status of the task.
 */
async function addTaskFromPopUp(status = "to-do") {
    let titleInput = document.getElementById("addTaskTitle");
    let descriptionInput = document.getElementById("addTaskDescription");
    let categoryInput = document.getElementById("addTaskCategory");
    let dateInput = document.getElementById("dueDateInput_addTaskPopUp");

    if (!addTaskFieldsAreFilled("popUp")) {
        return;
    }

    let JSON = {
        category: categoryInput.value.toLowerCase(),
        title: titleInput.value,
        description: descriptionInput.value,
        subtasks: subTasksToAdd,
        priority: priorityToAdd,
        contactsInTask: contactsToAdd,
        status: status,
        dueDate: dateInput.value,
    }

    toDoArray.push(JSON);

    closeAddTaskMenu();
    await saveTasksOnline();
    renderToDos();

    emptyPopUpInputs();
    await confirmAddTask();
}


/**
 * Clears the input fields and resets the selected values in the pop-up.
 */
function emptyPopUpInputs() {
    let titleInput = document.getElementById("addTaskTitle");
    let descriptionInput = document.getElementById("addTaskDescription");
    let categoryInput = document.getElementById("addTaskCategory");

    titleInput.value = "";
    descriptionInput.value = "";
    categoryInput.selectedIndex = 0;

    document.getElementById("addTaskAssignedMembers_popUp").innerHTML = "";
    document.getElementById(`dueDateInput_addTaskPopUp`).value = "";
    document.getElementById(`subTaskInput_popUp`).value = "";
    document.getElementById(`subTaskPreviewContainer_popUp`).innerHTML = "";
    contactsToAdd = [];
}


/**
 * Adds a task from the "Add Task" site.
 * Saves the task online and redirects to the board.
 */
async function addTaskFromAddTaskSite() {
    let titleInput = document.getElementById("addTaskTitle");
    let descriptionInput = document.getElementById("addTaskDescription");
    let categoryInput = document.getElementById("addTaskCategory");
    let dateInput = document.getElementById("dueDateInput_addTaskSite");

    if (!addTaskFieldsAreFilled("site")) {
        return;
    }

    let taskJSON = {
        category: categoryInput.value.toLowerCase(),
        title: titleInput.value,
        description: descriptionInput.value,
        subtasks: subTasksToAdd,
        priority: priorityToAdd,
        contactsInTask: contactsToAdd,
        status: "to-do",
        dueDate: dateInput.value,
    }
    await loadTasksOnline()
    toDoArray.push(taskJSON);
    await saveTasksOnline();

    await confirmAddTask();
    // setTimeout(window.open(openBoardLink(), "_self"), 200);
}


/**
 * Displays a confirmation banner after successful email confirmation.
 */
async function confirmAddTask() {
    let confirmationBanner = document.getElementById('addTaskConfirmation');
    confirmationBanner.classList.add("confirmation-animation");
    await new Promise(resolve => setTimeout(resolve, 2000));
    confirmationBanner.classList.remove("confirmation-animation");
}


/**
 * Saves the tasks array online.
 */
async function saveTasksOnline() {
    await setItem("taskArray", JSON.stringify(toDoArray));
}


/**
 * Loads the tasks array from online storage.
 */
async function loadTasksOnline() {
    toDoArray = JSON.parse(await getItem("taskArray"));
}


/**
 * Adds a member to the task with the given source.
 *
 * @param {string} source - The source of the task.
 */
function addMemberToTask(source) {
    let inputField = document.getElementById(`addTaskSelection_${source}`);
    let memberIndex = inputField.value;
    if (memberIndex == -1) return;
    if (contactsToAdd.includes(contacts[memberIndex])) return;

    let circleHTML

    if (source != "edit" && source != "edit_mobile") {
        contactsToAdd.push(contacts[memberIndex]);
        circleHTML = contactCircleHTML(contacts[memberIndex], true, true);
    }
    else {

        contactsToEdit.push(contacts[memberIndex]);
        circleHTML = contactCircleHTML(contacts[memberIndex], true, false);
    }

    circleHTML = contactCircleHTML(contacts[memberIndex]);
    let membersDiv = document.getElementById(`addTaskAssignedMembers_${source}`);

    membersDiv.innerHTML += circleHTML;
}


/**
 * Adds a member to the task with the given contact index.
 *
 * @param {number} contactIndex - The index of the contact.
 * @param {boolean} [popUp=false] - Indicates if the member is being added in the pop-up.
 */
function addMemberToTaskWithIndex(contactIndex, popUp = false) {
    if (contactsToAdd.includes(contacts[contactIndex])) return;

    contactsToAdd.push(contacts[contactIndex]);
    let circleHTML = contactCircleHTML(contacts[contactIndex]);
    let membersDiv = popUp ? document.getElementById("addTaskAssignedMembers_popUp") : document.getElementById("addTaskAssignedMembers_site");

    membersDiv.innerHTML += circleHTML;
}


/**
 * Adds a subtask to the task.
 *
 * @param {string} [source="popUp"] - The source of the task.
 * @param {number} cardIndex - The index of the card.
 */
function addSubTask(source = "popUp", cardIndex) {
    let addSubTaskInputField = document.getElementById(`subTaskInput_${source}`);

    if (addSubTaskInputField.value == "") return;

    let subTaskToAdd = { title: addSubTaskInputField.value, done: false };

    pushSubTask(source, subTaskToAdd);

    let subTaskPreviewContainer = document.getElementById(`subTaskPreviewContainer_${source}`);
    subTaskPreviewContainer.innerHTML += subTaskPreviewHTML(addSubTaskInputField.value, cardIndex);

    addSubTaskInputField.value = "";
}


/**
 * Pushes the subtask to the corresponding array based on the source.
 *
 * @param {string} source - The source of the task.
 * @param {object} subTaskToAdd - The subtask to add.
 */
function pushSubTask(source, subTaskToAdd) {
    if (source == "edit_mobile" || source == "edit")
        subTasksToEdit.push(subTaskToAdd);
    else if (source != "edit")
        subTasksToAdd.push(subTaskToAdd);
    else console.log("error");
}


/**
 * Generates the HTML for displaying a subtask preview.
 *
 * @param {string} subTaskTitle - The title of the subtask.
 * @param {number} cardIndex - The index of the card.
 * @param {string} [source="addTask"] - The source of the task.
 * @returns {string} The HTML for the subtask preview.
 */
function subTaskPreviewHTML(subTaskTitle, cardIndex, source = "addTask") {
    return /*html*/ `
        <div class= "dflex align-center gap10" id = "subTaskPreview_${cardIndex}_${subTaskTitle}" >
        <div class="rectangle"></div>
        <div class="subTask-text">
            ${subTaskTitle}
        </div>
        <img src = "assets/img/delete.png" alt = "" class= "pointer" onclick = "deleteSubTask(${cardIndex},'${subTaskTitle}','${source}')" >
    </div > `;
}


/**
 *
 * Deletes a subtask from the task.
 * @param {number} cardIndex - The index of the card.
 * @param {string} subTaskTitle - The title of the subtask.
 * @param {string} [source="addTask"] - The source of the task.
 */
function deleteSubTask(cardIndex, subTaskTitle, source = "addTask") {
    let previewDiv = document.getElementById(`subTaskPreview_${cardIndex}_${subTaskTitle}`);
    previewDiv.remove();

    if (source == "edit") {
        let subTaskIndex = subTasksToEdit.findIndex(obj => obj.title === subTaskTitle);
        subTasksToEdit.splice(subTaskIndex, 1);
    }
    else if (source == "addTask") {
        let subTaskIndex = subTasksToAdd.findIndex(obj => obj.title === subTaskTitle);
        subTasksToEdit.splice(subTaskIndex, 1);
    }
    else console.error("Invalid source:", source);
}


/**
 * Selects the priority for the task.
 *
 * @param {string} prio - The selected priority.
 * @param {boolean} [fromEditMobile=false] - Indicates if the priority is being selected from the edit mobile site.
 */
function selectPrio(prio, fromEditMobile = false) {
    let currentSelectedPrio = document.getElementById(`prioButton_${priorityToAdd}`);
    let prioButton = document.getElementById(`prioButton_${prio}`);

    currentSelectedPrio.classList.remove("selected-prio-container");
    prioButton.classList.add("selected-prio-container")

    priorityToAdd = prio;
}


/**
 * Selects the priority for editing the task.
 *
 * @param {string} prio - The selected priority.
 */
function selectPrioInEdit(prio) {
    let currentSelectedPrio = document.getElementById(`prioButton_${priorityToEdit}_edit`);
    let prioButton = document.getElementById(`prioButton_${prio}_edit`);

    currentSelectedPrio.classList.remove("selected-prio-container");
    prioButton.classList.add("selected-prio-container")

    priorityToEdit = prio;
}


// /**
//  * Retrieves the formatted date as a string.
//  *
//  * @param {string} [source="addTaskSite"] - The source of the task.
//  * @returns {string} The formatted date as a string.
//  * @throws {Error} If the date format is invalid.
//  */
function setMinimumDateForInputFields() {
    let field_edit = document.getElementById(`dueDateInput_edit`);
    let field_edit_mobile = document.getElementById(`dueDateInput_edit_mobile`);
    let field_addTaskSite = document.getElementById(`dueDateInput_addTaskSite`);
    let field_addTaskPopUp = document.getElementById(`dueDateInput_addTaskPopUp`);

    let date = getTodayAsDateString();

    if (field_addTaskPopUp) field_addTaskPopUp.min = date;
    if (field_addTaskSite) field_addTaskSite.min = date;
    if (field_edit) field_edit.min = date;
    if (field_edit_mobile) field_edit_mobile.min = date;

}


function getTodayAsDateString() {
    const today = new Date(); // Erstellt ein Date-Objekt für das heutige Datum
    const year = today.getFullYear(); // Ruft das aktuelle Jahr ab
    const month = String(today.getMonth() + 1).padStart(2, '0'); // Ruft den aktuellen Monat ab (0-11) und fügt ggf. eine führende Null hinzu
    const day = String(today.getDate()).padStart(2, '0'); // Ruft den aktuellen Tag ab und fügt ggf. eine führende Null hinzu
    const formattedDate = `${year}-${month}-${day}`; // Setzt die Teile zu einem String im gewünschten Format zusammen
    return formattedDate;
}

// EDIT TASK!!//////////////////////////////////////////////////////////////

/**
 * Initializes the edit task site.
 *
 * @returns {Promise<void>}
 */
async function initializeEditTaskSite() {
    let toDoIndex = getToDoFromURL();
    includeHTML();
    await loadTasksOnline();
    await loadContacts();
    await addContactForEveryUser();
    highlightChosenPrio(toDoIndex);
    integrateOldSubTasksToEditArray(toDoIndex);

    setTimeout(setNavBarLinks(), 200);
    updateAddTaskMemberSelection("editTaskMobile");
    setMinimumDateForInputFields();

    // document.getElementById("addTaskButton_mobile").onclick = EditTask;
    document.getElementById("addTaskAssignedMembers_edit_mobile").innerHTML = addedMembersHTMLBigCard(toDoIndex);
    document.getElementById("dueDateInput_edit_mobile").value = toDoArray[toDoIndex].dueDate;
    document.getElementById("subTaskPreviewContainer_edit_mobile").innerHTML = addedSubTasksHTML(toDoIndex);
    document.getElementById("addTaskTitle_edit_mobile").value = toDoArray[toDoIndex].title;
    document.getElementById("addTaskDescription_edit_mobile").value = toDoArray[toDoIndex].description;
    document.getElementById("addTaskCategory_edit_mobile").selectedIndex = selectOptionByValue(document.getElementById("addTaskCategory_edit_mobile"), capitalizeFirstLetter(toDoArray[toDoIndex].category));

    document.getElementById("addTaskButton_mobile").onclick = function () { EditTaskMobile(toDoIndex) };
    userFromURL();
}


/**
 * Opens the edit task popup.
 *
 * @param {number} cardIndex - The index of the card.
 */
function openEditTaskPopUp(cardIndex) {
    document.getElementById("editCardPopUp").innerHTML += editTaskHTML(cardIndex);
    setMinimumDateForInputFields();
    showElement("Overlay");
    updateAddTaskMemberSelection("editTask");
    document.getElementById("boardContainer").classList.add("overflow-visible");

    contactsToEdit = toDoArray[cardIndex].contactsInTask;
    highlightChosenPrio(cardIndex);
    selectCurrentCategory(cardIndex);
    integrateOldSubTasksToEditArray(cardIndex);
}


/**
 * Selects an option in a select element based on its value.
 *
 * @param {HTMLSelectElement} selectElement - The select element.
 * @param {string} value - The value to select.
 * @returns {number} The index of the selected option.
 */
function selectOptionByValue(selectElement, value) {
    for (var i = 0; i < selectElement.options.length; i++) {
        if (selectElement.options[i].value === value) {
            selectElement.selectedIndex = i;
            return i;
        }
    }
}


/**
 * Retrieves the 'toDo' parameter from the URL.
 *
 * @returns {string} The 'toDo' parameter value.
 */
function getToDoFromURL() {
    const queryString = window.location.search;
    const urlParams = new URLSearchParams(queryString);
    const user = urlParams.get('toDo');
    return user;
}


/**
 * Generates the HTML for displaying added members in the big card.
 *
 * @param {number} toDoIndex - The index of the to-do item.
 * @returns {string} The HTML for displaying added members.
 */
function addedMembersHTMLBigCard(toDoIndex) {
    let string = "";

    for (let i = 0; i < toDoArray[toDoIndex].contactsInTask.length; i++) {
        if (toDoArray[toDoIndex].contactsInTask[i] != undefined)
            string += contactCircleHTML(toDoArray[toDoIndex].contactsInTask[i], true, true);
    }

    return string;
}


/**
 * Generates the HTML for displaying added subtasks in the big card.
 *
 * @param {number} toDoIndex - The index of the to-do item.
 * @returns {string} The HTML for displaying added subtasks.
 */
function addedSubTasksHTML(toDoIndex) {
    let string = "";
    for (let i = 0; i < toDoArray[toDoIndex].subtasks.length; i++) {
        string += subTaskPreviewHTML(toDoArray[toDoIndex].subtasks[i].title, toDoIndex, "edit");
    }

    return string;
}


/**
 * Highlights the chosen priority in the edit task.
 *
 * @param {number} toDoIndex - The index of the to-do item.
 */
function highlightChosenPrio(toDoIndex) {
    let prio = toDoArray[toDoIndex].priority;
    priorityToEdit = prio;
    document.getElementById(`prioButton_${prio}_edit`).classList.add("selected-prio-container");
}


/**
 * Edits a task.
 *
 * @param {number} cardIndex - The index of the card.
 * @returns {Promise<void>}
 */
async function EditTask(cardIndex) {
    let titleInput = document.getElementById("addTaskTitle_edit");
    let descriptionInput = document.getElementById("addTaskDescription_edit");
    let categoryInput = document.getElementById("addTaskCategory_edit");
    let dateInput = document.getElementById("dueDateInput_edit");

    let JSON = {
        category: categoryInput.value.toLowerCase(),
        title: titleInput.value,
        description: descriptionInput.value,
        subtasks: subTasksToEdit,
        priority: priorityToEdit,
        contactsInTask: contactsToEdit,
        status: toDoArray[cardIndex].status,
        dueDate: dateInput.value,
    }

    toDoArray.splice(cardIndex, 1);
    toDoArray.push(JSON);
    closeEditTaskPopUp();
    closeBigCard();
    await saveTasksOnline();
    renderToDos();
    contactsToEdit = [];
}


/**
 * Edits a task in mobile view.
 *
 * @param {number} cardIndex - The index of the card.
 * @returns {Promise<void>}
 */
async function EditTaskMobile(cardIndex) {
    let titleInput = document.getElementById("addTaskTitle_edit_mobile");
    let descriptionInput = document.getElementById("addTaskDescription_edit_mobile");
    let categoryInput = document.getElementById("addTaskCategory_edit_mobile");
    let dateInput = document.getElementById("dueDateInput_edit_mobile");

    let JSON = {
        category: categoryInput.value.toLowerCase(),
        title: titleInput.value,
        description: descriptionInput.value,
        subtasks: subTasksToEdit,
        priority: priorityToEdit,
        contactsInTask: contactsToEdit,
        status: toDoArray[cardIndex].status,
        dueDate: toDoArray[cardIndex].dueDate,
    }

    toDoArray.splice(cardIndex, 1);
    toDoArray.push(JSON);
    await saveTasksOnline();
    closeBigCard();
    renderToDos();
}


/**
 * Deletes a to-do item.
 *
 * @param {number} cardIndex - The index of the card.
 * @returns {Promise<void>}
 */
async function deleteToDo(cardIndex) {
    toDoArray.splice(cardIndex, 1);
    await saveTasksOnline();
    renderToDos();
    closeBigCard();
}


/**
 * Retrieves the formatted date string for editing a task.
 *
 * @param {number} cardIndex - The index of the card.
 * @returns {string} The formatted date string.
 */
function getDateString_Edit(cardIndex) {
    let dateStringFormatted = toDoArray[cardIndex].dueDate;
    const outputString = dateStringFormatted.replace(/-/g, "/");
    return outputString;
}

/**
 * Integrates old subtasks into the edit array.
 *
 * @param {number} cardIndex - The index of the card.
 */
function integrateOldSubTasksToEditArray(cardIndex) {
    subTasksToEdit = [];
    for (let i = 0; i < toDoArray[cardIndex].subtasks.length; i++) {
        subTasksToEdit.push(toDoArray[cardIndex].subtasks[i]);
    }
}


/**
 * Closes the edit task popup.
 */
function closeEditTaskPopUp() {
    const editCardPopUp = document.getElementById("editCardPopUp");
    if (editCardPopUp) editCardPopUp.innerHTML = "";

    hideElement("Overlay");

    const boardContainer = document.getElementById("boardContainer");
    boardContainer.classList.remove("overflow-visible");
    closeBigCard();
}


/**
 * Selects the current category in the edit task.
 *
 * @param {number} cardIndex - The index of the card.
 */
function selectCurrentCategory(cardIndex) {
    let categoryOfCard = toDoArray[cardIndex].category;
    let categoryElement = document.getElementById(`category_edit_${categoryOfCard}`).setAttribute("selected", true);
}


/**
 * Generates the HTML for the edit task popup.
 *
 * @param {number} toDoIndex - The index of the to-do item.
 * @returns {string} The HTML for the edit task popup.
 */
function editTaskHTML(toDoIndex) {
    return /*html*/`
        <div class= "add-task-container-pop-up" >
        <h1 class="add-task-heading headlines">Edit Task</h1>
        <div class="add-task-content">
            <div class="add-task-half">
                <div class="add-task-input-container">
                    <p>Title</p>
                    <div class="input-field">
                        <input type="text" placeholder="Enter a title" id="addTaskTitle_edit" value="${toDoArray[toDoIndex]["title"]}" required>
                    </div>
                </div>
                <div class="add-task-input-container">
                    <p>Description</p>
                    <div class="text-area-field">
                        <textarea name="" cols="30" rows="4" placeholder="Enter a Description" id="addTaskDescription_edit">${toDoArray[toDoIndex].description}</textarea>
                    </div>
                </div>
                <div class="add-task-input-container">
                    <p>Category</p>
                    <div class="input-field">
                        <select name="add-task-category-select" class="select-category pointer" id="addTaskCategory_edit" required>
                            <option value="0" id="category_edit_0">Select task Category</option>
                            <option value="Design" id="category_edit_design">Design</option>
                            <option value="Sales" id="category_edit_sales">Sales</option>
                            <option value="Backoffice" id="category_edit_backoffice">Backoffice</option>
                            <option value="Media" id="category_edit_media">Media</option>
                            <option value="Marketing" id="category_edit_marketing">Marketing</option>
                        </select>
                    </div>
                </div>
                <div class="add-task-input-container dflex-col gap20">
                    <p>Assigned to</p>
                    <div class="input-field">
                        <select name="add-task-category-select" id="addTaskSelection_edit" class="select-category pointer" oninput="addMemberToTask('edit')" required>
                            <option value="0">Select contacts to assign</option>
                        </select>
                    </div>
                    <div class="add-task-assigned-members dflex gap10" id="addTaskAssignedMembers_edit">
                        ${addedMembersHTMLBigCard(toDoIndex)}
                    </div>
                </div>
            </div>
            <span class="vertical-line"></span>
            <div class="add-task-half">
                <div class="add-task-input-container">
                    <p>Due Date</p>
                    <div class="input-field date-input">
                        <input type="date" class="pointer" id="dueDateInput_edit" value="${toDoArray[toDoIndex].dueDate}">
                    </div>
                </div>
                <div class="select-prio">
                    <p>Prio</p>
                    <div class="prio-container-container">
                        <div class="prio-container pointer" id="prioButton_urgent_edit" onclick="selectPrioInEdit('urgent')">
                            <div>Urgent</div>
                            <img src="assets/img/priorityurgent.png" alt="">
                        </div>
                        <div class="prio-container pointer" id="prioButton_medium_edit" onclick="selectPrioInEdit('medium')">
                            <div>Medium</div>
                            <img src="assets/img/prioritymedium.png" alt="">
                        </div>
                        <div class="prio-container pointer" id="prioButton_low_edit" onclick="selectPrioInEdit('low')">
                            <div>Low</div>
                            <img src="assets/img/prioritylow.png" alt="">
                        </div>
                    </div>
                </div>
                <div class="add-task-input-container">
                    <p>Subtasks</p>
                    <div class="input-field">
                        <input type="text" placeholder="Add new subtask" id="subTaskInput_edit">
                        <img src="assets/img/plusbutton.png" alt="" class="pointer" onclick="addSubTask('edit')">
                    </div>
                    <div class="dflex-col gap10" id="subTaskPreviewContainer_edit">
                        ${addedSubTasksHTML(toDoIndex)}
                    </div>
                </div>
            </div>
        </div>
        <div class="btn-container-edit-popUp">
            <button class="login-btn clear-btn" onclick="closeEditTaskPopUp()">Clear X</button>
            <button type="submit" class="login-btn add-task-btn" onclick="EditTask(${toDoIndex})">Edit Task <img src="assets/img/check.png" alt=""></button>
        </div>
    </div>`;
}


/**
 * Opens the edit task in mobile view.
 *
 * @param {number} toDoIndex - The index of the to-do item.
 */
function openEditTaskMobile(toDoIndex) {
    window.open(`edit_task_mobile.html ? toDo = ${toDoIndex} & user=${userFromURL()}`, "_self");
}

// function
//////////////////////////////////////////////////