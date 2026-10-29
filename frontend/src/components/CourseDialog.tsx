import { useQueryClient } from '@tanstack/react-query';
import { useState } from 'react';
import { api } from '../api/client';
import type { Course } from '../api/types';
import { useToast } from '../context/ToastContext';
import { Modal } from './Modal';

export const PALETTE = ['#0056d2', '#0e7c66', '#7a3fc4', '#c2570c', '#b4234f', '#2b6cb0', '#4a5568'];

interface Props {
  existing?: Pick<Course, 'id' | 'name' | 'description' | 'color' | 'instructor' | 'instructor_title'>;
  onSaved?: (course: Course) => void;
  onClose: () => void;
}

export function CourseDialog({ existing, onSaved, onClose }: Props) {
  const toast = useToast();
  const qc = useQueryClient();
  const [name, setName] = useState(existing?.name ?? '');
  const [description, setDescription] = useState(existing?.description ?? '');
  const [color, setColor] = useState(existing?.color ?? PALETTE[0]);
  const [instructor, setInstructor] = useState(existing?.instructor ?? '');
  const [instructorTitle, setInstructorTitle] = useState(existing?.instructor_title ?? '');

  return (
    <Modal
      title={existing ? 'Edit course' : 'Create a course'}
      onClose={onClose}
      actions={[
        { label: 'Cancel', className: 'btn-ghost' },
        {
          label: existing ? 'Save changes' : 'Create course',
          className: 'btn-primary',
          onClick: async () => {
            if (!name.trim()) {
              toast('Please enter a course name', 'error');
              return false;
            }
            try {
              const body = { name, description, color, instructor, instructor_title: instructorTitle };
              const res = existing ? await api.put<Course>(`/api/courses/${existing.id}`, body) : await api.post<Course>('/api/courses', body);
              toast(existing ? 'Course updated' : 'Course created', 'success');
              await qc.invalidateQueries();
              onSaved?.(res);
            } catch (e) {
              toast((e as Error).message, 'error');
              return false;
            }
          },
        },
      ]}
    >
      <div className="field">
        <label>Course name</label>
        <input className="input" placeholder="e.g. Biology 101" value={name} onChange={(e) => setName(e.target.value)} />
      </div>
      <div className="field">
        <label>Description</label>
        <textarea className="input" rows={3} placeholder="What is this course about?" value={description} onChange={(e) => setDescription(e.target.value)} />
      </div>
      <div className="field">
        <label>Instructor</label>
        <input className="input" placeholder="e.g. Dr. Anita Sharma" value={instructor} onChange={(e) => setInstructor(e.target.value)} />
      </div>
      <div className="field">
        <label>Instructor title and department</label>
        <input className="input" placeholder="e.g. Associate Professor, Department of Life Sciences" value={instructorTitle} onChange={(e) => setInstructorTitle(e.target.value)} />
      </div>
      <div className="field">
        <label>Colour</label>
        <div className="swatches">
          {PALETTE.map((c) => (
            <div key={c} className={'swatch' + (c === color ? ' on' : '')} style={{ background: c }} role="button" tabIndex={0} onClick={() => setColor(c)} />
          ))}
        </div>
      </div>
    </Modal>
  );
}
