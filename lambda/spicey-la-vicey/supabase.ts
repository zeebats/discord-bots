import { createClient } from '@supabase/supabase-js';

import type { Database } from '@/types/supabase';

const {
	SUPABASE_API_KEY = '',
	SUPABASE_URL = '',
} = process.env;

export const $supabase = createClient<Database>(SUPABASE_URL, SUPABASE_API_KEY);
