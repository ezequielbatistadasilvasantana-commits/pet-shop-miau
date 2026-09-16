const products=[
  {id:'nexgard-spectra-2-3-5kg',name:'NexGard Spectra 2 a 3,5 kg',category:'saude',pet:'cao',image:'nexgard-spectra-2-a-3-5kg.webp',bg:'#eee9ff',price:'R$ 105,00',description:'Antipulgas, carrapatos e vermes em comprimido para cães de 2 a 3,5 kg. Use com orientação veterinária.'},
  {id:'nexgard-4-10kg',name:'NexGard 4,1 a 10 kg',category:'saude',pet:'cao',image:'nexgard-4-a-10kg.png',bg:'#e7f4ff',price:'R$ 119,00',description:'Antipulgas e carrapatos em tablete mastigável para cães de 4,1 a 10 kg. Consulte a equipe.'},
  {id:'simparic-5-10kg',name:'Simparic 5 a 10 kg',category:'saude',pet:'cao',image:'simparic-5-a-10kg.jpg',bg:'#fff0e9',oldPrice:'R$ 109,00',price:'R$ 85,00',badge:'Promoção',description:'Comprimido contra pulgas, carrapatos e sarnas para cães de 5 a 10 kg. Use com orientação veterinária.'},
  {id:'shampoo-pet-clean-700ml',name:'Shampoo Pet Clean 700 ml',category:'higiene',pet:'todos',image:'shampoo-pet-clean-700ml.png',bg:'#e7f8f2',price:'R$ 22,00',description:'Fórmula 5 em 1 com limpeza, condicionamento, hidratação, revitalização e nutrição.'},
  {id:'granulado-katbom-natural',name:'Granulado Sanitário Katbom Natural',category:'higiene',pet:'gato',image:'granulado-katbom-natural.webp',bg:'#f5eddf',price:'R$ 55,00',description:'Granulado natural para higiene dos gatos, com rápida absorção e formação de torrões.'},
  {id:'shampoo-pet-clean-filhote',name:'Shampoo Pet Clean Filhote',category:'higiene',pet:'todos',image:'shampoo-pet-clean-filhote.png',bg:'#fff4cf',price:'R$ 22,00',description:'Fórmula suave para filhotes de cães e gatos, com flor de laranjeira e óleo de buriti.'},
  {id:'doxitec-100mg',name:'Doxitec 100 mg',category:'saude',pet:'todos',image:'doxitec-100mg.jpg',bg:'#e9f1ff',price:'R$ 45,00',badge:'Consulte a equipe',description:'Medicamento veterinário para cães e gatos. Venda e uso somente conforme orientação veterinária.'},
  {id:'beneflora-vet',name:'Beneflora Vet',category:'saude',pet:'todos',image:'beneflora-vet.jpg',bg:'#edfae9',price:'R$ 77,50',description:'Suplemento com probióticos e prebióticos para auxiliar no equilíbrio da flora intestinal.'},
  {id:'golden-gatos-carne-10kg',name:'Golden Gatos Adultos Carne 10,1 kg',category:'alimentacao',pet:'gato',image:'golden-gatos-adulto-carne.jpg',bg:'#fff2dc',pricePrefix:'A partir de',price:'R$ 176,00',description:'Ração Premium Especial sabor carne para gatos adultos, em embalagem de 10,1 kg.'},
  {id:'golden-special-caes-15kg',name:'Golden Special Cães Adultos 15 kg',category:'alimentacao',pet:'cao',image:'golden-special-caes-adultos-15kg.jpg',bg:'#f2edff',pricePrefix:'A partir de',price:'R$ 190,00',description:'Ração Premium Especial carne e frango para cães adultos, em embalagem de 15 kg.'},
  {id:'friskies-mix-carnes-10kg',name:'Friskies Adultos Mix de Carnes 10,1 kg',category:'alimentacao',pet:'gato',image:'friskies-adulto-mix-carnes.webp',bg:'#e8f6ff',pricePrefix:'A partir de',price:'R$ 190,00',description:'Ração para gatos adultos sabor mix de carnes, em embalagem de 10,1 kg.'},
  {id:'gran-plus-gourmet-ovelha-10kg',name:'GranPlus Gourmet Ovelha e Arroz 10,1 kg',category:'alimentacao',pet:'cao',image:'gran-plus-gourmet-ovelha.webp',bg:'#ffefe9',pricePrefix:'A partir de',price:'R$ 155,00',description:'Ração Premium Especial sabor ovelha e arroz para cães adultos, em embalagem de 10,1 kg.'}
];

