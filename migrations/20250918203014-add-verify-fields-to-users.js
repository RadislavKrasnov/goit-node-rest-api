'use strict';

/** @type {import('sequelize-cli').Migration} */
export const up = async ({ context }) => {
  const { queryInterface, DataTypes } = context;
  await queryInterface.addColumn(
    "users",
    "verify",
    {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false,
    },
  );

  await queryInterface.addColumn(
    "users",
    "verificationToken",
    {
      type: DataTypes.STRING,
      allowNull: true,
    }
  );
};

export const down = async ({ context }) => {
  const { queryInterface } = context;
  await queryInterface.removeColumn(
    "users",
    "verificationToken",
  );
  await queryInterface.removeColumn(
    "users",
    "verify",
  );
};
