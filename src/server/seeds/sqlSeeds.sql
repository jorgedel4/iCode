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
    startDate   TIMESTAMP       NOT NULL,
    endDate     TIMESTAMP       NOT NULL,

    PRIMARY KEY (id_term)
);

CREATE TABLE admins (
    id_admin    VARCHAR(255)    NOT NULL,
    campus      CHAR(3)         NOT NULL,
    first_name  VARCHAR(20)     NOT NULL,
    flast_name  VARCHAR(20)     NOT NULL,
    slast_name  VARCHAR(20),

    PRIMARY KEY (id_admin),
    FOREIGN KEY (campus) REFERENCES campus(id_campus)
);


CREATE TABLE students (
    matricula   CHAR(9)         NOT NULL,
    campus      CHAR(3)         NOT NULL,
    term        CHAR(4)         NOT NULL,
    first_name  VARCHAR(20)     NOT NULL,
    flast_name  VARCHAR(20)     NOT NULL,
    slast_name  VARCHAR(20),

    PRIMARY KEY (matricula),
    FOREIGN KEY (campus) REFERENCES campus(id_campus),
    FOREIGN KEY (term) REFERENCES terms(id_term)
);

CREATE TABLE professors (
    nomina          CHAR(9)         NOT NULL,
    campus          CHAR(3)         NOT NULL,
    first_name      VARCHAR(20)     NOT NULL,
    flast_name      VARCHAR(20)     NOT NULL,
    slast_name      VARCHAR(20),

    PRIMARY KEY (nomina),
    FOREIGN KEY (campus) REFERENCES campus(id_campus)
);

CREATE TABLE courses (
    id_course   VARCHAR(10)     NOT NULL,
    course_name VARCHAR(50)     NOT NULL,

    PRIMARY KEY (id_course)
);

CREATE TABLE grupos (
    id_group        VARCHAR(30) NOT NULL,
    course          VARCHAR(10) NOT NULL,
    main_professor  CHAR(9)     NOT NULL,
    term            CHAR(4)     NOT NULL,

    PRIMARY KEY (id_group),
    FOREIGN KEY (course) REFERENCES courses(id_course),
    FOREIGN KEY (main_professor) REFERENCES professors(nomina),
    FOREIGN KEY (term) REFERENCES terms(id_term)
);

CREATE TABLE enrollments (
    grupo       VARCHAR(30)     NOT NULL,
    student     CHAR(9)         NOT NULL,

    FOREIGN KEY (grupo) REFERENCES grupos(id_group),
    FOREIGN KEY (student) REFERENCES students(matricula)
);

CREATE TABLE modules (
    id_module   VARCHAR(20)     NOT NULL,
    course      VARCHAR(10)     NOT NULL,
    nombre      VARCHAR(20)     NOT NULL,

    PRIMARY KEY (id_module),
    FOREIGN KEY (course) REFERENCES courses(id_course)
);

CREATE TABLE moduleConfigs (
    module      VARCHAR(20)     NOT NULL,
    grupo       VARCHAR(30)     NOT NULL,
    n_question  INT             NOT NULL,
    open_date   TIMESTAMP       NOT NULL,
    close_date  TIMESTAMP       NOT NULL,

    FOREIGN KEY (module) REFERENCES modules(id_module),
    FOREIGN KEY (grupo) REFERENCES grupos(id_group)
);

CREATE TABLE questions (
    id_question     VARCHAR(20)     NOT NULL,
    module          VARCHAR(20)     NOT NULL,
    mongo_id        VARCHAR(30)     NOT NULL,
    created_by      CHAR(9)         NOT NULL,
    submittedOn     TIMESTAMP       NOT NULL,
    current_status  CHAR(3)         NOT NULL,
    q_type          VARCHAR(8)      NOT NULL,

    PRIMARY KEY (id_question),
    FOREIGN KEY (module) REFERENCES modules(id_module),
    FOREIGN KEY (created_by) REFERENCES professors(nomina)
);

CREATE TABLE homework (
    id_homework VARCHAR(20)     NOT NULL,
    grupo       VARCHAR(30)     NOT NULL,
    hw_name     VARCHAR(30)     NOT NULL,
    n_questions INT             NOT NULL,
    open_date   TIMESTAMP       NOT NULL,
    close_date  TIMESTAMP       NOT NULL,

    PRIMARY KEY (id_homework),
    FOREIGN KEY (grupo) REFERENCES grupos(id_group)
);

CREATE TABLE hw_questions (
    id_hwquestion   VARCHAR(20) NOT NULL,
    homework        VARCHAR(20) NOT NULL,
    mongo_id        VARCHAR(20) NOT NULL,
    q_type          CHAR(5)     NOT NULL,

    PRIMARY KEY (id_hwquestion),
    FOREIGN KEY (homework) REFERENCES homework(id_homework)
);