const labels={alimentacao:'Alimentação',higiene:'Higiene',saude:'Saúde'};
const petLabels={cao:'Para cães',gato:'Para gatos',todos:'Cães e gatos'};
const state={category:'todos',pet:'todos',search:'',selected:new Set()};
const grid=document.getElementById('product-grid');
const resultCount=document.getElementById('result-count');
const empty=document.getElementById('empty-catalog');
const cartCount=document.getElementById('cart-count');
const cartPanel=document.getElementById('cart-panel');
const cartBackdrop=document.getElementById('cart-backdrop');
const cartItems=document.getElementById('cart-items');
const cartEmpty=document.getElementById('cart-empty');
const sendList=document.getElementById('send-list');
const toast=document.getElementById('selection-toast');
let lastFocus=null;

function filteredProducts(){
  const term=state.search.normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLowerCase();
  return products.filter(product=>{
    const category=state.category==='todos'||product.category===state.category;
    const pet=state.pet==='todos'||product.pet==='todos'||product.pet===state.pet;
    const haystack=`${product.name} ${product.description} ${labels[product.category]}`.normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLowerCase();
    return category&&pet&&haystack.includes(term);
  });
}

function renderProducts(){
  const visible=filteredProducts();
  resultCount.textContent=`${visible.length} ${visible.length===1?'produto':'produtos'}`;
  empty.hidden=visible.length>0;
  grid.hidden=visible.length===0;
  grid.innerHTML=visible.map((product,index)=>`
    <article class="product-card" style="--delay:${Math.min(index,8)*45}ms">
      <div class="product-art" style="--product-bg:${product.bg}">
        <span class="product-pet">${petLabels[product.pet]}</span>
        ${product.badge?`<span class="product-badge">${product.badge}</span>`:''}
        <img class="product-photo" src="../assets/products/${product.image}" alt="Embalagem de ${product.name}" width="600" height="600" loading="lazy" decoding="async">
        <span class="product-photo-label">Foto real</span>
      </div>
      <div class="product-info">
        <span class="product-category">${labels[product.category]}</span>
        <h3>${product.name}</h3>
        <p>${product.description}</p>
        <div class="product-price">
          ${product.oldPrice?`<del>${product.oldPrice}</del>`:''}
          ${product.pricePrefix?`<small>${product.pricePrefix}</small>`:''}<strong>${product.price}</strong>
        </div>
        <button class="add-product ${state.selected.has(product.id)?'selected':''}" type="button" data-id="${product.id}">
          <span>${state.selected.has(product.id)?'Adicionado à lista':'Adicionar à lista'}</span><b aria-hidden="true">${state.selected.has(product.id)?'✓':'+'}</b>
        </button>
      </div>
    </article>`).join('');
}

function updateCart(){
  const selected=products.filter(product=>state.selected.has(product.id));
  cartCount.textContent=selected.length;
  cartEmpty.hidden=selected.length>0;
  cartItems.innerHTML=selected.map(product=>`<div class="cart-item"><span class="cart-item-icon"><img src="../assets/products/${product.image}" alt="" width="48" height="48"></span><span class="cart-item-copy"><strong>${product.name}</strong><small>${product.pricePrefix?`${product.pricePrefix} `:''}${product.price}</small></span><button class="remove-item" type="button" data-remove="${product.id}" aria-label="Remover ${product.name}">×</button></div>`).join('');
  sendList.classList.toggle('disabled',selected.length===0);
  sendList.setAttribute('aria-disabled',String(selected.length===0));
  const message=selected.length?`Olá, Pet Shop Miau! Gostaria de consultar a disponibilidade destes produtos:\n\n${selected.map((product,index)=>`${index+1}. ${product.name} — ${product.pricePrefix?`${product.pricePrefix} `:''}${product.price}`).join('\n')}\n\nMeu pet é:`:'Olá, Pet Shop Miau! Gostaria de informações sobre os produtos.';
  sendList.href=`https://wa.me/5583987464150?text=${encodeURIComponent(message)}`;
}

function showToast(text){
  toast.textContent=text;toast.classList.add('show');clearTimeout(showToast.timer);showToast.timer=setTimeout(()=>toast.classList.remove('show'),1800);
}

function toggleProduct(id){
  if(state.selected.has(id)){state.selected.delete(id);showToast('Removido da sua lista')}else{state.selected.add(id);showToast('Adicionado à sua lista')}
  renderProducts();updateCart();
}

