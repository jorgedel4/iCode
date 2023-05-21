USE iCode;

SET GLOBAL log_bin_trust_function_creators = 1;
-- FUNCTION to get homeworkQuestions
DELIMITER $$
CREATE FUNCTION homeworkQuestion (
    homework_id CHAR(20),
    student_id CHAR(9)
) RETURNS ROW
BEGIN
    DECLARE last_attempt ROW;
    DECLARE continuousAttempts INT;
    DECLARE question ROW;
    
    -- Obtener el último intento de pregunta
    SET last_attempt = (
        SELECT *
        FROM hw_questionAttempts
        WHERE student = student_id AND homework = homework_id
        ORDER BY attempt_date DESC
        LIMIT 1
    );

    IF last_attempt.attempt_status = 'PAS' THEN
        -- Si el último intento fue 'PAS', obtener una nueva pregunta
        RETURN NewHWQuestion(homework_id, student_id);
    ELSE
        -- Obtener el número de intentos consecutivos para la pregunta actual
        SET continuousAttempts = ContinuousAttempts(homework_id, student_id, last_attempt.question);

        IF continuousAttempts <= 3 THEN
            -- Si el número de intentos consecutivos es menor o igual a 3, obtener la pregunta actual
            SELECT *
            INTO question
            FROM questions
            WHERE id_question = last_attempt.question
            LIMIT 1;

            RETURN question;
        ELSE
            -- Si el número de intentos consecutivos es mayor a 3, obtener una nueva pregunta
            RETURN NewHWQuestion(homework_id, student_id);
        END IF;
    END IF;
END$$
DELIMITER ;


--Function 2 (Por probar)
DELIMITER $$
CREATE FUNCTION ContinuousAttempts(
    homework_id CHAR(20),
    student_id CHAR(9),
    question_id CHAR(20)
) RETURNS INT
BEGIN
    DECLARE attempts INT;
    DECLARE done INT DEFAULT FALSE;
    DECLARE cur CURSOR FOR
        SELECT attempt_status
        FROM hw_questionAttempts
        WHERE student = student_id AND homework = homework_id AND question = question_id
        ORDER BY attempt_date DESC;
    
    DECLARE CONTINUE HANDLER FOR NOT FOUND SET done = TRUE;
    
    SET attempts = 0; -- Inicializar el contador de intentos
    
    OPEN cur;
    read_loop: LOOP
        FETCH cur INTO attempts;
        IF done THEN
            LEAVE read_loop;
        END IF;
        -- Incrementar el contador
        SET attempts = attempts + 1;
    END LOOP read_loop;

    CLOSE cur;
    RETURN attempts;
END$$
DELIMITER ;


-- Obtener modulos de una tarea
-- Checar estatus de cada modulo (con una funcion que tome el modulo, tarea y estudiante y te diga si aun le faltan preguntas de ese modulo)
-- El primer modulo que encuentres que no este terminado, regresa una pregunta que no se haya resuelto de ese modulo (con otra funcion que tome modulo, estudiante y tarea)
-- Function

DELIMITER $$
CREATE FUNCTION NewHWQuestion(
    homework_id CHAR(20),
    student_id CHAR(9)
) RETURNS ROW
BEGIN
    DECLARE question ROW;
    DECLARE module_status TABLE (module_id CHAR(20), module_status VARCHAR(10));
    
    -- Obtener el estado de los módulos utilizando la función GetModuleStatus
    SET module_status = (SELECT * FROM GetModuleStatus(homework_id, student_id));

    -- Seleccionar una pregunta de un módulo incompleto en base a la tabla de módulos por estado
    SET question = (
        SELECT q.*
        FROM questions q
        JOIN module_status ms ON q.module_id = ms.module_id
        WHERE ms.module_status = 'Incomplete'
        LIMIT 1
    );

    -- Si no se encontró ninguna pregunta de un módulo incompleto, se establece el valor NULL en question
    IF question IS NULL THEN
        SET question = (NULL, NULL, NULL); -- Establecer los valores de question como NULL
    END IF;

    RETURN question;
END$$
DELIMITER ;

--Hacer una funcion que me genere una tabla con el modulo y si esta completo o no, esto desde homeworkConfigs
--DEspues puedo recorrer cada registro de esa nueva tabla y decir qu si su status es incompleto, ir a questions y tomar una rpegunta

DELIMITER $$
CREATE FUNCTION GetModuleStatus(
    homework_id CHAR(20),
    student_id CHAR(9)
) RETURNS TABLE (module_id CHAR(20), module_status VARCHAR(10))
BEGIN
    RETURN (
        SELECT mc.module,
            CASE
                WHEN mc.status = 'Completo' THEN 'Completo'
                WHEN COUNT(hqa.question) >= hc.n_questions THEN 'Completed' 
                ELSE 'Incomplete'
            END AS module_status
        FROM homeworkConfigs hc
        JOIN modules m ON m.id_module = hc.module
        JOIN moduleConfigs mc ON mc.module = m.id_module AND mc.grupo = hc.homework
        LEFT JOIN hw_questionAttempts hqa ON hqa.student = student_id AND hqa.homework = homework_id AND hqa.question IN (
            SELECT id_question
            FROM questions
            WHERE module = hc.module
        )
        WHERE hc.homework = homework_id
        GROUP BY mc.module
    );
END$$
DELIMITER ;

