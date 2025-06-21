import { User } from "../models/user.models.js"
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import cookieparser from 'cookie-parser'



const editUser = async function (req, res) {
        try {
            const { username, Fullname, Password, confirmPassword, Address, pincode, role, email } = req.body;
        
            // Check if password and confirmPassword match
            if (Password !== confirmPassword) {
              return res.status(400).send("Passwords do not match.");
            }
        
            // Hash the password if updated
            const hashedPassword = await bcrypt.hash(Password, 10); // Adjust hashing if necessary
        
            // Update the user by email (assuming email is unique and not editable)
            await User.updateOne(
              { email: email }, // find by email
              {
                username: username,
                Fullname: Fullname,
                Password: hashedPassword,
                Address: Address,
                pincode: pincode,
                role: role,
              }
            );
        
            // Redirect or send a success message after the update
            return res.status(200).redirect("/WeatherApp/AllUsers");
          } catch (error) {
            console.error(error);
            return res.status(500).send("An error occurred while updating the user.");
          }
}


const editPage = async function (req, res) {
    const id = req.params.id;
    const existedUser = await User.findById(id);
    try {
        return res.status(200).render('editUser', { 'user': existedUser });
    }
    catch (error) {
        return res.status(404).send("some error occured!")
    }
}

const registerPage = async function (req, res) {
    res.render('register');

}
const registerUser = async function (req, res) {
    try {
        var { username, email, Fullname, Password, confirmPassword, Address, pincode, role } = req.body;
        if (Object.keys(req.body).length === 0) {
            return res.status(400).send("Invalid Input")
        }
        if (username.trim() == "" || email.trim() == "") {
            return res.status(400).send("Both Username and email fields should not be empty")
        }

        const existinguser = await User.findOne({ email });
        if (existinguser) {
            return res.status(401).send("User with email already exist");
        }
        if (Password !== confirmPassword) {
            return res.status(401).send("Password is not matching with confirmPassword")
        }
        Password = await bcrypt.hash(Password, 10)
        const token = jwt.sign({
            email: email,
            username: username,
            fullname: Fullname
        },
            'eyJhbGciOiJIUzI1NiJ9.eyJSb2xlIjoiQWRtaW4iLCJJc3N1ZXIiOiJJc3N1ZXIiLCJVc2VybmFtZSI6IkphdmFJblVzZSIsImV4cCI6MTcyNTQ4NTE5MSwiaWF0IjoxNzI1NDg1MTkxfQ.1PC4lxzqGzLlYYEhmDuprB8kCJhuVadBeAiyLgin354',
            {
                expiresIn: '2h'
            })
        const user = await User.create({
            username, email, Fullname, Address, pincode, Password, refreshToken: token, role
        })

        const createdUser = await User.findById(user._id);
        if (!createdUser) {
            return res.send(400).send("some thing went wrong while registering a user!")
        }
        return res.status(201).render("homepage", { "createdUser": createdUser });
    }
    catch (error) {
        console.log(error);
    }
}

const loginPage = async function (req, res) {
    return res.render('login');
}

const loginUser = async function (req, res) {

    var { email, Password } = req.  body
    if (email.trim() == "" || Password.trim() == "") {
        return res.status(200).send("Both Fields are required");
    }
    const existedUser = await User.findOne({ email })
    if (!existedUser) {
        return  res.status(200).send("Please register to the Application")
    }
    const isMatch = await bcrypt.compare(Password, existedUser.Password);
    if (isMatch) {
        const token = jwt.sign({
            //_id : user._id,
            email: email,
            role: existedUser.role,
        },
            'eyJhbGciOiJIUzI1NiJ9.eyJSb2xlIjoiQWRtaW4iLCJJc3N1ZXIiOiJJc3N1ZXIiLCJVc2VybmFtZSI6IkphdmFJblVzZSIsImV4cCI6MTcyNTQ4NTE5MSwiaWF0IjoxNzI1NDg1MTkxfQ.1PC4lxzqGzLlYYEhmDuprB8kCJhuVadBeAiyLgin354',
            {
                expiresIn: '2h'
            })
        // send token in cookie parser
        const options = {
            expires: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000), // its just an object    // todays data + how many days you want to keep it alive
            httpOnly: true     // cookies can be manupilated only by http
        }
        res.cookie('token', token, {
            httpOnly: true,  // Prevents JavaScript access to the cookie
            //secure: process.env.NODE_ENV === 'production', // Ensures the cookie is only sent over HTTPS in production
            maxAge: 3600000, // 1 hour in milliseconds
        });
        if (token) {
            try {
                const decoded = jwt.verify(token, 'eyJhbGciOiJIUzI1NiJ9.eyJSb2xlIjoiQWRtaW4iLCJJc3N1ZXIiOiJJc3N1ZXIiLCJVc2VybmFtZSI6IkphdmFJblVzZSIsImV4cCI6MTcyNTQ4NTE5MSwiaWF0IjoxNzI1NDg1MTkxfQ.1PC4lxzqGzLlYYEhmDuprB8kCJhuVadBeAiyLgin354');
                res.locals.isAuthenticated = true;
                res.locals.user = decoded; // Pass user info to views
            } catch (err) {
                res.locals.isAuthenticated = false;
            }
        } else {
            res.locals.isAuthenticated = false;
        }
        console.log(res);
        return res.status(200).render('homepage', { "user": existedUser })
    } else {
        // Passwords don't match
       return res.status(200).send('Wrong Password');
    }
}

const logoutUser = async function (req, res) {
    res.clearCookie('token', { httpOnly: true, secure: true, sameSite: 'Strict' });
    res.redirect('/WeatherApp/loginPage');
}


const userProfile = async function (req, res) {
    const email = req.params.email
    console.log(email)
    const existUser = await User.find({ email: email });
    console.log(existUser)
    if (!existUser) {
        return res.status(404).send("No particular user")
    }
    return res.status(201).render('userProfile', { 'exuser': existUser });
}


const deleteUser = async function (req, res) {
    const id = req.params.id
    console.log(id)
    const existUser = await User.findOne({ id:User._id });
    console.log(existUser)
    if (!existUser) {
        return res.status(404).send("No User to delete");
    }
    const deletedUser = await User.deleteOne({ id: User._id })
    console.log(deleteUser)
    return res.status(200).redirect('/WeatherApp/AllUsers');
}

export { registerUser, loginUser, registerPage, loginPage, logoutUser, userProfile, deleteUser, editPage, editUser }