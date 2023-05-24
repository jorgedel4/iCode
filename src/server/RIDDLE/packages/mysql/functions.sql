USE iCode;
USE iCode;

SET GLOBAL log_bin_trust_function_creators = 1;
-- FUNCTION to get homeworkQuestions
DELIMITER $$
CREATE FUNCTION GetCorrectQuestion(
    student_id CHAR(9),
    homework_id CHAR(20)
) RETURNS INT
BEGIN
    DECLARE answered_correctly INT;
    
    SELECT COUNT(*) INTO answered_correctly
    FROM hw_questionAttempts
    WHERE student = student_id
        AND homework = homework_id
        AND attempt_status = 'PAS';

    
    RETURN answered_correctly;
END $$
DELIMITER ;



DELIMITER $$
CREATE FUNCTION GetTotalQuestions(
    id_student CHAR(9),
    id_homework CHAR(20)
) RETURNS INT
BEGIN
    DECLARE total_questions INT;
    
    SELECT SUM(n_questions) INTO total_questions
    FROM homeworkConfigs
    WHERE homework = id_homework;
    
    RETURN total_questions;
END $$
DELIMITER ;



