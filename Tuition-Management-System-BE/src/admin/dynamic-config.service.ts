import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { DynamicConfig, DynamicConfigDocument } from '../models/dynamic-config.schema';

@Injectable()
export class DynamicConfigService {
  constructor(
    @InjectModel(DynamicConfig.name) private dynamicConfigModel: Model<DynamicConfigDocument>,
  ) {}

  async getConfig(key: string = 'default'): Promise<DynamicConfigDocument> {
    let config = await this.dynamicConfigModel.findOne({ key, active: true });
    
    if (!config) {
      // Create default configuration if it doesn't exist
      const newConfig = await this.createDefaultConfig(key);
      config = await this.dynamicConfigModel.findOne({ key, active: true });
    }
    
    return config as DynamicConfigDocument;
  }

  async updateConfig(key: string, updateData: Partial<DynamicConfig>): Promise<DynamicConfigDocument> {
    const config = await this.dynamicConfigModel.findOne({ key });
    
    if (!config) {
      throw new NotFoundException(`Configuration with key "${key}" not found`);
    }

    Object.assign(config, updateData);
    await config.save();
    
    return config;
  }

  async addEducationLevel(key: string, educationLevel: any): Promise<DynamicConfigDocument> {
    const config = await this.getConfig(key);
    
    // Check if education level already exists
    const existingLevel = config.educationLevels?.find(level => level.code === educationLevel.code);
    if (existingLevel) {
      throw new BadRequestException(`Education level with code "${educationLevel.code}" already exists`);
    }

    if (!config.educationLevels) {
      config.educationLevels = [];
    }
    
    config.educationLevels.push(educationLevel);
    await config.save();
    
    return config;
  }

  async updateEducationLevel(key: string, levelCode: string, updateData: any): Promise<DynamicConfigDocument> {
    const config = await this.getConfig(key);
    
    const levelIndex = config.educationLevels?.findIndex(level => level.code === levelCode);
    if (levelIndex === -1 || levelIndex === undefined) {
      throw new NotFoundException(`Education level with code "${levelCode}" not found`);
    }

    Object.assign(config.educationLevels[levelIndex], updateData);
    await config.save();
    
    return config;
  }

  async removeEducationLevel(key: string, levelCode: string): Promise<DynamicConfigDocument> {
    const config = await this.getConfig(key);
    
    config.educationLevels = config.educationLevels?.filter(level => level.code !== levelCode);
    await config.save();
    
    return config;
  }

  async addSubject(key: string, subject: any): Promise<DynamicConfigDocument> {
    const config = await this.getConfig(key);
    
    // Check if subject already exists
    const existingSubject = config.subjects?.find(subj => subj.code === subject.code);
    if (existingSubject) {
      throw new BadRequestException(`Subject with code "${subject.code}" already exists`);
    }

    if (!config.subjects) {
      config.subjects = [];
    }
    
    config.subjects.push(subject);
    await config.save();
    
    return config;
  }

  async updateSubject(key: string, subjectCode: string, updateData: any): Promise<DynamicConfigDocument> {
    const config = await this.getConfig(key);
    
    const subjectIndex = config.subjects?.findIndex(subject => subject.code === subjectCode);
    if (subjectIndex === -1 || subjectIndex === undefined) {
      throw new NotFoundException(`Subject with code "${subjectCode}" not found`);
    }

    Object.assign(config.subjects[subjectIndex], updateData);
    await config.save();
    
    return config;
  }

  async removeSubject(key: string, subjectCode: string): Promise<DynamicConfigDocument> {
    const config = await this.getConfig(key);
    
    config.subjects = config.subjects?.filter(subject => subject.code !== subjectCode);
    await config.save();
    
    return config;
  }

  async addGrade(key: string, grade: any): Promise<DynamicConfigDocument> {
    const config = await this.getConfig(key);
    
    // Check if grade already exists
    const existingGrade = config.grades?.find(g => g.code === grade.code);
    if (existingGrade) {
      throw new BadRequestException(`Grade with code "${grade.code}" already exists`);
    }

    if (!config.grades) {
      config.grades = [];
    }
    
    config.grades.push(grade);
    await config.save();
    
    return config;
  }

