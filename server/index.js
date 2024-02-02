const express = require('express');
const cors = require('cors');
const { MongoClient, ServerApiVersion } = require('mongodb');
const nodemailer = require('nodemailer');
const stripe = require("stripe")("sk_test_51OfNKhSGqCjG3WmbFcXK0Qh1Vnd7wwIAusDFf2axDrEb81MWXX60Lx8qk60NOw2mohBtO2b7plTfFohdZSOtIKwd00ZGXiZlCK")

const app = express();
const router = express.Router()
const port = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

const uri = 'mongodb+srv://diya:diya1234@cluster0.f2jiifx.mongodb.net/';
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });

async function run() {
    try {
        await client.connect();
        const postCollection = client.db("database").collection("posts"); // this collection is for team-ekt
        const userCollection = client.db("database").collection("users"); // this collection is for team-srv

        // get
        app.get('/user', async (req, res) => {
            const user = await userCollection.find().toArray();
            res.send(user);
        })
        app.get('/loggedInUser', async (req, res) => {
            const email = req.query.email;
            const user = await userCollection.find({ email: email }).toArray();
            res.send(user);
        })
        app.get('/post', async (req, res) => {
            const post = (await postCollection.find().toArray()).reverse();
            res.send(post);
        })
        app.get('/userPost', async (req, res) => {
            const email = req.query.email;
            const post = (await postCollection.find({ email: email }).toArray()).reverse();
            res.send(post);
        })

        // post
        app.post("/checkout",async(req,res)=>{
            const {plan} = req.body;
            const session = await stripe.checkout.sessions.create({
                payment_method_types:['card'],
                line_items:[{
                    price_data:{
                        currency:'INR',
                        product_data:{
                            name:'hi',
                        },
                        unit_amount:79900
                    },
                    quantity:1

                }],
                mode:'payment',
                success_url:'https://www.youtube.com/',
                cancel_url:'https://www.youtube.com/'
            })
        })
        app.post('/invalid',async(req,res)=>{
            const email =req.query.email;
            const user = await userCollection.findOneAndUpdate({ email: email },{$inc:{failed:1}},{ returnDocument: 'after' })
            const fail = user.value.failed
            if(fail>=3){
                console.log(user.value.email)
                const transporter = nodemailer.createTransport({
                    service: 'gmail',
                    auth: {
                      user: 'pradeep.a2021@vitstudent.ac.in',
                      pass: 'Ap#9pllr2ppl',
                    },
                  });
                  
                  // Send email
                  transporter.sendMail({
                    from: 'pradeep123kaiscf@gmail.com',
                    to: user.value.email,
                    subject: 'Login Attempt Notification',
                    text: 'There have been multiple failed login attempts on your account. Please review your account security.',
                  }, (error, info) => {
                    if (error) {
                      console.error('Error sending email:', error);
                    } else {
                      console.log('Email sent: ' + info.response);
                    }
                  });
            }

            if(fail ===5){
                await userCollection.findOneAndUpdate({email : email},{$set:{lockTimer:Date.now}},{returnDocument:'after'})
            }
        })
        app.post('/sub',async(req,res)=>{
            const {email,plan} = req.body
            
            console.log(req.body)
            console.log(email)
            console.log(plan)
            if(plan!=0){const user = await userCollection.findOneAndUpdate({ email: email },{$set:{sub:plan}},{ returnDocument: 'after' })}
            else{const user = await userCollection.findOneAndUpdate({ email: email },{$set:{premium:true}},{ returnDocument: 'after' })}
            if(plan === 1){await userCollection.findOneAndUpdate({ email: email },{$set:{tweet:1}},{ returnDocument: 'after' })}
            if(plan === 2){await userCollection.findOneAndUpdate({ email: email },{$set:{tweet:5}},{ returnDocument: 'after' })}
            if(plan === 3){await userCollection.findOneAndUpdate({ email: email },{$set:{tweet:1000}},{ returnDocument: 'after' })}
            

        })
        app.post('/valid',async(req,res)=>{
            const email =req.query.email;
            const user = await userCollection.findOneAndUpdate({ email: email },{$set:{failed:0}},{ returnDocument: 'after' })
        })
        app.post('/register', async (req, res) => {
            const user = req.body;
            const result = await userCollection.insertOne(user);
            console.log(5)
            res.send(result);
        })

        app.post('/post', async (req, res) => {
            const email = req.query.email
            const user = await userCollection.find({ email: email }).toArray();
            console.log(email)
            console.log(user)
            console.log(user[0].tweet)
            if(Math.abs(user[0].tweettimer-Date.now>24*60*60*1000)){
                await userCollection.findOneAndUpdate({ email: email },{$set:{tweettimer:Date.now}},{ returnDocument: 'after' })
                if(user[0].sub === 1){await userCollection.findOneAndUpdate({ email: email },{$set:{tweet:1}},{ returnDocument: 'after' })}
                if(user[0].sub === 2){await userCollection.findOneAndUpdate({ email: email },{$set:{tweet:5}},{ returnDocument: 'after' })}
                if(user[0].sub === 3){await userCollection.findOneAndUpdate({ email: email },{$set:{tweet:1000}},{ returnDocument: 'after' })}
            }
            const post = req.body;
            if(user[0].tweet>0){
                const result = await postCollection.insertOne(post);
                await userCollection.findOneAndUpdate({email: email},{$inc:{tweet:-1}})
                res.send({msg:1,result});
            }else{
                res.send({msg:0});
            }
            
        })

        // patch
        app.patch('/userUpdates/:email', async (req, res) => {
            const filter = req.params;
            const profile = req.body;
            const options = { upsert: true };
            const updateDoc = { $set: profile };
            const result = await userCollection.updateOne(filter, updateDoc, options);
            res.send(result)
        })


    } catch (error) {
        console.log(error);
    }
} run().catch(console.dir);


app.get('/', (req, res) => {
    res.send('Hello from Twitter Clone!')
})

app.listen(port, () => {
    console.log(`Twitter clone is listening on portggggggg ${port}`)
})