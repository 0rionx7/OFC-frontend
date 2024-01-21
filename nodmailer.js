import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: 'karfidouioanna@gmail.com',
    pass: 'loas tdue ennj ennr',
  },
});

export function sendEmail(code) {
  const mailOptions = {
    from: 'aleLaMachine@gmail.com',
    to: 'karatzas.geo@gmail.com',
    subject: 'Sending Email using Node.js',
    text: `Recovery Code : ${code}`,
  };

  transporter.sendMail(mailOptions, function (error, info) {
    if (error) {
      console.log(error);
    } else {
      console.log(info);
      console.log('Email sent: ' + info.response);
    }
  });
}
