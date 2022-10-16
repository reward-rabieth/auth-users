import userModel, { User } from "../model/user.model";

export function createUser(input:Partial<User>){

    return userModel.create(input)
}

export function findUserById(id:string){

    return userModel.findById(id)

}

export function findUserByEmail(email:string){

    return userModel.findOne({email})

}