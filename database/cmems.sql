-- ============================================================
-- Church Ministry and Event Management System (CMEMS)
-- Full MySQL 8 Database Schema + Seed Data
-- ============================================================

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
SET time_zone = "+00:00";
SET FOREIGN_KEY_CHECKS = 0;

CREATE DATABASE IF NOT EXISTS `cmems_db`
  CHARACTER SET utf8mb4
  COLLATE utf8mb4_unicode_ci;

USE `cmems_db`;

-- ============================================================
-- TABLE: roles
-- ============================================================
CREATE TABLE IF NOT EXISTS `roles` (
  `id`          INT UNSIGNED NOT NULL AUTO_INCREMENT,
  `name`        VARCHAR(50)  NOT NULL,
  `description` VARCHAR(255) DEFAULT NULL,
  `created_at`  TIMESTAMP    NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `uq_roles_name` (`name`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

INSERT INTO `roles` (`id`, `name`, `description`) VALUES
(1, 'Super Administrator', 'Full system access'),
(2, 'Ministry Leader',     'Manages ministry members and events'),
(3, 'Choir Coordinator',   'Manages choir and practice scheduling'),
(4, 'Volunteer',           'Views assignments and confirms participation'),
(5, 'Church Member',       'Views events and personal history');

-- ============================================================
-- TABLE: users
-- ============================================================
CREATE TABLE IF NOT EXISTS `users` (
  `id`         INT UNSIGNED NOT NULL AUTO_INCREMENT,
  `role_id`    INT UNSIGNED NOT NULL,
  `first_name` VARCHAR(80)  NOT NULL,
  `last_name`  VARCHAR(80)  NOT NULL,
  `email`      VARCHAR(180) NOT NULL,
  `password`   VARCHAR(255) NOT NULL,
  `status`     ENUM('Active','Inactive') NOT NULL DEFAULT 'Active',
  `created_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `uq_users_email` (`email`),
  KEY `fk_users_role` (`role_id`),
  CONSTRAINT `fk_users_role` FOREIGN KEY (`role_id`) REFERENCES `roles` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Passwords are bcrypt hashes of "Admin@123"
INSERT INTO `users` (`id`, `role_id`, `first_name`, `last_name`, `email`, `password`, `status`) VALUES
(1, 1, 'System',   'Admin',      'admin@cmems.com',      '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy', 'Active'),
(2, 2, 'John',     'Dela Cruz',  'leader@cmems.com',     '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy', 'Active'),
(3, 3, 'Maria',    'Santos',     'choir@cmems.com',      '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy', 'Active'),
(4, 4, 'Pedro',    'Reyes',      'volunteer@cmems.com',  '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy', 'Active'),
(5, 5, 'Ana',      'Gonzales',   'member@cmems.com',     '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy', 'Active');

-- ============================================================
-- TABLE: members
-- ============================================================
CREATE TABLE IF NOT EXISTS `members` (
  `id`             INT UNSIGNED NOT NULL AUTO_INCREMENT,
  `user_id`        INT UNSIGNED DEFAULT NULL,
  `first_name`     VARCHAR(80)  NOT NULL,
  `middle_name`    VARCHAR(80)  DEFAULT NULL,
  `last_name`      VARCHAR(80)  NOT NULL,
  `gender`         ENUM('Male','Female','Other') NOT NULL,
  `birthdate`      DATE         DEFAULT NULL,
  `contact_number` VARCHAR(30)  DEFAULT NULL,
  `email`          VARCHAR(180) DEFAULT NULL,
  `address`        TEXT         DEFAULT NULL,
  `date_joined`    DATE         NOT NULL DEFAULT (CURDATE()),
  `status`         ENUM('Active','Inactive','Deceased') NOT NULL DEFAULT 'Active',
  `created_at`     TIMESTAMP    NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at`     TIMESTAMP    NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `idx_members_last_name` (`last_name`),
  KEY `idx_members_email`     (`email`),
  KEY `fk_members_user`       (`user_id`),
  CONSTRAINT `fk_members_user` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

INSERT INTO `members` (`id`, `user_id`, `first_name`, `middle_name`, `last_name`, `gender`, `birthdate`, `contact_number`, `email`, `address`, `date_joined`, `status`) VALUES
(1,  2, 'John',     'A.',  'Dela Cruz',  'Male',   '1985-03-14', '09171234567', 'leader@cmems.com',    'Cavite City',     '2020-01-15', 'Active'),
(2,  3, 'Maria',    'B.',  'Santos',     'Female', '1990-07-22', '09181234567', 'choir@cmems.com',     'Bacoor, Cavite',  '2020-02-20', 'Active'),
(3,  4, 'Pedro',    'C.',  'Reyes',      'Male',   '1992-11-05', '09191234567', 'volunteer@cmems.com', 'Imus, Cavite',    '2021-03-10', 'Active'),
(4,  5, 'Ana',      'D.',  'Gonzales',   'Female', '1995-05-30', '09201234567', 'member@cmems.com',    'Dasmariñas',     '2021-06-01', 'Active'),
(5,  NULL,'Roberto','E.',  'Tan',        'Male',   '1978-09-12', '09211234567', 'roberto@example.com', 'Tagaytay City',   '2019-08-18', 'Active'),
(6,  NULL,'Grace',  'F.',  'Lim',        'Female', '1983-12-01', '09221234567', 'grace@example.com',   'Silang, Cavite',  '2022-01-05', 'Active'),
(7,  NULL,'Mark',   'G.',  'Torres',     'Male',   '2001-04-20', '09231234567', 'mark@example.com',    'General Trias',   '2023-03-15', 'Active'),
(8,  NULL,'Liza',   'H.',  'Villanueva', 'Female', '1999-08-08', '09241234567', 'liza@example.com',    'Carmona, Cavite', '2022-07-22', 'Active');

-- ============================================================
-- TABLE: ministries
-- ============================================================
CREATE TABLE IF NOT EXISTS `ministries` (
  `id`          INT UNSIGNED NOT NULL AUTO_INCREMENT,
  `name`        VARCHAR(120) NOT NULL,
  `description` TEXT         DEFAULT NULL,
  `leader_id`   INT UNSIGNED DEFAULT NULL,
  `status`      ENUM('Active','Inactive') NOT NULL DEFAULT 'Active',
  `created_at`  TIMESTAMP    NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at`  TIMESTAMP    NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `uq_ministries_name` (`name`),
  KEY `fk_ministries_leader` (`leader_id`),
  CONSTRAINT `fk_ministries_leader` FOREIGN KEY (`leader_id`) REFERENCES `members` (`id`) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

INSERT INTO `ministries` (`id`, `name`, `description`, `leader_id`, `status`) VALUES
(1, 'Youth Ministry',    'Serving the young people of the church',              1, 'Active'),
(2, 'Music Ministry',    'Glorifying God through music and song',               2, 'Active'),
(3, 'Worship Ministry',  'Leading the congregation in corporate worship',       1, 'Active'),
(4, 'Outreach Ministry', 'Evangelism and community service',                    5, 'Active'),
(5, 'Media Ministry',    'Handling audio/visual and live streaming',            3, 'Active');

-- ============================================================
-- TABLE: member_ministries  (junction)
-- ============================================================
CREATE TABLE IF NOT EXISTS `member_ministries` (
  `id`          INT UNSIGNED NOT NULL AUTO_INCREMENT,
  `member_id`   INT UNSIGNED NOT NULL,
  `ministry_id` INT UNSIGNED NOT NULL,
  `role`        VARCHAR(80)  DEFAULT 'Member',
  `date_joined` DATE         NOT NULL DEFAULT (CURDATE()),
  `status`      ENUM('Active','Inactive') NOT NULL DEFAULT 'Active',
  PRIMARY KEY (`id`),
  UNIQUE KEY `uq_member_ministry` (`member_id`, `ministry_id`),
  KEY `fk_mm_ministry` (`ministry_id`),
  CONSTRAINT `fk_mm_member`   FOREIGN KEY (`member_id`)   REFERENCES `members`    (`id`) ON DELETE CASCADE,
  CONSTRAINT `fk_mm_ministry` FOREIGN KEY (`ministry_id`) REFERENCES `ministries` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

INSERT INTO `member_ministries` (`member_id`, `ministry_id`, `role`, `date_joined`) VALUES
(1, 1, 'Leader',  '2020-01-15'),
(2, 2, 'Leader',  '2020-02-20'),
(3, 1, 'Member',  '2021-03-10'),
(4, 3, 'Member',  '2021-06-01'),
(5, 4, 'Leader',  '2019-08-18'),
(6, 5, 'Member',  '2022-01-05'),
(7, 1, 'Member',  '2023-03-15'),
(8, 2, 'Member',  '2022-07-22'),
(1, 3, 'Member',  '2020-06-01'),
(3, 5, 'Member',  '2022-02-10');

-- ============================================================
-- TABLE: choirs
-- ============================================================
CREATE TABLE IF NOT EXISTS `choirs` (
  `id`             INT UNSIGNED NOT NULL AUTO_INCREMENT,
  `name`           VARCHAR(120) NOT NULL,
  `description`    TEXT         DEFAULT NULL,
  `coordinator_id` INT UNSIGNED DEFAULT NULL,
  `status`         ENUM('Active','Inactive') NOT NULL DEFAULT 'Active',
  `created_at`     TIMESTAMP    NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at`     TIMESTAMP    NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `fk_choirs_coordinator` (`coordinator_id`),
  CONSTRAINT `fk_choirs_coordinator` FOREIGN KEY (`coordinator_id`) REFERENCES `members` (`id`) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

INSERT INTO `choirs` (`id`, `name`, `description`, `coordinator_id`) VALUES
(1, 'Main Choir',    'The primary worship choir of the church', 2),
(2, 'Youth Choir',   'Choir composed of youth members',         3),
(3, 'Praise Team',   'Contemporary worship team',               2);

-- ============================================================
-- TABLE: choir_members  (junction)
-- ============================================================
CREATE TABLE IF NOT EXISTS `choir_members` (
  `id`          INT UNSIGNED NOT NULL AUTO_INCREMENT,
  `choir_id`    INT UNSIGNED NOT NULL,
  `member_id`   INT UNSIGNED NOT NULL,
  `voice_part`  VARCHAR(50)  DEFAULT NULL,
  `date_joined` DATE         NOT NULL DEFAULT (CURDATE()),
  `status`      ENUM('Active','Inactive') NOT NULL DEFAULT 'Active',
  PRIMARY KEY (`id`),
  UNIQUE KEY `uq_choir_member` (`choir_id`, `member_id`),
  KEY `fk_cm_member` (`member_id`),
  CONSTRAINT `fk_cm_choir`  FOREIGN KEY (`choir_id`)  REFERENCES `choirs`  (`id`) ON DELETE CASCADE,
  CONSTRAINT `fk_cm_member` FOREIGN KEY (`member_id`) REFERENCES `members` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

INSERT INTO `choir_members` (`choir_id`, `member_id`, `voice_part`, `date_joined`) VALUES
(1, 2, 'Soprano', '2020-02-20'),
(1, 6, 'Alto',    '2022-01-05'),
(1, 8, 'Soprano', '2022-07-22'),
(2, 7, 'Tenor',   '2023-03-15'),
(2, 3, 'Bass',    '2021-03-10'),
(3, 1, 'Baritone','2020-06-01'),
(3, 4, 'Alto',    '2021-06-01');

-- ============================================================
-- TABLE: events
-- ============================================================
CREATE TABLE IF NOT EXISTS `events` (
  `id`                    INT UNSIGNED    NOT NULL AUTO_INCREMENT,
  `title`                 VARCHAR(200)    NOT NULL,
  `description`           TEXT            DEFAULT NULL,
  `event_type`            ENUM('Sunday Worship','Bible Study','Youth Camp','Retreat','Choir Practice','Special Event','Outreach','Conference') NOT NULL,
  `venue`                 VARCHAR(200)    DEFAULT NULL,
  `start_date`            DATETIME        NOT NULL,
  `end_date`              DATETIME        NOT NULL,
  `capacity`              INT UNSIGNED    DEFAULT NULL,
  `status`                ENUM('Upcoming','Ongoing','Completed','Cancelled') NOT NULL DEFAULT 'Upcoming',
  `total_attendees`       INT UNSIGNED    NOT NULL DEFAULT 0,
  `attendance_percentage` DECIMAL(5,2)    NOT NULL DEFAULT 0.00,
  `created_by`            INT UNSIGNED    DEFAULT NULL,
  `created_at`            TIMESTAMP       NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at`            TIMESTAMP       NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `idx_events_start_date` (`start_date`),
  KEY `fk_events_created_by`  (`created_by`),
  CONSTRAINT `fk_events_created_by` FOREIGN KEY (`created_by`) REFERENCES `users` (`id`) ON DELETE SET NULL,
  CONSTRAINT `chk_events_dates` CHECK (`end_date` >= `start_date`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

INSERT INTO `events` (`id`, `title`, `description`, `event_type`, `venue`, `start_date`, `end_date`, `capacity`, `status`, `total_attendees`, `attendance_percentage`, `created_by`) VALUES
(1, 'Sunday Worship Service',  'Weekly Sunday morning worship', 'Sunday Worship',  'Main Sanctuary', '2024-05-05 09:00:00', '2024-05-05 11:30:00', 300, 'Completed', 210, 70.00, 1),
(2, 'Bible Study - Romans',    'Deep dive into Romans',         'Bible Study',     'Fellowship Hall', '2024-05-08 19:00:00', '2024-05-08 21:00:00', 80,  'Completed', 55,  68.75, 1),
(3, 'Youth Camp 2024',         'Annual youth camp',             'Youth Camp',      'Camp Canlubang',  '2024-05-15 08:00:00', '2024-05-17 17:00:00', 100, 'Completed', 88,  88.00, 2),
(4, 'Sunday Worship Service',  'Weekly Sunday morning worship', 'Sunday Worship',  'Main Sanctuary',  '2024-05-12 09:00:00', '2024-05-12 11:30:00', 300, 'Completed', 195, 65.00, 1),
(5, 'Choir Practice - June',   'Monthly choir practice',        'Choir Practice',  'Music Room',      '2024-06-01 16:00:00', '2024-06-01 18:00:00', 40,  'Completed', 32,  80.00, 3),
(6, 'Sunday Worship Service',  'Weekly Sunday morning worship', 'Sunday Worship',  'Main Sanctuary',  '2024-06-02 09:00:00', '2024-06-02 11:30:00', 300, 'Completed', 220, 73.33, 1),
(7, 'Outreach - Barangay Palico', 'Community outreach program', 'Outreach',        'Barangay Palico', '2024-06-08 08:00:00', '2024-06-08 17:00:00', 50,  'Completed', 45,  90.00, 1),
(8, 'Upcoming Sunday Worship', 'Weekly Sunday morning worship', 'Sunday Worship',  'Main Sanctuary',  '2025-07-06 09:00:00', '2025-07-06 11:30:00', 300, 'Upcoming',  0,   0.00,  1),
(9, 'Annual Church Retreat',   '3-day spiritual retreat',       'Retreat',         'Tagaytay Retreat House', '2025-07-18 08:00:00', '2025-07-20 17:00:00', 120, 'Upcoming', 0, 0.00, 1);

-- ============================================================
-- TABLE: event_registrations
-- ============================================================
CREATE TABLE IF NOT EXISTS `event_registrations` (
  `id`              INT UNSIGNED NOT NULL AUTO_INCREMENT,
  `event_id`        INT UNSIGNED NOT NULL,
  `member_id`       INT UNSIGNED NOT NULL,
  `registered_at`   TIMESTAMP    NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `status`          ENUM('Registered','Cancelled','Attended') NOT NULL DEFAULT 'Registered',
  PRIMARY KEY (`id`),
  UNIQUE KEY `uq_event_registration` (`event_id`, `member_id`),
  KEY `fk_er_member` (`member_id`),
  CONSTRAINT `fk_er_event`  FOREIGN KEY (`event_id`)  REFERENCES `events`  (`id`) ON DELETE CASCADE,
  CONSTRAINT `fk_er_member` FOREIGN KEY (`member_id`) REFERENCES `members` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

INSERT INTO `event_registrations` (`event_id`, `member_id`, `status`) VALUES
(8, 1, 'Registered'), (8, 2, 'Registered'), (8, 3, 'Registered'),
(8, 4, 'Registered'), (8, 5, 'Registered'),
(9, 1, 'Registered'), (9, 2, 'Registered'), (9, 3, 'Registered');

-- ============================================================
-- TABLE: attendance
-- ============================================================
CREATE TABLE IF NOT EXISTS `attendance` (
  `id`              INT UNSIGNED  NOT NULL AUTO_INCREMENT,
  `event_id`        INT UNSIGNED  NOT NULL,
  `member_id`       INT UNSIGNED  NOT NULL,
  `attendance_date` DATE          NOT NULL,
  `status`          ENUM('Present','Absent','Excused') NOT NULL DEFAULT 'Present',
  `notes`           VARCHAR(255)  DEFAULT NULL,
  `recorded_by`     INT UNSIGNED  DEFAULT NULL,
  `created_at`      TIMESTAMP     NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `uq_attendance` (`event_id`, `member_id`, `attendance_date`),
  KEY `fk_att_member`      (`member_id`),
  KEY `fk_att_recorded_by` (`recorded_by`),
  CONSTRAINT `fk_att_event`       FOREIGN KEY (`event_id`)    REFERENCES `events`  (`id`) ON DELETE CASCADE,
  CONSTRAINT `fk_att_member`      FOREIGN KEY (`member_id`)   REFERENCES `members` (`id`) ON DELETE CASCADE,
  CONSTRAINT `fk_att_recorded_by` FOREIGN KEY (`recorded_by`) REFERENCES `users`   (`id`) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Seed attendance for past events
INSERT INTO `attendance` (`event_id`, `member_id`, `attendance_date`, `status`, `recorded_by`) VALUES
(1, 1, '2024-05-05', 'Present', 1), (1, 2, '2024-05-05', 'Present', 1),
(1, 3, '2024-05-05', 'Present', 1), (1, 4, '2024-05-05', 'Absent',  1),
(1, 5, '2024-05-05', 'Present', 1),
(2, 1, '2024-05-08', 'Present', 1), (2, 2, '2024-05-08', 'Absent',  1),
(2, 3, '2024-05-08', 'Present', 1), (2, 5, '2024-05-08', 'Present', 1),
(3, 3, '2024-05-15', 'Present', 2), (3, 4, '2024-05-15', 'Present', 2),
(3, 7, '2024-05-15', 'Present', 2), (3, 8, '2024-05-15', 'Absent',  2),
(4, 1, '2024-05-12', 'Present', 1), (4, 2, '2024-05-12', 'Present', 1),
(4, 5, '2024-05-12', 'Excused', 1), (4, 6, '2024-05-12', 'Present', 1),
(5, 2, '2024-06-01', 'Present', 3), (5, 6, '2024-06-01', 'Present', 3),
(5, 8, '2024-06-01', 'Present', 3), (5, 7, '2024-06-01', 'Absent',  3),
(6, 1, '2024-06-02', 'Present', 1), (6, 2, '2024-06-02', 'Present', 1),
(6, 3, '2024-06-02', 'Present', 1), (6, 4, '2024-06-02', 'Present', 1),
(7, 1, '2024-06-08', 'Present', 1), (7, 3, '2024-06-08', 'Present', 1),
(7, 5, '2024-06-08', 'Present', 1), (7, 6, '2024-06-08', 'Absent',  1);

-- ============================================================
-- TABLE: volunteers
-- ============================================================
CREATE TABLE IF NOT EXISTS `volunteers` (
  `id`          INT UNSIGNED NOT NULL AUTO_INCREMENT,
  `member_id`   INT UNSIGNED NOT NULL,
  `skills`      TEXT         DEFAULT NULL,
  `availability`VARCHAR(255) DEFAULT NULL,
  `status`      ENUM('Active','Inactive') NOT NULL DEFAULT 'Active',
  `created_at`  TIMESTAMP    NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `uq_volunteer_member` (`member_id`),
  CONSTRAINT `fk_vol_member` FOREIGN KEY (`member_id`) REFERENCES `members` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

INSERT INTO `volunteers` (`id`, `member_id`, `skills`, `availability`) VALUES
(1, 3, 'Ushering, Event Setup',       'Weekends'),
(2, 4, 'Multimedia, Social Media',    'Weekdays after 5PM, Weekends'),
(3, 5, 'Event Organizing, Teaching',  'Sundays'),
(4, 6, 'Choir Assistant, Music',      'Weekends'),
(5, 7, 'Event Setup, Photography',    'Weekends');

-- ============================================================
-- TABLE: volunteer_assignments
-- ============================================================
CREATE TABLE IF NOT EXISTS `volunteer_assignments` (
  `id`           INT UNSIGNED NOT NULL AUTO_INCREMENT,
  `volunteer_id` INT UNSIGNED NOT NULL,
  `event_id`     INT UNSIGNED NOT NULL,
  `role`         VARCHAR(100) NOT NULL,
  `schedule`     DATETIME     DEFAULT NULL,
  `status`       ENUM('Pending','Confirmed','Completed','No Show') NOT NULL DEFAULT 'Pending',
  `notes`        TEXT         DEFAULT NULL,
  `created_at`   TIMESTAMP    NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `fk_va_volunteer` (`volunteer_id`),
  KEY `fk_va_event`     (`event_id`),
  CONSTRAINT `fk_va_volunteer` FOREIGN KEY (`volunteer_id`) REFERENCES `volunteers` (`id`) ON DELETE CASCADE,
  CONSTRAINT `fk_va_event`     FOREIGN KEY (`event_id`)     REFERENCES `events`     (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

INSERT INTO `volunteer_assignments` (`volunteer_id`, `event_id`, `role`, `schedule`, `status`) VALUES
(1, 8, 'Usher',             '2025-07-06 08:00:00', 'Confirmed'),
(2, 8, 'Multimedia Team',   '2025-07-06 08:00:00', 'Confirmed'),
(3, 9, 'Event Organizer',   '2025-07-18 07:00:00', 'Pending'),
(4, 5, 'Choir Assistant',   '2024-06-01 15:30:00', 'Completed'),
(5, 7, 'Event Setup',       '2024-06-08 07:00:00', 'Completed'),
(1, 1, 'Usher',             '2024-05-05 08:00:00', 'Completed');

-- ============================================================
-- TABLE: donations
-- ============================================================
CREATE TABLE IF NOT EXISTS `donations` (
  `id`            INT UNSIGNED   NOT NULL AUTO_INCREMENT,
  `member_id`     INT UNSIGNED   DEFAULT NULL,
  `donor_name`    VARCHAR(200)   DEFAULT NULL COMMENT 'For anonymous/walk-in donors',
  `amount`        DECIMAL(12,2)  NOT NULL CHECK (`amount` > 0),
  `donation_date` DATE           NOT NULL DEFAULT (CURDATE()),
  `donation_type` ENUM('Tithes','Offerings','Building Fund','Missions Fund','Special Offering') NOT NULL,
  `remarks`       TEXT           DEFAULT NULL,
  `received_by`   INT UNSIGNED   DEFAULT NULL,
  `created_at`    TIMESTAMP      NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `idx_donations_date`    (`donation_date`),
  KEY `fk_donations_member`   (`member_id`),
  KEY `fk_donations_receiver` (`received_by`),
  CONSTRAINT `fk_donations_member`   FOREIGN KEY (`member_id`)   REFERENCES `members` (`id`) ON DELETE SET NULL,
  CONSTRAINT `fk_donations_receiver` FOREIGN KEY (`received_by`) REFERENCES `users`   (`id`) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

INSERT INTO `donations` (`member_id`, `donor_name`, `amount`, `donation_date`, `donation_type`, `remarks`, `received_by`) VALUES
(1,  NULL,       5000.00, '2024-04-07', 'Tithes',          'April tithe',       1),
(2,  NULL,       2500.00, '2024-04-07', 'Offerings',       NULL,                1),
(3,  NULL,        500.00, '2024-04-07', 'Offerings',       NULL,                1),
(NULL,'Anonymous',1000.00,'2024-04-07', 'Building Fund',   NULL,                1),
(5,  NULL,       3000.00, '2024-04-14', 'Tithes',          'April second tithe',1),
(6,  NULL,        750.00, '2024-04-14', 'Offerings',       NULL,                1),
(1,  NULL,       5000.00, '2024-05-05', 'Tithes',          'May tithe',         1),
(2,  NULL,       2000.00, '2024-05-05', 'Offerings',       NULL,                1),
(4,  NULL,       1500.00, '2024-05-05', 'Building Fund',   'Dedicated for roof', 1),
(7,  NULL,        300.00, '2024-05-05', 'Missions Fund',   NULL,                1),
(NULL,'Walk-in', 500.00,  '2024-05-12', 'Offerings',       NULL,                1),
(8,  NULL,       1000.00, '2024-05-12', 'Offerings',       NULL,                1),
(3,  NULL,       800.00,  '2024-05-12', 'Tithes',          NULL,                1),
(5,  NULL,       3000.00, '2024-06-02', 'Tithes',          'June tithe',        1),
(6,  NULL,       500.00,  '2024-06-02', 'Offerings',       NULL,                1),
(1,  NULL,       5000.00, '2024-06-02', 'Tithes',          'June tithe',        1);

-- ============================================================
-- TABLE: activity_logs
-- ============================================================
CREATE TABLE IF NOT EXISTS `activity_logs` (
  `id`          INT UNSIGNED NOT NULL AUTO_INCREMENT,
  `user_id`     INT UNSIGNED DEFAULT NULL,
  `action`      VARCHAR(100) NOT NULL,
  `table_name`  VARCHAR(100) DEFAULT NULL,
  `record_id`   INT UNSIGNED DEFAULT NULL,
  `description` TEXT         DEFAULT NULL,
  `ip_address`  VARCHAR(45)  DEFAULT NULL,
  `created_at`  TIMESTAMP    NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `fk_logs_user` (`user_id`),
  CONSTRAINT `fk_logs_user` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================================
-- TABLE: notifications
-- ============================================================
CREATE TABLE IF NOT EXISTS `notifications` (
  `id`         INT UNSIGNED NOT NULL AUTO_INCREMENT,
  `user_id`    INT UNSIGNED NOT NULL,
  `title`      VARCHAR(200) NOT NULL,
  `message`    TEXT         NOT NULL,
  `type`       ENUM('Info','Warning','Success','Event') NOT NULL DEFAULT 'Info',
  `is_read`    TINYINT(1)   NOT NULL DEFAULT 0,
  `created_at` TIMESTAMP    NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `fk_notif_user` (`user_id`),
  CONSTRAINT `fk_notif_user` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

INSERT INTO `notifications` (`user_id`, `title`, `message`, `type`, `is_read`) VALUES
(1, 'New Member Registered',     'Pedro Reyes has been added as a church member.',    'Success', 0),
(1, 'Upcoming Retreat',          'Annual Church Retreat is scheduled for July 18.',   'Event',   0),
(2, 'Event Assignment',          'You have been assigned to lead Youth Camp 2024.',   'Info',    1),
(3, 'Choir Practice Reminder',   'Choir practice is on June 1 at 4PM.',              'Event',   0);

-- ============================================================
-- TRIGGER: update_event_attendance_count
-- ============================================================
DELIMITER $$

CREATE TRIGGER `update_event_attendance_count`
AFTER INSERT ON `attendance`
FOR EACH ROW
BEGIN
  DECLARE v_total     INT UNSIGNED DEFAULT 0;
  DECLARE v_capacity  INT UNSIGNED DEFAULT 0;

  IF NEW.status = 'Present' THEN
    -- Count all present attendees for the event
    SELECT COUNT(*) INTO v_total
    FROM attendance
    WHERE event_id = NEW.event_id AND status = 'Present';

    -- Get event capacity
    SELECT COALESCE(capacity, 0) INTO v_capacity
    FROM events
    WHERE id = NEW.event_id;

    -- Update total_attendees and attendance_percentage
    UPDATE events
    SET total_attendees       = v_total,
        attendance_percentage = CASE
          WHEN v_capacity > 0 THEN ROUND((v_total / v_capacity) * 100, 2)
          ELSE 0
        END
    WHERE id = NEW.event_id;
  END IF;
END$$

DELIMITER ;

-- ============================================================
-- VIEW: vw_ministry_participation_dashboard
-- ============================================================
CREATE OR REPLACE VIEW `vw_ministry_participation_dashboard` AS
SELECT
  CONCAT(m.first_name, ' ', m.last_name)                         AS member_name,
  mi.name                                                         AS ministry_name,
  COUNT(DISTINCT a.id)                                            AS total_events_attended,
  COUNT(DISTINCT e.id)                                            AS total_events,
  CASE
    WHEN COUNT(DISTINCT e.id) > 0
    THEN ROUND(COUNT(DISTINCT a.id) / COUNT(DISTINCT e.id) * 100, 2)
    ELSE 0
  END                                                             AS attendance_rate,
  MAX(a.attendance_date)                                          AS last_participation_date,
  mm.role                                                         AS ministry_role
FROM members m
JOIN member_ministries mm ON mm.member_id  = m.id
JOIN ministries        mi ON mi.id         = mm.ministry_id
LEFT JOIN events        e  ON e.status      = 'Completed'
LEFT JOIN attendance    a  ON a.member_id   = m.id
                          AND a.event_id    = e.id
                          AND a.status      = 'Present'
WHERE mm.status = 'Active'
GROUP BY m.id, mi.id, mm.role;

-- ============================================================
-- INDEXES (additional performance indexes)
-- ============================================================
-- Already created inline; listed here for documentation.
-- idx_members_last_name  -> members.last_name
-- idx_members_email      -> members.email
-- idx_events_start_date  -> events.start_date
-- idx_donations_date     -> donations.donation_date

SET FOREIGN_KEY_CHECKS = 1;
