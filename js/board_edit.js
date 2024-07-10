
/**
 * Renders mini representations of selected contacts for  ing.
 * @param {Array} selectedContactsEdit - The array containing information about selected contacts for editing.
 * @returns {string} - The HTML string representing mini contact representations.
 */
function renderSelectedContactsMiniEdit(selectedContactsEdit) {
    let miniContacts = [];
    let allUsers = allContacts[0];
    if (selectedContactsEdit && selectedContactsEdit.length > 0) {
        for (let i = 0; i < allUsers.length; i++) {
            if (selectedContactsEdit.includes(allUsers[i].id)) {
                miniContacts.push(allUsers[i].username);
            }
        }
    }
    return miniContacts;
}


/**
 * Shows or hides the contacts section for task editing based on the provided element ID.
 * @param {string} elementID - The unique identifier of the task element.
 * @returns {void} - The function does not return a value.
 */
function showAndHideContactsEdit(elementID) {
    // let allUsers = allContacts[0];
    // let selectedContactsEdit = [];
    
    // let thisElement = allTasks.filter(task => task.id === elementID)
    let selectedContactsMini = document.getElementById('add-task-selected-contacts-mini');
    let contactBox = document.getElementById('add-task-contacts-to-assigne-edit');
    let contactDropdown = document.getElementById('add-task-assigne');
    let contactSearchbarContainer = document.getElementById('searchbar-add-contacts-container');

    if (contactBox.classList.contains('d-none')) {
        showContactsEdit(selectedContactsMini, contactBox, contactDropdown, contactSearchbarContainer);
    } else {
        hideContactsEdit(selectedContactsMini, contactBox, contactDropdown, contactSearchbarContainer);
    }
}


/**
 * Shows the contacts section for task editing by removing the 'd-none' class from relevant elements.
 * @param {HTMLElement} selectedContactsMini - The DOM element for displaying mini representations of selected contacts.
 * @param {HTMLElement} contactBox - The DOM element for the contacts box to assign for editing.
 * @param {HTMLElement} contactDropdown - The DOM element for the contacts dropdown.
 * @param {HTMLElement} contactSearchbarContainer - The DOM element for the search bar container in the contacts section.
 * @returns {void} - The function does not return a value.
 */
function showContactsEdit(selectedContactsMini, contactBox, contactDropdown, contactSearchbarContainer) {
    contactBox.classList.remove('d-none');
    contactDropdown.classList.add('d-none');
    contactSearchbarContainer.classList.remove('d-none');
    selectedContactsMini.classList.add('d-none');
}


/**
 * Hides the contacts section for task editing based on the provided conditions.
 * @param {HTMLElement} selectedContactsMini - The DOM element for displaying mini representations of selected contacts.
 * @param {HTMLElement} contactBox - The DOM element for the contacts box to assign for editing.
 * @param {HTMLElement} contactDropdown - The DOM element for the contacts dropdown.
 * @param {HTMLElement} contactSearchbarContainer - The DOM element for the search bar container in the contacts section.
 * @param {Array} selectedContactsEdit - The array containing information about selected contacts for editing.
 * @returns {void} - The function does not return a value.
 */
function hideContactsEdit(selectedContactsMini, contactBox, contactDropdown, contactSearchbarContainer,selectedContactsEdit) {
    if (document.location.pathname.includes('add_task.html') || document.location.pathname.includes('board.html')) {
        contactBox.classList.add('d-none');
        contactSearchbarContainer.classList.add('d-none');
        contactDropdown.classList.remove('d-none');
        selectedContactsMini.classList.remove('d-none');
        selectedContactsMini.innerHTML = renderSelectedContactsMiniEdit(selectedContactsEdit);
    }
}


/**
 * Renders the HTML content for assignable contacts for task editing based on the provided element ID.
 * @param {string} elementID - The unique identifier of the task element.
 * @returns {string} - The HTML string representing assignable contacts for task editing.
 */
function renderAssignableContactsEdit(elementID){
    const element = allTasks.filter(task => task.id  === elementID);
    const promises = allContacts[0].map((contact, index) => 
        assignContactsTemplateEdit(contact.username, index, element, elementID)
    );
    const content = promises
    return content;
}


/**
 * Generates HTML template for an assignable contact for task editing.
 * @param {string} name - The name of the contact.
 * @param {number} index - The index of the contact.
 * @param {Array} element - The array containing information about the task.
 * @param {string} elementID - The unique identifier of the task element.
 * @returns {string} - The HTML string representing the contact template for task editing.
 */
function assignContactsTemplateEdit(username, index, element, elementID) {
    let allNames = allContacts[0].map(contact => contact.username);
    const assignedContactsUsernames = element[0].users.map(contactId => allContacts[0].find(contact => contact.id === contactId).username);

    const contactElement = document.createElement('div');
    let selectedClass = '';
    let checkboxImage = `assets/img/add-task/checkbox.png`;

    if (assignedContactsUsernames.includes(username)) {
        selectedClass = 'selectedContact';
        checkboxImage = 'assets/img/add-task/checkbox-checked.png';
    }

    contactElement.innerHTML += contactElementEditInnerHTML(elementID, index, selectedClass, {username}, checkboxImage);
    const checkboxImgElement = contactElement.querySelector(`#contact-checkbox-${index}`);
    if (selectedClass === 'selectedContact') {
        checkboxImgElement.style.filter = 'brightness(0) saturate(100%) invert(87%) sepia(14%) saturate(5010%) hue-rotate(541deg) brightness(250%) contrast(155%)';
    }
    return contactElement.innerHTML;
}

function findContactByUsername(element, username) {
    const users = allContacts[0]
    const filteredUsers = users.filter(user => element[0].users.includes(user.id));
    const contactFound = filteredUsers.find(user => user.username === username);
    return contactFound;
}

/**
 * Searches and filters contacts for task editing based on the provided element ID and search query.
 * @param {string} elementID - The unique identifier of the task element.
 * @returns {void} - The function does not return a value.
 */
async function searchContactToAddEdit(elementID) {
    const element = allTasks.filter(task => task.id  === elementID);
    searchQuery = document.getElementById('searchbar-add-contacts').value.toLowerCase();
    const filteredContacts = allContacts[0].filter(contact => contact.username.toLowerCase().startsWith(searchQuery));
    const promises = filteredContacts.map((contact, index) => assignContactsTemplateEdit(contact.username, index, element, elementID));
    const resolvedContents = await Promise.all(promises);
    const content = resolvedContents.join('');
    document.getElementById('add-task-contacts-to-assigne-edit').innerHTML = content;
}


/**
 * Generates the inner HTML for a contact element in task editing based on the provided parameters.
 * @param {string} elementID - The unique identifier of the task element.
 * @param {number} index - The index of the contact.
 * @param {string} selectedClass - The class indicating whether the contact is selected.
 * @param {string} name - The name of the contact.
 * @param {string} checkboxImage - The source URL of the checkbox image.
 * @returns {string} - The inner HTML string for the contact element in task editing.
 */
function contactElementEditInnerHTML(elementID, index, selectedClass, name, checkboxImage) {

    return (
        `
        <div onclick="selectContact(${index}), selectAssignedContact(${elementID}, ${index})" id="contact-${index}" class="add-task-contacts-to-assigne-list-item ${selectedClass}">
            <div class="name-box">${getInitials(name.username)}</div>
            <div class="name">${name.username}</div>
            <div class="checkbox"><img id="contact-checkbox-${index}" src="${checkboxImage}" alt="checkbox"></div>
        </div>
        `
    );

}
