const express = require("express");
const axios = require("axios");
const cors = require("cors");

require("dotenv").config();

const app = express();

app.use(express.json());

app.use(
  cors({
    origin: "http://localhost:3000",
  })
);

const TRADELOCKER_BASE_URL = "https://demo.tradelocker.com/backend-api";

app.get("/get-trades", (req, res) => {
  axios
    .post(`${TRADELOCKER_BASE_URL}/auth/jwt/token`, {
      email: process.env.TRADELOCKER_EMAIL,
      password: process.env.TRADELOCKER_PASSWORD,
      server: process.env.TRADELOCKER_SERVER,
    })
    .then((response) => {
      const { accessToken } = response.data;

      const headers = {
        headers: {
          Authorization: `Bearer ${accessToken}`,
          accNum: 2,
        },
      };

      axios
        .get(
          `${TRADELOCKER_BASE_URL}/trade/accounts/257900/ordersHistory`,
          headers
        )
        .then((res1) => {
          //   console.log(Object.entries(res1));
          res.status(200).send({ data: res1.data.d.ordersHistory });
        })
        .catch((err) => {
          //   console.error(err.response);
          res.status(404).send({ error: err });
        });
    })
    .catch((err) => {
      res.status(401).send({ error: "Could not authorize" });
    });
});

const PORT = process.env.PORT || 4000;

app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});
