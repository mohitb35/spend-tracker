// const { default: axios } = require("axios");

const serverUrl = 'https://spend-tracker-35-api.herokuapp.com';

let regForm = document.getElementById("reg-form");
let loginForm = document.getElementById("login-form")
let name = document.getElementById("name");
let email = document.getElementById("email");
let password = document.getElementById("password");
let loginPassword = document.getElementById("login-password");

let addSpendForm = document.getElementById("add-spend-form");
let addItemName = document.getElementById("add-item-name");
let addItemSpendDate = document.getElementById("add-item-date");
let addItemAmount = document.getElementById("add-item-amount");
let addItemCategoryList = document.getElementById("add-item-category");
let addItemSubCategoryList = document.getElementById("add-item-sub-category");

let editSpendForm = document.getElementById("edit-spend-form");
let editItemName = document.getElementById("edit-item-name");
let editItemSpendDate = document.getElementById("edit-item-date");
let editItemAmount = document.getElementById("edit-item-amount");
let editItemCategoryList = document.getElementById("edit-item-category");
let editItemSubCategoryList = document.getElementById("edit-item-sub-category");

let monthSelector = document.getElementById("spend-month-selector");
let spendList = document.getElementById("spend-item-list");
let spendItems = document.getElementsByClassName("spend-items");
let deleteItemButtons = document.querySelectorAll(".delete-box a");
let deleteCloseButton = document.getElementById("delete-modal-close");
let deleteCancelButton = document.getElementById("delete-modal-cancel");
let deleteConfirmButton = document.getElementById("delete-modal-confirm");
let editItemButtons = document.querySelectorAll(".edit-box a");
let editCloseButton = document.getElementById("edit-modal-close");

/**
 * Validates the register form and shows errors as applicable
 * @param {Event} event - form submit event
 * @listens SubmitEvent
 */
function validateRegister(event) {
	// Check name
	let nameError = isTextInvalid(name.value, "name");
	let nameFormElement = name.parentNode;
	let nameErrorMessage = nameFormElement.lastElementChild;
	handleError (event, nameError, nameFormElement, nameErrorMessage);

	// Check email
	let emailError = isEmailInvalid(email.value);
	let emailFormElement = email.parentNode;
	let emailErrorMessage = emailFormElement.lastElementChild;
	handleError (event, emailError, emailFormElement, emailErrorMessage);

	// Check password
	let passwordError = isPasswordInvalid(password.value);
	let passwordFormElement = password.parentNode;
	let passwordErrorMessage = passwordFormElement.lastElementChild;
	handleError (event, passwordError, passwordFormElement, passwordErrorMessage);

	if(nameError || emailError || passwordError){
		event.preventDefault();
	} 
};

/**
 * Validates the login form and shows errors as applicable
 * @param {Event} event - form submit event
 * @listens SubmitEvent
 */
function validateLogin(event) {
	// Check email
	let emailError = isEmailInvalid(email.value);
	let emailFormElement = email.parentNode;
	let emailErrorMessage = emailFormElement.lastElementChild;
	handleError (event, emailError, emailFormElement, emailErrorMessage);

	// Check login password
	let loginPasswordError = isPasswordInvalid(loginPassword.value, true);
	let loginPasswordFormElement = loginPassword.parentNode;
	let loginPasswordErrorMessage = loginPasswordFormElement.lastElementChild;
	handleError (event, loginPasswordError, loginPasswordFormElement, loginPasswordErrorMessage);

	if(emailError || loginPasswordError){
		event.preventDefault();
	} 
};

/**
 * Validates the name field and shows errors as applicable
 * @param {Event} event - form submit event
 * @listens SubmitEvent
 */
function validateName(event) {
	let formElement = event.target.parentNode;
	let errorMessage = formElement.lastElementChild;
	let error = isTextInvalid(event.target.value, "name");

	handleError(event, error, formElement, errorMessage);
};

/**
 * Validates the email field and shows error as applicable
 * @param {Event} event - form submit event
 * @listens SubmitEvent
 */
function validateEmail(event) {
	let formElement = event.target.parentNode;
	let errorMessage = formElement.lastElementChild;
	let error = isEmailInvalid(event.target.value);

	handleError(event, error, formElement, errorMessage);
};

