const fs = require("fs");
const path = require("path");
const puppeteer = require("puppeteer");
const handlebars = require("handlebars");
const dataSource = require("./data");

const CalculateTotalPrice = (data) => {
  let totalPrice = 0,
    mul = 0;

  data.items.forEach((item) => {
    mul = (item.qty * item.item_upc.p_price).toFixed(2);
    totalPrice += parseFloat(mul);
  });

  dataSource.totalPrice = totalPrice;
};

const GeneratePDF = async (data, fileName) => {
  try {
    //Reading the HTML template
    const templateHtml = fs.readFileSync(
      path.join(process.cwd(), "template.html"),
      "utf8"
    );

    //Implementing math functions for HANDLEBARS to use them in HTML
    handlebars.registerHelper(
      "math",
      function (lvalue, operator, rvalue, options) {
        lvalue = parseFloat(lvalue);
        rvalue = parseFloat(rvalue);

        return {
          "+": lvalue + rvalue,
          "-": lvalue - rvalue,
          "*": (lvalue * rvalue).toFixed(2),
          "/": lvalue / rvalue,
          "%": lvalue % rvalue,
        }[operator];
      }
    );

    //Compiling the HTML template with HANDLEBARS
    const template = handlebars.compile(templateHtml);

    //Populating our JSON data using HANDLEBARS template
    const finalHtml = encodeURIComponent(template(data));

    //Configuration for our PDF file
    const options = {
      format: "A4",
      headerTemplate: "<p></p>",
      footerTemplate: "<p></p>",
      displayHeaderFooter: false,
      margin: {
        top: "40px",
        bottom: "100px",
      },
      printBackground: true,
      path: fileName,
    };

    //Launching the Puppeteer
    const browser = await puppeteer.launch({
      args: ["--no-sandbox"],
      headless: true,
    });

    //Making a new blank page
    const page = await browser.newPage();
    //Setting the viewport
    await page.setViewport({ width: 761, height: 800 });

    //Sending our HTML template to the newly created page
    await page.goto(`data:text/html;charset=UTF-8,${finalHtml}`, {
      waitUntil: "networkidle0", //Wait till external dependencies could be loaded
    });

    //PDF generation
    await page.pdf(options);
    //Close browser
    await browser.close();

    console.log("PDF is Succesfully created!");
  } catch (err) {
    console.log("Error occurred:", err);
  }
};

CalculateTotalPrice(dataSource);
GeneratePDF(dataSource, "invoice.pdf");
