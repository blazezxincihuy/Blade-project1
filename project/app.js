var KEY='zhxin-ft-poin-v1',tab='klasemen',cur=0;
var PRIZE=['PP 14.000','PP 7.000','PP 5.000'];
var MAPS=['Bermuda','Purgatory','Kalahari','Alpine','Nextera','Solara'];
var SESI=['14.00','15.00','16.00','19.00','20.00','21.00','22.00','23.00','00.00','01.00'],HK='zhxin-ft-hero-v1';
function def(){return{teams:Array.from({length:12},function(_,i){return{id:i+1,n:'',k:''}}),maps:['Bermuda','Purgatory','Kalahari','Bermuda','Purgatory','Kalahari'],res:{},pts:[12,9,8,7,6,5,4,3,2,1,0,0],kp:1}}
var ALL=null;
try{ALL=JSON.parse(localStorage.getItem(KEY))}catch(e){}
if(ALL&&ALL.teams){var o0=ALL;delete o0.tm;ALL={cur:SESI[0],d:{}};ALL.d[SESI[0]]=o0}
if(!ALL||!ALL.d)ALL={cur:SESI[0],d:{}};
if(SESI.indexOf(ALL.cur)<0)ALL.cur=SESI[0];
function ses(){if(!ALL.d[ALL.cur])ALL.d[ALL.cur]=def();return ALL.d[ALL.cur]}
var S=ses();
function save(){try{localStorage.setItem(KEY,JSON.stringify(ALL))}catch(e){}}
function esc(s){return String(s).replace(/[&<>"]/g,function(c){return{'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]})}
function toast(t){var el=document.getElementById('toast');el.textContent=t;el.className='toast on';setTimeout(function(){el.className='toast'},1800)}
function calc(){
  var rows=S.teams.filter(function(t){return t.n.trim()}).map(function(t){
    var r={t:t,pts:0,k:0,b:0,mp:0};
    S.maps.forEach(function(_,m){var x=(S.res[m]||{})[t.id];if(x&&x.p>0){r.pts+=(S.pts[x.p-1]||0)+(x.k||0)*S.kp;r.k+=x.k||0;if(x.p==1)r.b++;r.mp++}});
    return r});
  rows.sort(function(a,b){return b.pts-a.pts||b.b-a.b||b.k-a.k});
  return rows}
function mpts(m,id){var x=(S.res[m]||{})[id];return x&&x.p>0?(S.pts[x.p-1]||0)+(x.k||0)*S.kp:0}
function nav(){
  var T=[['klasemen','Klasemen'],['match','Input'],['tim','Tim'],['atur','Atur']];var nv=document.getElementById('nav');nv.style.display=ADM?'':'none';if(!ADM)T=[];
  document.getElementById('nav').innerHTML=T.map(function(x){return'<button role="tab" aria-selected="'+(tab==x[0])+'" data-t="'+x[0]+'">'+x[1]+'</button>'}).join('')}
function viewKlasemen(){
  var rows=calc(),done=Object.keys(S.res).filter(function(m){return Object.keys(S.res[m]).length}).length;
  var h='<div class="card lbc"><div class="lbh"><h2>Klasemen · '+ALL.cur+'</h2><span class="m">'+done+'/'+S.maps.length+' match</span></div>';
  if(!rows.length)h+='<div class="empty">Belum ada tim. Isi nama tim di tab Tim.</div>';
  else{h+='<ol class="lbl">';
    rows.forEach(function(r,i){h+='<li class="'+(i<3?'top':'')+'"><span class="no">'+(i+1)+'</span><span class="nm">'+esc(r.t.n)+(r.t.k?'<small>'+esc(r.t.k)+'</small>':'')+'</span><span class="kl">'+r.k+' K'+(r.b?' · '+r.b+'B':'')+'</span><span class="pt">'+r.pts+'</span></li>'});
    h+='</ol>'}
  h+='<div class="acts"><button class="btn" id="cp">Salin untuk WhatsApp</button></div></div>';
  return h}
function viewMatch(){
  var res=S.res[cur]||{},used={};
  Object.keys(res).forEach(function(id){var p=res[id].p;if(p>0)used[p]=(used[p]||0)+1});
  var h='<div class="chips">'+S.maps.map(function(_,i){return'<button class="chip" aria-pressed="'+(i==cur)+'" data-m="'+i+'">Match '+(i+1)+'</button>'}).join('')+'</div>';
  h+='<div class="card"><h2>Match '+(cur+1)+'</h2><div class="row" style="grid-template-columns:auto 1fr"><span class="m">Map</span><select id="map">'+MAPS.map(function(m){return'<option'+(m==S.maps[cur]?' selected':'')+'>'+m+'</option>'}).join('')+'</select></div>';
  if(smp)h+='<div class="scan"><b>Scan screenshot hasil</b><div class="m">Pilih screenshot hasil match, lalu posisi dan kill terisi otomatis. Periksa lagi hasilnya sebelum dipakai.</div><input type="file" id="shots" accept="image/*" multiple><button class="btn" id="scan">Scan dan isi poin</button><div class="m" id="scst">'+esc(scmsg)+'</div></div>';
  var ts=S.teams.filter(function(t){return t.n.trim()});
  if(!ts.length)h+='<div class="empty">Isi nama tim dulu di tab Tim.</div>';
  else{h+='<div class="row r3 m"><span>Tim</span><span>Posisi</span><span>Kill</span><span class="p">Poin</span></div>';
    ts.forEach(function(t){var x=res[t.id]||{p:0,k:0};
      h+='<div class="row r3"><div>'+esc(t.n)+'</div><select data-p="'+t.id+'" class="'+(x.p>0&&used[x.p]>1?'dup':'')+'"><option value="0">–</option>'+S.teams.map(function(_,i){return'<option value="'+(i+1)+'"'+(x.p==i+1?' selected':'')+'>#'+(i+1)+'</option>'}).join('')+'</select><input type="number" min="0" inputmode="numeric" data-k="'+t.id+'" value="'+(x.k||0)+'"><div class="p" id="pt'+t.id+'">'+mpts(cur,t.id)+'</div></div>'});
    h+='<div class="m">Posisi yang dipakai dua tim ditandai merah.</div>'}
  return h+'</div>'}
function viewTim(){
  var h='<div class="card"><h2>Daftar tim ('+S.teams.filter(function(t){return t.n.trim()}).length+'/'+S.teams.length+')</h2>';
  S.teams.forEach(function(t,i){h+='<div class="row r2"><span class="m">'+(i+1)+'</span><input data-n="'+i+'" placeholder="Nama tim" value="'+esc(t.n)+'"><input data-nk="'+i+'" placeholder="Nickname" value="'+esc(t.k)+'"></div>'});
  return h+'<div class="acts" style="align-items:center"><span class="m">Slot tim</span><button class="btn ghost" id="dect" aria-label="Kurangi slot">−</button><b>'+S.teams.length+'</b><button class="btn ghost" id="addt" aria-label="Tambah slot">+</button></div></div>'}
function viewAtur(){
  var h='<div class="card"><h2>Nama turnamen</h2><input id="tname" maxlength="30" placeholder="ZHXIN FT" value="'+esc(TT())+'"><p class="m">Tampil di judul halaman dan teks WhatsApp.</p></div><div class="card"><h2>Poin placement</h2><div class="sc">';
  S.pts.forEach(function(p,i){h+='<div><label>#'+(i+1)+'</label><input type="number" inputmode="numeric" data-sp="'+i+'" value="'+p+'"></div>'});
  h+='<div><label>Per kill</label><input type="number" inputmode="numeric" id="kp" value="'+S.kp+'"></div></div><p class="m">Bawaan: 12, 9, 8, 7, 6, 5, 4, 3, 2, 1, 0, 0 dan 1 poin per kill. Urutan tie: poin, booyah, kill.</p></div>';
  h+='<div class="card"><h2>Jumlah match</h2><div class="acts" style="margin:0"><button class="btn ghost" id="mm">−</button><b style="align-self:center">'+S.maps.length+'</b><button class="btn ghost" id="mp">+</button></div></div>';
  h+='<div class="card"><h2>Akun admin</h2><p class="m">Masuk sebagai '+esc(adm().email||'')+'.</p><div class="acts" style="margin-top:0"><button class="btn ghost" id="achg">Ubah email/password</button><button class="btn ghost" id="aout">Keluar</button></div></div>';
  h+='<div class="card"><h2>Gambar header</h2><p class="m">Pakai gambar Fern pilihanmu (JPG/PNG). Disimpan di perangkat ini saja.</p><div class="thumb" id="thm"></div><div class="acts"><input type="file" id="himg" accept="image/*" style="max-width:240px"><button class="btn ghost" id="hrs">Kembalikan bawaan</button></div></div>';
  if(rconf)h+='<div class="card dup"><h2>Reset turnamen?</h2><p class="m">Semua sesi, tim, match, dan hasil akan dihapus lalu dimulai dari awal. Tindakan ini tidak bisa dibatalkan. Gambar header tidak ikut terhapus.</p><div class="acts"><button class="btn danger" id="rsy">Ya, reset semua</button><button class="btn ghost" id="rsc">Batal</button></div></div>';
  else h+='<div class="card"><h2>Hapus data</h2><p class="m">Menghapus semua tim, match, dan hasil di semua sesi, lalu mengulang turnamen dari awal.</p><button class="btn danger" id="rst">Reset turnamen</button></div>';
  return h}
function sesNav(){document.getElementById('sch').innerHTML=SESI.map(function(j){var d=ALL.d[j],has=d&&Object.keys(d.res).some(function(m){return Object.keys(d.res[m]).length});return'<button class="chip" aria-pressed="'+(j==ALL.cur)+'" data-s="'+j+'">'+j+(has?' •':'')+'</button>'}).join('')}
function render(){if(!ADM&&tab!='klasemen')tab='klasemen';sesNav();nav();hm();ttl();adb();var v={klasemen:viewKlasemen,match:viewMatch,tim:viewTim,atur:viewAtur}[tab];document.getElementById('main').innerHTML=v();if(tab=='atur'){try{var q=localStorage.getItem(HK);if(q)setHero(q)}catch(e){}}}
function hm(){var e=document.getElementById('hm');if(e)e.textContent='Mode squad, '+S.teams.length+' slot, main event setiap hari 14.00–01.00 WIB'}
function setHero(u){var h=document.getElementById('hero'),t=document.getElementById('thm');
  if(u){h.style.setProperty('--himg','url("'+u+'")');h.classList.add('cu');if(t)t.style.backgroundImage='url("'+u+'")'}
  else{h.classList.remove('cu');h.style.removeProperty('--himg');if(t)t.style.backgroundImage=''}}
try{var hv=localStorage.getItem(HK);if(hv)setHero(hv)}catch(e){}
function waText(){var r=calc(),t='*'+TT()+' — KLASEMEN '+ALL.cur+' WIB*\n';r.forEach(function(x,i){t+=(i+1)+'. '+x.t.n+' — '+x.pts+' poin ('+x.k+' kill)\n'});return t}
document.addEventListener('click',function(e){
  var b=e.target.closest('button');if(!b)return;
  if(admClick(b))return;
  if(b.dataset.s){ALL.cur=b.dataset.s;S=ses();cur=0;save();render();return}
  if(b.dataset.t){tab=b.dataset.t;rconf=false;render();window.scrollTo(0,0);return}
  if(b.dataset.m){cur=+b.dataset.m;render();return}
  if(b.id=='cp'){var t=waText();try{navigator.clipboard.writeText(t).then(function(){toast('Klasemen disalin')},function(){toast('Gagal menyalin')})}catch(x){toast('Gagal menyalin')}return}
  if(b.id=='addt'){if(S.teams.length<30){S.teams.push({id:Date.now(),n:'',k:''});while(S.pts.length<S.teams.length)S.pts.push(0);save();render()}else toast('Maksimal 30 slot');return}
  if(b.id=='dect'){if(S.teams.length<=1){toast('Minimal 1 slot');return}
    var lt=S.teams[S.teams.length-1];if(lt.n.trim()&&dconf!==lt.id){dconf=lt.id;toast('Slot terakhir berisi data. Tekan − lagi untuk menghapus');return}dconf=0;
    S.teams.pop();Object.keys(S.res).forEach(function(m){delete S.res[m][lt.id];Object.keys(S.res[m]).forEach(function(id){if(S.res[m][id].p>S.teams.length)S.res[m][id].p=0})});save();render();return}
  if(b.id=='hrs'){try{localStorage.removeItem(HK)}catch(x){}setHero(null);toast('Gambar bawaan dipulihkan');return}
  if(b.id=='mp'){if(S.maps.length<20){S.maps.push('Bermuda');save();render()}return}
  if(b.id=='mm'){if(S.maps.length>1){var l=S.maps.length-1;S.maps.pop();delete S.res[l];if(cur>=S.maps.length)cur=S.maps.length-1;save();render()}return}
  if(b.id=='rst'){rconf=true;render();return}
  if(b.id=='rsc'){rconf=false;render();return}
  if(b.id=='rsy'){rconf=false;ALL={cur:SESI[0],d:{},title:ALL.title};S=ses();cur=0;tab='klasemen';scmsg='';save();render();window.scrollTo(0,0);toast('Turnamen direset dari awal')}
});
document.addEventListener('input',function(e){
  var d=e.target.dataset;
  if(d.n!==undefined){S.teams[d.n].n=e.target.value}
  else if(d.nk!==undefined){S.teams[d.nk].k=e.target.value}
  else if(d.sp!==undefined){S.pts[d.sp]=+e.target.value||0}
  else if(e.target.id=='tname'){ALL.title=e.target.value.slice(0,30);ttl()}
  else if(e.target.id=='kp'){S.kp=+e.target.value||0}
  else if(d.k!==undefined){S.res[cur]=S.res[cur]||{};var x=S.res[cur][d.k]=S.res[cur][d.k]||{p:0,k:0};x.k=Math.max(0,+e.target.value||0);document.getElementById('pt'+d.k).textContent=mpts(cur,d.k)}
  else return;
  save()});
document.addEventListener('change',function(e){
  if(e.target.id=='map'){S.maps[cur]=e.target.value;save();return}
  if(e.target.id=='himg'){heroFile(e.target.files[0]);return}
  if(e.target.dataset.p!==undefined){S.res[cur]=S.res[cur]||{};var x=S.res[cur][e.target.dataset.p]=S.res[cur][e.target.dataset.p]||{p:0,k:0};x.p=+e.target.value;save();render()}
});
function heroFile(f){if(!f)return;var r=new FileReader();r.onload=function(){var im=new Image();im.onload=function(){
  var w=Math.min(1000,im.width),c=document.createElement('canvas');c.width=w;c.height=Math.round(im.height*w/im.width);c.getContext('2d').drawImage(im,0,0,c.width,c.height);
  var u=c.toDataURL('image/jpeg',.82);try{localStorage.setItem(HK,u)}catch(x){toast('Gambar terlalu besar untuk disimpan');}setHero(u);toast('Gambar header diganti')};
  im.onerror=function(){toast('Gambar tidak terbaca')};im.src=r.result};r.readAsDataURL(f)}
var smp=null,scmsg='',busy=false,rconf=false,dconf=0;
var ADM=false,AK='zhxin-ft-admin-v1',amode='';
try{ADM=sessionStorage.getItem('zhxin-adm')=='1'}catch(e){}
function adm(){try{return JSON.parse(localStorage.getItem(AK))||{}}catch(e){return{}}}
if(ADM&&!adm().hash)ADM=false;
function TT(){return(ALL.title||'').trim()||'ZHXIN FT'}
function ttl(){var h=document.getElementById('ttl');if(h)h.textContent=TT();document.title=TT()+' — Penghitung Poin'}
function adb(){var b=document.getElementById('adb');if(b)b.textContent=ADM?'Keluar admin':'Admin'}
function vv(id){var e=document.getElementById(id);return e?e.value:''}
function hx(b){return Array.from(new Uint8Array(b)).map(function(x){return('0'+x.toString(16)).slice(-2)}).join('')}
function rs(){var a=new Uint8Array(16);crypto.getRandomValues(a);return hx(a)}
async function hsh(pw,salt){var k=await crypto.subtle.importKey('raw',new TextEncoder().encode(pw),'PBKDF2',false,['deriveBits']);return hx(await crypto.subtle.deriveBits({name:'PBKDF2',hash:'SHA-256',salt:new TextEncoder().encode(salt),iterations:100000},k,256))}
function cls(){var m=document.getElementById('amod');if(m)m.remove()}
function amod(mode){cls();amode=mode;var a=adm(),h='<div class="amod" id="amod"><div class="card amc"><h2>'+(mode=='login'?'Masuk admin':mode=='setup'?'Buat akun admin':'Ubah akun admin')+'</h2>';
  if(mode=='setup')h+='<div class="m">Belum ada akun admin. Buat email dan password, lalu simpan baik-baik.</div>';
  if(mode=='change')h+='<input id="a_old" type="password" placeholder="Password lama" autocomplete="current-password">';
  h+='<input id="a_em" type="email" placeholder="Email admin" autocomplete="username" value="'+esc(mode=='change'?(a.email||''):'')+'"><input id="a_pw" type="password" placeholder="'+(mode=='login'?'Password':'Password baru (min. 6 karakter)')+'" autocomplete="'+(mode=='login'?'current-password':'new-password')+'">';
  if(mode!='login')h+='<input id="a_pw2" type="password" placeholder="Ulangi password" autocomplete="new-password">';
  h+='<div class="aer" id="a_er"></div><div class="acts" style="margin:0"><button class="btn" id="amok">'+(mode=='login'?'Masuk':'Simpan')+'</button><button class="btn ghost" id="amcl">Batal</button></div></div></div>';
  document.body.insertAdjacentHTML('beforeend',h);setTimeout(function(){var f=document.getElementById(mode=='change'?'a_old':'a_em');if(f)f.focus()},30)}
function login(){ADM=true;try{sessionStorage.setItem('zhxin-adm','1')}catch(e){}cls();render();toast('Mode admin aktif')}
function logout(){ADM=false;try{sessionStorage.removeItem('zhxin-adm')}catch(e){}tab='klasemen';render();toast('Keluar dari mode admin')}
var abusy=false;
async function asub(){if(abusy)return;var er=document.getElementById('a_er');function bad(t){if(er)er.textContent=t}
  if(!window.crypto||!crypto.subtle){bad('Browser ini tidak mendukung penyimpanan password yang aman.');return}
  var em=vv('a_em').trim().toLowerCase(),pw=vv('a_pw'),a=adm();
  if(!/^\S+@\S+\.\S+$/.test(em)){bad('Email tidak valid.');return}
  abusy=true;
  try{
    if(amode=='login'){if(em!=a.email||(await hsh(pw,a.salt))!=a.hash){bad('Email atau password salah.');abusy=false;return}login()}
    else{
      if(amode=='change'&&(await hsh(vv('a_old'),a.salt))!=a.hash){bad('Password lama salah.');abusy=false;return}
      if(pw.length<6){bad('Password minimal 6 karakter.');abusy=false;return}
      if(pw!=vv('a_pw2')){bad('Konfirmasi password tidak sama.');abusy=false;return}
      var sl=rs();localStorage.setItem(AK,JSON.stringify({email:em,salt:sl,hash:await hsh(pw,sl)}));login()}
  }catch(e){bad('Gagal menyimpan. Coba lagi.')}
  abusy=false}
function admClick(b){var i=b.id;
  if(i=='adb'){if(ADM)logout();else amod(adm().hash?'login':'setup');return true}
  if(i=='aout'){logout();return true}
  if(i=='achg'){amod('change');return true}
  if(i=='amok'){asub();return true}
  if(i=='amcl'){cls();return true}
  return false}
document.addEventListener('keydown',function(e){if(e.key=='Escape')cls();if(e.key=='Enter'&&e.target.closest&&e.target.closest('#amod'))asub()});
function scerr(c){return{not_granted:'Izin Claude belum diberikan.',rate_limited:'Terlalu banyak permintaan atau kuota habis. Coba lagi nanti.',image_rejected:'Gambar ditolak. Pakai JPG atau PNG yang lebih kecil.',images_unavailable:'Scan gambar tidak tersedia di tampilan ini.',invalid_json:'Hasil scan tidak terbaca. Coba lagi atau isi manual.',refused:'Gambar tidak bisa diproses.',cancelled:''}[c]||'Scan gagal. Coba lagi atau isi manual.'}
async function scan(){
  if(busy||!smp)return;
  var f=document.getElementById('shots').files;
  if(!f.length){toast('Pilih screenshot dulu');return}
  var ts=S.teams.filter(function(t){return t.n.trim()});
  if(!ts.length){toast('Isi nama tim dulu');return}
  var st=document.getElementById('scst');busy=true;st.textContent='Membaca screenshot...';
  var list=ts.map(function(t){return t.id+' | '+t.n+(t.k?' | '+t.k:'')}).join('\n');
  var q='Ini screenshot hasil akhir match Free Fire mode squad. Baca setiap baris: peringkat tim dan total kill tim. Cocokkan nama tim dengan daftar berikut (format: id | nama | nickname). Nama di gambar bisa terpotong atau sedikit berbeda, pilih yang paling mirip dan lewati tim yang tidak ada di daftar.\n'+list+'\nBalas HANYA JSON array seperti [{"id":1,"place":1,"kills":5}]. Jika ada beberapa gambar, gabungkan barisnya tanpa duplikat. Jangan menebak angka yang tidak terbaca, lewati barisnya.';
  try{
    var out=await smp.json(q,{images:Array.from(f).slice(0,4),modelTier:'default'});
    var n=0,max=S.teams.length;
    (Array.isArray(out)?out:[]).forEach(function(r){
      var t=ts.filter(function(x){return x.id==r.id})[0],p=Math.round(+r.place),k=Math.round(+r.kills);
      if(!t||!(p>=1&&p<=max)||!(k>=0))return;
      S.res[cur]=S.res[cur]||{};S.res[cur][t.id]={p:p,k:k};n++});
    save();scmsg=n?n+' tim terisi dari screenshot. Periksa lagi sebelum menyimpan hasil.':'Tidak ada tim yang cocok. Cek nama tim di tab Tim atau isi manual.';
    busy=false;render()
  }catch(e){busy=false;scmsg=scerr(e&&e.code);var s2=document.getElementById('scst');if(s2)s2.textContent=scmsg}
}
document.addEventListener('click',function(e){if(e.target.id=='scan')scan()});
try{claude.use('sample').then(function(s){smp=s;if(s&&tab=='match')render()},function(){})}catch(e){}
render();
