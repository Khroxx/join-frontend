let allTasks = [];
let allContacts = [];
let selectedPriority;
let selectedContact;
let selectedContacts = [];
let selectedCategory;
let subtasks = [];
let lastStatus = 'todo';
let searchQuery = '';
let currentTodoId = '';


/**
 * Initializes task data by loading contacts, tasks, and setting up the user interface. *
 * @async
 * @function
 */
async function initTaskData() {
    await loadContacts();
    await loadTasks();
    subtasks = await getSubtasks();
    document.getElementById('add-task-contacts-to-assigne').innerHTML = renderAssignableContacts();
    allTasks.forEach(task => {
        changePriority(task.priority);
    });
    updateMinDate();
}


/**
 * Generates a unique task ID based on the current timestamp and a random number.
 * @param {Array<number>} existingIDs - An array of existing task IDs to check for uniqueness.
 * @returns {number} - A unique task ID.
 * @function
 */
function generateTaskID(existingIDs) {
    let isUnique = false;
    let newID;
    while (!isUnique) {
        const timestamp = new Date().getTime();
        const random = Math.floor(Math.random() * 1000);
        newID = timestamp + random;
        isUnique = !existingIDs.includes(newID);
    }
    return newID;
}


/**
 * Creates a new task with the provided details and adds it to the task list.
 * @async
 * @function
 * @throws {Alert} - Displays alerts for missing priority or category selections.
 */
async function createTask() {
    let thisSubtasks = subtasks.filter(subtask => !subtask.id);

    const newTask = {
        title: document.getElementById('add-task-title').value,
        description: document.getElementById('add-task-description').value,
        date: document.getElementById('add-task-date').value,
        priority: assignPriority(selectedPriority),
        assignedContact: selectedContacts.map(contact => contact.id),
        category: selectedCategory,
        subtask: thisSubtasks,
        status: lastStatus
    };

    if (!selectedCategory) {
        alertCategory(selectedCategory);
        return;
    }
    try {
        
        allTasks.push(newTask);
        await setTodo(newTask.title, newTask.description, newTask.date, 
            newTask.priority, newTask.assignedContact, newTask.category,
            newTask.status, newTask.subtask);
    } catch (error){
        console.log('kein neues todo', error)
    }

    if (window.location.href.endsWith('add_task.html')) {
        taskAddedPopup();
        setTimeout(function () {
            window.location.href = 'board.html';
        }, 800);
    }
    clearForm();

}


/**
 * Displays or hides an alert for the task category based on the provided selection.
 * @param {boolean} selectedCategory - Indicates whether a category is selected or not.
 * @returns {void} - The function does not return a value.
 */
function alertCategory(selectedCategory) {
    let category = document.getElementById('add-task-category-alert');
    if (selectedCategory) {
        removeAlertCategory();
    } else {
        category.classList.remove('d-none');
    }
}


/**
 * Removes the alert for the task category by hiding the corresponding DOM element.
 * @returns {void} - The function does not return a value.
 */
function removeAlertCategory() {
    let category = document.getElementById('add-task-category-alert');
    category.classList.add('d-none');
}


/**
 * Updates the minimum date of the task input to the current date.
 * @async
 * @function
 */
async function updateMinDate() {
    let today = new Date().toISOString().split('T')[0];
    document.getElementById('add-task-date').min = today;
    document.getElementById('add-task-date').value = today;
}


/**
 * Loads tasks from local storage and populates the 'allTasks' array.f
 * @async
 * @function
 */
async function loadTasks() {
    let allTodos = await getTodos();
    allTasks = [...allTodos]
}


/**
 * Loads contacts from local storage and populates the 'allContacts' array.
 * @async
 * @function
 */
async function loadContacts() {
    const contacts = await getUsers();
    allContacts.push(contacts);
}


/**
 * Generates initials from a full name. *
 * @param {string} fullName - The full name from which initials are generated.
 * @returns {string} - The generated initials.
 * @function
 */
function getInitials(fullName) {
    if (!fullName) {
        return '';
    } else {
        const words = fullName.split(' ');
        const initials = words.map(word => word.charAt(0).toUpperCase());
        return initials.join('');
    }
}


/**
 * Searches for contacts to add based on the input search query. *
 * @function
 */
function searchContactToAdd() {
    searchQuery = document.getElementById('searchbar-add-contacts').value.toLowerCase();
    const filteredContacts = allContacts[0].filter(contact => contact.username.toLowerCase().startsWith(searchQuery));
    const content = filteredContacts.map((contact, index) => assignContactsTemplate(contact.username, index)).join('');
    document.getElementById('add-task-contacts-to-assigne').innerHTML = content;
}


