!function(e){function t(t){for(var o,i,l=t[0],c=t[1],u=t[2],d=0,p=[];d<l.length;d++)i=l[d],Object.prototype.hasOwnProperty.call(a,i)&&a[i]&&p.push(a[i][0]),a[i]=0;for(o in c)Object.prototype.hasOwnProperty.call(c,o)&&(e[o]=c[o]);for(s&&s(t);p.length;)p.shift()();return r.push.apply(r,u||[]),n()}function n(){for(var e,t=0;t<r.length;t++){for(var n=r[t],o=!0,l=1;l<n.length;l++){var c=n[l];0!==a[c]&&(o=!1)}o&&(r.splice(t--,1),e=i(i.s=n[0]))}return e}var o={},a={0:0},r=[];function i(t){if(o[t])return o[t].exports;var n=o[t]={i:t,l:!1,exports:{}};return e[t].call(n.exports,n,n.exports,i),n.l=!0,n.exports}i.m=e,i.c=o,i.d=function(e,t,n){i.o(e,t)||Object.defineProperty(e,t,{enumerable:!0,get:n})},i.r=function(e){"undefined"!=typeof Symbol&&Symbol.toStringTag&&Object.defineProperty(e,Symbol.toStringTag,{value:"Module"}),Object.defineProperty(e,"__esModule",{value:!0})},i.t=function(e,t){if(1&t&&(e=i(e)),8&t)return e;if(4&t&&"object"==typeof e&&e&&e.__esModule)return e;var n=Object.create(null);if(i.r(n),Object.defineProperty(n,"default",{enumerable:!0,value:e}),2&t&&"string"!=typeof e)for(var o in e)i.d(n,o,function(t){return e[t]}.bind(null,o));return n},i.n=function(e){var t=e&&e.__esModule?function(){return e.default}:function(){return e};return i.d(t,"a",t),t},i.o=function(e,t){return Object.prototype.hasOwnProperty.call(e,t)},i.p="";var l=window.webpackJsonp=window.webpackJsonp||[],c=l.push.bind(l);l.push=t,l=l.slice();for(var u=0;u<l.length;u++)t(l[u]);var s=c;r.push([55,1]),n()}({55:function(e,t,n){"use strict";n.r(t);var o=n(34),a=n(21),r=n(54);let i=!1,l=null,c=0,u=0,s=0,d=null;async function p(e){i=!1;const t=await a.f({architecture:"MobileNetV1",outputStride:16,multiplier:.75,quantBytes:2});l||(l=document.createElement("canvas"),l.width=400,l.height=400,document.body.appendChild(l));let n=null;d&&(n=await o.a.webcam(d)),await h(t,d);do{n&&(e=d),await h(t,e),await o.b()}while(n);i=!0}d=document.createElement("video"),d.autoplay=!0,d.playsinline=!0,d.muted=!0,d.id="webcam",d.width=400,d.height=400,document.body.appendChild(d),p(),function(){const e=document.createElement("select");["segmentPerson","segmentPersonParts","segmentMultiPerson","segmentMultiPersonParts"].forEach((t,n)=>{const o=document.createElement("option");o.value=n,o.label=t,e.appendChild(o)}),document.body.appendChild(e),e.onchange=()=>{c=e.value,i&&p(null)}}(),function(){const e=document.createElement("select");["drawMask","drawPixelatedMask","drawBokehEffect","blurBodyPart"].forEach((t,n)=>{const o=document.createElement("option");o.value=n,o.label=t,e.appendChild(o)}),document.body.appendChild(e),e.onchange=()=>{s=e.value,i&&p(null)}}(),function(){const e=document.createElement("select");["mask","coloredPartMask"].forEach((t,n)=>{const o=document.createElement("option");o.value=n,o.label=t,e.appendChild(o)}),document.body.appendChild(e),e.onchange=()=>{u=e.value,i&&p(null)}}();const f=[0,1];async function h(e,t){let n,o;n=1==c?await e.segmentPersonParts(t):2==c?await e.segmentMultiPerson(t):3==c?await e.segmentMultiPersonParts(t):await e.segmentPerson(t),o=1==u?a.g(n):a.h(n,{r:0,g:0,b:0,a:255},{r:0,g:0,b:0,a:0},!0),0==s?a.c(l,t,o,.7,0,!1):1==s?a.d(l,t,o,.7,0,!1,10):2==s?a.b(l,t,n,3,3,!1):3==s&&a.a(l,t,n,f,3,3,!1),function(e,t,n){Array.isArray(e)?e.forEach(e=>{let o=e.pose;t&&(o=a.e(o,e.width)),y(o.keypoints,.1,n),b(o.keypoints,.1,n)}):e.allPoses.forEach(o=>{t&&(o=a.e(o,e.width)),y(o.keypoints,.1,n),b(o.keypoints,.1,n)})}(n,!1,l.getContext("2d"))}function m(e,t,n,o,a){e.beginPath(),e.arc(t,n,o,0,2*Math.PI),e.fillStyle=a,e.fill()}function y(e,t,n,o=1){for(let a=0,r=e.length;a<r;a++){const r=e[a];if(r.score<t)continue;const{y:i,x:l}=r.position;m(n,l*o,i*o,3,"aqua")}}function b(e,t,n,o=1){function a({y:e,x:t}){return[e,t]}r.a(e,t).forEach(e=>{!function([e,t],[n,o],a,r,i){i.beginPath(),i.moveTo(t*r,e*r),i.lineTo(o*r,n*r),i.lineWidth=2,i.strokeStyle=a,i.stroke()}(a(e[0].position),a(e[1].position),"aqua",o,n)})}},58:function(e,t){},59:function(e,t){},70:function(e,t){},73:function(e,t){},74:function(e,t){}});