  async updateGrade(key: string, gradeCode: string, updateData: any): Promise<DynamicConfigDocument> {
    const config = await this.getConfig(key);
    
    const gradeIndex = config.grades?.findIndex(grade => grade.code === gradeCode);
    if (gradeIndex === -1 || gradeIndex === undefined) {
      throw new NotFoundException(`Grade with code "${gradeCode}" not found`);
    }

    Object.assign(config.grades[gradeIndex], updateData);
    await config.save();
    
    return config;
  }

  async removeGrade(key: string, gradeCode: string): Promise<DynamicConfigDocument> {
    const config = await this.getConfig(key);
    
    config.grades = config.grades?.filter(grade => grade.code !== gradeCode);
    await config.save();
    
    return config;
  }

  async addProfileSection(key: string, section: any): Promise<DynamicConfigDocument> {
    const config = await this.getConfig(key);
    
    // Check if section already exists
    const existingSection = config.profileSections?.find(sec => sec.id === section.id);
    if (existingSection) {
      throw new BadRequestException(`Profile section with ID "${section.id}" already exists`);
    }

    if (!config.profileSections) {
      config.profileSections = [];
    }
    
    config.profileSections.push(section);
    await config.save();
    
    return config;
  }

  async updateProfileSection(key: string, sectionId: string, updateData: any): Promise<DynamicConfigDocument> {
    const config = await this.getConfig(key);
    
    const sectionIndex = config.profileSections?.findIndex(section => section.id === sectionId);
    if (sectionIndex === -1 || sectionIndex === undefined) {
      throw new NotFoundException(`Profile section with ID "${sectionId}" not found`);
    }

    Object.assign(config.profileSections[sectionIndex], updateData);
    await config.save();
    
    return config;
  }

  async removeProfileSection(key: string, sectionId: string): Promise<DynamicConfigDocument> {
    const config = await this.getConfig(key);
    
    config.profileSections = config.profileSections?.filter(section => section.id !== sectionId);
    await config.save();
    
    return config;
  }

  async reorderProfileSections(key: string, sectionOrders: { id: string; order: number }[]): Promise<DynamicConfigDocument> {
    const config = await this.getConfig(key);
    
    sectionOrders.forEach(({ id, order }) => {
      const section = config.profileSections?.find(sec => sec.id === id);
      if (section) {
        section.order = order;
      }
    });
    
    // Sort sections by order
    config.profileSections?.sort((a, b) => a.order - b.order);
    
    await config.save();
    return config;
  }

  async addProfileTemplate(key: string, template: any): Promise<DynamicConfigDocument> {
    const config = await this.getConfig(key);
    
    // Check if template already exists
    const existingTemplate = config.profileTemplates?.find(tmpl => tmpl.id === template.id);
    if (existingTemplate) {
      throw new BadRequestException(`Profile template with ID "${template.id}" already exists`);
    }

    if (!config.profileTemplates) {
      config.profileTemplates = [];
    }
    
    config.profileTemplates.push(template);
    await config.save();
    
    return config;
  }

  async updateProfileTemplate(key: string, templateId: string, updateData: any): Promise<DynamicConfigDocument> {
    const config = await this.getConfig(key);
    
    const templateIndex = config.profileTemplates?.findIndex(template => template.id === templateId);
    if (templateIndex === -1 || templateIndex === undefined) {
      throw new NotFoundException(`Profile template with ID "${templateId}" not found`);
    }

    Object.assign(config.profileTemplates[templateIndex], updateData);
    await config.save();
    
    return config;
  }

  async removeProfileTemplate(key: string, templateId: string): Promise<DynamicConfigDocument> {
    const config = await this.getConfig(key);
    
    config.profileTemplates = config.profileTemplates?.filter(template => template.id !== templateId);
    await config.save();
    
    return config;
  }

