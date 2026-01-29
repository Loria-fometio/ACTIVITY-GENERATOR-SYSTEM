import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link, useLocation } from 'react-router-dom';
import './App.css';

// Icons
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import DashboardIcon from '@mui/icons-material/Dashboard';
import AddBoxIcon from '@mui/icons-material/AddBox';

// Page Components
import Dashboard from './pages/Dashboard';
import TimetableGenerator from './pages/TimetableGenerator';
import TimetableView from './pages/TimetableView';

// NEW: Create placeholder components for the missing pages
function Settings() {
  return (
    <div style={{ padding: '40px 20px', maxWidth: '800px', margin: '0 auto' }}>
      <h1 style={{ fontSize: '24px', fontWeight: 'bold', color: '#111827', marginBottom: '24px' }}>
        Settings
      </h1>
      <div style={{ 
        background: 'white', 
        padding: '32px', 
        borderRadius: '8px',
        border: '1px solid #E5E7EB',
        display: 'flex',
        flexDirection: 'column',
        gap: '24px'
      }}>
        <div>
          <h3 style={{ fontSize: '18px', fontWeight: '600', marginBottom: '12px' }}>Profile</h3>
          <div style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
            <div style={{ 
              width: '64px', 
              height: '64px', 
              borderRadius: '50%', 
              background: '#DBEAFE',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '24px',
              color: '#2563EB'
            }}>
              U
            </div>
            <div>
              <p style={{ fontWeight: '500', margin: '0 0 4px 0' }}>User Name</p>
              <p style={{ color: '#6B7280', fontSize: '14px', margin: 0 }}>user@example.com</p>
            </div>
          </div>
        </div>
        
        <div>
          <h3 style={{ fontSize: '18px', fontWeight: '600', marginBottom: '12px' }}>Notifications</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            <label style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <input type="checkbox" defaultChecked />
              Email notifications
            </label>
            <label style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <input type="checkbox" defaultChecked />
              Schedule reminders
            </label>
          </div>
        </div>
        
        <div>
          <h3 style={{ fontSize: '18px', fontWeight: '600', marginBottom: '12px' }}>Preferences</h3>
          <p style={{ color: '#6B7280', marginBottom: '16px' }}>Coming soon...</p>
        </div>
        
        <button style={{ 
          alignSelf: 'flex-start',
          background: '#2563EB',
          color: 'white',
          border: 'none',
          padding: '10px 20px',
          borderRadius: '6px',
          cursor: 'pointer',
          fontSize: '14px',
          fontWeight: '500'
        }}>
          Save Changes
        </button>
      </div>
    </div>
  );
}

