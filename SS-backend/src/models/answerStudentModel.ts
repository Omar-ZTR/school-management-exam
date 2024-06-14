
import {
  Table,
  Model,
  Column,
  DataType,
  ForeignKey,
  BelongsTo,
} from "sequelize-typescript";
import { Question } from "./questionModel";
import { Answer } from "./answerModel";

@Table({
  timestamps: true,
  tableName: "AnswerStudent",
})
export class AnswerStudent extends Model<AnswerStudent> {
  @Column({
      type: DataType.INTEGER,
      primaryKey: true,
      autoIncrement: true,
  })
  Answer__id!: number;

  @Column({
      type: DataType.STRING,
      allowNull: true
  })
  Answer__text!: string;

  @ForeignKey(() => Answer)
  @Column({
      type: DataType.INTEGER,
      allowNull: false
  })
  ans__id!: number;

  @BelongsTo(() => Answer)
  answer!: Answer;

  @ForeignKey(() => Question)
  @Column({
      type: DataType.INTEGER,
      allowNull: false
  })
  question__id!: number;

  @BelongsTo(() => Question)
  question!: Question;
}
