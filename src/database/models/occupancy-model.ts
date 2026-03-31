import { Table, Column, Model, DataType } from 'sequelize-typescript';

@Table({
  tableName: 'occupancies',
  modelName: 'Occupancy',
  timestamps: true,
})
class Occupancy extends Model {
  @Column({
    primaryKey: true,
    type: DataType.UUID,
    defaultValue: DataType.UUIDV4,
  })
  declare id: string;

  // ── Guest Core Info ──
  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  declare fullName: string;

  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  declare phone: string;

  @Column({
    type: DataType.TEXT,
    allowNull: false,
  })
  declare address: string;

  // ── Identity (Photo Only as per our discussion) ──
  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  declare idDocumentImage: string; // URL to the guest's ID photo

  // ── Room & Stay Details ──
  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  declare roomNumber: string; // Specific room assigned on arrival

  @Column({
    type: DataType.DATEONLY,
    allowNull: false,
  })
  declare entryDate: string; // Actual check-in date

  @Column({
    type: DataType.DATEONLY,
    allowNull: false,
  })
  declare exitDate: string; // Expected/Actual check-out (triggers live calc)

  // ── Financial / Live Calculator Fields ──
  @Column({
    type: DataType.ENUM('daily', 'monthly'),
    allowNull: false,
    defaultValue: 'monthly',
  })
  declare billingCycle: string;

  @Column({
    type: DataType.INTEGER,
    allowNull: false,
    defaultValue: 0,
  })
  declare rateAmount: number; // Price per day or per month

  @Column({
    type: DataType.INTEGER,
    allowNull: false,
    defaultValue: 0,
  })
  declare totalPaid: number; // Total amount collected so far (including deposit)

  @Column({
    type: DataType.INTEGER,
    allowNull: true,
    defaultValue: 0,
  })
  declare securityDeposit: number; // Optional refundable deposit

  // ── Status Management ──
  @Column({
    type: DataType.ENUM('active', 'checked-out'),
    allowNull: false,
    defaultValue: 'active',
  })
  declare status: string;

  // ── Metadata ──
  @Column({
    type: DataType.TEXT,
    allowNull: true,
  })
  declare adminNotes: string | null; // For internal admin comments
}

export default Occupancy;