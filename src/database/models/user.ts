import hasha from "hasha";
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

@Table({ timestamps: true, tableName: "user", freezeTableName: true })
export default class User extends Model {
  @AllowNull
  @Column
  picture?: Buffer;

  @AllowNull
  @Column
  pictureMimetype?: string;

  @Unique
  @Column
  get username(): string {
    return this.getDataValue("username");
  }

  set username(username: string) {
    this.setDataValue("username", username);
  }

  @Column
  get password(): string {
    return this.getDataValue("password");
  }

  set password(password: string) {
    this.setDataValue("password", hasha(password));
  }
}
