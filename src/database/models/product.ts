import hasha from "hasha";
import { PaginatedModel } from "sequelize-typescript-paginate";
import {
  Table,
  Column,
  Model,
  ForeignKey,
  Unique,
  BelongsTo,
  HasMany,
  Default,
  AllowNull,
} from "sequelize-typescript";

import { FindOptions } from "sequelize";
export declare type PaginationOptions = {
  page?: number;
  pageSize?: number;
} & FindOptions;

@Table({ timestamps: true, tableName: "product", freezeTableName: true })
export default class Product extends Model {
  @Column
  name: string;

  @Column
  feature: string;

  @Column
  date: string;

  @Column
  mail: string;

  @Column
  location: string;

  @Column
  price: string;

  @Column
  unitAvailable: string;

  @Column
  unitSold: string;

  @Column
  image: Buffer;

  @Column
  imageMimetype: string;

  static async paginate({ page = 1, pageSize = 25, ...params } = {}) {
    const options: PaginationOptions = Object.assign({}, params);
    const countOptions = Object.keys(options).reduce((acc, key) => {
      if (!["order", "attributes", "include"].includes(key)) {
        // eslint-disable-next-line security/detect-object-injection
        acc[key] = options[key];
      }
      return acc;
    }, {});

    let total = await Product.count(countOptions);

    if (options.group !== undefined) {
      // @ts-ignore
      total = total.length;
    }

    const pages = Math.ceil(total / pageSize);
    options.limit = pageSize;
    options.offset = pageSize * (page - 1);
    if (params["order"]) options.order = params["order"];
    const docs = await Product.findAll(options);
    return { docs, pages, total };
  }
}
