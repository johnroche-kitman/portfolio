/**
 * Build the gated prototype landing page.
 *
 *   node prototypes/build.mjs
 *
 * `page.html` is the landing page's markup. It is encrypted with AES-GCM under a
 * PBKDF2 key and embedded in `index.html`, which is the only file published —
 * the same scheme the two prototypes use, with the same passphrase and the same
 * sessionStorage key, so unlocking here carries into both apps.
 *
 * This is not access control. The ciphertext is public and anyone with the
 * passphrase can pass it on. It keeps the work out of search results and away
 * from anyone who happens on the URL, which is what it is for.
 */
import fs from 'node:fs'
import path from 'node:path'
import { webcrypto as wc } from 'node:crypto'

const HERE = import.meta.dirname
const PASSWORD = process.env.IP_PASSPHRASE || 'juniper-fathom-lattice-monsoon-39'
const ITER = 310000

const content = fs.readFileSync(path.join(HERE, 'page.html'), 'utf8')

const enc = new TextEncoder()
const salt = wc.getRandomValues(new Uint8Array(16))
const iv = wc.getRandomValues(new Uint8Array(12))
const km = await wc.subtle.importKey('raw', enc.encode(PASSWORD), 'PBKDF2', false, ['deriveKey'])
const key = await wc.subtle.deriveKey(
  { name: 'PBKDF2', salt, iterations: ITER, hash: 'SHA-256' },
  km, { name: 'AES-GCM', length: 256 }, false, ['encrypt'],
)
const ct = await wc.subtle.encrypt({ name: 'AES-GCM', iv }, key, enc.encode(content))
const b64 = b => Buffer.from(b).toString('base64')

