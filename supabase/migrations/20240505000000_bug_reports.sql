-- Create bug_reports table
CREATE TABLE IF NOT EXISTS public.bug_reports (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES auth.users(id),
    category TEXT NOT NULL,
    severity TEXT NOT NULL,
    title TEXT NOT NULL,
    description TEXT NOT NULL,
    steps_to_reproduce TEXT,
    expected_behavior TEXT,
    actual_behavior TEXT,
    device_info JSONB,
    email TEXT,
    status TEXT DEFAULT 'open',
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.bug_reports ENABLE ROW LEVEL SECURITY;

-- Allow authenticated users to insert their own reports
CREATE POLICY "Users can insert their own bug reports" ON public.bug_reports
    FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Allow users to view their own reports
CREATE POLICY "Users can view their own bug reports" ON public.bug_reports
    FOR SELECT USING (auth.uid() = user_id);
