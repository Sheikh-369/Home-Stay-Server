import { Table, Column, Model, DataType } from 'sequelize-typescript';

@Table({
  tableName: 'messages',
  modelName: 'Message',
  timestamps: true, 
})
class ContactMessage extends Model {
  @Column({
    primaryKey: true,
    type: DataType.UUID,
    defaultValue: DataType.UUIDV4,
  })
  declare id: string;

  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  declare name: string;

  @Column({
    type: DataType.STRING,
    allowNull: false,
    validate: {
      isEmail: true,
    },
  })
  declare email: string;

  @Column({
    type: DataType.STRING,
    allowNull: true,
  })
  declare phone: string | null;

  @Column({
    type: DataType.STRING,
    allowNull: false,
    defaultValue: 'General Inquiry', // Fallback if no subject is provided
  })
  declare subject: string;

  @Column({
    type: DataType.TEXT,
    allowNull: false,
  })
  declare message: string;
}

export default ContactMessage;