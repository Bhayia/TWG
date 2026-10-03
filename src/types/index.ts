export interface SiteSettings {
  brandName: string;
  tagline: string;
  subtitle: string;
  contactEmail: string;
  contactPhone: string;
  address: string;
  announcement: string;
  showAnnouncement: boolean;
  heroVideoUrl?: string;
  heroPosterUrl: string;
  aboutPhilosophy: string;
  seoTitle: string;
  seoDescription: string;
  socialLinks?: {
    instagram?: string;
    youtube?: string;
    facebook?: string;
    whatsapp?: string;
  };
}

export interface ScheduleItem {
  time: string;
  title: string;
  description?: string;
  icon?: string;
}

export interface DaySchedule {
  day: number;
  dayTitle: string;
  date: string;
  items: ScheduleItem[];
}

export interface Speaker {
  name: string;
  role: string;
  bio: string;
  image?: string;
}

export interface EventItem {
  id: string;
  title: string;
  slug: string;
  subtitle: string;
  description: string;
  heroImage: string;
  startDate: string;
  endDate: string;
  location: string;
  ticketPrice: number;
  earlyBirdPrice?: number;
  capacity: number;
  bookedCount: number;
  schedule: DaySchedule[];
  speakers: Speaker[];
  inclusions: string[];
  exclusions: string[];
  featured: boolean;
  published: boolean;
}

export interface MembershipItem {
  id: string;
  name: string;
  tagline: string;
  duration: string;
  price: number;
  period: string;
  tierType: '1-year' | '5-year';
  sessionsCount: string;
  internationalAccess: string;
  benefits: string[];
  priorityBenefits: string[];
  featured: boolean;
  order: number;
  active: boolean;
}

export interface ProductItem {
  id: string;
  name: string;
  category: 'Rudraksha' | 'Perfumes' | 'Wellness' | 'Incense';
  description: string;
  price: number;
  originalPrice?: number;
  images: string[];
  stock: number;
  details: string[];
  featured: boolean;
  active: boolean;
}

export interface JourneyItem {
  id: string;
  title: string;
  country: 'India' | 'Nepal' | 'Malaysia' | 'World';
  duration: string;
  route: string;
  description: string;
  image: string;
  price: number;
  highlights: string[];
  departureDates: string[];
  featured: boolean;
  active: boolean;
}

export interface ConsultationItem {
  id: string;
  title: string;
  description: string;
  duration: string;
  price: number;
  availableModes: string[];
  active: boolean;
}

export interface BookingRecord {
  id: string;
  eventId: string;
  eventTitle: string;
  attendeeName: string;
  attendeeEmail: string;
  attendeePhone: string;
  ticketCount: number;
  totalAmount: number;
  status: 'confirmed' | 'pending' | 'cancelled';
  paymentMethod: string;
  notes?: string;
  createdAt: string;
}

export interface OrderRecord {
  id: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  shippingAddress: string;
  items: {
    productId: string;
    name: string;
    price: number;
    quantity: number;
  }[];
  totalAmount: number;
  status: 'pending' | 'processing' | 'shipped' | 'delivered';
  createdAt: string;
}

export interface InquiryRecord {
  id: string;
  name: string;
  email: string;
  phone?: string;
  subject: string;
  message: string;
  type: 'general' | 'consultation' | 'journey' | 'sponsorship';
  status: 'new' | 'reviewed' | 'resolved';
  createdAt: string;
}

export interface UserProfile {
  uid: string;
  email: string;
  displayName: string;
  photoURL?: string;
  role: 'admin' | 'member' | 'user';
  membershipTier?: string;
  createdAt: string;
}

export interface FaqItem {
  id: string;
  question: string;
  answer: string;
  category: 'general' | 'programmes' | 'membership' | 'store';
}
