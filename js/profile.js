
import { supabase, googleLogin, logout, getUser } from './supa.js';

const loginBtn = document.getElementById('login-btn');
const logoutBtn = document.getElementById('logout-btn');
const userName = document.getElementById('user-name');
loginBtn.onclick = () => googleLogin();
logoutBtn.onclick = () => logout();

const audio = document.getElementById('profile-audio');
const songUrlInput = document.getElementById('song-url');
const bioInput = document.getElementById('bio');
const saveBtn = document.getElementById('save-btn');
const statusEl = document.getElementById('autoplay-status');
const playBtn = document.getElementById('play');
const unmuteBtn = document.getElementById('unmute');

function tryAutoplay() {
  audio.muted = true;
  const promise = audio.play();
  if (promise) {
    promise.then(() => {
      statusEl.textContent = 'Reproducción silenciada (haz clic en "Quitar silencio").';
      unmuteBtn.style.display = 'inline-block';
      unmuteBtn.onclick = () => { audio.muted = false; audio.play(); };
    }).catch(() => {
      statusEl.textContent = 'Autoplay bloqueado por el navegador. Presiona "Reproducir".';
    });
  }
}

async function loadProfile(user) {
  const { data } = await supabase.from('profiles').select('*').eq('user_id', user.id).maybeSingle();
  if (data) {
    songUrlInput.value = data.song_url || '';
    bioInput.value = data.bio || '';
    if (data.song_url) { audio.src = data.song_url; tryAutoplay(); }
  }
}

async function saveProfile(user) {
  const payload = { user_id: user.id, song_url: songUrlInput.value, bio: bioInput.value };
  const { error } = await supabase.from('profiles').upsert(payload, { onConflict: 'user_id' });
  if (error) alert(error.message);
  if (songUrlInput.value) { audio.src = songUrlInput.value; audio.play().catch(()=>{}); }
}

playBtn.onclick = () => audio.play();

(async () => {
  const user = await getUser();
  userName.textContent = user ? (user.user_metadata?.full_name || user.email) : 'Invitado';
  if (!user) return;
  await loadProfile(user);
  saveBtn.onclick = () => saveProfile(user);
})();
