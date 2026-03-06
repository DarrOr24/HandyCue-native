-- Fix avatar upload: "new row violates row-level security policy"
-- Run this in Supabase Dashboard → SQL Editor

-- Drop old policies (in case you ran the previous version)
DROP POLICY IF EXISTS "Avatar images are publicly readable" ON storage.objects;
DROP POLICY IF EXISTS "Users can upload their own avatar" ON storage.objects;
DROP POLICY IF EXISTS "Users can update their own avatar" ON storage.objects;
DROP POLICY IF EXISTS "Users can delete their own avatar" ON storage.objects;

-- 1. Public read
CREATE POLICY "Avatar images are publicly readable"
ON storage.objects FOR SELECT
USING (bucket_id = 'avatars');

-- 2. Insert: users can upload to profiles/{their_user_id}.jpg
CREATE POLICY "Users can upload their own avatar"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (
  bucket_id = 'avatars'
  AND name = 'profiles/' || auth.uid()::text || '.jpg'
);

-- 3. Update: for upsert/replace
CREATE POLICY "Users can update their own avatar"
ON storage.objects FOR UPDATE
TO authenticated
USING (
  bucket_id = 'avatars'
  AND name = 'profiles/' || auth.uid()::text || '.jpg'
);

-- 4. Delete
CREATE POLICY "Users can delete their own avatar"
ON storage.objects FOR DELETE
TO authenticated
USING (
  bucket_id = 'avatars'
  AND name = 'profiles/' || auth.uid()::text || '.jpg'
);
