# mmCEsim Web App

mmCEsim Web app allows auto code generation with mouse clicks on the browser
without downloading the whole mmCEsim app.
Web app is available at [app.mmcesim.org](https://app.mmcesim.org).
You may easily host the web app as it is built on docker.

## Pros and Cons

### Pros
- No need to download the app which can be large is you want a GUI
  or TeX Engine or a C++ compiler.
- Very portable, accessible everywhere with Internet connection.

### Cons
- The safety of your design and the generated code is not guaranteed
  due to my limited web knowledge.
  So for original contents that are highly confidential,
  you may consider use the desktop app or host the docker yourself.
- Due to resource limits, the functions are limited to code generation.
  So far you cannot use the web app to simulate automatically.

## License
Like [mmCEsim](https://github.com/mmcesim/mmcesim), the web app is also
licensed under the [MIT License](LICENSE).
