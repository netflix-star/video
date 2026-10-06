import * as THREE from 'three';
import { mergeGeometries } from '../node_modules/three/examples/jsm/utils/BufferGeometryUtils.js';

// Every pose is a pure function of time: browser playback and exported frames agree.
const W=1920,H=1080, PI=Math.PI, TAU=PI*2;
const C={dark:'#161912',cream:'#f4f1e7',lime:'#d5ff5f',wine:'#421b32',pink:'#e4bfd1'};
const stage=document.querySelector('#stage'),front=document.querySelector('#front'),back=document.querySelector('#back');
const ctx=document.querySelector('#design').getContext('2d');
const renderer=new THREE.WebGLRenderer({canvas:document.querySelector('#three'),antialias:true,alpha:true,preserveDrawingBuffer:true});
renderer.setSize(1280,720,false);renderer.setPixelRatio(1);renderer.setClearColor(0,0);renderer.outputColorSpace=THREE.SRGBColorSpace;
renderer.toneMapping=THREE.ACESFilmicToneMapping;renderer.toneMappingExposure=1.05;
const scene=new THREE.Scene();
const camera=new THREE.PerspectiveCamera(35,W/H,.1,100);camera.position.set(0,3,12);camera.lookAt(0,0,0);
scene.add(new THREE.HemisphereLight(0xffffff,0x49412d,1.8));
const key=new THREE.DirectionalLight(0xffe9ce,3.2);key.position.set(-4,7,6);scene.add(key);
const rim=new THREE.DirectionalLight(0xf3ffd4,2.1);rim.position.set(4,2,-4);scene.add(rim);
const fill=new THREE.DirectionalLight(0xffffff,1.2);fill.position.set(5,1,7);scene.add(fill);
let seed=527;const rand=()=>{seed=(seed*1664525+1013904223)>>>0;return seed/4294967296};
const mat=(color,roughness=.5,metalness=0)=>new THREE.MeshStandardMaterial({color,roughness,metalness});
const sesame=mat('#f8ddb0',.85), cheese=mat('#ffc532',.43), green=mat('#3d8c25',.58),tomato=mat('#e9321a',.35),onion=mat('#eacddd',.6);
function mesh(geo,material,parent,x=0,y=0,z=0){let m=new THREE.Mesh(geo,material);m.position.set(x,y,z);parent.add(m);return m}
function sphere(parent,material,x,y,z,sx,sy,sz){const m=mesh(new THREE.SphereGeometry(1,sx>.4?40:12,sx>.4?24:8),material,parent,x,y,z);m.scale.set(sx,sy,sz);return m}
function texBun(){let cv=document.createElement('canvas');cv.width=cv.height=512;let c=cv.getContext('2d');let g=c.createRadialGradient(250,250,20,250,250,350);g.addColorStop(0,'#df9a43');g.addColorStop(.7,'#bb6525');g.addColorStop(1,'#eeb56a');c.fillStyle=g;c.fillRect(0,0,512,512);for(let i=0;i<18000;i++){c.fillStyle=rand()>.5?'rgba(86,33,4,.065)':'rgba(255,232,168,.08)';c.beginPath();c.arc(rand()*512,rand()*512,rand()*2+.4,0,TAU);c.fill()}let t=new THREE.CanvasTexture(cv);t.colorSpace=THREE.SRGBColorSpace;return t}
const bunmat=new THREE.MeshStandardMaterial({map:texBun(),roughness:.58,color:'#ffc47a'});
function wavyDisc(radius,y,material,parent,phase=0){
const positions=[],uv=[],indices=[],rings=12,segments=96;
for(let r=0;r<=rings;r++)for(let j=0;j<=segments;j++){
 const q=r/rings,a=j/segments*TAU;const rr=radius*q*(1+.04*Math.sin(a*13+phase)+.035*Math.sin(a*7));
 positions.push(Math.cos(a)*rr,.06*q*q*Math.sin(a*13+phase)+.055*q*Math.sin(a*6+q*7+phase),Math.sin(a)*rr);uv.push(j/segments,q);
}
for(let r=0;r<rings;r++)for(let j=0;j<segments;j++){const a=r*(segments+1)+j,b=a+segments+1;indices.push(a,b,a+1,b,b+1,a+1)}
const geo=new THREE.BufferGeometry();geo.setAttribute('position',new THREE.Float32BufferAttribute(positions,3));geo.setAttribute('uv',new THREE.Float32BufferAttribute(uv,2));geo.setIndex(indices);geo.computeVertexNormals();
const mm=material.clone();mm.side=THREE.DoubleSide;return mesh(geo,mm,parent,0,y,0);
}
const burger=new THREE.Group();scene.add(burger);const layers=[];
function layer(y){const g=new THREE.Group();g.position.y=y;g.userData.base=y;burger.add(g);layers.push(g);return g}
let b=layer(-.82);sphere(b,bunmat,0,0,0,1.3,.24,1.24);
b=layer(-.57);for(let k=0;k<3;k++)wavyDisc(1.35,-.015+k*.045,green,b,k*1.5);
b=layer(-.32);const pattyGeo=new THREE.SphereGeometry(1,88,36);const pp=pattyGeo.attributes.position;for(let i=0;i<pp.count;i++){const f=1+(rand()-.5)*.045;pp.setXYZ(i,pp.getX(i)*f,pp.getY(i)*f,pp.getZ(i)*f)}pattyGeo.computeVertexNormals();let patty=mesh(pattyGeo,mat('#51301d',.88),b);patty.scale.set(1.25,.22,1.18);
for(let k=0;k<160;k++){let a=rand()*TAU;let m=sphere(b,mat(k%2?'#75452b':'#342519',.85),Math.cos(a)*1.2,(rand()-.5)*.26,Math.sin(a)*1.14,.035+rand()*.028,.023,.025)}
b=layer(-.08);let cg=new THREE.PlaneGeometry(2.34,2.34,16,16);cg.rotateX(-PI/2);let cp=cg.attributes.position;for(let i=0;i<cp.count;i++){let x=cp.getX(i),z=cp.getZ(i);cp.setY(i,-.2*Math.pow(Math.max(Math.abs(x),Math.abs(z))/1.17,7)+.025*Math.sin(x*4+z*3))}cg.computeVertexNormals();const cm=cheese.clone();cm.side=THREE.DoubleSide;let cs=mesh(cg,cm,b);cs.rotation.y=.4;
b=layer(.1);for(let k=0;k<3;k++){let a=k*TAU/3;let tx=Math.cos(a)*.46,tz=Math.sin(a)*.46;mesh(new THREE.CylinderGeometry(.66,.67,.11,48),tomato,b,tx,0,tz);mesh(new THREE.CylinderGeometry(.57,.57,.115,48),mat('#f04825',.36),b,tx,.007,tz);for(let j=0;j<5;j++){let a2=j*TAU/5;sphere(b,mat('#f0ad54',.48),tx+Math.cos(a2)*.3,.07,tz+Math.sin(a2)*.3,.045,.012,.018)}}
b=layer(.3);for(let k=0;k<4;k++){let ring=mesh(new THREE.TorusGeometry(.43+k*.045,.045,10,50),onion,b,(k%2-.5)*.65,0,(k>1?.2:-.3));ring.rotation.x=PI/2;ring.rotation.y=k*.06}
b=layer(.45);for(let k=0;k<2;k++)wavyDisc(1.27,k*.035,green,b,2+k);
b=layer(.56);const topGeo=new THREE.SphereGeometry(1,80,42,0,TAU,0,PI/2);let top=mesh(topGeo,bunmat,b);top.scale.set(1.29,.66,1.23);mesh(new THREE.CylinderGeometry(1.29,1.29,.065,80),bunmat,b,0,.005,0);
for(let i=0;i<135;i++){let theta=rand()*TAU,r=Math.sqrt(rand())*.96;let x=Math.cos(theta)*r,z=Math.sin(theta)*r;let y=Math.sqrt(1-r*r)*.66+.024;let s=sphere(b,sesame,x*1.29,y,z*1.23,.017,.013,.051);s.rotation.y=rand()*TAU;s.rotation.x=z*.6;s.rotation.z=-x*.6}

