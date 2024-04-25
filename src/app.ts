import express, { Request, Response } from "express";
import * as dotenv from "dotenv";
import { personagemProp, PropsOpc } from "./controllers/propsController";

dotenv.config();

const app: express.Application = express();
const port: number = parseInt(process.env.PORT as string) || 3000;

app.use(express.json());

const apiRouter: express.Router = express.Router();

const handleResponse = (req: Request, res: Response) => {
  if (res.locals.status && res.locals.data) {
    res.status(res.locals.status).json(res.locals.data);
  } else {
    res.status(500).json({ message: "Erro interno do servidor" });
  }
};

apiRouter.get(
  "/:prop",
  async (req: Request, res: Response, next: express.NextFunction) => {
    const prop = req.params.prop;
    try {
      const { status, data } = await personagemProp.get(prop as PropsOpc);
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
  "/:prop",
  async (req: Request, res: Response, next: express.NextFunction) => {
    const prop = req.params.prop;
    const { nome, descricao } = req.body;
    try {
      const { status, data } = await personagemProp.post(prop as PropsOpc, {
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

app.use("/api", apiRouter);

app.listen(port, () => {
  console.log(`Servidor rodando na porta ${port}`);
});

export default app;
