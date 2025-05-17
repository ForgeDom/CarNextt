import { useEffect, useState } from "react";
import { createClient } from "@supabase/supabase-js";
import "/public/merch.css";
import productsData from "@public/products-list.json";

// Supabase
const supabaseUrl = "https://vjwhvtoaimxkpubedbao.supabase.co";
const supabaseKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZqd2h2dG9haW14a3B1YmVkYmFvIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDUzMzg1MjYsImV4cCI6MjA2MDkxNDUyNn0.FVfec86PZ7wwyPr7gdYfOC40J7AQp71DCQPKRSNMnt8";
const client = createClient(supabaseUrl, supabaseKey);

interface Product {
  title: string;
  price: number;
  id: string;
  image: string;
}

interface CartItem extends Product {
  amount: number;
}

const Merch = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [cartOpen, setCartOpen] = useState(false);
  const [cartInitialized, setCartInitialized] = useState(false);

  useEffect(() => {
    // EmailJS init
    const scriptEmail = document.createElement("script");
    scriptEmail.src = "https://cdn.jsdelivr.net/npm/@emailjs/browser@3/dist/email.min.js";
    scriptEmail.onload = () => {
      // @ts-ignore
      emailjs.init("EKd1zTLqaMemtv6yM");
    };
    document.body.appendChild(scriptEmail);

    // Get products
    const items = productsData.items.map((item: any) => {
      const { title, price } = item.fields;
      const id = item.sys.id;
      const image = item.fields.image.fields.file.url;
      return { title, price, id, image };
    });
    setProducts(items);

    const email = localStorage.getItem("email");

    if (email) {
      client
        .from("users")
        .select("cart")
        .eq("email", email)
        .single()
        .then(({ data, error }) => {
          if (error) {
            console.error(error);
            const savedCart = localStorage.getItem("cart");
            if (savedCart) {
              setCart(JSON.parse(savedCart));
            }
          } else if (data && data.cart) {
            setCart(data.cart);
          }
          setCartInitialized(true);
        });
    } else {
      const savedCart = localStorage.getItem("cart");
      if (savedCart) {
        setCart(JSON.parse(savedCart));
      }
      setCartInitialized(true);
    }
  }, []);

  useEffect(() => {
    if (!cartInitialized) return;

    localStorage.setItem("cart", JSON.stringify(cart));

    const email = localStorage.getItem("email");
    if (!email) return;

    const syncCartToSupabase = async () => {
      try {
        const { error } = await client
          .from("users")
          .upsert([{ email, cart }], { onConflict: "email" });

        if (error) {
          console.error(error);
        }
      } catch (err) {
        console.error("sync error:", err);
      }
    };

    syncCartToSupabase();
  }, [cart, cartInitialized]);

  const addToCart = (product: Product) => {
    const exists = cart.find((item) => item.id === product.id);
    if (exists) return;
    setCart([...cart, { ...product, amount: 1 }]);
  };

  const removeFromCart = (id: string) => {
    setCart(cart.filter((item) => item.id !== id));
  };

  const updateAmount = (id: string, delta: number) => {
    setCart((prev) =>
      prev
        .map((item) =>
          item.id === id ? { ...item, amount: item.amount + delta } : item
        )
        .filter((item) => item.amount > 0)
    );
  };

  const clearCart = () => {
    setCart([]);
  };

  const sendOrder = () => {
    let em = localStorage.getItem("email");
    console.log(em);

    // @ts-ignore
    const emailjs = window.emailjs;
    const orders = cart.map((item) => ({
      name: item.title,
      price: item.price.toFixed(2),
      units: item.amount,
    }));
    const total = cart.reduce((sum, item) => sum + item.price * item.amount, 0).toFixed(2);

    const templateParams = {
      email: em + ", oldtimer.vin@gmail.com",
      orders,
      order_id: Math.floor(100000 + Math.random() * 900000),
      cost: { total },
    };
    console.log(templateParams.email);

    emailjs
      .send("service_c7q82wl", "template_nkocwee", templateParams)
      .then(() => alert("Замовлення надіслано успішно!"))
      .catch((err: any) => {
        console.error(err);
        alert("Сталася помилка при надсиланні замовлення.");
      });
  };

  const cartTotal = cart.reduce((sum, item) => sum + item.price * item.amount, 0);
  const cartCount = cart.reduce((sum, item) => sum + item.amount, 0);
  return (
    <>
    <div className="section-title">
            <h1>Наша атрибутика</h1>
          </div>
      <nav className="navbar">
        <div className="navbar-center">
          <div className="cart-btn" onClick={() => setCartOpen(true)}>
            <span className="nav-icon">
              <i className="fas fa-cart-plus"></i>
            </span>
            <div className="cart-items">{cartCount}</div>
          </div>
        </div>
      </nav>

      <div className={`main-content ${cartOpen ? "shifted" : ""}`}>
        <section className="products">
          
          <div className="products-center">
            {products.map((product) => (
              <article key={product.id} className="product">
                <div className="img-container">
                  <img src={product.image} alt={product.title} className="product-img" />
                  <button
                    className="bag-btn"
                    onClick={() => addToCart(product)}
                    disabled={!!cart.find((item) => item.id === product.id)}
                  >
                    <i className="fas fa-shopping-cart"></i>
                    {cart.find((item) => item.id === product.id)
                      ? "У кошику"
                      : "Додати до кошика"}
                  </button>
                </div>
                <h3>{product.title}</h3>
                <h4>{product.price} UAH</h4>
              </article>
            ))}
          </div>
        </section>
      </div>

      
      <div className={`cart ${cartOpen ? "open" : "closed"}`}>
          <span className="close-cart" onClick={() => setCartOpen(false)}>
            <i className="fas fa-window-close"></i>
          </span>
          <h2>Кошик</h2>
          <div className="cart-content">
            {cart.map((item) => (
              <div key={item.id} className="cart-item">
                <img src={item.image} alt={item.title} />
                <div>
                  <h4>{item.title}</h4>
                  <h5>{item.price} UAH</h5>
                  <span
                    className="remove-item"
                    onClick={() => removeFromCart(item.id)}
                  >
                    видалити з кошика
                  </span>
                </div>
                <div>
                  <i className="fas fa-chevron-up" onClick={() => updateAmount(item.id, 1)}></i>
                  <p className="item-amount">{item.amount}</p>
                  <i className="fas fa-chevron-down" onClick={() => updateAmount(item.id, -1)}></i>
                </div>
              </div>
            ))}
          </div>
          <div className="cart-footer">
            <h3>сума: <span className="cart-total">{cartTotal.toFixed(2)}</span> UAH</h3>
            <button className="clear-cart banner-btn" onClick={clearCart}>
              очистити кошик
            </button>
            <br />
            <br />
            <button className="send-order banner-btn" onClick={sendOrder}>
              надіслати замовлення
            </button>
          </div>
        </div>
    </>
  );
};

export default Merch;
