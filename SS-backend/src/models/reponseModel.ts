import {
  Table,
  Model,
  Column,
  DataType,
  ForeignKey,
  BelongsTo,
} from "sequelize-typescript";
import { Question } from "./questionModel"; // Import the Question model if it exists

@Table({
  timestamps: true,
  tableName: "Reponse",
})
export class Reponse extends Model<Reponse> {
  @Column({
    type: DataType.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  })
  reponse__id!: number;

  @Column(DataType.STRING)
  reponse__text!: string;

  @Column(DataType.BOOLEAN)
  reponse__statut!: boolean;

  @ForeignKey(() => Question)
  @Column
  question__id!: number;

  @BelongsTo(() => Question)
  question!: Question;
}
