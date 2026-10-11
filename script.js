 /* ---------- Data ---------- */
    const PIZZAS = [
      { id: "margherita",     name: "Margherita",      price: 109, image: "images/Margherita.avif",
        desc: "Classic delight with 100% real mozzarella cheese." },
      { id: "farmhouse",      name: "Farmhouse",       price: 259, image: "images/Farmhouse.webp",
        desc: "Delightful combination of onion, capsicum, tomato & grilled mushroom." },
      { id: "peppy-paneer",   name: "Peppy Paneer",    price: 269, image: "images/paneer.avif",
        desc: "Flavorful trio of juicy paneer, crisp capsicum with spicy red paprika." },
      { id: "veggie-paradise",name: "Veggie Paradise", price: 269, image: "images/Veggie.jpg",
        desc: "The awesome foursome! Golden corn, black olives, capsicum, red paprika." },

      /* Items 5-8: sample details, replace with your own */
      { id: "cheese-n-corn",  name: "Cheese n Corn",   price: 189, image: "images/CheeseCorn.webp",
        desc: "A delectable combination of sweet & juicy golden corn with extra cheese." },
      { id: "veg-extravaganza", name: "Veg Extravaganza", price: 329, image: "images/Extravaganza.webp",
        desc: "Black olives, capsicum, onion, grilled mushroom, corn, tomato & jalapeno." },
      { id: "mexican-green-wave", name: "Mexican Green Wave", price: 279, image: "images/GreenWave.webp",
        desc: "Mexican herbs sprinkled on onion, capsicum, tomato & jalapeno." },
      { id: "paneer-makhani", name: "Paneer Makhani",  price: 299, image: "images/PaneerMakhani.webp",
        desc: "Paneer and capsicum on rich makhani sauce." },
    ];

    /* ---------- Cart (localStorage) ---------- */
    const CART_KEY = "cart"; // change if your cart.html uses a different key

    const getCart = () => {
      try { return JSON.parse(localStorage.getItem(CART_KEY)) || []; }
      catch { return []; }
    };
    const saveCart = (cart) => localStorage.setItem(CART_KEY, JSON.stringify(cart));
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

    /* ---------- Rendering ---------- */
    // The button area switches between "Add +" and the − 1 + stepper
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

        <!-- Blur layer at the bottom -->
        <div class="blur-fade pointer-events-none absolute inset-x-0 bottom-0 h-64 bg-gradient-to-t from-black/60 to-transparent backdrop-blur-md"></div>

        <!-- Content -->
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

    /* ---------- Events ---------- */
    row.addEventListener("click", (e) => {
      const btn = e.target.closest("button[data-action]");
      if (!btn) return;

      const { action, id } = btn.dataset;
      const qty = getQty(id);

      if (action === "add") setQty(id, 1);
      if (action === "inc") setQty(id, qty + 1);
      if (action === "dec") setQty(id, qty - 1); // reaching 0 removes it and shows "Add +" again

      row.querySelector(`[data-slot="${id}"]`).innerHTML = actionHTML(id);
    });


    