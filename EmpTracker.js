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
    if(err) throw err;
    runSearch();
});

const runSearch = () => {
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
            if(answers.action == 'Add departments'){
                addDepartments();
            } else if (answers.action == 'Add roles') {
                addRole();
            } else if (answers.action == 'Add employees') {
                addEmployees();
            } else if (answers.action == 'View departments') {
                viewDepartments();
            } else if (answers.action == 'View roles') {
                viewRoles();
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
                name:'department_name',
                type: 'choice',
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
    inquirer
        .prompt([
            {
                name:'role_name',
                type: 'input',
                message: 'What is the name of the role?',
            },
        ])
        .then((answers) => {
            connection.query(
                'INSERT INTO roles SET ?',
                {
                    title: answers.title,
                    salary: answers.salary,
                    department_id: answers.department_id
                },
                (err) => {
                  if (err) throw err;
                  console.log('Role created successfully');
                  runSearch();
                }
            )
        })
}
const addEmployees = () => {
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
                type: 'choice',
                message: "Who is the manager of the employee?"
            },
            {
                name: 'role',
                type: 'choice',
                message: "What is the role of the employee?"
            },
        ])
        .then((answers) => {
            connection.query(
                'INSERT INTO employee SET ?',
                {
                    first_name: answers.first_name,
                    last_name: answers.last_name,
                    role_id: answers.role,
                    manager_id: answers.manager_id
                },
                (err) => {
                  if (err) throw err;
                  console.log('Employee created successfully');
                  runSearch();
                }
            )
        })
}
const viewDepartments = () => {
    connection.query('SELECT * FROM department', (err, results) => {
        if (err) throw err;
        results.forEach((row) => {
            console.log(`Department ID: ${row.id} - Name: ${row.dept_name}`)
        })
    })
}
const viewRoles = () => {
    connection.query('SELECT * FROM roles', (err, results) => {
        if (err) throw err;
        results.forEach((row) => {
            console.log(`Role ID: ${row.id} - Name: ${row.role_name}`)
        })
    })
}
const updateEmployeeRoles = () => {
    console.log('Updating employee role...\n');
    const query = con
    connection.query('UPDATE roles', (err, results) => {
        if (err) throw err;
        results.forEach((row) => {
            console.log(`Role ID: ${row.id} - Name: ${row.role_name}`)
        })
    })
}