const page = `<!doctype html>
<html lang="en">
<head>
<meta charset="UTF-8" />
<meta name="viewport" content="width=device-width, initial-scale=1.0" />
<meta name="robots" content="noindex, nofollow" />
<title>iP prototypes</title>
<link rel="preconnect" href="https://fonts.googleapis.com" />
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
<link href="https://fonts.googleapis.com/css2?family=Open+Sans:wght@400;600;700&display=swap" rel="stylesheet" />
<style>
  :root { --navy:#3b4960; --deep:#1f2d44; --ink:#171e29; --dim:#5f7089;
          --rule:#e8eaed; --wash:#f6f6f6; --blue:#2a6ebb }
  * { box-sizing:border-box }
  body { margin:0; background:#fff; color:var(--ink);
         font-family:'Open Sans',system-ui,-apple-system,sans-serif }

  /* ---- gate */
  #gate { min-height:100vh; display:grid; place-items:center; padding:24px }
  #gate form { width:100%; max-width:380px; background:#fff; border:1px solid var(--rule);
               border-radius:6px; padding:32px }
  #gate .eyebrow { margin:0 0 6px; font-size:12px; font-weight:700; letter-spacing:.08em;
                   text-transform:uppercase; color:var(--dim) }
  #gate h1 { margin:0 0 8px; font-size:22px; font-weight:700 }
  #gate .sub { margin:0 0 22px; font-size:14px; line-height:1.5; color:var(--dim) }
  #gate label { display:block; margin-bottom:6px; font-size:13px; font-weight:600 }
  #gate input { width:100%; padding:10px 12px; font:inherit; font-size:14px; color:var(--ink);
                background:#f1f2f3; border:0; border-bottom:1px solid #c4c4c4; border-radius:4px 4px 0 0 }
  #gate input:focus { outline:none; border-bottom:2px solid var(--navy) }
  #gate button { width:100%; margin-top:18px; padding:10px 16px; font:inherit; font-size:14px;
                 font-weight:600; color:#fff; background:var(--navy); border:0; border-radius:4px;
                 cursor:pointer }
  #gate button:hover { filter:brightness(1.12) }
  #gate button:disabled { opacity:.6; cursor:default }
  #gate .err, #gate .busy { margin:14px 0 0; font-size:13px }
  #gate .err { color:#b11b27 }
  #gate .busy { color:var(--dim) }
  body.gated { background:#f7f8f9 }

  /* ---- page */
  .wrap { max-width:1000px; margin:0 auto; padding:48px 32px 64px }

  /* The two brands, side by side. Kitman only ships the ring mark, so its
     lockup is built here to match Hudl's mark-plus-wordmark and keep the pair
     optically balanced rather than a bare ring beside a full logo. */
  .brands { display:flex; align-items:center; justify-content:center; gap:26px;
            margin:0 0 44px }
  .brand { display:inline-flex; align-items:center; gap:10px }
  .brand-word { font-size:19px; font-weight:700; letter-spacing:-.01em; color:var(--ink) }
  .brand img { display:block }
  .hudl { height:26px; width:auto; display:block }
  .brand-split { width:1px; height:26px; background:var(--rule) }

  @media (max-width:420px) {
    .brands { gap:16px }
    .brand-word { font-size:16px }
  }

  .cards { display:grid; gap:24px; grid-template-columns:repeat(auto-fit, minmax(360px, 1fr)) }
  .card { display:flex; flex-direction:column; border:1px solid var(--rule); border-radius:8px;
          overflow:hidden; text-decoration:none; color:inherit; background:#fff;
          transition:box-shadow .18s, transform .18s }
  .card:hover { box-shadow:0 8px 26px rgba(13,27,48,.13); transform:translateY(-2px) }

  .banner { position:relative; height:120px; display:grid; place-items:center; padding:16px 40px }
  .banner svg { width:100%; height:100%; max-width:220px }
  .banner-a { background:linear-gradient(135deg, #1f2d44 0%, #3b4960 100%) }
  .banner-b { background:linear-gradient(135deg, #163d63 0%, #2a6ebb 100%) }
  .banner-num { position:absolute; top:12px; right:16px; font-size:13px; font-weight:700;
                letter-spacing:.1em; color:rgba(255,255,255,.55) }

  .body { padding:22px 24px 24px; display:flex; flex-direction:column; flex:1 }
  .kicker { margin:0 0 4px; font-size:11px; font-weight:700; letter-spacing:.08em;
            text-transform:uppercase; color:var(--dim) }
  .body h2 { margin:0 0 10px; font-size:19px; font-weight:700 }
  .desc { margin:0 0 16px; font-size:14px; line-height:1.6; color:var(--dim) }

  .features { list-style:none; margin:0 0 22px; padding:0; display:grid; gap:7px }
  .features li { position:relative; padding-left:20px; font-size:13px; line-height:1.5 }
  .features li::before { content:''; position:absolute; left:4px; top:7px; width:6px; height:6px;
                         border-radius:50%; background:var(--blue) }

  .go { margin-top:auto; align-self:flex-start; padding:9px 18px; border-radius:4px;
        background:var(--navy); color:#fff; font-size:14px; font-weight:600 }
  .card:hover .go { filter:brightness(1.12) }

  @media (max-width:520px) {
    .wrap { padding:32px 20px 48px }
    .cards { grid-template-columns:1fr }
  }
</style>
</head>
<body class="gated">
<div id="gate">
  <form id="f" autocomplete="off">
    <p class="eyebrow">iP: Intelligence Platform</p>
    <h1>Prototypes</h1>
    <p class="sub">Sessions: Video, and Individual Development Plans. Encrypted; the same passphrase unlocks both.</p>
    <label for="pw">Passphrase</label>
    <input id="pw" type="password" autocomplete="off" spellcheck="false" autofocus>
    <button id="go" type="submit">Unlock</button>
    <p id="err" class="err" role="alert" hidden>That passphrase did not work.</p>
    <p id="busy" class="busy" hidden>Decrypting…</p>
  </form>
</div>
<div id="app"></div>
<script>
(function(){
  var SALT="${b64(salt)}",IV="${b64(iv)}",CT="${b64(ct)}",ITER=${ITER},KEY='kl_ip_proto';
  function bytes(b){var s=atob(b),a=new Uint8Array(s.length);for(var i=0;i<s.length;i++)a[i]=s.charCodeAt(i);return a}
  var f=document.getElementById('f'),pw=document.getElementById('pw'),
      err=document.getElementById('err'),busy=document.getElementById('busy'),go=document.getElementById('go');
  async function open(phrase){
    var km=await crypto.subtle.importKey('raw',new TextEncoder().encode(phrase),'PBKDF2',false,['deriveKey']);
    var key=await crypto.subtle.deriveKey({name:'PBKDF2',salt:bytes(SALT),iterations:ITER,hash:'SHA-256'},km,
      {name:'AES-GCM',length:256},false,['decrypt']);
    var plain=await crypto.subtle.decrypt({name:'AES-GCM',iv:bytes(IV)},key,bytes(CT));
    document.getElementById('app').innerHTML=new TextDecoder().decode(plain);
    var g=document.getElementById('gate'); if(g) g.remove();
    document.body.className='';
    // The two apps read the same key off the same origin, so unlocking here
    // means neither of them asks again in this tab.
    try{ sessionStorage.setItem(KEY,phrase); }catch(e){}
  }
  f.addEventListener('submit',function(e){
    e.preventDefault(); err.hidden=true; busy.hidden=false; go.disabled=true;
    setTimeout(async function(){
      try{ await open(pw.value); }
      catch(ex){ busy.hidden=true; go.disabled=false; err.hidden=false; pw.select(); }
    },30);
  });
  try{
    var saved=sessionStorage.getItem(KEY);
    if(saved){ busy.hidden=false; open(saved).catch(function(){ busy.hidden=true;
      try{sessionStorage.removeItem(KEY);}catch(e){} }); }
  }catch(e){}
})();
</script>
</body>
</html>
`

fs.writeFileSync(path.join(HERE, 'index.html'), page)
console.log(`landing: encrypted ${Math.round(content.length / 1024)} kB of markup into prototypes/index.html`)
console.log(`landing: passphrase ${PASSWORD}`)
