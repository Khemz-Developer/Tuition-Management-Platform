import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { TeacherProfile, TeacherProfileDocument, TeacherStatus } from '../models/teacher-profile.schema';
import { Class, ClassDocument } from '../models/class.schema';
import { StudentProfile, StudentProfileDocument } from '../models/student-profile.schema';
import { User, UserDocument } from '../models/user.schema';
import { DynamicConfigService } from '../admin/dynamic-config.service';

@Injectable()
export class TeacherService {
  constructor(
    @InjectModel(TeacherProfile.name) private teacherProfileModel: Model<TeacherProfileDocument>,
    @InjectModel(Class.name) private classModel: Model<ClassDocument>,
    @InjectModel(StudentProfile.name) private studentProfileModel: Model<StudentProfileDocument>,
    @InjectModel(User.name) private userModel: Model<UserDocument>,
    private dynamicConfigService: DynamicConfigService,
  ) {}

  async getDashboard(teacherId: string) {
    const teacher = await this.teacherProfileModel.findOne({ userId: teacherId });
    if (!teacher) {
      throw new NotFoundException('Teacher profile not found');
    }

    const totalClasses = await this.classModel.countDocuments({ teacherId });
    // Add more stats as needed

    return {
      stats: {
        totalClasses,
        totalStudents: teacher.stats.totalStudents,
        upcomingSessions: 0,
        unreadMessages: 0,
      },
    };
  }

  async getProfile(teacherId: string) {
    let teacher = await this.teacherProfileModel
      .findOne({ userId: teacherId })
      .populate('userId', 'firstName lastName email');
    
    // If profile doesn't exist, create a default one
    if (!teacher) {
      // Get user info to create profile
      const user = await this.userModel.findById(teacherId);
      
      if (!user) {
        throw new NotFoundException('User not found');
      }
      
      // Create a default teacher profile - extract name from email or use defaults
      const emailName = user.email.split('@')[0];
      const slug = `teacher-${teacherId.substring(0, 8)}`;
      teacher = new this.teacherProfileModel({
        userId: teacherId,
        firstName: emailName || 'Teacher',
        lastName: 'Profile',
        slug,
        status: TeacherStatus.PENDING,
        subjects: [],
        grades: [],
      });
      await teacher.save();
      
      // Populate userId after save
      await teacher.populate('userId', 'firstName lastName email');
    }
    
    // Convert to plain object
    const teacherObj = teacher.toObject();
    
    // Convert availability Map to object if it exists
    if (teacherObj.availability && teacherObj.availability instanceof Map) {
      const availabilityObj: any = {};
      teacherObj.availability.forEach((value, key) => {
        availabilityObj[key] = value;
      });
      teacherObj.availability = availabilityObj;
    } else if (teacherObj.availability && typeof teacherObj.availability === 'object') {
      // Already an object, keep it as is
      teacherObj.availability = teacherObj.availability;
    }
    
    return teacherObj;
  }

