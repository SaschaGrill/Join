let contactsToAdd = [];
let subTasksToAdd = [];

let contactsToEdit = [];
let subTasksToEdit = [];

let priorityToAdd = "low";
let priorityToEdit = "low";

let currentChoosenCategoryToEdit = document.getElementById("category_edit_0");


async function initializeAddTaskSite() {
    includeHTML();
    await addContactForEveryUser();
    updateAddTaskMemberSelection("addTaskSite");
    saveUrlVariable();
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

function contacsHTML(toDo) {
    let members = toDo["contactsInTask"];
    let string = "";
    for (let i = 0; i < members.length; i++) {
        let member = members[i];
        string += contactCircleHTML(member);
    }

    return /*html*/`
     <div class="small-card-members-container">
        ${string}
    </div>
    `
}

function contactCircleHTML(member, deletable = true) {
    if (deletable) return /*html*/`
    <div class="pos-rel">
       <span class="delete-btn-member">X</span>
        <div class="card-member" style="background-color:${member["color"]}">${member["initials"][0]}${member["initials"][1]}</div>
    </div>
        `;

    else return /*html*/`
        <div class="pos-rel">
            <div class="card-member" style="background-color:${member["color"]}">${member["initials"][0]}${member["initials"][1]}</div>
        </div>`;
}

function openAddTaskMenu() {
    showElement("addTaskPopUp");
    showElement("Overlay");
    updateAddTaskMemberSelection("popUp");
    document.getElementById("boardContainer").classList.add("overflow-visible");
}

function closeAddTaskMenu() {
    hideElement("addTaskPopUp");
    hideElement("Overlay");
    document.getElementById("boardContainer").classList.remove("overflow-visible");
}

function updateAddTaskMemberSelection(openedFromString) {
    let selection;
    if (openedFromString == "popUp") selection = document.getElementById("addTaskSelection_popUp");
    else if (openedFromString == "addTaskSite") selection = document.getElementById("addTaskSelection_site");
    else if (openedFromString == "editTask") selection = document.getElementById("addTaskSelection_edit");
    else console.log(openedFromString);

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

async function addTaskFromPopUp() {
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
        dueDate: getDateAsString("addTaskPopUp"),
    }

    toDoArray.push(JSON);

    closeAddTaskMenu();
    await saveTasksOnline();
    renderToDos();
}

async function addTaskFromAddTaskSite() {
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
        dueDate: getDateAsString("addTaskSite"),
    }

    toDoArray.push(JSON);

    await saveTasksOnline();
    window.open("board.html");
}

async function saveTasksOnline() {
    await setItem("taskArray", JSON.stringify(toDoArray));
}

async function loadTasksOnline() {
    toDoArray = JSON.parse(await getItem("taskArray"));
}

function addMemberToTask(popUp = true) {
    let inputField = popUp ? document.getElementById("addTaskSelection_popUp") : document.getElementById("addTaskSelection_site");
    let memberIndex = inputField.value;
    if (memberIndex == -1) return;
    if (contactsToAdd.includes(contacts[memberIndex])) return;

    contactsToAdd.push(contacts[memberIndex]);
    let circleHTML = contactCircleHTML(contacts[memberIndex]);
    let membersDiv = popUp ? document.getElementById("addTaskAssignedMembers_popUp") : document.getElementById("addTaskAssignedMembers_site");


    membersDiv.innerHTML += circleHTML;
}


function addSubTask(source = "popUp", cardIndex) {
    let addSubTaskInputField = document.getElementById(`subTaskInput_${source}`);

    let subTaskToAdd = { title: addSubTaskInputField.value, done: false };

    pushSubTask(source, subTaskToAdd);


    let subTaskPreviewContainer = document.getElementById(`subTaskPreviewContainer_${source}`);
    subTaskPreviewContainer.innerHTML += subTaskPreviewHTML(addSubTaskInputField.value, cardIndex);

    addSubTaskInputField.value = "";
}

function pushSubTask(source, subTaskToAdd) {
    if (source != "edit")
        subTasksToAdd.push(subTaskToAdd);
    else if (source == "edit")
        subTasksToEdit.push(subTaskToAdd);
}

function subTaskPreviewHTML(subTaskTitle, cardIndex, source = "addTask") {
    return/*html*/`
    <div class="dflex align-center gap10" id="subTaskPreview_${cardIndex}_${subTaskTitle}">
        <div class="rectangle"></div>
        ${subTaskTitle}
        <img src="assets/img/delete.png" alt="" class="pointer" onclick="deleteSubTask(${cardIndex},'${subTaskTitle}','${source}')">
    </div>`
}

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
    else console.error("ungültige source:", source);
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

function getDateAsString(source = "addTaskSite") {
    let dateInputField = document.getElementById(`dueDateInput_${source}`);

    // Zuerst das Format des Eingabestrings überprüfen
    if (!dateInputField) console.error("ungültige ID für DateInput");
    //ich liebe ChatGPT
    const datePattern = /^(\d{1,2})\/(\d{1,2})\/(\d{4})$/;
    if (!datePattern.test(dateInputField.value)) {
        throw new Error("Das Datumsformat ist ungültig. Bitte verwenden Sie das Format 'dd/mm/yyyy'.");
    }

    // Wenn das Format gültig ist, das Datum in das gewünschte Format umwandeln
    const dateParts = dateInputField.value.split("/");
    const formattedDate = `${dateParts[0]}-${dateParts[1]}-${dateParts[2]}`;

    return formattedDate;

}


// EDIT TASK!!//////////////////////////////////////////////////////////////

function addedMembersHTMLBigCard(toDoIndex) {
    let string = "";
    for (let i = 0; i < toDoArray[toDoIndex].contactsInTask.length; i++) {
        string += contactCircleHTML(toDoArray[toDoIndex].contactsInTask[i]);
    }

    return string;
}

