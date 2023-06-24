import { connection } from "mongoose";
import { initialize, plugin } from "./mongoose-auto-increment";

initialize(connection);

export default plugin;