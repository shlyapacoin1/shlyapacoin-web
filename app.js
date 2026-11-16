
const SUPABASE_URL = 'https://djhzcmaeygxbwkdyftxm.supabase.co';
const SUPABASE_KEY = 'sb_publishable_THliToLHdXT1jnRInfaong_FaEBt_N8';

const GAME_API = `${SUPABASE_URL}/functions/v1/storage-upload`;

const $ = id => document.getElementById(id);

const tg = window.Telegram?.WebApp;
tg?.ready();

let state = {
  balance: 0,
  energy: 100,
  reward: 1,
  maxEnergy: 100,
  updatedAt: Date.now()
};

let tapping = false;

function getEnergy() {
  const elapsed = Math.max(0, Date.now() - state.updatedAt);
  const regenerated = Math.floor(elapsed / 60000);

  return Math.min(
    state.maxEnergy,
    state.energy + regenerated
  );
}

function render() {
  $('balance').textContent =
    state.balance.toLocaleString('en-US');

  $('energy').textContent = getEnergy();
  $('reward').textContent = state.reward;
}

function updatePlayer(player) {
  state.balance = Number(player.crowns);
  state.energy = Number(player.energy);
  state.maxEnergy = Number(player.max_energy);
  state.reward = Number(player.tap_power);
  state.updatedAt = new Date(player.updated_at).getTime();

  render();
}

async function gameRequest(action) {
  if (!tg?.initData) {
    throw new Error('Открой игру через Telegram');
  }

  const response = await fetch(GAME_API, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'apikey': SUPABASE_KEY
    },
    body: JSON.stringify({
      action,
      initData: tg.initData
    })
  });

  const result = await response.json();

  if (!response.ok) {
    if (result.player) {
      updatePlayer(result.player);
    }

    throw new Error(result.error || 'Ошибка сервера');
  }

  return result;
}

async function loadPlayer() {
  try {
    const result = await gameRequest('init');

    if (result.player) {
      updatePlayer(result.player);
    }

    console.log('Игрок загружен:', result.player);

  } catch (error) {
    console.error('Ошибка загрузки:', error);
    alert(error.message);
  }
}

async function tapHat() {
  if (tapping) return;

  tapping = true;

  try {
    const result = await gameRequest('tap');

    if (result.player) {
      updatePlayer(result.player);
    }

  } catch (error) {
    console.error('Ошибка нажатия:', error);

    if (error.message === 'Not enough energy') {
      console.log('Недостаточно энергии');
    } else {
      alert(error.message);
    }

  } finally {
    tapping = false;
  }
}

$('hat').addEventListener('click', tapHat);

$('upgrade').addEventListener('click', () => {
  alert('Система улучшений будет подключена следующим этапом.');
});

$('join').addEventListener('click', () => {
  alert('Ссылка на сообщество будет добавлена позже.');
});

setInterval(render, 1000);

loadPlayer();
