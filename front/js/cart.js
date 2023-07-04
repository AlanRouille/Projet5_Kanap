let cartItems = [];

addProduct();

const orderButton = document.querySelector('#order');
orderButton.addEventListener('click', (order) => submitForm(order));

const firstNameInput = document.getElementById('firstName');
firstNameInput.addEventListener('keyup', () => testInputValidity(firstNameInput));

const lastNameInput = document.getElementById('lastName');
lastNameInput.addEventListener('keyup', () => testInputValidity(lastNameInput));

const cityInput = document.getElementById('city');
cityInput.addEventListener('keyup', () => testInputValidity(cityInput));

function addProduct() {
  const savedItems = localStorage.getItem('cartItems');
  const parsedItems = JSON.parse(savedItems);
  
  if (parsedItems != null) {
    for (const item of parsedItems) {
      card(item.id, item.color, item.quantity);
    }
  }
  
  initLoad();
}

async function card (id, color, quantity) {
  const response = await fetch('http://localhost:3000/api/products/' + id);
  const data = await response.json();
  
  const item = {
    id,
    color,
    quantity,
    name: data.name,
    imageUrl: data.imageUrl,
    altTxt: data.altTxt,
    price: data.price
  };
  
  cartItems.push(item);
  displayCartItem(item);
}

function displayCartItem(item) {
  const article = createArticleElement(item);
  const imageDiv = createImageDivElement(item);
  article.appendChild(imageDiv);

  const contentDiv = createContentDivElement(item);
  article.appendChild(contentDiv);

  document.querySelector('#cart__items').appendChild(article);
  displayTotalPrice();
  displayTotalQuantity();

  initLoad();
}

function createArticleElement(item) {
  const article = document.createElement('article');
  article.classList.add('cart__item');
  article.dataset.id = item.id;
  article.dataset.color = item.color;
  return article;
}

function createImageDivElement(item) {
  const div = document.createElement('div');
  div.classList.add('cart__item__img');

  const image = document.createElement('img');
  image.src = item.imageUrl;
  image.alt = item.altTxt;

  div.appendChild(image);
  return div;
}

function createContentDivElement(item) {
  const div = document.createElement('div');
  div.classList.add('cart__item__content');

  const description = createDescriptionElement(item);
  const settings = createSettingsDivElement(item);

  div.appendChild(description);
  div.appendChild(settings);
  return div;
}

function createDescriptionElement(item) {
  const description = document.createElement('div');
  description.classList.add('cart__item__content__description');

  const h2 = document.createElement('h2');
  h2.textContent = item.name;

  const p1 = document.createElement('p');
  p1.textContent = item.color;

  const p2 = document.createElement('p');
  p2.textContent = item.price + ' €';

  description.appendChild(h2);
  description.appendChild(p1);
  description.appendChild(p2);
  return description;
}

function createSettingsDivElement(item) {
  const settings = document.createElement('div');
  settings.classList.add('cart__item__content__settings');

  addQuantityDivElement(settings, item);
  addDeleteDivElement(settings, item);
  return settings;
}

function addQuantityDivElement(settings, item) {
  const div = document.createElement('div');
  div.classList.add('cart__item__content__settings__quantity');

  const p = document.createElement('p');
  p.textContent = 'Qté : ';
  div.appendChild(p);

  const input = document.createElement('input');
  input.type = 'number';
  input.classList.add('itemQuantity');
  input.value = item.quantity;
  input.addEventListener('input', () => updateQuantity(input, item));
  div.appendChild(input);

  settings.appendChild(div);
}

function updateQuantity(input, item) {
  const newQuantity = parseInt(input.value);
  item.quantity = newQuantity;
  displayTotalPrice();
  displayTotalQuantity();
}

function addDeleteDivElement(settings, item) {
  const div = document.createElement('div');
  div.classList.add('cart__item__content__settings__delete');

  const p = document.createElement('p');
  p.classList.add('deleteItem');
  p.textContent = 'Supprimer';
  div.addEventListener('click', () => deleteItem(item));
  div.appendChild(p);

  settings.appendChild(div);
}

