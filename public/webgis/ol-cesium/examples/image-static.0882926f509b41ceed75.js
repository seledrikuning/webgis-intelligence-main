(()=>{"use strict";var e,r={7547:(e,r,n)=>{var t=n(2939),o=n(3126),a=n(8613),s=n(9741),i=n(3601),l=n(6734),c=n(6310),u=n(7136),p=n(6853),d=n(654),v=n(261);const f=[-40,50,-10,65];Cesium.Ion.defaultAccessToken=v.x;const b=new c.Z({layers:[new l.Z({source:new i.Z}),new u.Z({source:new d.Z({url:"data/image-static.png",crossOrigin:"",projection:"EPSG:4326",imageExtent:f})})],controls:(0,s.ce)({attributionOptions:{collapsible:!1}}),target:"map",view:new a.ZP({center:(0,o.vs)((0,p.qg)(f),"EPSG:4326","EPSG:3857"),zoom:4,projection:"EPSG:3857"})}),m=new t.Z({map:b});m.getCesiumScene().terrainProvider=Cesium.createWorldTerrain(),m.setEnabled(!0),document.getElementById("enable").addEventListener("click",(()=>m.setEnabled(!m.getEnabled())))}},n={};function t(e){var o=n[e];if(void 0!==o)return o.exports;var a=n[e]={exports:{}};return r[e].call(a.exports,a,a.exports,t),a.exports}t.m=r,e=[],t.O=(r,n,o,a)=>{if(!n){var s=1/0;for(c=0;c<e.length;c++){for(var[n,o,a]=e[c],i=!0,l=0;l<n.length;l++)(!1&a||s>=a)&&Object.keys(t.O).every((e=>t.O[e](n[l])))?n.splice(l--,1):(i=!1,a<s&&(s=a));i&&(e.splice(c--,1),r=o())}return r}a=a||0;for(var c=e.length;c>0&&e[c-1][2]>a;c--)e[c]=e[c-1];e[c]=[n,o,a]},t.n=e=>{var r=e&&e.__esModule?()=>e.default:()=>e;return t.d(r,{a:r}),r},t.d=(e,r)=>{for(var n in r)t.o(r,n)&&!t.o(e,n)&&Object.defineProperty(e,n,{enumerable:!0,get:r[n]})},t.o=(e,r)=>Object.prototype.hasOwnProperty.call(e,r),t.j=982,(()=>{var e={982:0};t.O.j=r=>0===e[r];var r=(r,n)=>{var o,a,[s,i,l]=n,c=0;for(o in i)t.o(i,o)&&(t.m[o]=i[o]);if(l)var u=l(t);for(r&&r(n);c<s.length;c++)a=s[c],t.o(e,a)&&e[a]&&e[a][0](),e[s[c]]=0;return t.O(u)},n=self.webpackChunkol_cesium=self.webpackChunkol_cesium||[];n.forEach(r.bind(null,0)),n.push=r.bind(null,n.push.bind(n))})();var o=t.O(void 0,[351],(()=>t(7547)));o=t.O(o)})();
//# sourceMappingURL=image-static.0882926f509b41ceed75.js.map