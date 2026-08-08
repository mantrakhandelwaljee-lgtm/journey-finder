const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

const supabase = createClient(supabaseUrl, supabaseKey);

async function check() {
  const { data, error } = await supabase.from('journeys').select('*');
  console.log("Error:", error);
  console.log("Journeys count:", data ? data.length : 0);
  if (data && data.length > 0) {
    console.log("First journey:", data[0]);
  }
}
check();
