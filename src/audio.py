"""Original 120 BPM score, sound design, and timed Kokoro narration."""
from pathlib import Path
import os
os.environ['OMP_NUM_THREADS']='2'
import numpy as np
import soundfile as sf
from scipy.signal import butter, sosfilt
from kokoro_onnx import Kokoro

ROOT=Path(__file__).resolve().parents[1]
OUT=ROOT/'output'; OUT.mkdir(exist_ok=True)
SR=48000; DUR=75; N=SR*DUR
rng=np.random.default_rng(41)
score=np.zeros((N,2),np.float64)
vo=np.zeros(N,np.float64)
def add(buf,x,start,amp=1,pan=0):
    i=round(start*SR); n=min(len(x),len(buf)-i)
    if n<=0:return
    if buf.ndim==2:
        if x.ndim==1:x=np.column_stack((x*np.sqrt((1-pan)/2),x*np.sqrt((1+pan)/2)))
    buf[i:i+n]+=x[:n]*amp
def tone(freq,dur):
    t=np.arange(int(dur*SR))/SR
    return t
def filt(x,hz,kind='lowpass'):
    return sosfilt(butter(2,hz,kind,fs=SR,output='sos'),x)

# A restrained cinematic house arrangement, composed for this edit.
chords=[[146.832,174.614,220,261.626],[130.813,164.814,195.998,246.942],
        [116.541,146.832,174.614,220],[130.813,164.814,195.998,261.626]]
