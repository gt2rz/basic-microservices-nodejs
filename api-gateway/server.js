import gateway from "fast-gateway";
import rateLimit from "express-rate-limit";
import requestIp from "request-ip";
import helmet from "helmet";
import morgan from "morgan";
import path from "path";
import { fileURLToPath } from 'url';
import rfs from 'rotating-file-stream';

const port = 9001;

const __dirname = fileURLToPath(new URL('.', import.meta.url));

const pad = num => (num > 9 ? "" : "0") + num;
const generator = () => {
  let now = new Date(Date.now());

  if (!now) return "access.log";
  
  let folder = now.getFullYear() + "-" + pad(now.getMonth() + 1);
  let fileName = now.getFullYear() + "-" + pad(now.getMonth() + 1) + "-" + pad(now.getDate());

  return `${folder}/${fileName}.log`;
};

// create a rotating write stream
var accessLogStream = rfs.createStream(generator, {
  size: "10M", // rotate every 10 MegaBytes written
  interval: '1d', // rotate daily
  path: path.join(__dirname, 'logs'),
  compress: "gzip" // compress rotated files
})


const server = gateway({
  middlewares: [
    morgan('combined', { stream: accessLogStream }),

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
    helmet(),

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

// server.use(helmet());
// server.use(morgan('combined'))

server.get("/", (req, res) => {
  res.send("API Gateway running...");
});

server.start(port).then(() => {
  console.log(`API Gateway listening at http://localhost:${port}`);
});
