import { Table, Model, Column, DataType, ForeignKey, BelongsTo } from "sequelize-typescript";
import { Exam } from "./examModel";
import { User } from "./User__model";
import { Salle } from "./salleModel";

@Table({
    timestamps: true,
    tableName: "Reservation",
})
export class Reservation extends Model<Reservation> {

    @Column({
        type: DataType.INTEGER,
        primaryKey: true,
        autoIncrement: true
    })
    reserv__id!: number;

    @ForeignKey(() => Exam)
    @Column
    exam__id!: number;

    @BelongsTo(() => Exam)
    exam!: Exam;

    @ForeignKey(() => User)
    @Column
    User__id!: number;

    @BelongsTo(() => User)
    User!: User;

    @ForeignKey(() => Salle)
    @Column
    salle__id!: number;

    @BelongsTo(() => Salle)
    salle!: Salle;

    @Column(DataType.DATEONLY)
    date!: Date;

    @Column(DataType.TIME)
    Timing!: string;

    @Column(DataType.TIME)
    time!: string;
    
}
