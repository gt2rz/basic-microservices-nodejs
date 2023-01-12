import express from "express";
const app = express();

const port = 3001;

// Middleware
app.use(express.json());
app.use((req, res, next) => {
  console.log("Orders microservice called");
  next();
});

app.get("/", (req, res) => {
  let orders = {
    data: [
      {
        id: 1,
        name: "Order 1",
      },
      {
        id: 2,
        name: "Order 2",
      },
      {
        id: 3,
        name: "Order 3",
      },
    ],
  };

  res.send(orders);
});

let server = app.listen(port, () => {
  console.log(`Orders service listening at http://localhost:${port}`);
});
