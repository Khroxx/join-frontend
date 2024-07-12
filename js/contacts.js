let allContacts = [];
let loadedContacts = [];

// Initiate body onload
async function contactsInit() {
  await saveContacts();
  await loadContacts();
}

// save actual Contacts
async function saveContacts() {
  // const existingContactsString = await getItem("kontakte");
  // const existingContacts = existingContactsString ? JSON.parse(existingContactsString) : [];
  // await setItem("kontakte", JSON.stringify(existingContacts));
  allContacts = await getUsers();
  // nicht mehr nötig zu saven
}

// load contacts from storage
async function loadContacts() {
  try {
      const contacts = await getUsers();
      if (contacts) {
          contacts.sort((a, b) => a.username.localeCompare(b.username));
          // console.log(contacts)
          await contactsListRender(contacts);
      }
  } catch (error) {
    // console.log('removing')
    console.error(error)
      // await removeErrorContacts();
  }
}


//removes contact, if it causes an error to load
async function removeErrorContacts() {
  const contactsToRemove = [];
  for (let i = 0; i < loadedContacts.length; i++) {
      const contact = loadedContacts[i];
      if (!contact.name || !contact.email || !contact.phone) {
          contactsToRemove.push(i);
      }
  }
  for (let i = contactsToRemove.length - 1; i >= 0; i--) {
      loadedContacts.splice(contactsToRemove[i], 1);
  }
  // await setItem("kontakte", JSON.stringify(loadedContacts));
  contactsListRender(loadedContacts);
}

// render ContactList into HTML
async function contactsListRender(contacts) {
    let contactsList = document.getElementById("contacts");
    contactsList.innerHTML ='';
    for (let i = 0; i < contacts.length; i++) {
      const contact = contacts[i];
      contactsList.innerHTML += contactList(contact, i);
    }
}

// get first uppercase letter from name, aswell from last name, then return HTML
function contactList(contact, i) {
  let words = contact.username.split(" ");
  let uppercaseLetter = words.map(word => word.charAt(0).toUpperCase()).join("");
  let firstLetter = uppercaseLetter.charAt(0);

  if (contactList.lastFirstLetter === undefined || contactList.lastFirstLetter !== firstLetter) {
    contactList.lastFirstLetter = firstLetter;
    return `<div class="firstLetter">${firstLetter}</div>
            ${contactInfo(contact, uppercaseLetter, i)}`;
  } else {
    return `${contactInfo(contact, uppercaseLetter, i)}`;
  }
}

// contactlist HTML
function contactInfo(contact, uppercaseLetter, i) {
  if (contact.username == "Guest"){
    contact.email = ''
  }
  return `
        <div class="spacer">
        <svg xmlns="http://www.w3.org/2000/svg" width="353" height="2" viewBox="0 0 353 2" fill="none">
        <path d="M0.5 1H352.5" stroke="#D1D1D1" stroke-linecap="round"/>
        </svg>
        </div>
        <div class="contactInfo" id="contactInfo${i}" onclick="openContactView(${i})">
        <div class="profileBadge">
                <svg xmlns="http://www.w3.org/2000/svg" width="43" height="42" viewBox="0 0 43 42" fill="none">
                    <circle cx="21.5" cy="21" r="20" fill="#FF7A00" stroke="white" stroke-width="2"/>
                    <text font-size="12px" text-anchor="middle" x="50%" y="50%" fill="white" stroke-width="0.1px" dy=".3em">${uppercaseLetter}</text>
                </svg>
                </div>
                <h2 id="contactName${i}">${contact.username} <p id="contactMail${i}">${contact.email}</p></h2>
            </div>
    `;
}

// close if contact is open, else open clicked contact
let lastClickedContact = null;

async function openContactView(i) {
  let contactInfoId = "contactInfo" + i;
  let contactView = document.getElementById("contactView");
  if (lastClickedContact === contactInfoId) {
    removeContactView(contactView);
    return;
  }
  lastClickedContact = contactInfoId;
  removeContactView(contactView);
  setTimeout(() => {
    showContactView(i);
  }, 150);
}

