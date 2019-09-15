const express = require("express");
const app = express();
const routes = require("./routes/index");
const mongoose = require("mongoose");
const db = require("./config/keys").mongoURI;
const flash = require("connect-flash");
const session = require("express-session");
const passport = require("passport");
require("./config/passport")(passport);
const { ensureAuthenticated } = require("./config/auth");
// Db config 
mongoose.connect(db,{useNewUrlParser:true})
.then(()=>console.log("connected to mongodb atlas"))
.catch((err)=>console.log(err))

app.set("view engine","ejs");
app.use(express.urlencoded({extended:false}));
// express session middle ware
app.use(session({
	secret:"ilovecat",
	resave:true,
	saveUninitialized:true,
}));

// connect flash

app.use(flash());

// global var
app.use((req,res,next)=> {
	res.locals.success_msg = req.flash('success_msg');
	res.locals.error_msg = req.flash('error_msg');
	res.locals.error = req.flash("error");
	next();
});

app.use(passport.initialize());
app.use(passport.session());

app.use(express.static("public"));
app.get("/",routes.index);
app.get("/login",routes.login);
app.get("/register",routes.register);
app.get("/dashboard", ensureAuthenticated ,routes.dashboard);
app.get("/logout",routes.logout);

app.post("/register",routes.postRegister);
app.post("/login",routes.postLogin);

app.listen(3000,function() {
	console.log("listening to port 3000...");
});