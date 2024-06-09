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
    tableName: "AnswerStudent",
  })
  export class AnswerStudent extends Model<AnswerStudent> {
    @Column({
      type: DataType.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    })
    Answer__id!: number;
  
    @Column(DataType.STRING)
    Answer__text!: string;
  
  
    @ForeignKey(() => Question)
    @Column
    question__id!: number;
  
    @BelongsTo(() => Question)
    question!: Question;
  }
  