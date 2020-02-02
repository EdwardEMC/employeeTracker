INSERT INTO department (name) VALUE
    ("Sales"),
    ("Engineering"),
    ("Legal"),
    ("Finance");

INSERT INTO role (title, salary, department_id) VALUE
    ("Sales Lead", 75000, 1),
    ("Salesperson", 55000, 1),
    ("Lead Engineer", 94000, 2),
    ("Software Engineer", 73000, 2),
    ("Hardware Engineer", 79000, 2),
    ("Legal Team Lead", 90000, 3),
    ("Lawyer", 80000, 3),
    ("Accountant", 65000, 4);

INSERT INTO employee (first_name, last_name, role_id, manager_id) VALUE
    ("John", "Smith", 1, null),
    ("Nancy", "Carter", 2, 1),
    ("Peter", "Sinclair", 2, 1),
    ("Edward", "Coad", 3, null),
    ("Michael", "Schumer", 4, 4),
    ("Jacob", "Dims", 4, 4),
    ("Taylor", "Whist", 5, 4),
    ("Steven", "Cheng", 6, null),
    ("Drew", "Carrey", 7, 8),
    ("Lucy", "Leiu", 8, null);