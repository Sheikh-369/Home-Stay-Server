import { Table, Column, Model, DataType } from 'sequelize-typescript';

@Table({
  tableName: 'bookings',
  modelName: 'Booking',
  timestamps: true,
})
class Booking extends Model {
  @Column({
    primaryKey: true,
    type: DataType.UUID,
    defaultValue: DataType.UUIDV4,
  })
  declare id: string;

  // ── Personal Info ──
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
    type: DataType.STRING,
    allowNull: false,
  })
  declare email: string;

  @Column({
    type: DataType.TEXT,
    allowNull: false,
  })
  declare address: string;

  // ── Emergency Contact ──
  @Column({
    type: DataType.STRING,
    allowNull: true,
  })
  declare emergencyName: string | null;

  @Column({
    type: DataType.STRING,
    allowNull: true,
  })
  declare emergencyPhone: string | null;

  // ── Identity Details ──
  @Column({
    type: DataType.ENUM('citizenship', 'passport', 'license', 'national-id'),
    allowNull: false,
  })
  declare idType: string;

  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  declare idDocumentImage: string; // uploaded file URL/path

  // ── Stay Details ──
  @Column({
    type: DataType.DATEONLY,
    allowNull: false,
  })
  declare entryDate: string;

  @Column({
    type: DataType.DATEONLY,
    allowNull: false,
  })
  declare exitDate: string;

  @Column({
    type: DataType.ENUM('single', 'double-sharing', 'triple-sharing'),
    allowNull: false,
  })
  declare roomPreference: string;

  @Column({
    type: DataType.INTEGER,
    allowNull: false,
  })
  declare numberOfOccupants: number;

  @Column({
    type: DataType.ENUM('student', 'job', 'other', 'abroad-processing'),
    allowNull: false,
  })
  declare purposeOfStay: string;

  // ── Payment Details ──
  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  declare paymentProofImage: string; // screenshot/receipt URL

  @Column({
    type: DataType.INTEGER,
    allowNull: false,
    defaultValue: 1000,
  })
  declare advanceAmount: number;

  @Column({
    type: DataType.ENUM('pending', 'verified', 'rejected'),
    allowNull: false,
    defaultValue: 'pending',
  })
  declare paymentStatus: string;

  // ── Booking Status ──
  @Column({
    type: DataType.ENUM('pending', 'confirmed', 'cancelled'),
    allowNull: false,
    defaultValue: 'pending',
  })
  declare bookingStatus: string;

  // ── Additional Info ──
  @Column({
    type: DataType.TEXT,
    allowNull: true,
  })
  declare message: string | null;

  @Column({
    type: DataType.BOOLEAN,
    allowNull: false,
  })
  declare agreeToTerms: boolean;

  // ── Metadata ──
  @Column({
    type: DataType.DATE,
    allowNull: false,
    defaultValue: DataType.NOW,
  })
  declare submittedAt: Date;
}

export default Booking;