// Additional sculptural food models for the editorial three-up sequence.
const pizza=new THREE.Group();scene.add(pizza);
mesh(new THREE.CylinderGeometry(1.35,1.33,.16,80),bunmat,pizza);
let crust=mesh(new THREE.TorusGeometry(1.2,.17,18,90),bunmat,pizza,0,.06,0);crust.rotation.x=PI/2;
mesh(new THREE.CylinderGeometry(1.17,1.17,.06,80),tomato,pizza,0,.11,0);mesh(new THREE.CylinderGeometry(1.1,1.1,.045,80),mat('#f4c971',.55),pizza,0,.15,0);
for(let i=0;i<14;i++){let a=i*2.4,r=.95*Math.sqrt((i+.5)/14);let x=Math.cos(a)*r,z=Math.sin(a)*r;mesh(new THREE.CylinderGeometry(.19,.19,.027,30),mat('#bb3d22',.5),pizza,x,.19,z);for(let j=0;j<4;j++)sphere(pizza,mat('#efd193',.7),x+(rand()-.5)*.2,.208,z+(rand()-.5)*.2,.018,.007,.017)}
for(let i=0;i<7;i++){let a=i*2.7;const leaf=sphere(pizza,green,Math.cos(a)*.75,.24,Math.sin(a)*.75,.13,.018,.27);leaf.rotation.y=a}
const sushi=new THREE.Group();scene.add(sushi);const rice=mat('#f5efe0',.8),seaweed=mat('#203a25',.82),salmon=mat('#f88361',.6);
for(let i=0;i<4;i++){let x=(i%2-.5)*1.05,z=(Math.floor(i/2)-.5)*1.05;mesh(new THREE.CylinderGeometry(.48,.48,.65,44),seaweed,sushi,x,0,z);mesh(new THREE.CylinderGeometry(.42,.42,.67,44),rice,sushi,x,.02,z);mesh(new THREE.BoxGeometry(.4,.69,.35),salmon,sushi,x,.02,z);mesh(new THREE.BoxGeometry(.18,.7,.24),green,sushi,x+.21,.02,z+.1);for(let j=0;j<30;j++){let a=rand()*TAU,r=.27+rand()*.14;sphere(sushi,rice,x+Math.cos(a)*r,.38,z+Math.sin(a)*r,.025,.012,.046)}}

