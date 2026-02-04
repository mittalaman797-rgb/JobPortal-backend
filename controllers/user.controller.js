import { User } from "../modals/user.js";
import bcrypt from "bcryptjs"
import jwt from "jsonwebtoken"
import getDataUri from "../utills/datauri.js";
import cloudinary from "../utills/cloudnary.js";


export const register = async (req, res) => {
    try {
        const { fullname, email, phoneNumber, password, role } = req.body
        
        if (!fullname || !email || !phoneNumber || !password || !role) {
            
            return res.status(400).json({
                message: "something is missing",
                success: false
            })
        }

           const file = req.file

    

        const user = await User.findOne({ email })
        if (user) {
            return res.status(400).json({
                message: "User already exist with this email",
                success: false
            })
        }

        const phoneExist = await User.findOne({ phoneNumber });
        if (phoneExist) {
            return res.status(400).json({
                message: "Phone number already exists",
                success: false
            });
        }
        const hashPassword = await bcrypt.hash(password, 10)
                                                                       
      
let resumeData = {};

if (file) {
  const fileUri = getDataUri(file);
  const cloudResponse = await cloudinary.uploader.upload(fileUri.content);


  if(cloudResponse){
            resumeData = {
    resume: cloudResponse.secure_url,
    resumeOriginalName: file.originalname
  };
  }
   
 
}

await User.create({
  fullname,
  email,
  phoneNumber,
  password: hashPassword,
  role,
  profile: resumeData
});


        res.status(201).json({
            message: "Account created successfully",
            success: true,

        })
    } catch (err) {
        console.log(err)
        res.status(500).json({
            message: "Internal server error",
            success: false
        });
    }


}


export const login = async (req, res) => {
    try {
        const { email, password, role } = req.body
        if (!email || !password || !role) {
            return res.status(400).json({
                message: "something is missing",
                success: false
            })
        }
        const user = await User.findOne({ email })
        if (!user) {
            return res.status(400).json({
                message: "Incorrect email or Password",
                success: false
            })

        }
        const isPassword = await bcrypt.compare(password, user.password)
        if (!isPassword) {
            return res.status(400).json({
                message: "Incorrect email or Password",
                success: false
            })

        }

        if (role !== user.role) {
            return res.status(400).json({
                message: "Account does not exist with current role",
                success: false
            })
        }
        const token = jwt.sign({ userID: user._id }, process.env.SECERT_KEY, { expiresIn: "1d" })
        const users = {
            _id: user._id,
            fullname: user.fullname,
            email: user.email,
            phoneNumber: user.phoneNumber,
            role: user.role,
            profile: user.profile
        }
        res.status(200).cookie("token", token, {
            httpOnly: true,
            secure: false,  //true in production
            sameSite: "lax",
            maxAge: 1 * 24 * 60 * 60 * 1000
        }).json({
            message: `Welcome back ${user.fullname}`,
            success: true,
            users

        })
    } catch (err) {
        console.log(err)
        res.status(500).json({
            message: "Internal server error",
            success: false
        });
    }
}


export const logOut = async (req, res) => {
    try {
    
        if (!req.cookies.token) {
            return res.status(200).json({ message: "Already logged out" });
        }  //optional,not required

        return res.status(200).clearCookie("token", {
            httpOnly: true,
            secure: false,
            sameSite: "lax"

        }).json({
            message: "Logout succesfully",
            success: true
        })
    } catch (err) {
        console.log(err)
        res.status(500).json({
            message: "Internal server error",
            success: false
        });
    }

}


export const updateProfile = async (req, res) => {
    try {
        const { fullname, email, phoneNumber, bio, skills } = req.body
        const file = req.file

       

    



        // coludinary aaygha idhar


        const userId = req.id
        
        let user = await User.findById(userId)

        if (!user) {
            return res.status(400).json({
                message: "User not found",
                success: false
            })
        }
        const skillsArray = skills
  ? skills.split(",").map(skill => skill.trim())
  : [];
        if (email && email !== user.email) {
            const emailExist = await User.findOne({ email });
            if (emailExist) {
                return res.status(400).json({
                    message: "Email already in use",
                    success: false
                });
            }
        }

        if (phoneNumber && phoneNumber !== user.phoneNumber) {
            const phoneExist = await User.findOne({ phoneNumber });
            if (phoneExist) {
                return res.status(400).json({
                    message: "phoneNumber already in use",
                    success: false
                });
            }
        }

        // updating data

        if (fullname) user.fullname = fullname;
        if (email) user.email = email;
        if (phoneNumber) user.phoneNumber = phoneNumber;
        if (bio) user.profile.bio = bio;
        if (skills) user.profile.skills = skillsArray;


        // resume comes later

        if (file) {
  const fileUri = getDataUri(file)
  const cloudResponse = await cloudinary.uploader.upload(fileUri.content)

  if(cloudResponse){
          user.profile.resume = cloudResponse.secure_url
  user.profile.resumeOriginalName = file.originalname
}
  }


           
       

        await user.save()
        const users = {
            _id: user._id,
            fullname: user.fullname,
            email: user.email,
            phoneNumber: user.phoneNumber,
            role: user.role,
            profile: user.profile
        }

        res.status(200).json({
            message: "Profile updated succesfully",
            success: true,
            users

        })



    } catch (err) {
        console.log(err)
        res.status(500).json({
            message: "Internal server error",
            success: false
        });

    }


}



// for update

// let user = await User.findById(userId);

// if (!user) {
//   return res.status(400).json({
//     message: "User not found",
//     success: false
//   });
// }

// const skillsArray = skills ? skills.split(",") : user.profile.skills;

// if (email && email !== user.email) {
//   const emailExist = await User.findOne({ email });
//   if (emailExist) {
//     return res.status(400).json({
//       message: "Email already in use",
//       success: false
//     });
//   }
// }

// if (phoneNumber && phoneNumber !== user.phoneNumber) {
//   const phoneExist = await User.findOne({ phoneNumber });
//   if (phoneExist) {
//     return res.status(400).json({
//       message: "phoneNumber already in use",
//       success: false
//     });
//   }
// }

// // FINAL UPDATE PART
// let updateData = {};

// if (fullname) updateData.fullname = fullname;
// if (email) updateData.email = email;
// if (phoneNumber) updateData.phoneNumber = phoneNumber;
// if (skills) updateData["profile.skills"] = skillsArray;

// const updatedUser = await User.findByIdAndUpdate(
//   userId,
//   { $set: updateData },
//   { new: true, runValidators: true }
// );

// return res.status(200).json({
//   message: "Profile updated successfully",
//   success: true,
//   user: updatedUser
// });
