import database from "../database";

const { User } = database.models;

interface UserData {
  picture?: Buffer;
  pictureMimetype?: string;
  username?: string;
  password?: string;
}

interface UserGuest {
  isGuest: boolean;
}

interface UserOptions {
  role: string;
}

interface UserTarget {
  id?: number;
  username?: string;
  password?: string;
}

/**
 * Create a user in the database
 * @param data User Data
 * @param options User Options
 */
async function create(data: UserData | UserGuest) {
  const user = await User.create(data);
  return user;
}

/**
 * Get info of user in the database
 * @param target User Target
 */
async function read(target: UserTarget) {
  const user = await User.findOne({ where: { ...target } });
  return user;
}

async function getAll() {
  const users = await User.findAll();
  return users;
}

/**
 * Updates user in the database
 * @param data User Data
 * @param target User Target
 * @param options User Options
 */
async function update(data: UserData, target: UserTarget) {
  const user = await User.findOne({ where: { ...target } });
  if (user) {
    await user.update(data);
  }
}

/**
 * Deletes user in the database
 * @param target User Target
 */
async function del(target: UserTarget) {
  await User.destroy({ where: { ...target } });
}

export { UserData, UserOptions, UserTarget, create, read, update, del, getAll };

export default { create, read, update, del, getAll };
