(() => {
  const KEYS = {
    cart: "dominos_cart",
    orders: "dominos_orders",
    theme: "dominos_theme",
    location: "dominos_location",
    orderType: "dominos_order_type",
    tab: "dominos_active_tab",
  };

  const load = (key, fallback) => {
    try {
      const raw = localStorage.getItem(key);
      return raw === null ? fallback : JSON.parse(raw);
    } catch {
      return fallback;
    }
  };
  const save = (key, value) => {
    try {
      localStorage.setItem(key, JSON.stringify(value));
    } catch (e) {
      console.warn("localStorage unavailable:", e);
    }
  };

  const escapeHtml = (s) =>
    String(s).replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
  const money = (n) => "₹" + n.toLocaleString("en-IN");
  const buttonByText = (text, root = document) =>
    [...root.querySelectorAll("button")].find((b) => b.textContent.includes(text));

  let cart = load(KEYS.cart, []); 
  const cartCount = () => cart.reduce((n, i) => n + i.qty, 0);
  const cartTotal = () => cart.reduce((s, i) => s + i.price * i.qty, 0);

  let badge, cartNavBtn, modal, moonBtn, locBox;

  function persistCart() {
    save(KEYS.cart, cart);
    if (badge) badge.textContent = cartCount();
    if (cartNavBtn) cartNavBtn.textContent = cartCount() ? `Cart 🛒 (${cartCount()})` : "Cart 🛒";
    renderModal();
  }

  function addToCart(name, price) {
    const item = cart.find((i) => i.name === name);
    if (item) item.qty += 1;
    else cart.push({ name, price, qty: 1 });
    persistCart();
  }

  function changeQty(index, delta) {
    const item = cart[index];
    if (!item) return;
    item.qty += delta;
    if (item.qty <= 0) cart.splice(index, 1);
    persistCart();
  }

  function clearCart() {
    cart = [];
    persistCart();
  }

  function checkout() {
    if (!cart.length) return;
    const orders = load(KEYS.orders, []);
    orders.push({
      id: Date.now(),
      date: new Date().toISOString(),
      type: load(KEYS.orderType, "delivery"),
      location: load(KEYS.location, ""),
      items: cart,
      total: cartTotal(),
    });
    save(KEYS.orders, orders);
    const total = cartTotal();
    clearCart();
    closeModal();
    alert(`Order placed! Total: ${money(total)}`);
  }

  function bindAddButtons() {
    document.querySelectorAll("article").forEach((card) => {
      const btn = [...card.querySelectorAll("button")].find((b) => b.textContent.trim().startsWith("Add"));
      const name = card.querySelector("h3")?.textContent.trim();
      const priceText = [...card.querySelectorAll("p")].map((p) => p.textContent).find((t) => t.includes("₹")) || "";
      const price = Number(priceText.replace(/[^\d.]/g, "")) || 0;
      if (!btn || !name) return;

      btn.addEventListener("click", () => {
        addToCart(name, price);
        const original = btn.textContent;
        btn.textContent = "Added ✓";
        setTimeout(() => (btn.textContent = original), 800);
      });
    });
  }

  function buildModal() {
    modal = document.createElement("div");
    modal.className = "fixed inset-0 z-50 hidden items-center justify-center bg-black/60 p-4";
    modal.innerHTML = `
      <div class="cart-panel w-full max-w-md rounded-2xl bg-white p-6 text-gray-900 shadow-xl">
        <div class="flex items-center justify-between">
          <h2 class="text-2xl font-bold">Your cart</h2>
          <button data-close class="text-2xl" aria-label="Close cart">✕</button>
        </div>
        <div data-items class="mt-4 max-h-80 space-y-3 overflow-y-auto"></div>
        <div class="mt-4 flex justify-between text-lg font-bold"><span>Total</span><span data-total></span></div>
        <div class="mt-4 flex gap-3">
          <button data-clear class="flex-1 rounded-full border py-2 font-semibold">Clear cart</button>
          <button data-checkout class="flex-1 rounded-full bg-red-600 py-2 font-semibold text-white">Place order</button>
        </div>
      </div>`;
    document.body.appendChild(modal);

    modal.addEventListener("click", (e) => {
      if (e.target === modal || e.target.closest("[data-close]")) return closeModal();
      if (e.target.closest("[data-clear]")) return clearCart();
      if (e.target.closest("[data-checkout]")) return checkout();
      const qtyBtn = e.target.closest("[data-qty]");
      if (qtyBtn) changeQty(Number(qtyBtn.dataset.i), Number(qtyBtn.dataset.qty));
    });
    document.addEventListener("keydown", (e) => e.key === "Escape" && closeModal());
  }

  function renderModal() {
    if (!modal) return;
    const list = modal.querySelector("[data-items]");
    list.innerHTML = cart.length
      ? cart
          .map(
            (item, i) => `
        <div class="flex items-center justify-between gap-3">
          <div>
            <p class="font-semibold">${escapeHtml(item.name)}</p>
            <p class="text-sm text-gray-500">${money(item.price)} × ${item.qty} = ${money(item.price * item.qty)}</p>
          </div>
          <div class="flex items-center gap-2">
            <button data-qty="-1" data-i="${i}" class="h-8 w-8 rounded-full border font-bold">−</button>
            <span class="w-5 text-center">${item.qty}</span>
            <button data-qty="1" data-i="${i}" class="h-8 w-8 rounded-full border font-bold">+</button>
          </div>
        </div>`
          )
          .join("")
      : `<p class="py-6 text-center text-gray-500">Your cart is empty.</p>`;
    modal.querySelector("[data-total]").textContent = money(cartTotal());
  }

  function openModal() {
    renderModal();
    modal.classList.remove("hidden");
    modal.classList.add("flex");
  }
  function closeModal() {
    modal.classList.add("hidden");
    modal.classList.remove("flex");
  }

  function applyTheme(theme) {
    document.documentElement.classList.toggle("dark", theme === "dark");
    if (moonBtn) moonBtn.textContent = theme === "dark" ? "☀️" : "🌙";
  }

  function initTheme() {
    const style = document.createElement("style");
    style.textContent = `
      html.dark body { background:#0f172a; color:#f1f5f9; }
      html.dark nav, html.dark .bg-white:not(span) { background-color:#1e293b; }
      html.dark .bg-gray-100 { background-color:#334155; }
      html.dark .text-blue-900, html.dark .text-blue-950 { color:#93c5fd; }
      html.dark .text-gray-500 { color:#94a3b8; }
      html.dark .border { border-color:#475569; }
      html.dark .cart-panel { color:#f1f5f9; }`;
    document.head.appendChild(style);

    let theme = load(KEYS.theme, null) ||
      (window.matchMedia?.("(prefers-color-scheme: dark)").matches ? "dark" : "light");
    applyTheme(theme);

    moonBtn?.addEventListener("click", () => {
      theme = document.documentElement.classList.contains("dark") ? "light" : "dark";
      applyTheme(theme);
      save(KEYS.theme, theme);
    });
  }

  const LOCATION_PLACEHOLDER = "📍 Set your delivery location";

  function renderLocation() {
    const saved = load(KEYS.location, "");
    locBox.textContent = saved ? `📍 ${saved}` : LOCATION_PLACEHOLDER;
  }

  function initLocation() {
    if (!locBox) return;
    locBox.classList.add("cursor-pointer");
    renderLocation();
    locBox.addEventListener("click", () => {
      const answer = prompt("Enter your delivery location", load(KEYS.location, ""));
      if (answer === null) return; // cancelled
      save(KEYS.location, answer.trim());
      renderLocation();
    });
  }

  const TYPES = { delivery: "Delivery", takeaway: "Takeaway", "dine-in": "Dine-in" };

  function renderOrderType(type) {
    Object.entries(TYPES).forEach(([key, label]) => {
      const btn = [...document.querySelectorAll("button")].find((b) => b.textContent.trim().endsWith(label));
      if (!btn) return;
      const on = key === type;
      btn.classList.toggle("bg-black", on);
      btn.classList.toggle("text-white", on);
      btn.classList.toggle("bg-white", !on);
      btn.classList.toggle("border", !on);
    });
  }

  function initOrderType() {
    renderOrderType(load(KEYS.orderType, "delivery"));
    Object.entries(TYPES).forEach(([key, label]) => {
      const btn = [...document.querySelectorAll("button")].find((b) => b.textContent.trim().endsWith(label));
      btn?.addEventListener("click", () => {
        save(KEYS.orderType, key);
        renderOrderType(key);
      });
    });
  }

  function initBottomNav() {
    const bar = document.querySelector("div.fixed.bottom-5");
    if (!bar) return;
    const buttons = [...bar.querySelectorAll("button")];
    cartNavBtn = buttons.find((b) => b.textContent.includes("Cart"));
    const ACTIVE = ["bg-red-600", "px-5", "py-2", "rounded-full"];

    const setActive = (label) =>
      buttons.forEach((b) => {
        const on = b.textContent.trim().startsWith(label);
        b.classList.toggle(ACTIVE[0], on);
        ACTIVE.slice(1).forEach((c) => b.classList.toggle(c, on));
      });

    setActive(load(KEYS.tab, "Home"));

    buttons.forEach((b) =>
      b.addEventListener("click", () => {
        const label = b.textContent.trim().split(" ")[0];
        if (label === "Cart") return openModal();
        save(KEYS.tab, label);
        setActive(label);
      })
    );
  }

  document.addEventListener("DOMContentLoaded", () => {
    const nav = document.querySelector("nav");
    moonBtn = nav && buttonByText("🌙", nav);
    const navCart = nav && buttonByText("🛒", nav);
    badge = navCart?.querySelector("span");
    locBox = nav && [...nav.querySelectorAll("div")].find((d) => d.textContent.includes("delivery location"));

    buildModal();
    navCart?.addEventListener("click", openModal);

    bindAddButtons();
    initTheme();
    initLocation();
    initOrderType();
    initBottomNav();
    persistCart(); 
  });

  window.addEventListener("storage", (e) => {
    if (e.key === KEYS.cart) {
      cart = load(KEYS.cart, []);
      persistCart();
    }
    if (e.key === KEYS.theme) applyTheme(load(KEYS.theme, "light"));
    if (e.key === KEYS.orderType) renderOrderType(load(KEYS.orderType, "delivery"));
    if (e.key === KEYS.location && locBox) renderLocation();
  });

  window.Cart = {
    items: () => cart.map((i) => ({ ...i })),
    selected: () => selectedItems().map((i) => ({ ...i })),
    count: cartCount,
    subtotal,
    discount,
    deliveryFee,
    total,
    add: addToCart,
    setQty: (name, qty) => {
      const i = cart.findIndex((x) => x.name === name);
      if (i >= 0) changeQty(i, qty - cart[i].qty);
    },
    remove: (name) => {
      const i = cart.findIndex((x) => x.name === name);
      if (i >= 0) removeItem(i);
    },
    select: (name, checked = true) => {
      const i = cart.findIndex((x) => x.name === name);
      if (i >= 0) toggleItem(i, checked);
    },
    applyCoupon,
    removeCoupon,
    clear: clearCart,
    checkout,
    orders: () => load(KEYS.orders, []),
  };

  const MOON = 'M21.752 15.002A9.718 9.718 0 0 1 18 15.75c-5.385 0-9.75-4.365-9.75-9.75 0-1.33.266-2.597.748-3.752A9.753 9.753 0 0 0 3 11.25C3 16.635 7.365 21 12.75 21a9.753 9.753 0 0 0 9.002-5.998Z';
const SUN  = 'M12 3v2.25m6.364.386-1.591 1.591M21 12h-2.25m-.386 6.364-1.591-1.591M12 18.75V21m-4.773-4.227-1.591 1.591M5.25 12H3m4.227-4.773L5.636 5.636M15.75 12a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0Z';

const root = document.documentElement;
const themeToggle = document.getElementById('themeToggle');
const themePath = document.getElementById('themePath');

function setTheme(isDark) {
  root.classList.toggle('dark', isDark);
  themePath.setAttribute('d', isDark ? SUN : MOON);   // sun in dark mode, moon in light mode
  localStorage.setItem('theme', isDark ? 'dark' : 'light');
}

// Set the correct icon on load
setTheme(root.classList.contains('dark'));

// Toggle on click
themeToggle.addEventListener('click', () => {
  setTheme(!root.classList.contains('dark'));
});

 
})();