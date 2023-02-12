import express from 'express'
import path from 'path'
import cors from 'cors'
import mongoose from 'mongoose'
import bcrypt from 'bcryptjs'
import jwt from "jsonwebtoken"
import cookieParser from 'cookie-parser';


const app = express();
const PORT = process.env.PORT || 5000;
const mongodbURI = process.env.mongodbURI || "mongodb+srv://ecommerce:ecommerce@cluster0.plynqqp.mongodb.net/ecommerce?retryWrites=true&w=majority"
const SECRET = process.env.SECRET || "Thesharedsecretmustbeatleast32bytesinlength";


app.use(express.json())
app.use(cookieParser())
mongoose.connect(mongodbURI)
app.use(cors({
    origin: ['http://localhost:3000', 'https://localhost:3000', "*"],
    credentials: true
}));

let productSchema = new mongoose.Schema({
    name: { type: String, required: true },
    category: { type: String, required: true },
    description: { type: String, required: true },
    price: { type: Number, required: true },
    quantity: { type: Number, required: true },
    unit: { type: String, required: true },
    createdOn: { type: Date, default: Date.now }
    
})
const productModel = mongoose.model('Products', productSchema);



let userSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, trim: true, lowercase: true, unique: true },
    contact: { type: String, required: true },
    password: { type: String, required: true },
    createdOn: { type: Date, default: Date.now }
})
const userModel = mongoose.model('Users', userSchema);








// ----------------------------------- SignUp-----------------------------------
app.post('/signup', async (req, res) => {
    try {
        const email = req.body.email.toLowerCase();
        const password = req.body.password
        userModel.findOne({ email: email }, async (error, user) => {
            if (!error) {
                if (user) {
                    res.status(409).send({
                        message: "User already exists. Please try a different email"
                    });
                    console.log("User already exist with the following email: ", user.email);
                    return;
                } else {
                    const hashPassword = await bcrypt.hash(password, 10)
                    // console.log(hashPassword)
                    userModel.create({
                        name: req.body.name,
                        contact: req.body.contact,
                        email: req.body.email,
                        password: hashPassword,
                    })
                    res.status(201).send(
                        `User Created`
                    )
                    console.log("User Created.")
                }
            }
        })
    } catch (error) {
        res.status(500).send(error)
        console.log("Error While Creating User.")
    }
})
// ----------------------------------- SignUp -----------------------------------




// ----------------------------------- Login -----------------------------------
app.post("/login", (req, res) => {
    try {
        const email = req.body.email.toLowerCase();
        const password = req.body.password;
        userModel.findOne({ email }, async (error, user) => {
            if (!error) {
                if (user) {
                    const isValid = await bcrypt.compare(password, user.password)
                    if (isValid) {
                        const token = jwt.sign({
                            _id: user._id,
                            email: data.email,
                            iat: Math.floor(Date.now() / 1000) - 30,
                            exp: Math.floor(Date.now() / 1000) + (60 * 60)
                        }, SECRET)
                        res.cookie('Token', token, {
                            maxAge: 86_400_000,
                            httpOnly: true,
                            sameSite: 'none',
                            secure: true
                        });
                        res.status(200).send('User Found')
                        console.log("User Found.", user)
                    } else {
                        res.status(401).send('Wrong Password')
                        console.log("Wrong Password.")
                    }
                } else {
                    res.status(404).send('User not Found')
                    console.log("User not Found.")
                }
            } else {
                res.status(401).send("Login Failed, Please try later");
                console.log("Login Failed, Please try later");
                return;
            }
        })
    } catch (error) {
        res.status(500).send(error)
        console.log("No User Found with the following email: ", email)
    }
})
// ----------------------------------- Login -----------------------------------


// ----------------------------------- Logout -----------------------------------
app.post("/logout", (req, res) => {
    res.clearCookie('Token', {
        httpOnly: true,
        sameSite: 'none',
        secure: true
    })
    res.status(200).send('Logged Out')
    console.log("Logged Out.")
})
// ----------------------------------- Logout -----------------------------------


// ----------------------------------- Middleware -----------------------------------
app.use((req, res, next) => {
    console.log(req.cookies)
    if (!req?.cookies?.Token) {
        res.status(401).send({
            message: "Include http-only credentials with every request"
        })
        console.log("Include http-only credentials with every request")
        return;
    }
    jwt.verify(req.cookies.Cookies, SECRET, (err, decodedData) => {
        if (!err) {
            console.log("decodedData: ", decodedData);
            const currentTime = new Date().getTime() / 1000;
            if (decodedData.exp < currentTime) {
                res.status(401);
                res.cookie('Token', '', {
                    maxAge: 1,
                    httpOnly: true,
                    sameSite: 'none',
                    secure: true
                });
                res.send({ message: "Token Expired" })
            } else {
                console.log("Token Approved");
                req.body.Cookies = decodedData
                next();
            }
        } else {
            res.status(401).send("Invalid Token")
        }
    });
})
// ----------------------------------- Middleware-----------------------------------

























