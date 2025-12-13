-- Sequence definitions (onboarding, morning, evening)
CREATE TABLE sequences (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    key TEXT UNIQUE NOT NULL,           -- 'onboarding', 'morning', 'evening'
    name TEXT NOT NULL,
    ux_version TEXT NOT NULL DEFAULT 'v1',
    active BOOLEAN DEFAULT true,
    created_at TIMESTAMPTZ DEFAULT now()
);

-- Individual pages within sequences
CREATE TABLE pages (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    sequence_id UUID NOT NULL REFERENCES sequences(id) ON DELETE CASCADE,
    key TEXT NOT NULL,                  -- 'v1-o-1', 'v1-m-16', etc.
    display_order INTEGER NOT NULL,
    
    -- Page content (flexible JSON structure)
    content JSONB DEFAULT '{}',         -- {heading: "...", text: "...", buttons: [...]}
    
    -- Branching logic (optional)
    branch_logic JSONB,                 -- {condition: "response.choice", routes: {...}}
    
    -- Metric collection on this page (optional)
    collects_metric_key TEXT,           -- which metric this page collects, if any
    
    created_at TIMESTAMPTZ DEFAULT now(),
    UNIQUE(sequence_id, key)
);

-- Insert sequence definitions for UXv1
INSERT INTO sequences (key, name, ux_version) VALUES
    ('onboarding', 'Onboarding Sequence', 'v1'),
    ('morning', 'Morning Sequence', 'v1'),
    ('evening', 'Evening Sequence', 'v1');

-- Indexes
CREATE INDEX idx_pages_sequence ON pages(sequence_id);
CREATE INDEX idx_pages_key ON pages(key);