// Supression de ID sur le local storage //
function deleteItem(item) {
  let indexToDelete = cartItems.findIndex((cartItem) => cartItem.id === item.id  && cartItem.color === item.color);
  if(indexToDelete > -1) {
    cartItems.splice( indexToDelete, 1);

    let temporaryArray = [];
    for (let i = 0; i < cartItems.length; i++) {
      const temporaryObjet = {
        id: cartItems[i].id,
        color : cartItems[i].color,
        quantity : cartItems[i].quantity,
      };
      temporaryArray.push(temporaryObjet);
    }
    localStorage.clear();
    localStorage.setItem('cardItems', JSON.stringify(temporaryArray));
  }
  const parentElement = document.querySelector(`article[data-id="${item.id}"][data-color="${item.color}"]`);
  parentElement.remove();
  displayTotalPrice();
  displayTotalQuantity();
}

function displayTotalQuantity() {
  const totalQuantity = cartItems.reduce((total, item) => total + item.quantity, 0);
  document.querySelector('#totalQuantity').textContent = totalQuantity;
}

function displayTotalPrice() {
  const totalPrice = cartItems.reduce((total, item) => total + (item.price * item.quantity), 0);
  document.querySelector('#totalPrice').textContent = totalPrice + '€';
}

function initLoad() {
	const email = document.querySelector('#email');
	email.addEventListener('keyup', (element) => controlEmail());

	const form = document.querySelector('.cart__order__form');
	const inputs = form.querySelectorAll('input');
	inputs.forEach((element) => {
		if (element.value != '') {
			if (element.id === 'order') element.setAttribute('style', 'padding-left: 15px;');
			if (element.id != 'order') element.setAttribute('style', 'padding-left: 15px;');
		} else {
			if (element.id != 'order') element.setAttribute('style', 'padding-left: 15px;');
		}
	});
}


function testInputValidity (parent) {
  const invalidCharacters = /[0-9'"=+]/g;
  const textTemp = parent.value;
  const newStr = textTemp.replace(invalidCharacters, '');
  parent.value = newStr;
}

function controlEmail() {
  const pattern = new RegExp(/^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))/i);
  const elem = document.querySelector('#email');
  const valueTextEmail = elem.value;
  const resultRegex = valueTextEmail.match(pattern);
  const errorMsg = document.querySelector('#emailErrorMsg');

  if (resultRegex == null) {
    elem.setAttribute('style', 'color: #ff0000; padding-left: 10px;');
    errorMsg.textContent = 'Veuillez renseigner une adresse email valide pour continuer';
    return false;
  } else {
    elem.setAttribute('style', 'color: #000; padding-left: 10px;');
    errorMsg.textContent = '';
    return true;
  }
}

function addDivQuantity(settings, item) {
  const quantity = document.createElement('div');
  quantity.className = 'cart__item__content__settings__quantity';

  quantity.innerHTML = `
    <p>Qté : </p>
    <input type="number" class="itemQuantity" name="itemQuantity" min="1" max="100" value="${parseInt(item.quantity)}">
  `;

  const input = quantity.querySelector('.itemQuantity');

  input.addEventListener('keyup', () => controlQuantity(item, input));
  input.addEventListener('input', () => updateCartItemQuantity(item, input));

  settings.appendChild(quantity);
}

function controlQuantity(item, input) {
	let newQuantity = parseInt(input.value);

	if (newQuantity < 1 || isNaN(newQuantity) || newQuantity === '') {
		newQuantity = 1;
	}

	if (newQuantity > 100) {
		newQuantity = 100;
	}

	input.value = newQuantity;

	let cartItems = JSON.parse(localStorage.getItem('product'));
	for (let i = 0; i < cartItems.length; i++) {
		if (cartItems[i].id == item.id && cartItems[i].color == item.color) {
			if (newQuantity > 0 && newQuantity <= 100) {
				cartItems[i].quantity = newQuantity;
			} else {
				cartItems[i].quantity = 1;
			}
			break;
		}
	}

	localStorage.setItem('product', JSON.stringify(cartItems));
	displayTotalPrice();
	displayTotalQuantity();
}

function updateCartItemQuantity(item, input) {
	const maxValue = 100;
	let newValue = parseInt(input.value);

	if (newValue > maxValue) {
		input.value = maxValue;
	}

	item.quantity = parseInt(newValue);

	let cartItems = JSON.parse(localStorage.getItem('product'));
	for (let i = 0; i < cartItems.length; i++) {
		if (cartItems[i].id === item.id && cartItems[i].color === item.color) {
			if (newValue > 0 && newValue <= maxValue) {
				cartItems[i].quantity = newValue;
			} else {
				cartItems[i].quantity = 1;
			}
			break;
		}
	}

	localStorage.setItem('cartItems', JSON.stringify(cartItems));
	displayTotalPrice();
	displayTotalQuantity();
}

