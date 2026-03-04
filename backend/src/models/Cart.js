module.exports = (sequelize, DataTypes) => {
  const Cart = sequelize.define('Cart', {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    sessionId: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    userId: {
      type: DataTypes.UUID,
      allowNull: true,
      references: {
        model: 'Users',
        key: 'id',
      },
    },
  }, {
    tableName: 'carts',
    timestamps: true,
  });

  Cart.associate = (models) => {
    Cart.belongsTo(models.User, {
      foreignKey: 'userId',
      as: 'user',
    });
    Cart.hasMany(models.CartItem, {
      foreignKey: 'cartId',
      as: 'items',
    });
  };

  return Cart;
};
