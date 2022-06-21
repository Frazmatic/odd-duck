'use strict';

const images = ['bag.jpg', 'banana.jpg', 'bathroom.jpg', 'boots.jpg', 'breakfast.jpg', 'bubblegum.jpg', 'chair.jpg', 'cthulhu.jpg', 'dog-duck.jpg', 'pen.jpg', 'pet-sweep.jpg', 'scissors.jpg', 'shark.jpg', 'sweep.png', 'tauntaun.jpg', 'unicorn.jpg', 'water-can.jpg', 'wine-glass.jpg'];
const imgDirectory = 'img/';
let maxRounds = 25;
const controller = new AbortController();

function Product(filename, directory){
  this.name = filename.split('.')[0];
  this.filepath = `./${directory}${filename}`;
  this.shown = 0;
  this.clicked = 0;
}

function ProductCollection(displayArea){
  this.currentProducts = {}; //{product: p, element: e}
  this.allProducts = {}; //{product: p, element: e}
  this.displayElement = displayArea; //e.g. main
  this.rounds = 0;
}

ProductCollection.prototype.handleClick = function(product){
  let collection = this;
  return function(event){
    product.clicked++;
    collection.rounds++;
    collection.display();
  };
};

ProductCollection.prototype.addAllProducts = function(imagesArray, directory){
  let products = {};
  for (let filename of imagesArray){
    let p = new Product(filename, directory);
    //can change element type here
    //might replace this with a call to an element builder
    let e = document.createElement('img');
    e.src = p.filepath;
    e.addEventListener('click', this.handleClick(p), {signal: controller.signal});
    products[p.name] = {product: p, element: e};
  }
  this.allProducts = products;
};

ProductCollection.prototype.display = function(){
  if (this.rounds >= maxRounds) {
    controller.abort();
    this.rounds = 0;
    this.displayResults();
    return;
  }

  this.displayElement.innerHTML = '';
  this.selectCurrent(3);

  for(let name in this.currentProducts){
    let p = this.currentProducts[name].product;
    let e = this.currentProducts[name].element;
    p.shown++;
    this.displayElement.appendChild(e);
  }
};

ProductCollection.prototype.displayResults = function(){
  let labels = [];
  let clicks = [];
  let showns = [];

  for(let p in this.allProducts){
    let prod = this.allProducts[p].product;
    labels.push(prod.name);
    clicks.push(prod.clicked);
    showns.push(prod.shown);
  }

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
    options: {}
  };

  let canv = document.getElementById('mychart');
  const mychart = new Chart(canv, config);

};

function isIn(item, array){
  for(let i of array){
    if (i === item){
      return true;
    }
  }
  return false;
}

ProductCollection.prototype.selectCurrent = function(howMany){
  let newKeys = [];
  let currentKeys =Object.keys(this.currentProducts);
  let allKeys = Object.keys(this.allProducts);
  this.currentProducts = {};

  while (newKeys.length < howMany && newKeys.length <= allKeys.length){
    let key = allKeys[Math.floor(Math.random() * allKeys.length)];
    if (isIn(key, newKeys) || isIn(key, currentKeys)){
      continue;
    }
    else {
      newKeys.push(key);
    }
  }

  for (let key of newKeys){
    this.currentProducts[key] = this.allProducts[key];
  }
};

let main = document.querySelector('main');
let products = new ProductCollection(main);
products.addAllProducts(images, imgDirectory);
products.selectCurrent(3);
products.display();
