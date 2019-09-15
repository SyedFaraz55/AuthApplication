const User = require("../models/Users");
const bcrypt = require("bcrypt");
const passport = require("passport");
exports.index = function(req,res){
	res.render("welcome");
};
exports.login = function(req,res){
	res.render("login");
};
exports.register = function(req,res){
	res.render("register");
};
exports.dashboard = function(req,res){
	res.render("dashboard",{name:req.user.name});
}
exports.postRegister = function(req,res){
	const {name,email,password,password2} = req.body;
	let errors = [];
	// check required fields
	if(!name || !email || !password || !password2){
		errors.push({msg:"Please fill in all fields"});
	}

	//check password
	if(password !== password2){
		errors.push({msg:"password do not match"});
	}

	// check password length
	if(password.length <6){
		errors.push({msg:"password must be atleast 6 characters"});
	}

	if(errors.length > 0){
		res.render("register",{
			errors,
			name,
			email,
			password,
			password2
		});
	} else {
		User.findOne({email:email})
		.then(user => {
			if(user){
				errors.push({msg:"Email is already exits !"});
				res.render("register",{
					errors,
					name,
					email,
					password,
					password2
				});
			} else{
				const newUser = new User({
					name,
					email,
					password
				});
				// hash password
				bcrypt.genSalt(10,(err,salt)=> 
					bcrypt.hash(newUser.password,salt,(err,hash)=>{
						if(err) throw err;
						// set password hash
						newUser.password = hash;
						// save user
						newUser.save()
						.then((user)=>{
							req.flash('success_msg',"you are now registered and can login");
							res.redirect("/login");
						})
						.catch(err=>console.log(err));
				}));
			}
		})
	}

};

exports.postLogin = function(req,res,next){
	passport.authenticate('local',{
		successRedirect:"/dashboard",
		failureRedirect:"/login",
		failureFlash:true
	})(req,res,next);
}

exports.logout = function(req,res){
	req.logout();
	req.flash("success_msg","You are logged out");
	res.redirect("/login");
}

