import expressApp from "express";
import { urlencoded } from "body-parser";

class routerWeb {
  constructor() {
    this.expressApp = expressApp();
    this.expressApp.use(
      urlencoded({
        extended: true,
      })
    );
    this.expressApp.listen(8080);
  }
  startListener() {
    this.expressApp.post("/post-admin", (req, res) => {
      console.log(req);
      console.log(res);
    });
  }
}

let router = new routerWeb();
router.startListener();
