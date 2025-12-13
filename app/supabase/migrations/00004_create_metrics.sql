-- Metric definitions (what data we collect)
-- Separate from pages to allow flexible UX changes

CREATE TYPE metric_type AS ENUM (
    'text',
    'integer', 
    'date',
    'time',
    'boolean',
    'scale_1_10',
    'choice'
);

CREATE TABLE metrics (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    key TEXT UNIQUE NOT NULL,           -- 'user_name', 'positivity_rating', etc.
    label TEXT NOT NULL,                -- Human readable label
    type metric_type NOT NULL,
    
    -- Categorization
    day_specific BOOLEAN DEFAULT true,  -- false = onboarding (collected once per user)
    sequence_key TEXT,                  -- which sequence this metric belongs to
    
    -- Versioning
    ux_version TEXT DEFAULT 'v1',
    active BOOLEAN DEFAULT true,
    
    created_at TIMESTAMPTZ DEFAULT now()
);

-- Core metrics from the spec
INSERT INTO metrics (key, label, type, day_specific, sequence_key) VALUES
    -- Onboarding metrics (day_specific = false, collected once per user lifetime)
    ('user_name', 'User Name', 'text', false, 'onboarding'),
    ('user_timezone', 'User Timezone', 'text', false, 'onboarding'),
    ('remembers_efd', 'Remembers Last Execution Flow Day', 'boolean', false, 'onboarding'),
    ('last_efd_date', 'Last Execution Flow Day Date', 'date', false, 'onboarding'),
    
    -- Morning metrics (day_specific = true, collected each day)
    ('magic_task', 'Magic Task Description', 'text', true, 'morning'),
    ('magic_task_completed', 'Magic Task Completed', 'boolean', true, 'morning'),
    ('evening_reflection_time', 'Planned Evening Reflection Time', 'time', true, 'morning'),
    
    -- Evening metrics (day_specific = true, collected each day)
    ('committed_tomorrow', 'Committed to Return Tomorrow', 'boolean', true, 'evening'),
    ('taking_day_off', 'Taking Day Off Tomorrow', 'boolean', true, 'evening'),
    ('return_date', 'Committed Return Date', 'date', true, 'evening'),
    ('rating_positivity', 'Positivity Rating (1-10)', 'scale_1_10', true, 'evening'),
    ('rating_confidence', 'Confidence Rating (1-10)', 'scale_1_10', true, 'evening'),
    ('rating_overthinking', 'Overthinking Rating (1-10)', 'scale_1_10', true, 'evening'),
    ('rating_intuition', 'Intuition Rating (1-10)', 'scale_1_10', true, 'evening'),
    ('rating_doubt', 'Doubt Rating (1-10)', 'scale_1_10', true, 'evening'),
    ('rating_happiness', 'Happiness Rating (1-10)', 'scale_1_10', true, 'evening'),
    ('rating_decision_speed', 'Decision Speed Rating (1-10)', 'scale_1_10', true, 'evening');

-- Index for fast lookups
CREATE INDEX idx_metrics_key ON metrics(key);
CREATE INDEX idx_metrics_sequence ON metrics(sequence_key);
