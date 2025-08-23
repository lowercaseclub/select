-- Migration: Add TO authenticated clause to events_speakers RLS policies
-- Run this in Supabase SQL Editor

-- Drop existing policies
DROP POLICY IF EXISTS "Service role can insert speaker applications" ON events_speakers;
DROP POLICY IF EXISTS "Service role can read speaker applications" ON events_speakers;
DROP POLICY IF EXISTS "Service role can update speaker applications" ON events_speakers;
DROP POLICY IF EXISTS "Service role can delete speaker applications" ON events_speakers;

-- Recreate policies with TO authenticated clause
CREATE POLICY "Service role can insert speaker applications" ON events_speakers
    FOR INSERT
    TO authenticated
    WITH CHECK (auth.role() = 'service_role');

CREATE POLICY "Service role can read speaker applications" ON events_speakers
    FOR SELECT
    TO authenticated
    USING (auth.role() = 'service_role');

CREATE POLICY "Service role can update speaker applications" ON events_speakers
    FOR UPDATE
    TO authenticated
    USING (auth.role() = 'service_role');

CREATE POLICY "Service role can delete speaker applications" ON events_speakers
    FOR DELETE
    TO authenticated
    USING (auth.role() = 'service_role');
