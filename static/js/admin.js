function clearProductDetailsForm() {
  document.getElementById('admin-product-details-form').reset();
  document.getElementById('admDetailsPrice').value = 0.0;
  clearThumbnail();
  updatePromoFormEnabled();
  updateEnableProductCheckbox();

  formProduct = document.getElementById('admin-product-details-form');
  delete formProduct.dataset.current_product;
  formProduct.action = "admin.html";
  document.getElementById('admin-product-list').childNodes.forEach(btnToUnselect => { btnToUnselect.classList.remove('active'); });
  document.getElementById('admDelete').hidden=true;
  document.getElementById('admPromoEnabled').disabled = true
}

function clearThumbnail() {
    divPreview = document.getElementById('admin-product-preview')
    divPreview.innerHTML = ""
}

function onAdminProduct_Click(type, listenever) {
  btnSelected = type.target;

  // Récupérer les informations du produits et populater le formulaire
  clearProductDetailsForm();

  var xhttp = new XMLHttpRequest();
   xhttp.onreadystatechange = function() {
      if (this.readyState == 4 && this.status == 200) {
        product = JSON.parse(this.responseText).product

        // Mettre à jour le formulaire
        document.getElementById('admDetailsName').value = product.name;
        document.getElementById('admDetailsDesc').value = product.description;
        document.getElementById('admDetailsPrice').value = product.price;
        document.getElementById('admDetailsEnabled').checked = product.enabled;
        document.getElementById('admDetailsCat').value = product.category;

        // La promotion
        if (product.discount) {
          document.getElementById('admPromoEnabled').checked = true;
          document.getElementById('admPromoValue').value = product.discount.value;
          document.getElementById('admPromoStart').value = product.discount.start_date;
          document.getElementById('admPromoEnd').value = product.discount.end_date;

          // txtbxPromoValue.disabled = true
        }
        updatePromoFormEnabled()

        formProduct = document.getElementById('admin-product-details-form');
        formProduct.dataset.current_product = product.id;
        formProduct.action = "admin.html?id="+product.id;

        btnValidate = document.getElementById('admValidate');
        btnValidate.innerHTML= 'Mettre à jour';
        btnValidate.disabled = false;

        updateEnableProductCheckbox();
        document.getElementById('admPromoEnabled').disabled = false

        // Mettre à jour le preview
        divPreview = document.getElementById('admin-product-preview')
        divPreview.appendChild(buildProductDiv(product))

        // Afficher le bouton de suppression
        document.getElementById('admDelete').hidden=false;

        information(null)
      }
    }
  xhttp.open('GET', '/product.json?id='+btnSelected.dataset.product_id, true);
  xhttp.send();


  // // Desactive tous les boutons et active celui là.
  // btnProduct.dataset.product_id = product.id;
  document.getElementById('admin-product-list').childNodes.forEach(btnToUnselect => { btnToUnselect.classList.remove('active'); });
  btnSelected.classList.add('active');
}

function updatePromoFormEnabled() {
  has_promo = document.getElementById('admPromoEnabled').checked;
  txtbxPromoValue = document.getElementById('admPromoValue');
  txtbxPromoValue.disabled = !has_promo;
  txtbxPromoValue.value = 0;

  txtbxPromoStart = document.getElementById('admPromoStart');
  txtbxPromoStart.disabled = !has_promo;
  txtbxPromoStart.valueAsDate = new Date();;

  txtbxPromoEnd = document.getElementById('admPromoEnd');
  txtbxPromoEnd.disabled = !has_promo;
  txtbxPromoEnd.valueAsDate = new Date();;

}

function getProductList() {
    clearProductDetailsForm();
    var xhttp = new XMLHttpRequest();
     xhttp.onreadystatechange = function() {
      if (this.readyState == 4 && this.status == 200) {

        // Récupérer le div container et formatter les résultats reçus
        divProducts = document.getElementById('admin-product-list');
        products = JSON.parse(this.responseText).products

        divProducts.innerHTML = "";

        products.forEach(product => {
          btnProduct = document.createElement('button');
          btnProduct.type = 'button'
          btnProduct.classList.add('list-group-item');
          btnProduct.classList.add('list-group-item-action');
          btnProduct.dataset.product_id = product.id;
          btnProduct.innerHTML += product.name;
          btnProduct.addEventListener("click", onAdminProduct_Click); 
          divProducts.appendChild(btnProduct);
        });
        
      }
    };

     url = '/catalog.json?all=yes&'+make_product_filter()
    xhttp.open('GET', url, true);
    xhttp.send(null);
}

function getCategoryList() {

    var xhttp = new XMLHttpRequest();
     xhttp.onreadystatechange = function() {
      if (this.readyState == 4 && this.status == 200) {

        categories = JSON.parse(this.responseText).categories

        ddlCategories = document.getElementById('admDetailsCat');
        ddlCategories.innerHTML = "";

        categories.forEach(category => { 
          
           option = document.createElement('option');
           option.innerHTML = category.name;
           option.value = category.id;
           ddlCategories.appendChild(option);
        });
        prepareFilter(categories, getProductList);
      }
    };
    xhttp.open('GET', '/categories.json', true);
    xhttp.send();


}

function updateEnableProductCheckbox() {
  cbxEnabled = document.getElementById('admDetailsEnabled');
  lblEnabled = document.getElementById('admDetailsEnabledLabel');
  lblEnabled.innerHTML = cbxEnabled.checked ? 'Actif' : 'Inactif';
}

function prepareNewProduct() {
  clearProductDetailsForm();
  document.getElementById('admDetailsName').value = "Nouveau Produit";
  btnValidate = document.getElementById('admValidate');
  btnValidate.innerHTML= 'Créer';
  btnValidate.disabled = false;
  document.getElementById('admPromoEnabled').disabled = true
  information(null)
}

function deleteCurrentProduct() {

  var xhttp = new XMLHttpRequest();
   xhttp.onreadystatechange = function() {
      if (this.readyState == 4 && this.status == 200) {
        preparePage();
        information("Produit supprimé");
      }
    }

  form = document.getElementById('admin-product-details-form');
  product_id = form.dataset.current_product;
  xhttp.open('GET', '/delete/'+product_id+'/', true);
  xhttp.send();
}

// Message d'inforamtion des actions avec le produit
function information(message) {
  pInfo = document.getElementById('information');
  if (message != null && message.length > 0) {
    pInfo.innerHTML = message;
  } else {
    pInfo.innerHTML = "";
  }
}

function preparePage() {
  getCategoryList();
  getProductList();

  document.getElementById('admDetailsEnabled').addEventListener('click', updateEnableProductCheckbox);
  document.getElementById('admPromoEnabled').addEventListener('change', updatePromoFormEnabled);
  document.getElementById('admValidate').disabled = true;
  document.getElementById('admCreate').addEventListener('click', prepareNewProduct);
  document.getElementById('admDelete').addEventListener('click', deleteCurrentProduct);

}


document.onload = preparePage()

