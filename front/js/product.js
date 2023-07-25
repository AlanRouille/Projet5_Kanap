//------ Récupération de l'URL et de l'ID de l'article ------//

let params = new URLSearchParams(document.location.search).get('id');
addProduct();

//------ Recherche d'un produit par son ID ------//

async function addProduct() {
  await fetch('http://localhost:3000/api/products/' + params)
    .then((res) => res.json())
    .then((data) => card(data))
    .catch((error) => {
      console.log(error);
      window.alert('Impossible de se connecter au serveur');
    });
}

//------ Création de la balise option de couleur ------//

function createOption(Choice) {
  const Option = document.createElement('option');
  Option.value = Choice;
  Option.textContent = Choice;
  const parent = document.querySelector('#colors');
  parent.appendChild(Option);
}

//------ Récupération des données du fetch ------//

function card(data) {
  if (data != null) {
    let parent = document.querySelector('.item__img');
    parent.innerHTML += `<img src="${data.imageUrl}" alt="${data.altTxt}">`;

    parent = document.querySelector('#title');
    parent.textContent = data.name;

    parent = document.querySelector('#price');
    parent.textContent = data.price;

    parent = document.querySelector('#description');
    parent.textContent = data.description;

    for (let i = 0; i < data.colors.length; i++) {
      createOption(data.colors[i]);
    }

    updateCartItemQuantity();
  }
}

//------ Contrôle de la quantité ------//

function quantityControl() {
  const quantityValue = document.querySelector('#quantity').value;
  if (quantityValue != null) {
    if (quantityValue < 0) document.querySelector('#quantity').value = 0;
    if (quantityValue > 100) document.querySelector('#quantity').value = 100;
  }
}

document.querySelector('#addToCart').addEventListener('click', addItemToCart);

document.querySelector('[name="itemQuantity"]').addEventListener('input', updateCartItemQuantity);
document.querySelector('[name="itemQuantity"]').addEventListener('keyup', quantityControl);

//------ Ajout d'un article au panier ------//

function addItemToCart() {
  const selectedQuantity = document.querySelector('#quantity').value;
  const selectedColor = document.querySelector('#colors').value;

  if (selectedQuantity > 0 && selectedQuantity <= 100 && selectedColor !== '') {
    let cartItems = JSON.parse(localStorage.getItem('cartItems'));

    if (!Array.isArray(cartItems)) {
      cartItems = [];
    }

    const existingItemIndex = cartItems.findIndex((item) => item.id === params && item.color === selectedColor);

    if (existingItemIndex !== -1) {
      const existingItem = cartItems[existingItemIndex];
      const currentQuantity = existingItem.quantity;
      const newQuantity = parseInt(selectedQuantity);
      const updatedQuantity = currentQuantity + newQuantity;

      if (updatedQuantity > 100) {
        const remainingSpace = 100 - currentQuantity;
        if (remainingSpace > 0) {
          alert(`Vous avez déjà ${currentQuantity} article(s) sélectionné(s).
          La limite maximale de 100 sera atteinte !
          ${remainingSpace} articles supplémentaires seront ajoutés.`);
          existingItem.quantity = 100;
        } else {
          alert('Limite de quantité atteinte !');
        }
      } else {
        existingItem.quantity = updatedQuantity;
      }
    } else {
      cartItems.push({
        id: params,
        quantity: parseInt(selectedQuantity),
        color: selectedColor,
      });
    }

    localStorage.setItem('cartItems', JSON.stringify(cartItems));
    window.location.href = 'index.html';

    showAddToCartMessage('Produit ajouté au panier');
  } else {
    checkFieldsValidity(selectedQuantity, selectedColor);
  }
}

//------ Affichage d'un message d'ajout au panier ------//
function showAddToCartMessage (message) {
  const messageElement = document.querySelector("#message") ? true : false;
  if (messageElement) document.querySelector("#message").remove();
  
  const displayDuration = 2000;
  const durationBetween = 2500;
  const undisplayDuration = 3000;

  const container = document.createElement('div');
  const content = document.createTextNode(message);

  container.appendChild(content);
  container.id = "message";
  container.classList.add("hideMessage");

  document.body.appendChild(container);

  setTimeout(
    () => container.classList.replace("hideMessage"),
    displayDuration + durationBetween
  );
  setTimeout (
    () => container.remove(),
    displayDuration + durationBetween + undisplayDuration
  );
}


//------ Vérification de la validité des champs ------//

function checkFieldsValidity(quantity, color) {
  const inputElement = document.querySelector('input');
  const selectElement = document.querySelector('select');
  const quantityParent = document.getElementById('quantity');
  const colorParent = document.getElementById('colors');

  if (quantity <= 0 || quantity > 100) {
    inputElement.style.border = '2px solid #FF0000';
  } else {
    inputElement.style.border = 'none';
  }

  if (color === '') {
    selectElement.style.border = '2px solid #FF0000';
  } else {
    selectElement.style.border = 'none';
  }
}

//------ Mise à jour de la quantité de l'article du panier ------//

function updateCartItemQuantity() {
  
  let cartItems = JSON.parse(localStorage.getItem('cartItems'));
  if (cartItems === null) {
    cartItems = [];
  }

  const selectedColor = document.querySelector('#colors').value;
  const existingItemIndex = cartItems.findIndex((item) => item.id === params && item.color === selectedColor);
  let updatedQuantity = parseInt(document.querySelector('#quantity').value);

  if (!isNaN(updatedQuantity) && existingItemIndex !== -1) {
    cartItems[existingItemIndex].quantity = updatedQuantity;
    localStorage.setItem('cartItems', JSON.stringify(cartItems));
  }
}

//------ Recherche d'un article par son ID et sa couleur ------//

function getByIdColor(cartItems, id, color) {
  if (cartItems !== null) {
    for (let i = 0; i < cartItems.length; i++) {
      if (cartItems[i].id === id && cartItems[i].color === color) {
        return cartItems[i];
      }
    }
  }

  return undefined;
}
