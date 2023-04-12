DROP DATABASE IF EXISTS iCode;
CREATE DATABASE iCode;

USE iCode;

-- Creacion de tablas
CREATE TABLE campus (
    id_campus   CHAR(3)         NOT NULL,
    name_campus VARCHAR(255)    NOT NULL,

    PRIMARY KEY (id_campus)
);

CREATE TABLE terms (
    id_term     CHAR(4)         NOT NULL,
    term        VARCHAR(25)     NOT NULL,
    startDate   TIMESTAMP       NOT NULL,
    endDate     TIMESTAMP       NOT NULL,

    PRIMARY KEY (id_term)
);

CREATE TABLE admins (
    id_admin    VARCHAR(255)    NOT NULL,
    id_campus   CHAR(3)         NOT NULL,
    first_name  VARCHAR(20)     NOT NULL,
    flast_name  VARCHAR(20)     NOT NULL,
    slast_name  VARCHAR(20),

    PRIMARY KEY (id_admin),
    FOREIGN KEY (id_campus) REFERENCES campus(id_campus)
);


CREATE TABLE students (
    matricula   CHAR(9)         NOT NULL,
    id_campus   CHAR(3)         NOT NULL,
    id_term     CHAR(4)         NOT NULL,
    first_name  VARCHAR(20)     NOT NULL,
    flast_name  VARCHAR(20)     NOT NULL,
    slast_name  VARCHAR(20),

    PRIMARY KEY (matricula),
    FOREIGN KEY (id_campus) REFERENCES campus(id_campus),
    FOREIGN KEY (id_term) REFERENCES terms(id_term)
);

CREATE TABLE professors (
    nomina      CHAR(9)         NOT NULL,
    id_campus   CHAR(3)         NOT NULL,
    first_name  VARCHAR(20)     NOT NULL,
    flast_name  VARCHAR(20)     NOT NULL,
    slast_name  VARCHAR(20),

    PRIMARY KEY (nomina),
    FOREIGN KEY (id_campus) REFERENCES campus(id_campus)
);

CREATE TABLE courses (
    id_course   VARCHAR(10)     NOT NULL,
    course_name VARCHAR(30)     NOT NULL,

    PRIMARY KEY (id_course)
);

CREATE TABLE grupos (
    id_group        VARCHAR(30) NOT NULL,
    id_course       VARCHAR(10) NOT NULL,
    main_professor  CHAR(9)     NOT NULL,
    term            VARCHAR(25) NOT NULL,

    PRIMARY KEY (id_group),
    FOREIGN KEY (id_course) REFERENCES courses(id_course),
    FOREIGN KEY (main_professor) REFERENCES professors(nomina),
    FOREIGN KEY (term) REFERENCES terms(id_term)
);

CREATE TABLE enrollments (
    grupo      VARCHAR(30)     NOT NULL,
    student     CHAR(9)         NOT NULL,

    FOREIGN KEY (grupo) REFERENCES grupos(id_group)
);

CREATE TABLE modules (
    id_module   VARCHAR(20)     NOT NULL,
    course      VARCHAR(10)     NOT NULL,
    module_name VARCHAR(20)     NOT NULL,

    PRIMARY KEY (id_module),
    FOREIGN KEY (course) REFERENCES courses(id_course)
);

CREATE TABLE moduleConfigs (
    module      VARCHAR(20)     NOT NULL,
    grupo      VARCHAR(30)     NOT NULL,
    n_question  INT             NOT NULL,
    open_date   TIMESTAMP       NOT NULL,
    close_date  TIMESTAMP       NOT NULL,

    FOREIGN KEY (module) REFERENCES modules(id_module),
    FOREIGN KEY (grupo) REFERENCES grupos(id_group)
);

CREATE TABLE questions (
    id_question VARCHAR(20)     NOT NULL,
    module      VARCHAR(20)     NOT NULL,
    mongo_id    VARCHAR(20)     NOT NULL,
    created_by  CHAR(9)         NOT NULL,
    submittedOn TIMESTAMP       NOT NULL,
    current_status  CHAR(3)     NOT NULL,
    q_type      VARCHAR(8)      NOT NULL,

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
    student     CHAR(9)     NOT NULL,
    grupo       VARCHAR(30) NOT NULL,
    question    VARCHAR(20) NOT NULL,
    attempt_status  CHAR(3) NOT NULL,
    attempt_date  TIMESTAMP NOT NULL,

    FOREIGN KEY (student) REFERENCES students(matricula),
    FOREIGN KEY (grupo) REFERENCES grupos(id_group),
    FOREIGN KEY (question) REFERENCES questions(id_question)
);

CREATE TABLE hw_questionAttempts (
    student     CHAR(9)     NOT NULL,
    grupo       VARCHAR(30) NOT NULL,
    question    VARCHAR(20) NOT NULL,
    attempt_status  CHAR(3) NOT NULL,
    attempt_date  TIMESTAMP NOT NULL,

    FOREIGN KEY (student) REFERENCES students(matricula),
    FOREIGN KEY (grupo) REFERENCES grupos(id_group),
    FOREIGN KEY (question) REFERENCES hw_questions(id_hwquestion)
);
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
    ("S02351234", "MTY", "Galactus", "Lider", "Supremo");

INSERT INTO students VALUES
    ("A01551955", "PUE", "FJ23", "Jorge", "Delgado", "Morales"),
    ("A01730545", "MTY", "FJ23", "Karla", "Sanchez", "Olivares"),
    ("A01633525", "PUE", "FJ23", "Israel", "Perez", "Ontiveros");

INSERT INTO professors VALUES
    ("L01922384", "PUE", "Daniel", "Perez", "Rojas"),
    ("L01922235", "MTY", "Paola", "Samora", "Mendoza");

INSERT INTO courses VALUES
    ("TC1028", "Pensamiento computacional");

INSERT INTO grupos VALUES
    ("G001", "TC1028", "L01922384", "FJ23"),
    ("G002", "TC1028", "L01922235", "FJ23");

INSERT INTO enrollments VALUES
    ("G001", "A01551955"),
    ("G001", "A01633525"),
    ("G002", "A01730545");

INSERT INTO modules VALUES
    ("1", "TC1028", "Conditionals"),
    ("2", "TC1028", "For loops"),
    ("3", "TC1028", "While loops");

INSERT INTO moduleConfigs VALUES
    ("1", "G001", 3, '2023-11-15 00:00:00', '2023-11-20 00:00:00'),
    ("2", "G001", 2, '2023-11-21 00:00:00', '2023-11-25 00:00:00');

INSERT INTO questions VALUES
    ("23jkalkiawd", "1", "test/test/1", "L01922384", '2023-11-25 00:00:00', "PEN", "code"),
    ("3wr93qwnd32", "1", "test/test/2", "L01922384", '2023-11-25 00:00:00', "PEN", "code"),
    ("92nead9002s", "1", "test/test/3", "L01922384", '2023-11-25 00:00:00', "PEN", "code");
