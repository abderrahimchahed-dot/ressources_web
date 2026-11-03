/* Recherche, filtres et affichage des cartes */
var f="all",q="";
function render(){
var h="",n=0;
data.forEach(function(s){
var it=s.i.filter(function(x){return (f=="all"||x[1]==f)&&(x[0]+" "+s.t).toLowerCase().indexOf(q)>-1});
if(!it.length)return;n+=it.length;
h+="<section><h2>"+s.t+"</h2><p class='sub'>"+s.s+"</p><div class='grid'>"+
it.map(function(x){var lb={yt:"YouTube",dr:"Drive",web:"Site"}[x[1]];
return "<a class='l' target='_blank' rel='noopener' href='"+x[2]+"'><span class='b "+x[1]+"'>"+lb+"</span><span class='n'>"+x[0]+"</span></a>"}).join("")+
"</div></section>"});
document.getElementById("app").innerHTML=h;
document.getElementById("empty").style.display=n?"none":"block";
tilt()}
function tilt(){document.querySelectorAll("a.l").forEach(function(a){
a.onmousemove=function(e){var r=a.getBoundingClientRect(),x=(e.clientX-r.left)/r.width-.5,y=(e.clientY-r.top)/r.height-.5;
a.style.transform="perspective(600px) rotateY("+x*10+"deg) rotateX("+(-y*10)+"deg) translateY(-3px)"};
a.onmouseleave=function(){a.style.transform=""}})}
document.getElementById("q").oninput=function(e){q=e.target.value.toLowerCase();render()};
document.querySelectorAll("#tabs button").forEach(function(b){b.onclick=function(){
document.querySelectorAll("#tabs button").forEach(function(x){x.classList.remove("on")});
b.classList.add("on");f=b.dataset.f;render()}});
render();