/**
 * Selects or unselects a contact based on the provided ID and updates the selected contacts array.
 * @param {number} id - The ID of the contact to be selected or unselected.
 * @function
 */
function selectContact(id) {
    const filteredContacts = allContacts[0].filter(contact => contact.username.toLowerCase().startsWith(searchQuery));
    selectedContact = filteredContacts[id];
    let contact = document.getElementById(`contact-${id}`);
    let emailToRemoveContact = selectedContact.email;
    let indexToRemoveContact = selectedContacts.findIndex(selectedContact => selectedContact.email === emailToRemoveContact);
    const checkboxImage = document.getElementById(`contact-checkbox-${id}`);

    if (contact.classList.contains('selectedContact')) {
        unselectContact(contact, checkboxImage);
        if (indexToRemoveContact !== -1) {
            selectedContacts.splice(indexToRemoveContact, 1);
        }
    } else {
        selectedContacts.push(selectedContact);
        contact.classList.add('selectedContact');
        checkboxImage.src = 'assets/img/add-task/checkbox-checked.png';
        checkboxImage.style.filter = 'brightness(0) saturate(100%) invert(87%) sepia(14%) saturate(5010%) hue-rotate(541deg) brightness(250%) contrast(155%)';
    }
}


/**
 * Renders the HTML content for assignable contacts based on the 'allContacts' array.
 * @returns {string} - The HTML content for assignable contacts.
 * @function
 */
function renderAssignableContacts() {
    let content = '';
    for (let i = 0; i < allContacts[0].length; i++) {
        content += assignContactsTemplate(allContacts[0][i].username, i);
    }
    return content;
}


/**
 * Unselects a contact by removing the 'selectedContact' class and resetting the checkbox appearance.
 * @param {HTMLElement} contact - The DOM element representing the contact to be unselected.
 * @param {HTMLImageElement} img - The checkbox image element associated with the contact.
 * @function
 */
function unselectContact(contact, img) {
    contact.classList.remove('selectedContact');
    img.src = 'assets/img/add-task/checkbox.png';
    img.style.filter = 'none';
    selectedContact = null;
}


/**
 * Handles the selection of a task category, updates the UI, and sets the selected category.
 * @param {string} selectedTask - The selected task category ('technicaltask', 'userstory', or other).
 * @returns {string} - The selected task category.
 * @function
 */
function selectedTask(selectedTask) {
    document.getElementById('add-task-currently-selected-category').innerHTML = selectedTaskInnerHTML(selectedTask);
    showAndHideCategories();
    selectedCategory = selectedTask;
    return selectedTask;
}


/**
 * Toggles the visibility of the contacts section in the task creation form.
 * @function
 */
function showAndHideContacts() {
    let selectedContactsMini = document.getElementById('add-task-selected-contacts-mini');
    let contactBox = document.getElementById('add-task-contacts-to-assigne');
    let contactDropdown = document.getElementById('add-task-assigne');
    let contactSearchbarContainer = document.getElementById('searchbar-add-contacts-container');
    if (contactBox.classList.contains('d-none')) {
        showContacts(selectedContactsMini, contactBox, contactDropdown, contactSearchbarContainer);
    } else {
        hideContacts(selectedContactsMini, contactBox, contactDropdown, contactSearchbarContainer);
    }
}


/**
 * Displays the contacts section in the task creation form and updates related UI elements.
 * @param {HTMLElement} selectedContactsMini - The DOM element representing the mini contacts display.
 * @param {HTMLElement} contactBox - The DOM element representing the contacts box to be shown.
 * @param {HTMLElement} contactDropdown - The DOM element representing the contacts dropdown to be hidden.
 * @param {HTMLElement} contactSearchbarContainer - The DOM element representing the container of the contacts search bar.
 * @function
 */
function showContacts(selectedContactsMini, contactBox, contactDropdown, contactSearchbarContainer) {
    contactBox.classList.remove('d-none');
    contactDropdown.classList.add('d-none');
    contactSearchbarContainer.classList.remove('d-none');
    selectedContactsMini.classList.add('d-none');
}


/**
 * Hides the contacts section in the task creation form and updates related UI elements.
 * @param {HTMLElement} selectedContactsMini - The DOM element representing the mini contacts display.
 * @param {HTMLElement} contactBox - The DOM element representing the contacts box to be hidden.
 * @param {HTMLElement} contactDropdown - The DOM element representing the contacts dropdown to be shown.
 * @param {HTMLElement} contactSearchbarContainer - The DOM element representing the container of the contacts search bar.
 * @function 
 */