  async getPublicConfig(): Promise<any> {
    const config = await this.getConfig();
    
    // Return only public-facing configuration
    return {
      educationLevels: config.educationLevels?.filter(level => level.active).sort((a, b) => a.order - b.order) || [],
      subjects: config.subjects?.filter(subject => subject.active).sort((a, b) => a.order - b.order) || [],
      grades: config.grades?.filter(grade => grade.active).sort((a, b) => a.order - b.order) || [],
      profileSections: config.profileSections?.filter(section => section.visible) || [],
      profileTemplates: config.profileTemplates?.filter(template => template.active) || [],
      settings: config.settings,
    };
  }

  private async createDefaultConfig(key: string): Promise<DynamicConfigDocument> {
    const defaultConfigData = {
      key,
      name: 'Default Configuration',
      description: 'Default dynamic configuration for teacher profiles',
      active: true,
      educationLevels: [
        {
          code: 'PRIMARY',
          name: 'Primary Education',
          description: 'Grades 1-5',
          active: true,
          order: 1,
          defaultGrades: ['1', '2', '3', '4', '5'],
          customFields: []
        },
        {
          code: 'OL',
          name: 'Ordinary Level',
          description: 'Grades 6-11',
          active: true,
          order: 2,
          defaultGrades: ['6', '7', '8', '9', '10', '11'],
          customFields: []
        },
        {
          code: 'AL',
          name: 'Advanced Level',
          description: 'Grades 12-13',
          active: true,
          order: 3,
          defaultGrades: ['12', '13'],
          customFields: []
        }
      ],
      subjects: [
        {
          code: 'MATHEMATICS',
          name: 'Mathematics',
          description: 'Mathematics and related subjects',
          educationLevels: ['PRIMARY', 'OL', 'AL'],
          active: true,
          order: 1,
          categories: ['STEM', 'Core'],
          customFields: []
        },
        {
          code: 'SCIENCE',
          name: 'Science',
          description: 'Science subjects',
          educationLevels: ['OL', 'AL'],
          active: true,
          order: 2,
          categories: ['STEM'],
          customFields: []
        },
        {
          code: 'ENGLISH',
          name: 'English',
          description: 'English language',
          educationLevels: ['PRIMARY', 'OL', 'AL'],
          active: true,
          order: 3,
          categories: ['Languages'],
          customFields: []
        }
      ],
      grades: [
        { code: '1', name: 'Grade 1', educationLevels: ['PRIMARY'], active: true, order: 1 },
        { code: '2', name: 'Grade 2', educationLevels: ['PRIMARY'], active: true, order: 2 },
        { code: '3', name: 'Grade 3', educationLevels: ['PRIMARY'], active: true, order: 3 },
        { code: '4', name: 'Grade 4', educationLevels: ['PRIMARY'], active: true, order: 4 },
        { code: '5', name: 'Grade 5', educationLevels: ['PRIMARY'], active: true, order: 5 },
        { code: '6', name: 'Grade 6', educationLevels: ['OL'], active: true, order: 6 },
        { code: '7', name: 'Grade 7', educationLevels: ['OL'], active: true, order: 7 },
        { code: '8', name: 'Grade 8', educationLevels: ['OL'], active: true, order: 8 },
        { code: '9', name: 'Grade 9', educationLevels: ['OL'], active: true, order: 9 },
        { code: '10', name: 'Grade 10', educationLevels: ['OL'], active: true, order: 10 },
        { code: '11', name: 'Grade 11', educationLevels: ['OL'], active: true, order: 11 },
        { code: '12', name: 'Grade 12', educationLevels: ['AL'], active: true, order: 12 },
        { code: '13', name: 'Grade 13', educationLevels: ['AL'], active: true, order: 13 }
      ],
      profileSections: [],
      profileTemplates: [],
      settings: {
        maxEducationLevels: 10,
        maxSubjectsPerLevel: 20,
        maxCustomFields: 50,
        allowCustomSections: true,
        requireApproval: false
      }
    };

    const defaultConfig = new this.dynamicConfigModel(defaultConfigData);
    return await defaultConfig.save();
  }
}
