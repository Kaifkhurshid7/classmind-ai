import { useQueryClient } from '@tanstack/react-query';
import { useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { api } from '../api/client';
import { useCourse } from '../api/queries';
import { Async, Breadcrumb, EmptyState, LectureRow } from '../components/Common';
import { CourseDialog } from '../components/CourseDialog';
import { Icon } from '../components/Icon';
import { useConfirm } from '../components/Modal';
import { useToast } from '../context/ToastContext';
import { fmtDur } from '../lib/format';

export function CoursePage() {
  const { id = '' } = useParams();
  const course = useCourse(id);
  const navigate = useNavigate();
  const toast = useToast();
  const confirm = useConfirm();
  const qc = useQueryClient();
  const [editing, setEditing] = useState(false);

  return (
    <Async query={course}>
      {(c) => (
        <div>
          <section className="banner" style={{ background: c.color }}>
            <div className="container">
              <Breadcrumb items={[{ label: 'Home', to: '/' }, { label: 'Course' }]} />
              <div className="xs" style={{ letterSpacing: '.1em', opacity: 0.85 }}>
                COURSE
              </div>
              <h1>{c.name}</h1>
              <p>{c.description || 'Lectures recorded for this course.'}</p>
              <div className="banner-stats">
                <div>
                  <b>{c.lectures.length}</b>
                  <span>Lectures</span>
                </div>
                <div>
                  <b>{fmtDur(c.minutes * 60)}</b>
                  <span>Recorded</span>
                </div>
                <div>
                  <b>{c.avg === null ? '–' : c.avg + '%'}</b>
                  <span>Quiz average</span>
                </div>
                <div>
                  <b>{c.progress}%</b>
                  <span>Practised</span>
                </div>
              </div>
              <div className="row wrap mt-24 teacher-only">
                <Link className="btn btn-light" to={`/record?course=${c.id}`}>
                  <Icon name="mic" size={18} />
                  Record a lecture
                </Link>
                <button className="btn btn-outline" onClick={() => setEditing(true)}>
                  <Icon name="edit" size={16} />
                  Edit course
                </button>
                <button
                  className="btn btn-outline"
                  onClick={async () => {
                    if (await confirm({ title: 'Delete course?', message: 'The course will be removed. Its lectures are kept and become uncategorised.' })) {
                      await api.del(`/api/courses/${c.id}`);
                      await qc.invalidateQueries();
                      toast('Course deleted');
                      navigate('/');
                    }
                  }}
                >
                  <Icon name="trash" size={16} />
                  Delete
                </button>
              </div>
            </div>
          </section>

          <div className="container page">
            <div className="section-head">
              <h2>Course content</h2>
            </div>
            {c.lectures.length ? (
              <div className="card">
                {c.lectures.map((l) => (
                  <LectureRow key={l.id} lecture={l} />
                ))}
              </div>
            ) : (
              <div className="card">
                <EmptyState
                  icon="mic"
                  title="No lectures in this course"
                  text="Record the first lecture and it will appear here."
                  action={
                    <Link className="btn btn-primary teacher-only" to={`/record?course=${c.id}`}>
                      Record a lecture
                    </Link>
                  }
                />
              </div>
            )}
          </div>
          {editing && <CourseDialog existing={c} onClose={() => setEditing(false)} />}
        </div>
      )}
    </Async>
  );
}
