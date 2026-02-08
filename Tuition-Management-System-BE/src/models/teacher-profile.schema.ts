import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type TeacherProfileDocument = TeacherProfile & Document;

export enum TeacherStatus {
  PENDING = 'PENDING',
  APPROVED = 'APPROVED',
  REJECTED = 'REJECTED',
}

@Schema({ timestamps: true })
export class Location {
  @Prop()
  city?: string;

  @Prop()
  state?: string;

  @Prop({ default: 'India' })
  country?: string;

  @Prop()
  address?: string;

  @Prop({ type: { lat: Number, lng: Number }, _id: false })
  coordinates?: {
    lat: number;
    lng: number;
  };
}

@Schema({ _id: false })
export class Contact {
  @Prop()
  email?: string;

  @Prop()
  phone?: string;

  @Prop()
  whatsapp?: string;

  @Prop()
  website?: string;
}

@Schema({ _id: false })
export class Pricing {
  @Prop()
  hourlyRate?: string;

  @Prop()
  monthlyFee?: string;

  @Prop()
  groupClassPrice?: string;
}

@Schema({ _id: false })
export class SocialLinks {
  @Prop()
  linkedin?: string;

  @Prop()
  youtube?: string;

  @Prop()
  facebook?: string;

  @Prop()
  twitter?: string;

  @Prop()
  instagram?: string;

  @Prop()
  whatsapp?: string;
}

@Schema({ _id: false })
export class DayAvailability {
  @Prop({ default: false })
  enabled: boolean;

  @Prop()
  startTime?: string;

  @Prop()
  endTime?: string;
}

@Schema({ _id: false })
export class Visibility {
  @Prop({ default: false })
  showEmail: boolean;

  @Prop({ default: false })
  showPhone: boolean;

  @Prop({ default: true })
  showWhatsAppButton: boolean;

  @Prop({ default: true })
  showSchedulePreview: boolean;

  @Prop({ default: false })
  showTestimonials: boolean;

  @Prop({ default: true })
  showClassFees: boolean;

  @Prop({ default: true })
  showLocation: boolean;

  @Prop({ default: false })
  showStudentCount: boolean;

  @Prop({ default: true })
  allowPublicAIChat: boolean;
}

@Schema({ _id: false })
export class Customization {
  @Prop({ default: '#3b82f6' })
  themeColor: string;

  @Prop({ default: '#8b5cf6' })
  accentColor: string;

  @Prop({ default: 'inter' })
  fontPairing: string;

  @Prop({ type: [String], maxlength: 6 })
  highlights: string[];

  @Prop({
    type: [
      {
        question: { type: String, required: true },
        answer: { type: String, required: true },
      },
    ],
    maxlength: 20,
  })
  faqs: Array<{ question: string; answer: string }>;
}

@Schema({ _id: false })
export class WebsiteTheme {
  @Prop({ default: '#3b82f6' })
  primaryColor: string;

  @Prop({ default: '#8b5cf6' })
  accentColor: string;

  @Prop({ default: 'default', enum: ['default', 'modern', 'classic', 'elegant'] })
  fontPairing: string;

  @Prop({ maxlength: 5000 })
  customCSS?: string;
}

@Schema({ _id: false })
export class SectionConfig {
  @Prop({ required: true })
  id: string;

  @Prop({ required: true })
  type: string;

  @Prop({ required: true })
  order: number;

  @Prop({ default: true })
  visible: boolean;

  @Prop({ type: Object })
  config: Record<string, any>;
}

@Schema({ _id: false })
export class CustomContent {
  @Prop({ type: Object })
  hero?: {
    title?: string;
    subtitle?: string;
    ctaText?: string;
    ctaLink?: string;
  };

  @Prop({ type: Object })
  about?: {
    heading?: string;
    content?: string;
  };
}

@Schema({ _id: false })
export class SEO {
  @Prop()
  metaTitle?: string;

  @Prop()
  metaDescription?: string;

  @Prop({ type: [String] })
  metaKeywords?: string[];

  @Prop()
  ogImage?: string;
}

@Schema({ _id: false })
export class WebsiteConfig {
  @Prop({ type: WebsiteTheme, _id: false })
  theme?: WebsiteTheme;

