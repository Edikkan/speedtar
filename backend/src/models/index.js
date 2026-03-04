const { Sequelize, DataTypes } = require('sequelize');

const sequelize = require('../config/database');

const db = {};

db.sequelize = sequelize;
db.Sequelize = Sequelize;

// Import models
db.User = require('./User')(sequelize, DataTypes);
db.Product = require('./Product')(sequelize, DataTypes);
db.Category = require('./Category')(sequelize, DataTypes);
db.Order = require('./Order')(sequelize, DataTypes);
db.OrderItem = require('./OrderItem')(sequelize, DataTypes);
db.Cart = require('./Cart')(sequelize, DataTypes);
db.CartItem = require('./CartItem')(sequelize, DataTypes);
db.Review = require('./Review')(sequelize, DataTypes);
db.PaymentMethod = require('./PaymentMethod')(sequelize, DataTypes);

// Define associations
Object.keys(db).forEach((modelName) => {
  if (db[modelName].associate) {
    db[modelName].associate(db);
  }
});

module.exports = db;
