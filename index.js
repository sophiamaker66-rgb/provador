import express from "express";
import multer from "multer";
import fetch from "node-fetch";

const app = express();
const upload = multer({ dest: "uploads/" });

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// rota de teste
app.get("/", (req, res) => {
  res.send("Servidor do provador rodando 🚀");
});

// rota do formulário (HTML simples)
app.get("/form", (req, res) => {
  res.send(`
    <h1>Gerar Imagem</h1>
    <form action="/run-whisk" method="post" enctype="multipart/form-data">
      <p>Sua Foto: <input type="file" name="subject" /></p>
      <p>Roupa/Cenário: <input type="file" name="environment" /></p>
      <p>Estilo: <input type="text" name="style" /></p>
      <button type="submit">Gerar</button>
    </form>
  `);
});

// rota que chama a API do Whisk (mock por enquanto)
app.post("/run-whisk", upload.fields([{ name: "subject" }, { name: "environment" }]), async (req, res) => {
  const { style } = req.body;

  // por enquanto só devolve um JSON simulando sucesso
  res.json({
    message: "Chamada recebida com sucesso!",
    style: style,
    subjectFile: req.files["subject"]?.[0]?.originalname,
    environmentFile: req.files["environment"]?.[0]?.originalname,
  });
});

const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
  console.log(`✅ Listening on port ${PORT}`);
});