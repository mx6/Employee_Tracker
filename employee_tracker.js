var mysql = require("mysql");
var inquirer = require("inquirer");

var connection = mysql.createConnection({
  host: "localhost",

  // Your port; if not 3306
  port: 3306,

  // Your username
  user: "root",

  // Your password
  password: "p a s s w o r d",
  database: "employeesDB"
});

connection.connect(function(err) {
  if (err) throw err;
  runSearch();
});

function runSearch() {

  console.log(`
  ----------------------------------------------------------------
  --               E M P L O Y E E  M A N A G E R               --
  --              * Copyright 2020 Real Fun Corp *              --
  ----------------------------------------------------------------
    `);
  
  inquirer
    .prompt({
      name: "action",
      type: "rawlist",
      message: "What would you like to do?",
      choices: [
        "View All Departments",
        "View All Employees",
        "View All Employees by Department",
        "View All Employees By Manager",
        "Add Employee",
        "Add Department",
        "Add Role",
        "Update Employee Role",
        "Update Employee Manager",
        "Quit"
      ]
    })
    .then(function(answer) {
      switch (answer.action) {

      case "View All Departments":
        viewDepartments();
        break;

      case "View All Employees":
        employeeSearch();
        break;

      case "View All Employees by Department":
        departmentSearch();
        break;

      case "View All Employees By Manager":
        managerSearch();
        break;

      case "Add Department":  
        addDepartment();
        break;

      case "Add Role":
        addRole();
        break;  

      case "Add Employee":
        addEmployee();
        break;

      case "Update Employee Role":
        updateEmployee();
        break;

      case "Update Employee Manager":
        updateEmployeeManager();
        break;

      case "Quit":
        console.log(`
  ----------------------------------------------------------------
  --                       G O O D  B Y E                       --
  ----------------------------------------------------------------
    `);
        connection.end();
      }
    });
}

function employeeSearch() {
  let sqlQuery = 'SELECT * FROM employee';
  connection.query(sqlQuery, (error, results) => {
		if (error) throw error;
		console.table(results);
    // connection.end();
    inquirer
    .prompt({
      name: "action",
      type: "rawlist",
      message: "What would you like to do?",
      choices: [
   
        "Start Over",
        "Quit"
      ]
    })
    .then(function(answer) {
      switch (answer.action) {

      case "Start Over":
        runSearch();
        break;

      case "Quit":
        console.log(`
  ----------------------------------------------------------------
  --                       G O O D  B Y E                       --
  ----------------------------------------------------------------
    `);
        connection.end();
      }
    });
	});
}

function departmentSearch() {
  let sqlQuery = 'SELECT * FROM department';
  connection.query(sqlQuery, (error, results) => {
		if (error) throw error;
    const departments=results.map(result => ({value:result.id, name:result.name}))
    inquirer
    .prompt([
      {
        type: 'list',
        name: 'id',
        message: 'Please Select a Department',
        choices: departments

      }
      
    ]).then(response => {
      let sqlQuery = "SELECT employee.id, CONCAT(employee.first_name,' ', employee.last_name) as name, role.title AS Title FROM employee LEFT JOIN role ON employee.role_id = role.id LEFT JOIN department department ON role.department_id = department.id WHERE department.id = ?";
      connection.query(sqlQuery, response.id, (error, results) => {
        if (error) throw error;
        console.table(results);
        connection.end();
      });
    })

 
});
};

function managerSearch() {
  
}


const viewDepartments = () => {
	let sqlQuery = 'SELECT * FROM department';
	connection.query(sqlQuery, (error, results) => {
		if (error) throw error;
		console.table(results);
    // connection.end();
    inquirer
    .prompt({
      name: "action",
      type: "rawlist",
      message: "What would you like to do?",
      choices: [
   
        "Start Over",
        "Quit"
      ]
    })
    .then(function(answer) {
      switch (answer.action) {

      case "Start Over":
        runSearch();
        break;

      case "Quit":
        console.log(`
  ----------------------------------------------------------------
  --                       G O O D  B Y E                       --
  ----------------------------------------------------------------
    `);
        connection.end();
      }
    });
	});
};

