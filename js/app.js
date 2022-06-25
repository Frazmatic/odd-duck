'use strict';

function Product(filename, directory){
  this.name = filename.split('.')[0];
  this.filepath = `./${directory}/${filename}`;
  this.domNode = (function(filepath){let img = document.createElement('img'); img.src = filepath; return img;})(this.filepath);
  this.shown = 0;
  this.clicked = 0;
}

Product.load = function(JSONProduct){
  // './img/bag.jpg'
  let fileInformation = JSONProduct.filepath.split('/');
  let filename = fileInformation[fileInformation.length - 1];
  let directory = fileInformation[fileInformation.length - 2];
  let prod = new Product(filename, directory);
  prod.shown = JSONProduct.shown;
  prod.clicked = JSONProduct.clicked;
  return prod;

};

function ProductCollection(filenameArray, directory, displayArea, maxRounds, selectionSize){
  this.displayElement = displayArea;
  this.rounds = 0;
  this.maxRounds = maxRounds;
  this.size = selectionSize;
  this.currentProducts = [];
  this.allProducts = (function(filenameArray, directory){
    let products = [];
    for(let filename of filenameArray){
      let p = new Product(filename, directory);
      products.push(p);
    }
    return products;
  })(filenameArray, directory);
  this.chart = {labels: [], clicks: [], showns: []};
}

ProductCollection.prototype.eventListeners = function(type){
  for(let product of this.allProducts){
    if(type === 'add'){
      product.listenerFunction = handleClick(product);
      product.domNode.addEventListener('click', product.listenerFunction);
    } 
    else if (type === 'remove'){
      product.domNode.removeEventListener('click', product.listenerFunction);
    }
  }
  let collection = this;
  function handleClick(prod){
    return function(event){
      prod.clicked++;
      collection.rounds++;
      collection.update();
      collection.display();
    };
  }
};

ProductCollection.prototype.isIn = function(prod, prodArray){
  for(let otherProd of prodArray){
    if(otherProd.name === prod.name){
      return true;
    }
  }
  return false;
};

ProductCollection.prototype.update = function(){
  if (this.rounds >= this.maxRounds) {
    localStorage.setItem('products', JSON.stringify(this));
    this.eventListeners('remove');
    this.displayResults();
    this.rounds = 0;
    return;
  }

  let newProducts = [];
  while (newProducts.length < this.size && newProducts.length < this.allProducts.length){
    let prod = this.allProducts[Math.floor(Math.random() * this.allProducts.length)];
    if (this.isIn(prod, newProducts) || this.isIn(prod, this.currentProducts)){
      continue;
    }
    else {
      newProducts.push(prod);
    }
  }
  this.currentProducts = newProducts;

  localStorage.setItem('products', JSON.stringify(this));
};

ProductCollection.prototype.display = function(){
  this.displayElement.innerHTML = '';

  for (let prod of this.currentProducts){
    prod.shown++;
    this.displayElement.appendChild(prod.domNode);
  }
};

//update() calls this to display chart after max rounds (default 25) reached
ProductCollection.prototype.displayResults = function(){
  let labels = [];
  let clicks = [];
  let showns = [];

  for(let p of this.allProducts){
    labels.push(p.name);
    clicks.push(p.clicked);
    showns.push(p.shown);
  }

  //store chart data in localStorage
  this.chart.labels = labels;
  this.chart.clicks = clicks;
  this.chart.showns = showns;
  localStorage.setItem('products', JSON.stringify(this));

  const data = {
    labels: labels,
    datasets:
      [
        {
          label: 'Selected',
          backgroundColor: 'blue',
          data: clicks,
        },
        {
          label: 'Total Views',
          backgroundColor: 'green',
          data: showns,
        }
      ]
  };

  const config = {
    type: 'bar',
    data: data,
    options: {
      responsive: true,
      maintainAspectRatio: true}
  };

  let canv = document.getElementById('resultChart');
  const resultChart = new Chart(canv, config);
};

ProductCollection.load = function(JSONProductCollection, filenames, dir, displayArea){
  let allProducts = JSONProductCollection.allProducts;
  let currentProducts = JSONProductCollection.currentProducts;
  let maxRounds = JSONProductCollection.maxRounds;
  let rounds = JSONProductCollection.rounds;
  let size = JSONProductCollection.size;

  let newCollection = new ProductCollection(filenames, dir, displayArea, maxRounds, size);

  newCollection.rounds = rounds;

  newCollection.allProducts = [];
  for(let JSONProd of allProducts){
    newCollection.allProducts.push(Product.load(JSONProd));
  }

  for(let currProd of currentProducts){
    let name = currProd.name;
    for(let prod of newCollection.allProducts){
      if (name === prod.name){
        newCollection.currentProducts.push(prod);
      }
    }
  }
  return newCollection;
};

function main(){
  const filenames = ['bag.jpg', 'banana.jpg', 'bathroom.jpg', 'boots.jpg', 'breakfast.jpg', 'bubblegum.jpg', 'chair.jpg', 'cthulhu.jpg', 'dog-duck.jpg', 'pen.jpg', 'pet-sweep.jpg', 'scissors.jpg', 'shark.jpg', 'sweep.png', 'tauntaun.jpg', 'unicorn.jpg', 'water-can.jpg', 'wine-glass.jpg'];
  const dir = 'img';
  let mainHTML = document.querySelector('main');

  if (localStorage.getItem('products')){
    //if local storage exists on refresh or reload of page; load the products data.
    let products = ProductCollection.load(JSON.parse(localStorage.getItem('products')), filenames, dir, mainHTML);
    //charts data will be stored if a chart has been generated; refresh after chart has been displayed to load it via this parse
    products.eventListeners('add');
    products.display();
    if (products.rounds >= products.maxRounds){
      products.update();
    }
  }
  else {
    let products = new ProductCollection(filenames, dir, mainHTML, 25, 3);
    products.eventListeners('add');
    products.update();
    products.display();
  }

  let button = document.getElementById('resetButton');
  button.addEventListener('click', clearSaved);
  function clearSaved(event){
    localStorage.removeItem('products');
    location.reload();
  }
}

//localStorage.removeItem('products');
main();
