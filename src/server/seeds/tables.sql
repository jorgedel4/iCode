DROP DATABASE IF EXISTS iCode;
CREATE DATABASE iCode;

USE iCode;

SET sql_mode = '';

-- Creacion de tablas
CREATE TABLE campus (
    id_campus   CHAR(3)         NOT NULL,
    name_campus VARCHAR(255)    NOT NULL,

    PRIMARY KEY (id_campus)
);

CREATE TABLE terms (
    id_term     CHAR(4)         NOT NULL,
    term_name   VARCHAR(25)     NOT NULL,
    date_start  TIMESTAMP       NOT NULL,
    date_end    TIMESTAMP       NOT NULL,

    PRIMARY KEY (id_term)
);

CREATE TABLE admins (
    id_admin    CHAR(9)         NOT NULL,
    campus      CHAR(3)         NOT NULL,
    first_name  VARCHAR(20)     NOT NULL,
    flast_name  VARCHAR(20)     NOT NULL,
    slast_name  VARCHAR(20),

    PRIMARY KEY (id_admin),
    FOREIGN KEY (campus) REFERENCES campus(id_campus)
);

DELIMITER //
CREATE TRIGGER admins_before_insert
BEFORE INSERT ON admins
FOR EACH ROW
BEGIN
  SET NEW.id_admin = CONCAT('S', LPAD(FLOOR(RAND() * 9999999999), 8, '0'));
END//
DELIMITER ;

CREATE TABLE students (
    matricula   CHAR(9)         NOT NULL,
    campus      CHAR(3)         NOT NULL,
    first_name  VARCHAR(20)     NOT NULL,
    flast_name  VARCHAR(20)     NOT NULL,
    slast_name  VARCHAR(20),

    PRIMARY KEY (matricula),
    FOREIGN KEY (campus) REFERENCES campus(id_campus)
);

DELIMITER //
CREATE TRIGGER students_before_insert
BEFORE INSERT ON students
FOR EACH ROW
BEGIN
  SET NEW.matricula = CONCAT('A', LPAD(FLOOR(RAND() * 9999999999), 8, '0'));
END//
DELIMITER ;

CREATE TABLE professors (
    nomina          CHAR(9)         NOT NULL,
    campus          CHAR(3)         NOT NULL,
    first_name      VARCHAR(20)     NOT NULL,
    flast_name      VARCHAR(20)     NOT NULL,
    slast_name      VARCHAR(20),

    PRIMARY KEY (nomina),
    FOREIGN KEY (campus) REFERENCES campus(id_campus)
);

DELIMITER //
CREATE TRIGGER professors_before_insert
BEFORE INSERT ON professors
FOR EACH ROW
BEGIN
  SET NEW.nomina = CONCAT('L', LPAD(FLOOR(RAND() * 9999999999), 8, '0'));
END//
DELIMITER ;

CREATE TABLE courses (
    id_course   CHAR(10)    NOT NULL,
    course_name VARCHAR(50) NOT NULL,

    PRIMARY KEY (id_course)
);

DELIMITER //
CREATE TRIGGER courses_before_insert
BEFORE INSERT ON courses
FOR EACH ROW
BEGIN
  SET NEW.id_course = CONCAT('C', LPAD(FLOOR(RAND() * 9999999999), 9, '0'));
END//
DELIMITER ;

CREATE TABLE grupos (
    id_group        CHAR(10)    NOT NULL,
    course          CHAR(10)    NOT NULL,
    main_professor  CHAR(9)     NOT NULL,
    term            CHAR(4)     NOT NULL,

    PRIMARY KEY (id_group),
    FOREIGN KEY (course) REFERENCES courses(id_course),
    FOREIGN KEY (main_professor) REFERENCES professors(nomina),
    FOREIGN KEY (term) REFERENCES terms(id_term)
);

DELIMITER //
CREATE TRIGGER grupos_before_insert
BEFORE INSERT ON grupos
FOR EACH ROW
BEGIN
  SET NEW.id_group = CONCAT('G', LPAD(FLOOR(RAND() * 9999999999), 9, '0'));
END//
DELIMITER ;

CREATE TABLE enrollments (
    grupo       CHAR(10)    NOT NULL,
    student     CHAR(9)     NOT NULL,

    PRIMARY KEY (grupo, student),
    FOREIGN KEY (grupo) REFERENCES grupos(id_group),
    FOREIGN KEY (student) REFERENCES students(matricula)
);