CREATE TABLE questionAttempts (
    student         CHAR(9)     NOT NULL,
    grupo           VARCHAR(30) NOT NULL,
    question        VARCHAR(20) NOT NULL,
    attempt_status  CHAR(3)     NOT NULL,
    attempt_date    TIMESTAMP   NOT NULL,

    FOREIGN KEY (student) REFERENCES students(matricula),
    FOREIGN KEY (grupo) REFERENCES grupos(id_group),
    FOREIGN KEY (question) REFERENCES questions(id_question)
);

CREATE TABLE hw_questionAttempts (
    student         CHAR(9)     NOT NULL,
    grupo           VARCHAR(30) NOT NULL,
    question        VARCHAR(20) NOT NULL,
    attempt_status  CHAR(3)     NOT NULL,
    attempt_date    TIMESTAMP   NOT NULL,

    FOREIGN KEY (student) REFERENCES students(matricula),
    FOREIGN KEY (grupo) REFERENCES grupos(id_group),
    FOREIGN KEY (question) REFERENCES hw_questions(id_hwquestion)
);

-- Functiones
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

-- Insercion de datos (falsos)
INSERT INTO campus VALUES
    ("PUE", "Puebla"),
    ("CSF", "Santa Fe"),
    ("MTY", "Monterrey"),
    ("GDL", "Guadalajara"),
    ("HID", "Hidalgo");

INSERT INTO terms VALUES
    ("IV22", "Invierno 2022", '2022-01-5 00:00:00', '2022-02-12 00:00:00'), 
    ("FJ22", "Febrero-Junio 2022", '2022-02-15 00:00:00', '2022-06-26 00:00:00'),
    ("VE22", "Verano 2022", '2022-07-5 00:00:00', '2022-08-25 00:00:00'),
    ("AD22", "Agosto-Diciembre 2022", '2022-08-28 00:00:00', '2022-12-12 00:00:00'),
    ("IV23", "Invierno 2023", '2023-01-5 00:00:00', '2023-02-12 00:00:00'), 
    ("FJ23", "Febrero-Junio 2023", '2023-02-15 00:00:00', '2023-06-26 00:00:00'),
    ("VE23", "Verano 2023", '2023-07-5 00:00:00', '2023-08-25 00:00:00'),
    ("AD23", "Agosto-Diciembre 2023", '2023-08-28 00:00:00', '2023-12-12 00:00:00');

INSERT INTO admins VALUES
    ("S04912941", "PUE", "Sam", "Sepiol", NULL),
    ("S03248671", "GDL", "Sam", "Sepiol", "Qwerty"),
    ("S02351234", "MTY", "Galactus", "Lider", "Supremo");

INSERT INTO students VALUES
    ("A0664301", "PUE", "FJ23", "Jorge", "Delgado", "Morales"),
    ("A0790712", "MTY", "FJ23", "Karla", "Sanchez", "Olivares"),
    ("A0552934", "PUE", "FJ23", "Jose", "Cardoza", "Mendez"),
    ("A0204356", "CSF", "FJ23", "Maria", "Ortiz", "Reyes"),
    ("A0132179", "PUE", "FJ23", "Adriana", "Fernandez", "Rojas"),
    ("A0227648", "HID", "FJ23", "Juan", "Ortega", "Vasquez"),
    ("A0379510", "GDL", "IV23", "Aldo", "Pacheco", "Morales"),
    ("A0701258", "GDL", "FJ23", "Carlos", "Villasenor", "Pacheco"),
    ("A0829254", "PUE", "FJ23", "Carolina", "Martinez", "Gutierrez"),
    ("A0916872", "MTY", "FJ23", "Patricio", "Ramirez", "Sandoval"),
    ("A0192836", "PUE", "IV23", "Mauricio", "Oropeza", "Ruiz"),
    ("A0932487", "GDL", "FJ23", "Ramiro", "Hernandez", "Villasenor"),
    ("A0738291", "CSF", "FJ23", "Ana", "Lopez", "Garcia"),
    ("A0857412", "MTY", "FJ23", "Sofia", "Garcia", "Jimenez"),
    ("A0314692", "PUE", "FJ23", "Fernando", "Gonzalez", "Cortes"),
    ("A0478236", "HID", "FJ23", "Julio", "Castillo", "Sanchez"),
    ("A0256413", "GDL", "IV23", "Paulina", "Rojas", "Torres"),
    ("A0541368", "MTY", "FJ23", "Diego", "Valle", "Gutierrez"),
    ("A0806291", "PUE", "FJ23", "Luis", "Mendez", "Hernandez"),
    ("A0428159", "GDL", "FJ23", "Mariana", "Alvarez", "Torres"),
    ("A0975314", "PUE", "IV23", "Rafael", "Diaz", "Castillo"),
    ("A0614923", "HID", "FJ23", "Miguel", "Ramirez", "Martinez");

INSERT INTO professors VALUES
    ("L01922384", "PUE", "Daniel", "Perez", "Rojas"),
    ("L08294325", "MTY", "Claudia", "Perez", "Lezama"),
    ("L03243512", "GDL", "Rosa", "Paredes", "Juarez"),
    ("L00234328", "CSF", "Alba", "Romero", "Garcia");


INSERT INTO courses VALUES
    ("TC1028", "Pensamiento computacional"),
    ("TC1030", "Programacion orientada a objetos"),
    ("TC1031", "Estructuras de datos y algoritmos");

