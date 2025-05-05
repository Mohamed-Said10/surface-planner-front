import { type NextRequest, NextResponse } from 'next/server';
import nodemailer from 'nodemailer';
import Mail from 'nodemailer/lib/mailer';

export async function POST(request: NextRequest) {
  const formData = await request.json();;

  const {
    email,
    firstName,
    lastName,
    source,
    additional,
    budget,
    message,
    phoneNumber
  } = formData;

  const transport = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.SUPPORT_EMAIL,
      pass: process.env.SUPPORT_PASSWORD,
    },
  });

  const SendingDate = new Date().toLocaleString('en-AE', {
    timeZone: 'Asia/Dubai', weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric", hour: 'numeric', minute: 'numeric'
  })
  const mailOptions: Mail.Options = {
    from: process.env.SUPPORT_EMAIL,
    to: process.env.SUPPORT_EMAIL,
    // cc: email, (uncomment this line if you want to send a copy to the sender)
    subject: `Contact Request from ${name} (${email}) - SurfacePlanner`,
    attachments: [
      {
      filename: 'text1.txt',
      content: 'hello world!'
  }],
    html: `
    First Name: ${firstName} <br />
    Last Name: ${lastName} <br />
    Email: ${email} <br />
    Phone Number: ${phoneNumber} <br />
    Message: ${message} <br />
    Source: ${source} <br />
    Additional Field: ${additional} <br />
    Budget: ${budget} <br /><br />
    Date: ${SendingDate} <br />
    `,
  };

  const sendMailPromise = () =>
    new Promise<string>((resolve, reject) => {
      transport.sendMail(mailOptions, function (err) {
        if (!err) {
          resolve('Email sent');
        } else {
          reject(err.message);
        }
      });
    });

  try {
    await sendMailPromise();
    return NextResponse.json({ message: 'Email sent' });
  } catch (err) {
    console.log(err);
    return NextResponse.json({ error: err }, { status: 500 });
  }
}