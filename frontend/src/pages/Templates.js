function Templates() {
  const templates = [
    { id: 1, name: 'Student Exam Week', category: 'Study' },
    { id: 2, name: 'Gym Routine', category: 'Fitness' },
    { id: 3, name: 'Work From Home', category: 'Work' },
  ];
  
  return (
    <div style={{ padding: '24px' }}>
      <h1>Templates</h1>
      <div style={{ display: 'grid', gap: '16px' }}>
        {templates.map(template => (
          <div key={template.id} style={{ background: 'white', padding: '16px', borderRadius: '8px' }}>
            <h3>{template.name}</h3>
            <span>{template.category}</span>
            <button>Use Template</button>
          </div>
        ))}
      </div>
    </div>
  );
}