import express from "express";
const app = express();

const port = 3011;

// Middleware
app.use(express.json());
app.use((req, res, next) => {
  console.log("Payments microservice called");
  next();
});

app.get("/", (req, res) => {
  let payments = {
    data: [
      {
        id: 1,
        name: "Payment 1",
      },
      {
        id: 2,
        name: "Payment 2",
      },
      {
        id: 3,
        name: "Payment 3",
      },
    ],
  };

  res.send(payments);
});

let server = app.listen(port, () => {
  console.log(`Orders service listening at http://localhost:${port}`);
});
