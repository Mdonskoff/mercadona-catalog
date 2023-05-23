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
    xhttp.open('GET', '/catalog.json', true);
    xhttp.send();
}

document.onload = refreshCatalog()


