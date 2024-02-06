CREATE DATABASE dev_db;
CREATE DATABASE risk_incident_reporting_db;

\c dev_db;

CREATE TABLE IF NOT EXISTS safety_levels (
    id SERIAL PRIMARY KEY,
    flag VARCHAR(255) UNIQUE NOT NULL,
    description TEXT
);

INSERT INTO safety_levels (flag, description) VALUES
    ('1', 'Safe'),
    ('2', 'Caution'),
    ('3', 'Warning'),
    ('4', 'Danger'),
    ('5', 'Extreme Danger');

CREATE TABLE IF NOT EXISTS processing_flags (
    id SERIAL PRIMARY KEY,
    flag VARCHAR(255) UNIQUE NOT NULL,
    description TEXT
);

INSERT INTO processing_flags (flag, description) VALUES
    ('1', 'waiting'),
    ('2', 'inProgress'),
    ('3', 'Completed'),
    ('4', 'onHold'),
    ('5', 'to be verified');

-- -- Create ActionableTask table
-- CREATE TABLE IF NOT EXISTS actionable_tasks (
--   id SERIAL PRIMARY KEY,
--   avg_point_x INTEGER NOT NULL,
--   avg_point_y INTEGER NOT NULL,
--   category VARCHAR(255) NOT NULL,
--   event_cnt INTEGER NOT NULL,
--   created_time TIMESTAMP NOT NULL,
--   updated_time TIMESTAMP NOT NULL,
--   process_flag VARCHAR(255) NOT NULL,
--   version VARCHAR(255) NOT NULL
-- );

-- -- Create EventReport table
-- CREATE TABLE IF NOT EXISTS event_reports (
--   id SERIAL PRIMARY KEY,
--   source_id VARCHAR(255) NOT NULL,
--   category VARCHAR(255) NOT NULL,
--   level VARCHAR(255) NOT NULL,
--   image_name VARCHAR(255) NOT NULL,
--   process_flag VARCHAR(255) NOT NULL,
--   created_time TIMESTAMP NOT NULL,
--   updated_time TIMESTAMP NOT NULL,
--   version VARCHAR(255) NOT NULL,
--   x INTEGER NOT NULL,
--   y INTEGER NOT NULL
-- );

-- -- Create Many-to-Many relationship table
-- CREATE TABLE IF NOT EXISTS actionable_task_event_report (
--   actionable_task_id INTEGER REFERENCES actionable_tasks(id),
--   event_report_id INTEGER REFERENCES event_reports(id),
--   PRIMARY KEY (actionable_task_id, event_report_id)
-- );

\c risk_incident_reporting_db;

CREATE TABLE IF NOT EXISTS safety_levels (
    id SERIAL PRIMARY KEY,
    flag VARCHAR(255) UNIQUE NOT NULL,
    description TEXT
);

INSERT INTO safety_levels (flag, description) VALUES
    ('1', 'Safe'),
    ('2', 'Caution'),
    ('3', 'Warning'),
    ('4', 'Danger'),
    ('5', 'Extreme Danger');

CREATE TABLE IF NOT EXISTS  processing_flags (
    id SERIAL PRIMARY KEY,
    flag VARCHAR(255) UNIQUE NOT NULL,
    description TEXT
);

INSERT INTO processing_flags (flag, description) VALUES
    ('1', 'waiting'),
    ('2', 'inProgress'),
    ('3', 'Completed'),
    ('4', 'onHold'),
    ('5', 'to be verified');

-- -- Create ActionableTask table
-- CREATE TABLE IF NOT EXISTS actionable_tasks (
--   id SERIAL PRIMARY KEY,
--   avg_point_x INTEGER NOT NULL,
--   avg_point_y INTEGER NOT NULL,
--   category VARCHAR(255) NOT NULL,
--   event_cnt INTEGER NOT NULL,
--   created_time TIMESTAMP NOT NULL,
--   updated_time TIMESTAMP NOT NULL,
--   process_flag VARCHAR(255) NOT NULL,
--   version VARCHAR(255) NOT NULL
-- );

-- -- Create EventReport table
-- CREATE TABLE IF NOT EXISTS event_reports (
--   id SERIAL PRIMARY KEY,
--   source_id VARCHAR(255) NOT NULL,
--   category VARCHAR(255) NOT NULL,
--   level VARCHAR(255) NOT NULL,
--   image_name VARCHAR(255) NOT NULL,
--   process_flag VARCHAR(255) NOT NULL,
--   created_time TIMESTAMP NOT NULL,
--   updated_time TIMESTAMP NOT NULL,
--   version VARCHAR(255) NOT NULL,
--   x INTEGER NOT NULL,
--   y INTEGER NOT NULL
-- );

-- -- Create Many-to-Many relationship table
-- CREATE TABLE IF NOT EXISTS actionable_task_event_report (
--   actionable_task_id INTEGER REFERENCES actionable_tasks(id),
--   event_report_id INTEGER REFERENCES event_reports(id),
--   PRIMARY KEY (actionable_task_id, event_report_id)
-- );


