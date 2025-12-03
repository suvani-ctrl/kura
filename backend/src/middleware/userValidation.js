import Joi from "joi";

const validateSignup = (req,res,next) =>{
    const schema = Joi.object({
        email: Joi.string().email().required(),
        username: Joi.string().alphanum().min(3).max(30).required(),
        password:Joi.string().required(),
        profilePic: Joi.string().uri().allow(''),
    })

    const {error} = schema.validate(req.body);
    if(error) return res.status(400).json({
        error: error.details[0].message
    });
    next();
}

export default validateSignup