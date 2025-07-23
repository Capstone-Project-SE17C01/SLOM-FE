"use client";

import { useState } from "react";
import { Save, Globe, Bell, Shield, Database, Mail } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";

export default function SettingsPage() {
  const [settings, setSettings] = useState({
    siteName: "SLOM - Sign Language Learning",
    siteDescription: "Comprehensive language learning platform for all levels",
    enableRegistration: true,
    enableNotifications: true,
    enableEmailAlerts: false,
    maintenanceMode: false,
    autoBackup: true,
    requireEmailVerification: true,
    maxFileSize: "10",
    sessionTimeout: "30",
  });
  const handleSettingChange = (key: string, value: string | boolean) => {
    setSettings(prev => ({ ...prev, [key]: value }));
  };

  const handleSave = () => {
    // Implement save functionality
    console.log("Saving settings:", settings);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">System Settings</h1>
          <p className="text-gray-600 dark:text-gray-400">Configure system-wide settings and preferences</p>
        </div>
        <Button onClick={handleSave} className="bg-[#6947A8] hover:bg-[#5a3d8c]">
          <Save className="h-4 w-4 mr-2" />
          Save Changes
        </Button>
      </div>

      {/* General Settings */}
      <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700">
        <div className="flex items-center mb-4">
          <Globe className="h-5 w-5 mr-2 text-[#6947A8]" />
          <h2 className="text-xl font-semibold">General Settings</h2>
        </div>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Site Name
            </label>
            <input
              type="text"
              value={settings.siteName}
              onChange={(e) => handleSettingChange("siteName", e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#6947A8]"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Site Description
            </label>
            <textarea
              value={settings.siteDescription}
              onChange={(e) => handleSettingChange("siteDescription", e.target.value)}
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#6947A8]"
            />
          </div>
        </div>
      </div>

      {/* User Management */}
      <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700">
        <div className="flex items-center mb-4">
          <Shield className="h-5 w-5 mr-2 text-[#6947A8]" />
          <h2 className="text-xl font-semibold">User Management</h2>
        </div>
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                Enable User Registration
              </label>
              <p className="text-sm text-gray-500 dark:text-gray-400">Allow new users to register</p>
            </div>
            <Switch
              checked={settings.enableRegistration}
              onCheckedChange={(checked) => handleSettingChange("enableRegistration", checked)}
            />
          </div>
          <div className="flex items-center justify-between">
            <div>
              <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                Require Email Verification
              </label>
              <p className="text-sm text-gray-500 dark:text-gray-400">Users must verify email before access</p>
            </div>
            <Switch
              checked={settings.requireEmailVerification}
              onCheckedChange={(checked) => handleSettingChange("requireEmailVerification", checked)}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Session Timeout (minutes)
            </label>
            <input
              type="number"
              value={settings.sessionTimeout}
              onChange={(e) => handleSettingChange("sessionTimeout", e.target.value)}
              className="w-32 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#6947A8]"
            />
          </div>
        </div>
      </div>

      {/* Notifications */}
      <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700">
        <div className="flex items-center mb-4">
          <Bell className="h-5 w-5 mr-2 text-[#6947A8]" />
          <h2 className="text-xl font-semibold">Notification Settings</h2>
        </div>
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                Enable Push Notifications
              </label>
              <p className="text-sm text-gray-500 dark:text-gray-400">Send push notifications to users</p>
            </div>
            <Switch
              checked={settings.enableNotifications}
              onCheckedChange={(checked) => handleSettingChange("enableNotifications", checked)}
            />
          </div>
          <div className="flex items-center justify-between">
            <div>
              <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                Email Alerts for Admins
              </label>
              <p className="text-sm text-gray-500 dark:text-gray-400">Send email alerts for important events</p>
            </div>
            <Switch
              checked={settings.enableEmailAlerts}
              onCheckedChange={(checked) => handleSettingChange("enableEmailAlerts", checked)}
            />
          </div>
        </div>
      </div>

      {/* System */}
      <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700">
        <div className="flex items-center mb-4">
          <Database className="h-5 w-5 mr-2 text-[#6947A8]" />
          <h2 className="text-xl font-semibold">System Settings</h2>
        </div>
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                Maintenance Mode
              </label>
              <p className="text-sm text-gray-500 dark:text-gray-400">Put the system in maintenance mode</p>
            </div>
            <Switch
              checked={settings.maintenanceMode}
              onCheckedChange={(checked) => handleSettingChange("maintenanceMode", checked)}
            />
          </div>
          <div className="flex items-center justify-between">
            <div>
              <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                Auto Backup
              </label>
              <p className="text-sm text-gray-500 dark:text-gray-400">Automatically backup data daily</p>
            </div>
            <Switch
              checked={settings.autoBackup}
              onCheckedChange={(checked) => handleSettingChange("autoBackup", checked)}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Max File Upload Size (MB)
            </label>
            <input
              type="number"
              value={settings.maxFileSize}
              onChange={(e) => handleSettingChange("maxFileSize", e.target.value)}
              className="w-32 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#6947A8]"
            />
          </div>
        </div>
      </div>

      {/* Email Configuration */}
      <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700">
        <div className="flex items-center mb-4">
          <Mail className="h-5 w-5 mr-2 text-[#6947A8]" />
          <h2 className="text-xl font-semibold">Email Configuration</h2>
        </div>
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                SMTP Server
              </label>
              <input
                type="text"
                placeholder="smtp.example.com"
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#6947A8]"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                SMTP Port
              </label>
              <input
                type="number"
                placeholder="587"
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#6947A8]"
              />
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Username
              </label>
              <input
                type="text"
                placeholder="your-email@example.com"
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#6947A8]"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Password
              </label>
              <input
                type="password"
                placeholder="••••••••"
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#6947A8]"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 