//shows contact window
async function showContactView(i){
  document.getElementById('mobileOptions').classList.add("mobileOptionsOn");
  // const contactsString = await getItem("kontakte");
  const contactsString = await getUsers();

  // loadedContacts = JSON.parse(contactsString);
  contactsString.sort((a, b) => a.username.localeCompare(b.username));
  const contact = contactsString[i];



  const { username, email, phone } = contact;
  contactView.classList.add('contactViewOn');
  contactView.classList.remove('contactViewOff');
  let words = contact.username.split(" ");
  let uppercaseLetter = words.map(word => word.charAt(0).toUpperCase()).join("");
  let firstLetter = uppercaseLetter.charAt(0);
  // const uppercaseLetter = username.split("").filter((char) => /[A-Z]/.test(char)).join("");
  contactView.innerHTML = "";
  contactView.innerHTML += renderContactView(contact.id, username, email, phone, firstLetter);
  changeContactColor(i);
  currentEditIndex = i;
}

// contact info render html
function renderContactView(i, name, email, phone, firstLetter) {
  if (name == "Guest"){
    email = '',
    phone = ''
  }
  return `
        <div class="mobileBackArrow" onclick="openContactView(${i})">
          <img src="assets/img/arrow-left-line.png" alt="">
        </div>
    <div class="contacts-top">
    <h2>Contact Information</h2>
    <div class="contactsProfileTop">
      <div class="profileBadge contactViewBadge">
        <svg
        xmlns="http://www.w3.org/2000/svg"
        width="120"
        height="120"
        viewBox="0 0 43 42"
        fill="none"
      >
        <circle
          cx="21.5"
          cy="21"
          r="20"
          fill="#FF7A00"
          stroke="white"
          stroke-width="2"
        />
        <text id="profileBadge"
          font-size="20px"
          text-anchor="middle"
          x="50%"
          y="50%"
          fill="white"
          stroke-width="0.1px"
          dy=".3em"
        >
          ${firstLetter}
        </text>
      </svg>
    </div>
    <div class="profileName">
      <h1 id="profileName">${name}</h1>
      <div class="profileActions">
        <button class="profileEdit" onclick="editContact(${i})">
          <img src="assets/img/edit.png" alt=""/> Edit
        </button>
        <button class="profileDel" onclick="delContact(${i})">
          <img src="assets/img/delete.png" alt=""/> Delete
        </button>
      </div>
      </div>
    </div>
  </div>
  <h2>Contact Information</h2>
    <div class="contactMailPhone">
      <div class="contactEmail">
          <h3>Email</h3>
          <p id="profileEmail">${email}</p>
      </div>
      <div class="contactPhone"> 
          <h3>Phone</h3>
          <p id="profilePhone">+${phone}</p>
      </div>
    </div> `;
}

function removeContactView(contactView){
  contactView.classList.add('contactViewOff');
  contactView.classList.remove('contactViewOn');
  document.getElementById('mobileOptions').classList.remove("mobileOptionsOn");
  removeWhiteColor();
  setTimeout(() => (contactView.innerHTML = ""), 100);
}

// changes color when contactView is opened
function changeContactColor(i) {
    const contactElement = document.getElementById(`contactInfo${i}`);
    const nameElement = document.getElementById(`contactName${i}`);
    const mailElement = document.getElementById(`contactMail${i}`);
      addWhiteColor(contactElement, nameElement, mailElement);
}

// adds font color to clicked contactView element
function addWhiteColor(contactElement, nameElement, mailElement){
  contactElement.classList.add("blueColor");
  nameElement.classList.add("whiteColor");
  mailElement.classList.add("whiteColor");
}

//removes font color 
function removeWhiteColor(){
  let info = document.getElementsByClassName('contactInfo');
  for (let i = 0; i < info.length; i++) {
    const contactElement = document.getElementById(`contactInfo${i}`);
    const nameElement = document.getElementById(`contactName${i}`);
    const mailElement = document.getElementById(`contactMail${i}`);    3
    contactElement.classList.remove("blueColor");
    nameElement.classList.remove("whiteColor");
    mailElement.classList.remove("whiteColor");
  }
}

// opens Add New Contact Window popup
function addNewContactWindow() {
  let addNewContact = document.getElementById("addContact");
  addNewContact.style.display = 'flex';
  setTimeout(() => {
    addNewContact.classList.add('addContactOn');
  }, 1);
  document.getElementById("popup-bg").style.display = "block";

}

