import { type NextRequest, NextResponse } from 'next/server';
import nodemailer from 'nodemailer';
import Mail from 'nodemailer/lib/mailer';

export async function POST(request: NextRequest) {
  const formData = await request.json();;
  
  const { email, name, message, phoneNumber } = formData;

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
    html: `
    Name: ${name} <br />
    Email: ${email} <br />
    Phone Number: ${phoneNumber} <br />
    Message: ${message} <br />
    Date: ${SendingDate}
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