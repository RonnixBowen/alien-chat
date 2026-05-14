export type UserRole = 'employee' | 'intern';

export interface UserProfile {
  uid: string;
  fullName: string;
  email: string;
  phoneNumber: string;
  role: UserRole;
  createdAt: any; // Firestore Timestamp
}

export interface Message {
  id: string;
  text: string;
  senderId: string;
  senderName: string;
  createdAt: any; // Firestore Timestamp
}

export type AppView = 'splash' | 'login' | 'register' | 'chat' | 'profile';
