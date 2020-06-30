import App from "./app";
import Routes from "./routes/index";

const app = new App(4002).getApp();
const route = new Routes(app);
route.getRoutes();

export { App };