CREATE TABLE modules (
    id_module   CHAR(20)    NOT NULL,
    course      CHAR(10)    NOT NULL,
    nombre      VARCHAR(30) NOT NULL,

    PRIMARY KEY (id_module),
    FOREIGN KEY (course) REFERENCES courses(id_course)
);

DELIMITER //
CREATE TRIGGER modules_before_insert
BEFORE INSERT ON modules
FOR EACH ROW
BEGIN
  SET NEW.id_module = CONCAT('M', LPAD(FLOOR(RAND() * 9999999999), 19, '0'));
END//
DELIMITER ;

CREATE TABLE moduleConfigs (
    module      CHAR(20)    NOT NULL,
    grupo       CHAR(10)    NOT NULL,
    n_question  INT         NOT NULL,
    open_date   TIMESTAMP   NOT NULL,
    close_date  TIMESTAMP   NOT NULL,

    PRIMARY KEY (module, grupo),
    FOREIGN KEY (module) REFERENCES modules(id_module),
    FOREIGN KEY (grupo) REFERENCES grupos(id_group)
);

CREATE TABLE questions (
    id_question     CHAR(20)    NOT NULL,
    module          CHAR(20)    NOT NULL,
    q_type          VARCHAR(8)  NOT NULL,
    info            JSON        NOT NULL,
    created_by      CHAR(9)     NOT NULL,
    submittedOn     TIMESTAMP   NOT NULL,
    current_status  CHAR(3)     NOT NULL,

    PRIMARY KEY (id_question),
    FOREIGN KEY (module) REFERENCES modules(id_module),
    FOREIGN KEY (created_by) REFERENCES professors(nomina)
);

DELIMITER //
CREATE TRIGGER questions_before_insert
BEFORE INSERT ON questions
FOR EACH ROW
BEGIN
  SET NEW.id_question = CONCAT('CQ', LPAD(FLOOR(RAND() * 9999999999), 18, '0'));
END//
DELIMITER ;

CREATE TABLE homework (
    id_homework CHAR(20)        NOT NULL,
    grupo       CHAR(10)        NOT NULL,
    hw_name     VARCHAR(50)     NOT NULL,
    n_questions INT             NOT NULL,
    open_date   TIMESTAMP       NOT NULL,
    close_date  TIMESTAMP       NOT NULL,

    PRIMARY KEY (id_homework),
    FOREIGN KEY (grupo) REFERENCES grupos(id_group)
);

DELIMITER //
CREATE TRIGGER homework_before_insert
BEFORE INSERT ON homework
FOR EACH ROW
BEGIN
  SET NEW.id_homework = CONCAT('H', LPAD(FLOOR(RAND() * 9999999999), 19, '0'));
END//
DELIMITER ;

CREATE TABLE hw_questions (
    id_hwquestion   VARCHAR(20) NOT NULL,
    homework        CHAR(20)    NOT NULL,
    q_type          CHAR(5)     NOT NULL, -- multi, codep (code that uses prints), codef (code that uses functions, rip)
    info            JSON        NOT NULL,

    PRIMARY KEY (id_hwquestion),
    FOREIGN KEY (homework) REFERENCES homework(id_homework)
);

DELIMITER //
CREATE TRIGGER hw_questions_before_insert
BEFORE INSERT ON hw_questions
FOR EACH ROW
BEGIN
  SET NEW.id_hwquestion = CONCAT('HQ', LPAD(FLOOR(RAND() * 9999999999), 18, '0'));
END//
DELIMITER ;

CREATE TABLE questionAttempts (
    student         CHAR(9)     NOT NULL,
    grupo           CHAR(10)    NOT NULL,
    question        CHAR(20)    NOT NULL,
    attempt_status  CHAR(3)     NOT NULL,
    attempt_date    TIMESTAMP   NOT NULL,

    FOREIGN KEY (student) REFERENCES students(matricula),
    FOREIGN KEY (grupo) REFERENCES grupos(id_group),
    FOREIGN KEY (question) REFERENCES questions(id_question)
);

CREATE TABLE hw_questionAttempts (
    student         CHAR(9)     NOT NULL,
    grupo           CHAR(10)    NOT NULL,
    question        CHAR(20)    NOT NULL,
    attempt_status  CHAR(3)     NOT NULL,
    attempt_date    TIMESTAMP   NOT NULL,

    FOREIGN KEY (student) REFERENCES students(matricula),
    FOREIGN KEY (grupo) REFERENCES grupos(id_group),
    FOREIGN KEY (question) REFERENCES hw_questions(id_hwquestion)
);