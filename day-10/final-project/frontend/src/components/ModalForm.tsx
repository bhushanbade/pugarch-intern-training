import { useEffect, useState, type FormEvent } from 'react';
import { friendlyError } from '../services/api';

export interface FormField {
  name: string;
  label: string;
  type?: 'text' | 'email' | 'number' | 'date' | 'datetime-local' | 'select' | 'textarea';
  required?: boolean;
  options?: Array<{ value: string | number; label: string }>;
  min?: number;
  max?: number;
  maxLength?: number;
}

export function ModalForm({ title, fields, initial, onSubmit, onClose }: {
  title: string;
  fields: FormField[];
  initial?: Record<string, unknown>;
  onSubmit: (payload: Record<string, unknown>) => Promise<void>;
  onClose: () => void;
}) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  useEffect(() => {
    const handle = (event: KeyboardEvent) => { if (event.key === 'Escape' && !loading) onClose(); };
    window.addEventListener('keydown', handle);
    return () => window.removeEventListener('keydown', handle);
  }, [loading, onClose]);

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const values = new FormData(event.currentTarget);
    const payload: Record<string, unknown> = {};
    for (const field of fields) {
      const value = values.get(field.name);
      if (field.type === 'number') payload[field.name] = value === '' ? null : Number(value);
      else payload[field.name] = value === '' ? null : value;
    }
    setLoading(true);
    setError('');
    try {
      await onSubmit(payload);
    } catch (cause) {
      const errors = (cause as { response?: { data?: { errors?: Record<string, string> } } }).response?.data?.errors;
      setError(errors ? Object.values(errors).flat().join(' ') : friendlyError(cause));
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="modal-backdrop" onMouseDown={(event) => { if (event.target === event.currentTarget && !loading) onClose(); }} role="presentation">
      <section aria-labelledby="form-title" aria-modal="true" className="modal-card" role="dialog">
        <div className="modal-header"><h2 id="form-title">{title}</h2><button aria-label="Close" className="icon-button" disabled={loading} onClick={onClose} type="button">×</button></div>
        <form onSubmit={(event) => void submit(event)}>
          {fields.map((field) => {
            const value = initial?.[field.name];
            const defaultValue = field.type === 'datetime-local' && typeof value === 'string'
              ? value.replace(' ', 'T').slice(0, 16)
              : typeof value === 'string' || typeof value === 'number' ? value : '';
            return (
              <label className="form-field" key={field.name}>
                <span>{field.label}{field.required && <b aria-hidden="true"> *</b>}</span>
                {field.type === 'textarea' ? (
                  <textarea defaultValue={String(defaultValue)} maxLength={field.maxLength} name={field.name} required={field.required} rows={3} />
                ) : field.type === 'select' ? (
                  <select defaultValue={String(defaultValue)} name={field.name} required={field.required}>
                    <option value="">Choose {field.label.toLowerCase()}</option>
                    {field.options?.map((option) => <option key={option.value} value={option.value}>{option.label}</option>)}
                  </select>
                ) : (
                  <input
                    defaultValue={defaultValue}
                    max={field.max}
                    maxLength={field.maxLength}
                    min={field.min}
                    name={field.name}
                    required={field.required}
                    step={field.type === 'number' ? 1 : undefined}
                    type={field.type ?? 'text'}
                  />
                )}
              </label>
            );
          })}
          {error && <p className="form-error" role="alert">{error}</p>}
          <div className="form-actions"><button className="button button-light" disabled={loading} onClick={onClose} type="button">Cancel</button><button className="button button-primary" disabled={loading} type="submit">{loading ? 'Saving…' : 'Save record'}</button></div>
        </form>
      </section>
    </div>
  );
}
