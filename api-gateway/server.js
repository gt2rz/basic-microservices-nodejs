import gateway from "fast-gateway";
import rateLimit from "express-rate-limit";
import requestIp from "request-ip";
import helmet from "helmet";

const port = 9001;

const server = gateway({
  middlewares: [
    // first acquire request IP
    (req, res, next) => {
      req.ip = requestIp.getClientIp(req);
      return next();
    },
    // second enable rate limiter
    rateLimit({
      windowMs: 1 * 60 * 1000, // 1 minutes
      max: 60, // limit each IP to 60 requests per windowMs
      handler: (req, res) => {
        res.send("Too many requests, please try again later.", 429);
      },
    }),

  ],

  routes: [
    {
      prefix: "/orders",
      target: "http://localhost:3001",
    },
    {
      prefix: "/payments",
      target: "http://localhost:3011",
    },
  ],
});

server.use(helmet());

server.get("/", (req, res) => {
  res.send("API Gateway running...");
});

server.start(port).then(() => {
  console.log(`API Gateway listening at http://localhost:${port}`);
});
