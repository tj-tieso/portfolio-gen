const inquirer = require("inquirer");
const fs = require("fs");
const generatePage = require("./src/page-template.js");

const dummyData = {
  name: "Trev",
  github: "tj-tieso",
  confirmAbout: true,
  about: "I like DnD",
  projects: [
    {
      name: "Run Buddy",
      description: "Lets run.",
      languages: ["HTML", "CSS"],
      link: "https://github.com/tj-tieso/run-buddy",
      feature: true,
      confirmAddProject: true,
    },
    {
      name: "Robot Gladiators",
      description: "FIIIIIGGGGGHHHTTTT",
      languages: ["HTML", "CSS"],
      link: "https://github.com/tj-tieso/robot-gladiators",
      feature: true,
      confirmAddProject: true,
    },
  ],
};

// const pageHTML = generatePage(name, github);

const promptUser = () => {
  return inquirer.prompt([
    {
      type: "input",
      name: "name",
      message: "What is your name?",
      validate: (nameInput) => {
        if (nameInput) {
          return true;
        } else {
          console.log("please enter your name");
          return false;
        }
      },
    },
    {
      type: "input",
      name: "github",
      message: "What is your GitHub Username?",
      validate: (nameInput) => {
        if (nameInput) {
          return true;
        } else {
          console.log("please enter your GitHub Username");
          return false;
        }
      },
    },
    {
      type: "confirm",
      name: "confirmAbout",
      message:
        'Would you like to enter some information about yourself for an "About" section?',
      default: true,
    },
    {
      type: "input",
      name: "about",
      message: "Provide some information about yourself?",
      when: ({ confirmAbout }) => {
        if (confirmAbout) {
          return true;
        } else {
          return false;
        }
      },
    },
  ]);
};

const promptProject = (portfolioData) => {
  // if not projects array, create one
  if (!portfolioData.projects) {
    portfolioData.projects = [];
  }

  console.log(`
=================
Add a New Project
=================
`);
  return inquirer
    .prompt([
      {
        type: "input",
        name: "name",
        message: "What is the name of your project?",
        validate: (nameInput) => {
          if (nameInput) {
            return true;
          } else {
            console.log("please enter the name of your project");
            return false;
          }
        },
      },
      {
        type: "input",
        name: "description",
        message: "Provide a description of the project (Required)",
        validate: (nameInput) => {
          if (nameInput) {
            return true;
          } else {
            console.log("please provide a description of the project");
            return false;
          }
        },
      },
      {
        type: "checkbox",
        name: "languages",
        message: "What did you build this project with? (Check all that apply)",
        choices: [
          "JavaScript",
          "HTML",
          "CSS",
          "ES6",
          "jQuery",
          "Bootstrap",
          "Node",
        ],
      },
      {
        type: "input",
        name: "link",
        message: "Enter the GitHub link to your project. (Required)",
        validate: (nameInput) => {
          if (nameInput) {
            return true;
          } else {
            console.log("Please enter the GitHub link to your project.");
            return false;
          }
        },
      },
      {
        type: "confirm",
        name: "feature",
        message: "Would you like to feature this project?",
        default: false,
      },
      {
        type: "confirm",
        name: "confirmAddProject",
        message: "Would you like to enter another project?",
        default: false,
      },
    ])
    .then((projectData) => {
      portfolioData.projects.push(projectData);
      if (projectData.confirmAddProject) {
        return promptProject(portfolioData);
      } else {
        return portfolioData;
      }
    });
};

// dummy data call
// const pageHTML = generatePage(dummyData);

// real data call
promptUser()
  .then(promptProject)
  .then((portfolioData) => {
    const pageHTML = generatePage(portfolioData);

    fs.writeFile("./index.html", pageHTML, (err) => {
      if (err) throw new Error(err);

      console.log(
        "Page created! Check ouct index.html in this directory to see it!"
      );
    });
  });