function clearFilters(){
  state.category='todos';state.pet='todos';state.search='';document.getElementById('catalog-search').value='';
  document.querySelectorAll('.filter-chip').forEach(button=>button.classList.toggle('active',button.dataset.category==='todos'));
  document.querySelectorAll('.pet-filter').forEach(button=>button.classList.toggle('active',button.dataset.pet==='todos'));
  renderProducts();
}

function openCart(){lastFocus=document.activeElement;cartBackdrop.hidden=false;requestAnimationFrame(()=>cartPanel.classList.add('open'));cartPanel.setAttribute('aria-hidden','false');document.body.style.overflow='hidden';setTimeout(()=>document.querySelector('.cart-close').focus(),120)}
function closeCart(){cartPanel.classList.remove('open');cartPanel.setAttribute('aria-hidden','true');document.body.style.overflow='';setTimeout(()=>{cartBackdrop.hidden=true;if(lastFocus)lastFocus.focus()},420)}

grid.addEventListener('click',event=>{const button=event.target.closest('[data-id]');if(button)toggleProduct(button.dataset.id)});
cartItems.addEventListener('click',event=>{const button=event.target.closest('[data-remove]');if(button)toggleProduct(button.dataset.remove)});
document.querySelectorAll('.filter-chip').forEach(button=>button.addEventListener('click',()=>{state.category=button.dataset.category;document.querySelectorAll('.filter-chip').forEach(item=>item.classList.toggle('active',item===button));renderProducts()}));
document.querySelectorAll('.pet-filter').forEach(button=>button.addEventListener('click',()=>{state.pet=button.dataset.pet;document.querySelectorAll('.pet-filter').forEach(item=>item.classList.toggle('active',item===button));renderProducts()}));
document.getElementById('catalog-search').addEventListener('input',event=>{state.search=event.target.value;renderProducts()});
document.getElementById('clear-filters').addEventListener('click',clearFilters);
document.querySelector('.cart-trigger').addEventListener('click',openCart);
document.querySelector('.cart-close').addEventListener('click',closeCart);
cartBackdrop.addEventListener('click',closeCart);
addEventListener('keydown',event=>{if(event.key==='Escape'&&cartPanel.classList.contains('open'))closeCart()});

const filterPanel=document.querySelector('.filter-panel');
const mobileFilter=document.querySelector('.mobile-filter-button');
mobileFilter.addEventListener('click',()=>{const open=filterPanel.classList.toggle('mobile-open');mobileFilter.setAttribute('aria-expanded',String(open));mobileFilter.querySelector('span').textContent=open?'⌃':'⌄'});

const menu=document.querySelector('.menu-toggle');
const topbar=document.querySelector('.topbar');
menu.addEventListener('click',()=>{const open=topbar.classList.toggle('menu-open');menu.setAttribute('aria-expanded',String(open))});
document.querySelectorAll('nav a').forEach(link=>link.addEventListener('click',()=>{topbar.classList.remove('menu-open');menu.setAttribute('aria-expanded','false')}));

const revealObserver=new IntersectionObserver(entries=>entries.forEach(entry=>{if(entry.isIntersecting){entry.target.classList.add('visible');revealObserver.unobserve(entry.target)}}),{threshold:.12});
document.querySelectorAll('.reveal:not(.visible)').forEach(element=>revealObserver.observe(element));

let scrollTick=false;
function updateScroll(){
  if(scrollTick)return;scrollTick=true;requestAnimationFrame(()=>{const max=document.documentElement.scrollHeight-innerHeight;document.querySelector('.progress-line span').style.transform=`scaleX(${max?scrollY/max:0})`;topbar.classList.toggle('scrolled',scrollY>30);scrollTick=false})
}
addEventListener('scroll',updateScroll,{passive:true});

if(!matchMedia('(prefers-reduced-motion: reduce)').matches&&matchMedia('(pointer:fine)').matches){
  const pets=document.querySelector('.catalog-pets');
  pets.addEventListener('pointermove',event=>{const rect=pets.getBoundingClientRect();const x=(event.clientX-rect.left)/rect.width-.5;const y=(event.clientY-rect.top)/rect.height-.5;document.querySelector('.catalog-dog').style.transform=`translate(${x*12}px,${y*9}px) rotate(${2+x*2}deg)`;document.querySelector('.catalog-cat').style.transform=`translate(${x*-17}px,${y*-11}px) rotate(${-7+x*3}deg)`});
  pets.addEventListener('pointerleave',()=>{document.querySelector('.catalog-dog').style.transform='rotate(2deg)';document.querySelector('.catalog-cat').style.transform='rotate(-7deg)'})
}

document.getElementById('year').textContent=new Date().getFullYear();
renderProducts();updateCart();updateScroll();
