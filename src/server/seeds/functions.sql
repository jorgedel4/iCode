USE iCode;

SET GLOBAL log_bin_trust_function_creators = 1;

DELIMITER $$
CREATE FUNCTION successful_mod_attempts(matricula CHAR(9), mod_id CHAR(20))
RETURNS INT
BEGIN
    DECLARE successful_attempts INT;
    SELECT COUNT(*) INTO successful_attempts FROM questionAttempts qa
    JOIN questions q ON qa.question = q.id_question
    WHERE student = matricula AND module = mod_id AND attempt_status = 'PAS';
    RETURN successful_attempts;
END$$
DELIMITER ;

DELIMITER $$
CREATE FUNCTION successful_hw_attempts(matricula CHAR(9), hw_id CHAR(20))
RETURNS INT
BEGIN
    DECLARE success_count INT;
    SELECT COUNT(*) INTO success_count
    FROM hw_questionAttempts hqa
    WHERE student = matricula AND homework = hw_id AND attempt_status = 'PAS';
    RETURN success_count;
END$$
DELIMITER ;

DELIMITER $$
CREATE FUNCTION hw_needed_questions(homework_id CHAR(20)) RETURNS INT
BEGIN
    DECLARE total_questions INT DEFAULT 0;
    SELECT SUM(n_questions) INTO total_questions
    FROM homeworkConfigs
    WHERE homework = homework_id;
    RETURN total_questions;
END $$
DELIMITER ;

DELIMITER $$
CREATE FUNCTION count_modules(course_id CHAR(10))
RETURNS INT
BEGIN
    DECLARE count INT;
    SELECT COUNT(*) INTO count FROM modules WHERE course = course_id;
    RETURN count;
END$$
DELIMITER ;