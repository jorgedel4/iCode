-- Creacion de tablas
CREATE TABLE campus (
    id_campus   CHAR(3)         NOT NULL,
    name_campus VARCHAR(255)    NOT NULL,

    PRIMARY KEY (id_campus)
);

CREATE TABLE terms (
    id_term     CHAR(4)         NOT NULL,
    term        VARCHAR(20)     NOT NULL,

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

CREATE TABLE groups (
    id_group        VARCHAR(30) NOT NULL,
    id_course       VARCHAR(10) NOT NULL,
    main_professor  CHAR(9)     NOT NULL,

    PRIMARY KEY (id_group),
    FOREIGN KEY (id_course) REFERENCES courses(id_course),
    FOREIGN KEY (main_professor) REFERENCES professors(nomina)
);

CREATE TABLE enrollments (
    group       VARCHAR(30)     NOT NULL,
    student     CHAR(9)         NOT NULL,

    FOREIGN KEY (group) REFERENCES groups(id_group)
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
    group       VARCHAR(30)     NOT NULL,
    n_question  INT             NOT NULL,
    open_date   TIMESTAMP       NOT NULL,
    close_date  TIMESTAMP       NOT NULL,

    FOREIGN KEY (module) REFERENCES modules(id_module),
    FOREIGN KEY (group) REFERENCES groups(id_group)
);

CREATE TABLE questions (
    id_question VARCHAR(20)     NOT NULL,
    module      VARCHAR(20)     NOT NULL,
    mongo_id    VARCHAR(20)     NOT NULL,
    created_by  CHAR(9)         NOT NULL,
    submittedOn TIMESTAMP       NOT NULL,
    current_status  CHAR(3)     NOT NULL,
    q_type      CHAR(5)         NOT NULL,

    PRIMARY KEY (id_question),
    FOREIGN KEY (module) REFERENCES modules(id_module),
    FOREIGN KEY (createdBy) REFERENCES professors(nomina)
);

CREATE TABLE homework (
    id_homework VARCHAR(20)     NOT NULL,
    group       VARCHAR(30)     NOT NULL,
    hw_name     VARCHAR(30)     NOT NULL,
    n_questions INT             NOT NULL,
    open_date   TIMESTAMP       NOT NULL,
    close_date  TIMESTAMP       NOT NULL,

    PRIMARY KEY (id_homework),
    FOREIGN KEY (group) REFERENCES groups(id_group)
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
    group       VARCHAR(30) NOT NULL,
    question    VARCHAR(20) NOT NULL,
    attempt_status  CHAR(3) NOT NULL,
    attempt_date  TIMESTAMP NOT NULL,

    FOREIGN KEY (student) REFERENCES students(matricula),
    FOREIGN KEY (group) REFERENCES groups(id_group),
    FOREIGN KEY (question) REFERENCES questions(id_question)
);

CREATE TABLE hw_questionAttempts (
    student     CHAR(9)     NOT NULL,
    group       VARCHAR(30) NOT NULL,
    question    VARCHAR(20) NOT NULL,
    attempt_status  CHAR(3) NOT NULL,
    attempt_date  TIMESTAMP NOT NULL,

    FOREIGN KEY (student) REFERENCES students(matricula),
    FOREIGN KEY (group) REFERENCES groups(id_group),
    FOREIGN KEY (question) REFERENCES hw_questions(id_hwquestion)
);
-- Insercion de datos (falsos)