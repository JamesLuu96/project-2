// import all models
const User = require("./User");
const Room = require("./Room");
const Type = require("./Type");
const Chat = require("./Chat");

// create associations
User.hasMany(Room, {
	foreignKey: "user_id",
});

Room.belongsTo(User, {
	foreignKey: "user_id",
	onDelete: "SET NULL",
});

Type.hasMany(Room, {
	foreignKey: "type_id",
});

Room.belongsTo(Type, {
	foreignKey: "type_id",
});

Room.belongsTo(User, {
  foreignKey: "user_id",
  onDelete: "SET NULL",
});
// onDelete:"CASCADE",onUpdate:"CASCADE"

User.belongsToMany(Room, { through: { model: Chat, unique: false }, });
Room.belongsToMany(User, { through: { model: Chat, unique: false }} );
// Chat.belongsTo(User, {
// 	foreignKey: "user_id",
//   });
//   Chat.belongsTo(Room, {
// 	foreignKey: "room_id",
//   });
//   User.hasMany(Chat, {
// 	foreignKey: "user_id",
//   });
  
//   Room.hasMany(Chat, {
// 	foreignKey: "room_id",
//   });

module.exports = { User, Room, Type,Chat };
