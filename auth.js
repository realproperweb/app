/*  auth.js  -  South Coast Business Hub member sign-in (OAuth 2.0 via Firebase Authentication)
 *  Load from the page <head> with:  <script type="module" src="auth.js"></script>
 *  Part 1: page behaviour (tabs, buttons, messages)  -  always runs
 *  Part 2: Firebase OAuth sign-in                    -  loads from Google; the page still works if it can't
 */

/* ---------------- Part 1: page UI ---------------- */
const REDIRECT_TO='/dashboard';           // where members go after signing in
const PROVIDERS=[                        // enable each one in Firebase Console > Authentication > Sign-in method
 {id:'google',label:'Google',icon:'<svg viewBox="0 0 48 48" width="22" height="22" aria-hidden="true"><path fill="#EA4335" d="M24 9.5c3.5 0 6.6 1.2 9.1 3.6l6.8-6.8C35.8 2.4 30.3 0 24 0 14.6 0 6.5 5.4 2.6 13.2l7.9 6.1C12.4 13.6 17.7 9.5 24 9.5z"/><path fill="#4285F4" d="M46.5 24.5c0-1.6-.1-3.1-.4-4.5H24v9h12.7c-.6 3-2.3 5.5-4.8 7.2l7.6 5.9c4.4-4.1 7-10.1 7-17.6z"/><path fill="#FBBC05" d="M10.5 28.7c-.5-1.4-.8-3-.8-4.7s.3-3.2.8-4.7l-7.9-6.1C.9 16.4 0 20.100 0 24s.9 7.600 2.600 10.800l7.900-6.100z"/><path fill="#34A853" d="M24 48c6.500 0 11.900-2.100 15.900-5.800l-7.600-5.900c-2.100 1.400-4.900 2.300-8.300 2.300-6.300 0-11.600-4.100-13.500-9.800l-7.900 6.100C6.500 42.600 14.600 48 24 48z"/></svg>'},
 {id:'facebook',label:'Facebook',icon:'<svg viewBox="0 0 24 24" width="22" height="22" aria-hidden="true"><path fill="#1877F2" d="M24 12a12 12 0 1 0-13.900 11.900v-8.400H7.100V12h3V9.400c0-3 1.800-4.700 4.500-4.700 1.300 0 2.700.2 2.700.2v3h-1.500c-1.500 0-2 .9-2 1.900V12h3.400l-.5 3.500h-2.900v8.400A12 12 0 0 0 24 12z"/></svg>'},
 {id:'microsoft',label:'Microsoft',icon:'<svg viewBox="0 0 24 24" width="22" height="22" aria-hidden="true"><path fill="#F25022" d="M1 1h10v10H1z"/><path fill="#7FBA00" d="M13 1h10v10H13z"/><path fill="#00A4EF" d="M1 13h10v10H1z"/><path fill="#FFB900" d="M13 13h10v10H13z"/></svg>'},
 {id:'apple',label:'Apple',icon:'<svg viewBox="0 0 24 24" width="22" height="22" fill="currentColor" aria-hidden="true"><path d="M16.4 12.6c0-2.400 2-3.500 2.100-3.600-1.200-1.700-3-1.900-3.600-1.900-1.500-.2-3 .9-3.800.9s-2-.9-3.300-.9c-1.700 0-3.200 1-4.100 2.500-1.800 3-.5 7.500 1.300 10 .8 1.200 1.800 2.600 3.100 2.500 1.300-.1 1.700-.8 3.200-.8s1.900.8 3.200.8 2.200-1.200 3-2.400c.9-1.400 1.300-2.700 1.300-2.800-.1 0-2.400-.9-2.400-3.800zM14 5.500c.7-.8 1.100-1.900 1-3-1 0-2.100.7-2.800 1.500-.6.700-1.200 1.900-1 3 1.100.1 2.100-.6 2.800-1.500z"/></svg>'}
];
const $=id=>document.getElementById(id);
let mode='signup',redirecting=false;
$('provs').innerHTML=PROVIDERS.map(p=>`<button type="button" data-p="${p.id}" class="prov flex items-center justify-center gap-3 rounded-full border-2 border-line bg-paper px-4 py-3 font-bold text-ink hover:border-teal active:scale-[.98] transition">${p.icon}<span class="label">Continue with ${p.label}</span></button>`).join('');
function setMode(m){
  mode=m;const s=m==='signup';
  $('tSignup').setAttribute('aria-selected',s);$('tLogin').setAttribute('aria-selected',!s);
  $('title').textContent=s?'Join the Hub':'Welcome back';
  $('sub').textContent=s?'Create your free member account in seconds.':'Log in to manage your business listing.';
  $('termsRow').hidden=!s;hubUI.error('');
  document.querySelectorAll('.prov .label').forEach((el,i)=>el.textContent=(s?'Sign up with ':'Log in with ')+PROVIDERS[i].label);
}
$('tSignup').onclick=()=>setMode('signup');$('tLogin').onclick=()=>setMode('login');
window.hubUI={
  error(m){const e=$('err');e.textContent=m;e.classList.toggle('hidden',!m)},
  busy(b){document.querySelectorAll('.prov').forEach(x=>x.disabled=b)},
  signedIn(u,isNew,justNow){
    if(!justNow&&redirecting)return;
    $('authCard').hidden=true;$('okCard').hidden=false;
    const name=u.displayName||u.email||'member',first=name.split(/[ @]/)[0];
    $('av').textContent=first.slice(0,1).toUpperCase();
    $('okTitle').textContent=justNow?(isNew?`Welcome, ${first}!`:`Welcome back, ${first}!`):`You’re signed in, ${first}`;
    $('okSub').textContent=u.email||'';
    $('goBtn').href=REDIRECT_TO;$('title').textContent=isNew?'Account created':'Signed in';$('sub').textContent=justNow?'Taking you to your dashboard…':'You’re already logged in.';
    if(justNow&&!redirecting){redirecting=true;setTimeout(()=>{location.href=REDIRECT_TO},1500)}
  },
  signedOut(){$('okCard').hidden=true;$('authCard').hidden=false;setMode(mode)}
};
$('provs').addEventListener('click',e=>{
  const b=e.target.closest('[data-p]');if(!b)return;
  hubUI.error('');
  if(mode==='signup'&&!$('terms').checked){hubUI.error('Please tick the box to agree to the Terms of Use and Privacy Policy.');$('terms').focus();return}
  if(!window.hubAuth){hubUI.error('The sign-in service isn’t available on this page right now. It will work on your live website once the domain is added in Firebase.');return}
  window.hubAuth.signIn(b.dataset.p);
});
$('outBtn').onclick=()=>window.hubAuth&&window.hubAuth.signOut();