  async updateProfile(teacherId: string, updateData: any) {
    let teacher = await this.teacherProfileModel.findOne({ userId: teacherId });
    
    // If profile doesn't exist, create a default one first
    if (!teacher) {
      const user = await this.userModel.findById(teacherId);
      if (!user) {
        throw new NotFoundException('User not found');
      }
      
      const emailName = user.email.split('@')[0];
      const slug = `teacher-${teacherId.substring(0, 8)}`;
      teacher = new this.teacherProfileModel({
        userId: teacherId,
        firstName: emailName || 'Teacher',
        lastName: 'Profile',
        slug,
        status: TeacherStatus.PENDING,
        subjects: [],
        grades: [],
      });
    }

    // Update basic fields
    if (updateData.tagline !== undefined) teacher.tagline = updateData.tagline;
    if (updateData.bio !== undefined) teacher.bio = updateData.bio;
    if (updateData.image !== undefined) teacher.image = updateData.image;
    
    // Handle education levels - new format takes precedence
    if (updateData.educationLevels !== undefined) {
      teacher.educationLevels = updateData.educationLevels;
      // Clear old single education level fields when using new format
      teacher.subjects = [];
      teacher.grades = [];
      teacher.educationLevel = '';
    } else if (updateData.subjects !== undefined) {
      // Legacy support for old format
      teacher.subjects = updateData.subjects;
    }
    if (updateData.grades !== undefined) teacher.grades = updateData.grades;
    
    if (updateData.experience !== undefined) teacher.experience = updateData.experience;
    if (updateData.experienceLevel !== undefined) teacher.experienceLevel = updateData.experienceLevel;
    if (updateData.qualifications !== undefined) teacher.qualifications = updateData.qualifications;
    
    // Legacy education level support (only if not using new format)
    if (updateData.educationLevel !== undefined && updateData.educationLevels === undefined) {
      teacher.educationLevel = updateData.educationLevel;
    }
    if (updateData.teachingModes !== undefined) teacher.teachingModes = updateData.teachingModes;
    if (updateData.languages !== undefined) teacher.languages = updateData.languages;
    if (updateData.studentTargetTypes !== undefined) teacher.studentTargetTypes = updateData.studentTargetTypes;
    if (updateData.onlinePlatforms !== undefined) teacher.onlinePlatforms = updateData.onlinePlatforms;

    // Update location
    if (updateData.location) {
      if (!teacher.location) {
        teacher.location = {} as any;
      }
      if (updateData.location.city !== undefined) teacher.location.city = updateData.location.city;
      if (updateData.location.district !== undefined) teacher.location.district = updateData.location.district;
      if (updateData.location.state !== undefined) teacher.location.state = updateData.location.state;
      if (updateData.location.address !== undefined) teacher.location.address = updateData.location.address;
    }

    // Update contact
    if (updateData.contact) {
      if (!teacher.contact) {
        teacher.contact = {} as any;
      }
      if (updateData.contact.phone !== undefined) teacher.contact.phone = updateData.contact.phone;
      if (updateData.contact.email !== undefined) teacher.contact.email = updateData.contact.email;
      if (updateData.contact.whatsapp !== undefined) teacher.contact.whatsapp = updateData.contact.whatsapp;
      if (updateData.contact.website !== undefined) teacher.contact.website = updateData.contact.website;
    }

    // Update pricing
    if (updateData.pricing) {
      if (!teacher.pricing) {
        teacher.pricing = {} as any;
      }
      if (updateData.pricing.hourlyRate !== undefined) teacher.pricing.hourlyRate = updateData.pricing.hourlyRate;
      if (updateData.pricing.monthlyFee !== undefined) teacher.pricing.monthlyFee = updateData.pricing.monthlyFee;
      if (updateData.pricing.groupClassPrice !== undefined) teacher.pricing.groupClassPrice = updateData.pricing.groupClassPrice;
      if (updateData.pricing.priceByGrade !== undefined) teacher.pricing.priceByGrade = updateData.pricing.priceByGrade;
    }

    // Update social links
    if (updateData.socialLinks) {
      if (!teacher.socialLinks) {
        teacher.socialLinks = {} as any;
      }
      if (updateData.socialLinks.linkedin !== undefined) teacher.socialLinks.linkedin = updateData.socialLinks.linkedin;
      if (updateData.socialLinks.youtube !== undefined) teacher.socialLinks.youtube = updateData.socialLinks.youtube;
      if (updateData.socialLinks.facebook !== undefined) teacher.socialLinks.facebook = updateData.socialLinks.facebook;
      if (updateData.socialLinks.twitter !== undefined) teacher.socialLinks.twitter = updateData.socialLinks.twitter;
      if (updateData.socialLinks.instagram !== undefined) teacher.socialLinks.instagram = updateData.socialLinks.instagram;
      if (updateData.socialLinks.whatsapp !== undefined) teacher.socialLinks.whatsapp = updateData.socialLinks.whatsapp;
    }

    // Update availability
    if (updateData.availability !== undefined) {
      if (Object.keys(updateData.availability).length > 0) {
        const availabilityMap = new Map();
        Object.keys(updateData.availability).forEach((day) => {
          availabilityMap.set(day, updateData.availability[day]);
        });
        teacher.availability = availabilityMap as any;
      } else {
        // Clear availability if empty object
        teacher.availability = new Map();
      }
    }

    await teacher.save();
    
    // Convert availability Map to object for response
    const response = teacher.toObject();
    if (response.availability && response.availability instanceof Map) {
      const availabilityObj: any = {};
      response.availability.forEach((value, key) => {
        availabilityObj[key] = value;
      });
      response.availability = availabilityObj;
    }
    
    return response;
  }

