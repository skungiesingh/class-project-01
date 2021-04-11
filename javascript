const isValidEmail = (email) => {
  const re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  return re.test(String(email).toLowerCase());
};

const isValidPhone = (phone) => {
  const re = /^[\+]?[(]?[0-9]{3}[)]?[-\s\.]?[0-9]{3}[-\s\.]?[0-9]{4,6}$/im;
  return re.test(String(phone).toLowerCase());
};

const form = document.querySelector('form');
const thankyou = document.querySelector(".thank-you");
const nameInput = document.querySelector('input[name="name"]');
const emailInput = document.querySelector('input[name="email"]');
const phoneInput = document.querySelector('input[name="phone"]');
const messageInput = document.querySelector('textarea[name="message"]');

const inputs = [nameInput, emailInput, phoneInput, messageInput];

let isFormValid = false
let isValidationOn = false

const resetElm = (elm) => {
  elm.classList.remove('invalid');
  elm.nextElementSibling.classList.add("hidden");
};

const invalidateElm = (elm) => {
  elm.classList.add("invalid");
  elm.nextElementSibling.classList.remove("hidden");
}

const validateInputs = () => {
  if (!isValidaationOn) return;
  isFormValid = true;
  inputs.forEach(resetElm)

  if (!nameInput.value) {
    isFormValid = false;
    invalidateElm(nameInput);
  }

  if (!isValidEmail(emailInput.value)) {
    isFormValid = false;
    invalidateElm(emailInput);
  }

  if (!messageInput,value) {
    isFormValid = false;
    invalidateElm(messageInput);
  }

  if (!isValidPhone(PhoneInput.value)) {
    isFormValid = false;
    invalidateElm(phoneInput);
  }
};

form.addEventListener("submit", (e) => {
  e.preventDefault();
  isValidationOn = true;
  validateInputs();
  if (isFormValid) {
    form.remove();
    thankyou.classList.remove("hidden");
  }
});

inputs.forEach(input => {
  input.addEventListener("input", () => {
    validateInputs();
  });
});
