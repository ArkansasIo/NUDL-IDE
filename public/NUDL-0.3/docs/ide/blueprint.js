const bpNodes=document.querySelector("#bpNodes"),bpSource=document.querySelector("#bpSource"),bpStatus=document.querySelector("#bpStatus");
const bpExamples={
begin:[
 {title:"Begin Play",type:"event",x:70,y:70,inputs:[],outputs:["exec"]},
 {title:"Print String",type:"function",x:410,y:70,inputs:["exec","text"],outputs:["exec"]},
 {title:"Return",type:"flow",x:760,y:70,inputs:["exec"],outputs:[]}
],
health:[
 {title:"On Damage",type:"event",x:70,y:70,inputs:[],outputs:["exec","damage"]},
 {title:"Get Health",type:"variable",x:390,y:70,inputs:[],outputs:["health"]},
 {title:"Subtract",type:"math",x:700,y:70,inputs:["health","damage"],outputs:["result"]},
 {title:"Set Health",type:"variable",x:1010,y:70,inputs:["exec","result"],outputs:["exec"]}
]
};
let current=bpExamples.begin.map(n=>({...n}));
function esc(v){return String(v).replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]));}
function renderBlueprint(){
 if(!bpNodes)return;
 bpNodes.innerHTML=current.map((n,i)=>`<article class="bp-node ${esc(n.type)}" style="left:${n.x}px;top:${n.y}px" data-index="${i}">
 <header>${esc(n.title)}</header><div class="bp-pins">
 <div class="pinList">${n.inputs.map(p=>`<span class="pin in"><i></i>${esc(p)}</span>`).join("")}</div>
 <div class="pinList">${n.outputs.map(p=>`<span class="pin out">${esc(p)}<i></i></span>`).join("")}</div>
 </div></article>`).join("");
 const lines=current.map((n,i)=>`// Node ${i+1}: ${n.title}`).join("\n");
 if(bpSource)bpSource.value=`// Generated Noodle from Blueprint\nfn main() -> i64 {\n${lines}\n    return 0;\n}`;
 if(bpStatus)bpStatus.textContent=current.length+" nodes";
}
function loadBlueprint(kind){
 current=(bpExamples[kind]||bpExamples.begin).map(n=>({...n}));
 renderBlueprint();
 if(bpStatus)bpStatus.textContent=(kind==="health"?"Damage / Health":"Begin Play")+" graph";
}
document.querySelector("#bpExampleBegin")?.addEventListener("click",()=>loadBlueprint("begin"));
document.querySelector("#bpExampleHealth")?.addEventListener("click",()=>loadBlueprint("health"));
document.querySelector("#bpAddNode")?.addEventListener("click",()=>{
 current.push({title:"Print String",type:"function",x:100+current.length*35,y:240+current.length*25,inputs:["exec","text"],outputs:["exec"]});
 renderBlueprint();
});
document.querySelector("#bpFit")?.addEventListener("click",()=>{if(bpNodes)bpNodes.parentElement.scrollTo({top:0,left:0,behavior:"smooth"});});
document.querySelector("#bpCompile")?.addEventListener("click",()=>{
 renderBlueprint();
 const out=document.querySelector("#bottomOutput");
 if(out)out.textContent="Noodle Blueprint Compiler\n$ blueprint Player.nblueprint --emit noodle\n[graph] OK\n[emit] Noodle source generated.";
 if(bpStatus)bpStatus.textContent="Compiled to Noodle";
});
renderBlueprint();