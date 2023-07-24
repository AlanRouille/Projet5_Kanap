// Fonction pour compter le nombre d'articles dans le panier
function countItemsInCart() {
    let cartItems = JSON.parse(localStorage.getItem('cartItems'));
    let itemCount = 0;
  
    if (Array.isArray(cartItems)) {
      itemCount = cartItems.reduce((total, item) => total + item.quantity, 0);
    }
  
    updateCartItemCount(itemCount);
  }
  
  // Fonction pour mettre à jour le nombre d'articles dans l'interface
  function updateCartItemCount(count) {
    const cartItemCountElement = document.getElementById('cartItemCount');
    cartItemCountElement.textContent = count;
  }
  
  // Appeler la fonction au chargement de la page pour initialiser le compteur
  document.addEventListener('DOMContentLoaded', () => {
    countItemsInCart();
  });