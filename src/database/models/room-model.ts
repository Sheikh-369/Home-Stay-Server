import { Table, Column, Model, DataType } from 'sequelize-typescript';

@Table({
  tableName: 'rooms',
  modelName: 'Room',
  timestamps: true,
})
class Room extends Model {
  @Column({
    primaryKey: true,
    type: DataType.UUID,
    defaultValue: DataType.UUIDV4,
  })
  declare id: string;

  @Column({
    type: DataType.STRING,
    allowNull: false,
    unique: true,
  })
  declare roomNumber: string;

  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  declare floor: string;

  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  declare roomType: string;

  @Column({
    type: DataType.INTEGER,
    allowNull: false,
    defaultValue: 1,
  })
  declare capacity: number;

  @Column({
    type: DataType.JSON,
    allowNull: false,
    defaultValue: [],
    // Renamed from 'amenities' to 'features'
  })
  declare features: string[];

  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  declare rent: string;

  @Column({
    type: DataType.ENUM('Occupied', 'Vacant'),
    allowNull: false,
    defaultValue: 'Vacant',
  })
  declare status: 'Occupied' | 'Vacant';
}

export default Room;