// responsive mobile options window for Edit and Delete button
function mobileOptionsWindow(){
  document.getElementById("popup-bg").style.display = "block";
  let window = document.getElementById('mobileOptionsWindow');
  window.style.display = "inline-flex";
  window.style.zIndex = 100;
}

// function for mobile contact editing
async function mobileEditContact(){
  editContact(currentEditIndex);
}

// function for mobile contact deleting
async function mobileDelContact(){
  delContact(currentEditIndex);
}


// takes the input from add contact window and adds the contact to storage if its not a duplicate name
async function addContact(){
  try {
    let { addContactNameInput, addContactEmailInput, addContactPhoneInput } = getAddContactInputs();
    let newContact = createNewContact(addContactNameInput.value, addContactEmailInput.value, addContactPhoneInput.value);

    if (loadedContacts.some(contact => contact.username.toLowerCase() === addContactNameInput.value.toLowerCase())) {
      closeAddNewContact();
    } else {
      await handleValidContact(newContact);
      return false;
    }
  } catch (error) {
    return false;
  }
}

// get the data from input
function getAddContactInputs() {
  const addContactNameInput = document.getElementById('addContactName');
  const addContactEmailInput = document.getElementById('addContactEmail');
  const addContactPhoneInput = document.getElementById('addContactPhone');

  const nameError = errorMessages(addContactNameInput, 'nameError');
  const emailError = errorMessages(addContactEmailInput, 'emailError');
  const phoneError = errorMessages(addContactPhoneInput, 'phoneError');
  
  if (nameError || emailError || phoneError) {
    return null;
  }
  return {
    addContactNameInput,
    addContactEmailInput,
    addContactPhoneInput
  };
}

//check input for wrong input
function errorMessages(input, errorId) {
  let numbers = /^[0-9]+$/;
  
  if (!input.value.trim()) {
    document.getElementById(errorId).style.display = 'block';
    return true;
  }
  if (input.id === 'addContactEmail' && !input.value.includes('@')) {
    document.getElementById(errorId).style.display = 'block';
    return true;
  }
  if (input.id === 'addContactPhone' && !input.value.match(numbers)) {
    document.getElementById(errorId).style.display = 'block';
    return true;
  }
  else {
   
  document.getElementById(errorId).style.display = 'none';
    return 
  }
}

//creates a new contact with the input
function createNewContact(name, email, phone) {
  return {
    name,
    email,
    phone,
    id: new Date().getTime()
  };
}

// handles contact that does not exist and adds it to storage
async function handleValidContact(newContact) {
  loadedContacts.push(newContact);
  loadedContacts.sort((a, b) => a.username.localeCompare(b.username));
  await setUser(loadedContacts.email, loadedContacts.username, loadedContacts.password)
  // await setItem("kontakte", JSON.stringify(loadedContacts));
  await contactsListRender(loadedContacts);
  closeAddNewContact();
  setTimeout(addContactSuccess, 800);
}


async function addMobileContact() {  
  addNewContactWindow();
}

// popup to show contact add success
function addContactSuccess(){
  let success = document.getElementById('newContactSuccess');
  success.style.display = 'inline-flex';
    setTimeout(function() {
      success.style.top = '50%';
  }, 50)
  setTimeout(addContactSuccessClose, 2000);
}

// closes the success popup again
function addContactSuccessClose(){
  let success = document.getElementById('newContactSuccess');
  success.style.top = '120%';
  setTimeout(function() {
    success.style.display = 'none';  
}, 50)
}

let currentEditIndex; 


// edit clicked contact 
async function editContact(i) {
  let editContactWindow = document.getElementById("editContact");
  editContactWindow.style.display = 'inline-flex';
  setTimeout(() => {
    editContactWindow.classList.add('editContactOn');
  }, 1);
  // const contact = JSON.parse(await getItem("kontakte"))[i];
  // const contact = localStorage.getItem('User')
  const contacts = await getUsers()
  const contact = contacts[i - 1]
  // console.log(contact)
  let words = contact.username.split(" ");
  let uppercaseLetter = words.map(word => word.charAt(0).toUpperCase()).join("");
  let firstLetter = uppercaseLetter.charAt(0);
  // const uppercaseLetter = contact.username.split("").filter((char) => /[A-Z]/.test(char)).join("");

  document.getElementById("popup-bg").style.display = "block";
  document.getElementById("editContactName").value = contact.username;
  document.getElementById("editContactEmail").value = contact.email;
  document.getElementById("editContactPhone").value =  contact.phone;
  document.getElementById("contactEditImage").innerHTML = firstLetter;
  currentEditIndex = i;
  
}

