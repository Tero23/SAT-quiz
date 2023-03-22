const bcrypt = require("bcrypt");

module.exports = (sequelize, DataTypes) => {
  const user = sequelize.define(
    "user",
    {
      id: {
        allowNull: false,
        primaryKey: true,
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
      },
      username: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
      },
      password: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          len: [10, 100],
        },
      },
      scores: {
        type: DataTypes.JSON,
        defaultValue: [],
      },
      randomNums: {
        type: DataTypes.JSON,
        defaultValue: [],
      },
      createdAt: {
        allowNull: false,
        type: DataTypes.DATE,
      },
      updatedAt: {
        allowNull: false,
        type: DataTypes.DATE,
      },
    },
    {
      paranoid: true,
    }
  );

  user.beforeCreate(async (user, options) => {
    const hashedPassword = await bcrypt.hash(user.password, 10);
    user.password = hashedPassword;
  });

  return user;
};
