const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const https = require('https');
const { response } = require('express');
app.use(bodyParser.urlencoded({ extended: true })) //to parse response from form in html
app.use(express.static('public')); //specify the static folder where all static stuffs like css, images, fonts, etc are stores

app.get('/', (req, res)=>{
    res.sendFile(__dirname+'/signup.html');
})

app.post('/', (req, res)=>{
    console.log(req.body);
    const mailChimpApiKey = '60f425f1f6f54329e946074bbde72c8c-us17';
    const list_Id = '0e44f27da3';
    const fname = req.body.fname;
    const lname = req.body.lname;
    const email = req.body.email;
    const url = 'https://us17.api.mailchimp.com/3.0/lists/';

    const data = {
        members: [
            {
                email_address : email,
                status : 'subscribed',
                merge_fields : {
                    FNAME: fname,
                    LNAME: lname    
                }
            }
        ]
    };

    const jsonData = JSON.stringify(data);

    const options = {
        method: 'POST',
        auth:`sb7:${mailChimpApiKey}`
    }

    const request = https.request(url+list_Id, options, (response)=>{
        response.on('data', (data)=>{
            //console.log(JSON.parse(data));
        })
        console.log(response.statusCode);
        if(response.statusCode != 200){
            res.sendFile(__dirname+"/failure.html");
        }
        else{
            res.sendFile(__dirname+"/success.html");
        }
    });

    request.write(jsonData);
    request.end();
})

app.post('/failure', (req,res)=>{
    res.redirect('/');
})

app.listen(process.env.PORT || 3000, (req, res)=>{
    console.log('Site is up at port 3000');
})