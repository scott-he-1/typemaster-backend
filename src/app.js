"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var express_1 = require("express");
require("express-async-errors");
var cors_1 = require("cors");
["DATABASE_URL", "JWT_SECRET"].forEach(function (key) {
    if (!process.env[key]) {
        throw new Error("Missing environment variable ".concat(key));
    }
});
var app = (0, express_1.default)();
app.use((0, cors_1.default)());
app.use(express_1.default.json());
app.get("/", function (req, res) {
    return res.send("Hello world!");
});
app.listen(3000, function () { return console.log("Server is running on port 3000"); });
