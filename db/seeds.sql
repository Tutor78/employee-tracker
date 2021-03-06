INSERT INTO department (name)
VALUES
    ('Management'),
    ('Irrigation'),
    ('Chemical'),
    ('Maintenance');

INSERT INTO role (title, salary, department_id)
VALUES
    ('Area Manager', 50000, 1),
    ('Irrigation Tech', 40000, 2),
    ('Spray Tech', 40000, 3),
    ('Crew Leader', 40000, 4),
    ('Crew Member', 30000, 4);

INSERT INTO employee (id, first_name, last_name, role_id, manager_id)
VALUES
    (101, 'Ronald', 'Jackson', 1, NULL),
    (102, 'Timothy', 'Gates', 1, NULL),
    (103, 'Jackson', 'Smith', 1, NULL),
    (301, 'Trent', 'Mathers', 2, 101),
    (302, 'Warner', 'Bradford', 2, 101),
    (401, 'Dan', 'Elliston', 3, 102),
    (501, 'Lula', 'Braxton', 4, 103),
    (551, 'Aura', 'Tennison', 5, 103),
    (552, 'Liliana', 'Cason', 5, 103),
    (553, 'Boyd', 'Sergeant', 5, 103);