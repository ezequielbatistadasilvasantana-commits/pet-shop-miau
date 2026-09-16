const clamp=(n,min=0,max=1)=>Math.min(max,Math.max(min,n));
const story=document.querySelector('.story');
const dog=document.querySelector('.dog');
const cat=document.querySelector('.cat');
const bark=document.querySelector('.bark');
const meow=document.querySelector('.meow');
const nameBuild=document.querySelector('.name-build');
const heroCopy=document.querySelector('.hero-copy');
const cue=document.querySelector('.scroll-cue');
const nameLetters=[...document.querySelectorAll('.name-letter')];
const nameMark=document.querySelector('.name-mark');
const nameTagline=document.querySelector('.name-tagline');
const brandCta=document.querySelector('.brand-cta');
const reduce=window.matchMedia('(prefers-reduced-motion: reduce)').matches;

function getStoryProgress(){
  const rect=story.getBoundingClientRect();
  const distance=Math.max(1,story.offsetHeight-window.innerHeight);
  return clamp(-rect.top/distance);
}

function renderStory(p){
  document.documentElement.style.setProperty('--story-progress',p);
  if(reduce){dog.style.opacity='1';cat.style.opacity='0';return}
  const phase1=clamp(p/0.34);
  const phase2=clamp((p-0.3)/0.32);
  const phase3=clamp((p-0.58)/0.32);
  const brandFocus=clamp((p-.64)/.2);
  bark.style.opacity=String(clamp(phase1*2)*(1-phase2));
  bark.style.transform=`translate3d(0,${-phase1*35}px,0) rotate(${-8+phase1*5}deg) scale(${.75+phase1*.25})`;
  dog.style.transform=`translate3d(${phase2*-78}vw,${phase2*-5}vh,0) rotate(${-phase2*13}deg) scale(${1-phase2*.24})`;
  dog.style.opacity=String(1-clamp((p-.48)/.14));
  heroCopy.style.opacity=String(1-clamp((p-.28)/.18));
  heroCopy.style.transform=innerWidth<=900?`translateY(${-phase2*30}px)`:`translateY(calc(-46% - ${phase2*30}px))`;
  cat.style.opacity=String(clamp((p-.48)/.16)*(1-clamp((p-.76)/.12)));
  cat.style.transform=`translate3d(${(1-phase3)*28+brandFocus*18}vw,${(1-phase3)*8+brandFocus*2}vh,0) rotate(${(1-phase3)*9-2+brandFocus*3}deg) scale(${.88+phase3*.12-brandFocus*.06})`;
  meow.style.opacity=String(clamp((p-.58)/.12)*(1-clamp((p-.75)/.1)));
  meow.style.transform=`translate3d(0,${(1-phase3)*30}px,0) rotate(${-8+phase3*5}deg) scale(${.75+phase3*.25})`;
  const final=clamp((p-.64)/.18);
  const pulseTime=clamp((p-.84)/.12);
  const pulse=Math.sin(pulseTime*Math.PI*2)*(1-pulseTime)*.022;
  const release=clamp((p-.965)/.035);
  nameBuild.style.opacity=String(final);
  nameBuild.style.transform=`translate(-50%,calc(-50% - ${release*10}px)) scale(${.76+final*.24+pulse})`;
  nameBuild.style.setProperty('--brand-glow',String(final*.9));
  nameBuild.style.setProperty('--brand-underline',String(clamp((p-.76)/.12)));
  nameBuild.classList.toggle('is-active',p>.86);
  nameLetters.forEach((letter,index)=>{
    const letterProgress=clamp((p-(.64+index*.009))/.11);
    const eased=1-Math.pow(1-letterProgress,3);
    const direction=index%2===0?1:-1;
    const y=(1-eased)*direction*46;
    const x=(1-eased)*(((index%3)-1)*17);
    const rotation=(1-eased)*direction*9;
    const scale=.68+eased*.32+Math.sin(eased*Math.PI)*.055;
    letter.style.opacity=String(letterProgress);
    letter.style.transform=`translate3d(${x}px,${y}px,0) rotate(${rotation}deg) scale(${scale})`;
  });
  const markProgress=clamp((p-.78)/.1);
  nameMark.style.opacity=String(markProgress);
  nameMark.style.transform=`translate3d(0,${(1-markProgress)*-32}px,0) rotate(${(1-markProgress)*14}deg) scale(${.55+markProgress*.45})`;
  const taglineProgress=clamp((p-.8)/.09);
  nameTagline.style.opacity=String(taglineProgress);
  nameTagline.style.transform=`translate3d(0,${(1-taglineProgress)*18}px,0)`;
  const ctaProgress=clamp((p-.86)/.07);
  brandCta.style.opacity=String(ctaProgress);
  brandCta.style.transform=`translate3d(0,${(1-ctaProgress)*16}px,0) scale(${.94+ctaProgress*.06})`;
  brandCta.tabIndex=p>.86?0:-1;
  cue.style.opacity=String(1-clamp(p/.12));
}

