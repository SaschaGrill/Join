/**
 * Initializes the summary page.
 */
async function initSummary() {
  await includeHTML();
  greet();
  await loadTasksOnline();
  const taskCounts = getTaskCounts();
  updateTaskCounts(taskCounts);
  const urgentAndDeadlineInfo = getUrgentAndUpcomingDeadline();
  updateUrgentAndUpcomingDeadline(urgentAndDeadlineInfo);
  userFromURL();
  setTimeout(setNavBarLinks(), 200);
}


/**
 * Retrieves the appropriate greeting based on the current hour.
 * 
 * @returns {string} - The greeting message.
 */
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


/**
 * Displays the greeting and user name on the page.
 */
function greet() {
  const greetingElement = document.getElementById('greeting');
  let currentUser = decodeURIComponent(window.location.search.split('=')[1]);
  greetingElement.innerHTML = getGreeting();
  let greetUser = document.getElementById('user');
  greetUser.innerHTML = currentUser;
}


/**
 * Retrieves the month name based on the month index.
 * 
 * @param {number} monthIndex - The index of the month (0-11).
 * @returns {string} - The month name.
 */
function getMonthName(monthIndex) {
  const monthNames = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
  ];
  return monthNames[monthIndex];
}


/**
 * Updates the task counts displayed on the page.
 * 
 * @param {object} taskCounts - Object containing task counts.
 */
function updateTaskCounts(taskCounts) {
  document.getElementById('to-do').innerText = taskCounts.openTasks;
  document.getElementById('done').innerText = taskCounts.closedTasks;
  document.getElementById('total').innerText = taskCounts.total;
  document.getElementById('in-progress').innerText = taskCounts.inProgress;
  document.getElementById('awaiting-feedback').innerText = taskCounts.awaitingFeedback;
}


/**
 * Converts the date format from 'dd/mm/yyyy' to 'MonthName Day, YYYY'.
 * 
 * @param {string} dueDateString - The due date string in 'dd/mm/yyyy' format.
 * @returns {Date} - The converted date object.
 */
function convertDateFormat(dueDateString) {
  const [year, month, day] = dueDateString.split('-');
  const dateObject = new Date(`${year}-${month}-${day}`);
  return dateObject;
}


/**
 * Retrieves the number of urgent tasks and the nearest upcoming deadline.
 * 
 * @returns {object} - Object containing the number of urgent tasks and the upcoming deadline.
 */
function getUrgentAndUpcomingDeadline() {
  let urgentTasks = 0;
  let upcomingDeadline = null;

  for (let task of toDoArray) {
    if (task.priority === 'urgent') {
      urgentTasks++;
    }

    if (task.dueDate) {
      const taskDueDate = convertDateFormat(task.dueDate);

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


/**
 * Updates the display of the number of urgent tasks and the upcoming deadline.
 * 
 * @param {object} info - Object containing the number of urgent tasks and the upcoming deadline.
 */
function updateUrgentAndUpcomingDeadline(info) {
  document.getElementById('urgentTasks').innerText = info.urgentTasks;
  if (info.upcomingDeadline !== null) {
    const formattedDate = `${getMonthName(info.upcomingDeadline.getMonth())} ${info.upcomingDeadline.getDate()}, ${info.upcomingDeadline.getFullYear()}`;
    document.getElementById('upcomingDeadline').innerText = formattedDate;
  } else {
    document.getElementById('upcomingDeadline').innerText = 'No deadlines';
  }
}







