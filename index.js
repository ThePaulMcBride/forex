#!/usr/bin/env node

const axios = require("axios");
const inquirer = require("inquirer");

async function run() {
  console.log("Launching Forex...");

  const { from, to, amount } = await askQuestions();

  const value = await calculateValue({ from, to, amount });

  console.log(`${amount} ${from} is worth ${value} ${to}`);
}

function askQuestions() {
  const questions = [
    {
      name: "from",
      type: "list",
      message: "What currency are you converting from?",
      choices: ["USD", "GBP", "EUR", "JPY"]
    },
    {
      name: "to",
      type: "list",
      message: "What currency are you converting to?",
      choices: ["USD", "GBP", "EUR", "JPY"]
    },
    {
      name: "amount",
      type: "text",
      message: "How much would you like to convert?",
      validate: value => {
        const number = parseFloat(value);

        return new Promise((resolve, reject) => {
          if (isNaN(number)) {
            reject("The value needs to be a number");
          }
          resolve(true);
        });
      }
    }
  ];

  return inquirer.prompt(questions);
}

async function calculateValue({ from, to, amount }) {
  const { data } = await axios.get(
    `https://api.exchangeratesapi.io/latest?base=${from}`
  );

  const { rates } = data;

  const result = (rates[to] * amount).toFixed(2);

  return result;
}

run();
