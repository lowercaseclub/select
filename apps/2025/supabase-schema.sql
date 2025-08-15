-- Create applications_select25 table
CREATE TABLE IF NOT EXISTS applications_select25 (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  first_name TEXT NOT NULL,
  last_name TEXT NOT NULL,
  email TEXT NOT NULL,
  company TEXT,
  linkedin TEXT,
  github TEXT,
  twitter TEXT,
  initial_rating JSONB,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create unique constraint on email to enable upsert operations
ALTER TABLE applications_select25 ADD CONSTRAINT IF NOT EXISTS applications_select25_email_unique UNIQUE (email);

-- Create index on email for faster lookups
CREATE INDEX IF NOT EXISTS idx_applications_select25_email ON applications_select25(email);

-- Create a function to automatically update the updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Drop trigger if it exists, then create it
DROP TRIGGER IF EXISTS update_applications_select25_updated_at ON applications_select25;

-- Create trigger to automatically update updated_at
CREATE TRIGGER update_applications_select25_updated_at 
    BEFORE UPDATE ON applications_select25 
    FOR EACH ROW 
    EXECUTE FUNCTION update_updated_at_column();

-- Enable Row Level Security (this is idempotent)
ALTER TABLE applications_select25 ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist
DROP POLICY IF EXISTS "Service role can insert applications" ON applications_select25;
DROP POLICY IF EXISTS "Service role can update applications" ON applications_select25;
DROP POLICY IF EXISTS "Service role can delete applications" ON applications_select25;
DROP POLICY IF EXISTS "Service role can read applications" ON applications_select25;

-- Policy for service role to insert data (your application)
CREATE POLICY "Service role can insert applications" ON applications_select25
    FOR INSERT
    TO service_role
    WITH CHECK (true);

-- Policy for service role to update data (your application)
CREATE POLICY "Service role can update applications" ON applications_select25
    FOR UPDATE
    TO service_role
    USING (true)
    WITH CHECK (true);

-- Policy for service role to delete data (your application)
CREATE POLICY "Service role can delete applications" ON applications_select25
    FOR DELETE
    TO service_role
    USING (true);

-- Policy for service role to read data (your application)
CREATE POLICY "Service role can read applications" ON applications_select25
    FOR SELECT
    TO service_role
    USING (true);
