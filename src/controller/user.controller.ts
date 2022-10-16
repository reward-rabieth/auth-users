
import { Request,Response } from "express";
import { nanoid } from "nanoid";
import { CreateUserInput, forgotPasswordInput, ResetPasswordInput, VerifyUserInput } from "../schema/user.schema";
import { createUser, findUserByEmail, findUserById } from "../service/user.service";
import logger from "../utils/logger";
import sendEmail from "../utils/mailer";
export async function createUserHandler(req:Request<{},{},CreateUserInput>,res:Response){


    const body=req.body

    try{
const user=await createUser(body)
await sendEmail({
    to: user.email,
    from: "test@example.com",
    subject: "Verify your email",
    text: `verification code: ${user.verificationCode}. Id: ${user._id}`,
  });

return res.send("User succesfully created ")
    }

    catch(e:any){

        if(e.code===11000){
            return res.status(409).send("Account already exists")

        }

        return res.status(500).send(e)


    }
}


export async function verifyUserHandler(req:Request<VerifyUserInput>,res:Response){

    const id=req.params.id
    const verificationCode=req.params.verificationCode


    //find the user by id

    const user=await findUserById(id)
        
        if(!user){
            return res.send('could not verify user ')


        }

     //check  to see if they are already verified

        if(user.verified){
            return res.send("user is already verified ")

        }
       //check to see if the verification code matches
        if(user.verificationCode===verificationCode){
            user.verified=true

            await user.save()

            return(res.send("user successfully verified "))


        }

        return(res.send("could not verify user"))
   
 


}

export async function forgetPasswordHandler(req:Request<{},{},forgotPasswordInput>,res:Response){

    const message="if a user with that email is registered you will receive a password reset email "

    const{email}=req.body

    const user=await findUserByEmail(email)
    

    if(!user){

        logger.debug(`user with email ${email} does not exist`)
        return res.send(message)
    }

    if(!user.verified){
        return res.send("user is not verified ")
    }

    const passwordResetCode=nanoid()

    user.passwordResetCode=passwordResetCode

    await user.save()


   await sendEmail({
    to:user.email,
    from:"test@example.com",
    subject:"Reset your password",
    text:`password reset code: ${passwordResetCode}.Id ${user._id}`,
   })
logger.debug(`password reset code sent to ${email}`)
   return res.send(message)

}

export async function resetPasswordHandler(req:Request<ResetPasswordInput['params'],{},ResetPasswordInput['body']>,res:Response){

    const {id,passwordResetCode}=req.params

    const{password}=req.body

    const user= await findUserById(id)


    if(!user || !user.passwordResetCode || user.passwordResetCode !==passwordResetCode){
        return res.status(400).send('could not reset   password')
    }

    user.passwordResetCode=null

    user.password=password

    await user.save();

    return res.send("successfully updated user password")
}
export async function getCurrentUserHandler(req: Request, res: Response) {
    return res.send(res.locals.user);
  }