const exp = require('express');
const bodyParser = require('body-parser');
//const exphbs = require('express-handlebars');
const { engine } = require('express-handlebars');
const path = require('path');
const nodemail = require('nodemailer');

const app = exp();

//app.engine('handlebars', exphbs());
app.engine('handlebars', engine());
app.set('view engine', 'handlebars');

app.use('/public', exp.static(path.join(__dirname, 'public')));

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.get('/', (req, res) => {
  res.render('contact', { layout:false });
});

app.post('/send', (req, res) => {
  const output = `
    <p>You have a new contact request</p>
    <h3>Contact Details</h3>
    <ul>  
      <li>Name: ${req.body.name}</li>
      <li>Company: ${req.body.company}</li>
      <li>Email: ${req.body.email}</li>
      <li>Phone: ${req.body.phone}</li>
    </ul>
    <h3>Message</h3>
    <p>${req.body.message}</p>
  `;

  let transporter = nodemail.createTransport({
    host: 'smtp.gmail.com',
    port: 587,
    secure: false,
    auth: {
        user: 'eanuraghshree@gmail.com',
        pass: 'bnogpxsyfrigzysi'
    },
    tls:{
      rejectUnauthorized:false
    }
  });

  let mailOptions = {
      from: '"Anuragh E" <eanuraghshree@gmail.com>', 
      to: 'eanuraghshree@gmail.com', 
      subject: 'Contact Request',
      text: 'Hello world?',
      html: output
  };

  transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
          return console.log(error);
      }
      console.log('Message sent: %s', info.messageId);   
      console.log('Preview URL: %s', nodemail.getTestMessageUrl(info));

      res.render('contact', {layout:false, msg:'Email has been sent'});
  });
  });

app.listen(3000, () => console.log('Server started...'));