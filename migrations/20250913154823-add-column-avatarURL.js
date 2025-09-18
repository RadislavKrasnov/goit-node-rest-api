"use strict";

/** @type {import('sequelize-cli').Migration} */
export const up = async ({ context }) => {
  const { queryInterface, DataTypes } = context;
  await queryInterface.addColumn("users", "avatarURL", {
    type: DataTypes.STRING,
    allowNull: true,
  });
};

export const down = async ({ context }) => {
  const { queryInterface } = context;
  await queryInterface.removeColumn("users", "avatarURL");
};
