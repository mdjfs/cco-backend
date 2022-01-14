import passport from "passport";
import express, { Request } from "express";
import multer from "multer";

import User from "../controllers/user";
import Product from "../helpers/product";

const router = express.Router();
const upload = multer();

const auth = passport.authenticate("jwt", { session: false });

interface UserRequest extends Request {
  user: {
    id: number;
    picture: Buffer;
    username: string;
    createdAt: string;
    updatedAt: string;
  };
}

router.post("/login", async (req, res) => {
  try {
    const token = await User.login(req.body);
    res.status(200).send(token);
  } catch (e) {
    res.status(500).send(e.message);
  }
});

router.get("/user/all", auth, async (req: UserRequest, res) => {
  try {
    const users = await User.getAll();
    res.status(200).send(users);
  } catch (e) {
    res.status(500).send(e.message);
  }
});

router.get("/picture", auth, async (req: UserRequest, res) => {
  try {
    const user = await User.read({ id: req.user.id });
    res.setHeader("Content-Type", user.pictureMimetype);
    res.status(200).send(user.picture);
  } catch (e) {
    res.status(500).send(e.message);
  }
});

router.post(
  "/picture",
  auth,
  upload.single("picture"),
  async (req: UserRequest, res) => {
    try {
      console.log(req.file.buffer, req.file.mimetype);
      await User.update(
        { picture: req.file.buffer, pictureMimetype: req.file.mimetype },
        { id: req.user.id }
      );
      res.sendStatus(200);
    } catch (e) {
      res.status(500).send(e.message);
    }
  }
);

router.post("/user", async (req, res) => {
  try {
    const token = await User.register(req.body);
    res.status(200).send(token);
  } catch (e) {
    res.status(500).send(e.message);
  }
});

router.get("/user", auth, async (req: UserRequest, res) => {
  try {
    const user = await User.read({ id: req.user.id });
    res.status(200).send(user);
  } catch (e) {
    res.status(500).send(e.message);
  }
});

router.put("/user", auth, async (req: UserRequest, res) => {
  try {
    await User.update(req.body, { id: req.user.id });
    res.sendStatus(200);
  } catch (e) {
    res.status(500).send(e.message);
  }
});

router.delete("/user", auth, async (req: UserRequest, res) => {
  try {
    await User.del({ id: req.user.id });
    res.sendStatus(200);
  } catch (e) {
    res.status(500).send(e.message);
  }
});

router.get("/product", auth, async (req: UserRequest, res) => {
  try {
    const { page, pageSize, order, ...filter } = req.query;
    const filterArray = [];
    for (const [attr, search] of Object.entries(filter)) {
      filterArray.push([attr, search]);
    }
    const products = await Product.get(
      page ? parseInt(page as string) : undefined,
      pageSize ? parseInt(pageSize as string) : undefined,
      order ? [[order as string, "DESC"]] : undefined,
      filterArray.length > 0 ? filterArray : undefined
    );
    res.status(200).send(products);
  } catch (e) {
    res.status(500).send(e.message);
  }
});

router.get("/product/image", auth, async (req: UserRequest, res) => {
  try {
    const { id } = req.query;
    const product = await Product.getById(parseInt(id as string));
    res.setHeader("Content-Type", product.imageMimetype);
    res.send(product.image);
  } catch (e) {
    res.status(500).send(e.message);
  }
});

router.post(
  "/product",
  auth,
  upload.single("picture"),
  async (req: UserRequest, res) => {
    try {
      const data = {
        image: req.file.buffer,
        imageMimetype: req.file.mimetype,
        ...req.body,
      };
      await Product.create(data);
      res.sendStatus(200);
    } catch (e) {
      res.status(500).send(e.message);
    }
  }
);

router.delete("/product", auth, async (req: UserRequest, res) => {
  try {
    await Product.remove(parseInt(req.query.id as string));
    res.sendStatus(200);
  } catch (e) {
    res.status(500).send(e.message);
  }
});

export default router;
