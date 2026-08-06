import { DynamicForm, IDynamicForm, IFormField } from '../models/DynamicForm';
import { AppError } from '../utils/AppError';

export interface CreateFormInput {
  name: string;
  description?: string;
  fields: IFormField[];
}

export interface UpdateFormInput {
  name?: string;
  description?: string;
  fields?: IFormField[];
  isActive?: boolean;
}

export interface FormResponse {
  id: string;
  name: string;
  description?: string;
  fields: IFormField[];
  isActive: boolean;
  version: number;
  createdAt: Date;
  updatedAt: Date;
}

function toFormResponse(form: IDynamicForm): FormResponse {
  return {
    id: form._id.toString(),
    name: form.name,
    description: form.description,
    fields: form.fields.sort((a, b) => a.order - b.order),
    isActive: form.isActive,
    version: form.version,
    createdAt: form.createdAt,
    updatedAt: form.updatedAt,
  };
}

function validateFieldKeys(fields: IFormField[]): void {
  const keys = fields.map((f) => f.key);
  const uniqueKeys = new Set(keys);
  if (keys.length !== uniqueKeys.size) {
    throw new AppError('Field keys must be unique', 400);
  }
}

export async function createForm(
  input: CreateFormInput,
  createdBy: string
): Promise<FormResponse> {
  validateFieldKeys(input.fields);

  const form = await DynamicForm.create({
    ...input,
    createdBy,
    version: 1,
  });

  return toFormResponse(form);
}

export async function getAllForms(): Promise<FormResponse[]> {
  const forms = await DynamicForm.find().sort({ createdAt: -1 });
  return forms.map(toFormResponse);
}

export async function getFormById(formId: string): Promise<FormResponse> {
  const form = await DynamicForm.findById(formId);
  if (!form) {
    throw new AppError('Form not found', 404);
  }
  return toFormResponse(form);
}

export async function getActiveForm(): Promise<FormResponse | null> {
  const form = await DynamicForm.findOne({ isActive: true }).sort({
    version: -1,
  });
  return form ? toFormResponse(form) : null;
}

export async function updateForm(
  formId: string,
  input: UpdateFormInput
): Promise<FormResponse> {
  const form = await DynamicForm.findById(formId);
  if (!form) {
    throw new AppError('Form not found', 404);
  }

  if (input.fields) {
    validateFieldKeys(input.fields);
  }

  if (input.name !== undefined) form.name = input.name;
  if (input.description !== undefined) form.description = input.description;
  if (input.fields !== undefined) form.fields = input.fields;
  if (input.isActive !== undefined) form.isActive = input.isActive;

  form.version += 1;
  await form.save();

  return toFormResponse(form);
}

export async function deleteForm(formId: string): Promise<void> {
  const form = await DynamicForm.findByIdAndDelete(formId);
  if (!form) {
    throw new AppError('Form not found', 404);
  }
}