/**
 * Validates the password field and shows error as applicable
 * @param {Event} event - form submit event
 * @listens SubmitEvent
 */
function validatePassword(event) {
	let formElement = event.target.parentNode;
	let errorMessage = formElement.lastElementChild;
	let error;
	if(event.target === loginPassword) {
		error = isPasswordInvalid(event.target.value, true);
	} else {
		error = isPasswordInvalid(event.target.value);
	}
	
	handleError(event, error, formElement, errorMessage);
	
};

/**
 * Validates the add/edit spend form and shows errors as applicable
 * @param {Event} event - form submit event
 * @listens SubmitEvent
 */
 function validateAddEditSpendForm(event) {
	let formSubmitted = event.currentTarget;
	let itemName = formSubmitted.querySelector("input[name='item-name']");
	let spendDate = formSubmitted.querySelector("input[name='date']");
	let amount = formSubmitted.querySelector("input[name='amount']");
	let categoryList = formSubmitted.querySelector("select[name='category']");
	let subCategoryList = formSubmitted.querySelector("select[name='sub-category']");

	// Check item name
	let itemNameError = isTextInvalid(itemName.value, "item-name");
	let itemNameFormElement = itemName.parentNode.parentNode;
	let itemNameErrorMessage = itemName.parentNode.lastElementChild;
	handleError (event, itemNameError, itemNameFormElement, itemNameErrorMessage);

	// Check date
	let spendDateError = isDateInvalid(spendDate.value);
	let spendDateFormElement = spendDate.parentNode.parentNode;
	let spendDateErrorMessage = spendDate.parentNode.lastElementChild;
	console.dir(spendDateErrorMessage);
	handleError (event, spendDateError, spendDateFormElement, spendDateErrorMessage);

	// Check amount
	let amountError = isAmountInvalid(amount.value);
	let amountFormElement = amount.parentNode.parentNode;
	let amountErrorMessage = amount.parentNode.lastElementChild;
	handleError (event, amountError, amountFormElement, amountErrorMessage);

	// Check category
	let categoryError = isValueSelected(categoryList.value, "category");
	let categoryFormElement = categoryList.parentNode.parentNode;
	let categoryErrorMessage = categoryList.parentNode.lastElementChild;

	handleError(event, categoryError, categoryFormElement, categoryErrorMessage);

	// Check sub category
	let subCategoryError = isValueSelected(subCategoryList.value, "sub-category");
	let subCategoryFormElement = subCategoryList.parentNode.parentNode;
	let subCategoryErrorMessage = subCategoryList.parentNode.lastElementChild;

	handleError(event, subCategoryError, subCategoryFormElement, subCategoryErrorMessage);

	if(itemNameError || spendDateError || amountError || categoryError || subCategoryError){
		event.preventDefault();
	} 
}

/**
 * Validates the item name field for a spend and shows error as applicable
 * @param {Event} event - form submit event
 * @listens SubmitEvent
 */
function validateItemName(event) {
	let formElement = event.target.parentNode.parentNode;
	let errorMessage = event.target.parentNode.lastElementChild;
	let error = isTextInvalid(event.target.value, "item-name");

	handleError(event, error, formElement, errorMessage);
}

/**
 * Validates the spend date field and shows error as applicable
 * @param {Event} event - form submit event
 * @listens SubmitEvent
 */
function validateSpendDate(event) {
	let formElement = event.target.parentNode.parentNode;
	let errorMessage = event.target.parentNode.lastElementChild;
	let error = isDateInvalid(event.target.value);

	handleError(event, error, formElement, errorMessage);
}

/**
 * Validates the amount field for a spend and shows error as applicable
 * @param {Event} event - form submit event
 * @listens SubmitEvent
 */
function validateAmount(event) {
	let formElement = event.target.parentNode.parentNode;
	let errorMessage = event.target.parentNode.lastElementChild;
	let error = isAmountInvalid(event.target.value);

	handleError(event, error, formElement, errorMessage);
}

/**
 * Validates the category field for a spend and shows error as applicable
 * @param {Event} event - form submit event
 * @listens SubmitEvent
 */
