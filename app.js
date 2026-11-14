
const SUPABASE_URL = 'https://djhzcmaeygxbwkdyftxm.supabase.co';

const SUPABASE_KEY = 'sb_publishable_THliToLHdXT1jnRInfaong_FaEBt_N8';

const supabase = window.supabase.createClient(
  SUPABASE_URL,
  SUPABASE_KEY
);

const $ = id => document.getElementById(id);

let state = {
  balance: 0,
  energy: 100,
  reward: 1,
  maxEnergy: 100
};

const tg = window.Telegram?.WebApp;
tg?.ready();

const telegramId = tg?.initDataUnsafe?.user?.id;

async function loadPlayer() {
  if (!telegramId) {
    console.log('Открой игру через Telegram');
    return;
  }

  const { data, error } = await supabase
    .from('players')
    .select('*')
    .eq('telegram_id', telegramId)
    .maybeSingle();

  if (error) {
    console.error(error);
    return;
  }

  if (data) {
    state.balance = Number(data.crowns);
    state.energy = data.energy;
    state.maxEnergy = data.max_energy;
    state.reward = data.tap_power;
  } else {
    console.log('Новый игрок');
  }

  render();
}

async function savePlayer() {
  if (!telegramId) return;

  const { error } = await supabase
    .from('players')
    .upsert({
      telegram_id: telegramId,
      crowns: state.balance,
      energy: state.energy,
      max_energy: state.maxEnergy,
      tap_power: state.reward
    }, {
      onConflict: 'telegram_id'
    });

  if (error) console.error(error);
}

function render() {
  $('balance').textContent =
    state.balance.toLocaleString('en-US');

  $('energy').textContent = state.energy;
  $('reward').textContent = state.reward;
}

$('hat').addEventListener('click', () => {
  if (state.energy < 1) return;

  state.balance += state.reward;
  state.energy -= 1;

  render();
  savePlayer();
});

$('upgrade').addEventListener('click', () => {
  alert('Система улучшений будет подключена следующим этапом.');
});

$('join').addEventListener('click', () => {
  alert('Ссылка на сообщество будет добавлена позже.');
});

setInterval(() => {
  if (state.energy < state.maxEnergy) {
    state.energy = Math.min(
      state.maxEnergy,
      state.energy + 1
    );

    render();
    savePlayer();
  }
}, 3000);

loadPlayer();
