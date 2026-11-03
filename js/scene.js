/* Scène 3D animée */
try{
var cv=document.getElementById("bg"),R=new THREE.WebGLRenderer({canvas:cv,antialias:true,alpha:true});
R.setPixelRatio(Math.min(devicePixelRatio,2));
var S=new THREE.Scene(),C=new THREE.PerspectiveCamera(55,1,.1,100);
S.fog=new THREE.FogExp2(0x00040f,.03);
S.add(new THREE.AmbientLight(0x112244,.6));
var bl=new THREE.PointLight(0x2a8cff,2.5,40);bl.position.set(0,0,4);S.add(bl);
var W=new THREE.Group();S.add(W);
function rnd(a,b){return a+Math.random()*(b-a)}
function tex(w,h,f){var c=document.createElement("canvas");c.width=w;c.height=h;f(c.getContext("2d"),w,h);return new THREE.CanvasTexture(c)}
/* puce IA */
var face=tex(512,512,function(g,w,h){
g.fillStyle="#04163a";g.fillRect(0,0,w,h);
g.strokeStyle="#4fc3ff";g.lineWidth=6;g.strokeRect(10,10,w-20,h-20);
g.fillStyle="#38b6ff";
for(var x=36;x<w-30;x+=16)for(var y=36;y<h-30;y+=16){g.globalAlpha=rnd(.3,1);g.beginPath();g.arc(x,y,2.4,0,6.3);g.fill()}
g.globalAlpha=.55;g.strokeStyle="#38b6ff";g.lineWidth=2;
for(var n=0;n<70;n++){var x0=36+Math.floor(rnd(0,28))*16,y0=36+Math.floor(rnd(0,28))*16,l=16*Math.floor(rnd(1,5)),m=Math.random()<.5;
g.beginPath();g.moveTo(x0,y0);g.lineTo(x0+(m?l:0),y0+(m?0:l));g.lineTo(x0+(m?l:16),y0+(m?16:l));g.stroke()}
g.globalAlpha=1;g.fillStyle="#052152";g.fillRect(w/2-135,h/2-105,270,210);
g.strokeStyle="#7fe0ff";g.lineWidth=3;g.strokeRect(w/2-135,h/2-105,270,210);
g.font="bold 150px sans-serif";g.textAlign="center";g.textBaseline="middle";
g.shadowColor="#7fe0ff";g.shadowBlur=35;g.fillStyle="#d8f6ff";g.fillText("AI",w/2,h/2+8)});
var side=new THREE.MeshStandardMaterial({color:0x061c4a,emissive:0x0a4fd0,emissiveIntensity:.8,metalness:.5,roughness:.4});
var faceM=new THREE.MeshStandardMaterial({map:face,emissive:0xffffff,emissiveMap:face,emissiveIntensity:.9});
var cg=new THREE.Group(),chip=new THREE.Mesh(new THREE.BoxGeometry(2.7,2.7,.55),[side,side,side,side,faceM,faceM]);
chip.add(new THREE.LineSegments(new THREE.EdgesGeometry(chip.geometry),new THREE.LineBasicMaterial({color:0x8fe3ff})));
cg.add(chip);
var halo=new THREE.Sprite(new THREE.SpriteMaterial({map:tex(256,256,function(g,w,h){var r=g.createRadialGradient(w/2,h/2,0,w/2,h/2,w/2);r.addColorStop(0,"rgba(60,170,255,.85)");r.addColorStop(.4,"rgba(30,100,255,.25)");r.addColorStop(1,"rgba(0,0,0,0)");g.fillStyle=r;g.fillRect(0,0,w,h)}),blending:THREE.AdditiveBlending,transparent:true,depthWrite:false}));
halo.scale.set(9,9,1);halo.position.z=-.4;cg.add(halo);W.add(cg);
/* pistes de circuit */
var T=[],lp=[],np=[];
function gen(dx,dy,cnt,sp,L){
for(var c=0;c<cnt;c++){
var px=-dy,py=dx,off=(c/(cnt-1)-.5)*sp+rnd(-.03,.03),pts=[[dx*1.35+px*off,dy*1.35+py*off]],cx=pts[0][0],cy=pts[0][1],adv=0;
while(adv<L){var a=rnd(.5,1.5);cx+=dx*a;cy+=dy*a;adv+=a;pts.push([cx,cy]);
if(Math.random()<.55){var j=(Math.random()<.5?-1:1)*rnd(.1,.35);cx+=dx*Math.abs(j)+px*j;cy+=dy*Math.abs(j)+py*j;adv+=Math.abs(j);pts.push([cx,cy])}}
var cum=[0],tot=0;
for(var k=1;k<pts.length;k++){tot+=Math.hypot(pts[k][0]-pts[k-1][0],pts[k][1]-pts[k-1][1]);cum.push(tot);lp.push(pts[k-1][0],pts[k-1][1],0,pts[k][0],pts[k][1],0);np.push(pts[k][0],pts[k][1],0)}
T.push({p:pts,c:cum,t:tot,o:dy<0?0:1,s:rnd(.06,.14),u:Math.random()})}}
gen(0,1,38,2.0,10);gen(0,-1,30,1.8,8);gen(-1,0,14,1.8,8);gen(1,0,14,1.8,8);
var lg=new THREE.BufferGeometry();lg.setAttribute("position",new THREE.Float32BufferAttribute(lp,3));
W.add(new THREE.LineSegments(lg,new THREE.LineBasicMaterial({color:0x2aa8ff,transparent:true,opacity:.5})));
var ng=new THREE.BufferGeometry();ng.setAttribute("position",new THREE.Float32BufferAttribute(np,3));
W.add(new THREE.Points(ng,new THREE.PointsMaterial({color:0x7fe0ff,size:.07,transparent:true,opacity:.9})));
/* impulsions lumineuses */
var PN=T.length,pa=new Float32Array(PN*3),pgm=new THREE.BufferGeometry();
pgm.setAttribute("position",new THREE.BufferAttribute(pa,3));
W.add(new THREE.Points(pgm,new THREE.PointsMaterial({color:0xffffff,size:.13,transparent:true,opacity:.95})));
function at(tr,s){var k=1;while(k<tr.c.length-1&&tr.c[k]<s)k++;var a=tr.p[k-1],b=tr.p[k],f=(s-tr.c[k-1])/((tr.c[k]-tr.c[k-1])||1);return [a[0]+(b[0]-a[0])*f,a[1]+(b[1]-a[1])*f]}
/* sol circuit */
var ft=tex(512,512,function(g,w,h){g.strokeStyle="rgba(60,170,255,.55)";g.fillStyle="rgba(120,210,255,.8)";g.lineWidth=2;
for(var n=0;n<70;n++){var x=Math.floor(rnd(0,30))*16,y=Math.floor(rnd(0,30))*16,l=Math.floor(rnd(2,8))*16,m=Math.random()<.5;
g.beginPath();g.moveTo(x,y);g.lineTo(x+(m?l:0),y+(m?0:l));g.lineTo(x+(m?l:16),y+(m?16:l));g.stroke();
g.beginPath();g.arc(x,y,3.5,0,6.3);g.fill()}});
ft.wrapS=ft.wrapT=THREE.RepeatWrapping;ft.repeat.set(5,5);
var floor=new THREE.Mesh(new THREE.PlaneGeometry(50,50),new THREE.MeshBasicMaterial({map:ft,transparent:true,opacity:.55,blending:THREE.AdditiveBlending,depthWrite:false}));
floor.rotation.x=-Math.PI/2;floor.position.y=-5;W.add(floor);
var dp=[],i;for(i=0;i<400;i++)dp.push((Math.random()-.5)*34,(Math.random()-.5)*20,(Math.random()-.5)*24);
var dg=new THREE.BufferGeometry();dg.setAttribute("position",new THREE.Float32BufferAttribute(dp,3));
var dust=new THREE.Points(dg,new THREE.PointsMaterial({color:0x4d86ff,size:.035,transparent:true,opacity:.6}));S.add(dust);
var mx=0,my=0,sy=0;
addEventListener("pointermove",function(e){mx=e.clientX/innerWidth-.5;my=e.clientY/innerHeight-.5});
addEventListener("scroll",function(){sy=Math.min(scrollY/innerHeight,1.5)});
function rs(){R.setSize(innerWidth,innerHeight,false);C.aspect=innerWidth/innerHeight;C.updateProjectionMatrix();var d=innerWidth>800;W.position.x=d?2.6:0;W.scale.setScalar(d?1:.62)}
addEventListener("resize",rs);rs();
C.position.set(0,.3,10.5);
var still=matchMedia("(prefers-reduced-motion:reduce)").matches;
function loop(t){t*=.001;
var k=Math.sin(t*2);
cg.rotation.y=Math.sin(t*.5)*.35;cg.rotation.x=Math.sin(t*.4)*.12;cg.position.y=Math.sin(t*.9)*.12;
faceM.emissiveIntensity=.8+.25*k;halo.scale.set(9+k*.5,9+k*.5,1);bl.intensity=2.5+k*.8;
T.forEach(function(tr,n){var u=(tr.u+t*tr.s)%1,s=(tr.o?1-u:u)*tr.t,q=at(tr,s);pa[n*3]=q[0];pa[n*3+1]=q[1];pa[n*3+2]=.02});
pgm.attributes.position.needsUpdate=true;
ft.offset.y=t*.03;dust.rotation.y=t*.01;
C.position.x+=(mx*2.5-C.position.x)*.04;C.position.y+=(.3-my*1-sy*3-C.position.y)*.04;
C.lookAt(W.position.x*.3,-sy*3,0);
R.render(S,C);if(!still)requestAnimationFrame(loop)}
requestAnimationFrame(loop);
}catch(e){document.getElementById("bg").style.display="none"}
