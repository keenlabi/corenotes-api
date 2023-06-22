import { connection } from "mongoose";
import autoIncrement from "mongoose-auto-increment";
autoIncrement.initialize(connection)

export default autoIncrement.plugin;