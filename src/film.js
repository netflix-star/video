// Original flat vector illustration film. Every frame is deterministic.
const W=1920,H=1080,TAU=Math.PI*2;
const C={ink:'#20231c',cream:'#f4f1e7',lime:'#d5ff5f',pink:'#e7c2d7',plum:'#421b32',red:'#ff6751',yellow:'#ffd94e',green:'#89bf5a'};
const canvas=document.querySelector('#film'),ctx=canvas.getContext('2d',{alpha:false});
const stage=document.querySelector('#stage');
const art={};
const names=['burger','pizza','bowl','tomato','leaf','fork','hand','spark','burger-bun-bottom','burger-lettuce-bottom','burger-patty','burger-cheese','burger-tomato','burger-onion','burger-lettuce-top','burger-bun-top'];
await Promise.all(names.map(async name=>{const im=new Image();im.src=`assets/illustrations/${name}.svg`;await im.decode();art[name]=im;}));
await Promise.all([document.fonts.load('800 160px Manrope'),document.fonts.load('400 30px Manrope'),document.fonts.load('italic 500 180px Editorial')]);
const clamp=(x,a=0,b=1)=>Math.max(a,Math.min(b,x));
const ease=x=>1-(1-clamp(x))**4;
const smooth=x=>{x=clamp(x);return x*x*(3-2*x)};
const back=x=>{x=clamp(x)-1;return 1+2.4*x*x*x+1.4*x*x};
const lerp=(a,b,x)=>a+(b-a)*x;
function rect(x,y,w,h,color,r=0,stroke=0){ctx.fillStyle=color;ctx.beginPath();ctx.roundRect(x,y,w,h,r);ctx.fill();if(stroke){ctx.strokeStyle=C.ink;ctx.lineWidth=stroke;ctx.stroke();}}
function line(x1,y1,x2,y2,color=C.ink,w=3){ctx.strokeStyle=color;ctx.lineWidth=w;ctx.lineCap='round';ctx.beginPath();ctx.moveTo(x1,y1);ctx.lineTo(x2,y2);ctx.stroke();}
function circle(x,y,r,fill,stroke=C.ink,lw=5){ctx.beginPath();ctx.arc(x,y,r,0,TAU);if(fill){ctx.fillStyle=fill;ctx.fill();}if(stroke){ctx.strokeStyle=stroke;ctx.lineWidth=lw;ctx.stroke();}}
function word(s,x,y,size=40,color=C.ink,weight=800,italic=false,align='left',spacing=null){
 ctx.fillStyle=color;ctx.font=`${italic?'italic ':''}${weight} ${size}px ${italic?'Editorial':'Manrope'}`;ctx.textAlign=align;ctx.textBaseline='alphabetic';ctx.letterSpacing=spacing??(size>80?`${-size*.05}px`:'0px');ctx.fillText(s,x,y);ctx.letterSpacing='0px';ctx.textAlign='left';
}
function reveal(s,x,y,size,u,color=C.ink,italic=false){ctx.save();let e=ease(u/.65);ctx.beginPath();ctx.rect(x-24,y-size*1.12,1800,size*1.38);ctx.clip();ctx.globalAlpha=e;word(s,x,y+(1-e)*(size*1.3),size,color,italic?500:800,italic);ctx.restore();}
function image(name,x,y,s=1,angle=0,alpha=1){let im=art[name];ctx.save();ctx.translate(x,y);ctx.rotate(angle);ctx.scale(s,s);ctx.globalAlpha=alpha;ctx.drawImage(im,-im.width/2,-im.height/2);ctx.restore();}
function arrow(x,y,s=1,color=C.ink){ctx.save();ctx.translate(x,y);ctx.scale(s,s);line(-14,14,14,-14,color,3);line(-14,-14,14,-14,color,3);line(14,-14,14,14,color,3);ctx.restore();}
function pill(s,x,y,w=320,fill=C.ink,ink=C.lime,size=22){rect(x,y,w,74,fill,37);word(s,x+28,y+48,size,ink,600);arrow(x+w-38,y+36,.68,ink);}
function label(s,x,y,color=C.ink,size=16){word(s,x,y,size,color,600,false,'left','2.5px');}
function star(x,y,r,color=C.lime,rotation=0,points=10){ctx.save();ctx.translate(x,y);ctx.rotate(rotation);ctx.beginPath();for(let i=0;i<points*2;i++){let a=i*Math.PI/points-Math.PI/2,rr=i%2?r*.7:r;ctx.lineTo(Math.cos(a)*rr,Math.sin(a)*rr);}ctx.closePath();ctx.fillStyle=color;ctx.fill();ctx.strokeStyle=C.ink;ctx.lineWidth=5;ctx.stroke();ctx.restore();}
function asterisk(x,y,r,color=C.ink,rotation=0){ctx.save();ctx.translate(x,y);ctx.rotate(rotation);for(let i=0;i<8;i++){let a=i*TAU/8;line(Math.cos(a)*r*.23,Math.sin(a)*r*.23,Math.cos(a)*r,Math.sin(a)*r,color,Math.max(3,r*.12));}ctx.restore();}
function header(color,slug,n){word('holo',80,94,38,color,800);word('menu',158,94,38,color,400);asterisk(269,78,13,color);// Right-align the running label.
 ctx.save();ctx.fillStyle=color;ctx.font='600 14px Manrope';ctx.letterSpacing='2px';ctx.textAlign='right';ctx.fillText(slug,1834,84);ctx.restore();

 circle(88,1023,4,color,null);label('FOOD. WITH DIMENSION.',108,1028,color,14);label(`${n} / 08`,1758,1028,color,14);
}
function eyePair(x,y,s=1,t=0,blink=0,look=0){ctx.save();ctx.translate(x,y);ctx.rotate(-.07);ctx.scale(s,Math.max(.06,1-blink)*s);for(let k of [-1,1]){ctx.beginPath();ctx.ellipse(k*92,0,88,109,0,0,TAU);ctx.fillStyle=C.cream;ctx.fill();ctx.strokeStyle=C.ink;ctx.lineWidth=8;ctx.stroke();circle(k*92+look*23,5,34,C.ink,null);circle(k*92+look*23+9,-6,10,C.cream,null);}ctx.restore();}
function rays(x,y,r,color=C.ink,progress=1,t=0){for(let k=0;k<12;k++){let a=k*TAU/12+t,r1=r+30,r2=r+30+34*progress;line(x+Math.cos(a)*r1,y+Math.sin(a)*r1,x+Math.cos(a)*r2,y+Math.sin(a)*r2,color,4);}}
function scribble(x,y,rx,ry,color,u,lw=4){ctx.save();ctx.translate(x,y);ctx.rotate(-.13);ctx.beginPath();let count=Math.floor(clamp(u)*120);for(let i=0;i<=count;i++){let a=i/120*TAU;let r=1+.025*Math.sin(a*5);ctx.lineTo(Math.cos(a)*rx*r,Math.sin(a)*ry*r);}ctx.strokeStyle=color;ctx.lineWidth=lw;ctx.stroke();ctx.restore();}
function ticker(text,t,y=925,color=C.ink){ctx.save();ctx.beginPath();ctx.rect(0,y-36,W,64);ctx.clip();ctx.font='700 27px Manrope';ctx.letterSpacing='3px';const step=ctx.measureText(text).width+90;ctx.letterSpacing='0px';for(let i=-1;i<Math.ceil(W/step)+2;i++)word(text,i*step-(t*115)%step,y,27,color,700,false,'left','3px');ctx.restore();}
function smallDecor(t,color=C.ink){for(let i=0;i<7;i++){let x=170+(i*251)%1720,y=200+(i*113)%680;ctx.globalAlpha=.17;asterisk(x,y,12+6*(i%2),color,t*.2+i);ctx.globalAlpha=1;}}
function phone(u){
 ctx.save();ctx.translate(1367,529);ctx.rotate(-.06+.025*Math.sin(u*1.4));let sc=back(u/.8);ctx.scale(sc,sc);
 rect(-221,-386,442,814,C.ink,48);rect(-206,-371,412,784,C.cream,35,4);rect(-60,-357,120,27,C.ink,14);
 word('holomenu',-172,-295,25,C.ink);label('MEET YOUR NEXT CRAVING',-172,-261,C.ink,11);
 rect(-174,-224,348,374,C.lime,23,4);ctx.save();ctx.beginPath();ctx.roundRect(-172,-222,344,370,20);ctx.clip();
 let slide=smooth((u-2.7)/.55);image('burger',-slide*380,-36,.43,-.08*Math.sin(u));image('pizza',380*(1-slide),-35,.4,u*.06);
 ctx.restore();
 let select=u>3.2?1:0;for(let i=0;i<3;i++)circle(-24+i*24,179,i===select?5:3,C.ink,null);
 word('A fresh perspective.',-171,236,29,C.ink);word('Find something delicious.',-170,277,18,C.ink,400);
 rect(-174,314,348,62,C.ink,31);word('TAKE A CLOSER LOOK',-144,354,17,C.lime,700);arrow(139,345,.5,C.lime);
 ctx.restore();
 let e=back((u-.3)/.8);image('hand',1570+80*(1-e),908+200*(1-e),.8,-.25);
 if(u>2.35&&u<3.6){let q=clamp((u-2.35)/1.25);circle(1490,674,22+q*90,null,`rgba(255,103,81,${1-q})`,7);}
}
function magnifier(x,y,s,angle=0){ctx.save();ctx.translate(x,y);ctx.rotate(angle);ctx.scale(s,s);line(65,65,180,180,C.ink,30);line(73,71,168,168,C.lime,17);circle(0,0,99,C.cream,C.ink,10);circle(0,0,85,null,C.lime,9);eyePair(0,0,.43,0,0,.2);ctx.restore();}
function confetti(t,around=false){for(let i=0;i<17;i++){let a=i*2.399+t*.14,r=around?440+(i%3)*180:540+(i%4)*85,x=960+Math.cos(a)*r*1.45,y=540+Math.sin(a)*r*.65;let name=['tomato','leaf','spark'][i%3];image(name,x,y,.095+(i%3)*.035,t*.14+i);}}
const starts=[0,4,8,14,20,26,32,38,42];
const backgrounds=[C.ink,C.lime,C.cream,C.plum,C.pink,C.cream,C.ink,C.cream,C.lime];
window.renderAt=function(t){
 t=clamp(t,0,44.999);ctx.setTransform(1,0,0,1,0,0);ctx.globalAlpha=1;ctx.lineWidth=3;
 let shot=0;for(let i=0;i<starts.length;i++)if(t>=starts[i])shot=i;let u=t-starts[shot];
 rect(0,0,W,H,backgrounds[shot]);
 if(shot===0){
  header(C.cream,'A LITTLE CURIOSITY. A LOT OF APPETITE.','01');
  ctx.globalAlpha=.16;for(let x=80;x<W;x+=88)line(x,151,x,957,C.cream,1);for(let y=159;y<980;y+=88)line(79,y,1840,y,C.cream,1);ctx.globalAlpha=1;
  image('spark',1490,500,1.05,t*.08);eyePair(1490,500,1.02,t,Math.exp(-(((u-2.1)/.065)**2)),-.8+.6*Math.sin(t*1.4));
  reveal('Hungry for',109,441,175,u-.12,C.cream);reveal('something',108,624,180,u-.25,C.lime,true);reveal('more?',108,802,180,u-.4,C.lime,true);
  ctx.save();ctx.translate(1685,820);ctx.rotate(.24);rect(-73,-110,146,220,C.cream,18);ctx.restore();image('fork',1685+60*(1-ease(u/.9)),820,.33,.25+Math.sin(t*1.5)*.04);
  scribble(1360,840,174,44,C.cream,ease((u-.8)/1.2),3);word('LOOKS DELICIOUS.',1365,850,19,C.cream,600,false,'center','2px');
  image('tomato',1160,260,.22,-.35+t*.1);asterisk(846,805,42,C.lime,u*.3);
 }else if(shot===1){
  header(C.ink,'MEET YOUR NEXT CRAVING','02');
  circle(1440,598,330,C.cream,C.ink,5);rays(1440,598,343,C.ink,ease((u-.4)/.8),.03*Math.sin(u));
  let e=back(u/.85);image('burger',1420+550*(1-e),582+14*Math.sin(u*2.4),1.34+.025*Math.sin(u*3.2),-.055+.035*Math.sin(u*1.5));
  image('leaf',1780,276,.33,.4+u*.05);image('tomato',1070,850,.25,-.5+u*.06);
  reveal('Love at',111,432,164,u-.15);reveal('first sight.',112,599,183,u-.3,C.ink,true);
  word('A whole new dimension of delicious.',121,708,26,C.ink,400);pill('MEET HOLOMENU',119,763,327);
  ctx.save();ctx.translate(1614,890);ctx.rotate(-.14);rect(-163,-37,326,74,C.red,9,5);word('01 / THE CLASSIC',0,12,22,C.ink,800,false,'center');ctx.restore();
 }else if(shot===2){
  header(C.ink,'DESIGNED TO MAKE YOU LOOK','03');
  let ex=smooth(u/.8)*(1-smooth((u-4.9)/.85));let sc=.98;
  for(let i=0;i<8;i++){const name=names[8+i],dy=(3.5-i)*52*ex;image(name,535+Math.sin(u*.9+i*.2)*12*ex,540+dy,sc,(i-3.5)*.014*ex*Math.sin(u));}
  for(const [y,txt,delay] of [[312,'01 / FRESH THINKING',.7],[557,'02 / THE GOOD STUFF',.9],[810,'03 / BIG APPETITE',1.1]]){
   ctx.globalAlpha=ease((u-delay)/.5);line(843,y,960,y,C.ink,2);circle(835,y,5,C.red,null);label(txt,108,y+20,C.ink,12);ctx.globalAlpha=1;
  }
  reveal('Every layer.',1020,374,122,u-.12);reveal('Every angle.',1020,505,122,u-.24);reveal('Every detail.',1020,642,133,u-.36,C.ink,true);
  word('There’s more to the story',1030,784,27,C.ink,400);word('than a name on a menu.',1030,826,27,C.ink,400);
  image('leaf',901,908,.21,-.5);asterisk(1816,267,37,C.red,u*.15);
 }else if(shot===3){
  header(C.cream,'DISCOVER A FRESH PERSPECTIVE','04');
  phone(u);reveal('A little closer.',108,365,126,u-.1,C.cream);reveal('A little more',108,505,126,u-.23,C.cream);reveal('real.',105,674,185,u-.37,C.lime,true);
  word('Go on. Take another look.',117,802,27,C.cream,400);
  ctx.strokeStyle=C.pink;ctx.lineWidth=4;ctx.beginPath();ctx.moveTo(880,718);ctx.bezierCurveTo(1070,790,952,509,1148,536);ctx.stroke();arrow(1140,534,.6,C.pink);
  image('spark',1800,248,.24,u*.25);image('tomato',1060,210,.2,-.3);
 }else if(shot===4){
  header(C.ink,'APPETITE, ACTIVATED','05');
  let cycle=Math.floor(u/2);let circleColor=[C.cream,C.lime,C.yellow][cycle%3];circle(1375,548,342,circleColor,C.ink,6);
  const artName=cycle===0?'burger':cycle===1?'pizza':'bowl';image(artName,1375,539+12*Math.sin(u*3),1.29,Math.sin(u*1.4)*.07);
  reveal('Stop.',107,375,186,u-.05);reveal('Look.',107,551,196,u-.2,C.ink,true);reveal('Crave.',107,733,186,u-.35);
  star(1600,872,135,C.lime,-.15+.04*Math.sin(u*2));word('EYES FIRST.',1600,861,23,C.ink,800,false,'center');word('TASTE NEXT.',1600,893,23,C.ink,800,false,'center');
  image('tomato',1040,860,.25,-.4);image('leaf',1770,314,.28,.4);image('fork',1790,735,.33,-.3);
  ctx.globalAlpha=.8;scribble(1375,548,406,402,C.ink,ease(u/1.1),2);ctx.globalAlpha=1;
 }else if(shot===5){
  header(C.ink,'A GREAT FIRST IMPRESSION','06');
  reveal('Great taste.',110,251,105,u);reveal('Meet great presence.',691,251,119,u-.12,C.ink,true);
  for(let i=0;i<3;i++){
   let e=back((u-.25-i*.14)/.75),x=107+i*580,y=339+(1-e)*720;
   ctx.save();ctx.translate(x+275,y+275);ctx.rotate(Math.sin(u*1.3+i)*.015);rect(-275,-275,550,555,[C.lime,C.pink,C.yellow][i],28,5);
   image(['burger','pizza','bowl'][i],0,-38,.63,Math.sin(u*1.6+i)*.06);
   word(['The crowd pleaser.','The conversation starter.','The small obsession.'][i],-242,196,28,C.ink);
   label(['01 / FULL OF CHARACTER','02 / ANOTHER SLICE OF POSSIBILITY','03 / LITTLE DETAILS. BIG ENERGY.'][i],-241,236,C.ink,11);ctx.restore();
  }
  ticker('GOOD FOOD. GOOD ENERGY.   ✦',u,955,C.ink);
 }else if(shot===6){
  header(C.cream,'TURN CURIOSITY INTO CRAVING','07');confetti(u,true);
  const seg=u<1.7?0:u<3.4?1:2,local=u-[0,1.7,3.4][seg],s=['Curious?','Closer.','Craving.'][seg];
  const size=seg===2?256:228;ctx.save();ctx.translate(960,590);ctx.scale(back(local/.5),back(local/.5));word(s,0,0,size,seg===2?C.lime:C.cream,seg===2?500:800,seg===2,'center');ctx.restore();
  if(seg<2)magnifier(1570,773,.63,-.3+u*.1);else{scribble(960,536,625,171,C.lime,ease((local-.2)/.7),4);label('THAT’S THE HOLOMENU EFFECT.',690,807,C.lime,18);}
  asterisk(300,265,51,C.pink,u*.2);asterisk(1750,307,45,C.lime,-u*.2);
 }else if(shot===7){
  header(C.ink,'DELICIOUS IN EVERY DIMENSION','08');
  reveal('Food.',108,418,164,u-.1);reveal('With dimension.',108,589,170,u-.22,C.ink,true);
  word('A new way to meet your next craving.',119,741,27,C.ink,400);
  star(1430,545,337,C.lime,u*.02,12);image('burger',1430,545+9*Math.sin(u*2),1.11,-.04);
  image('leaf',1680,241,.28,.4);image('tomato',1740,789,.27,-.4);asterisk(1080,238,48,C.red,u*.2);label('HOLOMENU. LOOKS LIKE POSSIBILITY.',112,899,C.ink,15);
 }else{
  label('A NEW DIMENSION OF DELICIOUS',83,88,C.ink,16);
  let e=ease(u/.7);ctx.save();ctx.globalAlpha=e;ctx.translate(0,(1-e)*100);
  word('holo',91,541,263,C.ink,800);word('menu',640,541,263,C.ink,400);asterisk(1332,373,56,C.ink,u*.18);ctx.restore();
  word('See what’s possible.',113,681,45,C.ink,400);pill('holomenu.food',1240,626,466,C.ink,C.lime,32);
  // The final frame stays legible while a small illustrated seal continues to turn.
  star(1655,268,139,C.pink,.12,12);eyePair(1655,262,.54,u,Math.exp(-(((u-1.75)/.075)**2)),-.4);
  label('FOOD. WITH DIMENSION.',110,1009,C.ink,15);label('MADE TO MAKE YOU LOOK.',1480,1009,C.ink,15);
  line(110,777,1800,777,C.ink,2);ticker('GOOD FOOD. FRESH PERSPECTIVE.   ✦',u,902,C.ink);
 }
 // Beat-aligned, entirely flat graphic transitions.
 for(let i=1;i<starts.length;i++){let q=(t-(starts[i]-.24))/.48;if(q>0&&q<1){let x=W-smooth(q)*W*2;rect(x,0,W,H,backgrounds[i]);for(let j=0;j<5;j++)rect(x+j*384,0,8,H,i%2?C.ink:C.red);}}
 rect(0,1076,W*t/45,4,shot===8?C.ink:C.lime);
 const seek=document.querySelector('#seek'),time=document.querySelector('#time');if(seek)seek.value=t;if(time)time.textContent=`00:${String(Math.floor(t)).padStart(2,'0')} / 00:45`;
};
window.exportFrame=t=>{window.renderAt(t);return canvas.toDataURL('image/jpeg',.96).split(',')[1];};
function resize(){const s=Math.min(innerWidth/W,innerHeight/H);stage.style.transform=`scale(${s})`;stage.style.left=`${(innerWidth-W*s)/2}px`;stage.style.top=`${(innerHeight-H*s)/2}px`;}
addEventListener('resize',resize);resize();
const aud=document.querySelector('#sound');let playing=false,previewTime=0;
document.querySelector('#play').onclick=async()=>{playing=!playing;if(playing){if(previewTime>44.8)previewTime=0;aud.currentTime=previewTime;await aud.play();document.querySelector('#play').textContent='Ⅱ Pause';}else{aud.pause();document.querySelector('#play').textContent='▶ Play film';}};
document.querySelector('#seek').oninput=e=>{previewTime=Number(e.target.value);aud.currentTime=previewTime;window.renderAt(previewTime);};
function tick(){if(playing){previewTime=aud.currentTime;window.renderAt(previewTime);if(previewTime>=44.98){playing=false;aud.pause();document.querySelector('#play').textContent='↻ Replay';}}requestAnimationFrame(tick);}
if(new URLSearchParams(location.search).has('render'))document.querySelector('#controls').style.display='none';else tick();
window.renderAt(0);window.filmReady=true;
