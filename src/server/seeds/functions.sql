USE iCode;

SET GLOBAL log_bin_trust_function_creators = 1;

DELIMITER $$
CREATE FUNCTION successful_hw_attempts(matricula CHAR(9), hw_id VARCHAR(20))
RETURNS INT
BEGIN
    DECLARE successful_attempts INT;
    SELECT COUNT(*) INTO successful_attempts FROM hw_questionAttempts hqa
    JOIN hw_questions hq ON hqa.question = hq.id_hwquestion
    WHERE student = matricula AND homework = hw_id AND attempt_status = 'PAS';
    RETURN successful_attempts;
END$$
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