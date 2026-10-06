import { chromium } from 'playwright-core';
import { spawn } from 'node:child_process';
import { mkdir, writeFile } from 'node:fs/promises';
import path from 'node:path';
const root=path.resolve(import.meta.dirname,'..');
const sample=process.argv.includes('--samples');
const browser=await chromium.launch({executablePath:'/usr/bin/chromium',headless:true,args:['--no-sandbox','--use-angle=swiftshader','--enable-unsafe-swiftshader','--disable-dev-shm-usage','--hide-scrollbars','--disable-background-timer-throttling']});
const page=await browser.newPage({viewport:{width:1920,height:1080},deviceScaleFactor:1});
page.on('pageerror',e=>console.error(e));
await page.goto('http://127.0.0.1:8000/?render=1');
await page.waitForFunction(()=>window.filmReady,{timeout:60000});
await mkdir(path.join(root,'output'),{recursive:true});
if(sample){
 for(const t of [2,6,10,16,23,28,35,39.5,43.5]){
  await page.evaluate(t=>window.renderAt(t),t);
  await page.screenshot({path:path.join(root,`output/sample-${t}.jpg`),type:'jpeg',quality:90});
  console.log('sample',t);
 }
}else{
 const enc=spawn('ffmpeg',['-y','-f','image2pipe','-vcodec','mjpeg','-r','30','-i','-','-an','-c:v','libx264','-preset','fast','-crf','17','-pix_fmt','yuv420p','-movflags','+faststart',path.join(root,'output/picture.mp4')],{stdio:['pipe','ignore','inherit']});
 const done=new Promise((resolve,reject)=>{enc.on('exit',c=>c===0?resolve():reject(Error(`ffmpeg ${c}`)));enc.on('error',reject)});
 for(let f=0;f<1350;f++){
  await page.evaluate(t=>window.renderAt(t),f/30);
  const buf=await page.screenshot({type:'jpeg',quality:94});
  if(!enc.stdin.write(buf))await new Promise(r=>enc.stdin.once('drain',r));
  if(f%90===0)console.log(`Rendered ${f}/1350 frames (${(f/30).toFixed(1)}s)`);
 }
 enc.stdin.end();await done;
}
await browser.close();
