let subtaskArray = []

/**
 * Confirms the addition of a subtask to the list.
 * @function
 */
async function confirmAddSubtask() {
    let subtaskInput = document.getElementById('add-task-subtask-input');
    let subtaskList = document.getElementById('add-task-subtask-list');
    let subtaskAlert = document.getElementById('add-task-subtask-alert');
    if (subtaskInput.value.trim() == '') {
        subtaskAlert.classList.remove('d-none');
    } else {
        let subtaskArray = [{
            text: subtaskInput.value,
        }]
        // if (currentTodoId != undefined){
            await setSubtask(currentTodoId, subtaskArray)
        // }
        subtaskList.innerHTML = renderSubtasksAddTask();
        subtaskInput.value = '';
        removeAlertSubtask();
    }
}

async function holdSubtasks(){
    let subtaskInput = document.getElementById('add-task-subtask-input');
    let subtaskList = document.getElementById('add-task-subtask-list');
    let subtaskAlert = document.getElementById('add-task-subtask-alert');
    if (subtaskInput.value.trim() == '') {
        subtaskAlert.classList.remove('d-none');
    } else {
        subtaskArray.push({"text":  subtaskInput.value})
        // console.log('array', subtaskArray)
        subtaskList.innerHTML = renderSubtasksAddTask();
        removeAlertSubtask();
        // console.log(subtaskArray)
        subtaskInput.value = '';
        return subtaskArray

    }
}


/**
 * Removes the alert for adding subtasks by hiding the corresponding DOM element.
 * @returns {void} - The function does not return a value.
 */
function removeAlertSubtask() {
    let subtask = document.getElementById('add-task-subtask-alert');
    subtask.classList.add('d-none');
}


/**
 * Deletes the added subtask at the specified index.
 * @param {number} i - The index of the subtask to be deleted.
 * @function
 */
async function deleteAddedSubtask(i, subId) {
    let subtaskList = document.getElementById('add-task-subtask-list');
    await deleteSubtasks(subId)
    subtaskList.innerHTML = renderSubtasksAddTask();
}


/**
 * Opens the editing mode for the added subtask at the specified index.
 * @param {number} i - The index of the subtask to be edited.
 * @function
 */
function openEditAddedSubtask(i, subtaskId) {
    let subtaskInput = document.getElementById(`add-task-subtask-input${i}`);
    let subtaskListItem = document.getElementById(`add-task-subtask-list-item${i}`);
    let subtaskEditContainer = document.getElementById(`add-task-edit-input-container${i}`);
    let thisTask = subtasks.find(task => task.id ===  subtaskId)
    subtaskInput.value = thisTask.text
    subtaskListItem.classList.add('d-none');
    subtaskInput.classList.remove('d-none');
    subtaskEditContainer.classList.remove('d-none');
}


/**
 * Confirms the edit for the subtask at the specified index.
 * @param {number} i - The index of the edited subtask.
 * @function
 */
async function confirmEditSubtask(i, subtaskId) {
    let subtaskInput = document.getElementById(`add-task-subtask-input${i}`);
    let subtaskListItem = document.getElementById(`add-task-subtask-list-item${i}`);
    let subtaskEditContainer = document.getElementById(`add-task-edit-input-container${i}`);
    let subtaskList = document.getElementById('add-task-subtask-list');
    let subtaskEditEmptyAlert = document.getElementById(`add-task-subtask-edit-${i}`);
    if (subtaskInput.value.trim() == '') {
        subtaskEditEmptyAlert.classList.remove('d-none');
    } else {
        let thisTask = subtasks.find(task => task.id ===  subtaskId)
        thisTask.text = subtaskInput.value;
        // console.log(subtasks[i])
        await updateSubtasks(thisTask.todo_item, thisTask.text, thisTask.status, thisTask.id)
        subtaskEditEmptyAlert.classList.add('d-none');
        subtaskListItem.classList.remove('d-none');
        subtaskInput.classList.add('d-none');
        subtaskEditContainer.classList.add('d-none');
        subtaskList.innerHTML = renderSubtasksAddTaskDifferent(thisTask.todo_item);
        // closeTaskPopup(); // oder was um subtasks neu zu rendern richtig
        // editTask(thisTask.todo_item);    
    }
}

