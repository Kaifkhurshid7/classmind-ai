import { Link, Route, Routes } from 'react-router-dom';
import { EmptyState } from './components/Common';
import { Layout } from './components/Layout';
import { Analytics } from './pages/Analytics';
import { CoursePage } from './pages/Course';
import { Dashboard } from './pages/Dashboard';
import { Library } from './pages/Library';
import { LecturePage } from './pages/lecture/LecturePage';
import { Studio } from './pages/Studio';

function NotFound() {
  return (
    <div className="container page">
      <div className="card">
        <EmptyState
          icon="search"
          title="Page not found"
          action={
            <Link className="btn btn-primary" to="/">
              Back to home
            </Link>
          }
        />
      </div>
    </div>
  );
}

export default function App() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route index element={<Dashboard />} />
        <Route path="library" element={<Library />} />
        <Route path="course/:id" element={<CoursePage />} />
        <Route path="lecture/:id" element={<LecturePage />} />
        <Route path="record" element={<Studio />} />
        <Route path="analytics" element={<Analytics />} />
        <Route path="*" element={<NotFound />} />
      </Route>
    </Routes>
  );
}
