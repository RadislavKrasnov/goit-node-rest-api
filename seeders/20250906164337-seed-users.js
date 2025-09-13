import bcrypt from "bcryptjs";

/** @type {import('sequelize-cli').Migration} */
export async function up({ context }) {
  const { queryInterface } = context;

  const password1 = bcrypt.hashSync("password123", 10);
  const password2 = bcrypt.hashSync("supersecret", 10);

  await queryInterface.bulkInsert(
    "users",
    [
      {
        id: 1,
        email: "alice@example.com",
        password: password1,
        subscription: "starter",
        token: null,
      },
      {
        id: 2,
        email: "bob@example.com",
        password: password2,
        subscription: "pro",
        token: null,
      },
    ],
    {}
  );
}

export async function down({ context }) {
  const { queryInterface } = context;
  await queryInterface.bulkDelete("users", { id: [1, 2] }, {});
}
