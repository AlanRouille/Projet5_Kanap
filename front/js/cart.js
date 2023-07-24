// Déclaration du tableau cartItems //
let cartItems = [];

// Appel de la fonction addProduct //
addProduct();

// Sélection du bouton de commande //
const orderButton = document.querySelector('#order');
orderButton.addEventListener('click', submitForm);

// Sélection des champs d'entrée pour les événements de saisie //
const firstNameInput = document.getElementById('firstName');
firstNameInput.addEventListener('keyup', () => testForm());

const lastNameInput = document.getElementById('lastName');
lastNameInput.addEventListener('keyup', () => testForm());

const cityInput = document.getElementById('city');
cityInput.addEventListener('keyup', () => testForm());

const addressInput = document.getElementById('address');
addressInput.addEventListener('keyup', () => testForm());

const emailInput = document.getElementById('email');
emailInput.addEventListener('input', controlEmail);
emailInput.addEventListener('keyup', () => testForm());

// Fonction pour ajouter un produit
function addProduct() {
  const savedItems = localStorage.getItem('cartItems');
  const parsedItems = JSON.parse(savedItems);

  if (parsedItems != null) {
    for (const item of parsedItems) {
      card(item.id, item.color, item.quantity);
    }
  }
}

// Fonction pour créer un élément article pour un produit dans le panier
async function card(id, color, quantity) {
  const response = await fetch('http://localhost:3000/api/products/' + id);
  const data = await response.json();

  const item = {
    id,
    color,
    quantity,
    name: data.name,
    imageUrl: data.imageUrl,
    altTxt: data.altTxt,
    price: data.price,
  };

  cartItems.push(item);
  displayCartItem(item);
}


// Fonction pour afficher un produit dans le panier //
function displayCartItem(item) {
  const article = createArticleElement(item);
  const imageDiv = createImageDivElement(item);
  article.appendChild(imageDiv);

  const contentDiv = createContentDivElement(item);
  article.appendChild(contentDiv);

  document.querySelector('#cart__items').appendChild(article);
  displayTotalPrice();
  displayTotalQuantity();

}

// Fonction pour créer un élément article //
function createArticleElement(item) {
  const article = document.createElement('article');
  article.classList.add('cart__item');
  article.dataset.id = item.id;
  article.dataset.color = item.color;
  return article;
}

// Fonction pour créer un élément div pour l'image du produit //
function createImageDivElement(item) {
  const div = document.createElement('div');
  div.classList.add('cart__item__img');

  const image = document.createElement('img');
  image.src = item.imageUrl;
  image.alt = item.altTxt;

  div.appendChild(image);
  return div;
}

// Fonction pour créer un élément div pour le contenu du produit //
function createContentDivElement(item) {
  const div = document.createElement('div');
  div.classList.add('cart__item__content');

  const description = createDescriptionElement(item);
  const settings = createSettingsDivElement(item);

  div.appendChild(description);
  div.appendChild(settings);
  return div;
}

// Fonction pour créer un élément div pour la description du produit //
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

// Fonction pour créer un élément div pour les paramètres du produit //
function createSettingsDivElement(item) {
  const settings = document.createElement('div');
  settings.classList.add('cart__item__content__settings');

  addQuantityDivElement(settings, item);
  addDeleteDivElement(settings, item);
  return settings;
}

// Fonction pour ajouter un élément div pour la quantité du produit //
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
  input.setAttribute('min', 1);
  input.setAttribute('max', 100);

  settings.appendChild(div);
}

// Fonction pour mettre à jour la quantité du produit //
function updateQuantity(input, item) {
  const newQuantity = parseInt(input.value);
  if(newQuantity < 1) {
    newQuantity = 1;
  } else if (newQuantity > 100) {
    newQuantity = 100;
  }
  input.value = newQuantity;
  item.quantity = newQuantity;
  updateLocalStorage();
  displayTotalPrice();
  displayTotalQuantity();
}

// Fonction pour mettre à jour le stockage local //
function updateLocalStorage() {
  const temporaryArray = cartItems.map((item) => ({
    id: item.id,
    color: item.color,
    quantity: item.quantity,
  }));
  localStorage.setItem('cartItems', JSON.stringify(temporaryArray));
}

// Fonction pour ajouter un élément div pour la suppression du produit //
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

// Fonction pour supprimer un produit //
function deleteItem(item) {
  const indexToDelete = cartItems.findIndex(
    (cartItem) => cartItem.id === item.id && cartItem.color === item.color
  );
  if (indexToDelete > -1) {
    cartItems.splice(indexToDelete, 1);
    updateLocalStorage();
  }
  const parentElement = document.querySelector(
    `article[data-id="${item.id}"][data-color="${item.color}"]`
  );
  parentElement.remove();
  displayTotalPrice();
  displayTotalQuantity();
}

/// ------ Fonctions d'affichage des totaux ------ ///

// Fonction pour afficher la quantité totale des produits dans le panier //
function displayTotalQuantity() {
  const totalQuantity = cartItems.reduce((total, item) => total + item.quantity, 0);
  document.querySelector('#totalQuantity').textContent = totalQuantity;
}

// Fonction pour afficher le prix total des produits dans le panier //
function displayTotalPrice() {
  const totalPrice = cartItems.reduce(
    (total, item) => total + item.price * item.quantity,
    0
  );
  document.querySelector('#totalPrice').textContent = totalPrice + '€';
}

// Fonction pour mettre à jour la quantité d'un produit dans le panier //
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

  localStorage.setItem('product', JSON.stringify(cartItems));
  displayTotalPrice();
  displayTotalQuantity();
}

