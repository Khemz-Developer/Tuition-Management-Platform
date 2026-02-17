import { NestFactory } from '@nestjs/core';
import { AppModule } from '../src/app.module';
import { TeacherService } from '../src/teacher/teacher.service';
import { DynamicConfigService } from '../src/admin/dynamic-config.service';
import { TeacherProfile } from '../src/models/teacher-profile.schema';

/**
 * Migration script to convert existing teacher profiles to dynamic format
 * This script:
 * 1. Creates default dynamic configuration if it doesn't exist
 * 2. Migrates existing teacher profile data to dynamic format
 * 3. Preserves all existing data while adding new dynamic capabilities
 */

async function migrate() {
  console.log('🚀 Starting dynamic profile migration...');

  try {
    const app = await NestFactory.createApplicationContext(AppModule);
    const teacherService = app.get(TeacherService);
    const dynamicConfigService = app.get(DynamicConfigService);

    // 1. Ensure default configuration exists
    console.log('📋 Creating default configuration...');
    await dynamicConfigService.getConfig('default');
    console.log('✅ Default configuration ready');

    // 2. Get all existing teacher profiles
    console.log('👥 Fetching existing teacher profiles...');
    const teacherProfileModel = app.get('TeacherProfileModel');
    const existingProfiles = await teacherProfileModel.find({
      usesDynamicProfile: { $ne: true }
    });

    console.log(`📊 Found ${existingProfiles.length} profiles to migrate`);

    // 3. Define default profile sections for migration
    const defaultSections = [
      {
        id: 'basic-info',
        type: 'basic',
        title: 'Basic Information',
        description: 'Your basic profile information',
        visible: true,
        order: 0,
        required: true,
        size: 'medium' as const,
        config: {}
      },
      {
        id: 'education',
        type: 'education',
        title: 'Education & Subjects',
        description: 'Your educational background and subjects you teach',
        visible: true,
        order: 1,
        required: true,
        size: 'large' as const,
        config: {}
      },
      {
        id: 'experience',
        type: 'experience',
        title: 'Experience',
        description: 'Your teaching experience and qualifications',
        visible: true,
        order: 2,
        required: false,
        size: 'medium' as const,
        config: {}
      },
      {
        id: 'pricing',
        type: 'pricing',
        title: 'Pricing',
        description: 'Your pricing information',
        visible: true,
        order: 3,
        required: false,
        size: 'small' as const,
        config: {}
      },
      {
        id: 'contact',
        type: 'contact',
        title: 'Contact Information',
        description: 'How students can reach you',
        visible: true,
        order: 4,
        required: true,
        size: 'medium' as const,
        config: {}
      }
    ];

    // 4. Migrate each profile
    let migratedCount = 0;
    let errorCount = 0;

    for (const profile of existingProfiles) {
      try {
        // Create dynamic profile data from existing fields
        const sectionData: any = {
          'basic-info': {
            firstName: profile.firstName,
            lastName: profile.lastName,
            tagline: profile.tagline,
            bio: profile.bio,
            image: profile.image
          },
          'education': {
            educationLevels: profile.educationLevels || [],
            subjects: profile.subjects || [],
            grades: profile.grades || [],
            educationLevel: profile.educationLevel
          },
          'experience': {
            experience: profile.experience,
            experienceLevel: profile.experienceLevel,
            qualifications: profile.qualifications,
            teachingModes: profile.teachingModes
          },
          'pricing': {
            hourlyRate: profile.pricing?.hourlyRate,
            monthlyFee: profile.pricing?.monthlyFee,
            groupClassPrice: profile.pricing?.groupClassPrice
          },
          'contact': {
            location: profile.location,
            contact: profile.contact,
            languages: profile.languages,
            onlinePlatforms: profile.onlinePlatforms
          }
        };

        // Update profile with dynamic data
        await teacherProfileModel.updateOne(
          { _id: profile._id },
          {
            $set: {
              usesDynamicProfile: true,
              dynamicProfile: {
                sectionData,
                customFields: {},
                lastUpdated: new Date()
              },
              profileLayout: defaultSections
            }
          }
        );

        migratedCount++;
        console.log(`✅ Migrated profile: ${profile.firstName} ${profile.lastName}`);

      } catch (error) {
        errorCount++;
        console.error(`❌ Error migrating profile ${profile._id}:`, error);
      }
    }

    // 5. Summary
    console.log('\n📈 Migration Summary:');
    console.log(`✅ Successfully migrated: ${migratedCount} profiles`);
    console.log(`❌ Failed migrations: ${errorCount} profiles`);
    console.log(`📊 Total processed: ${existingProfiles.length} profiles`);

    if (errorCount === 0) {
      console.log('\n🎉 Migration completed successfully!');
    } else {
      console.log('\n⚠️ Migration completed with some errors. Please check the logs above.');
    }

    await app.close();
    process.exit(0);

  } catch (error) {
    console.error('💥 Migration failed:', error);
    process.exit(1);
  }
}

// Run migration if this file is executed directly
if (require.main === module) {
  migrate().catch(console.error);
}

export { migrate };
