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
  host: 'smtp.yandex.ru',
  port: 465,
  secure: true,
  auth: {
    user: "mailing@tonar.info",
    pass: "icbfkjwfmfeiwitb",
  },
  tls: { rejectUnauthorized: false }
});


const emailTemplate = (name: string, email: string) => `
  <head>
    <meta charset="utf-8" />
    <meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Приглашение на дилерскую конференцию</title>
    <style type="text/css">
      body {
        font-family: 'Arial', sans-serif;
        background-color: #f3f4f6;
        margin: 0;
        padding: 0;
        display: flex;
        justify-content: center;
        align-items: center;
        min-height: 100vh;
      }
      .container {
        width: 100%;
        max-width: 650px;
        margin: 20px auto;
        background-color: #ffffff;
        border-radius: 10px;
        box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
        overflow: hidden;
      }
      .header {
        text-align: center;
        color: white;
      }
      .header h1 {
        margin: 0;
        font-size: 28px;
        font-weight: 700;
      }
      .logo {
        max-width: 100%;
      }
      .content {
        padding: 30px;
        color: #444444;
        line-height: 1.2;
        font-size: 16px;
      }
      .highlight-box {
        background-color: #f8f9fa;
        border-left: 4px solid #235390;
        padding: 20px;
        margin: 25px 0;
        border-radius: 0 4px 4px 0;
      }
      .schedule {
        margin: 25px 0;
      }
      .schedule-item {
        display: flex;
        margin-bottom: 12px;
        align-items: flex-start;
        gap: 20px;
      }
      .time {
        font-weight: bold;
        color: #235390;
        min-width: 100px;
        text-align: center;
      }
      .event {
        flex-grow: 1;
      }
      .button {
        display: inline-block;
        padding: 14px 32px;
        font-size: 16px;
        font-weight: bold;
        color: #ffffff;
        background-color: #235390;
        border-radius: 5px;
        text-decoration: none;
        margin: 20px 0;
        text-align: center;
        transition: background-color 0.3s;
      }
      .button:hover {
        background-color: #1a3a6a;
      }
      .footer {
        text-align: center;
        padding: 20px;
        font-size: 13px;
        color: #999999;
        background-color: #f8f9fa;
        border-top: 1px solid #eaeaea;
      }
      .contact-info {
        margin-top: 25px;
        padding-top: 15px;
        border-top: 1px dashed #eaeaea;
      }
      @media only screen and (max-width: 600px) {
        .container { width: 95%; }
        .header { padding: 20px 15px; }
        .content { padding: 20px; }
        .schedule-item { flex-direction: column; }
        .time { margin-bottom: 5px; }
      }
    </style>
  </head>
  <body>
    <div class="container">
      <div class="header">
        <img src=${process.env.NEXT_PUBLIC_API_URL}/email.png alt="Тонар" class="logo">
       
      </div>
      <div class="content">
       <h1>Приглашение на дилерскую конференцию</h1>
        <p>Уважаемые партнёры,</p>
        
        <p>Мы рады пригласить Вас на первую дилерскую конференцию, которая состоится <strong>23 апреля 2025 года</strong> на территории МЗ «Тонар».</p>
        
        <h3>Регламент мероприятия:</h3>
        <div class="schedule">
          <div class="schedule-item">
            <div class="time">09:30 – 10:00</div>
            <div class="event">Встреча гостей, регистрация (холл проходной)</div>
          </div>
          <div class="schedule-item">
            <div class="time">10:00 – 11:00</div>
            <div class="event">Фуршет (конференц-зал, 2 этаж)</div>
          </div>
          <div class="schedule-item">
            <div class="time">11:00 – 12:00</div>
            <div class="event">Экскурсия по заводу</div>
          </div>
          <div class="schedule-item">
            <div class="time">12:00 – 13:30</div>
            <div class="event">Семинар: обсуждение актуальных проблем и вызовов отрасли</div>
          </div>
          <div class="schedule-item">
            <div class="time">14:30</div>
            <div class="event">Деловой ужин (ресторан «Эдем»)</div>
          </div>
        </div>
        
        <div class="contact-info">
          <p>Если у Вас возникнут вопросы, Вы можете обратиться к нам:</p>
          <p>📧 <a href="mailto:bolotova.e@tonar.info">bolotova.e@tonar.info</a></p>
          <p>📞 <a href="tel:+79670533947">+7 (967) 053-39-47</a> (Болотова Екатерина)</p>
        </div>
      </div>
      <div class="footer">
        <p>&copy; 2025 МЗ «Тонар». Все права защищены.</p>
        <p><small>Это письмо отправлено автоматически, пожалуйста, не отвечайте на него.</small></p>
      </div>
    </div>
  </body>
`;

export async function GET() {
  try {
    initDataFile();
    return NextResponse.json(readEvents());
  } catch (error) {
    console.error('Ошибка чтения events:', error);
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
        from: "mailing@tonar.info",
        to: email,
        subject: `Рассылка Тонар`,
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
    console.error('Ошибка выполнения запроса:', error);
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