  @Prop({ type: [SectionConfig], _id: false })
  sections?: SectionConfig[];

  @Prop({ type: CustomContent, _id: false })
  customContent?: CustomContent;

  @Prop({ type: SEO, _id: false })
  seo?: SEO;
}

@Schema({ _id: false })
export class Verification {
  @Prop({ type: [String] })
  documents?: string[];

  @Prop()
  verifiedAt?: Date;

  @Prop({ type: Types.ObjectId, ref: 'User' })
  verifiedBy?: Types.ObjectId;

  @Prop()
  verificationNotes?: string;
}

@Schema({ _id: false })
export class Stats {
  @Prop({ default: 0 })
  totalClasses: number;

  @Prop({ default: 0 })
  totalStudents: number;

  @Prop({ default: 0 })
  averageAttendance: number;
}

@Schema({ timestamps: true })
export class TeacherProfile {
  @Prop({ type: Types.ObjectId, ref: 'User', required: true, unique: true, index: true })
  userId: Types.ObjectId;

  @Prop({ required: true, enum: TeacherStatus, default: TeacherStatus.PENDING, index: true })
  status: TeacherStatus;

  @Prop({ required: true, unique: true, lowercase: true, index: true })
  slug: string;

  @Prop({ required: true })
  firstName: string;

  @Prop({ required: true })
  lastName: string;

  @Prop()
  image?: string;

  @Prop()
  coverImage?: string;

  @Prop({ maxlength: 2000 })
  bio?: string;

  @Prop({ maxlength: 200 })
  tagline?: string;

  @Prop({ type: [String], required: true, index: true })
  subjects: string[];

  @Prop({ type: [String], required: true })
  grades: string[];

  @Prop()
  experience?: number;

  @Prop()
  experienceLevel?: string;

  @Prop({ type: [String] })
  qualifications?: string[];

  @Prop({ type: Location, _id: false })
  location?: Location;

  @Prop({ type: Contact, _id: false })
  contact?: Contact;

  @Prop({ 
    type: [{
      _id: false,
      level: { type: String, required: true },
      subjects: [{ type: String }],
      grades: [{ type: String }]
    }]
  })
  educationLevels?: Array<{
    level: string;
    subjects: string[];
    grades: string[];
  }>;

  @Prop()
  educationLevel?: string; // Keep for backward compatibility

  @Prop({ type: [String] })
  teachingModes?: string[];

  @Prop({ type: Pricing, _id: false })
  pricing?: Pricing;

  @Prop({ type: [String] })
  languages?: string[];

  @Prop({ type: [String] })
  studentTargetTypes?: string[];

  @Prop({ type: [String] })
  onlinePlatforms?: string[];

  @Prop({ type: Map, of: Object, default: () => new Map() })
  availability?: Map<string, DayAvailability>;

  @Prop({ type: SocialLinks, _id: false })
  socialLinks?: SocialLinks;

  @Prop({ type: Visibility, _id: false, default: () => ({}) })
  visibility: Visibility;

  @Prop({ type: Customization, _id: false, default: () => ({}) })
  customization: Customization;

  @Prop({ type: WebsiteConfig, _id: false })
  websiteConfig?: WebsiteConfig;

  @Prop({ type: Verification, _id: false })
  verification?: Verification;

  @Prop()
  rejectionReason?: string;

  @Prop()
  rejectedAt?: Date;

  @Prop({ type: Types.ObjectId, ref: 'User' })
  rejectedBy?: Types.ObjectId;

  @Prop()
  approvedAt?: Date;

  @Prop({ type: Types.ObjectId, ref: 'User' })
  approvedBy?: Types.ObjectId;

  @Prop({ type: Stats, _id: false, default: () => ({}) })
  stats: Stats;
}

export const TeacherProfileSchema = SchemaFactory.createForClass(TeacherProfile);

// Indexes (removed duplicates - already defined in @Prop decorators)

// Methods
TeacherProfileSchema.methods.generateSlug = function () {
  const name = `${this.firstName} ${this.lastName}`.toLowerCase();
  return name
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');
};

TeacherProfileSchema.methods.isApproved = function () {
  return this.status === TeacherStatus.APPROVED;
};
