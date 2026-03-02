import React, { useState, useEffect } from 'react';
import api from '../../services/api';

const MyCourses = () => {
  const [courses, setCourses] = useState({ 1: [], 2: [], 3: [], 4: [] });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchCourses();
  }, []);

  const fetchCourses = async () => {
    try {
      const response = await api.get('/courses/');
      const coursesByPart = { 1: [], 2: [], 3: [], 4: [] };
      response.data.forEach((course) => {
        if (coursesByPart[course.part_number]) {
          coursesByPart[course.part_number].push(course);
        }
      });
      setCourses(coursesByPart);
    } catch (error) {
      console.error('Error fetching courses:', error);
    } finally {
      setLoading(false);
    }
  };

  const getPartLabel = (part) => ['Partie 1', 'Partie 2', 'Partie 3', 'Partie 4'][part - 1];

  return (
    <div>
      <div className="page-header">
        <h1 className="page-title">Mes Cours</h1>
      </div>
      <div className="page-content">
        {loading ? <p>Chargement...</p> : (
          <div className="part-grid">
            {[1, 2, 3, 4].map((part) => (
              <div key={part} className="part-card">
                <div className="part-header">{getPartLabel(part)}</div>
                <div className="part-body">
                  {courses[part].length === 0 ? (
                    <p style={{ color: '#6B7280', textAlign: 'center', padding: '20px' }}>Aucun cours disponible</p>
                  ) : (
                    courses[part].map((course) => (
                      <div key={course.id} className="part-item">
                        <div className="part-item-icon">
                          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="18" height="18">
                            <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2zM22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z" />
                          </svg>
                        </div>
                        <div className="part-item-content">
                          <div className="part-item-title">{course.title}</div>
                          {course.description && (
                            <p style={{ fontSize: '12px', color: '#6B7280', marginTop: '4px' }}>{course.description}</p>
                          )}
                          {course.content && (
                            <div style={{ fontSize: '12px', color: '#374151', marginTop: '8px', maxHeight: '60px', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                              {course.content.substring(0, 150)}...
                            </div>
                          )}
                          <div style={{ marginTop: '8px', display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                            {course.file && (
                              <a href={course.file} target="_blank" rel="noopener noreferrer" className="btn btn-sm btn-info">
                                Télécharger le cours
                              </a>
                            )}
                          </div>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default MyCourses;
