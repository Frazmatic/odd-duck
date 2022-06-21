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

ProductCollection.prototype.handleButton = function(){
  let collection = this;
  return function(event){
    collection.rounds = 0;
    collection.displayResults();
  }
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
  this.displayElement.innerHTML = '';
  this.selectCurrent(3);

  for(let name in this.currentProducts){
    let p = this.currentProducts[name].product;
    let e = this.currentProducts[name].element;
    p.shown++;
    this.displayElement.appendChild(e);
  }
  console.log(this.rounds);
  if (this.rounds >= 25) {
    let button = document.createElement('button');
    button.innerText = 'View Results';
    button.addEventListener('click', this.handleButton());
    this.displayElement.appendChild(button);
    controller.abort();
  }
};

ProductCollection.prototype.displayResults = function(){
  this.displayElement.innerHTML = '';
  let ul = document.createElement('ul');
  for (let p in this.allProducts){
    let prod = this.allProducts[p].product;
    let li = document.createElement('li');
    li.textContent = `${prod.name} had ${prod.clicked} votes, and was seen ${prod.shown} times.`;
    ul.appendChild(li);
  }
  this.displayElement.appendChild(ul);
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
  let allKeys = Object.keys(this.allProducts);
  let newIndexes = [];
  while (newIndexes.length < howMany && newIndexes.length <= allKeys.length){
    let randomIndex = Math.floor(Math.random() * allKeys.length);
    if (isIn(randomIndex, newIndexes)){
      continue;
    }
    else{
      newIndexes.push(randomIndex);
    }
  }

  this.currentProducts = {};
  for (let i of newIndexes){
    this.currentProducts[allKeys[i]] = this.allProducts[allKeys[i]];
  }
};

let main = document.querySelector('main');
let products = new ProductCollection(main);
products.addAllProducts(images, imgDirectory);
products.selectCurrent(3);
products.display();


