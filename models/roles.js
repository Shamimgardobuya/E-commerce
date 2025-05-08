'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Roles extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Roles.belongsToMany(models.Permissions, { through : models.RolePermission, foreignKey: 'roleId', as: 'permissions_map'});
      Roles.belongsToMany(models.User, { through: models.UserRoles , foreignKey: 'roleId', as: 'User'})
      
    }
  }
  Roles.init({
    role_name: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'Roles',
  });
  return Roles;
};