function batch(g){
 const buckets=new Map();
 for(const m of [...g.children]){if(!m.isMesh)continue;m.updateMatrix();const key=m.material.color.getHexString()+'-'+m.material.roughness+'-'+m.material.side+'-'+(m.material.map?.uuid||'');
 if(!buckets.has(key))buckets.set(key,{mat:m.material,geos:[]});let geo=m.geometry.clone().applyMatrix4(m.matrix);geo.clearGroups();buckets.get(key).geos.push(geo);g.remove(m)}
 for(const b of buckets.values()){const geo=mergeGeometries(b.geos);if(geo)g.add(new THREE.Mesh(geo,b.mat))}
}
for(const l of layers)batch(l);batch(pizza);batch(sushi);

// Orbital linework is rendered in 3D, with food passing in front of and behind it.
const orbit=new THREE.Group();scene.add(orbit);
for(let i=0;i<3;i++){const m=mesh(new THREE.TorusGeometry(2+i*.16,.008,5,140),mat('#d5ff5f',.45,.3),orbit);m.rotation.set(PI/2+.1*i,.35*i,.3*i)}
const particles=new THREE.Group();scene.add(particles);const bits=[];
for(let i=0;i<45;i++){let m=mesh(i%3===0?new THREE.TorusGeometry(.07,.012,6,12):new THREE.BoxGeometry(.07,.016,.16),i%3===0?onion:i%3===1?green:cheese,particles);m.userData={a:rand()*TAU,r:2+rand()*2.3,y:(rand()-.5)*5,s:rand()+.5};bits.push(m)}
function clamp(x,a=0,b=1){return Math.max(a,Math.min(b,x))}function ease(x){x=clamp(x);return 1-Math.pow(1-x,4)}function smooth(x){x=clamp(x);return x*x*(3-2*x)}function lerp(a,b,t){return a+(b-a)*t}
function pos(g,x,y,z,s=1){g.position.set(x,y,z);g.scale.setScalar(s)}
function hdr(ink=C.cream,label='A NEW DIMENSION OF DELICIOUS',n='01'){return `<div class="top" style="color:${ink}"><div class="logo">holo<span style="font-weight:400">menu</span><b style="color:${ink}">✳</b></div><div class="tag">${label}</div></div><div class="foot" style="color:${ink}"><span><i class="dot"></i>FOOD. WITH DIMENSION.</span><span>${n} / 08</span></div>`}
function lines(text,u,delay=0){return text.split('|').map((x,i)=>`<span class="line"><span class="reveal" style="transform:translateY(${(1-ease((u-delay-i*.12)/.65))*115}%);opacity:${ease((u-delay-i*.12)/.6)}">${x}</span></span>`).join('')}
function abs(style,html){return `<div class="absolute" style="${style}">${html}</div>`}
function text(style,html){return abs(style,`<div class="head">${html}</div>`)}
function circle(x,y,r,col,lw=1){ctx.strokeStyle=col;ctx.lineWidth=lw;ctx.beginPath();ctx.arc(x,y,r,0,TAU);ctx.stroke()}
function line(x1,y1,x2,y2,col,lw=1){ctx.strokeStyle=col;ctx.lineWidth=lw;ctx.beginPath();ctx.moveTo(x1,y1);ctx.lineTo(x2,y2);ctx.stroke()}
function roundRect(x,y,w,h,r,col){ctx.fillStyle=col;ctx.beginPath();ctx.roundRect(x,y,w,h,r);ctx.fill()}
function screen(u){
  ctx.save();ctx.translate(1310,525);ctx.rotate(-.055+.028*Math.sin(u*.8));
  ctx.shadowColor='#00000040';ctx.shadowBlur=55;ctx.shadowOffsetY=35;roundRect(-215,-380,430,820,60,'#252822');ctx.shadowBlur=0;ctx.shadowOffsetY=0;
  roundRect(-204,-369,408,798,50,'#c7d2aa');roundRect(-68,-354,136,32,18,'#171b15');
  ctx.fillStyle=C.dark;ctx.font='800 26px Manrope';ctx.fillText('holomenu',-165,-284);ctx.font='14px Manrope';ctx.fillText('EXPLORE SOMETHING DELICIOUS',-165,-242);
  ctx.strokeStyle='#5c704e60';ctx.lineWidth=1;for(let i=0;i<7;i++){let y=-170+i*75;line(-180,y,180,y,'#5c704e35')}for(let i=0;i<6;i++){let x=-180+i*72;line(x,-170,x,185,'#5c704e35')}
  ctx.strokeStyle='#476138';ctx.lineWidth=2;ctx.beginPath();ctx.ellipse(0,150,160,44,0,0,TAU);ctx.stroke();
  ctx.font='800 36px Manrope';ctx.fillStyle=C.dark;ctx.fillText('Your next craving.',-165,265);ctx.font='18px Manrope';ctx.fillText('A fresh perspective on food.',-165,301);roundRect(-166,334,332,55,28,C.dark);ctx.fillStyle=C.lime;ctx.font='700 17px Manrope';ctx.fillText('TAKE A CLOSER LOOK    +',-123,369);ctx.restore();
}

