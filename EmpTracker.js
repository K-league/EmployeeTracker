const mysql = require('mysql');
const inquirer = require('inquirer');

const connection = mysql.createConnection({
    host: 'localhost',
    //port
    port: 3306,
    //user
    user: 'root',
    //MySQL password
    password: 'password',
    database: 'emp_trackerDB',
});

connection.connect((err) => {
    if (err) throw err;
    runSearch();
});

const runSearch = () => {
    console.log("");
    console.log("-------");
    console.log("");
    inquirer
        .prompt({
            name: 'action',
            type: 'rawlist',
            message: 'What would you like to do?',
            choices: [
                'Add departments',
                'Add roles',
                'Add employees',
                'View departments',
                'View roles',
                'View employees',
                'Update employee roles',
            ],
        })
        .then((answers) => {
            if (answers.action == 'Add departments') {
                addDepartments();
            } else if (answers.action == 'Add roles') {
                addRole();
            } else if (answers.action == 'Add employees') {
                addEmployees();
            } else if (answers.action == 'View departments') {
                viewDepartments();
            } else if (answers.action == 'View roles') {
                viewRoles();
            } else if (answers.action == 'View employees') {
                viewEmployees();
            } else if (answers.action == 'Update employee roles') {
                updateEmployeeRoles();
            } else {
                console.log("Unhandled Answer")
            }

        })
        .catch((error) => {
            if (error.isTtyError) {
                // Prompt couldn't be rendered in the current environment
            } else {
                console.log(error)
                // Something else went wrong
            }
        });
}

