
import { SUPABASE_URL, SUPABASE_ANON_KEY } from './supabase-config.js';
import { createClient } from 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2/dist/esm/index.js';

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

export async function googleLogin() {
  const { data, error } = await supabase.auth.signInWithOAuth({ provider: 'google' });
  if (error) alert('Error de login: ' + error.message);
}
export async function logout() {
  await supabase.auth.signOut();
  location.reload();
}
export async function getUser() {
  const { data } = await supabase.auth.getUser();
  return data.user || null;
}

// PWA service worker
if ('serviceWorker' in navigator) {
  navigator.serviceWorker.register('/service-worker.js').catch(console.error);
}
