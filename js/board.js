let loadedTasks = [];
let currentDraggedElement;
let currentDraggedElementID; 
// let currentTodoId = '';


/**
 * Saves the status of an element.
 * @param {string} Elementstatus - The status to be saved.
 */
function saveStatus(Elementstatus){
    lastStatus = Elementstatus
};


/**
 * Loads tasks from storage to the board asynchronously.
 */
async function loadedTaskstoBoard() {
    loadedTasks = await getTodos();
}


/**
 * Updates the HTML content of the board.
 * @async
 */
async function updateHTML() {
    await loadedTaskstoBoard();
    const searchInput = document.getElementById('findTask').value.toLowerCase();
    initTaskData();
    renderTasksByStatus(loadedTasks, "todo", "todoListContainer");
    renderTasksByStatus(loadedTasks, "progress", "progressListContainer");
    renderTasksByStatus(loadedTasks, "feedback", "awaitFeedbackListContainer");
    renderTasksByStatus(loadedTasks, "done", "doneListContainer");
    generateEmtyTaskFormHTML();

}


// renders the different tasks
async function renderToDoTask(loadedTasks) {
    renderTasksByStatus(loadedTasks, "todo", "todoListContainer");
    c
  } 
function renderInProgressTask(loadedTasks) {
    renderTasksByStatus(loadedTasks, "progress", "progressListContainer");
}
function renderAwaitFeedbackTask(loadedTasks) {
    renderTasksByStatus(loadedTasks, "feedback", "awaitFeedbackListContainer");
}
function renderDoneTask(loadedTasks) {
    renderTasksByStatus(loadedTasks, "done", "doneListContainer");
}
  

//renders tasks by their different status
function renderTasksByStatus(loadedTasks, status, containerId) {
    let tasks = loadedTasks.filter((t) => t["status"] === status);
    let container = document.getElementById(containerId);
    container.innerHTML = "";
  
    if (tasks.length > 0) {
      for (let index = 0; index < tasks.length; index++) {
        let element = tasks[index];
        let elementID = tasks[index].id
        container.innerHTML += generateTodoHTML(element, elementID);
       
      }
    } else {
      generateEmtyTodoHTML(container);
    }
  }


/**
 * Returns the category based on the priority.
 * @param {string} status - The priority for which the category needs to be determined.
 * @returns {string} - The corresponding category.
 */
function getStatusFromTask(status) {
    if (status === 'todo') {
        return 'todo';
    } else if (status === 'progress') {
        return 'progress';
    } else if (status === 'feedback') {
        return 'feedback';
    } else if (status === 'done') {
        return 'done';
    } else {        
        return 'DefaultCategory';
    }
}


/**
 * Updates the priority of an element and executes the moveTo function.
 * @param {number} elementID - The ID of the element whose priority is to be updated.
 * @param {string} status - The new priority of the element.
 */
async function updateStatusMobile(elementID, status) {
    dragElement = loadedTasks.filter(id => id.id == elementID);
    currentDraggedElement = dragElement[0];
    currentDraggedElementID = dragElement[0].id;

    const category = getStatusFromTask(status);
    await moveTo(category);
}


/**
 * Generates HTML for a small progress bar based on open subtasks.
 * @param {Array} element - The element containing task information.
 * @returns {string} - The HTML for the progress bar.
 */
function progressBarSmallInfoCard(element) {
    if (element['subtask'].length > 0) {
        const openSubtasksCount = countOpenSubtasks(element);
        const progressPercentage = Math.round((openSubtasksCount / element['subtask'].length) * 100);
        const subTaskCountContainerStyle = element['subtask'].length === 0 ? 'display: none;' : '';
        const progressBarHTML = `
            <div class="progressBar">
                <div class="progressBarFill" style="width: ${progressPercentage}%;"></div>
            </div>
            <div id="subTaskCount" style="${subTaskCountContainerStyle}">
                ${openSubtasksCount}/${element['subtask'].length} Subtasks
            </div>`;
        
        return progressBarHTML;
    } else {        
        return '';
    }
}


/**
 * Filters the number of subtasks that are done.
 * @param {Array} element - The element containing task information.
 * @returns {number} - The count of subtasks that are done.
 */
function filterSubTaskDone(element){
    let subTaskDone =  element['subtask'].filter(subtask => subtask['status'] === 'done').length;

    return subTaskDone;
}


/**
 * Opens the information card for a specific task.
 * @param {number} elementID - The ID of the element.
 */
function openInfoCard(elementID){    
    closeAddTaskForm();

    let element = loadedTasks.filter((id) => id["id"] == elementID);
    let infoCard = document.getElementById("InfoCard");
  
    infoCard.innerHTML = generateOpenInfoCardHTML(element, elementID);
  
    renderAssignedContactsInfoCard(element[0]);
    renderSubtasksInfoCard(element[0], elementID);
}


/**
 * Closes the add task form.
 */
async function closeAddTaskForm(){       
    document.getElementById('slide-form-add-task').style.display = 'none';    
}


/**
 * Opens the add task form.
 */
function openAddTaskForm(){
    document.getElementById('slide-form-add-task').style.display = 'block';
    updateMinDate();
}


/**
 * Updates the created task.
 */
async function updateCreatedTask(){
    await createTask();
    await updateHTML();
    closeAddTaskForm();
}


/**
 * Updates the edited task.
 * @param {number} elementID - The ID of the element being edited.
 */
async function updateEditTask(elementID){
    await createTask();
    await deleteTask(elementID);
}

