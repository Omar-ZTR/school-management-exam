import { Table, Model, Column, DataType, HasMany, ForeignKey, BelongsTo } from "sequelize-typescript";
import { Question } from "./questionModel";
import { Exam } from "./examModel";
import { User } from "./User__model";
import { Reponse } from "./reponseModel";
import { AnswerStudent } from "./answerStudentModel";


@Table({
    timestamps: true,
    tableName: "Answer",
})
export class Answer extends Model<Answer> {

    @Column({
        type: DataType.INTEGER,
        primaryKey: true,
        autoIncrement: true
    })
    ans__id!: number;

    @Column(DataType.NUMBER)
    exam__id!: number;

    @Column(DataType.NUMBER)
    Student__id!: number;

    @HasMany(() => AnswerStudent)
   answers!: AnswerStudent[];

    @Column(DataType.STRING)
    ans__filePath!: string;

}