// models/chatModel.ts
import { Table, Column, Model, ForeignKey, DataType, BelongsTo } from "sequelize-typescript";


@Table({
    timestamps: true,
    tableName: "Contact",
})
export class Contact extends Model<Contact> {
    @Column({
        type: DataType.INTEGER,
        primaryKey: true,
        autoIncrement: true
      })
      contact__id!: number;

      @Column(DataType.STRING)
      recipient__email!: string;


      @Column(DataType.STRING)
      sender__name!: string;
      
      @Column(DataType.STRING)
  sender__email!: string;


  @Column(DataType.STRING)
  message!: string;



}

