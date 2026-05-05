import { supabase } from './client';
import { Platform } from 'react-native';
import Constants from 'expo-constants';

export interface BugReport {
  category: string;
  severity: string;
  title: string;
  description: string;
  steps_to_reproduce: string;
  expected_behavior: string;
  actual_behavior: string;
  email?: string;
}

export const BugReportService = {
  async submitReport(userId: string, report: BugReport) {
    const deviceInfo = {
      os: Platform.OS,
      osVersion: Platform.Version,
      model: Constants.deviceName || 'Unknown',
      brand: Platform.select({ android: 'Android Device', ios: 'iOS Device' }),
      appVersion: Constants.expoConfig?.version || '1.0.0',
    };

    const { data, error } = await supabase
      .from('bug_reports')
      .insert({
        user_id: userId,
        ...report,
        device_info: deviceInfo,
      })
      .select()
      .single();

    if (error) {
      console.error('Error submitting bug report:', error);
      return { success: false, error };
    }

    // Optional: Trigger notification (Discord/Email) via Edge Function
    // This is handled on the backend via Database Webhooks for better security
    
    return { success: true, data };
  }
};
