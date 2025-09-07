"use strict";

/** @type {import('sequelize-cli').Migration} */

export async function up({ context }) {
  const { queryInterface, DataTypes } = context;
  await queryInterface.createTable("users", {
    id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    subscription: {
      type: DataTypes.ENUM("starter", "pro", "business"),
      allowNull: false,
      defaultValue: "starter",
    },
    token: {
      type: DataTypes.STRING,
      defaultValue: null,
    },
  });
}

export async function down({ context }) {
  const { queryInterface } = context;
  await queryInterface.dropTable("users");
  if (queryInterface.sequelize.getDialect() === "postgres") {
    await queryInterface.sequelize.query(
      'DROP TYPE IF EXISTS "enum_users_subscription";'
    );
  }
}
