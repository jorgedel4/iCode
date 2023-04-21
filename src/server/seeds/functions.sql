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