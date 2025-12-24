
import { supabase, googleLogin, logout, getUser } from './supa.js';

const txt = document.getElementById('post-text');
const file = document.getElementById('post-file');
const btn = document.getElementById('post-btn');
const list = document.getElementById('feed-list');
const loginBtn = document.getElementById('login-btn');
const logoutBtn = document.getElementById('logout-btn');
const userName = document.getElementById('user-name');

loginBtn.onclick = () => googleLogin();
logoutBtn.onclick = () => logout();

async function refreshUser() {
  const user = await getUser();
  userName.textContent = user ? (user.user_metadata?.full_name || user.email) : 'Invitado';
  return user;
}

btn.onclick = async () => {
  const user = await getUser();
  if (!user) return alert('Inicia sesión para publicar.');
  btn.disabled = true;
  try {
    let image_url = null;
    if (file.files[0]) {
      const path = `posts/${user.id}/${Date.now()}-${file.files[0].name}`;
      const { error: upErr } = await supabase.storage.from('images').upload(path, file.files[0], { upsert: true });
      if (upErr) throw upErr;
      const { data: pub } = supabase.storage.from('images').getPublicUrl(path);
      image_url = pub.publicUrl;
    }
    const { error } = await supabase.from('posts').insert({
      user_id: user.id,
      author: user.user_metadata?.full_name || user.email,
      photo_url: user.user_metadata?.avatar_url || null,
      text: txt.value,
      image_url
    });
    if (error) throw error;
    txt.value = ''; file.value = '';
  } catch (e) { console.error(e); alert('Error al publicar: ' + e.message); }
  btn.disabled = false;
};

async function loadFeed() {
  const { data, error } = await supabase
    .from('posts')
    .select('*')
    .order('created_at', { ascending: false })
    .limit(100);
  if (error) { console.error(error); return; }
  list.innerHTML = '';
  for (const p of data) {
    const el = document.createElement('div');
    el.className = 'card post';
    el.innerHTML = `
      <div class="flex">
        ${p.photo_url ? `<img src="${p.photo_url}" style="width:36px;height:36px;border-radius:50%">` : ''}
        <div>
          <div><strong>${p.author || 'Anónimo'}</strong></div>
          <div class="notice">${new Date(p.created_at).toLocaleString()}</div>
        </div>
      </div>
      <div style="margin-top:8px; white-space:pre-wrap">${p.text || ''}</div>
      ${p.image_url ? `<img src="${p.image_url}" alt="imagen">` : ''}
    `;
    list.appendChild(el);
  }
}

// Realtime on posts
const channel = supabase.channel('realtime-posts')
  .on('postgres_changes', { event: '*', schema: 'public', table: 'posts' }, payload => {
    loadFeed();
  })
  .subscribe();

refreshUser();
loadFeed();
