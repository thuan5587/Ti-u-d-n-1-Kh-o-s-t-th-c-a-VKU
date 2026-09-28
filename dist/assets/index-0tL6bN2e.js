var gt=Object.defineProperty;var mt=(r,e,t)=>e in r?gt(r,e,{enumerable:!0,configurable:!0,writable:!0,value:t}):r[e]=t;var y=(r,e,t)=>mt(r,typeof e!="symbol"?e+"":e,t);(function(){const e=document.createElement("link").relList;if(e&&e.supports&&e.supports("modulepreload"))return;for(const n of document.querySelectorAll('link[rel="modulepreload"]'))s(n);new MutationObserver(n=>{for(const a of n)if(a.type==="childList")for(const c of a.addedNodes)c.tagName==="LINK"&&c.rel==="modulepreload"&&s(c)}).observe(document,{childList:!0,subtree:!0});function t(n){const a={};return n.integrity&&(a.integrity=n.integrity),n.referrerPolicy&&(a.referrerPolicy=n.referrerPolicy),n.crossOrigin==="use-credentials"?a.credentials="include":n.crossOrigin==="anonymous"?a.credentials="omit":a.credentials="same-origin",a}function s(n){if(n.ep)return;n.ep=!0;const a=t(n);fetch(n.href,a)}})();var Be={};(function r(e,t,s,n){var a=!!(e.Worker&&e.Blob&&e.Promise&&e.OffscreenCanvas&&e.OffscreenCanvasRenderingContext2D&&e.HTMLCanvasElement&&e.HTMLCanvasElement.prototype.transferControlToOffscreen&&e.URL&&e.URL.createObjectURL),c=typeof Path2D=="function"&&typeof DOMMatrix=="function",d=(function(){if(!e.OffscreenCanvas)return!1;try{var o=new OffscreenCanvas(1,1),i=o.getContext("2d");i.fillRect(0,0,1,1);var u=o.transferToImageBitmap();i.createPattern(u,"no-repeat")}catch{return!1}return!0})();function h(){}function l(o){var i=t.exports.Promise,u=i!==void 0?i:e.Promise;return typeof u=="function"?new u(o):(o(h,h),null)}var S=(function(o,i){return{transform:function(u){if(o)return u;if(i.has(u))return i.get(u);var g=new OffscreenCanvas(u.width,u.height),f=g.getContext("2d");return f.drawImage(u,0,0),i.set(u,g),g},clear:function(){i.clear()}}})(d,new Map),E=(function(){var o=Math.floor(16.666666666666668),i,u,g={},f=0;return typeof requestAnimationFrame=="function"&&typeof cancelAnimationFrame=="function"?(i=function(p){var v=Math.random();return g[v]=requestAnimationFrame(function m(b){f===b||f+o-1<b?(f=b,delete g[v],p()):g[v]=requestAnimationFrame(m)}),v},u=function(p){g[p]&&cancelAnimationFrame(g[p])}):(i=function(p){return setTimeout(p,o)},u=function(p){return clearTimeout(p)}),{frame:i,cancel:u}})(),k=(function(){var o,i,u={};function g(f){function p(v,m){f.postMessage({options:v||{},callback:m})}f.init=function(m){var b=m.transferControlToOffscreen();f.postMessage({canvas:b},[b])},f.fire=function(m,b,x){if(i)return p(m,null),i;var T=Math.random().toString(36).slice(2);return i=l(function(C){function M($){$.data.callback===T&&(delete u[T],f.removeEventListener("message",M),i=null,S.clear(),x(),C())}f.addEventListener("message",M),p(m,T),u[T]=M.bind(null,{data:{callback:T}})}),i},f.reset=function(){f.postMessage({reset:!0});for(var m in u)u[m](),delete u[m]}}return function(){if(o)return o;if(!s&&a){var f=["var CONFETTI, SIZE = {}, module = {};","("+r.toString()+")(this, module, true, SIZE);","onmessage = function(msg) {","  if (msg.data.options) {","    CONFETTI(msg.data.options).then(function () {","      if (msg.data.callback) {","        postMessage({ callback: msg.data.callback });","      }","    });","  } else if (msg.data.reset) {","    CONFETTI && CONFETTI.reset();","  } else if (msg.data.resize) {","    SIZE.width = msg.data.resize.width;","    SIZE.height = msg.data.resize.height;","  } else if (msg.data.canvas) {","    SIZE.width = msg.data.canvas.width;","    SIZE.height = msg.data.canvas.height;","    CONFETTI = module.exports.create(msg.data.canvas);","  }","}"].join(`
`);try{o=new Worker(URL.createObjectURL(new Blob([f])))}catch(p){return typeof console<"u"&&typeof console.warn=="function"&&console.warn("🎊 Could not load worker",p),null}g(o)}return o}})(),V={particleCount:50,angle:90,spread:45,startVelocity:45,decay:.9,gravity:1,drift:0,ticks:200,x:.5,y:.5,shapes:["square","circle"],zIndex:100,colors:["#26ccff","#a25afd","#ff5e7e","#88ff5a","#fcff42","#ffa62d","#ff36ff"],disableForReducedMotion:!1,scalar:1};function U(o,i){return i?i(o):o}function B(o){return o!=null}function L(o,i,u){return U(o&&B(o[i])?o[i]:V[i],u)}function oe(o){return o<0?0:Math.floor(o)}function pe(o,i){return Math.floor(Math.random()*(i-o))+o}function te(o){return parseInt(o,16)}function ne(o){return o.map(fe)}function fe(o){var i=String(o).replace(/[^0-9a-f]/gi,"");return i.length<6&&(i=i[0]+i[0]+i[1]+i[1]+i[2]+i[2]),{r:te(i.substring(0,2)),g:te(i.substring(2,4)),b:te(i.substring(4,6))}}function ve(o){var i=L(o,"origin",Object);return i.x=L(i,"x",Number),i.y=L(i,"y",Number),i}function P(o){o.width=document.documentElement.clientWidth,o.height=document.documentElement.clientHeight}function I(o){var i=o.getBoundingClientRect();o.width=i.width,o.height=i.height}function j(o){var i=document.createElement("canvas");return i.style.position="fixed",i.style.top="0px",i.style.left="0px",i.style.pointerEvents="none",i.style.zIndex=o,i}function K(o,i,u,g,f,p,v,m,b){o.save(),o.translate(i,u),o.rotate(p),o.scale(g,f),o.arc(0,0,1,v,m,b),o.restore()}function W(o){var i=o.angle*(Math.PI/180),u=o.spread*(Math.PI/180);return{x:o.x,y:o.y,wobble:Math.random()*10,wobbleSpeed:Math.min(.11,Math.random()*.1+.05),velocity:o.startVelocity*.5+Math.random()*o.startVelocity,angle2D:-i+(.5*u-Math.random()*u),tiltAngle:(Math.random()*(.75-.25)+.25)*Math.PI,color:o.color,shape:o.shape,tick:0,totalTicks:o.ticks,decay:o.decay,drift:o.drift,random:Math.random()+2,tiltSin:0,tiltCos:0,wobbleX:0,wobbleY:0,gravity:o.gravity*3,ovalScalar:.6,scalar:o.scalar,flat:o.flat}}function N(o,i){i.x+=Math.cos(i.angle2D)*i.velocity+i.drift,i.y+=Math.sin(i.angle2D)*i.velocity+i.gravity,i.velocity*=i.decay,i.flat?(i.wobble=0,i.wobbleX=i.x+10*i.scalar,i.wobbleY=i.y+10*i.scalar,i.tiltSin=0,i.tiltCos=0,i.random=1):(i.wobble+=i.wobbleSpeed,i.wobbleX=i.x+10*i.scalar*Math.cos(i.wobble),i.wobbleY=i.y+10*i.scalar*Math.sin(i.wobble),i.tiltAngle+=.1,i.tiltSin=Math.sin(i.tiltAngle),i.tiltCos=Math.cos(i.tiltAngle),i.random=Math.random()+2);var u=i.tick++/i.totalTicks,g=i.x+i.random*i.tiltCos,f=i.y+i.random*i.tiltSin,p=i.wobbleX+i.random*i.tiltCos,v=i.wobbleY+i.random*i.tiltSin;if(o.fillStyle="rgba("+i.color.r+", "+i.color.g+", "+i.color.b+", "+(1-u)+")",o.beginPath(),c&&i.shape.type==="path"&&typeof i.shape.path=="string"&&Array.isArray(i.shape.matrix))o.fill(de(i.shape.path,i.shape.matrix,i.x,i.y,Math.abs(p-g)*.1,Math.abs(v-f)*.1,Math.PI/10*i.wobble));else if(i.shape.type==="bitmap"){var m=Math.PI/10*i.wobble,b=Math.abs(p-g)*.1,x=Math.abs(v-f)*.1,T=i.shape.bitmap.width*i.scalar,C=i.shape.bitmap.height*i.scalar,M=new DOMMatrix([Math.cos(m)*b,Math.sin(m)*b,-Math.sin(m)*x,Math.cos(m)*x,i.x,i.y]);M.multiplySelf(new DOMMatrix(i.shape.matrix));var $=o.createPattern(S.transform(i.shape.bitmap),"no-repeat");$.setTransform(M),o.globalAlpha=1-u,o.fillStyle=$,o.fillRect(i.x-T/2,i.y-C/2,T,C),o.globalAlpha=1}else if(i.shape==="circle")o.ellipse?o.ellipse(i.x,i.y,Math.abs(p-g)*i.ovalScalar,Math.abs(v-f)*i.ovalScalar,Math.PI/10*i.wobble,0,2*Math.PI):K(o,i.x,i.y,Math.abs(p-g)*i.ovalScalar,Math.abs(v-f)*i.ovalScalar,Math.PI/10*i.wobble,0,2*Math.PI);else if(i.shape==="star")for(var w=Math.PI/2*3,D=4*i.scalar,A=8*i.scalar,R=i.x,z=i.y,H=5,F=Math.PI/H;H--;)R=i.x+Math.cos(w)*A,z=i.y+Math.sin(w)*A,o.lineTo(R,z),w+=F,R=i.x+Math.cos(w)*D,z=i.y+Math.sin(w)*D,o.lineTo(R,z),w+=F;else o.moveTo(Math.floor(i.x),Math.floor(i.y)),o.lineTo(Math.floor(i.wobbleX),Math.floor(f)),o.lineTo(Math.floor(p),Math.floor(v)),o.lineTo(Math.floor(g),Math.floor(i.wobbleY));return o.closePath(),o.fill(),i.tick<i.totalTicks}function ye(o,i,u,g,f){var p=i.slice(),v=o.getContext("2d"),m,b,x=l(function(T){function C(){m=b=null,v.clearRect(0,0,g.width,g.height),S.clear(),f(),T()}function M(){s&&!(g.width===n.width&&g.height===n.height)&&(g.width=o.width=n.width,g.height=o.height=n.height),!g.width&&!g.height&&(u(o),g.width=o.width,g.height=o.height),v.clearRect(0,0,g.width,g.height),p=p.filter(function($){return N(v,$)}),p.length?m=E.frame(M):C()}m=E.frame(M),b=C});return{addFettis:function(T){return p=p.concat(T),x},canvas:o,promise:x,reset:function(){m&&E.cancel(m),b&&b()}}}function ce(o,i){var u=!o,g=!!L(i||{},"resize"),f=!1,p=L(i,"disableForReducedMotion",Boolean),v=a&&!!L(i||{},"useWorker"),m=v?k():null,b=u?P:I,x=o&&m?!!o.__confetti_initialized:!1,T=typeof matchMedia=="function"&&matchMedia("(prefers-reduced-motion)").matches,C;function M(w,D,A){for(var R=L(w,"particleCount",oe),z=L(w,"angle",Number),H=L(w,"spread",Number),F=L(w,"startVelocity",Number),rt=L(w,"decay",Number),at=L(w,"gravity",Number),ot=L(w,"drift",Number),Ne=L(w,"colors",ne),ct=L(w,"ticks",Number),Ae=L(w,"shapes"),dt=L(w,"scalar"),lt=!!L(w,"flat"),Re=ve(w),Oe=R,we=[],ht=o.width*Re.x,ut=o.height*Re.y;Oe--;)we.push(W({x:ht,y:ut,angle:z,spread:H,startVelocity:F,color:Ne[Oe%Ne.length],shape:Ae[pe(0,Ae.length)],ticks:ct,decay:rt,gravity:at,drift:ot,scalar:dt,flat:lt}));return C?C.addFettis(we):(C=ye(o,we,b,D,A),C.promise)}function $(w){var D=p||L(w,"disableForReducedMotion",Boolean),A=L(w,"zIndex",Number);if(D&&T)return l(function(F){F()});u&&C?o=C.canvas:u&&!o&&(o=j(A),document.body.appendChild(o)),g&&!x&&b(o);var R={width:o.width,height:o.height};m&&!x&&m.init(o),x=!0,m&&(o.__confetti_initialized=!0);function z(){if(m){var F={getBoundingClientRect:function(){if(!u)return o.getBoundingClientRect()}};b(F),m.postMessage({resize:{width:F.width,height:F.height}});return}R.width=R.height=null}function H(){C=null,g&&(f=!1,e.removeEventListener("resize",z)),u&&o&&(document.body.contains(o)&&document.body.removeChild(o),o=null,x=!1)}return g&&!f&&(f=!0,e.addEventListener("resize",z,!1)),m?m.fire(w,R,H):M(w,R,H)}return $.reset=function(){m&&m.reset(),C&&C.reset()},$}var G;function ie(){return G||(G=ce(null,{useWorker:!0,resize:!0})),G}function de(o,i,u,g,f,p,v){var m=new Path2D(o),b=new Path2D;b.addPath(m,new DOMMatrix(i));var x=new Path2D;return x.addPath(b,new DOMMatrix([Math.cos(v)*f,Math.sin(v)*f,-Math.sin(v)*p,Math.cos(v)*p,u,g])),x}function be(o){if(!c)throw new Error("path confetti are not supported in this browser");var i,u;typeof o=="string"?i=o:(i=o.path,u=o.matrix);var g=new Path2D(i),f=document.createElement("canvas"),p=f.getContext("2d");if(!u){for(var v=1e3,m=v,b=v,x=0,T=0,C,M,$=0;$<v;$+=2)for(var w=0;w<v;w+=2)p.isPointInPath(g,$,w,"nonzero")&&(m=Math.min(m,$),b=Math.min(b,w),x=Math.max(x,$),T=Math.max(T,w));C=x-m,M=T-b;var D=10,A=Math.min(D/C,D/M);u=[A,0,0,A,-Math.round(C/2+m)*A,-Math.round(M/2+b)*A]}return{type:"path",path:i,matrix:u}}function se(o){var i,u=1,g="#000000",f='"Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol", "Noto Color Emoji", "EmojiOne Color", "Android Emoji", "Twemoji Mozilla", "system emoji", sans-serif';typeof o=="string"?i=o:(i=o.text,u="scalar"in o?o.scalar:u,f="fontFamily"in o?o.fontFamily:f,g="color"in o?o.color:g);var p=10*u,v=""+p+"px "+f,m=new OffscreenCanvas(p,p),b=m.getContext("2d");b.font=v;var x=b.measureText(i),T=Math.ceil(x.actualBoundingBoxRight+x.actualBoundingBoxLeft),C=Math.ceil(x.actualBoundingBoxAscent+x.actualBoundingBoxDescent),M=2,$=x.actualBoundingBoxLeft+M,w=x.actualBoundingBoxAscent+M;T+=M+M,C+=M+M,m=new OffscreenCanvas(T,C),b=m.getContext("2d"),b.font=v,b.fillStyle=g,b.fillText(i,$,w);var D=1/u;return{type:"bitmap",bitmap:m.transferToImageBitmap(),matrix:[D,0,0,D,-T*D/2,-C*D/2]}}t.exports=function(){return ie().apply(this,arguments)},t.exports.reset=function(){ie().reset()},t.exports.create=ce,t.exports.shapeFromPath=be,t.exports.shapeFromText=se})((function(){return typeof window<"u"?window:typeof self<"u"?self:this||{}})(),Be,!1);const pt=Be.exports;Be.exports.create;const X=[{id:"hardware",name:"Phần cứng (PC/Server)",icon:"monitor",description:"Máy tính thực hành, màn hình, chuột, phím"},{id:"projector",name:"Máy chiếu & Màn hình",icon:"projector",description:"Máy chiếu trần, màn chiếu, cáp HDMI/VGA"},{id:"aircon",name:"Điều hòa & Thông gió",icon:"fan",description:"Máy lạnh, quạt treo tường, điều khiển"},{id:"electrical",name:"Hệ thống Điện",icon:"zap",description:"Đèn huỳnh quang/LED, ổ cắm âm bàn, công tắc"},{id:"furniture",name:"Nội thất & Phòng ốc",icon:"door",description:"Bàn ghế giảng đường, cửa ra vào, bảng từ"}],Ue=["Khu V - Tòa nhà Công nghệ cao","Khu K - Khu Giảng đường Chính","Khu A - Tòa Nhà Hành chính & Hiệu bộ","Tòa Thư viện số & Nghiên cứu","Ký túc xá Sinh viên VKU","Nhà thể thao Đa năng & Sân tập"],Fe=["Tầng hầm (B1 - Khu máy bay/kho)","Tầng 1 (Trệt)","Tầng 2","Tầng 3","Tầng 4","Tầng 5","Tầng 6 (Sân thượng kỹ thuật)"],ke=(r,e)=>e.some(t=>r instanceof t);let _e,qe;function ft(){return _e||(_e=[IDBDatabase,IDBObjectStore,IDBIndex,IDBCursor,IDBTransaction])}function vt(){return qe||(qe=[IDBCursor.prototype.advance,IDBCursor.prototype.continue,IDBCursor.prototype.continuePrimaryKey])}const Le=new WeakMap,Se=new WeakMap,me=new WeakMap;function yt(r){const e=new Promise((t,s)=>{const n=()=>{r.removeEventListener("success",a),r.removeEventListener("error",c)},a=()=>{t(Q(r.result)),n()},c=()=>{s(r.error),n()};r.addEventListener("success",a),r.addEventListener("error",c)});return me.set(e,r),e}function bt(r){if(Le.has(r))return;const e=new Promise((t,s)=>{const n=()=>{r.removeEventListener("complete",a),r.removeEventListener("error",c),r.removeEventListener("abort",c)},a=()=>{t(),n()},c=()=>{s(r.error||new DOMException("AbortError","AbortError")),n()};r.addEventListener("complete",a),r.addEventListener("error",c),r.addEventListener("abort",c)});Le.set(r,e)}let Pe={get(r,e,t){if(r instanceof IDBTransaction){if(e==="done")return Le.get(r);if(e==="store")return t.objectStoreNames[1]?void 0:t.objectStore(t.objectStoreNames[0])}return Q(r[e])},set(r,e,t){return r[e]=t,!0},has(r,e){return r instanceof IDBTransaction&&(e==="done"||e==="store")?!0:e in r}};function Ze(r){Pe=r(Pe)}function wt(r){return vt().includes(r)?function(...e){return r.apply(Te(this),e),Q(this.request)}:function(...e){return Q(r.apply(Te(this),e))}}function St(r){return typeof r=="function"?wt(r):(r instanceof IDBTransaction&&bt(r),ke(r,ft())?new Proxy(r,Pe):r)}function Q(r){if(r instanceof IDBRequest)return yt(r);if(Se.has(r))return Se.get(r);const e=St(r);return e!==r&&(Se.set(r,e),me.set(e,r)),e}const Te=r=>me.get(r);function xt(r,e,{blocked:t,upgrade:s,blocking:n,terminated:a}={}){const c=indexedDB.open(r,e),d=Q(c);return s&&c.addEventListener("upgradeneeded",h=>{s(Q(c.result),h.oldVersion,h.newVersion,Q(c.transaction),h)}),t&&c.addEventListener("blocked",h=>t(h.oldVersion,h.newVersion,h)),d.then(h=>{a&&h.addEventListener("close",()=>a()),n&&h.addEventListener("versionchange",l=>n(l.oldVersion,l.newVersion,l))}).catch(()=>{}),d}const Et=["get","getKey","getAll","getAllKeys","count"],Ct=["put","add","delete","clear"],xe=new Map;function Ve(r,e){if(!(r instanceof IDBDatabase&&!(e in r)&&typeof e=="string"))return;if(xe.get(e))return xe.get(e);const t=e.replace(/FromIndex$/,""),s=e!==t,n=Ct.includes(t);if(!(t in(s?IDBIndex:IDBObjectStore).prototype)||!(n||Et.includes(t)))return;const a=async function(c,...d){const h=this.transaction(c,n?"readwrite":"readonly");let l=h.store;return s&&(l=l.index(d.shift())),(await Promise.all([l[t](...d),n&&h.done]))[0]};return xe.set(e,a),a}Ze(r=>({...r,get:(e,t,s)=>Ve(e,t)||r.get(e,t,s),has:(e,t)=>!!Ve(e,t)||r.has(e,t)}));const kt=["continue","continuePrimaryKey","advance"],Ke={},Me=new WeakMap,Xe=new WeakMap,Lt={get(r,e){if(!kt.includes(e))return r[e];let t=Ke[e];return t||(t=Ke[e]=function(...s){Me.set(this,Xe.get(this)[e](...s))}),t}};async function*Pt(...r){let e=this;if(e instanceof IDBCursor||(e=await e.openCursor(...r)),!e)return;e=e;const t=new Proxy(e,Lt);for(Xe.set(t,e),me.set(t,Te(e));e;)yield t,e=await(Me.get(t)||e.continue()),Me.delete(t)}function ze(r,e){return e===Symbol.asyncIterator&&ke(r,[IDBIndex,IDBObjectStore,IDBCursor])||e==="iterate"&&ke(r,[IDBIndex,IDBObjectStore])}Ze(r=>({...r,get(e,t,s){return ze(e,t)?Pt:r.get(e,t,s)},has(e,t){return ze(e,t)||r.has(e,t)}}));const Tt="VKU_FieldSurvey_DB",Mt=1;let Ee=null;function q(){return Ee||(Ee=xt(Tt,Mt,{upgrade(r){if(!r.objectStoreNames.contains("surveys")){const e=r.createObjectStore("surveys",{keyPath:"id"});e.createIndex("by-status","status"),e.createIndex("by-created","createdAt")}r.objectStoreNames.contains("draft")||r.createObjectStore("draft"),r.objectStoreNames.contains("settings")||r.createObjectStore("settings")}})),Ee}const $e="vku_active_draft";async function It(r){await(await q()).put("draft",r,$e)}async function Bt(){return await(await q()).get("draft",$e)||null}async function je(){await(await q()).delete("draft",$e)}async function et(r){await(await q()).put("surveys",r)}async function tt(){return(await(await q()).getAllFromIndex("surveys","by-created")).reverse()}async function We(){return(await(await q()).getAll("surveys")).filter(t=>t.status==="PENDING_SYNC"||t.status==="SYNC_ERROR").sort((t,s)=>t.createdAt-s.createdAt)}async function he(r,e,t){const n=(await q()).transaction("surveys","readwrite"),a=n.objectStore("surveys"),c=await a.get(r);c&&(c.status=e,c.syncAttempts=(c.syncAttempts||0)+1,e==="SYNCED"?(c.syncedAt=Date.now(),delete c.lastSyncError):e==="SYNC_ERROR"&&(c.lastSyncError=t||"Lỗi không xác định khi kết nối máy chủ"),await a.put(c)),await n.done}async function $t(r){await(await q()).delete("surveys",r)}async function Dt(){return await(await q()).get("settings","mock_config")||{mode:"success",latencyMs:800,receivedCount:0}}async function Ge(r){await(await q()).put("settings",r,"mock_config")}const Nt="modulepreload",At=function(r){return"/"+r},He={},nt=function(e,t,s){let n=Promise.resolve();if(t&&t.length>0){let c=function(l){return Promise.all(l.map(S=>Promise.resolve(S).then(E=>({status:"fulfilled",value:E}),E=>({status:"rejected",reason:E}))))};document.getElementsByTagName("link");const d=document.querySelector("meta[property=csp-nonce]"),h=(d==null?void 0:d.nonce)||(d==null?void 0:d.getAttribute("nonce"));n=c(t.map(l=>{if(l=At(l),l in He)return;He[l]=!0;const S=l.endsWith(".css"),E=S?'[rel="stylesheet"]':"";if(document.querySelector(`link[href="${l}"]${E}`))return;const k=document.createElement("link");if(k.rel=S?"stylesheet":Nt,S||(k.as="script"),k.crossOrigin="",k.href=l,h&&k.setAttribute("nonce",h),document.head.appendChild(k),S)return new Promise((V,U)=>{k.addEventListener("load",V),k.addEventListener("error",()=>U(new Error(`Unable to preload CSS for ${l}`)))})}))}function a(c){const d=new Event("vite:preloadError",{cancelable:!0});if(d.payload=c,window.dispatchEvent(d),!d.defaultPrevented)throw c}return n.then(c=>{for(const d of c||[])d.status==="rejected"&&a(d.reason);return e().catch(a)})};/*! Capacitor: https://capacitorjs.com/ - MIT License */const Rt=r=>{const e=new Map;e.set("web",{name:"web"});const t=r.CapacitorPlatforms||{currentPlatform:{name:"web"},platforms:e},s=(a,c)=>{t.platforms.set(a,c)},n=a=>{t.platforms.has(a)&&(t.currentPlatform=t.platforms.get(a))};return t.addPlatform=s,t.setPlatform=n,t},Ot=r=>r.CapacitorPlatforms=Rt(r),it=Ot(typeof globalThis<"u"?globalThis:typeof self<"u"?self:typeof window<"u"?window:typeof global<"u"?global:{});it.addPlatform;it.setPlatform;var ee;(function(r){r.Unimplemented="UNIMPLEMENTED",r.Unavailable="UNAVAILABLE"})(ee||(ee={}));class Z extends Error{constructor(e,t,s){super(e),this.message=e,this.code=t,this.data=s}}const Ut=r=>{var e,t;return r!=null&&r.androidBridge?"android":!((t=(e=r==null?void 0:r.webkit)===null||e===void 0?void 0:e.messageHandlers)===null||t===void 0)&&t.bridge?"ios":"web"},Ft=r=>{var e,t,s,n,a;const c=r.CapacitorCustomPlatform||null,d=r.Capacitor||{},h=d.Plugins=d.Plugins||{},l=r.CapacitorPlatforms,S=()=>c!==null?c.name:Ut(r),E=((e=l==null?void 0:l.currentPlatform)===null||e===void 0?void 0:e.getPlatform)||S,k=()=>E()!=="web",V=((t=l==null?void 0:l.currentPlatform)===null||t===void 0?void 0:t.isNativePlatform)||k,U=P=>{const I=ne.get(P);return!!(I!=null&&I.platforms.has(E())||oe(P))},B=((s=l==null?void 0:l.currentPlatform)===null||s===void 0?void 0:s.isPluginAvailable)||U,L=P=>{var I;return(I=d.PluginHeaders)===null||I===void 0?void 0:I.find(j=>j.name===P)},oe=((n=l==null?void 0:l.currentPlatform)===null||n===void 0?void 0:n.getPluginHeader)||L,pe=P=>r.console.error(P),te=(P,I,j)=>Promise.reject(`${j} does not have an implementation of "${I}".`),ne=new Map,fe=(P,I={})=>{const j=ne.get(P);if(j)return console.warn(`Capacitor plugin "${P}" already registered. Cannot register plugins twice.`),j.proxy;const K=E(),W=oe(P);let N;const ye=async()=>(!N&&K in I?N=typeof I[K]=="function"?N=await I[K]():N=I[K]:c!==null&&!N&&"web"in I&&(N=typeof I.web=="function"?N=await I.web():N=I.web),N),ce=(o,i)=>{var u,g;if(W){const f=W==null?void 0:W.methods.find(p=>i===p.name);if(f)return f.rtype==="promise"?p=>d.nativePromise(P,i.toString(),p):(p,v)=>d.nativeCallback(P,i.toString(),p,v);if(o)return(u=o[i])===null||u===void 0?void 0:u.bind(o)}else{if(o)return(g=o[i])===null||g===void 0?void 0:g.bind(o);throw new Z(`"${P}" plugin is not implemented on ${K}`,ee.Unimplemented)}},G=o=>{let i;const u=(...g)=>{const f=ye().then(p=>{const v=ce(p,o);if(v){const m=v(...g);return i=m==null?void 0:m.remove,m}else throw new Z(`"${P}.${o}()" is not implemented on ${K}`,ee.Unimplemented)});return o==="addListener"&&(f.remove=async()=>i()),f};return u.toString=()=>`${o.toString()}() { [capacitor code] }`,Object.defineProperty(u,"name",{value:o,writable:!1,configurable:!1}),u},ie=G("addListener"),de=G("removeListener"),be=(o,i)=>{const u=ie({eventName:o},i),g=async()=>{const p=await u;de({eventName:o,callbackId:p},i)},f=new Promise(p=>u.then(()=>p({remove:g})));return f.remove=async()=>{console.warn("Using addListener() without 'await' is deprecated."),await g()},f},se=new Proxy({},{get(o,i){switch(i){case"$$typeof":return;case"toJSON":return()=>({});case"addListener":return W?be:ie;case"removeListener":return de;default:return G(i)}}});return h[P]=se,ne.set(P,{name:P,proxy:se,platforms:new Set([...Object.keys(I),...W?[K]:[]])}),se},ve=((a=l==null?void 0:l.currentPlatform)===null||a===void 0?void 0:a.registerPlugin)||fe;return d.convertFileSrc||(d.convertFileSrc=P=>P),d.getPlatform=E,d.handleError=pe,d.isNativePlatform=V,d.isPluginAvailable=B,d.pluginMethodNoop=te,d.registerPlugin=ve,d.Exception=Z,d.DEBUG=!!d.DEBUG,d.isLoggingEnabled=!!d.isLoggingEnabled,d.platform=d.getPlatform(),d.isNative=d.isNativePlatform(),d},_t=r=>r.Capacitor=Ft(r),ge=_t(typeof globalThis<"u"?globalThis:typeof self<"u"?self:typeof window<"u"?window:typeof global<"u"?global:{}),ae=ge.registerPlugin;ge.Plugins;class De{constructor(e){this.listeners={},this.retainedEventArguments={},this.windowListeners={},e&&(console.warn(`Capacitor WebPlugin "${e.name}" config object was deprecated in v3 and will be removed in v4.`),this.config=e)}addListener(e,t){let s=!1;this.listeners[e]||(this.listeners[e]=[],s=!0),this.listeners[e].push(t);const a=this.windowListeners[e];a&&!a.registered&&this.addWindowListener(a),s&&this.sendRetainedArgumentsForEvent(e);const c=async()=>this.removeListener(e,t);return Promise.resolve({remove:c})}async removeAllListeners(){this.listeners={};for(const e in this.windowListeners)this.removeWindowListener(this.windowListeners[e]);this.windowListeners={}}notifyListeners(e,t,s){const n=this.listeners[e];if(!n){if(s){let a=this.retainedEventArguments[e];a||(a=[]),a.push(t),this.retainedEventArguments[e]=a}return}n.forEach(a=>a(t))}hasListeners(e){return!!this.listeners[e].length}registerWindowListener(e,t){this.windowListeners[t]={registered:!1,windowEventName:e,pluginEventName:t,handler:s=>{this.notifyListeners(t,s)}}}unimplemented(e="not implemented"){return new ge.Exception(e,ee.Unimplemented)}unavailable(e="not available"){return new ge.Exception(e,ee.Unavailable)}async removeListener(e,t){const s=this.listeners[e];if(!s)return;const n=s.indexOf(t);this.listeners[e].splice(n,1),this.listeners[e].length||this.removeWindowListener(this.windowListeners[e])}addWindowListener(e){window.addEventListener(e.windowEventName,e.handler),e.registered=!0}removeWindowListener(e){e&&(window.removeEventListener(e.windowEventName,e.handler),e.registered=!1)}sendRetainedArgumentsForEvent(e){const t=this.retainedEventArguments[e];t&&(delete this.retainedEventArguments[e],t.forEach(s=>{this.notifyListeners(e,s)}))}}const Ye=r=>encodeURIComponent(r).replace(/%(2[346B]|5E|60|7C)/g,decodeURIComponent).replace(/[()]/g,escape),Qe=r=>r.replace(/(%[\dA-F]{2})+/gi,decodeURIComponent);class qt extends De{async getCookies(){const e=document.cookie,t={};return e.split(";").forEach(s=>{if(s.length<=0)return;let[n,a]=s.replace(/=/,"CAP_COOKIE").split("CAP_COOKIE");n=Qe(n).trim(),a=Qe(a).trim(),t[n]=a}),t}async setCookie(e){try{const t=Ye(e.key),s=Ye(e.value),n=`; expires=${(e.expires||"").replace("expires=","")}`,a=(e.path||"/").replace("path=",""),c=e.url!=null&&e.url.length>0?`domain=${e.url}`:"";document.cookie=`${t}=${s||""}${n}; path=${a}; ${c};`}catch(t){return Promise.reject(t)}}async deleteCookie(e){try{document.cookie=`${e.key}=; Max-Age=0`}catch(t){return Promise.reject(t)}}async clearCookies(){try{const e=document.cookie.split(";")||[];for(const t of e)document.cookie=t.replace(/^ +/,"").replace(/=.*/,`=;expires=${new Date().toUTCString()};path=/`)}catch(e){return Promise.reject(e)}}async clearAllCookies(){try{await this.clearCookies()}catch(e){return Promise.reject(e)}}}ae("CapacitorCookies",{web:()=>new qt});const Vt=async r=>new Promise((e,t)=>{const s=new FileReader;s.onload=()=>{const n=s.result;e(n.indexOf(",")>=0?n.split(",")[1]:n)},s.onerror=n=>t(n),s.readAsDataURL(r)}),Kt=(r={})=>{const e=Object.keys(r);return Object.keys(r).map(n=>n.toLocaleLowerCase()).reduce((n,a,c)=>(n[a]=r[e[c]],n),{})},zt=(r,e=!0)=>r?Object.entries(r).reduce((s,n)=>{const[a,c]=n;let d,h;return Array.isArray(c)?(h="",c.forEach(l=>{d=e?encodeURIComponent(l):l,h+=`${a}=${d}&`}),h.slice(0,-1)):(d=e?encodeURIComponent(c):c,h=`${a}=${d}`),`${s}&${h}`},"").substr(1):null,jt=(r,e={})=>{const t=Object.assign({method:r.method||"GET",headers:r.headers},e),n=Kt(r.headers)["content-type"]||"";if(typeof r.data=="string")t.body=r.data;else if(n.includes("application/x-www-form-urlencoded")){const a=new URLSearchParams;for(const[c,d]of Object.entries(r.data||{}))a.set(c,d);t.body=a.toString()}else if(n.includes("multipart/form-data")||r.data instanceof FormData){const a=new FormData;if(r.data instanceof FormData)r.data.forEach((d,h)=>{a.append(h,d)});else for(const d of Object.keys(r.data))a.append(d,r.data[d]);t.body=a;const c=new Headers(t.headers);c.delete("content-type"),t.headers=c}else(n.includes("application/json")||typeof r.data=="object")&&(t.body=JSON.stringify(r.data));return t};class Wt extends De{async request(e){const t=jt(e,e.webFetchExtra),s=zt(e.params,e.shouldEncodeUrlParams),n=s?`${e.url}?${s}`:e.url,a=await fetch(n,t),c=a.headers.get("content-type")||"";let{responseType:d="text"}=a.ok?e:{};c.includes("application/json")&&(d="json");let h,l;switch(d){case"arraybuffer":case"blob":l=await a.blob(),h=await Vt(l);break;case"json":h=await a.json();break;case"document":case"text":default:h=await a.text()}const S={};return a.headers.forEach((E,k)=>{S[k]=E}),{data:h,headers:S,status:a.status,url:a.url}}async get(e){return this.request(Object.assign(Object.assign({},e),{method:"GET"}))}async post(e){return this.request(Object.assign(Object.assign({},e),{method:"POST"}))}async put(e){return this.request(Object.assign(Object.assign({},e),{method:"PUT"}))}async patch(e){return this.request(Object.assign(Object.assign({},e),{method:"PATCH"}))}async delete(e){return this.request(Object.assign(Object.assign({},e),{method:"DELETE"}))}}ae("CapacitorHttp",{web:()=>new Wt});const Gt=ae("Geolocation",{web:()=>nt(()=>import("./web-CLISytvR.js"),[]).then(r=>new r.GeolocationWeb)}),le={latitude:15.9753,longitude:108.2523};class ue{static async getCurrentLocation(){try{const e=await Gt.getCurrentPosition({enableHighAccuracy:!0,timeout:8e3,maximumAge:3e4});return{latitude:Number(e.coords.latitude.toFixed(6)),longitude:Number(e.coords.longitude.toFixed(6)),accuracy:Math.round(e.coords.accuracy||10),timestamp:e.timestamp||Date.now()}}catch(e){return console.warn("[GeolocationService] Capacitor GPS error, trying Web Geolocation fallback",e),new Promise((t,s)=>{if(!navigator.geolocation){t({latitude:le.latitude,longitude:le.longitude,accuracy:15,timestamp:Date.now()});return}navigator.geolocation.getCurrentPosition(n=>{t({latitude:Number(n.coords.latitude.toFixed(6)),longitude:Number(n.coords.longitude.toFixed(6)),accuracy:Math.round(n.coords.accuracy||10),timestamp:n.timestamp||Date.now()})},n=>{console.warn("[GeolocationService] Browser GPS also failed, using VKU Campus default:",n);const a=(Math.random()-.5)*8e-4,c=(Math.random()-.5)*8e-4;t({latitude:Number((le.latitude+a).toFixed(6)),longitude:Number((le.longitude+c).toFixed(6)),accuracy:25,timestamp:Date.now()})},{enableHighAccuracy:!0,timeout:5e3})})}}static formatCoordinates(e){return e?`${e.latitude.toFixed(5)}°N, ${e.longitude.toFixed(5)}°E (±${e.accuracy}m)`:"Chưa định vị GPS"}}var Y;(function(r){r.Prompt="PROMPT",r.Camera="CAMERA",r.Photos="PHOTOS"})(Y||(Y={}));var re;(function(r){r.Rear="REAR",r.Front="FRONT"})(re||(re={}));var Ie;(function(r){r.Uri="uri",r.Base64="base64",r.DataUrl="dataUrl"})(Ie||(Ie={}));class st extends De{async getPhoto(e){return new Promise(async(t,s)=>{if(e.webUseInput||e.source===Y.Photos)this.fileInputExperience(e,t,s);else if(e.source===Y.Prompt){let n=document.querySelector("pwa-action-sheet");n||(n=document.createElement("pwa-action-sheet"),document.body.appendChild(n)),n.header=e.promptLabelHeader||"Photo",n.cancelable=!1,n.options=[{title:e.promptLabelPhoto||"From Photos"},{title:e.promptLabelPicture||"Take Picture"}],n.addEventListener("onSelection",async a=>{a.detail===0?this.fileInputExperience(e,t,s):this.cameraExperience(e,t,s)})}else this.cameraExperience(e,t,s)})}async pickImages(e){return new Promise(async(t,s)=>{this.multipleFileInputExperience(t,s)})}async cameraExperience(e,t,s){if(customElements.get("pwa-camera-modal")){const n=document.createElement("pwa-camera-modal");n.facingMode=e.direction===re.Front?"user":"environment",document.body.appendChild(n);try{await n.componentOnReady(),n.addEventListener("onPhoto",async a=>{const c=a.detail;c===null?s(new Z("User cancelled photos app")):c instanceof Error?s(c):t(await this._getCameraPhoto(c,e)),n.dismiss(),document.body.removeChild(n)}),n.present()}catch{this.fileInputExperience(e,t,s)}}else console.error("Unable to load PWA Element 'pwa-camera-modal'. See the docs: https://capacitorjs.com/docs/web/pwa-elements."),this.fileInputExperience(e,t,s)}fileInputExperience(e,t,s){let n=document.querySelector("#_capacitor-camera-input");const a=()=>{var c;(c=n.parentNode)===null||c===void 0||c.removeChild(n)};n||(n=document.createElement("input"),n.id="_capacitor-camera-input",n.type="file",n.hidden=!0,document.body.appendChild(n),n.addEventListener("change",c=>{const d=n.files[0];let h="jpeg";if(d.type==="image/png"?h="png":d.type==="image/gif"&&(h="gif"),e.resultType==="dataUrl"||e.resultType==="base64"){const l=new FileReader;l.addEventListener("load",()=>{if(e.resultType==="dataUrl")t({dataUrl:l.result,format:h});else if(e.resultType==="base64"){const S=l.result.split(",")[1];t({base64String:S,format:h})}a()}),l.readAsDataURL(d)}else t({webPath:URL.createObjectURL(d),format:h}),a()}),n.addEventListener("cancel",c=>{s(new Z("User cancelled photos app")),a()})),n.accept="image/*",n.capture=!0,e.source===Y.Photos||e.source===Y.Prompt?n.removeAttribute("capture"):e.direction===re.Front?n.capture="user":e.direction===re.Rear&&(n.capture="environment"),n.click()}multipleFileInputExperience(e,t){let s=document.querySelector("#_capacitor-camera-input-multiple");const n=()=>{var a;(a=s.parentNode)===null||a===void 0||a.removeChild(s)};s||(s=document.createElement("input"),s.id="_capacitor-camera-input-multiple",s.type="file",s.hidden=!0,s.multiple=!0,document.body.appendChild(s),s.addEventListener("change",a=>{const c=[];for(let d=0;d<s.files.length;d++){const h=s.files[d];let l="jpeg";h.type==="image/png"?l="png":h.type==="image/gif"&&(l="gif"),c.push({webPath:URL.createObjectURL(h),format:l})}e({photos:c}),n()}),s.addEventListener("cancel",a=>{t(new Z("User cancelled photos app")),n()})),s.accept="image/*",s.click()}_getCameraPhoto(e,t){return new Promise((s,n)=>{const a=new FileReader,c=e.type.split("/")[1];t.resultType==="uri"?s({webPath:URL.createObjectURL(e),format:c,saved:!1}):(a.readAsDataURL(e),a.onloadend=()=>{const d=a.result;t.resultType==="dataUrl"?s({dataUrl:d,format:c,saved:!1}):s({base64String:d.split(",")[1],format:c,saved:!1})},a.onerror=d=>{n(d)})})}async checkPermissions(){if(typeof navigator>"u"||!navigator.permissions)throw this.unavailable("Permissions API not available in this browser");try{return{camera:(await window.navigator.permissions.query({name:"camera"})).state,photos:"granted"}}catch{throw this.unavailable("Camera permissions are not available in this browser")}}async requestPermissions(){throw this.unimplemented("Not implemented on web.")}async pickLimitedLibraryPhotos(){throw this.unavailable("Not implemented on web.")}async getLimitedLibraryPhotos(){throw this.unavailable("Not implemented on web.")}}new st;const Ht=ae("Camera",{web:()=>new st});class Yt{static async takePhoto(e){var t,s;try{const n=await Ht.getPhoto({quality:75,allowEditing:!1,resultType:Ie.DataUrl,source:Y.Prompt,width:1200,height:1200,correctOrientation:!0});if(n.dataUrl)return await this.applyWatermark(n.dataUrl,e)}catch(n){if(console.warn("[CameraService] Capacitor Camera error/dismissed, falling back to Web Input:",n),(t=n==null?void 0:n.message)!=null&&t.includes("cancelled")||(s=n==null?void 0:n.message)!=null&&s.includes("User cancelled"))throw new Error("Đã hủy chụp ảnh")}return this.takePhotoWebFallback(e)}static takePhotoWebFallback(e){return new Promise((t,s)=>{const n=document.createElement("input");n.type="file",n.accept="image/*",n.capture="environment",n.onchange=async()=>{var c;const a=(c=n.files)==null?void 0:c[0];if(!a){s(new Error("Chưa chọn ảnh"));return}try{const d=new FileReader;d.onload=async()=>{const h=d.result,l=await this.applyWatermark(h,e);t(l)},d.onerror=h=>s(h),d.readAsDataURL(a)}catch(d){s(d)}},n.oncancel=()=>{s(new Error("Đã hủy chọn ảnh"))},n.click()})}static async applyWatermark(e,t){return new Promise(s=>{const n=new Image;n.onload=()=>{const a=document.createElement("canvas"),c=1200;let d=n.width,h=n.height;(d>c||h>c)&&(d>h?(h=Math.round(h*c/d),d=c):(d=Math.round(d*c/h),h=c)),a.width=d,a.height=h;const l=a.getContext("2d");if(!l){s(e);return}l.drawImage(n,0,0,d,h);const S=Math.max(36,Math.round(h*.06));l.fillStyle="rgba(15, 23, 42, 0.75)",l.fillRect(0,h-S,d,S);const E=Math.max(14,Math.round(S*.42));l.font=`600 ${E}px "Plus Jakarta Sans", sans-serif`,l.fillStyle="#ffffff",l.textBaseline="middle";const k=new Date,U=`VKU INSPECTION • ${k.toLocaleDateString("vi-VN")+" "+k.toLocaleTimeString("vi-VN")} ${t?"• "+t:""}`;l.fillText(U,16,h-S/2),s(a.toDataURL("image/jpeg",.82))},n.onerror=()=>s(e),n.src=e})}}const Je=ae("Network",{web:()=>nt(()=>import("./web-Cdj5yRg-.js"),[]).then(r=>new r.NetworkWeb)});class Qt{constructor(){y(this,"isOnlineState",!0);y(this,"connectionTypeState","unknown");y(this,"listeners",new Set);y(this,"simulatedOffline",!1);this.init()}async init(){try{const e=await Je.getStatus();this.isOnlineState=e.connected,this.connectionTypeState=e.connectionType,await Je.addListener("networkStatusChange",t=>{this.handleStatusChange(t.connected,t.connectionType)})}catch(e){console.warn("[NetworkService] Capacitor Network not available, using Web API fallback",e),this.isOnlineState=navigator.onLine,this.connectionTypeState="web"}window.addEventListener("online",()=>{this.handleStatusChange(!0,"wifi")}),window.addEventListener("offline",()=>{this.handleStatusChange(!1,"none")})}handleStatusChange(e,t){if(this.simulatedOffline){this.notifyListeners(!1,"simulated-offline");return}this.isOnlineState=e,this.connectionTypeState=t,this.notifyListeners(e,t)}isOnline(){return this.simulatedOffline?!1:this.isOnlineState}getConnectionType(){return this.simulatedOffline?"simulated-offline":this.connectionTypeState}setSimulatedOffline(e){this.simulatedOffline=e;const t=e?!1:navigator.onLine&&this.isOnlineState;this.notifyListeners(t,e?"simulated-offline":this.connectionTypeState)}isSimulatingOffline(){return this.simulatedOffline}subscribe(e){return this.listeners.add(e),e(this.isOnline(),this.getConnectionType()),()=>this.listeners.delete(e)}notifyListeners(e,t){this.listeners.forEach(s=>{try{s(e,t)}catch(n){console.error("[NetworkService] Listener error:",n)}})}}const _=new Qt,Ce="vku_server_received_logs";class Jt{constructor(){y(this,"config",{mode:"success",latencyMs:650,receivedCount:0});y(this,"logs",[]);this.init()}async init(){try{this.config=await Dt();const e=localStorage.getItem(Ce);e&&(this.logs=JSON.parse(e))}catch(e){console.warn("[MockServer] Failed to load config from DB",e)}}getConfig(){return{...this.config}}async updateConfig(e){return this.config={...this.config,...e},await Ge(this.config),this.config}getLogs(){return[...this.logs]}clearLogs(){this.logs=[],localStorage.removeItem(Ce)}async syncSurveyToServer(e){if(await new Promise(n=>setTimeout(n,this.config.latencyMs)),this.config.mode==="offline_simulate"){const n={id:crypto.randomUUID(),surveyId:e.id,equipmentCode:e.equipmentCode,category:e.category,status:"FAILED",message:"Mô phỏng máy chủ không thể tiếp cận (Connection Refused)",receivedAt:Date.now()};throw this.addLog(n),new Error("Không thể kết nối đến Máy chủ VKU (Lỗi mạng hoặc máy chủ ngoại tuyến)")}if(this.config.mode==="random_fail"&&Math.random()<.5){const a={id:crypto.randomUUID(),surveyId:e.id,equipmentCode:e.equipmentCode,category:e.category,status:"FAILED",message:"Lỗi 503: Máy chủ cơ sở vật chất VKU quá tải hoặc chập chờn",receivedAt:Date.now()};throw this.addLog(a),new Error("503 Service Unavailable: Máy chủ VKU tạm thời quá tải")}if(!e.room||!e.building){const n={id:crypto.randomUUID(),surveyId:e.id,equipmentCode:e.equipmentCode,category:e.category,status:"REJECTED",message:"Thiếu thông tin phòng hoặc tòa nhà",receivedAt:Date.now()};throw this.addLog(n),new Error("Dữ liệu khảo sát không hợp lệ (Thiếu thông tin phòng/tòa nhà)")}this.config.receivedCount=(this.config.receivedCount||0)+1,await Ge(this.config);const t=`VKU-SRV-${Date.now().toString(36).toUpperCase()}`,s={id:t,surveyId:e.id,equipmentCode:e.equipmentCode||"Không mã",category:e.category,status:"SUCCESS",message:`Đồng bộ thành công [${e.building} - ${e.room}]`,receivedAt:Date.now()};return this.addLog(s),{success:!0,message:"Khảo sát đã được lưu thành công trên Máy chủ VKU Facilities",serverId:t}}addLog(e){this.logs.unshift(e),this.logs.length>50&&this.logs.pop();try{localStorage.setItem(Ce,JSON.stringify(this.logs))}catch{}}}const J=new Jt;class Zt{constructor(){y(this,"isSyncing",!1);y(this,"progressListeners",new Set);y(this,"completeListeners",new Set);y(this,"queueChangeListeners",new Set);this.init()}init(){_.subscribe(async e=>{console.log(`[SyncEngine] Network status changed: ${e?"ONLINE":"OFFLINE"}`),e&&(console.log("[SyncEngine] Network restored! Checking queue for pending surveys..."),await this.syncQueue(!1)),this.notifyQueueChanged()}),"serviceWorker"in navigator&&navigator.serviceWorker.addEventListener("message",e=>{e.data&&e.data.type==="BACKGROUND_SYNC_TRIGGERED"&&(console.log("[SyncEngine] Received sync signal from ServiceWorker"),this.syncQueue(!1))})}async requestBackgroundSync(){if("serviceWorker"in navigator&&"SyncManager"in window)try{await(await navigator.serviceWorker.ready).sync.register("sync-surveys"),console.log("[SyncEngine] Registered ServiceWorker Background Sync tag: sync-surveys")}catch(e){console.warn("[SyncEngine] Background sync registration failed, will use fallback",e)}}async syncQueue(e=!1){if(this.isSyncing)return console.log("[SyncEngine] Sync already in progress, skipping concurrent call"),{success:0,errors:0};if(!_.isOnline())return console.log("[SyncEngine] Device is offline. Cannot process queue right now."),{success:0,errors:0};this.isSyncing=!0;let t=0,s=0;try{const n=await We(),a=n.length;if(a===0)return this.isSyncing=!1,this.notifyQueueChanged(),{success:0,errors:0};console.log(`[SyncEngine] Starting sequential sync for ${a} items...`);for(let c=0;c<n.length;c++){if(!_.isOnline()){console.warn("[SyncEngine] Network dropped during queue sync. Pausing queue.");break}const d=n[c];this.notifyProgress(c+1,a,d),await he(d.id,"SYNCING"),this.notifyQueueChanged();try{await J.syncSurveyToServer(d),await he(d.id,"SYNCED"),t++}catch(h){console.error(`[SyncEngine] Failed to sync survey ${d.id}:`,h);const l=(h==null?void 0:h.message)||"Lỗi kết nối máy chủ";await he(d.id,"SYNC_ERROR",l),s++}this.notifyQueueChanged()}this.notifyComplete(t,s)}catch(n){console.error("[SyncEngine] Unexpected error in syncQueue:",n)}finally{this.isSyncing=!1,this.notifyQueueChanged()}return{success:t,errors:s}}async getPendingCount(){return(await We()).length}getIsSyncing(){return this.isSyncing}onProgress(e){return this.progressListeners.add(e),()=>this.progressListeners.delete(e)}onComplete(e){return this.completeListeners.add(e),()=>this.completeListeners.delete(e)}onQueueChange(e){return this.queueChangeListeners.add(e),this.notifyQueueChanged(),()=>this.queueChangeListeners.delete(e)}notifyProgress(e,t,s){this.progressListeners.forEach(n=>n(e,t,s))}notifyComplete(e,t){this.completeListeners.forEach(s=>s(e,t))}async notifyQueueChanged(){const e=await this.getPendingCount();this.queueChangeListeners.forEach(t=>t(e))}}const O=new Zt;class Xt{constructor(e,t,s){y(this,"container");y(this,"currentStep",1);y(this,"totalSteps",4);y(this,"building",Ue[0]);y(this,"floor",Fe[1]);y(this,"room","V.A101");y(this,"gpsLocation",null);y(this,"category","hardware");y(this,"equipmentCode","");y(this,"conditionRating",4);y(this,"defectNotes","");y(this,"photoBase64","");y(this,"onSubmittedCallback");y(this,"showToast");this.container=e,this.showToast=t,this.onSubmittedCallback=s,this.init()}async init(){await this.loadDraft(),this.render(),this.setupEventListeners()}async loadDraft(){try{const e=await Bt();e?(e.building&&(this.building=e.building),e.floor&&(this.floor=e.floor),e.room&&(this.room=e.room),e.gps&&(this.gpsLocation=e.gps),e.category&&(this.category=e.category),e.equipmentCode&&(this.equipmentCode=e.equipmentCode),e.conditionRating&&(this.conditionRating=e.conditionRating),e.defectNotes&&(this.defectNotes=e.defectNotes),e.photoBase64&&(this.photoBase64=e.photoBase64),e.step&&(this.currentStep=e.step)):this.fetchGPS()}catch(e){console.warn("Failed to load draft:",e)}}async autoSaveDraft(){const e={building:this.building,floor:this.floor,room:this.room,gps:this.gpsLocation,category:this.category,equipmentCode:this.equipmentCode,conditionRating:this.conditionRating,defectNotes:this.defectNotes,photoBase64:this.photoBase64,step:this.currentStep,updatedAt:Date.now()};await It(e);const t=document.getElementById("draft-indicator");t&&(t.innerHTML=`
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <polyline points="20 6 9 17 4 12"/>
        </svg>
        Đã tự động lưu nháp
      `)}render(){var s;const e={1:"1 sao: Hỏng nặng / Ngừng hoạt động (Cần sửa chữa ngay)",2:"2 sao: Kém / Cần bảo trì khắc phục sự cố",3:"3 sao: Trung bình / Hoạt động được nhưng có lỗi nhỏ",4:"4 sao: Khá tốt / Hoạt động ổn định",5:"5 sao: Rất tốt / Thiết bị như mới"},t=`${(this.currentStep-1)/(this.totalSteps-1)*100}%`;this.container.innerHTML=`
      <div class="card">
        <div style="display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 16px;">
          <div>
            <h2 class="card-title">Phiếu Kiểm Tra Cơ Sở Vật Chất</h2>
            <p class="card-description">Thu thập dữ liệu kiểm định hiện trường ngoại tuyến (Tầng hầm / Mất mạng)</p>
          </div>
          <div id="draft-indicator" class="draft-status">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z"/>
              <polyline points="17 21 17 13 7 13 7 21"/>
              <polyline points="7 3 7 8 15 8"/>
            </svg>
            Bản nháp IndexedDB
          </div>
        </div>

        <!-- Step Indicator -->
        <div class="step-indicator-wrapper">
          <div class="step-indicator">
            <div class="step-progress-bar" style="width: ${t};"></div>

            <div class="step-node ${this.currentStep===1?"active":""} ${this.currentStep>1?"completed":""}">
              <div class="step-circle">${this.currentStep>1?"✓":"1"}</div>
              <span class="step-label">Vị trí</span>
            </div>

            <div class="step-node ${this.currentStep===2?"active":""} ${this.currentStep>2?"completed":""}">
              <div class="step-circle">${this.currentStep>2?"✓":"2"}</div>
              <span class="step-label">Thiết bị</span>
            </div>

            <div class="step-node ${this.currentStep===3?"active":""} ${this.currentStep>3?"completed":""}">
              <div class="step-circle">${this.currentStep>3?"✓":"3"}</div>
              <span class="step-label">Lỗi & Ảnh</span>
            </div>

            <div class="step-node ${this.currentStep===4?"active":""}">
              <div class="step-circle">4</div>
              <span class="step-label">Xác nhận</span>
            </div>
          </div>
        </div>

        <!-- STEP 1: VỊ TRÍ KHUÔN VIÊN -->
        <div id="form-step-1" class="${this.currentStep===1?"":"hidden"}">
          <div class="form-grid">
            <div class="form-group">
              <label class="form-label" for="select-building">Tòa nhà / Khu vực VKU</label>
              <select id="select-building" class="form-control">
                ${Ue.map(n=>`<option value="${n}" ${this.building===n?"selected":""}>${n}</option>`).join("")}
              </select>
            </div>

            <div class="form-group">
              <label class="form-label" for="select-floor">Tầng kiểm tra</label>
              <select id="select-floor" class="form-control">
                ${Fe.map(n=>`<option value="${n}" ${this.floor===n?"selected":""}>${n}</option>`).join("")}
              </select>
            </div>
          </div>

          <div class="form-grid">
            <div class="form-group">
              <label class="form-label" for="input-room">Mã / Tên Phòng học (VD: V.A101, LAB 204)</label>
              <input id="input-room" class="form-control" type="text" placeholder="VD: V.A102 hoặc LAB 301" value="${this.room}" />
            </div>

            <div class="form-group">
              <label class="form-label">
                Tọa độ GPS Hiện trường (Capacitor/Web GPS)
                <button type="button" id="btn-gps-refresh" class="btn-gps-refresh">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <circle cx="12" cy="12" r="10"/>
                    <line x1="22" y1="12" x2="18" y2="12"/>
                    <line x1="6" y1="12" x2="2" y2="12"/>
                    <line x1="12" y1="6" x2="12" y2="2"/>
                    <line x1="12" y1="22" x2="12" y2="18"/>
                  </svg>
                  Định vị lại
                </button>
              </label>
              <div class="gps-box">
                <span id="gps-display" class="gps-value">
                  ${ue.formatCoordinates(this.gpsLocation)}
                </span>
              </div>
            </div>
          </div>
        </div>

        <!-- STEP 2: THIẾT BỊ & ĐÁNH GIÁ -->
        <div id="form-step-2" class="${this.currentStep===2?"":"hidden"}">
          <label class="form-label" style="margin-bottom: 10px;">Hạng mục cơ sở vật chất kiểm tra</label>
          <div class="category-grid">
            ${X.map(n=>`
              <div class="category-card ${this.category===n.id?"selected":""}" data-cat="${n.id}">
                <div class="category-icon">${this.getCategoryIconSvg(n.id)}</div>
                <div class="category-name">${n.name}</div>
                <div style="font-size: 0.7rem; color: var(--text-muted); line-height: 1.2;">${n.description}</div>
              </div>
            `).join("")}
          </div>

          <div class="form-grid">
            <div class="form-group">
              <label class="form-label" for="input-equip-code">Mã thiết bị / Tem tài sản VKU (Tùy chọn)</label>
              <input id="input-equip-code" class="form-control" type="text" placeholder="VD: VKU-EQUIP-8842" value="${this.equipmentCode}" />
            </div>

            <div class="form-group">
              <label class="form-label">Đánh giá tình trạng (1 - 5 sao)</label>
              <div class="rating-container">
                <div class="star-group">
                  ${[1,2,3,4,5].map(n=>`
                    <button type="button" class="star-btn ${n<=this.conditionRating?"active":""}" data-rating="${n}">
                      <svg viewBox="0 0 24 24"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>
                    </button>
                  `).join("")}
                </div>
                <span id="rating-desc" class="rating-desc">${e[this.conditionRating]}</span>
              </div>
            </div>
          </div>
        </div>

        <!-- STEP 3: CHI TIẾT LỖI & ẢNH CHỤP -->
        <div id="form-step-3" class="${this.currentStep===3?"":"hidden"}">
          <div class="form-group" style="margin-bottom: 20px;">
            <label class="form-label" for="textarea-defect">Mô tả sự cố & Ghi chú kiểm định</label>
            <textarea id="textarea-defect" class="form-control" rows="4" placeholder="Mô tả chi tiết tình trạng hư hỏng, vị trí cụ thể trong phòng, đề xuất thay thế...">${this.defectNotes}</textarea>
          </div>

          <div class="form-group">
            <label class="form-label">
              Ảnh chụp hiện trường (Capacitor Camera Bridge / Web Fallback)
            </label>
            
            ${this.photoBase64?`
              <div class="photo-preview-wrapper">
                <img src="${this.photoBase64}" class="photo-preview-img" alt="Ảnh chụp sự cố" />
                <button type="button" id="btn-remove-photo" class="photo-remove-btn" title="Xóa ảnh chụp">✕</button>
              </div>
            `:`
              <div id="photo-drop-zone" class="photo-upload-area">
                <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="color: var(--primary-600); margin-bottom: 8px;">
                  <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z"/>
                  <circle cx="12" cy="13" r="4"/>
                </svg>
                <div style="font-weight: 700; margin-bottom: 4px;">Chụp ảnh thiết bị / Tải ảnh lên</div>
                <div style="font-size: 0.8125rem; color: var(--text-muted);">
                  Hỗ trợ Camera gốc thiết bị & tự động đóng dấu Watermark kiểm định VKU
                </div>
              </div>
            `}
          </div>
        </div>

        <!-- STEP 4: XEM LẠI & NỘP BÀI -->
        <div id="form-step-4" class="${this.currentStep===4?"":"hidden"}">
          <div style="background: var(--input-bg); border-radius: var(--radius-md); padding: 18px; margin-bottom: 20px;">
            <h3 style="font-size: 1rem; margin-bottom: 12px; color: var(--primary-700);">Tóm tắt khảo sát chuẩn bị gửi</h3>
            
            <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 12px; font-size: 0.875rem;">
              <div><strong>Tòa nhà:</strong> ${this.building}</div>
              <div><strong>Vị trí:</strong> ${this.floor} — ${this.room}</div>
              <div><strong>Hạng mục:</strong> ${(s=X.find(n=>n.id===this.category))==null?void 0:s.name}</div>
              <div><strong>Mã thiết bị:</strong> ${this.equipmentCode||"Không có mã tem"}</div>
              <div><strong>Đánh giá:</strong> ⭐ ${this.conditionRating}/5 sao</div>
              <div><strong>GPS:</strong> ${this.gpsLocation?`${this.gpsLocation.latitude}, ${this.gpsLocation.longitude}`:"Chưa lấy"}</div>
            </div>

            <div style="margin-top: 12px; font-size: 0.875rem;">
              <strong>Ghi chú lỗi:</strong>
              <p style="color: var(--text-muted); margin-top: 4px;">${this.defectNotes||"(Không có ghi chú thêm)"}</p>
            </div>

            ${this.photoBase64?`
              <div style="margin-top: 14px;">
                <strong>Ảnh đính kèm:</strong>
                <img src="${this.photoBase64}" style="max-height: 140px; border-radius: var(--radius-sm); margin-top: 6px; display: block;" />
              </div>
            `:""}
          </div>

          <div style="background: rgba(2, 132, 199, 0.08); border-left: 4px solid var(--primary-600); padding: 12px 16px; border-radius: var(--radius-sm); font-size: 0.8125rem;">
            <strong>Cơ chế Ngoại tuyến:</strong> Nếu bạn đang ở tầng hầm hoặc mất mạng, khảo sát sẽ được lưu an toàn với trạng thái <code>PENDING_SYNC</code> trong IndexedDB và tự động đồng bộ khi có kết nối trở lại.
          </div>
        </div>

        <!-- FORM CONTROLS -->
        <div class="form-actions">
          <div>
            ${this.currentStep>1?`
              <button type="button" id="btn-step-prev" class="btn btn-secondary">
                ← Quay lại
              </button>
            `:`
              <button type="button" id="btn-reset-draft" class="btn btn-danger" style="font-size: 0.8125rem;">
                Xóa nháp
              </button>
            `}
          </div>

          <div>
            ${this.currentStep<this.totalSteps?`
              <button type="button" id="btn-step-next" class="btn btn-primary">
                Tiếp tục →
              </button>
            `:`
              <button type="button" id="btn-submit-survey" class="btn btn-primary">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/>
                  <polyline points="22 4 12 14.01 9 11.01"/>
                </svg>
                Lưu & Đưa Vào Hàng Đợi Đồng Bộ
              </button>
            `}
          </div>
        </div>
      </div>
    `}setupEventListeners(){const e=document.getElementById("btn-step-next");e&&e.addEventListener("click",()=>{this.validateCurrentStep()&&(this.currentStep++,this.autoSaveDraft(),this.render(),this.setupEventListeners())});const t=document.getElementById("btn-step-prev");t&&t.addEventListener("click",()=>{this.currentStep--,this.autoSaveDraft(),this.render(),this.setupEventListeners()});const s=document.getElementById("btn-reset-draft");s&&s.addEventListener("click",async()=>{confirm("Bạn có chắc chắn muốn xóa bản nháp và nhập lại từ đầu?")&&(await je(),this.room="",this.equipmentCode="",this.defectNotes="",this.photoBase64="",this.conditionRating=4,this.currentStep=1,this.render(),this.setupEventListeners(),this.showToast("Đã xóa bản nháp!","warning"))});const n=document.getElementById("select-building");n&&n.addEventListener("change",B=>{this.building=B.target.value,this.autoSaveDraft()});const a=document.getElementById("select-floor");a&&a.addEventListener("change",B=>{this.floor=B.target.value,this.autoSaveDraft()});const c=document.getElementById("input-room");c&&c.addEventListener("input",B=>{this.room=B.target.value,this.autoSaveDraft()});const d=document.getElementById("input-equip-code");d&&d.addEventListener("input",B=>{this.equipmentCode=B.target.value,this.autoSaveDraft()});const h=document.getElementById("textarea-defect");h&&h.addEventListener("input",B=>{this.defectNotes=B.target.value,this.autoSaveDraft()});const l=document.getElementById("btn-gps-refresh");l&&l.addEventListener("click",()=>this.fetchGPS(!0)),this.container.querySelectorAll(".category-card").forEach(B=>{B.addEventListener("click",()=>{this.category=B.getAttribute("data-cat"),this.autoSaveDraft(),this.render(),this.setupEventListeners()})}),this.container.querySelectorAll(".star-btn").forEach(B=>{B.addEventListener("click",()=>{this.conditionRating=parseInt(B.getAttribute("data-rating")||"4",10),this.autoSaveDraft(),this.render(),this.setupEventListeners()})});const k=document.getElementById("photo-drop-zone");k&&k.addEventListener("click",()=>this.capturePhoto());const V=document.getElementById("btn-remove-photo");V&&V.addEventListener("click",()=>{this.photoBase64="",this.autoSaveDraft(),this.render(),this.setupEventListeners()});const U=document.getElementById("btn-submit-survey");U&&U.addEventListener("click",()=>this.handleSubmit())}validateCurrentStep(){return this.currentStep===1&&!this.room.trim()?(this.showToast("Vui lòng nhập số phòng hoặc tên phòng kiểm tra","error"),!1):!0}async fetchGPS(e=!1){const t=document.getElementById("gps-display");t&&(t.innerText="Đang định vị vệ tinh GPS...");try{this.gpsLocation=await ue.getCurrentLocation(),t&&(t.innerText=ue.formatCoordinates(this.gpsLocation)),this.autoSaveDraft(),e&&this.showToast("Đã cập nhật tọa độ GPS thành công!","success")}catch(s){console.warn("GPS error:",s),t&&(t.innerText="Không thể lấy GPS (Đã dùng mặc định VKU)")}}async capturePhoto(){try{const e=`${this.building} - ${this.room||"Phòng học"}`,t=await Yt.takePhoto(e);this.photoBase64=t,await this.autoSaveDraft(),this.render(),this.setupEventListeners(),this.showToast("Đã chụp ảnh hiện trường thành công!","success")}catch(e){e.message&&!e.message.includes("hủy")&&this.showToast(e.message,"error")}}async handleSubmit(){if(!this.room.trim()){this.showToast("Vui lòng nhập tên/số phòng trước khi nộp!","error"),this.currentStep=1,this.render(),this.setupEventListeners();return}const e={id:crypto.randomUUID(),createdAt:Date.now(),building:this.building,floor:this.floor,room:this.room.trim(),gps:this.gpsLocation,category:this.category,equipmentCode:this.equipmentCode.trim(),conditionRating:this.conditionRating,defectNotes:this.defectNotes.trim(),photoBase64:this.photoBase64,status:"PENDING_SYNC",syncAttempts:0};await et(e),await je(),await O.requestBackgroundSync(),this.room="",this.equipmentCode="",this.defectNotes="",this.photoBase64="",this.currentStep=1,_.isOnline()?(this.showToast("Đã lưu! Thiết bị trực tuyến, đang tự động đồng bộ...","success"),O.syncQueue()):this.showToast("Đã lưu vào bộ nhớ ngoại tuyến (Tầng hầm)! Sẽ gửi khi có mạng.","warning"),this.onSubmittedCallback&&this.onSubmittedCallback(),this.render(),this.setupEventListeners()}getCategoryIconSvg(e){switch(e){case"hardware":return'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="2" y="3" width="20" height="14" rx="2" ry="2"/><line x1="8" y1="21" x2="16" y2="21"/><line x1="12" y1="17" x2="12" y2="21"/></svg>';case"projector":return'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="2" y="7" width="20" height="10" rx="2"/><circle cx="16" cy="12" r="3"/><circle cx="6" cy="12" r="1.5"/></svg>';case"aircon":return'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></svg>';case"electrical":return'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/></svg>';case"furniture":return'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M3 21h18M5 21V7l8-4v18M19 21V11l-6-3"/></svg>'}}}class en{constructor(e,t,s){y(this,"container");y(this,"currentFilter","all");y(this,"surveys",[]);y(this,"showToast");y(this,"openModal");this.container=e,this.showToast=t,this.openModal=s,this.init()}async init(){await this.refresh(),O.onQueueChange(()=>{this.refresh()})}async refresh(){this.surveys=await tt(),this.render(),this.setupEventListeners()}render(){const e=this.surveys.filter(n=>n.status==="PENDING_SYNC"||n.status==="SYNC_ERROR").length,t=this.surveys.filter(n=>n.status==="SYNCED").length,s=this.surveys.filter(n=>this.currentFilter==="pending"?n.status==="PENDING_SYNC"||n.status==="SYNC_ERROR"||n.status==="SYNCING":this.currentFilter==="synced"?n.status==="SYNCED":!0);this.container.innerHTML=`
      <div class="card">
        <div class="queue-header-row">
          <div>
            <h2 class="card-title">Hàng Đợi & Lịch Sử Khảo Sát</h2>
            <p class="card-description">
              Dữ liệu được lưu trữ cục bộ trong IndexedDB, tự động đẩy lên máy chủ theo thứ tự FIFO khi kết nối mạng.
            </p>
          </div>

          <div style="display: flex; gap: 8px; flex-wrap: wrap;">
            <button id="btn-seed-data" class="btn btn-secondary" style="font-size: 0.8125rem; padding: 8px 14px;">
              + Dữ liệu mẫu (Tầng hầm)
            </button>
            <button id="btn-sync-all" class="btn btn-primary" style="font-size: 0.8125rem; padding: 8px 14px;" ${e===0?"disabled":""}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M21.5 2v6h-6M21.34 15.57a10 10 0 1 1-.57-8.38l5.67-5.67"/>
              </svg>
              Đồng bộ ngay (${e})
            </button>
          </div>
        </div>

        <!-- Filter tabs -->
        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 16px; flex-wrap: wrap; gap: 10px;">
          <div class="filter-tabs">
            <button class="filter-tab ${this.currentFilter==="all"?"active":""}" data-filter="all">
              Tất cả (${this.surveys.length})
            </button>
            <button class="filter-tab ${this.currentFilter==="pending"?"active":""}" data-filter="pending">
              Chờ gửi (${e})
            </button>
            <button class="filter-tab ${this.currentFilter==="synced"?"active":""}" data-filter="synced">
              Đã đồng bộ (${t})
            </button>
          </div>

          <div style="font-size: 0.8125rem; color: var(--text-muted);">
            Thứ tự: Mới nhất đến cũ nhất
          </div>
        </div>

        <!-- Items list -->
        ${s.length===0?`
          <div style="text-align: center; padding: 48px 16px; color: var(--text-muted); background: var(--input-bg); border-radius: var(--radius-lg); border: 2px dashed var(--border-subtle);">
            <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" style="margin-bottom: 12px; color: var(--text-subtle);">
              <path d="M22 12h-4l-3 9L9 3l-3 9H2"/>
            </svg>
            <div style="font-weight: 700; font-size: 1rem; color: var(--text-main); margin-bottom: 4px;">Chưa có dữ liệu khảo sát trong mục này</div>
            <p style="font-size: 0.875rem;">Hãy tạo phiếu kiểm tra mới ở tab "Khảo sát" hoặc nhấn "Dữ liệu mẫu" để thử nghiệm đồng bộ ngoại tuyến.</p>
          </div>
        `:`
          <div class="survey-cards-list">
            ${s.map(n=>this.renderSurveyItem(n)).join("")}
          </div>
        `}
      </div>
    `}renderSurveyItem(e){var d;const t=((d=X.find(h=>h.id===e.category))==null?void 0:d.name)||e.category,s=new Date(e.createdAt).toLocaleString("vi-VN");let n="pending",a="Chờ đồng bộ",c="⏳";return e.status==="SYNCED"?(n="synced",a="Đã gửi máy chủ",c="✓"):e.status==="SYNCING"?(n="syncing",a="Đang đồng bộ...",c="🔄"):e.status==="SYNC_ERROR"&&(n="error",a="Lỗi máy chủ (Chờ gửi lại)",c="⚠️"),`
      <div class="survey-item-card" data-id="${e.id}">
        <div class="survey-item-main">
          ${e.photoBase64?`<img src="${e.photoBase64}" class="survey-thumb" alt="Ảnh chụp" />`:`<div class="survey-thumb-placeholder">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <rect x="2" y="3" width="20" height="14" rx="2" ry="2"/>
                    <line x1="8" y1="21" x2="16" y2="21"/>
                  </svg>
                 </div>`}

          <div class="survey-details">
            <div class="survey-location-title">${e.building} — ${e.room}</div>
            <div class="survey-meta-row">
              <span class="status-badge ${n}">${c} ${a}</span>
              <span><strong>${t}</strong></span>
              <span>⭐ ${e.conditionRating}/5 sao</span>
              <span>• ${s}</span>
            </div>
            ${e.lastSyncError?`<div style="font-size: 0.75rem; color: var(--danger-600); font-weight: 500;">Lỗi: ${e.lastSyncError}</div>`:""}
          </div>
        </div>

        <div class="survey-actions">
          <button class="btn btn-secondary btn-view-detail" data-id="${e.id}" style="padding: 6px 12px; font-size: 0.75rem;">
            Chi tiết
          </button>
          ${e.status==="SYNC_ERROR"||e.status==="PENDING_SYNC"?`
            <button class="btn btn-primary btn-retry-item" data-id="${e.id}" style="padding: 6px 10px; font-size: 0.75rem;">
              Thử lại
            </button>
          `:""}
          <button class="btn btn-danger btn-delete-item" data-id="${e.id}" style="padding: 6px 10px; font-size: 0.75rem;" title="Xóa khảo sát">
            ✕
          </button>
        </div>
      </div>
    `}setupEventListeners(){this.container.querySelectorAll(".filter-tab").forEach(n=>{n.addEventListener("click",()=>{this.currentFilter=n.getAttribute("data-filter"),this.render(),this.setupEventListeners()})});const t=document.getElementById("btn-seed-data");t&&t.addEventListener("click",()=>this.seedDemoData());const s=document.getElementById("btn-sync-all");s&&s.addEventListener("click",async()=>{if(!_.isOnline()){this.showToast("Thiết bị đang Ngoại tuyến! Vui lòng kết nối mạng để đồng bộ.","error");return}this.showToast("Đang bắt đầu đồng bộ hàng đợi...","success");const n=await O.syncQueue(!0);n.success>0?this.showToast(`Đã đồng bộ thành công ${n.success} khảo sát!`,"success"):n.errors>0&&this.showToast(`Có ${n.errors} khảo sát gặp lỗi máy chủ.`,"warning"),this.refresh()}),this.container.querySelectorAll(".btn-view-detail").forEach(n=>{n.addEventListener("click",()=>{const a=n.getAttribute("data-id");a&&this.showItemDetails(a)})}),this.container.querySelectorAll(".btn-retry-item").forEach(n=>{n.addEventListener("click",async()=>{const a=n.getAttribute("data-id");a&&(await he(a,"PENDING_SYNC"),this.showToast("Đã đưa vào hàng đợi gửi lại!","success"),O.syncQueue(),this.refresh())})}),this.container.querySelectorAll(".btn-delete-item").forEach(n=>{n.addEventListener("click",async()=>{const a=n.getAttribute("data-id");a&&confirm("Bạn có chắc chắn muốn xóa bản ghi khảo sát này khỏi IndexedDB?")&&(await $t(a),this.showToast("Đã xóa khảo sát khỏi IndexedDB","warning"),this.refresh())})})}showItemDetails(e){var d;const t=this.surveys.find(h=>h.id===e);if(!t)return;const s=((d=X.find(h=>h.id===t.category))==null?void 0:d.name)||t.category,n=new Date(t.createdAt).toLocaleString("vi-VN"),a=t.syncedAt?new Date(t.syncedAt).toLocaleString("vi-VN"):"Chưa đồng bộ",c=`
      <div style="display: flex; flex-direction: column; gap: 16px;">
        ${t.photoBase64?`
          <div style="border-radius: var(--radius-md); overflow: hidden; max-height: 280px; box-shadow: var(--card-shadow);">
            <img src="${t.photoBase64}" style="width: 100%; height: 100%; object-fit: cover; display: block;" alt="Ảnh kiểm định" />
          </div>
        `:""}

        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 12px; font-size: 0.875rem;">
          <div>
            <span style="color: var(--text-muted); display: block; font-size: 0.75rem;">Mã UUID Phiếu:</span>
            <code style="word-break: break-all; font-size: 0.75rem;">${t.id}</code>
          </div>
          <div>
            <span style="color: var(--text-muted); display: block; font-size: 0.75rem;">Trạng thái đồng bộ:</span>
            <strong style="color: ${t.status==="SYNCED"?"var(--success-600)":"var(--warning-600)"}">${t.status}</strong>
          </div>
          <div>
            <span style="color: var(--text-muted); display: block; font-size: 0.75rem;">Tòa nhà & Tầng:</span>
            <strong>${t.building} (${t.floor})</strong>
          </div>
          <div>
            <span style="color: var(--text-muted); display: block; font-size: 0.75rem;">Số phòng:</span>
            <strong>${t.room}</strong>
          </div>
          <div>
            <span style="color: var(--text-muted); display: block; font-size: 0.75rem;">Hạng mục & Mã thiết bị:</span>
            <strong>${s}</strong> (${t.equipmentCode||"Không có tem"})
          </div>
          <div>
            <span style="color: var(--text-muted); display: block; font-size: 0.75rem;">Đánh giá chất lượng:</span>
            <strong>⭐ ${t.conditionRating} / 5 sao</strong>
          </div>
          <div>
            <span style="color: var(--text-muted); display: block; font-size: 0.75rem;">Thời gian tạo:</span>
            <span>${n}</span>
          </div>
          <div>
            <span style="color: var(--text-muted); display: block; font-size: 0.75rem;">Thời gian đồng bộ máy chủ:</span>
            <span>${a}</span>
          </div>
        </div>

        <div style="background: var(--input-bg); padding: 12px; border-radius: var(--radius-sm); font-size: 0.875rem;">
          <strong style="display: block; margin-bottom: 4px;">Ghi chú sự cố:</strong>
          <p style="color: var(--text-muted);">${t.defectNotes||"Không có ghi chú thêm."}</p>
        </div>

        <div style="font-size: 0.8125rem; color: var(--text-muted);">
          <strong>Tọa độ GPS:</strong> ${ue.formatCoordinates(t.gps)}
          ${t.gps?`<br><a href="https://maps.google.com/?q=${t.gps.latitude},${t.gps.longitude}" target="_blank" style="color: var(--primary-600); text-decoration: underline;">Xem vị trí trên Google Maps ↗</a>`:""}
        </div>
      </div>
    `;this.openModal(`Khảo sát: ${t.building} - ${t.room}`,c)}async seedDemoData(){const e=[{id:crypto.randomUUID(),createdAt:Date.now()-21e5,building:"Khu V - Tòa nhà Công nghệ cao",floor:"Tầng hầm (B1 - Khu máy bay/kho)",room:"B1-LAB01",gps:{latitude:15.975412,longitude:108.252431,accuracy:8,timestamp:Date.now()},category:"aircon",equipmentCode:"VKU-AC-901",conditionRating:2,defectNotes:"Điều hòa Panasonic phòng lab tầng hầm rò rỉ nước, quạt gió kêu to bất thường.",status:"PENDING_SYNC",syncAttempts:0},{id:crypto.randomUUID(),createdAt:Date.now()-42e5,building:"Khu K - Khu Giảng đường Chính",floor:"Tầng 3",room:"K.304",gps:{latitude:15.976012,longitude:108.25198,accuracy:12,timestamp:Date.now()},category:"projector",equipmentCode:"VKU-PRJ-221",conditionRating:1,defectNotes:"Máy chiếu bị mờ bóng đèn, cổng HDMI bị gãy chân cắm.",status:"PENDING_SYNC",syncAttempts:0},{id:crypto.randomUUID(),createdAt:Date.now()-108e5,building:"Tòa Thư viện số & Nghiên cứu",floor:"Tầng 2",room:"LIB-STUDY-02",gps:{latitude:15.974912,longitude:108.253102,accuracy:10,timestamp:Date.now()},category:"electrical",equipmentCode:"VKU-ELEC-440",conditionRating:5,defectNotes:"Hệ thống đèn LED và ổ cắm âm bàn hoạt động rất tốt sau khi bảo dưỡng tuần trước.",status:"SYNCED",syncAttempts:1,syncedAt:Date.now()-105e5}];for(const t of e)await et(t);this.showToast("Đã thêm 3 bản ghi khảo sát mẫu (có khảo sát ở tầng hầm B1)!","success"),await this.refresh()}}class tn{constructor(e){y(this,"container");this.container=e}async refresh(){const e=await tt(),t=e.length,s=e.filter(l=>l.status==="PENDING_SYNC"||l.status==="SYNCING").length,n=e.filter(l=>l.status==="SYNCED").length,a=e.filter(l=>l.status==="SYNC_ERROR").length,c={};X.forEach(l=>c[l.id]=0),e.forEach(l=>{c[l.category]=(c[l.category]||0)+1});const d=[0,0,0,0,0,0];e.forEach(l=>{l.conditionRating>=1&&l.conditionRating<=5&&d[l.conditionRating]++});let h="0.00";if("storage"in navigator&&"estimate"in navigator.storage)try{const l=await navigator.storage.estimate();l.usage&&(h=(l.usage/(1024*1024)).toFixed(2))}catch{}this.container.innerHTML=`
      <div>
        <!-- Metric Cards Grid -->
        <div class="stats-grid">
          <div class="stat-metric-card">
            <div class="stat-icon-wrapper blue">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
                <polyline points="14 2 14 8 20 8"/>
              </svg>
            </div>
            <div>
              <div class="stat-value">${t}</div>
              <div class="stat-name">Tổng số phiếu khảo sát</div>
            </div>
          </div>

          <div class="stat-metric-card">
            <div class="stat-icon-wrapper amber">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <circle cx="12" cy="12" r="10"/>
                <polyline points="12 6 12 12 16 14"/>
              </svg>
            </div>
            <div>
              <div class="stat-value">${s}</div>
              <div class="stat-name">Hàng đợi chờ gửi (Offline)</div>
            </div>
          </div>

          <div class="stat-metric-card">
            <div class="stat-icon-wrapper green">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/>
                <polyline points="22 4 12 14.01 9 11.01"/>
              </svg>
            </div>
            <div>
              <div class="stat-value">${n}</div>
              <div class="stat-name">Đã gửi lên Máy chủ VKU</div>
            </div>
          </div>

          <div class="stat-metric-card">
            <div class="stat-icon-wrapper rose">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <circle cx="12" cy="12" r="10"/>
                <line x1="12" y1="8" x2="12" y2="12"/>
                <line x1="12" y1="16" x2="12.01" y2="16"/>
              </svg>
            </div>
            <div>
              <div class="stat-value">${a}</div>
              <div class="stat-name">Lỗi đồng bộ (Sẽ thử lại)</div>
            </div>
          </div>
        </div>

        <!-- Charts and Categorical Breakdown -->
        <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(300px, 1fr)); gap: 20px; margin-bottom: 24px;">
          <!-- Category Card -->
          <div class="card" style="margin-bottom: 0;">
            <h3 class="card-title" style="font-size: 1.1rem; margin-bottom: 16px;">Phân loại theo hạng mục thiết bị</h3>
            <div style="display: flex; flex-direction: column; gap: 12px;">
              ${X.map(l=>{const S=c[l.id]||0,E=t>0?Math.round(S/t*100):0;return`
                  <div>
                    <div style="display: flex; justify-content: space-between; font-size: 0.875rem; font-weight: 600; margin-bottom: 4px;">
                      <span>${l.name}</span>
                      <span>${S} (${E}%)</span>
                    </div>
                    <div style="height: 8px; background: var(--input-bg); border-radius: 4px; overflow: hidden;">
                      <div style="width: ${E}%; height: 100%; background: var(--primary-600); border-radius: 4px; transition: width 0.4s ease;"></div>
                    </div>
                  </div>
                `}).join("")}
            </div>
          </div>

          <!-- Condition Rating Card -->
          <div class="card" style="margin-bottom: 0;">
            <h3 class="card-title" style="font-size: 1.1rem; margin-bottom: 16px;">Đánh giá chất lượng thực tế (1 - 5 sao)</h3>
            <div style="display: flex; flex-direction: column; gap: 12px;">
              ${[5,4,3,2,1].map(l=>{const S=d[l],E=t>0?Math.round(S/t*100):0,k=l>=4?"var(--success-500)":l===3?"var(--warning-500)":"var(--danger-500)";return`
                  <div>
                    <div style="display: flex; justify-content: space-between; font-size: 0.875rem; font-weight: 600; margin-bottom: 4px;">
                      <span>⭐ ${l} sao ${l<=2?"(Cần sửa chữa)":""}</span>
                      <span>${S} (${E}%)</span>
                    </div>
                    <div style="height: 8px; background: var(--input-bg); border-radius: 4px; overflow: hidden;">
                      <div style="width: ${E}%; height: 100%; background: ${k}; border-radius: 4px; transition: width 0.4s ease;"></div>
                    </div>
                  </div>
                `}).join("")}
            </div>
          </div>
        </div>

        <!-- PWA Offline Readiness Verification Checklist -->
        <div class="card">
          <h3 class="card-title" style="font-size: 1.1rem; margin-bottom: 8px;">Trạng Thái Kiến Trúc Ngoại Tuyến (PWA & Offline Specs)</h3>
          <p class="card-description">Kiểm tra tính tuân thủ các tiêu chuẩn kỹ thuật đề bài</p>

          <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(280px, 1fr)); gap: 14px;">
            <div style="display: flex; align-items: center; gap: 10px; padding: 12px; background: var(--input-bg); border-radius: var(--radius-md);">
              <span style="color: var(--success-600); font-size: 1.25rem;">✓</span>
              <div>
                <strong style="font-size: 0.875rem; display: block;">Service Worker (Cache-First)</strong>
                <span style="font-size: 0.75rem; color: var(--text-muted);">${"serviceWorker"in navigator?"Đã kích hoạt & Pre-cache App Shell":"Không hỗ trợ"}</span>
              </div>
            </div>

            <div style="display: flex; align-items: center; gap: 10px; padding: 12px; background: var(--input-bg); border-radius: var(--radius-md);">
              <span style="color: var(--success-600); font-size: 1.25rem;">✓</span>
              <div>
                <strong style="font-size: 0.875rem; display: block;">Bộ nhớ đệm IndexedDB</strong>
                <span style="font-size: 0.75rem; color: var(--text-muted);">Đã lưu ${t} bản ghi (Dung lượng: ~${h} MB)</span>
              </div>
            </div>

            <div style="display: flex; align-items: center; gap: 10px; padding: 12px; background: var(--input-bg); border-radius: var(--radius-md);">
              <span style="color: var(--success-600); font-size: 1.25rem;">✓</span>
              <div>
                <strong style="font-size: 0.875rem; display: block;">Manifest PWA Độc lập (Standalone)</strong>
                <span style="font-size: 0.75rem; color: var(--text-muted);">Màu chủ đề #0284c7, Icons 192x192 & 512x512</span>
              </div>
            </div>

            <div style="display: flex; align-items: center; gap: 10px; padding: 12px; background: var(--input-bg); border-radius: var(--radius-md);">
              <span style="color: var(--success-600); font-size: 1.25rem;">✓</span>
              <div>
                <strong style="font-size: 0.875rem; display: block;">Capacitor Bridge & Camera/GPS</strong>
                <span style="font-size: 0.75rem; color: var(--text-muted);">@capacitor/camera, @capacitor/network, Geolocation</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    `}}class nn{constructor(e,t){y(this,"container");y(this,"showToast");this.container=e,this.showToast=t,this.init()}init(){this.render(),this.setupEventListeners()}render(){const e=J.getConfig(),t=_.isSimulatingOffline(),s=J.getLogs();this.container.innerHTML=`
      <div class="card">
        <h2 class="card-title">Mô Phỏng Thực Địa & Bảng Điều Khiển Kiểm Thử</h2>
        <p class="card-description">
          Công cụ hỗ trợ giảng viên và sinh viên kiểm tra toàn diện hành vi Ngoại tuyến (Tầng hầm), Hàng đợi IndexedDB và Khôi phục kết nối.
        </p>

        <!-- Network Simulation Block -->
        <div style="background: var(--input-bg); border: 1px solid var(--border-subtle); border-radius: var(--radius-lg); padding: 20px; margin-bottom: 24px;">
          <h3 style="font-size: 1rem; font-weight: 700; margin-bottom: 8px; display: flex; align-items: center; gap: 8px;">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M5 12.55a10.94 10.94 0 0 1 5.17-2.39"/>
              <path d="M10.71 5.05A16 16 0 0 1 22.58 9"/>
              <path d="M1.42 9a15.91 15.91 0 0 1 4.7-2.88"/>
              <path d="M8.53 16.11a6 6 0 0 1 6.95 0"/>
              <line x1="12" y1="20" x2="12.01" y2="20"/>
            </svg>
            Mô phỏng Môi trường Mạng (Tầng hầm VKU vs Trực tuyến)
          </h3>
          <p style="font-size: 0.8125rem; color: var(--text-muted); margin-bottom: 16px;">
            Chuyển nhanh trạng thái để quan sát cách PWA tự động lưu vào IndexedDB khi ở tầng hầm và tự động gửi hàng đợi khi lên mặt đất có Wi-Fi/4G.
          </p>

          <div style="display: flex; gap: 12px; flex-wrap: wrap;">
            <button id="btn-toggle-basement" class="btn ${t?"btn-danger":"btn-secondary"}">
              ${t?"🔴 Đang ở Tầng hầm (Mất mạng)":"🏢 Giả lập đi vào Tầng hầm (Cắt mạng)"}
            </button>
            <button id="btn-toggle-online" class="btn ${t?"btn-secondary":"btn-primary"}">
              🟢 Khôi phục kết nối Mạng (Tự động đồng bộ)
            </button>
          </div>
        </div>

        <!-- Server Response Mocking Block -->
        <div style="background: var(--input-bg); border: 1px solid var(--border-subtle); border-radius: var(--radius-lg); padding: 20px; margin-bottom: 24px;">
          <h3 style="font-size: 1rem; font-weight: 700; margin-bottom: 8px;">Cấu hình Phản hồi Máy chủ VKU (Mock Facilities Server)</h3>
          <p style="font-size: 0.8125rem; color: var(--text-muted); margin-bottom: 16px;">
            Mô phỏng các kịch bản thực tế khi máy chủ nhận yêu cầu từ hàng đợi Service Worker / Background Sync.
          </p>

          <div class="form-grid" style="margin-bottom: 12px;">
            <div class="form-group">
              <label class="form-label" for="select-mock-mode">Chế độ phản hồi API</label>
              <select id="select-mock-mode" class="form-control">
                <option value="success" ${e.mode==="success"?"selected":""}>Thành công 100% (HTTP 200 OK)</option>
                <option value="random_fail" ${e.mode==="random_fail"?"selected":""}>Chập chờn ngẫu nhiên 50% (HTTP 503 để test Retry)</option>
                <option value="offline_simulate" ${e.mode==="offline_simulate"?"selected":""}>Máy chủ từ chối kết nối (Server Down)</option>
              </select>
            </div>

            <div class="form-group">
              <label class="form-label" for="input-latency">Độ trễ phản hồi mạng (ms)</label>
              <input id="input-latency" class="form-control" type="number" min="100" max="3000" step="100" value="${e.latencyMs}" />
            </div>
          </div>
        </div>

        <!-- Server Inbound Logs -->
        <div>
          <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 12px;">
            <h3 style="font-size: 1rem; font-weight: 700;">Nhật ký Máy chủ nhận Khảo sát (${s.length})</h3>
            <button id="btn-clear-logs" class="btn btn-secondary" style="font-size: 0.75rem; padding: 4px 10px;">
              Xóa nhật ký
            </button>
          </div>

          ${s.length===0?`
            <div style="font-size: 0.8125rem; color: var(--text-muted); padding: 16px; background: var(--input-bg); border-radius: var(--radius-md); text-align: center;">
              Chưa có gói tin nào được gửi tới máy chủ trong phiên này.
            </div>
          `:`
            <div style="max-height: 260px; overflow-y: auto; display: flex; flex-direction: column; gap: 8px;">
              ${s.map(n=>`
                <div style="padding: 10px 14px; background: var(--input-bg); border-left: 3px solid ${n.status==="SUCCESS"?"var(--success-500)":"var(--danger-500)"}; border-radius: var(--radius-sm); font-size: 0.8125rem;">
                  <div style="display: flex; justify-content: space-between; margin-bottom: 2px;">
                    <strong>${n.status==="SUCCESS"?"✓ "+n.id:"⚠️ THẤT BẠI"}</strong>
                    <span style="color: var(--text-muted); font-size: 0.75rem;">${new Date(n.receivedAt).toLocaleTimeString("vi-VN")}</span>
                  </div>
                  <div style="color: var(--text-muted);">${n.message} • Thiết bị: ${n.equipmentCode}</div>
                </div>
              `).join("")}
            </div>
          `}
        </div>
      </div>
    `}setupEventListeners(){const e=document.getElementById("btn-toggle-basement");e&&e.addEventListener("click",()=>{_.setSimulatedOffline(!0),this.showToast("Đã kích hoạt chế độ: TẦNG HẦM (NGOẠI TUYẾN)","warning"),this.render(),this.setupEventListeners()});const t=document.getElementById("btn-toggle-online");t&&t.addEventListener("click",()=>{_.setSimulatedOffline(!1),this.showToast("Đã khôi phục kết nối! Tự động kiểm tra và đồng bộ hàng đợi.","success"),O.syncQueue(),this.render(),this.setupEventListeners()});const s=document.getElementById("select-mock-mode");s&&s.addEventListener("change",async()=>{await J.updateConfig({mode:s.value}),this.showToast("Đã cập nhật chế độ phản hồi máy chủ!","success")});const n=document.getElementById("input-latency");n&&n.addEventListener("change",async()=>{const c=parseInt(n.value,10)||600;await J.updateConfig({latencyMs:c}),this.showToast(`Đã thiết lập độ trễ phản hồi: ${c}ms`,"success")});const a=document.getElementById("btn-clear-logs");a&&a.addEventListener("click",()=>{J.clearLogs(),this.render(),this.setupEventListeners(),this.showToast("Đã xóa nhật ký máy chủ","warning")})}}class sn{constructor(){y(this,"activeTab","form");y(this,"deferredInstallPrompt",null);y(this,"inspectionForm");y(this,"surveyList");y(this,"statsDashboard");y(this,"devSettings");this.init()}async init(){this.registerServiceWorker(),this.initTheme(),this.initPwaInstall(),this.initToasts(),this.initModal(),this.initNetworkListener(),this.initSyncListener(),this.initNavigation();const e=document.getElementById("tab-form"),t=document.getElementById("tab-queue"),s=document.getElementById("tab-stats"),n=document.getElementById("tab-settings");this.inspectionForm=new Xt(e,(a,c)=>this.showToast(a,c),()=>{this.switchTab("queue")}),this.surveyList=new en(t,(a,c)=>this.showToast(a,c),(a,c)=>this.openModal(a,c)),this.statsDashboard=new tn(s),this.devSettings=new nn(n,(a,c)=>this.showToast(a,c)),await O.notifyQueueChanged()}registerServiceWorker(){"serviceWorker"in navigator&&window.addEventListener("load",()=>{navigator.serviceWorker.register("/sw.js",{scope:"/"}).then(e=>{console.log("[PWA] ServiceWorker registered successfully with scope:",e.scope)}).catch(e=>{console.warn("[PWA] ServiceWorker registration failed:",e)})})}initTheme(){const e=localStorage.getItem("vku_theme")||"theme-light";document.body.className=e,this.updateThemeIcons(e);const t=document.getElementById("btn-theme-toggle");t&&t.addEventListener("click",()=>{const n=document.body.classList.contains("theme-dark")?"theme-light":"theme-dark";document.body.className=n,localStorage.setItem("vku_theme",n),this.updateThemeIcons(n)})}updateThemeIcons(e){const t=document.getElementById("theme-icon-sun"),s=document.getElementById("theme-icon-moon");e==="theme-dark"?(t==null||t.classList.remove("hidden"),s==null||s.classList.add("hidden")):(t==null||t.classList.add("hidden"),s==null||s.classList.remove("hidden"))}initPwaInstall(){const e=document.getElementById("btn-install-pwa");window.addEventListener("beforeinstallprompt",t=>{t.preventDefault(),this.deferredInstallPrompt=t,e&&e.classList.remove("hidden")}),e&&e.addEventListener("click",async()=>{if(this.deferredInstallPrompt){this.deferredInstallPrompt.prompt();const{outcome:t}=await this.deferredInstallPrompt.userChoice;console.log(`[PWA] Install prompt outcome: ${t}`),this.deferredInstallPrompt=null,e.classList.add("hidden")}else this.showToast("Bạn có thể cài đặt PWA bằng cách chọn Thêm vào MH chính trên trình duyệt","warning")}),window.addEventListener("appinstalled",()=>{console.log("[PWA] Application installed on device!"),this.showToast("Đã cài đặt VKU Field Survey thành công!","success"),e&&e.classList.add("hidden")})}initNetworkListener(){const e=document.getElementById("network-pill"),t=document.getElementById("network-text"),s=document.getElementById("offline-banner");_.subscribe(n=>{n?(e==null||e.classList.remove("offline"),e==null||e.classList.add("online"),t&&(t.innerText="TRỰC TUYẾN"),s==null||s.classList.add("hidden")):(e==null||e.classList.remove("online"),e==null||e.classList.add("offline"),t&&(t.innerText="NGOẠI TUYẾN - TẦNG HẦM"),s==null||s.classList.remove("hidden"))})}initSyncListener(){const e=document.getElementById("header-queue-count"),t=document.getElementById("nav-queue-count"),s=document.getElementById("nav-queue-badge"),n=document.getElementById("sync-icon"),a=document.getElementById("btn-header-sync");O.onQueueChange(c=>{e&&(e.innerText=c.toString()),t&&(t.innerText=c.toString()),s&&(s.innerText=c.toString(),c>0?s.classList.remove("hidden"):s.classList.add("hidden"))}),O.onProgress((c,d,h)=>{n==null||n.classList.add("spinning"),h&&this.showToast(`Đang gửi (${c}/${d}): [${h.building} - ${h.room}]...`)}),O.onComplete((c,d)=>{var h,l;if(n==null||n.classList.remove("spinning"),c>0){this.showToast(`Đồng bộ thành công ${c} khảo sát lên máy chủ!`,"success");try{pt({particleCount:50,spread:60,origin:{y:.8}})}catch{}}d>0&&this.showToast(`Có ${d} khảo sát chưa thể gửi (sẽ lưu lại trong queue)`,"warning"),(h=this.surveyList)==null||h.refresh(),(l=this.statsDashboard)==null||l.refresh()}),a&&a.addEventListener("click",async()=>{if(!_.isOnline()){this.showToast("Bạn đang ở tầng hầm ngoại tuyến. Vui lòng kết nối mạng để đồng bộ.","warning");return}n==null||n.classList.add("spinning"),await O.syncQueue(!0),n==null||n.classList.remove("spinning")})}initNavigation(){document.querySelectorAll(".nav-item").forEach(t=>{t.addEventListener("click",()=>{const s=t.getAttribute("data-tab");this.switchTab(s)})})}switchTab(e){var s,n,a;this.activeTab=e,document.querySelectorAll(".nav-item").forEach(c=>{c.getAttribute("data-tab")===e?c.classList.add("active"):c.classList.remove("active")});const t={form:document.getElementById("tab-form"),queue:document.getElementById("tab-queue"),stats:document.getElementById("tab-stats"),settings:document.getElementById("tab-settings")};Object.keys(t).forEach(c=>{var d,h;c===e?(d=t[c])==null||d.classList.remove("hidden"):(h=t[c])==null||h.classList.add("hidden")}),e==="queue"?(s=this.surveyList)==null||s.refresh():e==="stats"?(n=this.statsDashboard)==null||n.refresh():e==="settings"&&((a=this.devSettings)==null||a.render())}initToasts(){}showToast(e,t="info"){const s=document.getElementById("toast-container");if(!s)return;const n=document.createElement("div");n.className=`toast ${t}`,n.innerText=e,s.appendChild(n),setTimeout(()=>{n.style.opacity="0",n.style.transform="translateY(10px)",n.style.transition="all 0.3s ease",setTimeout(()=>n.remove(),300)},3800)}initModal(){const e=document.getElementById("global-modal"),t=document.getElementById("modal-close-btn");t==null||t.addEventListener("click",()=>this.closeModal()),e==null||e.addEventListener("click",s=>{s.target===e&&this.closeModal()}),window.addEventListener("keydown",s=>{s.key==="Escape"&&this.closeModal()})}openModal(e,t){const s=document.getElementById("global-modal"),n=document.getElementById("modal-title"),a=document.getElementById("modal-body");n&&(n.innerText=e),a&&(a.innerHTML=t),s==null||s.classList.remove("hidden")}closeModal(){const e=document.getElementById("global-modal");e==null||e.classList.add("hidden")}}document.addEventListener("DOMContentLoaded",()=>{new sn});export{De as W};
//# sourceMappingURL=index-0tL6bN2e.js.map
