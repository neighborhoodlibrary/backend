exports.up = function(knex) {
  return knex.schema.createTable("users", user => {
    user.increments("id").primary();
    user
      .string("email")
      .unique()
      .notNullable();
    user.string("password").notNullable();
  });
};

exports.down = function(knex) {
  return knex.schema.dropTableIfExists("users");
};
