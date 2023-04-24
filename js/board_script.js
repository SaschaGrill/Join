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

function renderToDos() {
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
<div class="small-card pointer" onclick="openBigCard()" draggable="true" ondragstart="startDragCard(${index})">
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
    console.log(toDoIndexInArray);
    currentlyDraggedCardIndex = toDoIndexInArray;
}

function endDragCard(pinSpaceStatus){
    if(currentlyDraggedCardIndex == -1) return;
    
    toDoArray[currentlyDraggedCardIndex].status = pinSpaceStatus;
    renderToDos();
    currentlyDraggedCardIndex = -1;
}

function openBigCard(card) {
    showElement("bigCardPopUp");
    showElement("Overlay");
    updateAddTaskMemberSelection();
    document.getElementById("boardContainer").classList.add("overflow-visible");
}

function closeBigCard() {
    hideElement("bigCardPopUp");
    hideElement("Overlay");
    document.getElementById("boardContainer").classList.remove("overflow-visible");
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

  