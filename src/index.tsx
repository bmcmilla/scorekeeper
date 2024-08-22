/* @refresh reload */
import './index.css';
import { render } from 'solid-js/web';
import { Router } from "@solidjs/router";
import { createClient } from '@supabase/supabase-js';
import { SupabaseProvider } from 'solid-supabase';

import App from './App';

const root = document.getElementById('root');

const supabase = createClient(import.meta.env.VITE_SUPABASE_URL, import.meta.env.VITE_SUPABASE_KEY);

if (import.meta.env.DEV && !(root instanceof HTMLElement)) {
  throw new Error(
    'Root element not found. Did you forget to add it to your index.html? Or maybe the id attribute got misspelled?',
  );
}

render(() =>
  <SupabaseProvider client={supabase}>
    <Router>
      <App />
    </Router>
  </SupabaseProvider>
  , root!);
