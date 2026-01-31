CREATE TABLE IF NOT EXISTS generations (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  type text NOT NULL,
  topic text NOT NULL,
  content text NOT NULL,
  metadata jsonb DEFAULT '{}',
  created_at timestamptz DEFAULT now()
);

ALTER TABLE generations ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can read generations"
  ON generations
  FOR SELECT
  TO anon
  USING (true);

CREATE POLICY "Anyone can insert generations"
  ON generations
  FOR INSERT
  TO anon
  WITH CHECK (true);