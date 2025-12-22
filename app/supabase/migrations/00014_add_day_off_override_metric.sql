-- Add day_off_override metric for when user overrides a scheduled day off
-- This allows users to "make today a work day" even if they previously scheduled it as a day off

INSERT INTO metrics (key, label, type, day_specific, sequence_key)
VALUES ('day_off_override', 'Day Off Override', 'boolean', true, 'morning');