const ic=d=>`<svg viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${d}</svg>`;
$('tabs').innerHTML=[['Home','/','<path d="M3 11l9-8 9 8"/><path d="M5 10v10h14V10"/>'],['Directory','/#provinces','<path d="M12 21s-7-6.2-7-11a7 7 0 0114 0c0 4.8-7 11-7 11z"/><circle cx="12" cy="10" r="2.5"/>'],['Account','#','<circle cx="12" cy="8" r="4"/><path d="M4 21a8 8 0 0116 0"/>'],['WhatsApp','https://wa.me/27689124033','<path d="M21 12a9 9 0 01-13.3 7.9L3 21l1.2-4.5A9 9 0 1121 12z"/>']]
 .map(([l,u,i])=>`<a href="${u}"${l==='Account'?' aria-current="page"':''}${l==='WhatsApp'?' target="_blank" rel="noopener"':''} class="tab flex flex-1 flex-col items-center gap-0.5 py-2 text-[11px] font-semibold text-muted">${ic(i)}<span>${l}</span></a>`).join('');
setMode('signup');

/* ---------------- Part 2: Firebase OAuth 2.0 ---------------- */
const FB = 'https://www.gstatic.com/firebasejs/13.0.0/';
try {
  const { initializeApp } = await import(FB + 'firebase-app.js');
  const { getAuth, GoogleAuthProvider, FacebookAuthProvider, OAuthProvider, signInWithPopup, signInWithRedirect, getRedirectResult, onAuthStateChanged, signOut, getAdditionalUserInfo } = await import(FB + 'firebase-auth.js');

  const firebaseConfig = {
    apiKey: "AIzaSyCErN_tprMGbQ_3mHp0MNwPoHqJgNHQtog",
    authDomain: "biz-membership.firebaseapp.com",
    projectId: "biz-membership",
    storageBucket: "biz-membership.firebasestorage.app",
    messagingSenderId: "645617827043",
    appId: "1:645617827043:web:093da27ec5f54c439bd9d6",
    measurementId: "G-B6H5WJZX30"
  };

  const app = initializeApp(firebaseConfig);
  try { const { getAnalytics } = await import(FB + 'firebase-analytics.js'); getAnalytics(app); } catch (e) { /* analytics is optional */ }
  const auth = getAuth(app);

  const make = {
    google: () => { const p = new GoogleAuthProvider(); p.setCustomParameters({ prompt: 'select_account' }); return p; },
    facebook: () => new FacebookAuthProvider(),
    microsoft: () => new OAuthProvider('microsoft.com'),
    apple: () => { const p = new OAuthProvider('apple.com'); p.addScope('email'); p.addScope('name'); return p; }
  };
  const msg = e => ({
    'auth/popup-closed-by-user': '',
    'auth/cancelled-popup-request': '',
    'auth/operation-not-allowed': 'That sign-in method isn’t switched on yet. Please try another one.',
    'auth/unauthorized-domain': 'This website address hasn’t been approved for sign-in yet.',
    'auth/account-exists-with-different-credential': 'You already have an account with this email using a different provider. Please sign in with that one.',
    'auth/network-request-failed': 'Network problem. Please check your connection and try again.'
  }[e.code] ?? 'Sorry, we couldn’t sign you in. Please try again.');

  window.hubAuth = {
    async signIn(id) {
      hubUI.busy(true);
      try {
        const res = await signInWithPopup(auth, make[id]());
        hubUI.signedIn(res.user, getAdditionalUserInfo(res)?.isNewUser, true);
      } catch (e) {
        if (e.code === 'auth/popup-blocked' || e.code === 'auth/operation-not-supported-in-this-environment') {
          await signInWithRedirect(auth, make[id]()); return;
        }
        hubUI.error(msg(e));
      } finally { hubUI.busy(false); }
    },
    signOut: () => signOut(auth)
  };

  getRedirectResult(auth).then(r => { if (r) hubUI.signedIn(r.user, getAdditionalUserInfo(r)?.isNewUser, true); }).catch(e => hubUI.error(msg(e)));
  onAuthStateChanged(auth, u => { u ? hubUI.signedIn(u, false, false) : hubUI.signedOut(); });
} catch (e) {
  console.warn('Firebase sign-in could not be loaded:', e);
}