function createContactFormObject() {
  const form = document.querySelector('.cart__order__form');
  
  const contactInfo = {
    firstName: form.firstName.value,
    lastName: form.lastName.value,
    address: form.address.value,
    city: form.city.value,
    email: form.email.value
  };
  
  const productList = listIDs();
  
  const contactFormObject = {
    contact: contactInfo,
    products: productList
  };
  
  return contactFormObject;
}

function submitForm(order) {
  order.preventDefault(); // Empêche le rafraîchissement de la page
  
  if (cartItems.length === 0) {
    theBasketIsEmpty();
    return;
  }
  
  const pass = testFieldsIsEmpty(); // Vérifie si les champs sont vides
  if (pass) {
    const contactForm = createContactFormObject(); // Construit l'objet avec les données de contact et la liste des IDs des articles
    
    if (controlEmail()) {
      sendCommand(contactForm);
    }
  }
}

async function sendCommand(contactForm) {
  try {
    const response = await fetch('http://localhost:3000/api/products/order', {
      method: 'POST',
      body: JSON.stringify(contactForm),
      headers: { 'Content-Type': 'application/json' },
    });
    
    const data = await response.json();
    
    const orderId = data.orderId;
    window.location.href = 'confirmation.html?orderId=' + orderId;
  } catch (err) {
    console.error(err);
    alert('Erreur: ' + err);
  }
}

function listIDs() {
  return cart.map(item => item.id);
}


function theBasketIsEmpty() {
	const parent = document.querySelector('#emptybasket');
	parent.style.color = 'white';
	parent.style.fontweight = 'bold';
	parent.style.borderStyle = 'solid';
	parent.style.borderColor = '#fff';
	parent.style.background = '#3d4c68';
	parent.style.padding = '10px';
	parent.style.borderRadius = '15px';
	parent.style.textAlign = 'center';
	parent.textContent = 'Votre panier est vide';
}

function testInData(element) {
	if (element.id != 'order') {
		if (element.value === '') {
			element.setAttribute('style', 'border:1px solid #FF0000; padding-left: 15px;');
		} else {
			element.setAttribute('style', 'border:1px solid #767676; padding-left: 15px;');
			switch (element.id) {
				case 'firstName': {
					document.querySelector('#firstNameErrorMsg').textContent = '';
					break;
				}
				case 'lastName': {
					document.querySelector('#lastNameErrorMsg').textContent = '';
					break;
				}
				case 'address': {
					document.querySelector('#addressErrorMsg').textContent = '';
					break;
				}
				case 'city': {
					document.querySelector('#cityErrorMsg').textContent = '';
					break;
				}
			}
		}
	}
}
function testFieldsIsEmpty() {
	const form = document.querySelector('.cart__order__form');
	const inputs = form.querySelectorAll('input');
	let pass = true;
	inputs.forEach((element) => {
		element.addEventListener('input', () => testInData(element));

		switch (element.id) {
			case 'firstName': {
				if (element.value == '') {
					element.setAttribute('style', 'border:1px solid #FF0000; padding-left: 15px;');
					document.querySelector('#firstNameErrorMsg').textContent = 'Veuillez entrer votre prénom';
					pass = false;
          break;
				}
			}
			case 'lastName': {
				if (element.value == '') {
					element.setAttribute('style', 'border:1px solid #FF0000; padding-left: 15px;');
					document.querySelector('#lastNameErrorMsg').textContent = 'Veuillez entrer votre nom';
					pass = false;
          break;
				}
			}
			case 'address': {
				if (element.value == '') {
					element.setAttribute('style', 'border:1px solid #FF0000; padding-left: 15px;');
					document.querySelector('#addressErrorMsg').textContent = 'Veuillez entrer votre adresse';
					pass = false;
          break;
				}
			}
			case 'city': {
				if (element.value == '') {
					element.setAttribute('style', 'border:1px solid #FF0000; padding-left: 15px;');
					document.querySelector('#cityErrorMsg').textContent = 'Veuillez entrer une ville';
					pass = false;
          break;
				}
			}
			case 'email': {
				if (element.value == '') {
					element.setAttribute('style', 'border:1px solid #FF0000; padding-left: 15px;');
					document.querySelector('#emailErrorMsg').textContent = 'Veuillez renseigner une adresse email valide pour continuer';
					pass = false;
          break;
				}
			}
		}
	});
	return pass;
}