//variables
const cartBtn = document.querySelector(".cart-btn");
const closeCartBtn = document.querySelector(".close-cart");
const clearCartBtn = document.querySelector(".clear-cart");
const cartDOM = document.querySelector(".cart");
const cartOverlay = document.querySelector(".cart-overlay");
const cartItems = document.querySelector(".cart-items");
const cartTotal = document.querySelector(".cart-total");
const cartContent = document.querySelector(".cart-content");
const productsDOM = document.querySelector(".products-center");

let currentEmail = "";

// cart 
let cart = [];
//buttons
let buttonsDOM =[];

// getting the products
class Products{
  async getProducts(){
      try{
          let result = await fetch("products-list.json");
          let data = await result.json();
          let products = data.items;
          products = products.map(item =>{
            const {title,price}= item.fields;
            const {id} = item.sys;
            // const {link} = item.link;
            const image =item.fields.image.fields.file.url;
            return {title,price,id,image}
          })
           return products;  
      }catch (error){
          console.log(error);
          
      }
      
   }
}
//display product
class UI{
   displayProducts(products){
   let result ="";
   products.forEach(product => {
     result += `
     <article class="product">
               <div class="img-container">
                   <img src=${product.image} alt="product" class="product-img">
                   <button class="bag-btn" data-id=${product.id}>
                       <i class="fas fa-shopping-cart"></i>
                       Додати до кошика
                   </button>
               </div> 
               <h3>${product.title}</h3>
               <h4>${product.price} UAH</h4>
      </article>  
     ` ; 
   }); 
 productsDOM.innerHTML = result;
   }
  getBagButtons(){
      const buttons = [...document.querySelectorAll(".bag-btn")];
      buttonsDOM = buttons;
      buttons.forEach(button => {
        let id =button.dataset.id;
        let inCart = cart.find(item =>item.id === id);
        if (inCart){
            button.innerText= "У кошику";
            button.disabled = true;
        }
    
           button.addEventListener('click',(event)=>{
              event.target.innerText = "У кошику";
              event.target.disabled = true;
              //get product from products
              let cartItem = {...Storage.getProduct(id),amount:1};
              //add product to the cart
              cart = [...cart,cartItem];
              //save cart in local storage
              Storage.saveCart(cart );
              //set cart values
               this.setCartValues(cart);
              //display cart item
               this.addCardItem(cartItem);
              //show the cart
               this.showCart();

           });
        
      });
       
  } 
  setCartValues(cart){
      let tempTotal = 0;
      let itemsTotal=0;
      cart.map(item =>{
          tempTotal += item.price * item.amount;
          itemsTotal += item.amount;
      })
      cartTotal.innerText = parseFloat (tempTotal.toFixed(2));
      cartItems.innerText = itemsTotal;
      //console.log(cartTotal,cartItems);
  }
  addCardItem(item){
    const div = document.createElement('div');
    div.classList.add('cart-item');
      div.innerHTML =` <img src=${item.image} alt="product"> 
                      <div>
                          <h4>${item.title}</h4>
                          <h5>${item.price} UAH</h5>
                          <span class="remove-item" data-id=${item.id}>видалити з кошика</span>
                      </div>
                      <div>
                          <i class="fas fa-chevron-up" data-id=${item.id}></i>
                          <p class="item-amount">${item.amount}</p>
                          <i class="fas fa-chevron-down" data-id=${item.id}></i>
                      </div> `;
      cartContent.appendChild(div);

  }
   showCart(){
     cartOverlay.classList.add('transparentBcg') ;
     cartDOM.classList.add('showCart');
   }
  setupApp(){
     cart = Storage.getCart();
     this.setCartValues(cart);
     this.populateCart(cart);
     cartBtn.addEventListener('click',this.showCart);
     closeCartBtn.addEventListener('click',this.hideCart);
  } 
  populateCart(cart){
      cart.forEach(item => this.addCardItem(item));
  }
  hideCart(){
      cartOverlay.classList.remove('transparentBcg');
      cartDOM.classList.remove('showCart');
  }
  cartLogic(){
      //clear cart button
      clearCartBtn.addEventListener("click",()=>{this.clearCart();
    });
     //cart functionality 
      cartContent.addEventListener ('click',event=>{
      if(event.target.classList.contains('remove-item'))
      {
          let removeItem = event.target;
          let id = removeItem.dataset.id;
          cartContent.removeChild(removeItem.parentElement.parentElement); 
          this.removeItem(id);
      }  
      else if (event.target.classList.contains('fa-chevron-up')) 
      {
         let addAmount = event.target; 
         let id = addAmount.dataset.id;
         let tempItem = cart.find(item => item.id === id);
         tempItem.amount = tempItem.amount + 1;
         Storage.saveCart(cart);
         this.setCartValues(cart);
         addAmount.nextElementSibling.innerText =
         tempItem.amount;
      } 
      else if (event.target.classList.contains('fa-chevron-down')) 
      {
         let lowerAmount = event.target;
         let id = lowerAmount.dataset.id;
         let tempItem = cart.find(item => item.id === id);
         tempItem.amount = tempItem.amount - 1;
         if(tempItem.amount > 0){
             Storage.saveCart(cart);
             this.setCartValues(cart);
             lowerAmount.previousElementSibling.innerText = tempItem.amount;
         }
         else {
             cartContent.removeChild(lowerAmount.parentElement.parentElement);
             this.removeItem(id);
         }
      }
    });
  }
  clearCart(){
     let cartItems = cart.map(item =>item.id);
     cartItems.forEach(id => this.removeItem(id));
     console.log(cartContent.children);
     while (cartContent.children.length > 0){
         cartContent.removeChild (cartContent.children[0]);
     }
    //  document.getElementById('cart-item').innerHTML='';
      this.hideCart();
  }
  removeItem(id){
      cart = cart.filter(item => item.id !==id);
      this.setCartValues(cart);
      Storage.saveCart(cart);
      let button = this.getSingleButton(id);
      button.disabled = false;
      button.innerHTML = `<i class= "fas fa-shopping-cart"></i>add to cart`;
  }
  getSingleButton(id){
     return buttonsDOM.find(button => button.dataset.id === id);
  }
}
//local storage 
class Storage{
 static saveProducts(products){
     localStorage.setItem("products",JSON.stringify(products));
 }
 static getProduct(id){
    let products =JSON.parse(localStorage.getItem('products'));
    return products.find(product => product.id=== id); 
 }
 static saveCart(cart){
     localStorage.setItem('cart',JSON.stringify(cart))
 }
 static getCart(){
    return localStorage.getItem('cart')?JSON.parse(localStorage.getItem('cart')):[] 
 }
}
document.addEventListener("DOMContentLoaded",()=>{
 const ui= new UI();
 const products = new Products();
 //setup app
    ui.setupApp();
 //get all products
 products.getProducts().then(products => {ui.displayProducts(products)
 Storage.saveProducts(products);
 }).then(()=>{
     ui.getBagButtons();
     ui.cartLogic();
 });
//  let sendTo = 'oldtimer.vin@gmail.com, lxndrua@gmail.com';
let sendTo = 'oldtimer.vin@gmail.com, lxndrua@gmail.com';
 document.querySelector('.send-order').addEventListener('click', () => {
  // Form the array of items in the cart
  const orders = cart.map(item => ({
    name: item.title,              // matches {{name}} in template
    price: item.price.toFixed(2),  // matches {{price}} in template
    units: item.amount,           // matches {{units}} in template
    itemImage: item.link
    // image_url: item.link
    // image_url: 'https://drive.google.com/file/d/1GNIsNrJ4rrdhDcDBk0EGNfSNZb57KwEB/view?usp=sharing'
  }));

  // Calculate the total price
  const total = cart.reduce((sum, item) => sum + item.price * item.amount, 0).toFixed(2);

  // Dummy values for shipping and tax (you can make these dynamic too)
  // const shippingCost = 0.00;
  // const taxCost = 0.00;

  // Prepare the full templateParams object
  const templateParams = {
    email: sendTo,
    orders: orders,                        // used in {{#orders}} loop
    order_id: Math.floor(100000 + Math.random() * 900000),  // generates 6-digit ID
    cost: {
      // shipping: shippingCost.toFixed(2),  // matches {{cost.shipping}}
      // tax: taxCost.toFixed(2),            // matches {{cost.tax}}
      total: total                        // matches {{cost.total}}
    }
  };

  // Send the email
  emailjs.send('service_c7q82wl', 'template_nkocwee', templateParams)
    .then(() => {
      alert('Замовлення надіслано успішно!');
    }, (error) => {
      console.error('EmailJS Error:', error);
      alert('Сталася помилка при надсиланні замовлення.');
    });
});

//  document.querySelector('.send-order').addEventListener('click', () => {
//     const orderDetails = cart.map(item => {
//       return `${item.title} - ${item.amount} x ${item.price} UAH`;
//     }).join('\n');
  
//     const total = cart.reduce((sum, item) => sum + item.price * item.amount, 0);
  
//     const templateParams = {
//       message: orderDetails,
//       total: total.toFixed(2)
//     };
  
//     emailjs.send('service_c7q82wl', 'template_nkocwee', templateParams)
//       .then(() => {
//         alert('Замовлення надіслано!');
//       }, (error) => {
//         console.error('EmailJS Error:', error);
//         alert('Помилка надсилання замовлення.');
//       });
//   });
  
});

