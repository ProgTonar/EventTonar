import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';
import nodemailer from 'nodemailer';

const dataFilePath = path.join(process.cwd(), 'data', 'events.json');


const initDataFile = () => {
  const dir = path.dirname(dataFilePath);
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
  if (!fs.existsSync(dataFilePath)) fs.writeFileSync(dataFilePath, '[]');
};


const readEvents = () => {
  if (!fs.existsSync(dataFilePath)) return [];
  return JSON.parse(fs.readFileSync(dataFilePath, 'utf8'));
};


const saveEvents = (events: any[]) => {
  fs.writeFileSync(dataFilePath, JSON.stringify(events, null, 2));
};


const createTransporter = () => nodemailer.createTransport({
  host: '0.0.0.0',
  port: 1025,
  secure: false,
  tls: { rejectUnauthorized: false }
});


const emailTemplate = (name: string, email: string) => `
  <head>
    <meta charset="utf-8" />
    <meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Informational Email</title>
    <style type="text/css">
      body {
        font-family: Arial, sans-serif;
        background-color: #f3f4f6;
        margin: 0;
        padding: 0;
        display: flex;
        justify-content: center;
        align-items: center;
        height: 100vh;
      }
      .container {
        width: 100%;
        max-width: 600px;
        margin: 0 auto;
        background-color: #ffffff;
        border-radius: 8px;
        box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
        overflow: hidden;
        border: 5px solid #235390;
      }
      .header {
        text-align: center;
      }
      .header img {
        max-width: 100%;
        height: auto;
      }
      .content {
        padding: 20px;
        color: #444444;
        line-height: 1.6;
      }
      .button {
        display: inline-block;
        padding: 15px 30px;
        font-size: 16px;
        font-weight: bold;
        color: #ffffff;
        background-color: #235390;
        border-radius: 5px;
        text-decoration: none;
        margin-top: 20px;
      }
      .footer {
        text-align: center;
        padding: 10px;
        font-size: 12px;
        color: #999999;
      }
      @media only screen and (max-width: 600px) {
        .container { width: 100%; }
        .button { width: 100%; box-sizing: border-box; }
      }
    </style>
  </head>
  <body>
    <div class="container">
      <div class="header">
        <a href="https://guarantee.tonar.info" target="_blank">
          <img src="https://backgua.tonar.info/storage/img/mail/change-pass-header.png" alt="Header Image">
        </a>
      </div>
      <div class="content">
        <p>Здравствуйте!</p>
        <p>Вы получили уведомление о заявке.</p>
        <p>Чтобы просмотреть детали вашей заявки, пожалуйста, нажмите на кнопку ниже:</p>
        <a class="button" href="#">Посмотреть заявку</a>
      </div>
      <div class="footer">
        &copy; ${new Date().getFullYear()} ТОНАР. Все права защищены.
      </div>
    </div>
  </body>
`;

export async function GET() {
  try {
    initDataFile();
    return NextResponse.json(readEvents());
  } catch (error) {
    console.error('Error reading events:', error);
    return NextResponse.json(
      { error: 'Ошибка при чтении данных' }, 
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    initDataFile();
    const { name, email, status, ...restData } = await request.json();
    

    const newEvent = {
      name,
      email,
      ...restData,
      id: Date.now().toString(),
      registeredAt: new Date().toISOString(),
      status
    };
    

    const events = readEvents();
    events.push(newEvent);
    saveEvents(events);
    

    let emailSent = false;
    if (status === 'Подтверждаю участие') {
      const transporter = createTransporter();
      await transporter.sendMail({
        from: `"Форма обратной связи" <${email}>`,
        to: email,
        subject: `Подтверждение заявки от ${name}`,
        html: emailTemplate(name, email)
      });
      emailSent = true;
    }
    
    return NextResponse.json({
      success: true,
      event: newEvent,
      emailSent,
      message: emailSent 
        ? 'Данные сохранены и письмо отправлено' 
        : 'Данные сохранены'
    }, { status: 201 });
    
  } catch (error) {
    console.error('Error processing request:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: 'Ошибка при обработке запроса',
        details: error
      }, 
      { status: 500 }
    );
  }
}