let header = document.querySelector('header');
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
  this.imgElement = document.createElement('img');
  this.imgElement.src = this.filepath;
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
      product.imgElement.addEventListener('click', product.clickEvent());
      products.push(product);
    }
    return products;
  })(imagesArray, directory);
}

let products = new ProductCollection(images, imgDirectory);

let main = document.querySelector('main');

for (let p of products.allProducts){
  main.appendChild(p.imgElement);
}
