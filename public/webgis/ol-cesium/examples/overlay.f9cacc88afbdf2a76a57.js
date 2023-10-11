(()=>{"use strict";var e,t={4394:(e,t,o)=>{var n=o(2939),i=o(6310),s=o(3601),r=o(6734),a=o(3126),c=o(8613),l=o(9741),d=o(5658),p=o(7677),h=o(261);const u=new s.Z;Cesium.Ion.defaultAccessToken=h.x;const v=new i.Z({layers:[new r.Z({source:u})],controls:(0,l.ce)({attributionOptions:{collapsible:!1}}),target:"map",view:new c.ZP({center:(0,a.vs)([-112.2,36.06],"EPSG:4326","EPSG:3857"),zoom:11})}),m=new n.Z({map:v,target:"map3d"}),y=m.getCesiumScene();y.terrainProvider=Cesium.createWorldTerrain();new class{constructor(e,t,o){this.ol2d=e,this.ol3d=t,this.scene=o,this.staticOverlay=new d.Z({element:document.getElementById("popup")}),this.staticBootstrapPopup=new d.Z({element:document.getElementById("popup-bootstrap")}),this.ol2d.addOverlay(this.staticOverlay),this.ol2d.addOverlay(this.staticBootstrapPopup),this.options={boostrap:!1,add:!0},this.ol2d.on("click",this.onClickHandlerOL.bind(this));new Cesium.ScreenSpaceEventHandler(o.canvas).setInputAction(this.onClickHandlerCS.bind(this),Cesium.ScreenSpaceEventType.LEFT_CLICK);document.getElementById("click-action-form").onchange=function(e){const t=$('input[name="click-action"]:checked').val();this.options.add="add"===t}.bind(this);document.getElementById("overlay-type-form").onchange=function(e){const t=$('input[name="overlay-type"]:checked').val();this.options.boostrap="popover"===t}.bind(this)}onClickHandlerOL(e){const t=e.coordinate,o=(0,p.V7)((0,a.vs)(t,"EPSG:3857","EPSG:4326")),n=this.getOverlay();n.setPosition(t),this.setOverlayContent(n,o)}onClickHandlerCS(e){if(0===e.position.x&&0===e.position.y)return;const t=this.scene.camera.getPickRay(e.position),o=this.scene.globe.pick(t,y);if(!o)return;const n=y.globe.ellipsoid.cartesianToCartographic(o);let i=[Cesium.Math.toDegrees(n.longitude),Cesium.Math.toDegrees(n.latitude)];const s=y.globe.getHeight(n);s&&(i=i.concat([s]));const r=(0,a.vs)(i,(0,a.U2)("EPSG:4326"),"EPSG:3857"),c=(0,p.V7)(i),l=this.getOverlay();l.setPosition(r),this.setOverlayContent(l,c)}getOverlay(){return this.options.add?this.addOverlay():this.options.boostrap?this.staticBootstrapPopup:this.staticOverlay}setOverlayContent(e,t){const o=e.getElement();if(this.options.boostrap){const n=document.createElement("div");n.onclick=this.onCloseClick.bind(this,e,this.options.add),n.innerHTML=`<p>The location you clicked was:</p><code>${t}</code>`,$(o).popover("destroy"),$(o).popover({placement:"top",animation:!1,html:!0,content:n}),$(o).popover("show")}else o.childNodes.forEach((o=>{"popup-content"===o.id?o.innerHTML=`<p>The location you clicked was:</p><code>${t}</code>`:"popup-closer"===o.id&&(o.onclick=this.onCloseClick.bind(this,e,this.options.add))}))}onCloseClick(e,t){t?this.ol2d.removeOverlay(e):e.setPosition(void 0)}addOverlay(){let e;e=this.options.boostrap?document.getElementById("popup-bootstrap").cloneNode(!0):document.getElementById("popup").cloneNode(!0);const t=new d.Z({element:e});return this.ol2d.addOverlay(t),t}}(v,m,y),document.getElementById("enable").addEventListener("click",(()=>m.setEnabled(!m.getEnabled())))}},o={};function n(e){var i=o[e];if(void 0!==i)return i.exports;var s=o[e]={exports:{}};return t[e].call(s.exports,s,s.exports,n),s.exports}n.m=t,e=[],n.O=(t,o,i,s)=>{if(!o){var r=1/0;for(l=0;l<e.length;l++){for(var[o,i,s]=e[l],a=!0,c=0;c<o.length;c++)(!1&s||r>=s)&&Object.keys(n.O).every((e=>n.O[e](o[c])))?o.splice(c--,1):(a=!1,s<r&&(r=s));a&&(e.splice(l--,1),t=i())}return t}s=s||0;for(var l=e.length;l>0&&e[l-1][2]>s;l--)e[l]=e[l-1];e[l]=[o,i,s]},n.n=e=>{var t=e&&e.__esModule?()=>e.default:()=>e;return n.d(t,{a:t}),t},n.d=(e,t)=>{for(var o in t)n.o(t,o)&&!n.o(e,o)&&Object.defineProperty(e,o,{enumerable:!0,get:t[o]})},n.o=(e,t)=>Object.prototype.hasOwnProperty.call(e,t),n.j=372,(()=>{var e={372:0};n.O.j=t=>0===e[t];var t=(t,o)=>{var i,s,[r,a,c]=o,l=0;for(i in a)n.o(a,i)&&(n.m[i]=a[i]);if(c)var d=c(n);for(t&&t(o);l<r.length;l++)s=r[l],n.o(e,s)&&e[s]&&e[s][0](),e[r[l]]=0;return n.O(d)},o=self.webpackChunkol_cesium=self.webpackChunkol_cesium||[];o.forEach(t.bind(null,0)),o.push=t.bind(null,o.push.bind(o))})();var i=n.O(void 0,[351],(()=>n(4394)));i=n.O(i)})();
//# sourceMappingURL=overlay.f9cacc88afbdf2a76a57.js.map