function validateCategory(event) {
	let formElement = event.target.parentNode.parentNode;
	let errorMessage = event.target.parentNode.lastElementChild;
	let error = isValueSelected(event.target.value, "category");

	handleError(event, error, formElement, errorMessage);
}

/**
 * Validates the sub category field for a spend and shows error as applicable
 * @param {Event} event - form submit event
 * @listens SubmitEvent
 */
function validateSubCategory(event) {
	let formElement = event.target.parentNode.parentNode;
	let errorMessage = event.target.parentNode.lastElementChild;
	let error = isValueSelected(event.target.value, "sub-category");

	handleError(event, error, formElement, errorMessage);
}

// Helper functions to check if a field is valid/invalid

/**  
 * Checks if text is invalid. Returns: false (if valid), error message (if invalid)
 * @param {string} nameText String value of name
*/
function isTextInvalid(text, type) {
	if (text === "") {
		if (type == "name"){
			return "Please enter your name";
		}
		 if (type == "item-name") {
			return "Please enter the item name";
		 }
	}

	return false;
}

/**  
 * Checks if email input is invalid. Returns: false (if valid), error message (if invalid)
 * @param {string} emailText String value of email
*/
function isEmailInvalid(emailText) {
	let reg = /^([A-Za-z0-9_\-\.])+\@([A-Za-z0-9_\-\.])+\.([A-Za-z]{2,4})$/

	if (emailText === "") {
		return "Please enter your email address";
	}

	if (!reg.test(emailText)){
		return "Hmmm..the email address entered seems invalid";
	}

	return false;
}

/** 
	* Checks if password provided is invalid (empty or not conforming to rules)
	* Returns: false (if valid), error message (if invalid)
	* @param {string} passwordText String value of password
	* @param {Object} [options] - password validation options
	* @param {boolean} [options.checkFormat = true] Boolean indicating if password format should be checked. Default = true.
	* @param {string} [options.fieldName = "password"] String value of field name. Default = "password".
*/
function isPasswordInvalid(passwordText, isLogin){
	if (passwordText === "") {
		return "Please enter your password";
	}

	if(!isLogin) {
		if (passwordText.length<8){
			return "Password should be at least 8 characters";
		}
	
		if (!(/\d/.test(passwordText) && /[a-zA-Z]/.test(passwordText))){
			return "Password should contain both letters and numbers";
		}
	}
	
	return false;
}

/** 
	* Checks if date provided is invalid 
	* Returns: false (if valid), error message (if invalid)
	* @param {string} spendDate String value of spend date
*/
function isDateInvalid(spendDate) {
	if (spendDate === "") {
		return "Please enter the spend date";
	}
	return false;
}


/**
 * Checks if amount provided is invalid 
 * Returns: false (if valid), error message (if invalid)
 * @param {string} amountText 
 * @returns 
 */
function isAmountInvalid(amountText) {
	if(amountText === ""){
		return "Please enter an amount";
	}

	if(amountText < 0 || isNaN(amountText)) {
		return "Please enter a valid amount";
	}

	return false;
}

/**
 * Checks if a value is selected
 * Returns: false (if selected), error message (if not selected)
 * @param {string} amountText 
 * @returns 
 */
function isValueSelected(value, type) {
	if(value === "") {
		if (type === "category") {
			return "Please select category";
		}
		
		if (type === "sub-category") {
			return "Please select sub category";
		}

		return false;
	}
}
/**
 * Handles display of the feedback element for an input
 * @param {Event} triggering event 
 * @param {(string|boolean)} error 
 * @param {HTMLElement} formElement 
 * @param {HTMLElement} errorMessage 
 */
function handleError(event, error, formElement, errorMessage) {
	if (!error){
		formElement.classList.remove("error");
		errorMessage.innerText = "";
		errorMessage.classList.add("hidden");
	} else {
		formElement.classList.add("error");
		// Show new error message only if the focus is changed, or updated error message if there already was one showing
		if(event.type !== "keyup" || errorMessage.innerText !== "") {
			errorMessage.classList.remove("hidden");
			errorMessage.innerText = error;
		}
	}
}

