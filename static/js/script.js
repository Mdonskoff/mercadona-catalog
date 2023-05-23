function buildProductDiv(product) {
  // console.log(product);
  // Image
  divPic = document.createElement('div');
  divPic.classList.add('product-img');
  img = document.createElement('img');
  img.src = product.picture;
  img.alt = product.name;
  divPic.appendChild(img);

  // Product info bloc
  divInfo = document.createElement('div');
  divInfo.classList.add('product-info');

  // title
  hName = document.createElement('h4');
  hName.innerHTML = product.name;
  divInfo.appendChild(hName);

  // Description
  pDesc = document.createElement('p');
  pDesc.classList.add('product-desc');
  pDesc.innerHTML = product.description;
  divInfo.appendChild(pDesc);

  // Prices
  const formatter = new Intl.NumberFormat('fr-FR', {
    style: 'currency',
    currency: 'EUR',
  });
  
  pPrice = document.createElement('p');
  pPrice.classList.add('product-price');

  spanPrice = document.createElement('span');
  spanPrice.innerHTML = formatter.format(product.price);
  pPrice.appendChild(spanPrice);

  if(product.discount) {
    spanPrice.classList.add('product-original-price');

    spanDiscountPrice = document.createElement('span');
    spanDiscountPrice.classList.add('product-discount-price');
    spanDiscountPrice.innerHTML = " "+formatter.format(product.discount.price);
    pPrice.appendChild(spanDiscountPrice);
  } else {
    spanPrice.classList.add('product-normal-price');
  }

  divInfo.appendChild(pPrice);

  // Item div
  divItem = document.createElement('div');
  divItem.classList.add('product-item');

  divItem.appendChild(divPic);
  divItem.appendChild(divInfo);
  return divItem;
}

