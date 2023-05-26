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

function prepareFilter(categories, update) {
  filterContainer = document.getElementById('productFilter');

  filterContainer.innerHTML = ""

  divFilter = document.createElement('div');
  divFilter.classList.add('product-filter-item');
  divFilter.classList.add('product-filter-discount');

  inputFilter = document.createElement('input');
  inputFilter.type = 'checkbox';
  inputFilter.id = 'filter_discount';
  inputFilter.addEventListener('click', update);
  divFilter.appendChild(inputFilter);

  labelFilter = document.createElement('label');
  labelFilter.innerHTML = 'En Promotion';
  labelFilter.htmlFor = 'filter_discount';

  divFilter.appendChild(labelFilter);

  filterContainer.appendChild(divFilter);

  categories.forEach(category => {
    cat_id = 'filter_cat_'+category.id;

    divFilter = document.createElement('div');
    divFilter.classList.add('product-filter-item');
    divFilter.classList.add('product-filter-cat');

    inputFilter = document.createElement('input');
    inputFilter.type = 'checkbox';
    inputFilter.id = cat_id;
    inputFilter.dataset.cat_id = category.id;
    inputFilter.addEventListener('click', update);
    divFilter.appendChild(inputFilter);

    labelFilter = document.createElement('label');
    labelFilter.innerHTML = category.name;
    labelFilter.htmlFor = cat_id;

    divFilter.appendChild(labelFilter);

    filterContainer.appendChild(divFilter);
  });
}


function make_product_filter() {
  filters = [];

  filterContainer = document.getElementById('productFilter');
  categories = []
  if (filterContainer != null) {
    for(d = 0 ; d < filterContainer.children.length ; d++) {
      divChild = filterContainer.children[d];
      for(c = 0 ; c < divChild.children.length ; c++) {
        child = divChild.children[c];
        if (child.type =='checkbox' && child.checked) {
          if ('cat_id' in child.dataset) {
          categories.push(child.dataset.cat_id);
          } else {
            filters.push('discounts=1');
          }
        }
      }
    }
  }

  if (categories.length > 0) {
    filters.push('cat=' + categories.join(','))
  }

  return filters.join('&');
}
