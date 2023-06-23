//
//------ Récuparation de l'URL et de l'ID de l'article ------//
//

let params = new URLSearchParams(document.location.search).get('id');
addProduct();
//
//------ Recherche un produit par son id ------//
//
async function addProduct() {
  await fetch('http://localhost:3000/api/products/' + params)
    .then((res) => res.json())
    .then((data) => card(data))
    .catch((error) => {
      console.log(error);
      window.alert('Impossible de se connecter au serveur');
    });
}
//
//------ Création de la balise option de couleur ------//
//
function createOption(Choice) {
  const Option = document.createElement('option');
  Option.value = Choice;
  Option.textContent = Choice;
  const parent = document.querySelector('#colors');
  parent.appendChild(Option);
}
//
//------Récupération des données du fetch ------//
//
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
  }
}
//
//------ Contrôle la quantité  ------//
//
function quantityControl() {
  const quantityValue = document.querySelector('#quantity').value;
  if (quantityValue != null) {
    if (quantityValue < 0) document.querySelector('#quantity').value = 0;
    if (quantityValue > 100) document.querySelector('#quantity').value = 100;
  }
}

document.querySelector('#addToCart').addEventListener('click', addItemToCart);

document.querySelector('[name="itemQuantity"]').addEventListener('input',updateCartItemQuantity);
document.querySelector('[name="itemQuantity"]').addEventListener('keyup', quantityControl);
//
//------ Ajout d'un article ------//
//
function addItemToCart() {
  const selectedQuantity = document.querySelector('#quantity').value;
  const selectedColor = document.querySelector('#colors').value;

  if (selectedQuantity > 0 && selectedQuantity <= 100 && selectedColor !== '') {
    let cartItems = JSON.parse(localStorage.getItem('cartItems'));

    let item = {
      id: params,
      quantity: parseInt(selectedQuantity),
      color: selectedColor,
    };

    if (cartItems === null) {
      cartItems = [];
      cartItems.push(item);
    } else {
      let itemAlreadyExists = false;

      for (let i = 0; i < cartItems.length; i++) {
        if (cartItems[i].id === item.id && cartItems[i].color === item.color) {
          itemAlreadyExists = true;
          const currentQuantity = cartItems[i].quantity;
          const updatedQuantity = parseInt(currentQuantity) + parseInt(selectedQuantity);

          if (updatedQuantity > 100) {
            cartItems[i].quantity = 100;
            let remainingSpace = 100 - currentQuantity;
            if (remainingSpace > 0) {
              alert(`Vous avez déjà ${currentQuantity} article(s) sélectionné(s).
              La limite maximale de 100 sera atteinte !
              ${remainingSpace} articles supplémentaires seront ajoutés.`);
            } else {
              alert('Limite de quantité atteinte !');
            }
          } else {
            cartItems[i].quantity = updatedQuantity;
          }
          break;
        }
      }

      if (!itemAlreadyExists) {
        cartItems.push(item);
      }
    }

    localStorage.setItem('cartItems', JSON.stringify(cartItems));
    window.location.href = 'index.html';
  } else {
    checkFieldsValidity(selectedQuantity, selectedColor);
  }
}
//
//------ Test champs remplis -----//
//
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

function updateCartItemQuantity() {
			const selectedColor = document.querySelector('#colors').value;
			let cartItems = getByIdColor(params, selectedColor);
			let updatedQuantity = parseInt(document.querySelector('#quantity').value);

			if (updatedQuantity !== null && cartItems !== undefined) {
				cartItems.quantity = updatedQuantity;
				localStorage.setItem('cartItems', JSON.stringify(cartItems));
			}
}

function getByIdColor(id, color) {
			let cartItems = JSON.parse(localStorage.getItem('cartItems'));

			if (cartItems !== null) {
				for (let i = 0; i < cartItems.length; i++) {
					if (cartItems[i].id === id && cartItems[i].color === color) {
						return cartItems[i];
					}
				}
			}

  return undefined;
}


