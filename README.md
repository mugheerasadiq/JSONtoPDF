# JSON TO PDF Converter with Custom HTML template

A NodeJS application that will populate JSON data to custom HTML template and then it will generate PDF.
The application uses Handlebars which is a templating language, and puppeteer which is a headless chromium. These two modules combined give the power to generate PDF. Puppeteer
is the main module that will generated PDF. Handlebars is used to make HTML template and helps to populate it with JSON data.

To generate PDF you just have to replace the HTML file with your custom template and replace the JSON data with your desired data.
