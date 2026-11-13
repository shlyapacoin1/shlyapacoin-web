const $=id=>document.getElementById(id);
let state={balance:0,energy:100,reward:1,last:Date.now()};
try{const saved=JSON.parse(localStorage.getItem('shlyapacoin-demo'));if(saved)state={...state,...saved}}catch(e){}
function save(){localStorage.setItem('shlyapacoin-demo',JSON.stringify(state))}
function render(){$('balance').textContent=state.balance.toLocaleString('en-US');$('energy').textContent=`${Math.floor(state.energy)} / 100`;$('energybar').style.width=`${state.energy}%`;$('reward').textContent=state.reward}
$('hat').addEventListener('click',()=>{if(state.energy<1)return;state.balance+=state.reward;state.energy-=1;save();render()});
$('upgrade').addEventListener('click',()=>{if(state.balance<10000){alert('Нужно 10 000 CROWNS');return}state.balance-=10000;state.reward+=1;save();render()});
$('join').addEventListener('click',()=>alert('Ссылка на сообщество будет добавлена позже.'));
setInterval(()=>{if(state.energy<100){state.energy=Math.min(100,state.energy+1/3);save();render()}},1000);render();
