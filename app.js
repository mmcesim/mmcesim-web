/**
 * app.js for mmCEsim Web App
 * Author: Wuqiong Zhao
 */

const express = require("express");
const app = module.exports = express();
const {exec, execSync} = require("child_process");

var bodyParser = require("body-parser");
const { dirname } = require("path");
const { nextTick } = require("process");
app.use(bodyParser.urlencoded({ extended: false }));

const header = 
  '<!DOCTYPE html>' +
  '<html data-color-mode="auto" data-light-theme="light" data-dark-theme="dark">' +
  '<head>' +
  '<meta charset="utf-8"/>' +
  '<title>mmCEsim Web App</title>' +
  '<link rel="icon" href="https://mmcesim.org/favicon.ico">' +
  '<link rel="stylesheet" href="https://unpkg.com/@primer/css@^21.0.0/dist/primer.css"/>' +
  '<meta name="viewport" content="width=device-width, initial-scale=1.0">' +
  '<script src="jquery-3.6.0.min.js"></script>' +
  '<script src="index.js"></script>' +
  '</head>' +
  '<html>' +
  '<body>' +
  '<div class="Header">' +
  '<div class="Header-item">' +
  '<a href="/" class="Header-link f4 d-flex flex-items-center">' +
  '<img height="32" alt="Auto HDW" src="https://img.mmcesim.org/logo/mmCEsim_logo_128.png">' +
  '<pre> </pre>' +
  '<span>mmCEsim Web App</span>' +
  '</a>' +
  '</div>' +
  '<div class="Header-item hide-sm hide-md">' +
  'Task-oriented' +
  '<span class="hide-lg">&nbsp;Millimeter Wave Channel Estimation&nbsp;</span>' +
  '<span class="d-lg-none">&nbsp;mmWave CE&nbsp;</span>' +
  'Simulation' +
  '</div>' +
  '<div class="Header-item Header-item--full">' +
  '<a class="Header-link"></a>' +
  '</div>' +
  '<div class="Header-item hide-sm">' +
  '<a href="https://mmcesim.org/doc/web" class="Header-link">About</a>' +
  '</div>' +
  '<div class="Header-item hide-sm">' +
  '<a href="https://mmcesim.org" class="Header-link">Website</a>' +
  '</div>' +
  '<div class="Header-item hide-sm">' +
  '<a href="https://github.com/mmcesim" class="Header-link">GitHub</a>' +
  '</div>' +
  '<div class="Header-item d-sm-none">' +
  '<details class="dropdown details-reset details-overlay d-inline-block">' +
  '<summary class="Header-link btn" aria-haspopup="true" type="button" aria-haspopup="true" style="color:rgb(173, 186, 199); background-color :rgb(55, 62, 71); box-shadow: transparent 0px 0px, transparent 0px 0px; border: 1px solid rgba(205, 217, 229, 0.1); border-radius: 6px; padding: 5px 16px; line-height: 20px;">' +
  '<svg aria-hidden="true" role="img" class="octicon octicon-three-bars" viewBox="0 0 16 16" width="16" height="16" fill="currentColor" style="display:inline-block;user-select:none;vertical-align:text-bottom;overflow:visible;color:rgb(173, 186, 199);"><path fill-rule="evenodd" d="M1 2.75A.75.75 0 011.75 2h12.5a.75.75 0 110 1.5H1.75A.75.75 0 011 2.75zm0 5A.75.75 0 011.75 7h12.5a.75.75 0 110 1.5H1.75A.75.75 0 011 7.75zM1.75 12a.75.75 0 100 1.5h12.5a.75.75 0 100-1.5H1.75z"></path></svg>' +
  '</summary>' +
  '<ul class="dropdown-menu dropdown-menu-s">' +
  '<div class="dropdown-header">' +
  'External Links' +
  '</div>' +
  '<li><a class="dropdown-item" href="https://mmcesim.org/doc/web" target="_blank">About</a></li>' +
  '<li><a class="dropdown-item" href="https://mmcesim.org" target="_blank">Website</a></li>' +
  '<li><a class="dropdown-item" href="https://github.com/mmcesim" target="_blank">GitHub</a></li>' +
  '</ul>' +
  '</details>' +
  '</div>' +
  '<div class="Header-item mr-0">' +
  'v0.0.2' +
  '</div>' +
  '</div>' +
  '<div class="container-lg mx-auto">' +
  '<div class="mx-3">';

