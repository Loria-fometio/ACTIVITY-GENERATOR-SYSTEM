function Settings() {
  const [settings, setSettings] = React.useState({
    defaultDuration: 60, // minutes
    defaultActivityType: 'work',
    enableReminders: true,
    reminderTime: 15, // minutes before
    weekStartsOn: 'Monday',
    timeFormat: '24h',
    autoSave: true,
    theme: 'light'
  });

  const handleSave = () => {
    localStorage.setItem('timetableSettings', JSON.stringify(settings));
    alert('Settings saved successfully!');
  };

  return (
    <div style={{ padding: '40px 20px', maxWidth: '800px', margin: '0 auto' }}>
      <h1 style={{ fontSize: '24px', fontWeight: 'bold', color: '#111827', marginBottom: '24px' }}>
        Timetable Settings
      </h1>
      
      <div style={{ 
        background: 'white', 
        padding: '32px', 
        borderRadius: '8px',
        border: '1px solid #E5E7EB',
        display: 'flex',
        flexDirection: 'column',
        gap: '32px'
      }}>
        
        {/* Default Activity Settings */}
        <div>
          <h3 style={{ fontSize: '18px', fontWeight: '600', marginBottom: '16px', color: '#111827' }}>
            Default Activity Settings
          </h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <div>
              <label style={{ display: 'block', marginBottom: '8px', fontWeight: '500', color: '#374151' }}>
                Default Activity Duration (minutes)
              </label>
              <input
                type="range"
                min="15"
                max="180"
                step="15"
                value={settings.defaultDuration}
                onChange={(e) => setSettings({...settings, defaultDuration: parseInt(e.target.value)})}
                style={{ width: '100%' }}
              />
              <div style={{ display: 'flex', justifyContent: 'space-between', color: '#6B7280', fontSize: '12px' }}>
                <span>15 min</span>
                <span>{settings.defaultDuration} min</span>
                <span>180 min</span>
              </div>
            </div>
            
            <div>
              <label style={{ display: 'block', marginBottom: '8px', fontWeight: '500', color: '#374151' }}>
                Default Activity Type
              </label>
              <select
                value={settings.defaultActivityType}
                onChange={(e) => setSettings({...settings, defaultActivityType: e.target.value})}
                style={{ 
                  width: '100%',
                  padding: '8px 12px',
                  border: '1px solid #D1D5DB',
                  borderRadius: '6px',
                  fontSize: '14px'
                }}
              >
                <option value="work">Work</option>
                <option value="study">Study</option>
                <option value="fitness">Fitness</option>
                <option value="break">Break</option>
                <option value="meeting">Meeting</option>
              </select>
            </div>
          </div>
        </div>
        
        {/* Reminder Settings */}
        <div>
          <h3 style={{ fontSize: '18px', fontWeight: '600', marginBottom: '16px', color: '#111827' }}>
            Reminder Settings
          </h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            <label style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <input 
                type="checkbox" 
                checked={settings.enableReminders}
                onChange={(e) => setSettings({...settings, enableReminders: e.target.checked})}
              />
              Enable activity reminders
            </label>
            
            {settings.enableReminders && (
              <div>
                <label style={{ display: 'block', marginBottom: '8px', fontWeight: '500', color: '#374151' }}>
                  Reminder time before activity (minutes)
                </label>
                <select
                  value={settings.reminderTime}
                  onChange={(e) => setSettings({...settings, reminderTime: parseInt(e.target.value)})}
                  style={{ 
                    width: '100%',
                    padding: '8px 12px',
                    border: '1px solid #D1D5DB',
                    borderRadius: '6px',
                    fontSize: '14px'
                  }}
                >
                  <option value="5">5 minutes before</option>
                  <option value="15">15 minutes before</option>
                  <option value="30">30 minutes before</option>
                  <option value="60">1 hour before</option>
                </select>
              </div>
            )}
          </div>
        </div>
        
        {/* Display Settings */}
        <div>
          <h3 style={{ fontSize: '18px', fontWeight: '600', marginBottom: '16px', color: '#111827' }}>
            Display & Time Settings
          </h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <div>
              <label style={{ display: 'block', marginBottom: '8px', fontWeight: '500', color: '#374151' }}>
                Week starts on
              </label>
              <select
                value={settings.weekStartsOn}
                onChange={(e) => setSettings({...settings, weekStartsOn: e.target.value})}
                style={{ 
                  width: '100%',
                  padding: '8px 12px',
                  border: '1px solid #D1D5DB',
                  borderRadius: '6px',
                  fontSize: '14px'
                }}
              >
                <option value="Monday">Monday</option>
                <option value="Sunday">Sunday</option>
              </select>
            </div>
            
            <div>
              <label style={{ display: 'block', marginBottom: '8px', fontWeight: '500', color: '#374151' }}>
                Time format
              </label>
              <div style={{ display: 'flex', gap: '16px' }}>
                <label style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <input 
                    type="radio" 
                    name="timeFormat"
                    checked={settings.timeFormat === '24h'}
                    onChange={() => setSettings({...settings, timeFormat: '24h'})}
                  />
                  24-hour format (14:00)
                </label>
                <label style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <input 
                    type="radio" 
                    name="timeFormat"
                    checked={settings.timeFormat === '12h'}
                    onChange={() => setSettings({...settings, timeFormat: '12h'})}
                  />
                  12-hour format (2:00 PM)
                </label>
              </div>
            </div>
          </div>
        </div>
        
        {/* Advanced Settings */}
        <div>
          <h3 style={{ fontSize: '18px', fontWeight: '600', marginBottom: '16px', color: '#111827' }}>
            Advanced Settings
          </h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            <label style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <input 
                type="checkbox" 
                checked={settings.autoSave}
                onChange={(e) => setSettings({...settings, autoSave: e.target.checked})}
              />
              Auto-save timetable changes
            </label>
          </div>
        </div>
        
        {/* API/Integration Status */}
        <div>
          <h3 style={{ fontSize: '18px', fontWeight: '600', marginBottom: '16px', color: '#111827' }}>
            Service Status
          </h3>
          <div style={{ 
            background: '#F0F9FF', 
            padding: '16px', 
            borderRadius: '6px',
            border: '1px solid #BAE6FD'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
              <span style={{ fontWeight: '500' }}>Timetable Service</span>
              <span style={{ 
                background: '#10B981', 
                color: 'white', 
                padding: '2px 8px', 
                borderRadius: '12px',
                fontSize: '12px'
              }}>
                Online
              </span>
            </div>
            <div style={{ fontSize: '13px', color: '#6B7280' }}>
              API endpoint: /api/timetables
            </div>
          </div>
        </div>
        
        <button 
          onClick={handleSave}
          style={{ 
            alignSelf: 'flex-start',
            background: '#2563EB',
            color: 'white',
            border: 'none',
            padding: '10px 24px',
            borderRadius: '6px',
            cursor: 'pointer',
            fontSize: '14px',
            fontWeight: '500',
            transition: 'background-color 0.2s'
          }}
          onMouseEnter={(e) => e.target.style.background = '#1D4ED8'}
          onMouseLeave={(e) => e.target.style.background = '#2563EB'}
        >
          Save Settings
        </button>
      </div>
    </div>
  );
}