// ----------------------------------- Create/Add Product -----------------------------------
app.post('/product', (req, res) => {
    const body = req.body
    if (!body.name || !body.price || !body.unit || !body.quantity) {
        res.status(400).send({
            message: `Required Paramters Missing`
        })
        return;
    }
    productModel.create({
        name: body.name,
        category: body.category,
        description: body.description,
        price: body.price,
        quantity: body.quantity,
        unit: body.unit
    },
        (error, uploaded) => {
            if (!error) {
                console.log("Succesfully Uploaded to database", uploaded);
                res.send({
                    message: "Product Added Successfully",
                    data: uploaded
                });
            } else {
                res.status(500).send({
                    message: "server error"
                })
            }
        })
})
// ----------------------------------- Create/Add Product -----------------------------------



// ----------------------------------- Get Product -----------------------------------
// ------------------------ Get All Product ------------------------
app.get('/products', (req, res) => {
    productModel.find({}, (error, allFound) => {
        if (!error) {
            console.log("uploaded", allFound)
            res.send({
                message: `Fetched Product Succesfully 👍`,
                data: allFound
            })
        } else {
            res.status(500).send({
                message: `Server Error`
            })

        }
    });
})
// ------------------------ Get All Product ------------------------

// ------------------------ Get Specified Product ------------------------
app.get('/product/:id', (req, res) => {
    const id = req.params.id
    productModel.findOne({ _id: id }, (error, found) => {
        if (!error) {
            if (found) {
                res.send({
                    message: `Got the product of the specified id ${found._id}`,
                    data: found
                })
            } else {
                res.status(404).send({
                    message: `Product Not Found`
                })
            }
        } else {
            res.status(500).send({
                message: "server error"
            })
        }
    })
})
// ------------------------ Get Specified Product ------------------------

// ----------------------------------- Get Product -----------------------------------



// ----------------------------------- Delete Product -----------------------------------

// ------------------------ Delete All Product ------------------------
app.delete('/products', (req, res) => {
    productModel.deleteMany({}, (error, data) => {
        if (!error) {
            res.send({
                message: `All products deleted`
            })
        } else {
            res.status(500).send({
                message: `server error`
            })
        }
    })
})
// ------------------------ Delete All Product ------------------------

// ------------------------ Delete Specified Product ------------------------
app.delete('/product/:id', (req, res) => {
    const id = req.params.id
    productModel.deleteOne({ _id: id }, (error, deletedData) => {
        console.log(deletedData)
        if (!error) {
            if (deletedData.deletedCount === 1) {
                res.send({
                    message: `Product has been deleted of the following id ${id}`
                })
            } else {
                res.send({
                    message: `Product not found of the following id ${id}`
                })
            }
        } else {
            res.status(500).send({
                message: `server error`
            })
        }
    })
})
// ------------------------ Delete Specified Product ------------------------

// ----------------------------------- Delete Product -----------------------------------



// ----------------------------------- Update Product -----------------------------------
app.put('/product/:id', async (req, res) => {
    const body = req.body
    const id = req.params.id

    if (!body.name || !body.price) {
        res.status(400).send({
            message: `Required Paramters Missing. Please provide name and price`
        })
        return;
    }
    try {
        let data = await productModel.findByIdAndUpdate(id,
            {
                name: body.name,
                price: body.price,
            },
            { new: true }
        ).exec();

        console.log('updated: ', data);

        res.send({
            message: "product modified successfully"
        });

    } catch (error) {
        res.status(500).send({
            message: "server error"
        })
    }
})
// ----------------------------------- Update Product -----------------------------------





//////////////mongodb connected disconnected events///////////////////////////////////////////////
mongoose.connection.on('connected', function () {//connected
    console.log("Mongoose is connected");
    // process.exit(1);
});

mongoose.connection.on('disconnected', function () {//disconnected
    console.log("Mongoose is disconnected");
    process.exit(1);
});

mongoose.connection.on('error', function (err) {//any error
    console.log('Mongoose connection error: ', err);
    process.exit(1);
});

process.on('SIGINT', function () {/////this function will run jst before app is closing
    console.log("app is terminating");
    mongoose.connection.close(function () {
        console.log('Mongoose default connection closed');
        process.exit(0);
    });
});
//////////////mongodb connected disconnected events///////////////////////////////////////////////


// const __dirname = path.resolve()
// const staticPath = path.join(__dirname, '../client/build')
// console.log("PATH-------",staticPath)
// app.use('/'.express.static(staticPath))
// app.use('*'.express.static(staticPath))


app.listen(PORT, () => {
    console.log(`Server running on port:${PORT}`)
});