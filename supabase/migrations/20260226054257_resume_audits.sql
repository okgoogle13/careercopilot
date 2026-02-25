CREATE TABLE resume_audits (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id),
  resume_hash TEXT NOT NULL,
  audit_result JSONB NOT NULL,
  strictness_mode TEXT DEFAULT 'moderate',
  processing_time_ms INTEGER,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_user_audits ON resume_audits (user_id, created_at DESC);
CREATE INDEX idx_resume_hash ON resume_audits (resume_hash);

ALTER TABLE resume_audits ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users view own audits"
  ON resume_audits FOR SELECT
  USING (auth.uid() = user_id);