// import { createClient } from '@supabase/supabase-js'


function toSignIn (){
  window.location.href = "sign-in.html";
}
function toLogIn (){
  window.location.href = "log-in.html";
}
function toIndex (){
  window.location.href = "index.html";
}

//Log in and sign up system

async function addUser() {
  if (!document.getElementById('sign-email').value || !document.getElementById('sign-password').value){
      console.log('empty input');
      return;
  }
  let email = document.getElementById('sign-email').value;
  let password = document.getElementById('sign-password').value;

  // console.log(email, password);

  const { data, error } = await client
  .from('users')
  .insert([
      { email: email, password: password },
  ])
  .select()

  document.getElementById('sign-email').value='';
  document.getElementById('sign-password').value='';
}

async function logIn() {
  if (!document.getElementById('log-email').value || !document.getElementById('log-password').value){
      console.log('empty input');
      return;
  }
  let email = document.getElementById('log-email').value;
  let password = document.getElementById('log-password').value;

  let { data: users, error } = await client
  .from('users')
  .select('*')

  // console.log(email, password);

  let found = false;

  users.forEach(user => {
      if (user.email === email){
          found = true;
          if (user.password === password){
            currentEmail = user.email;
             console.log(currentEmail);
              toIndex();
          } else{
              document.getElementById('without-account').innerText='Incorrect password!';
              document.getElementById('without-account').style.visibility='visible';
          }
      } 
      if (user.email===users[users.length-1].email && found === false){
          document.getElementById('without-account').innerText='You haven\'t signed in yet, sign in!';
          document.getElementById('without-account').style.visibility='visible';
      }
  });
}

