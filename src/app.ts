import express from "express";
import routes from "./routes";
import globalErrorHandler from "./middleware/globalErrorHandler";

const app = express();

app.use(globalErrorHandler);
app.use(express.json());
app.use("/api/v1", routes);

export default app;