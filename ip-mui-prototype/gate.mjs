/**
 * Post-build step: put the prototype behind a passphrase.
 *
 * The JS bundle is encrypted with AES-GCM under a PBKDF2 key and embedded in
 * index.html; the plaintext bundle is deleted. Nothing of the app is served
 * until someone supplies the passphrase, which is the same scheme the surface
 * audit and the migration plan use.
 *
 * This is not access control. The ciphertext is public, so anyone with the
 * passphrase can pass it on, and the usual caveats about client-side gates
 * apply. It keeps the prototype out of search results and away from anyone who
 * happens on the URL, which is what it is for.
 *
 * Runs as part of `npm run build`. Run it twice and it is a no-op, because the
 * plaintext bundle is gone after the first pass.
 */
import fs from 'node:fs'
import path from 'node:path'
import { webcrypto as wc } from 'node:crypto'

const DIST = path.join(import.meta.dirname, 'dist')
const ASSETS = path.join(DIST, 'assets')
const PASSWORD = process.env.IP_PASSPHRASE || 'juniper-fathom-lattice-monsoon-39'
const ITER = 310000

const bundle = fs.readdirSync(ASSETS).find(f => f.endsWith('.js'))
if (!bundle) {
  console.log('gate: no plaintext bundle in dist/assets — already gated, nothing to do')
  process.exit(0)
}

const code = fs.readFileSync(path.join(ASSETS, bundle), 'utf8')

const enc = new TextEncoder()
const salt = wc.getRandomValues(new Uint8Array(16))
const iv = wc.getRandomValues(new Uint8Array(12))
const km = await wc.subtle.importKey('raw', enc.encode(PASSWORD), 'PBKDF2', false, ['deriveKey'])
const key = await wc.subtle.deriveKey(
  { name: 'PBKDF2', salt, iterations: ITER, hash: 'SHA-256' },
  km, { name: 'AES-GCM', length: 256 }, false, ['encrypt'],
)
const ct = await wc.subtle.encrypt({ name: 'AES-GCM', iv }, key, enc.encode(code))
const b64 = b => Buffer.from(b).toString('base64')

const page = `<!doctype html>
<html lang="en">
<head>
<meta charset="UTF-8" />
<meta name="viewport" content="width=device-width, initial-scale=1.0" />
<meta name="robots" content="noindex, nofollow" />
<title>iP prototype — Material UI</title>
<link rel="preconnect" href="https://fonts.googleapis.com" />
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
<link href="https://fonts.googleapis.com/css2?family=Open+Sans:wght@400;600;700&display=swap" rel="stylesheet" />
<style>
  :root { --navy:#3b4960; --rule:#dde0e5; --ink:#171e29; --dim:#7c8797; --blue:#2a6ebb; }
  * { box-sizing:border-box }
  body { margin:0; font-family:'Open Sans',system-ui,sans-serif; color:var(--ink); background:#f7f8f9 }
  #gate { min-height:100vh; display:grid; place-items:center; padding:24px }
  form { width:100%; max-width:380px; background:#fff; border:1px solid var(--rule);
         border-radius:6px; padding:32px }
  .eyebrow { margin:0 0 6px; font-size:12px; font-weight:700; letter-spacing:.08em;
             text-transform:uppercase; color:var(--dim) }
  h1 { margin:0 0 8px; font-size:22px; font-weight:700 }
  .sub { margin:0 0 22px; font-size:14px; line-height:1.5; color:var(--dim) }
  label { display:block; margin-bottom:6px; font-size:13px; font-weight:600 }
  input { width:100%; padding:10px 12px; font:inherit; font-size:14px; color:var(--ink);
          background:#f1f2f3; border:0; border-bottom:1px solid #c4c4c4; border-radius:4px 4px 0 0 }
  input:focus { outline:none; border-bottom:2px solid var(--navy) }
  button { width:100%; margin-top:18px; padding:10px 16px; font:inherit; font-size:14px; font-weight:600;
           color:#fff; background:var(--navy); border:0; border-radius:4px; cursor:pointer }
  button:hover { filter:brightness(1.12) }
  button:disabled { opacity:.6; cursor:default }
  .err, .busy { margin:14px 0 0; font-size:13px }
  .err { color:#b3402f }
  .busy { color:var(--dim) }
</style>
</head>
<body>
<div id="gate">
  <form id="f" autocomplete="off">
    <p class="eyebrow">iP: Intelligence Platform</p>
    <h1>Material UI prototype</h1>
    <p class="sub">A working prototype of iP rebuilt on MUI. Encrypted; same passphrase as the surface audit and the migration plan.</p>
    <label for="pw">Passphrase</label>
    <input id="pw" type="password" autocomplete="off" spellcheck="false" autofocus>
    <button id="go" type="submit">Unlock</button>
    <p id="err" class="err" role="alert" hidden>That passphrase did not work.</p>
    <p id="busy" class="busy" hidden>Decrypting…</p>
  </form>
</div>
<div id="root"></div>
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
    var code=new TextDecoder().decode(plain);
    // The bundle is an ES module, so it has to be loaded as one. A blob URL is
    // the only way to do that from a string without an inline-script CSP hole.
    var url=URL.createObjectURL(new Blob([code],{type:'text/javascript'}));
    var s=document.createElement('script'); s.type='module'; s.src=url;
    document.body.appendChild(s);
    var g=document.getElementById('gate'); if(g) g.remove();
    document.body.style.background='#fff';
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

fs.writeFileSync(path.join(DIST, 'index.html'), page)
fs.unlinkSync(path.join(ASSETS, bundle))
console.log(`gate: encrypted ${bundle} (${Math.round(code.length / 1024)} kB) into index.html and removed the plaintext`)
console.log(`gate: passphrase ${PASSWORD}`)
