import bcrypt from 'bcryptjs';
import { connectDatabase } from '../config/database';
import { User } from '../models/User';
import { VendorProfile } from '../models/VendorProfile';
import { DynamicForm } from '../models/DynamicForm';

async function seed(): Promise<void> {
  await connectDatabase();

  const adminExists = await User.findOne({ email: 'admin@apex.com' });
  if (!adminExists) {
    const hashedPassword = await bcrypt.hash('123456', 12);
    await User.create({
      email: 'admin@apex.com',
      password: hashedPassword,
      firstName: 'System',
      lastName: 'Admin',
      role: 'admin',
      status: 'approved',
      isActive: true,
    });
    console.log('Admin user created: admin@apex.com');
  }

  const staffExists = await User.findOne({ email: 'staff@apex.com' });
  if (!staffExists) {
    const hashedPassword = await bcrypt.hash('123456', 12);
    await User.create({
      email: 'staff@apex.com',
      password: hashedPassword,
      firstName: 'Sarah',
      lastName: 'Lim',
      role: 'staff',
      status: 'approved',
      isActive: true,
      department: 'Procurement',
    });
    console.log('Staff user created: staff@apex.com');
  }

  const vendorExists = await User.findOne({ email: 'vendor@pantech.com' });
  if (!vendorExists) {
    const hashedPassword = await bcrypt.hash('123456', 12);
    const vendor = await User.create({
      email: 'vendor@pantech.com',
      password: hashedPassword,
      firstName: 'Ahmad',
      lastName: 'Rahman',
      role: 'vendor',
      status: 'approved',
      isActive: true,
    });
    await VendorProfile.create({
      userId: vendor._id,
      companyName: 'Pantech Solutions Sdn Bhd',
      vendorGroup: 'Pantech Group',
      parentCompany: 'Pantech Group Holdings Berhad',
      supplyingEntity: 'Pantech Corporation Sdn. Bhd.',
      businessRegistrationNumber: '201801012345',
      country: 'Malaysia',
      address: '12, Jalan Teknologi 3/4, Kota Damansara, 47810 Petaling Jaya, Selangor',
      website: 'https://pantech-group.com',
      companyEmail: 'vendor@pantech.com',
      companyPhone: '+60 12 345 6789',
      primaryContactName: 'Ahmad Rahman',
      primaryContactEmail: 'vendor@pantech.com',
      primaryContactPhone: '+60 3 1234 5678',
      vendorCategory: 'Industrial Piping Components',
      products: "Steel Pipes, Fittings, Flanges, Valves",
      companyDescription: 'Leading supplier of industrial piping components for oil & gas sector.',
      status: 'approved',
    });
    console.log('Vendor user created: vendor@pantech.com');
  }

  const formExists = await DynamicForm.findOne();
  if (!formExists) {
    const admin = await User.findOne({ role: 'admin' });
    if (admin) {
      await DynamicForm.create({
        name: 'Vendor Onboarding Form',
        description: 'Standard vendor qualification and onboarding form',
        isActive: true,
        version: 1,
        createdBy: admin._id,
        fields: [
          {
            label: 'Company Legal Name',
            key: 'company_legal_name',
            type: 'text',
            placeholder: 'Enter legal company name',
            required: true,
            order: 0,
            helpText: 'As registered with authorities',
          },
          {
            label: 'Business Registration Certificate',
            key: 'business_registration',
            type: 'file',
            required: true,
            order: 1,
            documentType: 'Business Registration',
            acceptedFileTypes: ['.pdf', '.jpg', '.png'],
            maxFileSize: 5242880,
            helpText: 'Upload your business registration document (max 5MB)',
          },
          {
            label: 'Tax Identification Number',
            key: 'tax_id',
            type: 'text',
            placeholder: 'Enter TIN',
            required: true,
            order: 2,
          },
          {
            label: 'Company Website',
            key: 'company_website',
            type: 'website',
            placeholder: 'https://www.example.com',
            required: false,
            order: 3,
          },
          {
            label: 'Primary Contact Email',
            key: 'contact_email',
            type: 'email',
            placeholder: 'contact@company.com',
            required: true,
            order: 4,
          },
          {
            label: 'Business Category',
            key: 'business_category',
            type: 'dropdown',
            required: true,
            order: 5,
            options: ['Manufacturing', 'Services', 'Trading', 'Construction', 'Technology', 'Other'],
          },
          {
            label: 'Years in Business',
            key: 'years_in_business',
            type: 'number',
            placeholder: 'e.g. 10',
            required: true,
            order: 6,
          },
          {
            label: 'ISO Certification',
            key: 'iso_certification',
            type: 'radio',
            required: false,
            order: 7,
            options: ['Yes', 'No'],
          },
          {
            label: 'Services Offered',
            key: 'services_offered',
            type: 'checkbox',
            required: true,
            order: 8,
            options: ['Equipment Supply', 'Maintenance', 'Consulting', 'Installation', 'Training'],
          },
          {
            label: 'Company Profile Document',
            key: 'company_profile',
            type: 'file',
            required: true,
            order: 9,
            documentType: 'Company Profile',
            acceptedFileTypes: ['.pdf'],
            maxFileSize: 10485760,
            helpText: 'Upload company profile (PDF, max 10MB)',
          },
        ],
      });
      console.log('Default onboarding form created');
    }
  }

  console.log('Seed completed');
  process.exit(0);
}

seed().catch((error) => {
  console.error('Seed failed:', error);
  process.exit(1);
});
