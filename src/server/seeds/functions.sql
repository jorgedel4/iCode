USE iCode;

SET GLOBAL log_bin_trust_function_creators = 1;

DELIMITER $$
CREATE FUNCTION successful_mod_attempts(matricula CHAR(9), mod_id CHAR(20), group_id CHAR(10))
RETURNS INT
BEGIN
    DECLARE successful_attempts INT;
    SELECT COUNT(*) INTO successful_attempts FROM questionAttempts qa
    JOIN questions q ON qa.question = q.id_question
    WHERE student = matricula AND module = mod_id AND grupo = group_id AND attempt_status = 'PAS';
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



DELIMITER $$
CREATE FUNCTION InsertModule(
    module_id CHAR(20),
    course_id CHAR(10),
    module_name VARCHAR(30)
) RETURNS INT
BEGIN
    DECLARE repeated INT;
    DECLARE exit_code INT;

    -- Verificar si ya existe un módulo con el mismo nombre y curso
    SELECT COUNT(*) INTO repeated
    FROM modules
    WHERE nombre = module_name 
    AND course = course_id;

    IF repeated != 0 THEN
        SET exit_code = 1;
    ELSE
        -- Insertar el nuevo módulo
        INSERT INTO modules (id_module, course, nombre)
        VALUES (module_id, course_id, module_name);
        
        SET exit_code = 0;
    END IF;

    RETURN exit_code;
END $$
DELIMITER ;



DELIMITER //
CREATE PROCEDURE ContinuosAttempts(IN student_param CHAR(9), IN homework_param CHAR(20), IN question_param CHAR(20), OUT counter INT)
BEGIN
  DECLARE done INT DEFAULT 0;
  DECLARE attempt_counter INT DEFAULT 0;
  DECLARE current_question CHAR(20);
  
  DECLARE attempts_cursor CURSOR FOR
    SELECT question
    FROM hw_questionAttempts
    WHERE student = student_param AND homework = homework_param
    ORDER BY attempt_date DESC;
  
  DECLARE CONTINUE HANDLER FOR NOT FOUND SET done = 1;
  
  OPEN attempts_cursor;
  
  read_loop: LOOP
    FETCH attempts_cursor INTO current_question;
    
    IF done = 1 OR current_question IS NULL OR current_question != question_param THEN 
      LEAVE read_loop;
    END IF;
    
    SET attempt_counter = attempt_counter + 1;
  END LOOP;
  
  CLOSE attempts_cursor;
  
  SET counter = attempt_counter;
END //
DELIMITER ;



DELIMITER $$
CREATE FUNCTION HomeworkModuleStatus(
    student_id CHAR(9),
    homework_id CHAR(20),
    module_id CHAR(20)
) RETURNS BOOLEAN
BEGIN
    DECLARE needed INT;
    DECLARE answered INT;
    DECLARE result BOOLEAN DEFAULT FALSE;

    SELECT n_questions INTO needed
    FROM homeworkConfigs
    WHERE homework = homework_id
    AND module = module_id;

    SELECT COUNT(*) INTO answered
    FROM hw_questionAttempts hqa
    JOIN questions q ON hqa.question = q.id_question
    WHERE hqa.homework = homework_id
    AND q.module = module_id
    AND hqa.student = student_id
    AND hqa.attempt_status = 'PAS';

    IF needed > answered OR needed = 0 OR answered = 0 THEN
        SET result = FALSE;
    ELSE
        SET result = TRUE;
    END IF;

    RETURN result;
END$$
DELIMITER ;



DELIMITER $$
CREATE FUNCTION HWQuestionStatus(homework_id CHAR(20), question_id CHAR(20), student_id CHAR(9))
RETURNS CHAR(3)
BEGIN
    DECLARE question_status CHAR(3);
    DECLARE done BOOLEAN DEFAULT FALSE;
    
    DECLARE cur CURSOR FOR
        SELECT attempt_status
        FROM hw_questionAttempts
        WHERE student = student_id
        AND homework = homework_id
        AND question = question_id;
    DECLARE CONTINUE HANDLER FOR NOT FOUND SET done = TRUE;
    
    SET question_status = 'PEN';

    OPEN cur;
        read_loop: LOOP
        FETCH cur INTO question_status;
        IF done THEN
            LEAVE read_loop;
        END IF;
        IF question_status = 'PAS' THEN
            CLOSE cur;
            RETURN 'PAS';
        ELSE
            SET question_status = 'FAI';
        END IF;
        END LOOP;
    CLOSE cur;

    RETURN question_status;
END$$
DELIMITER ;



DELIMITER $$
CREATE FUNCTION HWModQuestionID(
    homework_id CHAR(20),
    module_id CHAR(20),
    student_id CHAR(9)
) RETURNS CHAR(20)
BEGIN
    DECLARE question CHAR(20);

    SELECT id_question INTO question
    FROM questions
    WHERE module = module_id
    AND HWQuestionStatus(homework_id, id_question, student_id) = 'PEN'
    ORDER BY RAND()
    LIMIT 1;

    IF question IS NULL THEN
        SELECT id_question INTO question
        FROM questions
        WHERE module = module_id
        AND HWQuestionStatus(homework_id, id_question, student_id) = 'FAI'
        ORDER BY RAND()
        LIMIT 1;
    END IF;

    RETURN question;
END$$
DELIMITER ;



