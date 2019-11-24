const serverUrl = 'http://localhost:3000';

let regForm = document.getElementById("reg-form");
let loginForm = document.getElementById("login-form")
let name = document.getElementById("name");
let email = document.getElementById("email");
let password = document.getElementById("password");
let loginPassword = document.getElementById("login-password");
let addSpendForm = document.getElementById("add-spend-form");
let categoryList = document.getElementById("category");
let subCategoryList = document.getElementById("sub-category");

function validateRegister(event) {
	// Check name
	let nameError = isNameInvalid(name.value);
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

function validateName(event) {
	let formElement = event.target.parentNode;
	let errorMessage = formElement.lastElementChild;
	let error = isNameInvalid(event.target.value);

	handleError(event, error, formElement, errorMessage);
};

function isNameInvalid(nameText) {
	if (nameText === "") {
		return "Please enter your name";
	}

	return false;
}

function validateEmail(event) {
	let formElement = event.target.parentNode;
	let errorMessage = formElement.lastElementChild;
	let error = isEmailInvalid(event.target.value);

	handleError(event, error, formElement, errorMessage);
};

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
	categoryList.addEventListener("change", updateSubcategoryList);
}

function updateSubcategoryList(event) {
	let categoryId = event.target.value;
	fetch(serverUrl + "/spend/categories/" + categoryId)
	.then(response => response.json())
	.then(subcategories => {
			console.log("Subcategories", subcategories);

			// Remove previous subcategories
			let currentOptionCount = subCategoryList.options.length;

			for(let i = currentOptionCount; i>1; i--) {
				subCategoryList.removeChild(subCategoryList.options[i-1]);
			}

			if(Array.isArray(subcategories)) {
				subCategoryList.options[0].innerText = "--- Select ---";
				// Add fetched subcategories
				subcategories.forEach(subcategory => {
					let opt = document.createElement('option');
					opt.innerText = subcategory.name;
					opt.value = subcategory.id;
					subCategoryList.appendChild(opt);
				});
			} else {
				// If there are no subcategories found, show the error text
				subCategoryList.options[0].innerText = subcategories;
			}
		});
	}

