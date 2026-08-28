import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://bdznvazjusxevdtdtuvr.supabase.co';
const supabaseAnonKey = 'sb_publishable_X7Pi041iRpaKDV0OogPXGQ_B01F3UKG';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);