// analyze.js
const axios = require('axios');
const cheerio = require('cheerio');
const nodemailer = require('nodemailer');

// Define the static URL
const STATIC_URL = 'https://appointment.bmeia.gv.at/?Office=Kairo';
let sent=false
// Email configuration
const transporter = nodemailer.createTransport({
  service: 'hotmail', // You can use other services like 'smtp', 'yahoo', etc.
  auth: {
    user: 'adel.essam.elfar@gmail.com', // Replace with your email
    pass: 'jXBSuaW8NHb4&4Z9'   // Replace with your email password or app-specific password
  }
});

async function sendEmail(subject, text) {
  const mailOptions = {
    from: 'adel.essam.elfar@gmail.com', // Replace with your email
    to: 'adelessam256@gmail.com', // Replace with recipient's email
    subject: subject,
    text: text
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log('Email sent successfully');
    process.exit(1); // 1 indicates an error exit code

  } catch (error) {
    console.error('Error sending email:', error);
  }
}

async function fetchAndAnalyze() {
  
  try {
    // Fetch the HTML content from the static URL
    const { data } = await axios.get(STATIC_URL);

    // Load the HTML into cheerio
    const $ = cheerio.load(data);

    // Navigate through the HTML structure as per your query
    const targetElement = $('body')
      .children()
      .eq(0)
      .children()
      .eq(1)
      .children()
      .eq(0)
      .children()
      .eq(2)
      .children()
      .eq(0)
      .children()
      .eq(1)
      .children()
      .eq(1)
      .children()
      .eq(1);

    // Count the number of <option> elements within the targeted element
    const optionsCount = targetElement.find('option').length;

    // Check if the count is different from 8
    if (optionsCount !== 7) {
      await sendEmail(
        'Notification: <option> Count Changed',
        `The number of <option> elements is ${optionsCount}. This is different from the expected count of 8.`
      );
      sent=true;
    } else {
      console.log('The number of <option> elements is as expected (8).');
    }
  } catch (error) {
    console.error('Error fetching or analyzing the webpage:', error);
  }
}

// Retry every 10 minutes (600000 milliseconds)
const INTERVAL_MS = 600000;

function startMonitoring() {
  if(sent==false){
  fetchAndAnalyze(); // Initial check
  setInterval(fetchAndAnalyze, INTERVAL_MS); // Schedule repeated checks
  }
}

// Start monitoring
startMonitoring();