window.renderAt=function(t){
 t=clamp(t,0,44.999);ctx.clearRect(0,0,W,H);let html='';let u=0;
 burger.visible=true;pizza.visible=false;sushi.visible=false;orbit.visible=false;particles.visible=false;
 camera.position.set(0,3.1,12);camera.lookAt(0,0,0);burger.rotation.set(.04,t*.16,-.04);pos(burger,0,0,0,1);
 for(let i=0;i<layers.length;i++){layers[i].position.y=layers[i].userData.base;layers[i].rotation.y=0;}
 back.style.background=C.dark;
 if(t<4){
  u=t;burger.visible=false;html=hdr(C.cream,'A LITTLE CURIOSITY. A LOT OF APPETITE.','01');
  const pulse=1+.02*Math.sin(t*TAU*2);ctx.save();ctx.translate(960,540);ctx.scale(pulse,pulse);
  for(let i=0;i<5;i++){ctx.save();ctx.rotate(t*.08+i*.35);ctx.strokeStyle=i%2? '#d5ff5f33':'#d5ff5f66';ctx.lineWidth=1;ctx.beginPath();ctx.ellipse(0,0,680-i*45,420-i*42,0,0,TAU);ctx.stroke();ctx.restore()}ctx.restore();
  html+=text(`left:130px;top:280px;width:1660px;text-align:center;font-size:${154+6*ease(u/2)}px;`,lines('Hungry for|<span class="serif lime">something more?</span>',u,.15));
  html+=abs(`left:860px;top:825px;opacity:${ease((u-1.3)/.6)}`,`<span class="pill">LET’S LOOK <svg width="24" height="24" viewBox="0 0 30 30" fill="none" stroke="currentColor" stroke-width="2"><path d="M15 3V27M5 17L15 27L25 17"/></svg></span>`);
  if(u>3.45){let e=ease((u-3.45)/.55);ctx.fillStyle=C.lime;ctx.beginPath();ctx.arc(960,540,e*1200,0,TAU);ctx.fill();front.style.opacity=1-e;}else front.style.opacity=1;
 }else if(t<8){
  front.style.opacity=1;u=t-4;back.style.background=C.lime;html=hdr(C.dark,'MEET YOUR NEXT CRAVING','02');
  let e=ease(u/.9);pos(burger,2.15+(1-e)*6,-.1,0,1.75);burger.rotation.set(.09,lerp(-1.4,.25,e)+u*.2,-.09);
  circle(1390,540,340,'#263a1930',1);circle(1390,540,395,'#263a1920',1);line(1060,895,1790,895,'#263a1940');
  html+=text('left:110px;top:260px;width:930px;font-size:153px;color:#161912',lines('Love at|<span class="serif">first sight.</span>',u,.12));
  html+=abs(`left:118px;top:677px;color:#263020;opacity:${ease((u-.8)/.5)}`,`<div class="small">A whole new dimension<br>of delicious.</div><div class="pill" style="margin-top:37px">MEET HOLOMENU <svg width="29" height="29" viewBox="0 0 30 30" fill="none" stroke="currentColor" stroke-width="2"><path d="M5 25L25 5M5 5H25V25"/></svg></div>`);
  html+=abs('left:1625px;top:830px;color:#243b17;font-size:14px;letter-spacing:3px','01 — THE CLASSIC');
 }else if(t<14){
  u=t-8;back.style.background=C.cream;html=hdr(C.dark,'DESIGNED TO MAKE YOU LOOK','03');
  pos(burger,-2.9,-.2,0,1.18);burger.rotation.set(.1,u*.2-.3,.03);
  let ex=smooth(u/.95)*(1-smooth((u-4.75)/1.0));for(let i=0;i<layers.length;i++){layers[i].position.y+=((i-3.5)*.36)*ex;layers[i].rotation.y=(i-3)*.1*ex*Math.sin(u*.5)}
  circle(547,550,335,'#16191218');line(875,285,1010,285,'#16191244');line(875,760,1010,760,'#16191244');
  html+=text('left:1050px;top:240px;font-size:122px;color:#161912;width:820px',lines('Every layer.|Every angle.|<span class="serif">Every detail.</span>',u,.15));
  html+=abs(`left:1060px;top:731px;color:#4c5143;opacity:${ease((u-1)/.6)}`,`<div class="small">There’s more to the story<br>than a name on a menu.</div>`);
  html+=abs('left:110px;top:915px;color:#343b2b;font-size:16px;letter-spacing:3px','DELICIOUS, DECONSTRUCTED');
 }else if(t<20){
  u=t-14;back.style.background=C.dark;html=hdr(C.cream,'DISCOVER A FRESH PERSPECTIVE','04');
  screen(u);let e=ease(u/.85);pos(burger,2.47,0,-.05,.83*e);burger.rotation.set(.16,u*.65,-.05);
  html+=text('left:112px;top:277px;font-size:134px;width:940px',lines('A little closer.|A little more|<span class="serif lime">real.</span>',u,.1));
  html+=abs(`left:122px;top:785px;opacity:${ease((u-1)/.6)}`,`<div class="small" style="color:#c3c9b6">Go on. Take another look.</div>`);
  html+=abs('left:1590px;top:835px;font-size:13px;letter-spacing:2px;color:#a8b396','VISUAL CONCEPT');
  circle(1390,525,495,'#d5ff5f13');
 }else if(t<26){
  u=t-20;back.style.background=C.wine;html=hdr(C.pink,'APPETITE, ACTIVATED','05');
  const ss=1.65+.08*Math.sin(u*1.2);pos(burger,1.6,-.05,0,ss);burger.rotation.set(.13,u*.3,-.16);orbit.visible=true;pos(orbit,1.6,0,0,1.1);orbit.rotation.set(u*.07,0,-.3);
  html+=text('left:110px;top:230px;font-size:175px;width:950px;color:#e4bfd1',lines('Stop.|<span class="serif">Look.</span>|Crave.',u,.05));
  html+=abs(`left:1420px;top:830px;transform:rotate(-10deg) scale(${ease((u-.5)/.5)})`,`<div style="background:#d5ff5f;color:#161912;border-radius:100%;width:225px;height:225px;display:flex;align-items:center;justify-content:center;text-align:center;font-size:23px;font-weight:800;letter-spacing:-1px;line-height:1.15">EYES FIRST.<br>TASTE NEXT.</div>`);
 }else if(t<32){
  u=t-26;back.style.background=C.cream;html=hdr(C.dark,'A GREAT FIRST IMPRESSION','06');
  html+=text('left:110px;top:162px;font-size:105px;width:1700px;color:#161912',lines('Great taste. <span class="serif">Meet great presence.</span>',u));
  let e=ease((u-.25)/.8);const cardY=354+(1-e)*600;
  for(let i=0;i<3;i++){roundRect(106+i*580,cardY,550,540,30,[C.lime,'#e7c0ae','#cabbd6'][i]);ctx.fillStyle=C.dark;ctx.font='800 29px Manrope';ctx.fillText(['The crowd pleaser.','The conversation starter.','The small obsession.'][i],138+i*580,cardY+479);ctx.font='15px Manrope';ctx.fillText(['01 / STACKED WITH CHARACTER','02 / ANOTHER SLICE OF POSSIBILITY','03 / LITTLE DETAILS. BIG ENERGY.'][i],138+i*580,cardY+511)}
  pos(burger,-4.05,-.55-(1-e)*5,0,.87);burger.rotation.set(.08,u*.36,-.07);
  pizza.visible=true;pos(pizza,0,-.55-(1-e)*5,0,1.05);pizza.rotation.set(.45,u*.24,0);
  sushi.visible=true;pos(sushi,4.05,-.5-(1-e)*5,0,1.03);sushi.rotation.set(.16,u*.3,0);
 }else if(t<38){
  u=t-32;back.style.background=C.dark;html=hdr(C.cream,'TURN CURIOSITY INTO CRAVING','07');
  burger.visible=false;particles.visible=true;
  for(let i=0;i<bits.length;i++){let p=bits[i],d=p.userData;let a=d.a+u*.17*d.s;p.position.set(Math.cos(a)*d.r*1.8,d.y+Math.sin(u+d.a)*.3,Math.sin(a)*d.r*.45-1);p.rotation.set(u*.5+d.a,u*.7,d.a)}
  let word=u<1.7?'Curious?':u<3.4?'Closer.':'<span class="serif lime">Craving.</span>';
  let local=u<1.7?u:u<3.4?u-1.7:u-3.4;
  let size=u<3.4?238:255;html+=text(`left:65px;top:380px;width:1790px;text-align:center;font-size:${size}px;transform:scale(${.85+.15*ease(local/.5)});opacity:${ease(local/.25)}`,word);
  html+=abs(`left:700px;top:739px;opacity:${ease((u-3.6)/.6)}`,`<div class="eyebrow lime">THAT’S THE HOLOMENU EFFECT.</div>`);
  for(let i=0;i<3;i++)circle(960,540,350+i*75+Math.sin(u)*15,'#d5ff5f20',1);
 }else if(t<42){
  u=t-38;back.style.background=C.dark;html=hdr(C.cream,'DELICIOUS IN EVERY DIMENSION','08');
  pos(burger,2.6,0,0,1.55*ease(u/.65));burger.rotation.set(.06,u*.33,-.06);orbit.visible=true;pos(orbit,2.6,0,0,1.05);orbit.rotation.set(.1,u*.1,-.12);
  html+=text('left:105px;top:283px;font-size:141px;width:1030px',lines('Food.|With <span class="serif lime">dimension.</span>',u,.1));
  html+=abs(`left:115px;top:655px;opacity:${ease((u-.6)/.6)}`,`<div class="small" style="color:#bfc5b3">A new way to meet your next craving.</div>`);
  if(u>3.4){let e=ease((u-3.4)/.6);ctx.fillStyle=C.lime;ctx.fillRect(0,H*(1-e),W,H*e);front.style.opacity=1-e;}else front.style.opacity=1;
 }else{
  front.style.opacity=1;u=t-42;back.style.background=C.lime;burger.visible=false;
  html=abs('left:84px;top:62px;color:#161912;font-size:16px;letter-spacing:4px','A NEW DIMENSION OF DELICIOUS');
  for(let i=0;i<3;i++)circle(1660,180,240+i*100,'#16191222');
  html+=text(`left:90px;top:320px;font-size:264px;color:#161912;letter-spacing:-19px;transform:translateY(${(1-ease(u/.7))*100}px);opacity:${ease(u/.6)}`,'holo<span style="font-weight:400">menu</span><span style="font-size:70px;vertical-align:top;position:relative;top:25px;letter-spacing:-1px">✳</span>');
  html+=abs(`left:113px;top:645px;color:#161912;opacity:${ease((u-.25)/.5)}`,`<div class="small" style="font-size:43px;letter-spacing:-1.5px">See what’s possible.</div>`);
  html+=abs(`left:1195px;top:655px;color:#161912;opacity:${ease((u-.4)/.5)}`,`<div class="pill" style="background:#161912;color:#d5ff5f;font-size:30px;padding:25px 38px;gap:65px">holomenu.food <svg width="29" height="29" viewBox="0 0 30 30" fill="none" stroke="currentColor" stroke-width="2"><path d="M5 25L25 5M5 5H25V25"/></svg></div>`);
  html+=abs('left:110px;bottom:70px;color:#344226;font-size:15px;letter-spacing:3px','FOOD. WITH DIMENSION.');
 }
 // A slim editorial timing rule makes the full film feel deliberately paced.
 ctx.fillStyle=t>=42?'#161912':'#d5ff5f';ctx.fillRect(0,1076,W*t/45,4);
 front.innerHTML=html;renderer.render(scene,camera);
 document.querySelector('#seek').value=t;document.querySelector('#time').textContent=`00:${String(Math.floor(t)).padStart(2,'0')} / 00:45`;
};
function resize(){stage.style.transform=`scale(${Math.min(innerWidth/W,innerHeight/H)})`;stage.style.left=`${(innerWidth-W*Math.min(innerWidth/W,innerHeight/H))/2}px`;stage.style.top=`${(innerHeight-H*Math.min(innerWidth/W,innerHeight/H))/2}px`}
addEventListener('resize',resize);resize();
const aud=document.querySelector('#sound');let playing=false,previewTime=0,last=0;
document.querySelector('#play').onclick=async()=>{playing=!playing;if(playing){if(previewTime>44.8)previewTime=0;aud.currentTime=previewTime;await aud.play();document.querySelector('#play').textContent='Ⅱ Pause'}else{aud.pause();document.querySelector('#play').textContent='▶ Play film'}};
document.querySelector('#seek').oninput=e=>{previewTime=Number(e.target.value);aud.currentTime=previewTime;window.renderAt(previewTime)};
function tick(){if(playing){previewTime=aud.currentTime;window.renderAt(previewTime);if(previewTime>=44.98){playing=false;aud.pause();document.querySelector('#play').textContent='↻ Replay'}}requestAnimationFrame(tick)}
if(new URLSearchParams(location.search).has('render'))document.querySelector('#controls').style.display='none';else tick();
await document.fonts.ready;window.renderAt(0);window.filmReady=true;
