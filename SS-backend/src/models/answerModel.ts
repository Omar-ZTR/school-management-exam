import { Table, Model, Column, DataType, HasMany, ForeignKey, BelongsTo } from "sequelize-typescript";
import { Question } from "./questionModel";
import { Exam } from "./examModel";
import { User } from "./User__model";


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
    @Column
    exam__id!: number;

    @BelongsTo(() => Exam)
    exam!: Exam;

    @ForeignKey(() => User)
    @Column
    user__id!: number;

    @BelongsTo(() => User)
    user!: User;

    @ForeignKey(() => Question)
    @Column
    questiom__id!: number;

    @BelongsTo(() => Question)
    question!: Exam;

    @Column(DataType.STRING)
    ans__value!: string;

    @Column(DataType.STRING)
    ans__filePath!: string;

}