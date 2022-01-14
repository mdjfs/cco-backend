import { Op } from "sequelize";
import database from "../database";
import { PaginationOptions } from "../database/models/product";

const { Product } = database.models;

async function get(
  page: number = 1,
  pageSize: number = 25,
  order: [string, string][] = [["name", "DESC"]],
  filter: [string, string][] = []
) {
  const options: PaginationOptions = {
    attributes: [
      "id",
      "name",
      "feature",
      "date",
      "mail",
      "location",
      "price",
      "unitAvailable",
      "unitSold",
    ],
    page,
    pageSize,
    order,
  };
  for (const [attr, search] of filter) {
    if (!options.where) options.where = {};
    options.where[attr] = { [Op.like]: `%${search}%` };
  }
  const { docs, pages, total } = await Product.paginate(options);
  return { docs, pages, total };
}

async function remove(id: number) {
  await Product.destroy({ where: { id } });
}

async function create(body) {
  await Product.create(body);
}

async function getById(id: number) {
  return await Product.findOne({ where: { id } });
}

export { create, remove, get, getById };

export default { create, remove, get, getById };
