// -- Récupération de L'URL de orderID -- //
let orderId = new URLSearchParams(window.location.search).get('orderId');

// -- Ajout du N° de Commande -- //
document.getElementById('orderId').textContent = orderId;

// -- Vide le localStorage -- //
window.localStorage.clear();