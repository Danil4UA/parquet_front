"use client";
import React, { useState } from 'react';
import { Save, Check } from 'lucide-react';

export default function SettingsPage() {
  const [settings, setSettings] = useState({
    siteName: 'Parquet Shop',
    contactEmail: 'info@parquetshop.com',
    phoneNumber: '+972 50 123 4567',
    currency: 'ILS',
    taxRate: '17',
    allowRegistrations: true,
    enableEmailNotifications: true,
    maintenanceMode: false
  });
  
  const [saved, setSaved] = useState(false);
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target as HTMLInputElement;
    
    setSettings({
      ...settings,
      [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : value
    });
    
    if (saved) setSaved(false);
  };
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Saving settings:', settings);
    
    // Show success message
    setSaved(true);
    
    setTimeout(() => {
      setSaved(false);
    }, 3000);
  };
  
  return (
    <div className="admin-settings">
      <div className="settings-header">
        <h1>Site Settings</h1>
        {saved && (
          <div className="save-success">
            <Check size={18} />
            <span>Settings saved successfully</span>
          </div>
        )}
      </div>
      
      <form onSubmit={handleSubmit} className="settings-form">
        <div className="settings-section">
          <h2>General Settings</h2>
          
          <div className="form-group">
            <label htmlFor="siteName">Site Name</label>
            <input
              type="text"
              id="siteName"
              name="siteName"
              value={settings.siteName}
              onChange={handleChange}
            />
          </div>
          
          <div className="form-group">
            <label htmlFor="contactEmail">Contact Email</label>
            <input
              type="email"
              id="contactEmail"
              name="contactEmail"
              value={settings.contactEmail}
              onChange={handleChange}
            />
          </div>
          
          <div className="form-group">
            <label htmlFor="phoneNumber">Phone Number</label>
            <input
              type="text"
              id="phoneNumber"
              name="phoneNumber"
              value={settings.phoneNumber}
              onChange={handleChange}
            />
          </div>
        </div>
        
        <div className="settings-section">
          <h2>Store Settings</h2>
          
          <div className="form-group">
            <label htmlFor="currency">Currency</label>
            <select
              id="currency"
              name="currency"
              value={settings.currency}
              onChange={handleChange}
            >
              <option value="ILS">Israeli Shekel (₪)</option>
              <option value="USD">US Dollar ($)</option>
              <option value="EUR">Euro (€)</option>
            </select>
          </div>
          
          <div className="form-group">
            <label htmlFor="taxRate">Tax Rate (%)</label>
            <input
              type="number"
              id="taxRate"
              name="taxRate"
              value={settings.taxRate}
              onChange={handleChange}
            />
          </div>
        </div>
        
        <div className="settings-section">
          <h2>Site Options</h2>
          
          <div className="form-group checkbox-group">
            <input
              type="checkbox"
              id="allowRegistrations"
              name="allowRegistrations"
              checked={settings.allowRegistrations}
              onChange={handleChange}
            />
            <label htmlFor="allowRegistrations">Allow User Registrations</label>
          </div>
          
          <div className="form-group checkbox-group">
            <input
              type="checkbox"
              id="enableEmailNotifications"
              name="enableEmailNotifications"
              checked={settings.enableEmailNotifications}
              onChange={handleChange}
            />
            <label htmlFor="enableEmailNotifications">Enable Email Notifications</label>
          </div>
          
          <div className="form-group checkbox-group">
            <input
              type="checkbox"
              id="maintenanceMode"
              name="maintenanceMode"
              checked={settings.maintenanceMode}
              onChange={handleChange}
            />
            <label htmlFor="maintenanceMode">Maintenance Mode</label>
          </div>
        </div>
        
        <button type="submit" className="save-settings-button">
          <Save size={18} />
          <span>Save Settings</span>
        </button>
      </form>
    </div>
  );
}