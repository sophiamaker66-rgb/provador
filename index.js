import express from "express";
import multer from "multer";
import path from "path";
import fs from "fs";

const app = express();
const upload = multer({ dest: "/tmp" });

// health
app.get("/health/session", (_req, res) => res.json({ status: "OK" }));

// home
app.get("/", (_req, res) => {
  res.send("Servidor do provador rodando 🚀");
});

// form para celular/navegador
app.get("/form", (_req, res) => {
  res.send(`
    <h2>Teste do Bot</h2>
    <form action="/run-whisk" method="post" enctype="multipart/form-data">
      <label>Foto da pessoa:</label><br/>
      <input type="file" name="subject" accept="image/*" required /><br/><br/>

      <label>Foto da roupa/ambiente:</label><br/>
      <input type="file" name="environment" accept="image/*" required /><br/><br/>

      <label>Estilo:</label><br/>
      <input type="text" name="style" value="Eu estou na praia ao pôr do sol, estilo veraneio" required style="width:100%;max-width:480px"/><br/><br/>

      <button type="submit">Gerar Imagem</button>
    </form>
  `);
});

// rota do bot – recebe 2 imagens + estilo
app.post(
  "/run-whisk",
  upload.fields([
    { name: "subject", maxCount: 1 },
    { name: "environment", maxCount: 1 },
  ]),
  async (req, res) => {
    try {
      const subj = req.files?.subject?.[0];
      const env = req.files?.environment?.[0];
      const style = String(req.body?.style || "").trim();

      if (!subj || !env || !style) {
        return res.status(400).json({
          ok: false,
          error: "Envie subject, environment e style.",
        });
      }

      // 🔹 por enquanto: pipeline “ok” (sem IA)
      // aqui depois entra a automação Whisk / Playwright
      const resultMeta = {
        ok: true,
        message: "Bot recebeu os arquivos e estilo. Pipeline OK.",
        style,
        subjectFile: path.basename(subj.path),
        environmentFile: path.basename(env.path),
      };

      // se quiser devolver um “preview” base64 do subject:
      const buf = fs.readFileSync(subj.path);
      const base64 = `data:image/jpeg;base64,${buf.toString("base64")}`;
      resultMeta.preview = base64;

      // limpeza assíncrona dos temporários
      setTimeout(() => {
        [subj?.path, env?.path].forEach((p) => p && fs.existsSync(p) && fs.unlinkSync(p));
      }, 2000);

      return res.json(resultMeta);
    } catch (e) {
      console.error(e);
      return res.status(500).json({ ok: false, error: "Falha no bot." });
    }
  }
);

const port = process.env.PORT || 8080;
app.listen(port, () => console.log("✅ Listening on port", port));
