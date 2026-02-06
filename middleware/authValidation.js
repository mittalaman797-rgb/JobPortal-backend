import joi from "joi"


export const signupValidation = (req, res, next) => {


    const schema = joi.object({
        fullname: joi.string().min(3).max(100).required(),
        email: joi.string().email().required(),
        password: joi.string()
            .min(4)
            .max(100)
            .pattern(/^(?=.*[A-Z])(?=.*[a-z])(?=.*[0-9])(?=.*[@#$%^&*]).*$/)
            .messages({
                "string.pattern.base":
                    "Password must contain uppercase, lowercase, number and special character"
            })
            .required(),
            role: joi.string()
    .valid("student", "recruiter")
    .required(),
     phoneNumber: joi.string()
    .length(10)
    .pattern(/^[0-9]+$/)
    .required(),

    })

    const { error } = schema.validate(req.body);

    if (error) {
        return res.status(400).json({
            message: error.details[0].message
        });
    }

    next()
}


export const loginupValidation = (req, res, next) => {
    console.log(req.body,"llll")
    const schema = joi.object({

        email: joi.string().email().required(),
        password: joi.string()
            .min(4)
            .max(100)
            .pattern(/^(?=.*[A-Z])(?=.*[a-z])(?=.*[0-9])(?=.*[@#$%^&*]).*$/)
            .required(),
            role: joi.string()
    .valid("student", "recruiter")
    .required(),

    })

    const { error } = schema.validate(req.body);

    if (error) {
        return res.status(400)
            .json({ message: "something went wrong" })
    } else {
        console.log("Valid Data!");
    }

    next()
}
