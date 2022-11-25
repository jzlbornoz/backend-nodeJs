const { DataTypes, Sequelize, Model } = require("sequelize");
const {COSTUMERS_TABLE} = require("./costumers.model")

const ORDER_TABLE = 'orders';

const OrderSchema = {
	id: {
		allowNull: false,
		autoIncrement: true,
		primaryKey: true,
		type: DataTypes.INTEGER,
	},
	costumerId: {
		field: 'costumer_id',
		allowNull: false,
		type: DataTypes.INTEGER,
		References: {
			model: COSTUMERS_TABLE,
			key: 'id',
		},
		onUpdate: 'CASCADE',
		onDelete: 'SET NULL',
	},
	createdAt: {
		allowNull: false,
		type: DataTypes.DATE,
		field: 'created_at',
		defaultValue: Sequelize.NOW,
	},
};

class Order extends Model {
	static associate(models) {
		this.belongsTo(models.Costumer, {
			as: 'costumer',
		});
	}

	static config(sequelize) {
		return {
			sequelize,
			tableName: ORDER_TABLE,
			modelName: 'Order',
			timestamps: false,
		};
	}
}

module.exports = { Order, OrderSchema, ORDER_TABLE };