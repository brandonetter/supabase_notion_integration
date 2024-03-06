import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
dotenv.config();

export default createClient(process.env.DB_URL, process.env.DB_KEY);

