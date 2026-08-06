import api from './api';
import { ApiResponse, DynamicForm, FormField } from '@/types';

export interface CreateFormInput {
  name: string;
  description?: string;
  fields: FormField[];
}

export interface UpdateFormInput {
  name?: string;
  description?: string;
  fields?: FormField[];
  isActive?: boolean;
}

export const formService = {
  async getAll(): Promise<DynamicForm[]> {
    const { data } = await api.get<ApiResponse<{ forms: DynamicForm[] }>>('/forms');
    return data.data!.forms;
  },

  async getById(id: string): Promise<DynamicForm> {
    const { data } = await api.get<ApiResponse<{ form: DynamicForm }>>(`/forms/${id}`);
    return data.data!.form;
  },

  async getActive(): Promise<DynamicForm | null> {
    const { data } = await api.get<ApiResponse<{ form: DynamicForm | null }>>(
      '/forms/active'
    );
    return data.data!.form;
  },

  async create(input: CreateFormInput): Promise<DynamicForm> {
    const { data } = await api.post<ApiResponse<{ form: DynamicForm }>>('/forms', input);
    return data.data!.form;
  },

  async update(id: string, input: UpdateFormInput): Promise<DynamicForm> {
    const { data } = await api.put<ApiResponse<{ form: DynamicForm }>>(
      `/forms/${id}`,
      input
    );
    return data.data!.form;
  },

  async delete(id: string): Promise<void> {
    await api.delete(`/forms/${id}`);
  },
};
