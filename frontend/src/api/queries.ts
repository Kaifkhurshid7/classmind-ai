import { useQuery } from '@tanstack/react-query';
import { api } from './client';
import type { Analytics, Course, CourseDetail, LectureDetail, LectureSummary, Overview } from './types';

export const keys = {
  status: ['status'] as const,
  overview: ['overview'] as const,
  courses: ['courses'] as const,
  course: (id: string) => ['course', id] as const,
  lectures: (q: string, course: string) => ['lectures', q, course] as const,
  lecture: (id: string) => ['lecture', id] as const,
  analytics: ['analytics'] as const,
};

export const useStatus = () =>
  useQuery({ queryKey: keys.status, queryFn: () => api.get<{ ai: boolean; model: string | null }>('/api/status'), staleTime: Infinity });

export const useOverview = () => useQuery({ queryKey: keys.overview, queryFn: () => api.get<Overview>('/api/overview') });

export const useCourses = () => useQuery({ queryKey: keys.courses, queryFn: () => api.get<Course[]>('/api/courses') });

export const useCourse = (id: string) => useQuery({ queryKey: keys.course(id), queryFn: () => api.get<CourseDetail>(`/api/courses/${id}`) });

export const useLectures = (q: string, course: string) =>
  useQuery({
    queryKey: keys.lectures(q, course),
    queryFn: () => {
      const params = new URLSearchParams();
      if (q) params.set('q', q);
      if (course) params.set('course', course);
      return api.get<LectureSummary[]>(`/api/lectures?${params}`);
    },
  });

export const useLecture = (id: string) => useQuery({ queryKey: keys.lecture(id), queryFn: () => api.get<LectureDetail>(`/api/lectures/${id}`) });

export const useAnalytics = () => useQuery({ queryKey: keys.analytics, queryFn: () => api.get<Analytics>('/api/analytics') });
