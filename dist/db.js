"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.db = void 0;
const mongoose = require('mongoose');
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const URL = process.env.MONGO_URI;
console.log(URL);
const connectionParams = {
    useNewUrlParser: true,
    useUnifiedTopology: true,
};
mongoose
    .connect(URL, connectionParams)
    .then(() => {
    console.log('Connected to database');
})
    .catch((err) => {
    console.error(`Error connecting to the database. \n${err}`);
});
exports.db = mongoose.connection;
//# sourceMappingURL=db.js.map