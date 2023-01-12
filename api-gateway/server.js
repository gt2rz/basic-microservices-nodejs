import gateway from "fast-gateway";

const port = 9001;

const server = gateway({
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

server.get('/', (req, res) => {
  res.send('API Gateway running...');
});

server.start(port).then(() => {
  console.log(`API Gateway listening at http://localhost:${port}`);
});
