import { Table, Model, Column, DataType, HasMany, ForeignKey, BelongsTo } from "sequelize-typescript";
import { Question } from "./questionModel";
import { Exam } from "./examModel";
import { User } from "./User__model";
import { Reponse } from "./reponseModel";
import { AnswerStudent } from "./answerStudentModel";
import { FileAnswer } from "./fileModel";
import { Student } from "./studentModel";

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

    @ForeignKey(() => Exam)
    @Column({
        type: DataType.INTEGER,
        allowNull: false
    })
    exam__id!: number;
  
    @BelongsTo(() => Exam)
    exam!: Exam;

    @ForeignKey(() => Student)

    @Column({
        type: DataType.INTEGER,
        allowNull: false
    })
    Student__id!: number;


    @BelongsTo(() => Student)
    student!: Student;

    @HasMany(() => AnswerStudent)
    answers!: AnswerStudent[];

    @HasMany(() => FileAnswer)
    file!: FileAnswer[];

    @Column(DataType.STRING)
    ans__descreption!: string;

    @Column(DataType.INTEGER)
    ans__result!: number;
  FileAnswers: any;
}