function addedSubTasksHTML(toDoIndex) {
    let string = "";
    for (let i = 0; i < toDoArray[toDoIndex].subtasks.length; i++) {
        string += subTaskPreviewHTML(toDoArray[toDoIndex].subtasks[i].title, toDoIndex, "edit");
    }

    return string;
}

function highlightChosenPrio(toDoIndex) {
    let prio = toDoArray[toDoIndex].priority;
    priorityToEdit = prio;
    document.getElementById(`prioButton_${prio}_edit`).classList.add("selected-prio-container");
}

async function EditTask(cardIndex) {
    let titleInput = document.getElementById("addTaskTitle_edit");
    let descriptionInput = document.getElementById("addTaskDescription_edit");
    let categoryInput = document.getElementById("addTaskCategory_edit");


    let JSON = {
        category: categoryInput.value.toLowerCase(),
        title: titleInput.value,
        description: descriptionInput.value,
        subtasks: subTasksToEdit,
        priority: priorityToEdit,
        contactsInTask: contactsToAdd,
        status: toDoArray[cardIndex].status,
        dueDate: getDateAsString("edit"),
    }

    toDoArray.splice(cardIndex, 1);
    toDoArray.push(JSON);
    closeEditTaskPopUp();
    closeBigCard();
    await saveTasksOnline();
    renderToDos();
}

async function deleteToDo(cardIndex) {
    toDoArray.splice(cardIndex, 1);
    await saveTasksOnline();
    renderToDos();
    closeBigCard();

}

function getDateString_Edit(cardIndex) {
    let dateStringFormatted = toDoArray[cardIndex].dueDate;
    console.log(dateStringFormatted);
    const outputString = dateStringFormatted.replace(/-/g, "/");
    return outputString;
}

// function getNewSubTaskArray(cardIndex) {
//     let newArray = [];
//     for (let i = 0; i < toDoArray[cardIndex].subtasks.length; i++) {
//         newArray.push(toDoArray[cardIndex].subtasks[i]);
//     }

//     for (let i = 0; i < subTasksToEdit.length; i++) {
//         newArray.push(subTasksToEdit[i]);
//     }

//     return newArray;
// }

function openEditTaskPopUp(cardIndex) {
    document.getElementById("editCardPopUp").innerHTML += editTaskHTML(cardIndex);
    showElement("Overlay");
    updateAddTaskMemberSelection("editTask");
    document.getElementById("boardContainer").classList.add("overflow-visible");

    highlightChosenPrio(cardIndex);
    selectCurrentCategory(cardIndex);
    integrateOldSubTasksToEditArray(cardIndex);
}

function integrateOldSubTasksToEditArray(cardIndex) {
    subTasksToEdit = [];
    for (let i = 0; i < toDoArray[cardIndex].subtasks.length; i++) {
        subTasksToEdit.push(toDoArray[cardIndex].subtasks[i]);
    }
}

function closeEditTaskPopUp() {
    // hideElement("bigCardPopUp");
    document.getElementById("editCardPopUp").innerHTML = "";
    hideElement("Overlay");
    document.getElementById("boardContainer").classList.remove("overflow-visible");

}

function selectCurrentCategory(cardIndex) {
    let categoryOfCard = toDoArray[cardIndex].category;
    let categoryElement = document.getElementById(`category_edit_${categoryOfCard}`).setAttribute("selected", true);
}

function editTaskHTML(toDoIndex) {
    return /*html*/`    
    <div class="add-task-container-pop-up">
      <h1 class="add-task-heading headlines">Edit Task</h1>
      <div class="add-task-content">

       <div class="add-task-half" >
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
                <select name="add-task-category-select" id="addTaskSelection_edit" class="select-category pointer" oninput="addMemberToTask()" required>
                    <option value="0">Select contacts to assign </option>

                </select>
            </div>
            <div class="add-task-assigned-members dflex gap10" id="addTaskAssignedMembers_edit">
                ${addedMembersHTMLBigCard(toDoIndex)}
            </div>
        </div>
      </div>

      <span class="vertical-line"></span>
      <!-- TRENNUNG!!! -->
      <div class="add-task-half">
       <div class="add-task-input-container">
            <p>Due Date</p>
            <div class="input-field date-input" >
                    <input type="datetime" placeholder="dd/mm/yyy" class="pointer" id="dueDateInput_edit" value="${getDateString_Edit(toDoIndex)}">
    <img src="assets/img/calendar.png" alt="">
    </div>
       </div >

       <div class="select-prio">
         <p>Prio</p>
         <div class="dflex gap10">
            <div class="prio-container pointer" id="prioButton_urgent_edit" onclick="selectPrioInEdit('urgent')">
                <div>Urgent</div>
                <img src="assets/img/priorityUrgent.png" alt="">
            </div>
            
            <div class="prio-container pointer" id="prioButton_medium_edit" onclick="selectPrioInEdit('medium')">
                <div>Medium</div>
                <img src="assets/img/priorityMedium.png" alt="">
            </div>
            
            <div class="prio-container pointer" id="prioButton_low_edit" onclick="selectPrioInEdit('low')">
                <div>Low</div>
                <img src="assets/img/priorityLow.png" alt="">
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
    <div class="btn-container">
        <button class="login-btn clear-btn" onclick="closeEditTaskPopUp()">Clear X</button>
        <button type="submit" class="login-btn add-task-btn" onclick="EditTask(${toDoIndex})">Edit Task <img src="assets/img/plusbutton.png" alt=""></button>
    </div>
</div >
</div > `;
}

// function
//////////////////////////////////////////////////