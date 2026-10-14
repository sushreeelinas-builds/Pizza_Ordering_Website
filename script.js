 const locationInput = document.getElementById("deliveryLocation");
window.addEventListener("DOMContentLoaded", function () {
    const savedLocation = localStorage.getItem("deliveryLocation");

    if (savedLocation) {
        locationInput.value = savedLocation;
    }
});

locationInput.addEventListener("keydown", function (event) {
    if (event.key === "Enter") {
        const location = locationInput.value.trim();

        if (location !== "") {
            localStorage.setItem("deliveryLocation", location);
            alert("Delivery location saved successfully!");
        } else {
            alert("Please enter your delivery location.");
        }
    }
});

 
 const categoryContainer = document.getElementById("categoryContainer");

categoryContainer.innerHTML = categories.map(item => `
  <a href="menu.html#${item.id}"
     class="group shrink-0 w-36 text-center">

    <div class="w-36 h-36 mx-auto rounded-full overflow-hidden
                border-4 border-gray-100">
      <img src="${item.main_img}"
           alt="${item.category}"
           class="w-full h-full object-cover
                  transition-transform duration-300
                  group-hover:scale-110">
    </div>

    <h3 class="mt-4 text-lg font-bold text-slate-700">
      ${item.category}
    </h3>
  </a>
`).join("");
  
  const products = [
      {
        id: "garlic-breadsticks",
        name: "Garlic Breadsticks",
        desc: "Baked to perfection. Your perfect pizza partner! Tastes best with dip.",
        price: 119,
        img: "https://images.dominos.co.in/nextgen-catalog/media/prod/Dominos/WebHomeProductV1/a718c4d8-de90-476b-b9fc-7e6b42fc6ffe_plain_GB_side.webp?ver=V0.0.1",
        bg: "linear-gradient(135deg,#3b3f4a,#d9902f)",
        bestseller: true,
      },
      {
        id: "veg-parcel",
        name: "Veg Parcel",
        desc: "Snacky bites! Pizza rolls with paneer & creamy harissa sauce.",
        price: 50,
        img: "https://images.dominos.co.in/nextgen-catalog/media/prod/Dominos/WebHomeProductV1/a1b4e8c0-3cb5-44f2-b6e3-68ad58ce6ff2_zingy_parcel_v_side.webp?ver=V0.0.1",
        bg: "linear-gradient(135deg,#1f3a5c,#e0a43a)",
        bestseller: true,
      },
      {
        id: "cheesy-dip",
        name: "Cheesy Dip",
        desc: "An all-time favorite with your Garlic Breadsticks & Stuffed Garlic Bread for a Cheesy indulgence.",
        price: 31,
        img: "https://images.dominos.co.in/nextgen-catalog/media/prod/Dominos/WebHomeProductV1/e0e283ef-ddee-4e35-9ba0-8e3bfd88d073_Cheesy_Dip.webp?ver=V0.0.1",
        bg: "linear-gradient(135deg,#e5e2de,#8a8178)",
        bestseller: true,
      },
      {
        id: "classic-stuffed-garlic-bread",
        name: "Classic Stuffed Garlic Bread",
        desc: "Freshly baked garlic bread with cheese, juicy corn & tangy jalapeno.",
        price: 159,
        img: "https://images.dominos.co.in/nextgen-catalog/media/prod/Dominos/WebHomeProductV1/8414923f-7e8e-4552-aec4-697d54b63042_Classic_GB_side.webp?ver=V0.0.1",
        bg: "linear-gradient(135deg,#27507a,#e3a93e)",
        bestseller: true,
      },
      {
        id: "stuffed-garlic-bread",
        name: "Toco Maxicana Veg",
        desc: "Soft garlic bread stuffed with creamy cheese and herbs.",
        price: 149,
        img: "https://images.dominos.co.in/nextgen-catalog/media/prod/Dominos/WebHomeProductV1/936e255f-57b3-493b-b754-964045a6024a_veg_taco_side.webp?ver=V0.0.1",
        bg: "linear-gradient(135deg,#3b3f4a,#c98a2b)",
        bestseller: false,
      },
    ];

 
    const CART_KEY = "cart";

    function getCart() {
      try { return JSON.parse(localStorage.getItem(CART_KEY)) || []; }
      catch (e) { return []; }
    }

    function addToCart(product) {
      const cart = getCart();
      const existing = cart.find((item) => item.id === product.id);
      if (existing) {
        existing.quantity += 1;
      } else {
        cart.push({ id: product.id, name: product.name, price: product.price, quantity: 1 });
      }
      try { localStorage.setItem(CART_KEY, JSON.stringify(cart)); } catch (e) { }
    }

    const row = document.getElementById("cardRow");

    function cardHTML(p) {
      return `
        <article class="snap-start shrink-0 w-[300px] sm:w-[400px] h-[440px] rounded-xl overflow-hidden relative shadow-md text-white"
                 style="background-image:url('${p.img}'), ${p.bg}; background-size:cover; background-position:center;">

          ${p.bestseller ? `<span class="absolute top-4 right-4 bg-white text-slate-700 text-[11px] font-medium px-2 py-0.5 rounded shadow">BESTSELLER</span>` : ""}

          <div class="absolute inset-x-0 bottom-0 h-3/5 bg-gradient-to-t from-black/70 via-black/40 to-transparent"></div>

          <div class="absolute inset-x-0 bottom-0">
            <div class="px-4 pb-3">
              <h3 class="flex items-center gap-2 text-2xl font-bold">
                <span class="inline-flex w-5 h-5 shrink-0 items-center justify-center rounded-sm border-2 border-green-500 bg-white" aria-label="Vegetarian">
                  <span class="w-2.5 h-2.5 rounded-full bg-green-600"></span>
                </span>
                ${p.name}
              </h3>
              <p class="mt-1 text-sm text-slate-100 leading-snug line-clamp-2">${p.desc}</p>
            </div>

            <div class="flex items-center justify-between px-4 py-4">
              <span class="text-2xl font-bold">&#8377;${p.price}</span>
              <button type="button" data-id="${p.id}"
                      class="add-btn bg-[#E31837] hover:bg-red-700 active:scale-95 transition text-white text-xl font-bold px-6 py-1.5 rounded-md focus:outline-none focus-visible:ring-2 focus-visible:ring-white"
                      aria-label="Add ${p.name} to cart">
                Add +
              </button>
            </div>
          </div>
        </article>`;
    }

    row.innerHTML = products.map(cardHTML).join("");

    const toast = document.getElementById("toast");
    let toastTimer;

    function showToast(message) {
      toast.textContent = message;
      toast.classList.remove("translate-y-20", "opacity-0");
      clearTimeout(toastTimer);
      toastTimer = setTimeout(() => toast.classList.add("translate-y-20", "opacity-0"), 1800);
    }

    row.addEventListener("click", (e) => {
      const btn = e.target.closest(".add-btn");
      if (!btn) return;

      const product = products.find((p) => p.id === btn.dataset.id);
      addToCart(product);
      showToast(product.name + " added to cart");

      btn.textContent = "Added \u2713";
      setTimeout(() => (btn.textContent = "Add +"), 1200);
    });
 

 const PIZZAS = [
      { id: "margherita",     name: "Margherita",      price: 109, image: "images/Margherita.avif",
        desc: "Classic delight with 100% real mozzarella cheese." },
      { id: "farmhouse",      name: "Farmhouse",       price: 259, image: "images/Farmhouse.webp",
        desc: "Delightful combination of onion, capsicum, tomato & grilled mushroom." },
      { id: "peppy-paneer",   name: "Peppy Paneer",    price: 269, image: "images/paneer.avif",
        desc: "Flavorful trio of juicy paneer, crisp capsicum with spicy red paprika." },
      { id: "veggie-paradise",name: "Veggie Paradise", price: 269, image: "images/Veggie.jpg",
        desc: "The awesome foursome! Golden corn, black olives, capsicum, red paprika." },

      { id: "cheese-n-corn",  name: "Cheese n Corn",   price: 189, image: "images/CheeseCorn.webp",
        desc: "A delectable combination of sweet & juicy golden corn with extra cheese." },
      { id: "veg-extravaganza", name: "Veg Extravaganza", price: 329, image: "images/Extravaganza.webp",
        desc: "Black olives, capsicum, onion, grilled mushroom, corn, tomato & jalapeno." },
      { id: "mexican-green-wave", name: "Mexican Green Wave", price: 279, image: "images/GreenWave.webp",
        desc: "Mexican herbs sprinkled on onion, capsicum, tomato & jalapeno." },
      { id: "paneer-makhani", name: "Paneer Makhani",  price: 299, image: "images/PaneerMakhani.webp",
        desc: "Paneer and capsicum on rich makhani sauce." },
    ];

    const CART = "cart"; 

    const getCart = () => {
      try { return JSON.parse(localStorage.getItem(CART)) || []; }
      catch { return []; }
    };
    const saveCart = (cart) => localStorage.setItem(CART, JSON.stringify(cart));
    const getQty = (id) => (getCart().find((p) => p.id === id) || {}).qty || 0;

    function setQty(id, qty) {
      let cart = getCart();
      const pizza = PIZZAS.find((p) => p.id === id);
      const item = cart.find((p) => p.id === id);

      if (qty <= 0) {
        cart = cart.filter((p) => p.id !== id);
      } else if (item) {
        item.qty = qty;
      } else {
        cart.push({ id, name: pizza.name, price: pizza.price, image: pizza.image, qty });
      }
      saveCart(cart);
    }

    function actionHTML(id) {
      const qty = getQty(id);
      if (qty === 0) {
        return `<button data-action="add" data-id="${id}"
                  class="rounded-md bg-red-600 px-9 py-2 text-xl font-semibold text-white transition hover:bg-red-700 active:scale-95">
                  Add +
                </button>`;
      }
      return `<div class="flex h-[50px] w-[120px] items-center justify-between rounded-md border border-white/90 px-2 text-white">
                <button data-action="dec" data-id="${id}" aria-label="Decrease quantity"
                  class="grid h-8 w-8 place-items-center text-2xl leading-none transition active:scale-90">&minus;</button>
                <span class="text-xl font-semibold">${qty}</span>
                <button data-action="inc" data-id="${id}" aria-label="Increase quantity"
                  class="grid h-8 w-8 place-items-center text-2xl leading-none transition active:scale-90">+</button>
              </div>`;
    }

    function cardHTML(p) {
      return `
      <article class="relative h-[437px] w-[422px] shrink-0 overflow-hidden rounded-lg bg-gray-200 shadow">
        <img src="${p.image}" alt="${p.name} pizza" class="absolute inset-0 h-full w-full object-cover"
             onerror="this.style.display='none'" />

        <div class="blur-fade pointer-events-none absolute inset-x-0 bottom-0 h-64 bg-gradient-to-t from-black/60 to-transparent backdrop-blur-md"></div>

        <div class="absolute inset-x-0 bottom-0 z-10 text-white">

          <div class="flex justify-end">
            <button class="flex items-center gap-2 rounded-l-md bg-neutral-700/70 px-3 py-1 text-sm font-semibold">
              Customise <span>&rsaquo;</span>
            </button>
          </div>

          <div class="mt-2 px-4">
            <h3 class="flex items-center gap-2 text-2xl font-semibold">
              <span class="grid h-5 w-5 place-items-center rounded-sm border-2 border-green-500 bg-white">
                <span class="h-2.5 w-2.5 rounded-full bg-green-600"></span>
              </span>
              ${p.name}
            </h3>
            <p class="mt-1 text-sm leading-snug text-gray-100">${p.desc}</p>
          </div>

          <div class="mt-3 flex items-center justify-between px-4 pb-4">
            <div>
              <p class="text-2xl font-semibold">₹${p.price}</p>
              <p class="mt-1 border-b border-dashed border-gray-200 pb-0.5 text-sm font-semibold">
                Regular | New Hand Tossed &rsaquo;
              </p>
            </div>
            <div data-slot="${p.id}">${actionHTML(p.id)}</div>
          </div>
        </div>
      </article>`;
    }

    const row = document.getElementById("cardRow");
    row.innerHTML = PIZZAS.map(cardHTML).join("");

    row.addEventListener("click", (e) => {
      const btn = e.target.closest("button[data-action]");
      if (!btn) return;

      const { action, id } = btn.dataset;
      const qty = getQty(id);

      if (action === "add") setQty(id, 1);
      if (action === "inc") setQty(id, qty + 1);
      if (action === "dec") setQty(id, qty - 1); 

      row.querySelector(`[data-slot="${id}"]`).innerHTML = actionHTML(id);
    });

    function readStorage(key, fallback) {
      try {
        const value = JSON.parse(localStorage.getItem(key));
        return value ?? fallback;
      } catch {
        return fallback;
      }
    }

    function money(amount) {
      return "₹" + (Number(amount) || 0).toFixed(2);
    }

    function escapeHTML(value) {
      return String(value ?? "").replace(/[&<>"']/g, char => ({
        "&": "&amp;",
        "<": "&lt;",
        ">": "&gt;",
        '"': "&quot;",
        "'": "&#39;"
      })[char]);
    }

    function goBack() {
      if (history.length > 1) {
        history.back();
      } else {
        window.location.href = "index.html";
      }
    }

    function renderOrders() {
      const container = document.getElementById("ordersContainer");

      const orders = readStorage("orders", []);
      const orderItems = readStorage("order_items", []);

      if (!Array.isArray(orders) || orders.length === 0) {
        container.innerHTML = `
          <div class="bg-white rounded-2xl shadow-sm p-8 text-center">
            <div class="text-6xl mb-4">🍕</div>

            <h2 class="text-xl font-bold">
              No orders yet
            </h2>

            <p class="text-gray-500 mt-2">
              Once you confirm an order, it will appear here.
            </p>

            <a href="menu.html"
              class="inline-block mt-5 bg-dom text-white rounded-lg px-6 py-3 font-semibold">
              Explore Menu
            </a>
          </div>
        `;
        return;
      }

      const sortedOrders = [...orders].sort((a, b) => {
        const dateA = new Date(a.order_date || 0).getTime();
        const dateB = new Date(b.order_date || 0).getTime();

        return dateB - dateA;
      });

      container.innerHTML = sortedOrders.map(order => {
        const items = Array.isArray(orderItems)
          ? orderItems.filter(item =>
              String(item.order_id) === String(order.order_id)
            )
          : [];

        const parsedDate = new Date(order.order_date);

        const formattedDate =
          order.order_date && !Number.isNaN(parsedDate.getTime())
            ? parsedDate.toLocaleString("en-IN", {
                day: "2-digit",
                month: "short",
                year: "numeric",
                hour: "2-digit",
                minute: "2-digit"
              })
            : "Date unavailable";

        return `
          <article class="bg-white rounded-2xl shadow-sm p-5 mb-5">

            <div class="flex flex-col sm:flex-row
                        sm:justify-between gap-3 border-b pb-4">

              <div>
                <p class="text-sm text-gray-500">Order ID</p>

                <h3 class="font-bold text-lg break-all">
                  ${escapeHTML(order.order_id || "Unavailable")}
                </h3>

                <p class="text-sm text-gray-500 mt-2">
                  ${escapeHTML(formattedDate)}
                </p>
              </div>

              <div class="sm:text-right">
                <span class="inline-block bg-green-100 text-green-700
                             rounded-full px-3 py-1 text-sm font-semibold">
                  ${escapeHTML(order.status || "Confirmed")}
                </span>

                <p class="text-xl font-bold mt-2">
                  ${money(order.total_amount)}
                </p>
              </div>
            </div>

            <div class="py-4">
              <h4 class="font-bold mb-3">Ordered Items</h4>

              ${
                items.length > 0
                  ? items.map(item => `
                    <div class="flex justify-between items-start
                                gap-4 py-3 border-b border-dashed">

                      <div class="min-w-0">
                        <p class="font-semibold break-words">
                          🍕 ${escapeHTML(item.product_name || "Pizza")}
                        </p>

                        <p class="text-sm text-gray-500 mt-1">
                          Quantity: ${Number(item.quantity) || 0}
                          × ${money(item.unit_price)}
                        </p>
                      </div>

                      <p class="font-semibold whitespace-nowrap">
                        ${money(item.subtotal)}
                      </p>
                    </div>
                  `).join("")
                  : `
                    <p class="text-gray-500 text-sm">
                      Product details are unavailable for this order.
                    </p>
                  `
              }
            </div>

            <div class="flex justify-between items-center pt-2">
              <span class="text-gray-500">
                ${items.length} product record(s)
              </span>

              <div class="text-right">
                <p class="text-sm text-gray-500">Order Total</p>
                <p class="text-lg font-bold">
                  ${money(order.total_amount)}
                </p>
              </div>
            </div>

          </article>
        `;
      }).join("");
    }

    renderOrders();

    window.addEventListener("storage", event => {
      if (event.key === "orders" || event.key === "order_items") {
        renderOrders();
      }
    });


 