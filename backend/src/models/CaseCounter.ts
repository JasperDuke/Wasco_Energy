import { Schema, model } from 'mongoose';

const caseCounterSchema = new Schema({
  _id: { type: String, required: true },
  seq: { type: Number, default: 0 },
});

export const CaseCounter = model('CaseCounter', caseCounterSchema);