const addDepartments = () => {
    inquirer
        .prompt([
            {
                name: 'department_name',
                type: 'input',
                message: 'What is the department name?'
            },
        ])
        .then((answers) => {
            connection.query(
                'INSERT INTO department SET ?',
                {
                    dept_name: answers.department_name
                },
                (err) => {
                    if (err) throw err;
                    console.log('Department created successfully');
                    runSearch();
                }
            )
        })
}
const addRole = () => {
    connection.query("SELECT * FROM department", (err, departments) => {
        if (err) throw err;
        inquirer
            .prompt([
                {
                    name: 'title',
                    type: 'input',
                    message: 'What is the name of the role?',

                },
                {
                    name: 'salary',
                    type: 'input',
                    message: 'What is the salary for the role?',

                },
                {
                    name: 'department',
                    type: 'rawlist',
                    choices() {
                        const choiceArray = [];
                        departments.forEach(({ dept_name }) => {
                            choiceArray.push(dept_name);
                        });
                        return choiceArray;
                    },
                    message: 'What is the department?',
                },
            ])
            .then((answers) => {
                let dept_id;
                departments.forEach((dept) => {
                    if (answers.department === dept.dept_name) {
                        dept_id = dept.id
                    }
                })
                connection.query(
                    'INSERT INTO roles SET ?',
                    {
                        title: answers.title,
                        salary: answers.salary,
                        department_id: dept_id
                    },
                    (err) => {
                        if (err) throw err;
                        console.log('Role created successfully');
                        runSearch();
                    }
                )
            })
    })
}
const addEmployees = () => {
    connection.query('SELECT * FROM employee', (err, employees) => {
        if (err) throw err;
        connection.query('SELECT * FROM roles', (err, roles) => {
            if (err) throw err;
            inquirer
                .prompt([
                    {
                        name: 'first_name',
                        type: 'input',
                        message: "What is the first name of the employee?"
                    },
                    {
                        name: 'last_name',
                        type: 'input',
                        message: "What is the last name of the employee?"
                    },
                    {
                        name: 'manager',
                        type: 'rawlist',
                        choices() {
                            const choiceArray = ['No manager'];
                            employees.forEach(({ first_name, last_name }) => {
                                choiceArray.push(`${first_name} ${last_name}`);
                            })
                            return choiceArray
                        },
                        message: "Who is the manager of the employee?"
                    },
                    {
                        name: 'role',
                        type: 'rawlist',
                        choices() {
                            const choiceArray = [];
                            roles.forEach(({ title }) => {
                                choiceArray.push(title);
                            })
                            return choiceArray;
                        },
                        message: "What is the role of the employee?"
                    },
                ])
                .then((answers) => {
                    let manager_id;
                    employees.forEach((employee) => {
                        if (answers.manager === `${employee.first_name} ${employee.last_name}`) {
                            manager_id = employee.id
                        }
                    })
                    let role_id;
                    roles.forEach((role) => {
                        if (answers.role === role.title) {
                            role_id = role.id
                        }
                    })
                    connection.query(
                        'INSERT INTO employee SET ?',
                        {
                            first_name: answers.first_name,
                            last_name: answers.last_name,
                            role_id: role_id,
                            manager_id: manager_id
                        },
                        (err) => {
                            if (err) throw err;
                            console.log('Employee created successfully');
                            runSearch();
                        }
                    )
                })
        })
    })
}
const viewDepartments = () => {
    connection.query('SELECT * FROM department', (err, results) => {
        if (err) throw err;
        results.forEach((row) => {
            console.log(`Department ID: ${row.id} - Name: ${row.dept_name}`)
        });
        runSearch();
    })
}
const viewRoles = () => {
    connection.query('SELECT title, salary, dept_name FROM roles LEFT JOIN department on roles.department_id = department.id', (err, results) => {
        if (err) throw err;
        results.forEach((row) => {
            console.log(`Title: ${row.title}, Salary: ${row.salary}, Department: ${row.dept_name}`)
        });
        runSearch();
    })
}
const viewEmployees = () => {
    connection.query('SELECT e.first_name, e.last_name, r.title, r.salary, m.first_name as manager_fname, m.last_name as manager_lname FROM employee e LEFT JOIN roles r ON r.id=e.role_id LEFT JOIN employee m ON e.manager_id = m.id', (err, results) => {
        if (err) throw err;
        results.forEach((row) => {
            let manager_name = "No manager"
            if (row.manager_fname !== null && row.manager_lname !== null) {
                manager_name = `${row.manager_fname} ${row.manager_lname}`
            }
            console.log(`Employee: ${row.first_name} ${row.last_name}, Title: ${row.title}, Salary: ${row.salary}, Manager: ${manager_name}`)
        });
        runSearch();
    })
}
const updateEmployeeRoles = () => {
    connection.query('SELECT * FROM employee', (err, employees) => {
        if (err) throw err;
        connection.query('SELECT * FROM roles', (err, roles) => {
            if (err) throw err;
            inquirer
                .prompt([
                    {
                        name: 'employee',
                        type: 'rawlist',
                        choices() {
                            const choiceArray = [];
                            employees.forEach(({ first_name, last_name }) => {
                                choiceArray.push(`${first_name} ${last_name}`);
                            })
                            return choiceArray
                        },
                        message: "Which employee to update?"
                    },
                    {
                        name: 'role',
                        type: 'rawlist',
                        choices() {
                            const choiceArray = [];
                            roles.forEach(({ title }) => {
                                choiceArray.push(title);
                            })
                            return choiceArray;
                        },
                        message: "What is the role of the employee?"
                    },
                ])
                .then((answers) => {
                    let employee_id;
                    employees.forEach((employee) => {
                        if (answers.employee === `${employee.first_name} ${employee.last_name}`) {
                            employee_id = employee.id
                        }
                    })
                    let role_id;
                    roles.forEach((role) => {
                        if (answers.role === role.title) {
                            role_id = role.id
                        }
                    })
                    connection.query(
                        'UPDATE employee SET role_id = ? WHERE id = ?',
                        [role_id, employee_id],
                        (err) => {
                            if (err) throw err;
                            console.log('Employee updated successfully');
                            runSearch();
                        }
                    )
                })
        })
    })
}