const footer =
  '</div></div>' +
  '<footer>' +
  '<hr class="container-lg mb-1 mt-5 mx-auto">' +
  '<div class="color-fg-subtle text-center mb-3">' +
  '<div class="hide-sm hide-md">' +
  '<small id="footer_line">' +
  '<span class="hide-lg">Developed, designed and hosted</span>' +
  '<span class="d-lg-none">Developed</span>' +
  'by <a class="Link--secondary no-underline" href="https://wqzhao.org">Wuqiong Zhao</a>.' +
  '© 2022 Wuqiong Zhao (Teddy van Jerry), Southeast University' +
  '</small>' +
  '</div>' +
  '<div class="d-md-none">' +
  '<small id="footer_line">' +
  '© 2022 <a class="Link--secondary no-underline" href="https://wqzhao.org">Wuqiong Zhao</a> (Teddy van Jerry)<span class="hide-sm">, Southeast University</span>' +
  '</small>' +
  '</div>' +
  '</div>' +
  '</footer>' +
  '</body>' +
  '</html>';

app.get('/', function (req, res) {
  res.sendFile('index.html', { root: __dirname });
});

app.get('/:file.js', function (req, res) {
  res.sendFile(`${req.params.file}.js`, { root: __dirname });
});

app.post('/', function (req, res, next) {
  if (req.body.generate == "Cancel") {
    res.sendFile('index.html', { root: __dirname });
    console.log("User cancel the input.");
  } else {
    const command = "../mmcesim/bin/mmcesim -h";
    var result = '';
    var child = exec(command);

    var has_err = false;

    child.stdout.on('data', function(data) {
      result += data;
    });

    child.stderr.on('data', function(data) {
      has_err = true;
      result += data;
    });

    child.on('close', function() {
      result = result.replaceAll('<', '&lt;');
      result = result.replaceAll('>', '&gt;');
      if (has_err) {
        console.log('unsuccessful run');
        res.send(
          header +
          '<h2 class="mt-6 mb-3">Code Generation Failed!</h2>' +
          '<details><summary>Terminal Output</summary><p dir="auto"></p><ul dir="auto">' +
          '<div class="notranslate position-relative overflow-auto"><pre>' +
          result +
          '</pre></div></ul></details>' +
          `<button class="btn btn-primary my-3" type="button" onclick="javascript:alert('Oops, web app is not ready now :-)')" disabled>` +
          '<svg class="octicon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" width="16" height="16"><path fill-rule="evenodd" d="M7.47 10.78a.75.75 0 001.06 0l3.75-3.75a.75.75 0 00-1.06-1.06L8.75 8.44V1.75a.75.75 0 00-1.5 0v6.69L4.78 5.97a.75.75 0 00-1.06 1.06l3.75 3.75zM3.75 13a.75.75 0 000 1.5h8.5a.75.75 0 000-1.5h-8.5z"></path></svg>' +
          '<span>Download</span>' +
          footer
        );
        next();
      }
      else {
        console.log('successful run');
        res.send(
          header +
          '<h2 class="mt-6 mb-3">Code Generation Succeeded!</h2>' +
          '<details><summary>Terminal Output</summary><p dir="auto"></p><ul dir="auto">' +
          '<div class="notranslate position-relative overflow-auto"><pre>' +
          result +
          '</pre></div></ul></details>' +
          `<button class="btn btn-primary my-3" type="button" onclick="javascript:alert('Oops, web app is not ready now :-)')">` +
          '<svg class="octicon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" width="16" height="16"><path fill-rule="evenodd" d="M7.47 10.78a.75.75 0 001.06 0l3.75-3.75a.75.75 0 00-1.06-1.06L8.75 8.44V1.75a.75.75 0 00-1.5 0v6.69L4.78 5.97a.75.75 0 00-1.06 1.06l3.75 3.75zM3.75 13a.75.75 0 000 1.5h8.5a.75.75 0 000-1.5h-8.5z"></path></svg>' +
          '<span>Download</span>' +
          footer
        );
        next();
      }
    });
  }
});

var server = app.listen(2332, function () {
  console.log('Node server is running..');
});
