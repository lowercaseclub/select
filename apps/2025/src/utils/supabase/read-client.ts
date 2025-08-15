// for later reference and use by utilities we build to read from supabase and populate Bizzabo

import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
  throw new Error("Missing Supabase environment variables");
}

// Create a read-only client using the service role key
export const createReadClient = () => {
  return createClient(supabaseUrl, supabaseServiceKey);
};

// Helper function to get all applications
export const getAllApplications = async () => {
  const supabase = createReadClient();
  const { data, error } = await supabase
    .from("applications_select25")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) {
    throw new Error(`Failed to fetch applications: ${error.message}`);
  }

  return data;
};

// Helper function to get applications by email
export const getApplicationsByEmail = async (email: string) => {
  const supabase = createReadClient();
  const { data, error } = await supabase
    .from("applications_select25")
    .select("*")
    .eq("email", email)
    .order("created_at", { ascending: false });

  if (error) {
    throw new Error(
      `Failed to fetch applications for email ${email}: ${error.message}`
    );
  }

  return data;
};
