const $ = (s, root=document) => root.querySelector(s);
const $$ = (s, root=document) => [...root.querySelectorAll(s)];
const toast = (message) => { const el=$("#toast"); el.textContent=message; el.classList.add("show"); clearTimeout(window.toastTimer); window.toastTimer=setTimeout(()=>el.classList.remove("show"),2600); };
let cart=[];
const money = n => "Rp " + Number(n).toLocaleString("id-ID");
function renderCart(){
  $("#cartCount").textContent=cart.reduce((sum,item)=>sum+item.qty,0);
  $("#cartTotal").textContent=money(cart.reduce((sum,item)=>sum+item.price*item.qty,0));
  const box=$("#cartItems");
  if(!cart.length){box.innerHTML='<div class="empty-cart">🛒<b>Keranjang masih kosong</b><small>Tambahkan produk yang kamu suka.</small></div>';return;}
  box.innerHTML=cart.map((item,i)=>`<div class="cart-row"><div class="cart-product-icon">✦</div><div class="cart-row-info"><b>${item.name}</b><small>${item.qty} × ${money(item.price)}</small></div><button class="remove-item" data-remove="${i}" aria-label="Hapus produk">×</button></div>`).join("");
  $$("[data-remove]",box).forEach(btn=>btn.addEventListener("click",()=>{cart.splice(Number(btn.dataset.remove),1);renderCart();}));
}
$$(".add-cart").forEach(btn=>btn.addEventListener("click",()=>{
  const name=btn.dataset.name,price=Number(btn.dataset.price);
  const existing=cart.find(i=>i.name===name);
  if(existing) existing.qty++; else cart.push({name,price,qty:1});
  renderCart();toast(name+" ditambahkan ke keranjang");
}));
$$(".filter").forEach(btn=>btn.addEventListener("click",()=>{
  $$(".filter").forEach(b=>b.classList.remove("active"));btn.classList.add("active");
  const f=btn.dataset.filter;
  $$(".product-card").forEach(card=>card.style.display=(f==="all"||card.dataset.category===f)?"":"none");
}));
$("#cartOpen").addEventListener("click",()=>$("#cartOverlay").classList.add("open"));
$("#cartClose").addEventListener("click",()=>$("#cartOverlay").classList.remove("open"));
$("#cartOverlay").addEventListener("click",e=>{if(e.target===$("#cartOverlay"))$("#cartOverlay").classList.remove("open")});
$("#checkoutBtn").addEventListener("click",()=>toast(cart.length?"Checkout belum aktif — hubungkan payment gateway untuk menerima pembayaran.":"Keranjang kamu masih kosong."));
$("#loginBtn").addEventListener("click",()=>$("#loginModal").classList.add("open"));
$("#loginClose").addEventListener("click",()=>$("#loginModal").classList.remove("open"));
$("#loginModal").addEventListener("click",e=>{if(e.target===$("#loginModal"))$("#loginModal").classList.remove("open")});
$("#loginForm").addEventListener("submit",e=>{e.preventDefault();$("#loginModal").classList.remove("open");toast("Login demo saja — backend autentikasi belum dihubungkan.");});
$("#newsletterForm").addEventListener("submit",e=>{e.preventDefault();toast("Terima kasih! Form newsletter demo berhasil dicoba.");e.target.reset();});
$("#mobileMenu").addEventListener("click",()=>$("#nav").classList.toggle("open"));
$$('#nav a').forEach(a=>a.addEventListener('click',()=>$("#nav").classList.remove("open")));
$("#searchToggle").addEventListener("click",()=>{const term=prompt("Cari produk ZayyStore:");if(!term)return;let found=0;$$(".product-card").forEach(card=>{const match=card.innerText.toLowerCase().includes(term.toLowerCase());card.style.display=match?"":"none";if(match)found++;});$$(".filter").forEach(b=>b.classList.remove("active"));$("#produk").scrollIntoView({behavior:"smooth"});toast(found?`Ditemukan ${found} produk.`:"Produk tidak ditemukan.");});
$$(".quick-view").forEach(btn=>btn.addEventListener("click",()=>{const card=btn.closest(".product-card");toast(card.querySelector("h3").textContent+" — "+card.querySelector(".product-bottom strong").textContent);}));