  async getClasses(teacherId: string, query: any) {
    const classes = await this.classModel.find({ teacherId });
    return { classes };
  }

  async createClass(teacherId: string, classData: any) {
    const inviteCode = Math.random().toString(36).substring(2, 10).toUpperCase();
    const classDoc = new this.classModel({
      ...classData,
      teacherId,
      inviteCode,
      inviteLink: `https://app.com/join/${inviteCode}`,
    });
    await classDoc.save();
    return { message: 'Class created successfully', class: classDoc };
  }

  async getWebsiteConfig(teacherId: string) {
    const teacher = await this.teacherProfileModel.findOne({ userId: teacherId });
    if (!teacher) {
      throw new NotFoundException('Teacher profile not found');
    }
    return { websiteConfig: teacher.websiteConfig || {} };
  }

  async updateWebsiteConfig(teacherId: string, config: any) {
    const teacher = await this.teacherProfileModel.findOne({ userId: teacherId });
    if (!teacher) {
      throw new NotFoundException('Teacher profile not found');
    }

    teacher.websiteConfig = config.websiteConfig;
    await teacher.save();
    return { message: 'Website configuration updated successfully', websiteConfig: teacher.websiteConfig };
  }

  async getRegisteredStudents(teacherId: string, query: any) {
    const teacher = await this.teacherProfileModel.findOne({ userId: teacherId });
    if (!teacher) {
      throw new NotFoundException('Teacher profile not found');
    }

    // Find all students who have this teacher in their preferredTeachers array
    const students = await this.studentProfileModel
      .find({ preferredTeachers: teacher._id })
      .populate('userId', 'email isActive')
      .sort({ registeredWithTeacherAt: -1 })
      .limit(query.limit || 50)
      .skip(query.skip || 0);

    const total = await this.studentProfileModel.countDocuments({ preferredTeachers: teacher._id });

    return {
      students,
      pagination: {
        total,
        limit: query.limit || 50,
        skip: query.skip || 0,
      },
    };
  }

  async getPublicConfig() {
    return await this.dynamicConfigService.getPublicConfig();
  }

  // Dynamic Profile Methods
  async getDynamicProfileConfig() {
    return await this.dynamicConfigService.getPublicConfig();
  }

  async getDynamicProfile(teacherId: string) {
    const teacher = await this.teacherProfileModel.findOne({ userId: teacherId });
    if (!teacher) {
      throw new NotFoundException('Teacher profile not found');
    }

    const config = await this.dynamicConfigService.getPublicConfig();
    
    return {
      teacher: teacher.toObject(),
      config,
      usesDynamicProfile: teacher.usesDynamicProfile,
      dynamicProfile: teacher.dynamicProfile,
      profileLayout: teacher.profileLayout,
    };
  }

