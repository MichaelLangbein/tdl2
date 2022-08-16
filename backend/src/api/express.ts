import express from "express";

export function appFactory() {
    const app = express();

    app.get("/", (req, res) => {
        res.send("tdl-backend running.");
    });

    

    return app;
}