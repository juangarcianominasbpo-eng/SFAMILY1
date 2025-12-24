
import { supabase, googleLogin, logout, getUser } from './supa.js';

const loginBtn = document.getElementById('login-btn');
const logoutBtn = document.getElementById('logout-btn');
const userName = document.getElementById('user-name');
loginBtn.onclick = () => googleLogin();
logoutBtn.onclick = () => logout();

const msgInput = document.getElementById('msg');
const sendBtn = document.getElementById('send');
const chatList = document.getElementById('chat-list');

function renderMessage(m) {
  const el = document.createElement('div');
  el.className = 'card';
  el.innerHTML = `<strong>${m.author}</strong>: ${m.text}`;
  chatList.appendChild(el);
  chatList.scrollTop = chatList.scrollHeight;
}

async function loadHistory() {
  const { data, error } = await supabase.from('chat_messages').select('*').order('created_at', { ascending: true }).limit(500);
  if (error) { console.error(error); return; }
  chatList.innerHTML = '';
  for (const m of data) renderMessage(m);
}

sendBtn.onclick = async () => {
  const user = await getUser();
  if (!user) return alert('Inicia sesión para chatear.');
  if (!msgInput.value.trim()) return;
  const { error } = await supabase.from('chat_messages').insert({
    user_id: user.id,
    author: user.user_metadata?.full_name || user.email,
    text: msgInput.value
  });
  if (error) alert(error.message);
  msgInput.value = '';
};

const channel = supabase.channel('realtime-chat')
  .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'chat_messages' }, payload => {
    renderMessage(payload.new);
  })
  .subscribe();

(async () => {
  const user = await getUser();
  userName.textContent = user ? (user.user_metadata?.full_name || user.email) : 'Invitado';
  await loadHistory();
})();