for bar in range(38):
    start=bar*2
    chord=chords[(bar//2)%4]
    t=tone(1,2.8)
    env=(1-np.exp(-t*2.5))*np.exp(-np.maximum(t-1.5,0)*3)
    pad=sum(np.sin(2*np.pi*f*t+0.13*np.sin(2*np.pi*.2*t))+.25*np.sin(2*np.pi*(f*1.003)*t) for f in chord)/5
    pumping=.42+.58*(1-np.exp(-(t%.5)*10))
    add(score,pad*env*pumping,start,.14 if start>=4 else .1)
    for n in range(8):
        st=start+n*.25
        if st>71:continue
        t=tone(1,1.05); f=chord[n%4]*2*(2 if n in [3,7] else 1)
        pluck=(np.sin(2*np.pi*f*t)+.27*np.sin(2*np.pi*f*2*t)+.09*np.sin(2*np.pi*f*3*t))*np.exp(-t*8)*(1-np.exp(-t*120))
        a=.09 if st>=4 else .045
        add(score,pluck,st,a,(-1 if n%2 else 1)*.45)
        add(score,pluck,st+.375,a*.26,(-1 if n%2 else 1)*-.6)
    if 12<=start<70:
        for beat in range(4):
            st=start+beat*.5
            t=tone(1,.43)
            phase=2*np.pi*(47*t+4.6*(1-np.exp(-t*33)))
            kick=np.sin(phase)*np.exp(-t*11)+rng.normal(0,1,len(t))*np.exp(-t*250)*.14
            add(score,kick,st,.63)
            tb=tone(1,.43); f=chord[0]/2
            bass=(np.sin(2*np.pi*f*tb)+.18*np.sin(2*np.pi*f*2*tb))*np.exp(-tb*3)*(1-np.exp(-tb*35))
            add(score,bass,st+.04,.29)
            if beat%2:
                t=tone(1,.25); noise=filt(rng.normal(0,1,len(t)),1600,'highpass')
                clap=noise*np.exp(-t*23)*(1+.5*np.sin(2*np.pi*95*t))
                add(score,clap,st,.15)
        for h in range(8):
            t=tone(1,.1 if h%2==0 else .18)
            hat=filt(rng.normal(0,1,len(t)),7800,'highpass')*np.exp(-t*(85 if h%2==0 else 28))
            add(score,hat,start+h*.25,.07 if h%2 else .035,.35 if h%2 else -.35)

# Stereo transition sweeps, sub drops, and glitter accents.
for st in [4,8,11,14,17,21,25,30,34,38,41,46,49,53,57,61,65,69,72]:
    t=tone(1,.9)
    hit=np.sin(2*np.pi*(40*t+1.2*(1-np.exp(-t*15))))*np.exp(-t*6)
    add(score,hit,st,.42)
    t=tone(1,.65)
    sw=filt(rng.normal(0,1,len(t)),3500)*np.sin(np.pi*t/.65)**2
    add(score,sw,max(0,st-.6),.12,-.15)
    for k in range(3):
        t=tone(1,.7); bell=np.sin(2*np.pi*[1174.66,1396.91,1760][k]*t)*np.exp(-t*11)
        add(score,bell,st+k*.055,.04,k*.5-.5)
for st in [9,23,32,47,55,63,67]:
    t=tone(1,2); noise=filt(rng.normal(0,1,len(t)),2000,'highpass')*(t/2)**2
    add(score,noise,st,.065)
score*=np.clip(np.arange(N)/SR/1.0,0,1)[:,None]
score*=np.clip((75-np.arange(N)/SR)/2,0,1)[:,None]

lines=[(.5,'For decades, menus simply told customers what they could order.'),
(4.4,'But today, customers expect more.'),
(8.15,'What if your menu became an experience?'),
(11.5,'Meet Holo Menu.'),
(14.15,'No app. No download. Just scan.'),
(17.25,'Turn every dish into something customers can see, explore, and understand.'),
(21.35,'Give every dish more than a name and a photo.'),
(25.3,'Let customers look closer. Explore ingredients. And choose with confidence.'),
(30.3,'Bring the dish to their table with augmented reality.'),
(34.3,'Then move from discovery to ordering.'),
(38.15,'All within the same experience.'),
(41.35,'From the kitchen to the table, customers always know what happens next.'),
(46.3,'And every order flows seamlessly.'),
(49.25,'With the tools to manage your restaurant in one place.'),
(53.25,'Because a modern restaurant needs more than a digital menu.'),
(57.3,'More orders. Happier customers. A stronger business.'),
(61.3,'From the first scan to the final bite.'),
(65.25,'Turn every interaction into a better experience.'),
(69.3,'Holo Menu.'),
(72.2,'Make your menu an experience.')]
kokoro=Kokoro(str(ROOT/'assets/kokoro-v1.0.onnx'),str(ROOT/'assets/voices-v1.0.bin'))
from scipy.signal import resample_poly
subs=[]
for idx,(st,line) in enumerate(lines):
    samples,rate=kokoro.create(line,voice='am_michael',speed=1.0,lang='en-us')
    samples=resample_poly(samples,SR,rate)
    limit=(lines[idx+1][0]-.25-st) if idx+1<len(lines) else 74.8-st
    if len(samples)/SR>limit:
        # Preserve pitch when tightening narration to the shot boundaries.
        import subprocess
        sf.write('/tmp/holomenu-raw.wav',samples,SR)
        factor=len(samples)/SR/limit
        subprocess.run(['ffmpeg','-y','-v','error','-i','/tmp/holomenu-raw.wav','-af',f'atempo={factor:.5f}','/tmp/holomenu-timed.wav'],check=True)
        samples,_=sf.read('/tmp/holomenu-timed.wav')
    sf.write(str(OUT/f'voice-{idx:02d}.wav'),samples,SR)
    add(vo,samples,st,1)
    subs.append((st,st+len(samples)/SR,line))
    print(f'{st:.2f}s: {len(samples)/SR:.2f}s {line}',flush=True)

# Clean narration, subtle short stereo room, score ducking, and master limiting.
vo=filt(filt(vo,85,'highpass'),11000)
vo=np.tanh(vo*1.6)*.72
env=sosfilt(butter(1,5,fs=SR,output='sos'),np.abs(vo))
duck=1-.68*np.clip(env*18,0,1)
score*=duck[:,None]
voice=np.column_stack((vo,vo))
for delay,gain,pan in [(.07,.05,-.7),(.11,.04,.7)]:
    add(voice,vo,delay,gain,pan)
mix=score+voice
mix=np.tanh(mix*1.15)
mix*=.93/max(np.max(np.abs(mix)),.93)
sf.write(str(OUT/'music.wav'),score,SR,subtype='PCM_24')
sf.write(str(OUT/'voiceover.wav'),voice,SR,subtype='PCM_24')
sf.write(str(OUT/'mix.wav'),mix,SR,subtype='PCM_24')
def stamp(x):
    ms=round(x*1000);return f'{ms//3600000:02}:{ms//60000%60:02}:{ms//1000%60:02},{ms%1000:03}'
(OUT/'captions.srt').write_text('\n\n'.join(f'{i+1}\n{stamp(s)} --> {stamp(e)}\n{line}' for i,(s,e,line) in enumerate(subs))+'\n')
print('Audio master complete',flush=True)
