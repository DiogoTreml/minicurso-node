import express from "express";
import * as dotenv from "dotenv";
import {
  deleteProp,
  getProp,
  postProp,
  putProp,
} from "./controllers/propsController.js";
import { validateProp } from "./util.js";
import {
  getPersonagemById,
  getPersonagens,
  postPersonagem,
  putPersonagem,
} from "./controllers/personagemController.js";

dotenv.config();

const app = express();
const port = parseInt(process.env.PORT) || 3000;

app.use(express.json());

const apiRouter = express.Router();

const handleResponse = (_, res) => {
  if (res.locals.status && res.locals.data) {
    res.status(res.locals.status).json(res.locals.data);
  } else {
    res.status(500).json({ message: "Erro interno do servidor" });
  }
};

//--------------------------------------------------------

apiRouter.get(
  "/prop/:prop",
  validateProp,
  async (req, res, next) => {
    const prop = req.params.prop;

    try {
      const { status, data } = await getProp(prop);
      res.locals.status = status;
      res.locals.data = data;
      next();
    } catch (error) {
      console.error(`Erro ao acessar ${prop}:`, error);
      res.locals.status = 500;
      res.locals.data = {
        message: `Erro ao processar a requisição para ${prop}`,
      };
      next();
    }
  },
  handleResponse
);

apiRouter.post(
  "/prop/:prop",
  validateProp,
  async (req, res, next) => {
    const prop = req.params.prop;
    const { nome, descricao } = req.body;

    try {
      const { status, data } = await postProp(prop, {
        nome,
        descricao,
      });
      res.locals.status = status;
      res.locals.data = data;
      next();
    } catch (error) {
      console.error(`Erro ao inserir em ${prop}:`, error);
      res.locals.status = 500;
      res.locals.data = { message: `Erro ao inserir dados em ${prop}` };
      next();
    }
  },
  handleResponse
);

apiRouter.put("/prop/:prop/", validateProp, async (req, res) => {
  const { prop } = req.params;
  const { id, nome, descricao } = req.body;

  const { status, data } = await putProp(prop, {
    nome,
    descricao,
    id,
  });
  res.status(status).json(data);
});

apiRouter.delete("/prop/:prop", validateProp, async (req, res) => {
  const { prop } = req.params;
  const { id } = req.body;

  const { status, data } = await deleteProp(prop, id);

  res.status(status).json(data);
});

//----------------------------------------------------------

apiRouter.get("/personagem", async (_, res) => {
  const { status, data } = await getPersonagens();

  res.status(status).json(data);
});

apiRouter.get("/personagem/:id", async (req, res) => {
  const { id } = req.params;

  const { status, data } = await getPersonagemById(id);

  res.status(status).json(data);
});

apiRouter.post("/personagem", async (req, res) => {
  const { nome, classe, raca, habilidades } = req.body;

  const { status, data } = await postPersonagem({
    nome,
    classe,
    raca,
    habilidades,
  });

  res.status(status).json(data);
});

apiRouter.put("/personagem", async (req, res) => {
  const { id, nome, classe, raca, habilidades } = req.body;

  const { status, data } = await putPersonagem({
    id,
    nome,
    classe,
    raca,
    habilidades,
  });

  res.status(status).json(data);
});

app.use("/api", apiRouter);

app.listen(port, () => {
  console.log(`Servidor rodando na porta ${port}`);
});

export default app;
