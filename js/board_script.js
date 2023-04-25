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

function initializeBoard() {
    includeHTML();
    renderToDos();
}

async function renderToDos() {
    await loadTasksOnline();
    for (let i = 0; i < pinSpaceArray.length; i++) {
        const element = pinSpaceArray[i];
        document.getElementById(pinSpaceArray[i]).innerHTML = "";
    }

    for (let i = 0; i < toDoArray.length; i++) {
        const toDo = toDoArray[i];
        let pinSpaceToUse = getRightPinSpace(toDo["status"],i);
        pinSpaceToUse.innerHTML += smallCardHTML(toDo, i);
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

function highlightDropZone(id){
    document.getElementById(id).classList.add("dropzone-highlight");
}

function highlightDropZoneEnd(id){
    document.getElementById(id).classList.remove("dropzone-highlight");
}

function startDragCard(toDoIndexInArray){
    currentlyDraggedCardIndex = toDoIndexInArray;
}

async function endDragCard(pinSpaceStatus){
    if(currentlyDraggedCardIndex == -1) return;
    toDoArray[currentlyDraggedCardIndex].status = pinSpaceStatus;

    await saveTasksOnline();

   await  renderToDos();
    currentlyDraggedCardIndex = -1;
}

function openBigCard(cardIndex) {
    // showElement("bigCardPopUp");
    document.getElementById("bigCardPopUp").innerHTML += bigCardHTML(cardIndex);
    showElement("Overlay");
    updateAddTaskMemberSelection();
    document.getElementById("boardContainer").classList.add("overflow-visible");
}

function closeBigCard() {
    // hideElement("bigCardPopUp");
    document.getElementById("bigCardPopUp").innerHTML ="";
    hideElement("Overlay");
    document.getElementById("boardContainer").classList.remove("overflow-visible");
}

function bigCardHTML(cardIndex){
    return /*html*/`
    <div class="big-card-Container">
        <button class="big-card-close-button pointer" onclick="closeBigCard()"> <img src="assets/img/cross.png" alt=""></button>
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
             ${assignedToContent(toDoArray[cardIndex].contactsInTask)}
        </div>
        
        <div class="big-card-button-container">
            <button class="pointer"><img src="assets/img/delete.png" alt="" onclick="deleteToDo(${cardIndex})"></button>
            <button class="pointer"><img src="assets/img/pen.png" alt="" onclick="openEditTaskPopUp(${cardIndex})"></button>
        </div>
    </div>
    `;
}

function assignedToContent(contacts){
    let string = "";
    for (let i = 0; i < contacts.length; i++) {
        string += assignedToItemHTML(contacts[i]);
        
    }
    return string;
}

function assignedToItemHTML(contact){
    return /*html*/`
      <div class="assigned-to-item">
                <div class="card-member" style="background-color: ${contact.color}">${contact.initials}</div>
                ${contact.firstName} ${contact.lastName}
            </div>
    `;
}

function openEditTaskPopUp(cardIndex){ 
    document.getElementById("editCardPopUp").innerHTML += editTaskHTML(cardIndex);
    showElement("Overlay");
    updateAddTaskMemberSelection();
    document.getElementById("boardContainer").classList.add("overflow-visible");

    highlightChosenPrio(cardIndex);
}

function closeEditTaskPopUp() {
     // hideElement("bigCardPopUp");
    document.getElementById("editCardPopUp").innerHTML ="";
    hideElement("Overlay");
    document.getElementById("boardContainer").classList.remove("overflow-visible");
}

function editTaskHTML(toDoIndex){
    return /*html*/`    
    <div class="add-task-container-pop-up">
      <h1 class="add-task-heading headlines">Edit Task</h1>
      <div class="add-task-content">

       <div class="add-task-half" >
        <div class="add-task-input-container">
            <p>Title</p>
            <div class="input-field">
                <input type="text" placeholder="Enter a title" id="addTaskTitle" value="${toDoArray[toDoIndex]["title"]}" required>
            </div>
        </div>

        <div class="add-task-input-container">
            <p>Description</p>
            <div class="text-area-field">
            <textarea name="" cols="30" rows="4" placeholder="Enter a Description" id="addTaskDescription">${toDoArray[toDoIndex].description}</textarea>
            </div>
        </div>

        <div class="add-task-input-container">
            <p>Category</p>
            <div class="input-field">
                <select name="add-task-category-select" class="select-category pointer" id="addTaskCategory" required>
                    <option value="0">Select task Category</option>
                    <option value="Design">Design</option>
                    <option value="Sales">Sales</option>
                    <option value="Backoffice">Backoffice</option>
                    <option value="Media">Media</option>
                    <option value="Marketing">Marketing</option>
                </select>
            </div>
        </div>

        <div class="add-task-input-container dflex-col gap20">
            <p>Assigned to</p>
            <div class="input-field">
                <select name="add-task-category-select" id="addTaskSelection" class="select-category pointer" oninput="addMemberToTask()" required>
                    <option value="0">Select contacts to assign </option>

                </select>
            </div>
            <div class="add-task-assigned-members dflex gap10" id="addTaskAssignedMembers">
                ${addedMembersHTML(toDoIndex)}
            </div>
        </div>
      </div>

      <span class="vertical-line"></span>
      <!-- TRENNUNG!!! -->
      <div class="add-task-half">
       <div class="add-task-input-container">
            <p>Due Date</p>
            <div class="input-field">
                <input type="date" placeholder="dd/mm/yyyy"  class="pointer">
            </div>
       </div>

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
             <input type="text" placeholder="Add new subtask" id="subTaskInput">
             <img src="assets/img/plusbutton.png" alt="" class="pointer" onclick="addSubTask()">
            </div>
            <div class="dflex-col" id="subTaskPreviewContainer">
             ${addedSubTasksHTML(toDoIndex)}
            </div>
        </div>

    </div>
    <div class="btn-container">
        <button class="login-btn clear-btn" onclick="closeEditTaskPopUp()">Clear X</button>
        <button type="submit" class="login-btn add-task-btn" onclick="addTask()">Add Task <img src="assets/img/plusbutton.png" alt=""></button>
    </div>
</div>
</div>`;
}

async function deleteToDo(cardIndex){
    toDoArray.splice(cardIndex,1);
    await saveTasksOnline();
    renderToDos();
}

// von Gloria eingefügt

// function countTasks() {
//     let counts = {
//       "to-do": 0,
//       "in-progress": 0,
//       "awaiting-feedback": 0,
//       "done": 0
//     };
//     let total = 0;
//     for (let i = 0; i < toDoArray.length; i++) {
//       const toDo = toDoArray[i];
//       counts[toDo.status]++;
//       total++;
//     }
//     counts["total"] = total;
//     return counts;
//   }

//   function updateTaskCounts() {
//     const taskCounts = countTasks();
//     const elementsToUpdate = document.querySelectorAll('[data-task]');
  
//     elementsToUpdate.forEach(element => {
//       const taskType = element.getAttribute('data-task');
//       if (taskCounts.hasOwnProperty(taskType)) {
//         element.textContent = taskCounts[taskType];
//       }
//     });
//   }
  
//  let taskCounts = countTasks();
// console.log(taskCounts);
// Output: { "to-do": 1, "in-progress": 1, "awaiting-feedback": 1, "done": 0, "total": 3 }

  