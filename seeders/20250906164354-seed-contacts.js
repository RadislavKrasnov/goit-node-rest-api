/** @type {import('sequelize-cli').Migration} */
export async function up({ context }) {
  const { queryInterface } = context;

  await queryInterface.bulkInsert(
    "contacts",
    [
      {
        id: 1,
        name: "Alice Contact 1",
        email: "alice.contact1@example.com",
        phone: "+380501112233",
        favorite: false,
        owner: 1,
      },
      {
        id: 2,
        name: "Alice Contact 2",
        email: "alice.contact2@example.com",
        phone: "+380501112234",
        favorite: true,
        owner: 1,
      },
      {
        id: 3,
        name: "Bob Contact 1",
        email: "bob.contact1@example.com",
        phone: "+380671112233",
        favorite: false,
        owner: 2,
      },
    ],
    {}
  );
}

export async function down({ context }) {
  const { queryInterface } = context;
  await queryInterface.bulkDelete("contacts", { id: [1, 2, 3] }, {});
}