function renderSubtask(subtask, index) {
    return `<li id="add-task-subtask-list-item${index}">${subtask.text}</li>`;
}

function renderSubtasksAddTaskDifferent(todoId){
    let subtaskList = '';
    if (subtasks.length > 0){
        for (let i = 0; i < subtasks.length; i++) {
            if (subtasks[i].todo_item === todoId) {
                subtaskList += renderSubtask(subtasks[i], i);
            }
        }
    }
    return subtaskList;
    // let subtaskList = '';
    // if (subtasks.length > 0){
    //     for (let i = 0; i < subtasks.length; i++) {
    //         if (subtasks[i].todo_item === todoId) {
    //             subtaskList +=  (i, subtasks);
    //         }
    //     }
    // }
    // return subtaskList;
}


/**
 * Renders the HTML content for the list of subtasks in the "Add Task" form.
 * @returns {string} - The HTML content for the list of subtasks.
 * @function
 */
function renderSubtasksAddTask() {
    if (subtaskArray.length >= 0){
        // subtasks = subtaskArray;
        let subtaskList = [];
        if (subtaskArray.length > 0) {
            for (let i = 0; i < subtaskArray.length; i++) {
                if (subtaskArray[i].id === undefined) {
                    subtaskList +=  (`<li>${subtaskArray[i].text}</li>`);
                    // console.log('liste', subtaskList)

                }
            }
        }
    return subtaskList;

    }else {
    let subtaskList = [];
    if (subtasks.length > 0) {
        for (let i = 0; i < subtasks.length; i++) {
            if (subtasks[i].id === undefined) {
                console.log(subtasks[i])
                subtaskList +=  (i, subtasks);
            }
        }
    }
    return subtaskList;
    
    }
}


/**
 * Deletes the subtask at the specified index during the editing process.
 * @param {number} i - The index of the subtask to be deleted.
 * @function
 */
function deleteEditSubtask(i) {
    deleteAddedSubtask(i);
}


/**
 * Clears the selected state of all contacts.
 * @returns {void} - The function does not return a value.
 */
function clearContacts() {
    for (let i = 0; i < allContacts[0].length; i++) {
        clearContact(i);
    }
}


/**
 * Hides the action buttons for a specific subtask list element.
 * @param {number} i - The index of the subtask for which the action buttons should be hidden.
 * @function
 */
function addDisplayNone(i) {
    let subtaskListElementButtons = document.getElementById(`add-task-subtask-list-buttons${i}`);
    subtaskListElementButtons.classList.add('d-none');
}


/**
 * Reveals the action buttons for a specific subtask list element.
 * @param {number} i - The index of the subtask for which the action buttons should be revealed.
 * @function
 */
function removeDisplayNone(i) {
    let subtaskListElementButtons = document.getElementById(`add-task-subtask-list-buttons${i}`);
    subtaskListElementButtons.classList.remove('d-none');
}


/**
 * Clears the selected state of a contact by its ID.
 * @param {string} id - The unique identifier of the contact to be cleared.
 * @returns {void} - The function does not return a value.
 */
function clearContact(id) {
    let contact = document.getElementById(`contact-${id}`);
    let checkboxImage = document.getElementById(`contact-checkbox-${id}`);
    if (contact.classList.contains('selectedContact')) {
        unselectContact(contact, checkboxImage);
    }
}



/**
 * Clears the input form for adding a new task.
 * @function
 */
function clearForm() {
    document.querySelector('input[type="date"]').value = '';
    document.getElementById('add-task-title').value = '';
    document.getElementById('add-task-description').value = '';
    document.getElementById('add-task-date').value = '';
    document.getElementById('add-task-subtask-input').value = '';
    selectedCategory = null;
    resetColorAll();
    document.getElementById('add-task-currently-selected-category').innerHTML = selectedTaskInnerHTML('');
    selectedContacts = [];
    document.getElementById('add-task-selected-contacts-mini').innerHTML = renderSelectedContactsMini();
    subtasks = [];
    document.getElementById('add-task-subtask-list').innerHTML = renderSubtasksAddTask();
    clearContacts();
    changePriority('medium');
}


/**
 * Displays a success popup for the added task.
 * @function
 */
function taskAddedPopup() {
    let success = document.getElementById('successTask');
    success.style.display = 'flex';
    setTimeout(function () {
        success.style.top = '50%';
    }, 50)
}