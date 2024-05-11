import { Table, Model, Column, DataType, HasMany, ForeignKey, BelongsTo } from "sequelize-typescript";

import { Answer } from "./answerModel";
import { User } from "./User__model";


@Table({
    timestamps: true,
    tableName: "Result",
})
export class Result extends Model<Result> {

    @Column({
        type: DataType.INTEGER,
        primaryKey: true,
        autoIncrement: true
    })
    result__id!: number;

    @ForeignKey(() => Answer)
    @Column
    ans__id!: number;

    @BelongsTo(() => Answer)
    answer!: Answer;

    @ForeignKey(() => User)
    @Column
    user__id!: number;

    @BelongsTo(() => User)
    User!: User;

    @Column(DataType.STRING)
    note!: string;

}