import {object,string,TypeOf} from "zod"

export const createUserSchema=object({
body:object({
firstName:string({


    required_error:"First name is required"

}),
lastName:string({


    required_error:"Last name is required"

}),
password:string({


    required_error:"password is required"

}).min(6,"password is too short - should be min 6 chars"),
passwordConfirmation:string({

    required_error:"password confirmation is required"
}),


email:string({
    required_error:"email is required"
}).email("not a valid email")




}).refine((data)=>data.password===data.passwordConfirmation,{

    message:"passwords do not match",
    path:["password confirmation"]
})

})

export const verifyUserSchema=object({
    params:object({
        id:string(),
        verificationCode:string(),
    })
})



export const forgotPasswordSchema=object({
    body:object({
        email:string({
            required_error:"Email is required "
        }).email("not a valid email")

    })
})


export const resetPasswordSchema=object({

    params:object({

        id:string(),
        passwordResetCode:string(),


    }),

    body:object({
        password:string({


            required_error:"password is required"
        
        }).min(6,"password is too short - should be min 6 chars"),
        passwordConfirmation:string({
        
            required_error:"password confirmation is required"
        }),
        
        


    })
    .refine((data)=>data.password===data.passwordConfirmation,{

        message:"passwords do not match",
        path:["password confirmation"]
    })
})
export type CreateUserInput=TypeOf<typeof createUserSchema >["body"]
export type VerifyUserInput=TypeOf<typeof verifyUserSchema >["params"]
export type forgotPasswordInput=TypeOf<typeof forgotPasswordSchema >["body"]
export type ResetPasswordInput    =TypeOf<typeof resetPasswordSchema >

