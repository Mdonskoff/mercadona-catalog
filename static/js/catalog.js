function refreshCatalog() {
    var xhttp = new XMLHttpRequest();
     xhttp.onreadystatechange = function() {
      if (this.readyState == 4 && this.status == 200) {

        // Récupérer le div container et formatter les résultats reçus
        container = document.getElementById('product-list');
        products = JSON.parse(this.responseText).products

        container.innerHTML = "";

        products.forEach(product => {
          container.appendChild(buildProductDiv(product));
        });

        
      }
    };

     url = '/catalog.json?'+make_product_filter()
    console.log(url);
    xhttp.open('GET',url, true);
    xhttp.send();
}

function preparePage() {
  refreshCatalog();

  var xhttp = new XMLHttpRequest();
   xhttp.onreadystatechange = function() {
    if (this.readyState == 4 && this.status == 200) {
      categories = JSON.parse(this.responseText).categories
      prepareFilter(categories, refreshCatalog);
    }
  };
  xhttp.open('GET', '/categories.json', true);
  xhttp.send();
}

document.onload = preparePage()


