#!/usr/bin/env node

const normalize = require('normalize-url');
const urlRegex = require('url-regex');
const meow  = require('meow');
const inquirer = require('inquirer');
const chalk = require('chalk');
const ncp = require("copy-paste");
const prompt = inquirer.prompt;
const separator = new inquirer.Separator();

const cli = new meow(`
  \n
  Usage: ${chalk.yellow('lgmtfy')} ${chalk.gray('[query] [options]')}


  Commands:
    ${chalk.yellow('help')}                      ${chalk.gray('Display help')}


  Options:
    ${chalk.yellow("-nc, --noclipboard")}        ${chalk.gray("Don't copy address to clipboard (Default: true)")}
    ${chalk.yellow('-q, --quick')}               ${chalk.gray('Quick generation (Default: false)')}
    ${chalk.yellow("-v, --version")}             ${chalk.gray("Output the version number")}
    ${chalk.yellow("-h, --help")}                ${chalk.gray("Display the HELP")}
  \n
`, {
  alias: {
    nc: 'noclipboard',
    v: 'version',
    h: 'help',
    q: 'quick'
  }
});



function lgmtfy(help = "", action, flags) {
  if (action == 'help') {
    console.log(help);
  } else {
    const website = "http://lmgtfy.com";
    const query = action.join(' ');

    const questions = [
      {
        name: "query",
        message: "Type your question",
        type: "input",
        default: (query != '') ? query : "Welcome in LMGTFY Client"
      }, {
        name: "internet",
        message: "Do you want internet explanation",
        type: "confirm",
        "default": false
      }, {
        name: "engine",
        message: "Select a search engine",
        type: "list",
        choices: [
          "Google",
          "Bing",
          "Yahoo",
          "Aol",
          "Ask",
          "DuckDuckGo"
        ],
        default: 0
      }
    ];

    if (!flags.quick) {
      prompt(questions).then(answ => {
        var query = answ.query;
        var internet = answ.internet;
        var engine = '';

        switch (answ.engine) {
          case 'google':
            engine = 'g'
            break;
          case 'bing':
            engine = 'b'
            break;
          case 'yahoo':
            engine = 'y'
            break;
          case 'aol':
            engine = 'a'
            break;
          case 'ask':
            engine = 'k'
            break;
          case 'duckduckgo':
            engine = 'd'
            break;
          default:
            engine = 'g'
        }

        var PP = {
          internet: internet,
          engine: engine,
          type: false,
          query: query
        };

        if (answ.engine == 'Google') {
          prompt([{
            name: 'type',
            message: 'Choose a search type',
            default: 0,
            choices: [
              "Web",
              "Images",
              "Videos",
              "Maps",
              "News",
              "Shopping",
              "Books",
              "Finance",
              "Scholar",
              separator
            ],
            type: 'list'
          }]).then(a => {
              switch (a.type) {
                case "Web":
                  PP.type = 'web';
                  break;
                case "Images":
                  PP.type = 'i';
                  break;
                case "Videos":
                  PP.type = 'v';
                  break;
                case "Maps":
                  PP.type = 'm';
                  break;
                case "News":
                  PP.type = 'n';
                  break;
                case "Shopping":
                  PP.type = 's';
                  break;
                case "Books":
                  PP.type = 'b';
                  break;
                case "Finance":
                  PP.type = 'f';
                  break;
                case "Scholar":
                  PP.type = 'sc';
                  break;
                default:
                  PP.type = 'web';
              }

              console.log();
              console.log(`> ${writeURL(website, PP)}`);
              console.log();
          });
        } else {
          console.log();
          console.log(`> ${writeURL(website, PP)}`);
          console.log();
        }
      })
    } else {

      if (action == '') {
        console.log('');
        console.log(chalk.bold.red(' > No query provided!'));
        console.log('');
        console.log('');
        console.log(help);
        process.exit();
      }

      var PP = {
        engine: 'g',
        type: 'w',
        internet: false,
        query: query
      };

      console.log();
      console.log(`> ${writeURL(website, PP)}`);
      console.log();
    }
  }
}

lgmtfy(cli.help, cli.input, cli.flags);

function writeURL(baseURL, params) {
  let url = normalize(baseURL)

  const explanation = (params.internet == true) ? 1 : 0;
  const query = encodeURIComponent(params.query);

  url = `${url}?iie=${explanation}&q=${query}`;

  if (params.engine != 'g' && params.engine != '') {
    url = `${url}&s=${params.engine}`;
  }

  if (params.type != 'web' && params.type && params.type != '') {
    url = `${url}&t=${params.type}`;
  } else {
    url = `${url}`;
  }

  ncp.copy(url, () => {
    console.log(chalk.magenta('URL Copied to clipboard'));
    console.log('');
  });

  return url;
}
