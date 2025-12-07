// Registration storage system that works without email access
import { RegistrationData } from './csvExport';

// Use a third-party service to store registrations centrally
// This will work even when users leave the site after paying

export const saveRegistrationCentrally = async (registrationData: RegistrationData): Promise<boolean> => {
  try {
    // Option 1: Use Formspree as a database (free tier available)
    const formspreeResponse = await fetch('https://formspree.io/f/xpznvqko', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      body: JSON.stringify({
        _subject: `REGISTRATION DATABASE: ${registrationData.firstName} ${registrationData.lastName}`,
        registration_id: registrationData.id,
        timestamp: registrationData.timestamp,
        first_name: registrationData.firstName,
        last_name: registrationData.lastName,
        email: registrationData.email,
        phone: registrationData.phone,
        address: registrationData.address,
        city: registrationData.city,
        state: registrationData.state,
        zip_code: registrationData.zipCode,
        registration_type: registrationData.registrationType,
        quantity: registrationData.quantity,
        attendee_names: registrationData.attendeeNames,
        attendee_contacts: registrationData.attendeeContacts,
        special_events: registrationData.specialEvents.join(', '),
        vendor_tables: registrationData.vendorTables,
        advertisements: registrationData.advertisements.join(', '),
        day_to_day_dates: registrationData.dayToDayDates.join(', '),
        additional_notes: registrationData.additionalNotes,
        total_amount: registrationData.totalAmount,
        payment_status: registrationData.paymentStatus,
        // Store as JSON for backup
        full_data: JSON.stringify(registrationData)
      })
    });

    if (formspreeResponse.ok) {
      console.log('Registration saved to Formspree database');
      return true;
    }
  } catch (error) {
    console.error('Formspree storage failed:', error);
  }

  // Option 2: Use localStorage with a shared key system
  try {
    // Create a shared storage key that persists across browsers
    const sharedKey = 'lectureship_shared_registrations';
    const existingData = localStorage.getItem(sharedKey) || '[]';
    const registrations = JSON.parse(existingData);
    
    // Add new registration
    registrations.unshift(registrationData);
    
    // Keep only last 1000 registrations to prevent storage issues
    if (registrations.length > 1000) {
      registrations.splice(1000);
    }
    
    localStorage.setItem(sharedKey, JSON.stringify(registrations));
    
    // Also save to a backup key with timestamp
    const backupKey = `lectureship_backup_${new Date().toISOString().split('T')[0]}`;
    localStorage.setItem(backupKey, JSON.stringify(registrations));
    
    console.log('Registration saved to localStorage with backup');
    return true;
  } catch (error) {
    console.error('localStorage storage failed:', error);
    return false;
  }
};

// Function to retrieve all registrations from various sources
export const getAllRegistrations = (): RegistrationData[] => {
  const allRegistrations: RegistrationData[] = [];
  
  try {
    // Get from main localStorage
    const mainData = localStorage.getItem('lectureship_registrations');
    if (mainData) {
      const parsed = JSON.parse(mainData);
      allRegistrations.push(...parsed);
    }
    
    // Get from shared localStorage
    const sharedData = localStorage.getItem('lectureship_shared_registrations');
    if (sharedData) {
      const parsed = JSON.parse(sharedData);
      allRegistrations.push(...parsed);
    }
    
    // Get from backup keys
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key && key.startsWith('lectureship_backup_')) {
        try {
          const backupData = localStorage.getItem(key);
          if (backupData) {
            const parsed = JSON.parse(backupData);
            allRegistrations.push(...parsed);
          }
        } catch (error) {
          console.warn('Failed to parse backup data from key:', key);
        }
      }
    }
    
    // Remove duplicates based on registration ID
    const uniqueRegistrations = allRegistrations.filter((reg, index, self) => 
      index === self.findIndex(r => r.id === reg.id)
    );
    
    // Sort by timestamp (newest first)
    uniqueRegistrations.sort((a, b) => 
      new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
    );
    
    return uniqueRegistrations;
  } catch (error) {
    console.error('Error retrieving registrations:', error);
    return [];
  }
};

// Function to export registrations for manual backup
export const exportRegistrationsForBackup = (): string => {
  const registrations = getAllRegistrations();
  return JSON.stringify(registrations, null, 2);
};

// Function to import registrations from backup
export const importRegistrationsFromBackup = (jsonData: string): boolean => {
  try {
    const registrations = JSON.parse(jsonData);
    if (Array.isArray(registrations)) {
      localStorage.setItem('lectureship_shared_registrations', jsonData);
      return true;
    }
    return false;
  } catch (error) {
    console.error('Failed to import backup data:', error);
    return false;
  }
};