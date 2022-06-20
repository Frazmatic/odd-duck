
let header = document.querySelector('header');
let main = document.querySelector('main');
let headline = document.createElement('h1');
header.appendChild(headline);
headline.textContent = '___ has been clicked ___ times.';
const images = ['bag.jpg', 'banana.jpg', 'bathroom.jpg', 'boots.jpg', 'breakfast.jpg', 'bubblegum.jpg', 'chair.jpg', 'cthulhu.jpg', 'dog-duck.jpg', 'pen.jpg', 'pet-sweep.jpg', 'scissors.jpg', 'shark.jpg', 'sweep.png', 'tauntaun.jpg', 'unicorn.jpg', 'water-can.jpg', 'wine-glass.jpg'];
const imgDirectory = 'img/';

function Product(filename, directory){
  this.name = filename.split('.')[0];
  this.filepath = `./${directory}${filename}`;
  this.shown = 0;
  this.clicked = 0;
  this.element = document.createElement('img');
  this.element.src = this.filepath;
}

Product.prototype.clickEvent = function(){
  let p = this;
  return function(event){
    p.clicked++;
    headline.textContent = `${p.name} has been clicked ${p.clicked} times.`;
  };
};

function ProductCollection(imagesArray, directory){
  this.currentProducts = [];
  this.allProducts = (function(fileList, dir){
    let products = [];
    for (let filename of fileList){
      let product = new Product(filename, dir);
      product.element.addEventListener('click', product.clickEvent());
      products.push(product);
    }
    return products;
  })(imagesArray, directory);
}

ProductCollection.prototype.isInCurrent = function(product){
  for(let currentProd of this.currentProducts){
    if (product.name === currentProd.name){
      return true;
    }
  }
  return false;
};

ProductCollection.prototype.selectCurrent = function(howMany){
  this.currentProducts = [];
  while (this.currentProducts.length < howMany && this.currentProducts.length <= this.allProducts.length){
    let prod = this.allProducts[Math.floor(Math.random() * this.allProducts.length)];
    if (this.isInCurrent(prod)){
      continue;
    }
    else {
      this.currentProducts.push(prod);
    }
  }
};

ProductCollection.prototype.display = function(element){
  element.innerHTML = '';
  for(let prod of this.currentProducts){
    prod.shown++;
    element.appendChild(prod.element);
  }
};

let products = new ProductCollection(images, imgDirectory);
products.selectCurrent(3);
products.display(main);