  async updateDynamicProfile(teacherId: string, updateData: any) {
    const teacher = await this.teacherProfileModel.findOne({ userId: teacherId });
    if (!teacher) {
      throw new NotFoundException('Teacher profile not found');
    }

    // Enable dynamic profile if not already enabled
    if (!teacher.usesDynamicProfile) {
      teacher.usesDynamicProfile = true;
    }

    // Initialize dynamic profile if it doesn't exist
    if (!teacher.dynamicProfile) {
      teacher.dynamicProfile = {
        sectionData: {},
        customFields: {},
        lastUpdated: new Date(),
      };
    }

    // Update dynamic profile data
    if (updateData.sectionData) {
      teacher.dynamicProfile.sectionData = {
        ...teacher.dynamicProfile.sectionData,
        ...updateData.sectionData,
      };
    }

    if (updateData.customFields) {
      teacher.dynamicProfile.customFields = {
        ...teacher.dynamicProfile.customFields,
        ...updateData.customFields,
      };
    }

    if (updateData.templateId) {
      teacher.dynamicProfile.templateId = updateData.templateId;
    }

    // Update profile layout if provided
    if (updateData.profileLayout) {
      teacher.profileLayout = updateData.profileLayout;
    }

    teacher.dynamicProfile.lastUpdated = new Date();

    await teacher.save();

    // Convert to plain object and handle Map conversion
    const response = teacher.toObject();
    if (response.availability && response.availability instanceof Map) {
      const availabilityObj: any = {};
      response.availability.forEach((value, key) => {
        availabilityObj[key] = value;
      });
      response.availability = availabilityObj;
    }

    return response;
  }

  async enableDynamicProfile(teacherId: string, templateId?: string) {
    const teacher = await this.teacherProfileModel.findOne({ userId: teacherId });
    if (!teacher) {
      throw new NotFoundException('Teacher profile not found');
    }

    teacher.usesDynamicProfile = true;
    
    if (!teacher.dynamicProfile) {
      teacher.dynamicProfile = {
        sectionData: {},
        customFields: {},
        lastUpdated: new Date(),
        templateId,
      };
    } else if (templateId) {
      teacher.dynamicProfile.templateId = templateId;
    }

    await teacher.save();

    return { message: 'Dynamic profile enabled successfully', teacher: teacher.toObject() };
  }

  async disableDynamicProfile(teacherId: string) {
    const teacher = await this.teacherProfileModel.findOne({ userId: teacherId });
    if (!teacher) {
      throw new NotFoundException('Teacher profile not found');
    }

    teacher.usesDynamicProfile = false;
    await teacher.save();

    return { message: 'Dynamic profile disabled successfully' };
  }

  async updateProfileLayout(teacherId: string, layout: any[]) {
    const teacher = await this.teacherProfileModel.findOne({ userId: teacherId });
    if (!teacher) {
      throw new NotFoundException('Teacher profile not found');
    }

    teacher.profileLayout = layout;
    await teacher.save();

    return { message: 'Profile layout updated successfully', layout: teacher.profileLayout };
  }

  async getProfileTemplate(templateId: string) {
    const config = await this.dynamicConfigService.getConfig();
    const template = config.profileTemplates?.find(t => t.id === templateId);
    
    if (!template) {
      throw new NotFoundException(`Template with ID "${templateId}" not found`);
    }

    return template;
  }

  async applyProfileTemplate(teacherId: string, templateId: string) {
    const teacher = await this.teacherProfileModel.findOne({ userId: teacherId });
    if (!teacher) {
      throw new NotFoundException('Teacher profile not found');
    }

    const template = await this.getProfileTemplate(templateId);

    // Enable dynamic profile if not already enabled
    if (!teacher.usesDynamicProfile) {
      teacher.usesDynamicProfile = true;
    }

    if (!teacher.dynamicProfile) {
      teacher.dynamicProfile = {
        sectionData: {},
        customFields: {},
        lastUpdated: new Date(),
      };
    }

    // Apply template sections as profile layout
    teacher.profileLayout = template.sections.map(section => ({
      id: section.id,
      type: section.type,
      order: section.order,
      visible: section.visible,
      config: section.config || {},
    }));

    teacher.dynamicProfile.templateId = templateId;
    teacher.dynamicProfile.lastUpdated = new Date();

    await teacher.save();

    return { 
      message: 'Profile template applied successfully', 
      template: template.id,
      layout: teacher.profileLayout 
    };
  }
}