DELIMITER $$
CREATE FUNCTION NewHWQuestionID(
    homework_id CHAR(20),
    student_id CHAR(9)
) RETURNS CHAR(20)
BEGIN
    DECLARE moduleToGetHW CHAR(20);
    DECLARE question CHAR(20);

    SELECT module INTO moduleToGetHW
    FROM homeworkConfigs 
    WHERE homework = homework_id
    AND HomeworkModuleStatus(student_id, homework, module) = 0
    ORDER BY RAND()
    LIMIT 1;

    SET question = HWModQuestionID(homework_id, moduleToGetHW, student_id);
    RETURN question;
END$$
DELIMITER ;



DELIMITER $$
CREATE FUNCTION HomeworkQuestionID(
    homework_id CHAR(20),
    student_id CHAR(9)
) RETURNS CHAR(20)
BEGIN
    DECLARE last_attempt_question CHAR(20);
    DECLARE last_attempt_status CHAR(3);
    DECLARE continuousAttempts INT;
    DECLARE questionID CHAR(20);

    SELECT question, attempt_status INTO last_attempt_question, last_attempt_status
    FROM hw_questionAttempts
    WHERE student = student_id
    AND homework = homework_id
    ORDER BY attempt_date DESC
    LIMIT 1;

    IF last_attempt_status = 'PAS' THEN
        SET questionID = NewHWQuestionID(homework_id, student_id);
        RETURN questionID;
    ELSE
        CALL ContinuosAttempts(student_id, homework_id, last_attempt_question, continuousAttempts);

        IF continuousAttempts < 3 THEN
            RETURN last_attempt_question;
        ELSE
            SET questionID = NewHWQuestionID(homework_id, student_id);
            RETURN questionID;
        END IF;
    END IF;

    RETURN questionID;
END$$
DELIMITER ;



DELIMITER $$
CREATE FUNCTION ModQuestionStatus(
    question_id CHAR(20),
    grupo_id CHAR(20),
    student_id CHAR(9)
) RETURNS CHAR(3)
BEGIN
    DECLARE question_status CHAR(3);
    DECLARE done BOOLEAN DEFAULT FALSE;
    
    DECLARE cur CURSOR FOR
        SELECT attempt_status
        FROM questionAttempts
        WHERE student = student_id
        AND grupo = grupo_id
        AND question = question_id;
    DECLARE CONTINUE HANDLER FOR NOT FOUND SET done = TRUE;
    
    SET question_status = 'PEN';

    OPEN cur;
        read_loop: LOOP
        FETCH cur INTO question_status;
        IF done THEN
            LEAVE read_loop;
        END IF;
        IF question_status = 'PAS' THEN
            CLOSE cur;
            RETURN 'PAS';
        ELSE
            SET question_status = 'FAI';
        END IF;
        END LOOP;
    CLOSE cur;

    RETURN question_status;
END$$
DELIMITER ;



DELIMITER $$
CREATE FUNCTION ModuleQuestionID(
    group_id CHAR(20),
    module_id CHAR(20),
    student_id CHAR(20)
) RETURNS CHAR(20)
BEGIN
    DECLARE question CHAR(20);

    SELECT id_question INTO question FROM questions
    WHERE module = module_id
    AND ModQuestionStatus(id_question, group_id, student_id) = 'PEN'
    ORDER BY RAND()
    LIMIT 1;

    IF question IS NULL THEN
        SELECT id_question INTO question FROM questions
        WHERE module = module_id
        AND ModQuestionStatus(id_question, group_id, student_id) = 'FAI'
        ORDER BY RAND()
        LIMIT 1;
    END IF;

    RETURN question;
END $$
DELIMITER ;


DELIMITER $$
CREATE FUNCTION ChangeCourseName (
    course_id CHAR(20),
    new_name VARCHAR(50)
) RETURNS INT
BEGIN
    DECLARE name_appearance INT;
    SET name_appearance = 0;

    SELECT COUNT(*) INTO name_appearance
    FROM courses
    WHERE course_name = new_name;

    IF name_appearance = 0 THEN
        UPDATE courses
        SET course_name = new_name
        WHERE id_course = course_id;
        RETURN 0;
    ELSE
        RETURN 1;
    END IF;
END$$
DELIMITER ;




-- DELIMITER $$
-- CREATE FUNCTION HWStatus(
--     homework_id CHAR(20),
--     student_id CHAR(9)
-- )
-- END$$
-- DELIMITER ;



-- DELIMITER $$
-- CREATE FUNCTION StudentHomeworkStatus(
--     group_id CHAR(20),
--     student_id CHAR(9)
-- ) RETURNS JSON
-- BEGIN
--     DECLARE HWJSON JSON;

--     SELECT JSON_ARRAYAGG (
--         JSON_OBJECT (
--             'hw_name', h.hw_name,
--             'status', HWStatus(h.id_homework, student_id)
--         )
--     )
--     INTO HWJSON
--     FROM homework h
--     WHERE h.grupo = group_id;
-- END$$
-- DELIMITER ;



-- DELIMITER $$
-- CREATE FUNCTION GroupHomeworkStatus(
--     group_id CHAR(20)
-- ) RETURNS JSON
-- BEGIN
--     DECLARE studentHWJSON JSON;

--     SELECT JSON_ARRAYAGG(
--         JSON_OBJECT (
--             'matricula', s.matricula,
--             'first_name', s.first_name,
--             'flast_name', s.flast_name,
--             'slast_name', s.slast_name,
--             'homework', 
--         )
--     )
--     INTO studentHWJSON
--     FROM enrollments e
--     JOIN students s ON e.student = s.matricula
--     WHERE e.grupo = group_id;

--     RETURN studentHWJSON;
-- END$$
-- DELIMITER ;