INSERT INTO grupos VALUES
    ("G00000001", "TC1028", "L01922384", "FJ23"),
    ("G00000002", "TC1028", "L01922384", "FJ23"),
    ("G00000003", "TC1031", "L01922384", "IV23"),
    ("G00000004", "TC1028", "L08294325", "FJ23"),
    ("G00000005", "TC1030", "L08294325", "FJ23"),
    ("G00000006", "TC1031", "L03243512", "IV23"),
    ("G00000007", "TC1028", "L00234328", "FJ23");

INSERT INTO enrollments VALUES
    ("G00000001", "A0664301"),
    ("G00000001", "A0552934"),
    ("G00000001", "A0132179"),
    ("G00000001", "A0829254"),
    ("G00000001", "A0192836"),
    ("G00000002", "A0975314"),
    ("G00000002", "A0806291"),
    ("G00000002", "A0314692"),
    ("G00000003", "A0664301"),
    ("G00000003", "A0192836"),
    ("G00000003", "A0806291"),
    ("G00000004", "A0916872"),
    ("G00000004", "A0857412"),
    ("G00000004", "A0541368"),
    ("G00000004", "A0790712"),
    ("G00000005", "A0916872"),
    ("G00000005", "A0790712"),
    ("G00000006", "A0379510"),
    ("G00000006", "A0701258"),
    ("G00000006", "A0256413"),
    ("G00000006", "A0428159"),
    ("G00000007", "A0204356"),
    ("G00000007", "A0738291");

INSERT INTO modules VALUES
    ("M00000001", "TC1028", "Conditionals"),
    ("M00000002", "TC1028", "For loops"),
    ("M00000003", "TC1028", "While loops"),
    ("M00000004", "TC1030", "Atributos"),
    ("M00000005", "TC1030", "Metodos"),
    ("M00000006", "TC1030", "Polimorfismo"),
    ("M00000008", "TC1031", "Complejidades"),
    ("M00000007", "TC1031", "Busqueda binaria"),
    ("M00000009", "TC1031", "Arbol binario");

INSERT INTO moduleConfigs VALUES
    ("M00000001", "G00000001", 3, '2023-04-20 00:00:00', '2023-04-30 00:00:00'),
    ("M00000002", "G00000001", 3, '2023-05-01 00:00:00', '2023-05-10 00:00:00'),
    ("M00000003", "G00000001", 3, '2023-05-11 00:00:00', '2023-05-20 00:00:00');

INSERT INTO questions VALUES
    ("23jkalkiawd", "M00000001", "TC1028/Conditionals/1", "L01922384", '2023-04-15 00:00:00', "APP", "code"),
    ("3wr93qwnd32", "M00000001", "TC1028/Conditionals/2", "L01922384", '2023-04-15 00:00:00', "APP", "code"),
    ("92nead9002s", "M00000001", "TC1028/Conditionals/3", "L01922384", '2023-04-15 00:00:00', "APP", "code"),
    ("53721346fdg", "M00000002", "TC1028/For_loops/1", "L01922384", '2023-04-15 00:00:00', "APP", "code"),
    ("se0cn8272jd", "M00000002", "TC1028/For_loops/2", "L01922384", '2023-04-15 00:00:00', "APP", "code"),
    ("2898n73fn7s", "M00000002", "TC1028/For_loops/3", "L01922384", '2023-04-15 00:00:00', "APP", "code"),
    ("189n73nf7sd", "M00000003", "TC1028/While_loops/1", "L01922384", '2023-04-15 00:00:00', "APP", "code"),
    ("29n0sanf826", "M00000003", "TC1028/While_loops/2", "L01922384", '2023-04-15 00:00:00', "APP", "code"),
    ("10n8aw62b9a", "M00000003", "TC1028/While_loops/3", "L01922384", '2023-04-15 00:00:00', "APP", "code");

INSERT INTO homework VALUES
    ("289081hnadg", "G00000001", "Tarea 1: Condicionales", 2, '2023-04-20 00:00:00', '2023-04-25 00:00:00'),
    ("c82495n0p10", "G00000001", "Tarea 2: Condicionales", 2, '2023-04-25 00:00:00', '2023-04-30 00:00:00');

INSERT INTO hw_questions VALUES
    ("12094nc190a", "289081hnadg", "TC1028/G00000001/1", "codee"),
    ("n7awd7aw623", "289081hnadg", "TC1028/G00000001/2", "codee"),
    ("1761biasj1d", "289081hnadg", "TC1028/G00000001/3", "codee"),
    ("19nm7a9s71g", "c82495n0p10", "TC1028/G00000001/4", "codee"),
    ("91028ajhcb1", "c82495n0p10", "TC1028/G00000001/5", "codee"),
    ("4a6n54rt4t2", "c82495n0p10", "TC1028/G00000001/6", "codee");

INSERT INTO hw_questionAttempts VALUES
    ("A0664301", "G00000001", "12094nc190a", "PAS", '2023-04-14 12:43:23');