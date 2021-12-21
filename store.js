if (document.readyState == 'loading') {
  document.addEventListener('DOMContentLoaded', ready);
} else {
  ready();
}

function ready() {
  fetchData();
  let removeCartItemButtons = document.getElementsByClassName('btnDelete');
  for (let i = 0; i < removeCartItemButtons.length; i++) {
    let button = removeCartItemButtons[i];
    button.addEventListener('click', removeCartItem);
  }

  let quantityInputs = document.getElementsByClassName('purchaseQuantity');
  for (let i = 0; i < quantityInputs.length; i++) {
    let input = quantityInputs[i];
    input.addEventListener('change', quantityChanged);
  }

  let purchaseButton = document.getElementsByClassName('btnPurchase')[0];
  purchaseButton.addEventListener('click', purchaseClicked);
}

// Render shop items
const fetchData = async () => {
  try {
    const response = await fetch('db.json');
    const data = await response.json();
    renderShopItems(data);
  } catch (error) {
    console.log(error);
  }
};

const renderShopItems = (data) => {
  const itemsShopContainer = document.getElementById('shopItems');
  const templateCardItem = document.getElementById('shopItem').content;
  const fragment = document.createDocumentFragment();
  data.forEach((product) => {
    templateCardItem.querySelector('div').id = product.id;
    templateCardItem.querySelector('h2').textContent = product.productName;
    templateCardItem.querySelector('p').textContent = product.productPrice;
    templateCardItem.querySelector('img').setAttribute('src', product.img);
    templateCardItem
      .querySelector('button')
      .setAttribute('onclick', `addToCartClicked(${product.id})`);

    const clone = templateCardItem.cloneNode(true);
    fragment.appendChild(clone);
  });
  itemsShopContainer.appendChild(fragment);
};

// Purchase
function purchaseClicked() {
  let cart = document.getElementsByClassName('containerPurchase')[0];
  if (cart.hasChildNodes()) {
    alert('Thank you for purchase!');
  } else {
    alert('The cart is empty. Add some products!');
    return;
  }
  while (cart.hasChildNodes()) {
    cart.removeChild(cart.firstChild);
  }
  updateCartTotal();
}

// Remove item from cart
function removeCartItem(event) {
  let buttonClicked = event.target;
  buttonClicked.parentElement.remove();
  updateCartTotal();
}

// Change item quantity from cart
function quantityChanged(event) {
  let input = event.target;
  if (isNaN(input.value) || input.value <= 0) {
    input.value = 1;
  }
  updateCartTotal();
}

// Event for add item to cart
function addToCartClicked(id) {
  let shopItem = document.getElementById(id);
  let productName = shopItem.getElementsByClassName('productName')[0].innerText;
  let productPrice = parseFloat(
    shopItem
      .getElementsByClassName('productPrice')[0]
      .innerText.replace('$', '')
  );
  let productImg = shopItem.getElementsByClassName('productImg')[0].src;
  addToCart(productName, productPrice, productImg);
  updateCartTotal();
}

// Function add item to cart
function addToCart(productName, productPrice, productImg) {
  // create element container for the item content
  let cartNewItem = document.createElement('div');
  cartNewItem.classList.add('containerPurchaseItem');
  // get cart purchase element for place the new elements
  let cart = document.getElementsByClassName('containerPurchase')[0];
  let cartProductNames = cart.getElementsByClassName('purchaseName');
  for (let i = 0; i < cartProductNames.length; i++) {
    if (cartProductNames[i].innerText == productName) {
      alert('This product is already added to the cart');
      return;
    }
  }
  // Create new element
  // Create container for the product image and name
  let purchaseProduct = document.createElement('div');
  purchaseProduct.classList.add('purchaseProduct');
  // Create image
  let img = document.createElement('img');
  img.src = productImg;
  img.classList.add('purchaseImg');
  // Create product name
  let name = document.createElement('p');
  name.classList.add('purchaseName');
  name.innerText = productName;
  // Add product image and name to the element container
  purchaseProduct.append(img);
  purchaseProduct.append(name);
  // Create input for quantity
  let quantity = document.createElement('input');
  quantity.classList.add('purchaseQuantity');
  quantity.setAttribute('type', 'number');
  quantity.value = 1;
  // Create price
  let price = document.createElement('p');
  price.classList.add('purchasePrice');
  price.innerText = '$' + productPrice;
  // Create button delete
  let button = document.createElement('button');
  button.classList.add('btnDelete');
  button.innerText = 'x';
  // Add all the childs elements created to the element container
  cartNewItem.append(purchaseProduct);
  cartNewItem.append(quantity);
  cartNewItem.append(price);
  cartNewItem.append(button);
  // add the new element/item container to the cart
  cart.append(cartNewItem);
  // add event listener for the new buttons delete
  cartNewItem
    .getElementsByClassName('btnDelete')[0]
    .addEventListener('click', removeCartItem);
  // add event listener for the new inputs quantity
  cartNewItem
    .getElementsByClassName('purchaseQuantity')[0]
    .addEventListener('change', quantityChanged);
}

// Update Total
function updateCartTotal() {
  let purchaseElement = document.getElementsByClassName('containerPurchase')[0];
  let purchaseItemsElement = purchaseElement.getElementsByClassName(
    'containerPurchaseItem'
  );
  let total = 0;

  for (let i = 0; i < purchaseItemsElement.length; i++) {
    let purchaseItem = purchaseItemsElement[i];
    let priceItem = purchaseItem.getElementsByClassName('purchasePrice')[0];
    let quantityItem =
      purchaseItem.getElementsByClassName('purchaseQuantity')[0];

    let price = parseFloat(priceItem.innerText.replace('$', ''));
    let quantity = quantityItem.value;

    total = total + price * quantity;
  }
  total = Math.round(total * 100) / 100;
  document.getElementsByClassName('containerTotalPrice')[0].innerText =
    '$' + total;
}

// Open shop cart
function closeCart() {
  document.querySelector('.containerCart').classList.toggle('hideCart');
}
