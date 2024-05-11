import { Table, Model, Column, DataType } from "sequelize-typescript";

@Table({
  timestamps: true,
  tableName: "User",
})

export class User extends Model<User> {
  @Column({
    type: DataType.INTEGER,
    primaryKey: true,
    autoIncrement: true
  })
  user__id!: number;

  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  first__name!: string;

  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  last__name!: string;

  @Column({
    type: DataType.STRING,
    allowNull: false,
    unique: true,
  })
  user__email!: string;

  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  password!: string;

  @Column(DataType.STRING)
  resetPasswordToken!: string;

  @Column(DataType.STRING)
  specialty!: string;

  @Column(DataType.STRING)
  role!: string;

  @Column(DataType.STRING)
  status!: string;

}