/**
 * Updates the edited task.
 * @param {number} elementID - The ID of the element being edited.
 */
async function updateEditedTask(elementID){
    const currentTask = allTasks.filter(task => task.id === elementID)
    const title = document.getElementById('add-task-title').value;
    const description = document.getElementById('add-task-description').value;
    const date = document.getElementById('add-task-date').value;
    const priority = assignPriority(selectedPriority)
    const category = selectedCategory;
    const subtasks = await getSubtasks();
    let subtask = subtasks.filter(task => task.todo_item === elementID)

    let allUsers = await getUsers()
    const currentAssignedContacts = currentTask[0].users;

    let matchingUsers = [];
    for (let user of allUsers) {
        if (currentAssignedContacts.includes(user.id)) {
            matchingUsers.push(user.id);
            }
    }

    renderAssignableContactsEdit(elementID);
    await updateTodo(title, description, date, priority, matchingUsers, category, subtask, currentTask[0].id, subtask.id)
    await updateHTML();
    location.reload();
}


/**
 * Handles the selection/deselection of an assigned contact for a specific task.
 * @param {string} elementID - The unique identifier of the task element.
 * @param {number} index - The index of the contact.
 * @returns {void} - The function does not return a value.
 */
function selectAssignedContact(elementID, index){
    let contact = document.getElementById(`contact-${index}`);
    const assignedContact = selectedContacts;
    const taskIndex = allTasks.findIndex(task => task.id === elementID);
    if (taskIndex === -1) {
        return;
    }
    if (contact.classList.contains('selectedContact')) {
        const combinedAssignedContacts = [...allTasks[taskIndex]['user'], ...['user']];
        const uniqueAssignedContacts = [...new Set(combinedAssignedContacts)];

        allTasks[taskIndex]['user'] = uniqueAssignedContacts;
        console.log('ffjfjfj', allTasks[taskIndex].user)

    } 
    else {
        const existingContactIndex = allTasks[taskIndex]['user'].indexOf(assignedContact);
        allTasks[taskIndex]['user'].splice(existingContactIndex, 1);
        console.log('ffjfjfj', allTasks[taskIndex].user)

    }  
    
    // setItem('allTasks', JSON.stringify(allTasks));
    renderAssignableContactsEdit(elementID);
}

/**
 * Deletes a task.
 * @param {number} elementID - The ID of the element being deleted.
 */
async function deleteTask(elementID) {
        await deleteTodo(elementID)
        closeTaskPopup();
        updateHTML();
}


/**
 * Opens the edit task form for a specific task.
 * @param {number} elementID - The ID of the element being edited.
 */
async function editTask(elementID){
    // currentTodoId = elementID;
    const allSubtasks = await getSubtasks();
    const allTodos = await getTodos();
    const element = allTodos.filter(task => task.id  === elementID);
    let infoCard = document.getElementById('InfoCard');
    selectedPriority = element[0].priority
    infoCard.innerHTML =  openEditTaskForm(element, elementID);
    currentTodoId = elementID
    let subtasks = allSubtasks.filter(task => task.todo_item === elementID);
    if (subtasks.length > 0) {
        for (let i = 0; i < subtasks.length; i++) {
            document.getElementById('add-task-subtask-list').innerHTML += subtaskListInnerHTML(i, subtasks);
        }

    }
}


/**
 * Counts the number of open subtasks.
 * @param {Array} element - The element containing task information.
 * @returns {number} - The count of open subtasks.
 */
function countOpenSubtasks(element) {
    let subTaskDone =  element['subtask'].filter(subtask => subtask['status'] === 'done').length;

    if (element['subtask'] && element['subtask'].length > 0) {
        return subTaskDone
    } else {
        return 0;
    }
}


/**
 * Capitalizes the first letter of each word in a text.
 * @param {string} text - The input text.
 * @returns {string} - The text with first letters capitalized.
 */
function getFirstLettersUppercase(text) {
    if (!text) return '';
    return text.replace(/-/g, ' ').split(' ').map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()).join(' ');
}


/**
 * Gets the initials from a full name.
 * @param {string} fullName - The full name.
 * @returns {string} - The initials.
 */
function getInitials(fullName) {
    const nameParts = fullName.split(' ');
    const initials = nameParts.map(part => part.charAt(0)).join('');
    return initials;
}


/**
 * Reverses the date format.
 * @param {string} originalDate - The original date.
 * @returns {string} - The reversed date.
 */
function reverseDate(originalDate) {
    const parts = originalDate.split('-');
    const reversedParts = parts.reverse();
    const reversedDate = reversedParts.join('/');
    return reversedDate;
}

/**
 * Searches for tasks.
 */
function searchTasks() {
    updateHTML();
}


/**
 * Filters an array of tasks based on a search input by matching against task titles and descriptions.
 * @param {Array} tasks - The array of tasks to be filtered.
 * @param {string} searchInput - The search input to match against task titles and descriptions.
 * @returns {Array} - The filtered array of tasks that match the search input.
 */
function filterTasksBySearch(tasks, searchInput) {
    return tasks.filter(task =>
        (task.title && task.title.toLowerCase().includes(searchInput)) ||
        (task.description && task.description.toLowerCase().includes(searchInput))
    );
}

/**
 * Closes the task popup.
 */
function closeTaskPopup() {
    const popup = document.querySelector('.popup');
    if (popup) {
        popup.remove();
    }
}


/**
 * Prevents closing of open infocard div.
 * @param {Event} event - The event.
 */
function doNotClose(event) {
    event.stopPropagation();
}