function Templates() {
  const templates = [
    { id: 1, name: 'Student Exam Week', category: 'Study', color: '#8B5CF6', icon: '📚' },
    { id: 2, name: 'Gym Routine Plan', category: 'Fitness', color: '#3B82F6', icon: '💪' },
    { id: 3, name: 'Work From Home', category: 'Work', color: '#10B981', icon: '💼' },
    { id: 4, name: 'Meditation & Wellness', category: 'Wellness', color: '#F59E0B', icon: '🧘' },
    { id: 5, name: 'Creative Projects', category: 'Creative', color: '#EF4444', icon: '🎨' },
    { id: 6, name: 'Language Learning', category: 'Study', color: '#8B5CF6', icon: '🌍' },
  ];
  
  return (
    <div style={{ padding: '40px 20px', maxWidth: '1200px', margin: '0 auto' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '32px' }}>
        <div>
          <h1 style={{ fontSize: '24px', fontWeight: 'bold', color: '#111827', marginBottom: '8px' }}>
            Schedule Templates
          </h1>
          <p style={{ color: '#6B7280', fontSize: '16px' }}>
            Start quickly with pre-made templates
          </p>
        </div>
      </div>
      
      <div style={{ 
        display: 'grid', 
        gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
        gap: '24px'
      }}>
        {templates.map((template) => (
          <div key={template.id} style={{ 
            background: 'white',
            border: '1px solid #E5E7EB',
            borderRadius: '8px',
            padding: '24px',
            transition: 'all 0.2s',
            cursor: 'pointer'
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.transform = 'translateY(-4px)';
            e.currentTarget.style.boxShadow = '0 10px 25px rgba(0,0,0,0.1)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = 'translateY(0)';
            e.currentTarget.style.boxShadow = 'none';
          }}>
            <div style={{ 
              display: 'flex', 
              alignItems: 'center', 
              gap: '16px',
              marginBottom: '16px'
            }}>
              <div style={{ 
                width: '48px', 
                height: '48px', 
                borderRadius: '8px', 
                background: template.color + '20',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '20px'
              }}>
                {template.icon}
              </div>
              <div>
                <h3 style={{ margin: 0, fontSize: '18px', fontWeight: '600' }}>
                  {template.name}
                </h3>
                <span style={{ 
                  fontSize: '14px', 
                  color: '#6B7280',
                  background: '#F3F4F6',
                  padding: '2px 8px',
                  borderRadius: '12px'
                }}>
                  {template.category}
                </span>
              </div>
            </div>
            
            <p style={{ 
              color: '#6B7280', 
              fontSize: '14px', 
              lineHeight: '1.5',
              marginBottom: '20px'
            }}>
              A pre-made schedule template for {template.name.toLowerCase()}
            </p>
            
            <button style={{ 
              width: '100%',
              background: '#2563EB',
              color: 'white',
              border: 'none',
              padding: '10px',
              borderRadius: '6px',
              cursor: 'pointer',
              fontSize: '14px',
              fontWeight: '500',
              transition: 'background-color 0.2s'
            }}
            onMouseEnter={(e) => e.currentTarget.style.background = '#1D4ED8'}
            onMouseLeave={(e) => e.currentTarget.style.background = '#2563EB'}>
              Use This Template
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

function AIGeneratorPage() {
  const [loading, setLoading] = React.useState(false);
  const [prompt, setPrompt] = React.useState('');
  
  const handleGenerate = () => {
    if (!prompt.trim()) return;
    
    setLoading(true);
    // Simulate AI generation
    setTimeout(() => {
      setLoading(false);
      alert('AI schedule generated! Redirecting to editor...');
      // In real app, you would navigate to the editor with generated data
    }, 2000);
  };
  
  return (
    <div style={{ padding: '40px 20px', maxWidth: '800px', margin: '0 auto' }}>
      <div style={{ textAlign: 'center', marginBottom: '40px' }}>
        {/* AutoAwesomeIcon is used inline */}
        <span style={{ fontSize: '48px', color: '#8B5CF6', marginBottom: '16px', display: 'inline-block' }}>
          ✨
        </span>
        <h1 style={{ fontSize: '24px', fontWeight: 'bold', color: '#111827', marginBottom: '8px' }}>
          AI Schedule Generator
        </h1>
        <p style={{ color: '#6B7280', fontSize: '16px' }}>
          Describe your goals and let AI create the perfect schedule
        </p>
      </div>
      
      <div style={{ 
        background: 'white',
        border: '1px solid #E5E7EB',
        borderRadius: '8px',
        padding: '32px',
        marginBottom: '32px'
      }}>
        <div style={{ marginBottom: '24px' }}>
          <label style={{ 
            display: 'block', 
            fontSize: '14px', 
            fontWeight: '500', 
            color: '#374151',
            marginBottom: '8px'
          }}>
            Describe what you want to achieve:
          </label>
          <textarea
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            placeholder="Example: 'I want a balanced schedule for work, gym 3 times a week, and 2 hours of study daily'"
            style={{ 
              width: '100%',
              minHeight: '120px',
              padding: '12px',
              border: '1px solid #D1D5DB',
              borderRadius: '6px',
              fontSize: '14px',
              resize: 'vertical'
            }}
          />
        </div>
        
        <div style={{ marginBottom: '24px' }}>
          <label style={{ 
            display: 'block', 
            fontSize: '14px', 
            fontWeight: '500', 
            color: '#374151',
            marginBottom: '8px'
          }}>
            Available hours per day:
          </label>
          <input
            type="range"
            min="2"
            max="12"
            defaultValue="8"
            style={{ width: '100%' }}
          />
          <div style={{ display: 'flex', justifyContent: 'space-between', color: '#6B7280', fontSize: '12px' }}>
            <span>2 hours</span>
            <span>8 hours</span>
            <span>12 hours</span>
          </div>
        </div>
        
        <button
          onClick={handleGenerate}
          disabled={loading}
          style={{ 
            width: '100%',
            background: loading ? '#9CA3AF' : '#8B5CF6',
            color: 'white',
            border: 'none',
            padding: '12px',
            borderRadius: '6px',
            cursor: loading ? 'not-allowed' : 'pointer',
            fontSize: '16px',
            fontWeight: '500',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '8px'
          }}
        >
          {loading ? (
            <>
              <div style={{ 
                width: '16px', 
                height: '16px', 
                border: '2px solid rgba(255,255,255,0.3)',
                borderTopColor: 'white',
                borderRadius: '50%',
                animation: 'spin 1s linear infinite'
              }} />
              Generating...
            </>
          ) : (
            <>
              <span style={{ fontSize: '20px' }}>✨</span>
              Generate Schedule with AI
            </>
          )}
        </button>
      </div>
      
      <div style={{ 
        background: '#F3F4F6',
        border: '1px solid #E5E7EB',
        borderRadius: '8px',
        padding: '20px'
      }}>
        <h4 style={{ fontSize: '14px', fontWeight: '600', marginBottom: '8px' }}>💡 Tips for best results:</h4>
        <ul style={{ 
          margin: 0, 
          paddingLeft: '20px', 
          color: '#6B7280',
          fontSize: '14px',
          lineHeight: '1.6'
        }}>
          <li>Be specific about your goals and constraints</li>
          <li>Mention your priorities and time preferences</li>
          <li>Include any recurring commitments</li>
          <li>Specify if you prefer morning or evening activities</li>
        </ul>
      </div>
      
      {/* Add CSS for spinner animation */}
      <style jsx="true">{`
        @keyframes spin {
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
}

function Navigation() {
  const location = useLocation();
  
  const navItems = [
    { path: '/', label: 'Dashboard', icon: <DashboardIcon /> },
    { path: '/generate', label: 'Generator', icon: <AddBoxIcon /> },
  ];
  
  return (
    <nav style={{ 
      padding: '0 20px', 
      background: '#1e293b',
      color: 'white',
      boxShadow: '0 2px 10px rgba(0,0,0,0.1)'
    }}>
      <div style={{ 
        maxWidth: '1200px', 
        margin: '0 auto',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        height: '64px'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <CalendarMonthIcon style={{ fontSize: '28px', color: '#3b82f6' }} />
          <Link to="/" style={{ textDecoration: 'none', color: 'white' }}>
            <h1 style={{ margin: 0, fontSize: '18px', fontWeight: 'bold' }}>
              Activity<span style={{ color: '#3b82f6' }}>Planner</span>
            </h1>
          </Link>
        </div>
        
        <div style={{ display: 'flex', gap: '10px' }}>
          {navItems.map((item) => (
            <Link 
              key={item.path}
              to={item.path}
              style={{ 
                color: 'white',
                textDecoration: 'none',
                padding: '8px 16px',
                borderRadius: '6px',
                backgroundColor: location.pathname === item.path ? '#334155' : 'transparent',
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                fontSize: '14px',
                fontWeight: '500',
                transition: 'all 0.2s'
              }}
            >
              {item.icon}
              {item.label}
            </Link>
          ))}
        </div>
      </div>
    </nav>
  );
}

function App() {
  return (
    <Router>
      <div className="App" style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
        <Navigation />
        
        <div style={{ flex: 1 }}>
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/generate" element={<TimetableGenerator />} />
            <Route path="/timetable/:id" element={<TimetableView />} />
            <Route path="/settings" element={<Settings />} />
            <Route path="/templates" element={<Templates />} />
            <Route path="/ai-generator" element={<AIGeneratorPage />} />
          </Routes>
        </div>
        
        <footer style={{ 
          padding: '20px', 
          textAlign: 'center', 
          color: '#64748b', 
          fontSize: '13px',
          borderTop: '1px solid #e2e8f0',
          background: 'white'
        }}>
          <p>© 2026 Activity Planner | API Status: Online</p>
        </footer>
      </div>
    </Router>
  );
}

export default App;