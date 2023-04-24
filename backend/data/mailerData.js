const nodemailer = require('nodemailer');
require('dotenv').config();

module.exports = {
  async sendEmail(userToEmail, month, expense, emailImage) {
    console.log('sending email');

    if (!userToEmail) {
      throw new Error('provide email');
    }
  
    if (!month) {
      throw new Error('provide month');
    }
  
    if (!expense) {
      throw new Error('provide expense');
    }
  
    if (!emailImage) {
      throw new Error('provide chartUrl');
    }

    let transporter = nodemailer.createTransport({
      host: "smtp.ethereal.email",
      port: 587,
      auth: {
        user: process.env.NODEMAILER_ETHEREAL_ACCOUNT_USERNAME,
        pass: process.env.NODEMAILER_ETHEREAL_ACCOUNT_PASSWORD
      }
    });


    let htmlContent = `
      <html>
        <style>
        table, th, td {
            border: 1px solid black;
        }
        </style>
        <header style="background-color:#23370a;padding:10px;display:flex;justify-content:space-between">
            <h1 style="color:white;font-family:monospace;font-weight:700;letter-spacing:.1rem;">Frugal Friends</h1>
            <h2 style="color:white;">${month}'s Expense Categories</h2>
        </header>
        <body>
            <div>
                <span style="display:inline-block">
                  <img style="width:100%" src="${emailImage}"/>
                </span>
            </div>
            <div>
                <table style="width: 100%;text-align:center;">
                    <tr>
                        <th>Category</th>
                        <th>Description</th>
                        <th>Amount</th>
                    </tr>
                    ${expense.map((val) => {
                      return `
                        <tr>
                          <td>${val.category}</td>
                          <td>${val.description}</td>
                          <td>${val.amount}</td>
                        </tr>
                      `
                    })}
                </table>
            </div>
        </body>
      </html>
    `;

    let info = await transporter.sendMail({
      from: '"Frugal Friends" <frugalfriends@gmail.com>',
      to: userToEmail,
      subject: `Frugal Friends - ${month} Budget Overview`,
      text: "TODO",
      html: htmlContent
    })

    console.log("message sent:", info.messageId);
    // console.log("message address:", nodemailer.getTestMessageUrl(info))
  }
  
}