function hideContacts(selectedContactsMini, contactBox, contactDropdown, contactSearchbarContainer) {
    if (document.location.pathname.includes('add_task.html') || document.location.pathname.includes('board.html')) {
        contactBox.classList.add('d-none');
        contactSearchbarContainer.classList.add('d-none');
        contactDropdown.classList.remove('d-none');
        selectedContactsMini.classList.remove('d-none');
        selectedContactsMini.innerHTML = renderSelectedContactsMini();
    }
}


/**
 * Toggles the visibility of the task categories dropdown and updates the arrow indicator.
 * @function
 */
function showAndHideCategories() {
    let taskBox = document.getElementById('add-task-category-dropdown');
    let arrowCategories = document.getElementById('arrow-categories');
    if (taskBox.classList.contains('d-none')) {
        showCategories(taskBox, arrowCategories);
    } else {
        hideCategories(taskBox, arrowCategories);
    }
}


/**
 * Displays the task categories dropdown and rotates the arrow indicator.
 * @param {HTMLElement} taskBox - The DOM element representing the task categories dropdown to be shown.
 * @param {HTMLElement} arrowCategories - The DOM element representing the arrow indicator for task categories.
 * @function
 */
function showCategories(taskBox, arrowCategories) {
    taskBox.classList.remove('d-none');
    arrowCategories.style = 'transform: rotate(180deg);';
}


/**
 * Hides the task categories dropdown and resets the arrow indicator rotation.
 * @param {HTMLElement} taskBox - The DOM element representing the task categories dropdown to be hidden.
 * @param {HTMLElement} arrowCategories - The DOM element representing the arrow indicator for task categories.
 * @function
 */
function hideCategories(taskBox, arrowCategories) {
    if (document.location.pathname.includes('add_task.html') || document.location.pathname.includes('board.html')) {
        taskBox.classList.add('d-none');
        arrowCategories.style = 'transform: rotate(0deg);';
    }
}


/**
 * Handles the click event on the document and hides contacts and categories dropdowns.
 * @param {Event} event - The click event object.
 * @function
 */
function handleClick(event) {
    let selectedContactsMini = document.getElementById('add-task-selected-contacts-mini');
    let contactBox = document.getElementById('add-task-contacts-to-assigne');
    let contactDropdown = document.getElementById('add-task-assigne');
    let contactSearchbarContainer = document.getElementById('searchbar-add-contacts-container');
    let taskBox = document.getElementById('add-task-category-dropdown');
    let arrowCategories = document.getElementById('arrow-categories');
    if (getComputedStyle(event.target).cursor !== 'pointer') {
        hideContacts(selectedContactsMini, contactBox, contactDropdown, contactSearchbarContainer);
        hideCategories(taskBox, arrowCategories);
    }
}
// Add the 'click' event listener to the document, calling the 'handleClick' function
document.addEventListener('click', handleClick);



/**
 * Renders the HTML content for the mini display of selected contacts.
 * @returns {string} - The HTML content for the mini display of selected contacts.
 * @function
 */
function renderSelectedContactsMini() {
    let miniContacts = '';
    if (selectedContacts.length > 0) {
        for (let i = 0; i < selectedContacts.length; i++) {
            miniContacts += selectedContactMiniTemplate(getInitials(selectedContacts[i].username));
        }
    }
    return miniContacts;
}


/**
 * Generates the HTML template for a contact in the "Add Task" form.
 * @param {string} username - The full name of the contact.
 * @param {number} index - The index of the contact in the list.
 * @returns {string} - The HTML template for the contact.
 * @function
 */
function assignContactsTemplate(username, index) {
    const contactFound = selectedContacts.find(c => c.username == username);
    let selectedClass = '';
    let checkboxImage = `assets/img/add-task/checkbox.png`;
    if (contactFound) {
        selectedClass = 'selectedContact';
        checkboxImage = 'assets/img/add-task/checkbox-checked.png';
    }

    const contactElement = document.createElement('div');
    contactElement.innerHTML = contactElementInnerHTML(index, selectedClass, username, checkboxImage);
    const checkboxImgElement = contactElement.querySelector(`#contact-checkbox-${index}`);
    if (contactFound) {
        checkboxImgElement.style.filter = 'brightness(0) saturate(100%) invert(87%) sepia(14%) saturate(5010%) hue-rotate(541deg) brightness(250%) contrast(155%)';
    }
    return contactElement.innerHTML;
}