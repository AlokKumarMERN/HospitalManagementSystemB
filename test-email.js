import { createTransport } from 'nodemailer';
import dotenv from 'dotenv';

dotenv.config();

const testEmail = async () => {
  console.log('Testing email configuration...');
  console.log('EMAIL_HOST:', process.env.EMAIL_HOST);
  console.log('EMAIL_PORT:', process.env.EMAIL_PORT);
  console.log('EMAIL_USER:', process.env.EMAIL_USER);
  console.log('EMAIL_PASS:', process.env.EMAIL_PASS ? '***' + process.env.EMAIL_PASS.slice(-4) : 'NOT SET');
  
  const transporter = createTransport({
    host: process.env.EMAIL_HOST,
    port: parseInt(process.env.EMAIL_PORT),
    secure: false,
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
    tls: {
      rejectUnauthorized: false
    },
    debug: true,
    logger: true
  });

  try {
    console.log('\n✓ Testing SMTP connection...');
    await transporter.verify();
    console.log('✓ SMTP connection verified successfully!\n');

    console.log('✓ Sending test email...');
    const info = await transporter.sendMail({
      from: process.env.EMAIL_FROM || process.env.EMAIL_USER,
      to: process.env.EMAIL_USER,
      subject: 'SaveLife - Test Email',
      text: 'This is a test email from SaveLife Hospital Management System',
      html: '<h1>Test Email</h1><p>If you receive this, email configuration is working!</p>'
    });

    console.log('✓ Email sent successfully!');
    console.log('Message ID:', info.messageId);
    console.log('\n✅ All email tests passed!');
  } catch (error) {
    console.error('\n❌ Email test failed!');
    console.error('Error:', error.message);
    console.error('Full error:', error);
  }
};

testEmail();