let storyTarget=getStoryProgress();
let storyCurrent=storyTarget;
let storyFrame=0;
let lastStoryTime=performance.now();
let pageTicking=false;

function animateStory(time){
  const elapsed=Math.min(64,time-lastStoryTime);
  const smoothing=1-Math.exp(-elapsed/280);
  lastStoryTime=time;
  storyCurrent+=(storyTarget-storyCurrent)*smoothing;
  if(Math.abs(storyTarget-storyCurrent)<.00015)storyCurrent=storyTarget;
  renderStory(storyCurrent);
  if(storyCurrent!==storyTarget){storyFrame=requestAnimationFrame(animateStory)}else{storyFrame=0}
}

function queueStory(){
  storyTarget=getStoryProgress();
  if(reduce){storyCurrent=storyTarget;renderStory(storyCurrent);return}
  if(!storyFrame){lastStoryTime=performance.now();storyFrame=requestAnimationFrame(animateStory)}
}

function updatePageChrome(){
  document.querySelector('.topbar').classList.toggle('scrolled',scrollY>30);
  const max=document.documentElement.scrollHeight-innerHeight;
  document.querySelector('.progress-line span').style.transform=`scaleX(${max?scrollY/max:0})`;
}

function onScroll(){
  queueStory();
  if(!pageTicking){pageTicking=true;requestAnimationFrame(()=>{updatePageChrome();pageTicking=false})}
}
addEventListener('scroll',onScroll,{passive:true});
addEventListener('resize',()=>{storyTarget=getStoryProgress();storyCurrent=storyTarget;renderStory(storyCurrent);updatePageChrome()});
renderStory(storyCurrent);
updatePageChrome();

const observer=new IntersectionObserver(entries=>entries.forEach(entry=>{if(entry.isIntersecting){entry.target.classList.add('visible');observer.unobserve(entry.target)}}),{threshold:.13});
document.querySelectorAll('.reveal').forEach(el=>observer.observe(el));

const menu=document.querySelector('.menu-toggle');
const topbar=document.querySelector('.topbar');
menu.addEventListener('click',()=>{const open=topbar.classList.toggle('menu-open');menu.setAttribute('aria-expanded',String(open));menu.setAttribute('aria-label',open?'Fechar menu':'Abrir menu')});
document.querySelectorAll('nav a').forEach(link=>link.addEventListener('click',()=>{topbar.classList.remove('menu-open');menu.setAttribute('aria-expanded','false')}));
document.getElementById('year').textContent=new Date().getFullYear();

if(!reduce&&matchMedia('(pointer:fine)').matches){
  document.querySelectorAll('.care-card').forEach(card=>{
    card.addEventListener('pointermove',event=>{const r=card.getBoundingClientRect();const x=(event.clientX-r.left)/r.width-.5;const y=(event.clientY-r.top)/r.height-.5;card.style.setProperty('--tilt-x',`${x*5}deg`);card.style.setProperty('--tilt-y',`${y*-5}deg`);card.classList.add('tilt-active')});
    card.addEventListener('pointerleave',()=>{card.classList.remove('tilt-active');card.style.removeProperty('--tilt-x');card.style.removeProperty('--tilt-y')});
  });
}
