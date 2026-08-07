import { Schema, model, Document, Types } from 'mongoose';
import { FieldType } from '../types';

export interface IFormField {
  label: string;
  key: string;
  type: FieldType;
  placeholder?: string;
  required: boolean;
  options?: string[];
  acceptedFileTypes?: string[];
  maxFileSize?: number;
  /** Category sent to Atenxion as document_type (defaults to label) */
  documentType?: string;
  /** VendorProfile field to sync on submit (e.g. vendorGroup) */
  vendorField?: string;
  order: number;
  helpText?: string;
}

export interface IDynamicForm extends Document {
  _id: Types.ObjectId;
  name: string;
  description?: string;
  fields: IFormField[];
  isActive: boolean;
  version: number;
  createdBy: Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

const formFieldSchema = new Schema<IFormField>(
  {
    label: { type: String, required: true, trim: true },
    key: { type: String, required: true, trim: true },
    type: {
      type: String,
      enum: [
        'text',
        'textarea',
        'email',
        'website',
        'phone',
        'number',
        'dropdown',
        'radio',
        'checkbox',
        'date',
        'file',
      ],
      required: true,
    },
    placeholder: { type: String, trim: true },
    required: { type: Boolean, default: false },
    options: [{ type: String }],
    acceptedFileTypes: [{ type: String }],
    maxFileSize: { type: Number },
    documentType: { type: String, trim: true },
    vendorField: { type: String, trim: true },
    order: { type: Number, required: true },
    helpText: { type: String, trim: true },
  },
  { _id: true }
);

const dynamicFormSchema = new Schema<IDynamicForm>(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      trim: true,
    },
    fields: [formFieldSchema],
    isActive: {
      type: Boolean,
      default: true,
    },
    version: {
      type: Number,
      default: 1,
    },
    createdBy: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
  },
  { timestamps: true }
);

dynamicFormSchema.index({ isActive: 1 });

export const DynamicForm = model<IDynamicForm>('DynamicForm', dynamicFormSchema);