// Fonction pour créer l'objet de formulaire de contact
function createContactFormObject() {
  const form = document.querySelector('.cart__order__form');

  const contactInfo = {
    firstName: form.firstName.value,
    lastName: form.lastName.value,
    address: form.address.value,
    city: form.city.value,
    email: form.email.value,
  };

  const productList = listID();

  const contactFormObject = {
    contact: contactInfo,
    products: productList,
  };

  return contactFormObject;
}

// Fonction pour soumettre le formulaire //

function submitForm(order) {
  order.preventDefault(); // Empêche le rafraîchissement de la page

  if (cartItems.length === 0) {
    emptyBasket();
    return;
  }

  const pass = testForm(); // Vérifie si les champs sont vides //
  if (pass) {
    const contactForm = createContactFormObject(); // Construit l'objet avec les données de contact et la liste des IDs des articles

    if (controlEmail()) {
      sendCommand(contactForm);
    }
  }
}

// Fonction pour envoyer la commande //

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

// Fonction pour obtenir la liste des IDs des produits dans le panier //

function listID() {
  let ID = [];
  for (let i = 0; i < cartItems.length; i++) {
    ID.push(cartItems[i].id);
  }
  return ID;
}

// Fonction pour afficher le panier vide //

function emptyBasket() {
  const parent = document.querySelector('#emptybasket');
  parent.style.color = 'white';
  parent.style.fontweight = 'bold';
  parent.style.borderStyle = 'solid';
  parent.style.borderColor = '#fff';
  parent.style.background = '#3d4c68';
  parent.style.padding = '10px';
  parent.style.borderRadius = '20px';
  parent.style.textAlign = 'center';
  parent.style.boxShadow = '0 2px 4px rgba(0, 0, 0, 0.2)';
  parent.textContent = 'Votre panier est vide';
}

// Fonction pour contrôler la validité de l'adresse e-mail //
function controlEmail() {
  const inputEmail = document.getElementById('email').value;
  const pattern = new RegExp(
    /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))/i
  );
  const elem = document.querySelector('#email');
  const valueTextEmail = elem.value;
  const resultRegex = valueTextEmail.match(pattern);
  const errorMsg = document.querySelector('#emailErrorMsg');

  if (resultRegex == null) {
    elem.setAttribute('style', 'color: #ff0000; padding-left: 15px;');
    errorMsg.textContent = 'Veuillez renseigner une adresse email valide pour continuer';
    return false;
  } else {
    elem.setAttribute('style', 'border: 2px solid #000; padding-left: 10px;');;
    errorMsg.textContent = '';
    return true;
  }
}

// Fonction pour tester si les champs du formulaire de saisie sont vides //

function testForm() {
  const form = document.querySelector('.cart__order__form');
  const inputs = form.querySelectorAll('input');
  let pass = true;
  inputs.forEach((element) => {
    switch (element.id) {
      case 'firstName': {
        if (element.value === '' || /\d/.test(element.value)) {
          element.value = element.value.replace(/\d/g, ''); // Supprime les chiffres de la valeur
          element.setAttribute('style', 'border:2px solid #FF0000; padding-left: 10px;');
          document.getElementById('firstNameErrorMsg').style.display = 'block';
          document.querySelector('#firstNameErrorMsg').textContent = 'Veuillez renseigner votre prénom';
          pass = false;
        } else {
          element.setAttribute('style', 'border:2px solid #000; padding-left: 10px;');
          document.getElementById('firstNameErrorMsg').style.display = 'none';
        }
        break;
      }
      case 'lastName': {
        if (element.value === '' || /\d/.test(element.value)) {
          element.value = element.value.replace(/\d/g, '');
          element.setAttribute('style', 'border:2px solid #FF0000; padding-left: 10px;');
          document.getElementById('lastNameErrorMsg').style.display = 'block';
          document.querySelector('#lastNameErrorMsg').textContent = 'Veuillez renseigner votre nom';
          pass = false;
        } else {
          element.setAttribute('style', 'border:2px solid #000; padding-left: 10px;');
          document.getElementById('lastNameErrorMsg').style.display = 'none';
        }
        break;
      }
      case 'address': {
        if (element.value === '') {
          element.setAttribute('style', 'border:2px solid #FF0000; padding-left: 10px;');
          document.getElementById('addressErrorMsg').style.display = 'block';
          document.querySelector('#addressErrorMsg').textContent = 'Veuillez renseigner votre adresse';
          pass = false;
        } else {
          element.setAttribute('style', 'border:2px solid #000; padding-left: 10px;');
          document.getElementById('addressErrorMsg').style.display = 'none';
        }
        break;
      }
      case 'city': {
        if (element.value === '') {
          element.setAttribute('style', 'border:2px solid #FF0000; padding-left: 10px');
          document.getElementById('cityErrorMsg').style.display = 'block';
          document.querySelector('#cityErrorMsg').textContent = 'Veuillez renseigner votre ville';
          pass = false;
        } else {
          element.setAttribute('style', 'border:2px solid #000; padding-left: 10px;');
          document.getElementById('cityErrorMsg').style.display = 'none';
        }
        break;
      }
      case 'email': {
        if (element.value === '') {
          element.setAttribute('style', 'border:2px solid #FF0000; padding-left: 10px');
          document.getElementById('emailErrorMsg').style.display = 'block';
          document.querySelector('#emailErrorMsg').textContent =
            'Veuillez renseigner une adresse email valide pour continue';
          pass = false;
        } else {
          element.setAttribute('style', 'border:2px solid #000; padding-left: 10px;');
          document.getElementById('emailErrorMsg').style.display = 'none';
        }
        break;
      }
    }
  });
  return pass;
}