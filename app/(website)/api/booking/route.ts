import { type NextRequest, NextResponse } from 'next/server';
import nodemailer from 'nodemailer';
import Mail from 'nodemailer/lib/mailer';

export async function POST(request: NextRequest) {
  const formData = await request.json();

  const transport = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.QUOTATION_EMAIL,
      pass: process.env.QUOTATION_PASSWORD,
    },
  });
  const SendingDate = new Date().toLocaleString('en-AE', {
    timeZone: 'Asia/Dubai', weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric", hour: 'numeric', minute: 'numeric'
  })
  const mailOptions: Mail.Options = {
    from: process.env.QUOTATION_EMAIL,
    to: process.env.QUOTATION_EMAIL,
    // cc: email, (uncomment this line if you want to send a copy to the sender)
    subject: `${formData.selectedPackage.name} –  ${formData.date} (${formData.timeSlot})`,
    html: `
    New quote request received.<br /><br />

    Request submitted on: ${SendingDate} <br /> 
    Requested shooting date: ${formData.date} (${formData.timeSlot}<br /><br />

    Client Details:  <br />
    * Name: ${formData.firstName} ${formData.lastName}  <br />
    * Email: ${formData.email}  <br />
    * Phone: ${formData.phoneNumber}  <br />
    * Address: ${formData.unitNumber}, Floor ${formData.floor}, ${formData.buildingName}, ${formData.street}<br />
    * Property Size: ${formData.propertySize} SqFt<br /><br />

    Selected Package: ${formData.selectedPackage.name}  <br />
    Options Selected: ${formData.addOns.map((el: any)=>`<br /><span>- ${el.name}</span>`)}  <br />
    ${formData.additionalInfo ? 'Additional Information: ' + formData.additionalInfo + '<br />' : ''}
    ${formData.additionalRequests ? 'Additional Requests: ' + formData.additionalRequests + '<br />' : ''}<br />
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