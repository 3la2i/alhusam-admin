const mongoose = require('mongoose');

// تعريف النموذج لطلبات مزود الخدمة
const providerApplicationSchema = new mongoose.Schema({
  fullName: {
    type: String,
    required: [true, 'الاسم الكامل مطلوب'],
    trim: true
  },
  phoneNumber: {
    type: String,
    required: [true, 'رقم الهاتف مطلوب']
  },
  email: {
    type: String,
    required: [true, 'البريد الإلكتروني مطلوب'],
    trim: true
  },
  address: {
    type: String,
    required: [true, 'العنوان مطلوب'],
    trim: true
  },
  productType: {
    type: [String],
    required: [true, 'نوع المنتجات مطلوب'],
    enum: {
      values: ['مصنوعات يدوية', 'ملابس', 'طعام', 'أكسسوارات', 'أخرى'],
      message: 'نوع المنتج غير صالح'
    }
  },
  skillsDescription: {
    type: String,
    trim: true,
    required: [true, 'وصف المهارات مطلوب']
  },
  productImages: [{
    type: String
  }],
  socialMediaLinks: [{
    type: String
  }],
  status: {
    type: String,
    enum: ['قيد المراجعة', 'مقبول', 'مرفوض'],
    default: 'قيد المراجعة'
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  }
}, {
  timestamps: true
});

// إنشاء النموذج
const ProviderApplication = mongoose.model('ProviderApplication', providerApplicationSchema);

module.exports = ProviderApplication;