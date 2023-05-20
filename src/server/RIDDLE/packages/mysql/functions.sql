-- SQLBook: Code
/* Function to count the attempts */
--Checar si el ultimo intento esta en FAI, si es asi toma los 3 ultimos registros de attempts
DELIMITER $$

CREATE FUNCTION getHomework(homework_id CHAR(20), student_id CHAR(9))
    RETURNS INT
    BEGIN
        



-- ///////////////////////////
DELIMITER $$
CREATE FUNCTION CountAttemptsFails(homework_id CHAR(20), student_id CHAR(9))
    RETURNS INT
    BEGIN
        DECLARE attempts INT;

        SELECT COUNT(*) INTO attempts
        FROM hw_questionAttempts
        WHERE homework = homework_id AND student = student_id AND attempt_status = 'FAI';
        
        RETURN attempts;
    END $$
DELIMITER ;


--Tests
SELECT CountAttemptsFails('H0000000000000000001', 'A01551955');
INSERT INTO hw_questionAttempts (student, homework, question, attempt_status,attempt_date) VALUES ("A01551955", "H0000000000000000001", "CQ000000000000000001", "FAI", '2023-04-14 12:43:23');
DROP FUNCTION CountAttemptsFails;


/* Function to check the questions per module*/
DELIMITER $$
CREATE FUNCTION QuestionsPerModule(
    --Recibo los 3 parametros 
    homework_id CHAR(20),
    question_id CHAR(20),
    student_id CHAR(9)
) RETURNS INT --Regreso un contador de preguntas por modulo

BEGIN
    DECLARE module_id CHAR(20); --id del modulo de la pregunta seleccionada
    DECLARE allowed_questions INT; -- Numero de preguntas por modulo segun la tarea
    DECLARE attempts INT; -- INtentos registrados en hw_questionAttempts

    -- Obtener el módulo de la pregunta
    SELECT module INTO module_id
    FROM questions
    WHERE id_question = question_id;

    -- Obtener la cantidad de preguntas admitidas para el módulo y tarea específicos
    SELECT n_questions INTO allowed_questions
    FROM homeworkConfigs
    WHERE homework = homework_id
    AND module = module_id;

    -- Contar los intentos fallidos y pendientes de la pregunta del estudiante en hw_questionAttempts
    SELECT COUNT(*) INTO attempts
    FROM hw_questionAttempts
    WHERE homework = homework_id
    AND student = student_id
    AND question = question_id
    AND attempt_status IN ('FAI', 'PEN');

    -- Si la cantidad de intentos es menor a la cantidad de preguntas admitidas, se permite la pregunta
    IF attempts < allowed_questions THEN
        RETURN 1; -- Retorna 1 para indicar que la pregunta es válida
    ELSE
        RETURN 0; -- Retorna 0 para indicar que la pregunta no es válida
    END IF;
END $$
DELIMITER ;