async function fetchCart() {//is called when website is loading and sets the cart in local storage from the supabase
  console.log(currentEmail);
  const { data: habits, error } = await client
    .from('users')
    .select("*")
    .eq(currentEmail)

  if (error) {
    console.error('error', error.message);
    return;
  }

  if (!habits || habits.length === 0) {
    console.warn('No emails found in the database.');
    return;
  }

  console.log(habits);


  // document.getElementById('general-habs').innerHTML = `
  // <tr>
  // <th class="general-th">Name of notification</th>
  // <th class="general-th">First date</th>
  // <th class="general-th">Next date</th>
  // <th class="general-th">Frequency</th>
  // <th class="general-th">Notes</th>
  // <th class="general-th">Delete</th>
  // </tr>`;
  
  // habits.forEach(habit => {
  //   document.getElementById('general-habs').innerHTML+=`<tr>
  //       <td class="general-td">${habit.habit}</td>
  //       <td class="general-td">${formatDate(habit.first_date)}</td>
  //       <td class="general-td">${formatDate(habit.next_date)}</td>
  //       <td class="general-td">${habit.frequency}</td>
  //       <td class="general-td">${habit.notes}</td>
  //       <td class="general-td"><button class="removeButton" onclick="deleteHabits('${habit.habit}');">Delete</button></td>
  //     </tr>`
  // });
}

async function syncCart() {
  
}

function initializeProject(){
  fetchCart();
  console.log("init");
}
document.addEventListener("DOMContentLoaded",
initializeProject());