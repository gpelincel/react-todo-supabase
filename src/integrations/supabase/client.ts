// This file is automatically generated. Do not edit it directly.
import { createClient } from '@supabase/supabase-js';
import type { Database } from './types';

const SUPABASE_URL = "https://mslcooyqmxpedevqwniv.supabase.co";
const SUPABASE_PUBLISHABLE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im1zbGNvb3lxbXhwZWRldnF3bml2Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDg5MDY4MjIsImV4cCI6MjA2NDQ4MjgyMn0.iOnW2h_fs_1uX3dwSVeOmJ-Oqr2ud6pe40S82kstPrE";

// Import the supabase client like this:
// import { supabase } from "@/integrations/supabase/client";

export const supabase = createClient<Database>(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY);