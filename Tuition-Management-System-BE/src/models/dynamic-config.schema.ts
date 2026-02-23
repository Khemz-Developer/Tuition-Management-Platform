import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type DynamicConfigDocument = DynamicConfig & Document & { __v: number };

@Schema({ _id: false })
export class FieldOption {
  @Prop({ required: true })
  value: string;

  @Prop({ required: true })
  label: string;

  @Prop()
  description?: string;

  @Prop({ default: false })
  isDefault?: boolean;
}

@Schema({ _id: false })
export class FieldValidation {
  @Prop()
  required?: boolean;

  @Prop()
  minLength?: number;

  @Prop()
  maxLength?: number;

  @Prop()
  min?: number;

  @Prop()
  max?: number;

  @Prop()
  pattern?: string;

  @Prop({ type: [String] })
  allowedValues?: string[];
}

@Schema({ _id: false })
export class DynamicField {
  @Prop({ required: true })
  id: string;

  @Prop({ required: true })
  type: 'text' | 'textarea' | 'select' | 'multiselect' | 'checkbox' | 'radio' | 'number' | 'email' | 'phone' | 'url' | 'date' | 'file' | 'rating';

  @Prop({ required: true })
  label: string;

  @Prop()
  placeholder?: string;

  @Prop()
  description?: string;

  @Prop({ default: true })
  visible: boolean;

  @Prop({ default: 1 })
  order: number;

  @Prop({ type: FieldValidation, _id: false })
  validation?: FieldValidation;

  @Prop({ type: [FieldOption], _id: false })
  options?: FieldOption[];

  @Prop({ type: Object })
  defaultValue?: any;

  @Prop({ default: 'medium' })
  size: 'small' | 'medium' | 'large';

  @Prop({ default: false })
  multiline?: boolean;

  @Prop({ default: false })
  searchable?: boolean;
}

@Schema({ _id: false })
export class EducationLevel {
  @Prop({ required: true })
  code: string;

  @Prop({ required: true })
  name: string;

  @Prop()
  description?: string;

  @Prop({ default: true })
  active: boolean;

  @Prop({ default: 1 })
  order: number;

  @Prop({ type: [String] })
  defaultGrades: string[];

  @Prop({ type: [DynamicField], _id: false })
  customFields: DynamicField[];
}

@Schema({ _id: false })
export class Subject {
  @Prop({ required: true })
  code: string;

  @Prop({ required: true })
  name: string;

  @Prop()
  description?: string;

  @Prop({ type: [String] })
  educationLevels: string[];

  @Prop({ default: true })
  active: boolean;

  @Prop({ default: 1 })
  order: number;

  @Prop({ type: [String] })
  categories: string[];

  @Prop({ type: [DynamicField], _id: false })
  customFields: DynamicField[];
}

@Schema({ _id: false })
export class Grade {
  @Prop({ required: true })
  code: string;

  @Prop({ required: true })
  name: string;

  @Prop({ type: [String] })
  educationLevels: string[];

  @Prop({ default: true })
  active: boolean;

  @Prop({ default: 1 })
  order: number;
}

@Schema({ _id: false })
export class LocationItem {
  @Prop({ required: true })
  code: string;

  @Prop({ required: true })
  name: string;

  @Prop({ default: true })
  active: boolean;

  @Prop({ default: 1 })
  order: number;
}

@Schema({ _id: false })
export class ProfileSection {
  @Prop({ required: true })
  id: string;

  @Prop({ required: true })
  type: 'basic' | 'education' | 'experience' | 'pricing' | 'contact' | 'availability' | 'custom';

  @Prop({ required: true })
  title: string;

  @Prop()
  description?: string;

  @Prop({ default: true })
  visible: boolean;

  @Prop({ default: 1 })
  order: number;

  @Prop({ default: false })
  required: boolean;

  @Prop({ default: 'medium' })
  size: 'small' | 'medium' | 'large' | 'full';

  @Prop({ type: [DynamicField], _id: false })
  fields: DynamicField[];

  @Prop({ type: Object })
  config?: Record<string, any>;
}

@Schema({ _id: false })
export class ProfileTemplate {
  @Prop({ required: true })
  id: string;

  @Prop({ required: true })
  name: string;

  @Prop()
  description?: string;

  @Prop({ type: [String] })
  tags: string[];

  @Prop({ default: true })
  active: boolean;

  @Prop({ default: 1 })
  order: number;

  @Prop({ type: [ProfileSection], _id: false })
  sections: ProfileSection[];

  @Prop({ default: false })
  isDefault: boolean;
}

@Schema({ _id: false })
export class GeneralSettings {
  @Prop({ default: 'Tuition Management System' })
  platformName: string;

  @Prop({ default: 'support@example.com' })
  supportEmail: string;

  @Prop({ default: 'A comprehensive platform for managing tuition classes and students.' })
  description: string;

  @Prop({ default: false })
  teacherAutoApproval: boolean;

  @Prop({ default: true })
  allowStudentRegistration: boolean;
}

@Schema({ _id: false })
export class BrandingSettings {
  @Prop()
  logoUrl: string;

  @Prop()
  faviconUrl: string;

  @Prop({ default: '#3b82f6' })
  primaryColor: string;

  @Prop({ default: '#8b5cf6' })
  accentColor: string;
}

@Schema({ timestamps: true })
export class DynamicConfig {
  @Prop({ required: true, unique: true })
  key: string;

  @Prop({ required: true })
  name: string;

  @Prop()
  description?: string;

  @Prop({ default: true })
  active: boolean;

  // Education levels configuration
  @Prop({ type: [EducationLevel], _id: false })
  educationLevels: EducationLevel[];

  // Subjects configuration
  @Prop({ type: [Subject], _id: false })
  subjects: Subject[];

  // Grades configuration
  @Prop({ type: [Grade], _id: false })
  grades: Grade[];

  // Location options (admin-managed cities, districts, provinces for teacher profile)
  @Prop({ type: [LocationItem], _id: false })
  cities: LocationItem[];

  @Prop({ type: [LocationItem], _id: false })
  districts: LocationItem[];

  @Prop({ type: [LocationItem], _id: false })
  provinces: LocationItem[];

  // Profile sections configuration
  @Prop({ type: [ProfileSection], _id: false })
  profileSections: ProfileSection[];

  // Profile templates
  @Prop({ type: [ProfileTemplate], _id: false })
  profileTemplates: ProfileTemplate[];

  // Global settings
  @Prop({ type: Object })
  settings: {
    maxEducationLevels?: number;
    maxSubjectsPerLevel?: number;
    maxCustomFields?: number;
    allowCustomSections?: boolean;
    requireApproval?: boolean;
  };

  @Prop({ type: GeneralSettings, _id: false })
  generalSettings?: GeneralSettings;

  @Prop({ type: BrandingSettings, _id: false })
  brandingSettings?: BrandingSettings;

  @Prop({ type: Types.ObjectId, ref: 'User' })
  createdBy?: Types.ObjectId;

  @Prop({ type: Types.ObjectId, ref: 'User' })
  updatedBy?: Types.ObjectId;
}

export const DynamicConfigSchema = SchemaFactory.createForClass(DynamicConfig);

// Indexes
DynamicConfigSchema.index({ key: 1 });
DynamicConfigSchema.index({ active: 1 });
DynamicConfigSchema.index({ 'educationLevels.code': 1 });
DynamicConfigSchema.index({ 'subjects.code': 1 });
DynamicConfigSchema.index({ 'grades.code': 1 });
DynamicConfigSchema.index({ 'cities.code': 1 });
DynamicConfigSchema.index({ 'districts.code': 1 });
DynamicConfigSchema.index({ 'provinces.code': 1 });

// Methods
DynamicConfigSchema.methods.getEducationLevel = function (code: string) {
  return this.educationLevels?.find(level => level.code === code);
};

DynamicConfigSchema.methods.getSubject = function (code: string) {
  return this.subjects?.find(subject => subject.code === code);
};

DynamicConfigSchema.methods.getGrade = function (code: string) {
  return this.grades?.find(grade => grade.code === code);
};

DynamicConfigSchema.methods.getProfileSection = function (id: string) {
  return this.profileSections?.find(section => section.id === id);
};

DynamicConfigSchema.methods.getTemplate = function (id: string) {
  return this.profileTemplates?.find(template => template.id === id);
};

DynamicConfigSchema.methods.getActiveEducationLevels = function () {
  return this.educationLevels?.filter(level => level.active).sort((a, b) => a.order - b.order) || [];
};

DynamicConfigSchema.methods.getActiveSubjects = function () {
  return this.subjects?.filter(subject => subject.active).sort((a, b) => a.order - b.order) || [];
};

DynamicConfigSchema.methods.getActiveGrades = function () {
  return this.grades?.filter(grade => grade.active).sort((a, b) => a.order - b.order) || [];
};

DynamicConfigSchema.methods.getActiveCities = function () {
  return this.cities?.filter(c => c.active).sort((a, b) => a.order - b.order) || [];
};

DynamicConfigSchema.methods.getActiveDistricts = function () {
  return this.districts?.filter(d => d.active).sort((a, b) => a.order - b.order) || [];
};

DynamicConfigSchema.methods.getActiveProvinces = function () {
  return this.provinces?.filter(p => p.active).sort((a, b) => a.order - b.order) || [];
};
