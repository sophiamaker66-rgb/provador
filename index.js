import express from "express";

const app = express();

app.get("/health/session", (req, res) => {
  res.json({ status: "OK" });
});

app.get("/", (req, res) => {
  res.send("Servidor do provador rodando 🚀");
});

const port = process.env.PORT || 8080;
app.listen(port, () => console.log("listening on", port));