import { Router } from "express";

export default () => {
  const router = Router();

  // Redirect root to /app
  router.get("/", (req, res) => {
    res.redirect("/app");
  });

  return router;
};