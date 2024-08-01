// models/chatModel.ts
import { Table, Column, Model, ForeignKey, DataType, BelongsTo } from "sequelize-typescript";


@Table
export class Chat extends Model {
  
  @Column
  senderId!: number;

  @Column
  senderRole!: string;
  
  @Column
  recipientId!: number;


  @Column
  recipientRole!: string;

  @Column
  message!: string;





  @Column(DataType.DATE)
  timestamp!: Date;


}