// Add events for register form page
if(regForm !== null) {
	regForm.addEventListener("submit", validateRegister);
	name.addEventListener("blur", validateName);
	name.addEventListener("keyup", validateName);
	email.addEventListener("blur", validateEmail);
	email.addEventListener("keyup", validateEmail);
	password.addEventListener("blur", validatePassword);
	password.addEventListener("keyup", validatePassword);
}

// Add events for login form page
if(loginForm !== null) {
	loginForm.addEventListener("submit", validateLogin);
	email.addEventListener("blur", validateEmail);
	email.addEventListener("keyup", validateEmail);
	loginPassword.addEventListener("blur", validatePassword);
	loginPassword.addEventListener("keyup", validatePassword);
}

// Add events for Add Spend Form
if(addSpendForm !== null) {
	addSpendForm.addEventListener("submit", validateAddEditSpendForm);
	addItemName.addEventListener("blur", validateItemName);
	addItemName.addEventListener("keyup", validateItemName);
	addItemSpendDate.addEventListener("blur", validateSpendDate);
	addItemSpendDate.addEventListener("change", validateSpendDate);
	addItemAmount.addEventListener("blur", validateAmount);
	addItemAmount.addEventListener("keyup", validateAmount);
	addItemCategoryList.addEventListener("change", updateSubcategoryList);
	addItemCategoryList.addEventListener("blur", validateCategory);
	addItemCategoryList.addEventListener("change", validateCategory);
	addItemSubCategoryList.addEventListener("blur", validateSubCategory);
	addItemSubCategoryList.addEventListener("change", validateSubCategory);
}

// Add events for Edit Spend Form
if(editSpendForm !== null) {
	editSpendForm.addEventListener("submit", validateAddEditSpendForm);
	editItemName.addEventListener("blur", validateItemName);
	editItemName.addEventListener("keyup", validateItemName);
	editItemSpendDate.addEventListener("blur", validateSpendDate);
	editItemSpendDate.addEventListener("change", validateSpendDate);
	editItemAmount.addEventListener("blur", validateAmount);
	editItemAmount.addEventListener("keyup", validateAmount);
	editItemCategoryList.addEventListener("change", updateSubcategoryList);
	editItemCategoryList.addEventListener("blur", validateCategory);
	editItemCategoryList.addEventListener("change", validateCategory);
	editItemSubCategoryList.addEventListener("blur", validateSubCategory);
	editItemSubCategoryList.addEventListener("change", validateSubCategory);
}

// Add events for spend list
if(spendList !== null) {
	deleteItemButtons.forEach((element) => {
		element.addEventListener("click", toggleModal);
	})

	editItemButtons.forEach((element) => {
		element.addEventListener("click", toggleModal);
	})
	
	deleteCloseButton.addEventListener("click", toggleModal);
	editCloseButton.addEventListener("click", toggleModal);

	deleteCancelButton.addEventListener("click", toggleModal);
	deleteConfirmButton.addEventListener("click", confirmDelete);

}

/**
 * Updates sub categories when category is changed in add/edit spend forms
 * @param {Event} event 
 */
function updateSubcategoryList(event) {
	let categoryId = event.target.value;
	let parentForm = event.target.form;
	let targetSubCategoryList = parentForm.querySelector("select[name='sub-category']");

	populateSubcategoryList(categoryId, targetSubCategoryList);
}

/**
 * Helper function to populate subcategory list by calling API based on category
 * @param {*} categoryId 
 * @param {*} targetSubCategoryList 
 * @param {*} selectedSubcategoryId 
 */
async function populateSubcategoryList(categoryId, targetSubCategoryList, selectedSubcategoryId = null){
	try {
		const response = await axios.get(`${serverUrl}/spend/categories/${categoryId}`);

		const subcategories = response.data;

		// Remove previous subcategories
		let currentOptionCount = targetSubCategoryList.options.length;

		for(let i = currentOptionCount; i>1; i--) {
			targetSubCategoryList.removeChild(targetSubCategoryList.options[i-1]);
		}

		if(Array.isArray(subcategories)) {
			targetSubCategoryList.options[0].innerText = "--- Select ---";
			// Add fetched subcategories
			subcategories.forEach(subcategory => {
				let opt = document.createElement('option');
				opt.innerText = subcategory.name;
				opt.value = subcategory.id;
				if(subcategory.id == selectedSubcategoryId){
					opt.selected = true;
				}
				targetSubCategoryList.appendChild(opt);
			});
		} else {
			// If there are no subcategories found, show the error text
			targetSubCategoryList.options[0].innerText = subcategories;
			targetSubCategoryList.options[0].selected = true;
		}
	} catch {
		targetSubCategoryList.options[0].innerText = "Error. Try later.";
		targetSubCategoryList.options[0].selected = true;
	}
}

