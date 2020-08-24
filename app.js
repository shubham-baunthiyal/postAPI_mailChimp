const express = require('express');
require('dotenv').config()
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
    const mailChimpApiKey = process.env.MAIL_CHIMP_ID;
    const list_Id = process.env.LIST_ID;
    const fname = req.body.fname;
    const lname = req.body.lname;
    const email = req.body.email;
    const url = process.env.MAIL_CHIMP_API;

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