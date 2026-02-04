/* eslint-disable no-return-await */
/* eslint-disable func-names */
/* eslint-disable prefer-destructuring */
/* eslint-disable camelcase */
import { db_post, db_get, check_parameters } from "./functions.js";
import bcrypt from "bcryptjs";

const users = {};

async function hashPassword(plaintextPassword) {
  return await bcrypt.hash(plaintextPassword, 10);
}

async function comparePassword(plaintextPassword, hash) {
  return await bcrypt.compare(plaintextPassword, hash);
}

users.login = async function (request_body, req) {
  check_parameters(["user_name", "password"], request_body);
  const { user_name, password } = request_body;
  const query_string = `SELECT * FROM users WHERE user_name = '${user_name}'`;
  const user_data = await db_get(query_string);
  const compareResult = await comparePassword(password, user_data[0].password);
  if (compareResult) {
    req.session.user = user_data[0];
    return true;
  }
};
users.logout = async function (request_body, req) {
  req.session.user = undefined;
  return true;
};
users.create = async function (request_body) {
  check_parameters(["user_name", "password"], request_body);
  let { user_name, password } = request_body;
  password = await hashPassword(password);
  const query_string = `INSERT INTO users(id, user_name, password) VALUES(UUID(), '${user_name}', '${password}')`;
  return await db_post(query_string);
};
users.delete = async function (request_body) {
  check_parameters(["user_id"], request_body);
};
users.get_all = async function () {
  const query_string = `SELECT * FROM users`;
  return await db_get(query_string);
};
users.get_active = async function (request_body, req) {
  console.log(req.session.user);
  return req.session.user?.user_name;
};

export default users;
