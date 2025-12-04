document.addEventListener('DOMContentLoaded', () => {
  const yearElems = ['yearInicio','yearSobre','yearGaleria','yearRegistro','yearContacto'];
  yearElems.forEach(id => {
    const el = document.getElementById(id);
    if(el) el.textContent = new Date().getFullYear();
  });

  const themeToggle = document.getElementById('themeToggle');
  const currentTheme = localStorage.getItem('theme') || 'light';
  setTheme(currentTheme);
  if(themeToggle){
    themeToggle.addEventListener('click', () => {
      const t = document.documentElement.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
      setTheme(t);
      themeToggle.textContent = t === 'dark' ? 'Modo claro' : 'Modo oscuro';
    });
    themeToggle.textContent = document.documentElement.getAttribute('data-theme') === 'dark' ? 'Modo claro' : 'Modo oscuro';
  }
  function setTheme(t){
    if(t === 'dark') document.documentElement.setAttribute('data-theme','dark');
    else document.documentElement.removeAttribute('data-theme');
    localStorage.setItem('theme', t);
  }

  const productos = [
    {id:1, nombre:'Aretes Perla', precio:299.00, img:'img/arete1.jpg'},
    {id:2, nombre:'Aro Dorado', precio:349.00, img:'img/arete2.jpg'},
    {id:3, nombre:'Aretes Capullo', precio:259.00, img:'img/arete3.jpg'},
    {id:4, nombre:'Pendientes Gota', precio:379.00, img:'img/carrusel1.jpg'},
    {id:5, nombre:'Mini Flores', precio:199.00, img:'img/carrusel2.jpg'},
    {id:6, nombre:'Gota Esmeralda', precio:429.00, img:'img/carrusel3.jpg'},
  ];

  const productosGrid = document.getElementById('productosGrid');
  const cartBtn = document.getElementById('cartBtn');
  const cartModal = document.getElementById('cartModal');
  const closeCart = document.getElementById('closeCart');
  const cartItemsEl = document.getElementById('cartItems');
  const cartCountEl = document.getElementById('cartCount');
  const cartTotalEl = document.getElementById('cartTotal');
  const checkoutBtn = document.getElementById('checkoutBtn');

  if(productosGrid){
    productos.forEach(p => {
      const card = document.createElement('article');
      card.className = 'product-card';
      card.innerHTML = `
        <img src="${p.img}" alt="${p.nombre}">
        <div class="product-info">
          <h3>${p.nombre}</h3>
          <p class="price">$${p.precio.toFixed(2)}</p>
          <button class="btn add-to-cart" data-id="${p.id}">Añadir al carrito</button>
        </div>
      `;
      productosGrid.appendChild(card);
    });
  }

  let cart = JSON.parse(localStorage.getItem('cart') || '[]');
  function saveCart(){ localStorage.setItem('cart', JSON.stringify(cart)); }
  function updateCartUI(){
    cartCountEl.textContent = cart.reduce((s,i)=> s + i.qty, 0);
    cartItemsEl.innerHTML = '';
    let total = 0;
    cart.forEach(item => {
      total += item.precio * item.qty;
      const li = document.createElement('li');
      li.innerHTML = `<span>${item.nombre} x${item.qty}</span><strong>$${(item.precio*item.qty).toFixed(2)}</strong>
        <button class="btn small remove" data-id="${item.id}">Eliminar</button>`;
      cartItemsEl.appendChild(li);
    });
    cartTotalEl.textContent = total.toFixed(2);
  }
  updateCartUI();

  document.addEventListener('click', (e) => {
    if(e.target.matches('.add-to-cart')){
      const id = Number(e.target.dataset.id);
      const p = productos.find(x=>x.id===id);
      if(!p) return;
      const existing = cart.find(x=>x.id===id);
      if(existing) existing.qty += 1;
      else cart.push({...p, qty:1});
      saveCart();
      updateCartUI();
      alert(`${p.nombre} agregado al carrito.`);
    }
    if(e.target.matches('.remove')){
      const id = Number(e.target.dataset.id);
      cart = cart.filter(i=>i.id !== id);
      saveCart();
      updateCartUI();
    }
  });

  cartBtn?.addEventListener('click', ()=> {
    if(!cartModal) return;
    cartModal.setAttribute('aria-hidden','false');
  });
  closeCart?.addEventListener('click', ()=> {
    if(cartModal) cartModal.setAttribute('aria-hidden','true');
  });
  cartModal?.addEventListener('click', (ev) => {
    if(ev.target === cartModal) cartModal.setAttribute('aria-hidden','true');
  });

  checkoutBtn?.addEventListener('click', ()=> {
    if(cart.length === 0){ alert('Tu carrito está vacío.'); return; }
    alert('Gracias por tu simulación de compra.');
    cart = [];
    saveCart();
    updateCartUI();
    cartModal.setAttribute('aria-hidden','true');
  });

  const slidesContainer = document.querySelector('.slides');
  const slides = slidesContainer ? Array.from(slidesContainer.children) : [];
  let idx = 0;
  function showSlide(i){
    if(!slidesContainer) return;
    idx = (i + slides.length) % slides.length;
    slidesContainer.style.transform = `translateX(-${idx * 100}%)`;
  }
  document.getElementById('nextBtn')?.addEventListener('click', ()=> showSlide(idx+1));
  document.getElementById('prevBtn')?.addEventListener('click', ()=> showSlide(idx-1));
  setInterval(()=> showSlide(idx+1), 6000);

  const thumbs = document.querySelectorAll('.thumb');
  const modal = document.getElementById('modal');
  const modalImg = document.getElementById('modalImg');
  const modalCaption = document.getElementById('modalCaption');
  const closeModal = document.getElementById('closeModal');

  thumbs.forEach(t => t.addEventListener('click', () => {
    if(!modal) return;
    modal.setAttribute('aria-hidden','false');
    modalImg.src = t.src;
    modalImg.alt = t.alt;
    modalCaption.textContent = t.alt || '';
  }));
  closeModal?.addEventListener('click', ()=> { if(modal) modal.setAttribute('aria-hidden','true'); });
  modal?.addEventListener('click', (e) => { if(e.target === modal) modal.setAttribute('aria-hidden','true'); });

  const regForm = document.getElementById('regForm');
  const entriesList = document.getElementById('entries');
  if(regForm){
    regForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const name = regForm.name.value.trim();
      const email = regForm.email.value.trim();
      const phone = regForm.phone.value.trim();
      if(name.length < 3){ alert('El nombre debe tener al menos 3 caracteres.'); return; }
      if(!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)){ alert('Introduce un correo válido.'); return; }
      if(phone && !/^[0-9]{7,15}$/.test(phone)){ alert('Teléfono: solo dígitos (7-15).'); return; }
      const li = document.createElement('li');
      li.textContent = `${name} — ${email} ${phone ? '— ' + phone : ''}`;
      entriesList.prepend(li);
      regForm.reset();
      alert('Gracias por suscribirte.');
    });
  }
});