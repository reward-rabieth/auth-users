import mongoose from "mongoose";
import config from "config";
import logger from "./logger";

async function connectToDb() {
const dburi=config.get<string>('dburi')

try{


await mongoose.connect(dburi)
logger.info("connected to db")



}
catch(e){
    process.exit(1)

}
}


export default connectToDb;
