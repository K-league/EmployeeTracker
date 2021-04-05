DROP DATABASE IF EXISTS emp_trackerDB;
CREATE database emp_trackerDB;

USE emp_trackerDB;

CREATE TABLE department (
    INT PRIMARY KEY (id),
    VARCHAR(30),
);

CREATE TABLE rolee (
    INT PRIMARY KEY (id),
    title VARCHAR(30),
    salary DECIMAL (10,4),
    department_id INT,
);

CREATE TABLE employee (
    INT PRIMARY KEY (id),
    first_name VARCHAR(30),
    last_name VARCHAR(30),
    role_id INT,
    manager_id INT NULL,
);

SELECT * FROM department;
select * from rolee;
select * from employee;