// save edited contact to storage
async function saveChangeContact() {
  const editedIndex = currentEditIndex - 1;
  // const contactsString = await getItem("kontakte");
  loadedContacts = await getUsers()
  // loadedContacts = JSON.parse(contactsString);
  const editedContact = loadedContacts[editedIndex];
const edits = getChangedEdits();
if (!edits){
  return
} else {
  let { editedName, editedEmail, editedPhone } = edits;
  editedContact.username = editedName;
  editedContact.email = editedEmail;
  editedContact.phone = editedPhone;
  await updateUser(editedEmail, editedName, editedPhone, editedContact.id);
  loadedContacts = await getUsers();
  loadedContacts.sort((a, b) => a.username.localeCompare(b.username));
  contactsListRender(loadedContacts);
  closeEditContact();
  closeMobileOptionsWindow();
  location.reload
  openContactView(editedIndex)
}
}

// gets the input from the changed contact
function getChangedEdits(){
  const name = document.getElementById("editContactName");
  const email = document.getElementById("editContactEmail");
  const phone = document.getElementById("editContactPhone");
  const nameError = errorMessages(name, 'editNameError');
  const emailError = errorMessages(email, 'editEmailError');
  const phoneError = errorMessages(phone, 'editPhoneError');
  const editedName = name.value;
  const editedEmail = email.value;
  const editedPhone = phone.value;
  
  if (nameError || emailError || phoneError) {
    return ;
  }
  return {
    editedName,
    editedEmail,
    editedPhone
  };
}

// delete edited contact from storage
async function delEditedContact(){
  const deletedIndex = currentEditIndex - 1;
  // const contactsString = await getItem("kontakte");
  loadedContacts = JSON.parse(contactsString);
  loadedContacts.splice(deletedIndex, 1)[0];
  delContact(deletedIndex)
  // await setItem("kontakte", JSON.stringify(loadedContacts));
  contactsListRender(loadedContacts);
  openContactView(currentEditIndex)
  closeEditContact();
  closeMobileOptionsWindow();
}

// delete contact from storage
async function delContact(i) {
    await deleteUser(i);
    loadedContacts = await getUsers()
    contactsListRender(loadedContacts);
    openContactView(i);
    closeMobileOptionsWindow();
    location.reload()
}

// close add new contact popup
function closeAddNewContact() {
  let addNewContact = document.getElementById("addContact");
  addNewContact.classList.remove('addContactOn');
  document.getElementById("popup-bg").style.display = "none";
  addNewContact.style.display = 'none';
  document.getElementById('addContactName').value = '';
  document.getElementById('addContactEmail').value ='';
  document.getElementById('addContactPhone').value ='';
  resetError()
}

// close edit contact popup
function closeEditContact() {
  let editContactWindow = document.getElementById("editContact");
  editContactWindow.classList.remove('editContactOn');
  editContactWindow.style.display = 'none'
  document.getElementById("popup-bg").style.display = "none";
  document.getElementById("editContactName").value = '';
  document.getElementById("editContactEmail").value = '';
  document.getElementById("editContactPhone").value = '';
  resetError()
}

// changes display of errors back to none
function resetError() {
  document.getElementById('nameError').style.display = 'none';
  document.getElementById('emailError').style.display = 'none';
  document.getElementById('phoneError').style.display = 'none';
  document.getElementById('editNameError').style.display = 'none';
  document.getElementById('editEmailError').style.display = 'none';
  document.getElementById('editPhoneError').style.display = 'none';
}


function closeWindow(element){
  element.style.display = "none";
}

// close mobile options for Edit and Delete
function closeMobileOptionsWindow(){
  let window = document.getElementById('mobileOptionsWindow');
  window.style.display = "none";
  document.getElementById("popup-bg").style.display = "none";
}

// adds a listener to popup background to close itself and other functions
document.addEventListener("DOMContentLoaded", function () {
  let popupBg =  document.getElementById("popup-bg")
    if (popupBg) {
      popupBg.addEventListener("click", function (event) {
        event.stopPropagation();
        popupBg.style.display = "none";
        closeAddNewContact();
        closeEditContact();
        closeMobileOptionsWindow();
      });
    }

});