// Add events for Month Selector (Spend List)
if(monthSelector !== null) {
	monthSelector.addEventListener('change', filterSpendsByMonth);
}

/**
 * Updates the dashboard when the month filter value is changed
 * @param {Event} event 
 */
async function filterSpendsByMonth(event) {
	let {firstDay, lastDay} = monthBounds(event.target.value);
	let URL = `/dashboard?from=${firstDay}&to=${lastDay}`;
	window.location = URL;
}

/**
 * Returns first and last date of a month based on an input filterDate
 * @param {string} filterDate 
 * @returns {Object} month object with first and last day
 */
function monthBounds(filterDate) {
	let date = new Date(filterDate);
	let firstDay = new Date(date.getFullYear(), date.getMonth(), 1); 
	let lastDay =  new Date(date.getFullYear(), date.getMonth() + 1, 0); 
	return {
		firstDay: toDateString(firstDay),
		lastDay: toDateString(lastDay)
	}
}

/**
 * Formats date into a string to be used in API call
 * @param {Date} date 
 * @returns {string} formatted date
 */
function toDateString(date) {
	return date.getFullYear().toString() + '-' + (date.getMonth() + 1).toString().padStart(2, 0) +
    '-' + date.getDate().toString().padStart(2, 0);
}

/**
 * Function to open or close modal
 * @param {Event} event 
 */
function toggleModal(event) {
	let element = event.currentTarget;
	let data = element.dataset;
	let target = data.target;
	let targetModal = document.getElementById(target);

	if(!targetModal.classList.contains('displayed')){
		targetModal.dataset.spendId = data.spendId;

		if(target === 'edit-modal'){
			updateEditForm(targetModal, data);
		}
	} else {
		targetModal.dataset.spendId = null;
		if(target === 'edit-modal'){
			clearEditForm(targetModal);
		}
	}

	targetModal.classList.toggle('displayed');
}

/**
 * Function to populate contents of the Edit Form when the Edit Modal is opened
 * @param {HTMLElement} editModal 
 * @param {Object} data - spend data 
 */
function updateEditForm(editModal, data) {
	let form = editModal.querySelector('form');
	form.action = '/spend/' + editModal.dataset.spendId + '?_method=PUT';
	
	let nameInput = form.querySelector("input[name='item-name']");
	let dateInput = form.querySelector("input[name='date']");
	let amountInput = form.querySelector("input[name='amount']");
	let categorySelect = form.querySelector("select[name='category']");
	let subCategorySelect = form.querySelector("select[name='sub-category']");

	nameInput.value = data.spendName;
	dateInput.value = toDateString(new Date(data.spendDate));
	amountInput.value = data.spendAmount;
	categorySelect.value = data.spendCategoryId;
	populateSubcategoryList(data.spendCategoryId, subCategorySelect, data.spendSubCategoryId);
}

/**
 * Clears contents of the Edit Form when the Edit Modal is closed
 * @param {HTMLElement} editModal 
 */
function clearEditForm(editModal) {
	let form = editModal.querySelector('form');
	form.action = ''; 
	
	// Clear form data
	form.reset();
}

/**
 * Calls API to confirm deletion and reloads the dashboard
 * @param {Event} event 
 */
async function confirmDelete(event) {
	let element =  event.currentTarget;
	let target = document.getElementById(element.dataset.target);
	
	try {
		const response = await axios.delete(`/spend/${target.dataset.spendId}`);
		target.classList.toggle('displayed');
	
		if(response.status == 200){
			location.reload();
		} 
	} catch {
		target.getElementsByClassName('api-error')[0].innerText = "An error occured. Try again later";
	}
	
}