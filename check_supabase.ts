import { createClient } from '@supabase/supabase-js';

const url = process.env.VITE_SUPABASE_URL;
const key = process.env.VITE_SUPABASE_PUBLISHABLE_KEY;

console.log('Checking Supabase connection...');
console.log('URL:', url);
console.log('Key length:', key ? key.length : 0);

if (!url || !key) {
    console.error('Error: Missing environment variables VITE_SUPABASE_URL or VITE_SUPABASE_PUBLISHABLE_KEY');
    process.exit(1);
}

const supabase = createClient(url, key);

async function test() {
    try {
        // Try to select from blog_posts. Even if empty, it should return [] not error if connection works.
        // If RLS blocks it, we get a specific error.
        const { data, error } = await supabase.from('blog_posts').select('id').limit(1);

        if (error) {
            console.error('Supabase API Error:', error.message, error.code, error.details);
        } else {
            console.log('Success! Connection established.');
            console.log('Data received:', data);
        }
    } catch (err) {
        console.error('Unexpected execution error:', err);
    }
}

test();