const addDepartment = () => {
	//ask user department name
	inquirer
		.prompt([
			{
				type: 'input', 
				name: 'department_name',
				message: 'Please, insert a name of new department',
			},
		])
		.then(response => {
			let sqlQuery = 'INSERT INTO department SET ?'; 
			let dep = {
				name: response.department_name, //database is expecting and object with key = to column name
			};
			connection.query(sqlQuery, dep, (error, results) => {
				if (error) throw error;
				console.log('New department has been successfully created');
        // connection.end();
        inquirer
        .prompt({
          name: "action",
          type: "rawlist",
          message: "What would you like to do?",
          choices: [
       
            "Start Over",
            "Quit"
          ]
        })
        .then(function(answer) {
          switch (answer.action) {
    
          case "Start Over":
            runSearch();
            break;
    
          case "Quit":
            console.log(`
      ----------------------------------------------------------------
      --                       G O O D  B Y E                       --
      ----------------------------------------------------------------
        `);
            connection.end();
          }
        });
			});
    });
    
};


const addRole = () => {
  //ask user role name
  const sqlQuery="SELECT * FROM department"
  connection.query(sqlQuery, (error, results) => {
    if (error) throw error;
    const departments=results.map(result => ({value:result.id, name:result.name}))
    console.log(departments);
	inquirer
		.prompt([
			{
				type: 'input', 
				name: 'title',
        message: 'Please, insert a name of a new job role',
      },
   
      {   
        type: 'input', 
				name: 'salary',
				message: 'Please specify a salary amount',
      },
      {   
        type: 'list', 
				name: 'department_id',
        message: 'Please choose a department',
        choices:departments
			},
		])
		.then(response => {
      console.log(response);
			let sqlQuery = 'INSERT INTO role SET ?'; 
			let role = {
				title: response.roleTitle, //database is expecting and object with key = to column name
			};
			connection.query(sqlQuery, response, (error, results) => {
				if (error) throw error;
				console.log('New job role has been successfully created');
        // connection.end();
        inquirer
        .prompt({
          name: "action",
          type: "rawlist",
          message: "What would you like to do?",
          choices: [
       
            "Start Over",
            "Quit"
          ]
        })
        .then(function(answer) {
          switch (answer.action) {
    
          case "Start Over":
            runSearch();
            break;
    
          case "Quit":
            console.log(`
      ----------------------------------------------------------------
      --                       G O O D  B Y E                       --
      ----------------------------------------------------------------
        `);
            connection.end();
          }
        });
			});
    });
  });
};

function addEmployee() {
  //ask user employee name
    connection.query("SELECT * FROM role", (error, results) => {
      if (error) throw error;
      const roles=results.map(result => ({value:result.id, name:result.title}))
    const sqlQuery="SELECT * FROM employee"
    connection.query(sqlQuery, (error, results) => {
      if (error) throw error;
      const manager=results.map(result => ({value:result.id, name:result.first_name + " " + result.last_name}))
      manager.push({name: "No Manager", value:null})

    inquirer
      .prompt([
        {
          type: 'input', 
          name: 'first_name',
          message: 'What is employee first name?',
        },
     
        {   
          type: 'input', 
          name: 'last_name',
          message: 'What is employee last name?',
        },
        {   
          type: 'list', 
          name: 'role_id',
          message: 'What is employee role?',
          choices: roles
        },
        {
          type: 'list', 
          name: 'manager_id',
          message: 'Select Employee Manager',
          choices: manager
        }
      ])
      .then(response => {
        console.log(response);
        let sqlQuery = 'INSERT INTO employee SET ?'; 
        let role = {
          title: response.roleTitle, //database is expecting and object with key = to column name
        };
        connection.query(sqlQuery, response, (error, results) => {
          if (error) throw error;
          console.log('New employee has been successfully created');
          // connection.end();
          inquirer
          .prompt({
            name: "action",
            type: "rawlist",
            message: "What would you like to do?",
            choices: [
         
              "Start Over",
              "Quit"
            ]
          })
          .then(function(answer) {
            switch (answer.action) {
      
            case "Start Over":
              runSearch();
              break;
      
            case "Quit":
              console.log(`
        ----------------------------------------------------------------
        --                       G O O D  B Y E                       --
        ----------------------------------------------------------------
          `);
              connection.end();
            }
          });
        });
      });
    });
})};

function updateEmployee() {
  
};

function updateEmployeeManager(){

};
