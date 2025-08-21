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
DO $$ 
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.table_constraints 
        WHERE table_name = 'applications_select25' 
        AND constraint_name = 'applications_select25_email_unique'
    ) THEN
        ALTER TABLE applications_select25 ADD CONSTRAINT applications_select25_email_unique UNIQUE (email);
    END IF;
END $$;

-- Create index on email for faster lookups
CREATE INDEX IF NOT EXISTS idx_applications_select25_email ON applications_select25(email);

-- Create temporary applications table for unverified submissions
CREATE TABLE IF NOT EXISTS applications_select25_tmp (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  first_name TEXT NOT NULL,
  last_name TEXT NOT NULL,
  email TEXT NOT NULL,
  company TEXT,
  linkedin TEXT,
  github TEXT,
  twitter TEXT,
  verification_token UUID DEFAULT gen_random_uuid(),
  verified_at TIMESTAMP WITH TIME ZONE,
  expires_at TIMESTAMP WITH TIME ZONE DEFAULT (NOW() + INTERVAL '24 hours'),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create unique constraint on email for temp table
DO $$ 
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.table_constraints 
        WHERE table_name = 'applications_select25_tmp' 
        AND constraint_name = 'applications_select25_tmp_email_unique'
    ) THEN
        ALTER TABLE applications_select25_tmp ADD CONSTRAINT applications_select25_tmp_email_unique UNIQUE (email);
    END IF;
END $$;

-- Create index on verification token for fast lookups
CREATE INDEX IF NOT EXISTS idx_applications_select25_tmp_token ON applications_select25_tmp(verification_token);

-- Create index on email for temp table
CREATE INDEX IF NOT EXISTS idx_applications_select25_tmp_email ON applications_select25_tmp(email);

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

-- Add initial_rating column if it doesn't exist (for existing tables)
DO $$ 
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'applications_select25' 
        AND column_name = 'initial_rating'
    ) THEN
        ALTER TABLE applications_select25 ADD COLUMN initial_rating JSONB;
    END IF;
END $$;

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

-- Enable RLS for temp applications table
ALTER TABLE applications_select25_tmp ENABLE ROW LEVEL SECURITY;

-- Policies for temp applications table
DROP POLICY IF EXISTS "Service role can insert temp applications" ON applications_select25_tmp;
DROP POLICY IF EXISTS "Service role can update temp applications" ON applications_select25_tmp;
DROP POLICY IF EXISTS "Service role can delete temp applications" ON applications_select25_tmp;
DROP POLICY IF EXISTS "Service role can read temp applications" ON applications_select25_tmp;

CREATE POLICY "Service role can insert temp applications" ON applications_select25_tmp
    FOR INSERT
    TO service_role
    WITH CHECK (true);

CREATE POLICY "Service role can update temp applications" ON applications_select25_tmp
    FOR UPDATE
    TO service_role
    USING (true)
    WITH CHECK (true);

CREATE POLICY "Service role can delete temp applications" ON applications_select25_tmp
    FOR DELETE
    TO service_role
    USING (true);

CREATE POLICY "Service role can read temp applications" ON applications_select25_tmp
    FOR SELECT
    TO service_role
    USING (true);

-- Create events_speakers table for speaking applications
CREATE TABLE IF NOT EXISTS events_speakers (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    first_name TEXT NOT NULL,
    last_name TEXT NOT NULL,
    email TEXT NOT NULL,
    company TEXT,
    city TEXT,
    country TEXT,
    linkedin_profile TEXT NOT NULL,
    github_profile TEXT NOT NULL,
    talk_description TEXT NOT NULL,
    interested_future_events BOOLEAN DEFAULT FALSE,
    source TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Add indexes for common queries
CREATE INDEX IF NOT EXISTS idx_events_speakers_email ON events_speakers(email);
CREATE INDEX IF NOT EXISTS idx_events_speakers_created_at ON events_speakers(created_at);
CREATE INDEX IF NOT EXISTS idx_events_speakers_interested_future_events ON events_speakers(interested_future_events);

-- Create trigger to automatically update updated_at for events_speakers
DROP TRIGGER IF EXISTS update_events_speakers_updated_at ON events_speakers;
CREATE TRIGGER update_events_speakers_updated_at 
    BEFORE UPDATE ON events_speakers 
    FOR EACH ROW 
    EXECUTE FUNCTION update_updated_at_column();

-- Enable RLS for events_speakers table
ALTER TABLE events_speakers ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist
DROP POLICY IF EXISTS "Service role can insert speaker applications" ON events_speakers;
DROP POLICY IF EXISTS "Service role can read speaker applications" ON events_speakers;
DROP POLICY IF EXISTS "Service role can update speaker applications" ON events_speakers;
DROP POLICY IF EXISTS "Service role can delete speaker applications" ON events_speakers;

-- Policy to allow service role to insert applications (for API endpoint)
CREATE POLICY "Service role can insert speaker applications" ON events_speakers
    FOR INSERT WITH CHECK (auth.role() = 'service_role');

-- Policy to allow service role to read applications (for admin purposes)
CREATE POLICY "Service role can read speaker applications" ON events_speakers
    FOR SELECT USING (auth.role() = 'service_role');

-- Policy to allow service role to update applications (for admin purposes)
CREATE POLICY "Service role can update speaker applications" ON events_speakers
    FOR UPDATE USING (auth.role() = 'service_role');

-- Policy to allow service role to delete applications (for admin purposes)
CREATE POLICY "Service role can delete speaker applications" ON events_speakers
    FOR DELETE USING (auth.role() = 'service_role');

-- Add comments for documentation
COMMENT ON TABLE events_speakers IS 'Stores speaking applications for Supabase events';
COMMENT ON COLUMN events_speakers.first_name IS 'First name of the speaker applicant';
COMMENT ON COLUMN events_speakers.last_name IS 'Last name of the speaker applicant';
COMMENT ON COLUMN events_speakers.email IS 'Email address of the speaker applicant';
COMMENT ON COLUMN events_speakers.company IS 'Company name (optional)';
COMMENT ON COLUMN events_speakers.city IS 'City (optional)';
COMMENT ON COLUMN events_speakers.country IS 'Country (optional)';
COMMENT ON COLUMN events_speakers.linkedin_profile IS 'LinkedIn profile URL';
COMMENT ON COLUMN events_speakers.github_profile IS 'GitHub profile URL';
COMMENT ON COLUMN events_speakers.talk_description IS 'Description of the proposed talk';
COMMENT ON COLUMN events_speakers.interested_future_events IS 'Whether applicant is interested in future events if not selected for current event';
COMMENT ON COLUMN events_speakers.source IS 'Source of the speaking application (e.g., Select 2025)';
COMMENT ON COLUMN events_speakers.created_at IS 'Timestamp when the application was created';
COMMENT ON COLUMN events_speakers.updated_at IS 'Timestamp when the application was last updated';
