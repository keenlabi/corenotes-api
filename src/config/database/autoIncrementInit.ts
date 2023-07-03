import { connection } from "mongoose";
import { initialize, plugin } from "./mongoose-auto-increment";

initialize(connection);

const autoIncrementPlugin = plugin;

export default autoIncrementPlugin;