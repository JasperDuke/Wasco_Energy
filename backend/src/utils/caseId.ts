import { CaseCounter } from '../models/CaseCounter';

export async function generateCaseId(): Promise<string> {
  const counter = await CaseCounter.findByIdAndUpdate(
    'application',
    { $inc: { seq: 1 } },
    { new: true, upsert: true }
  );
  const seq = counter?.seq ?? 1;
  return `WASCO-VQ-${String(seq).padStart(6, '0')}`;
}
