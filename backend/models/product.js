// const mongoose = require('mongoose');

// // تعريف النموذج مع إضافة التحقق
// const productSchema = new mongoose.Schema({
//   title: {
//     type: String,
//     required: [true, 'اسم المنتج مطلوب'],
//     trim: true
//   },
//   titleAr: {
//     type: String,
//     required: [true, 'اسم المنتج بالعربية مطلوب'],
//     trim: true
//   },
//   seller: {
//     type: mongoose.Schema.Types.ObjectId,
//     ref: 'User',
//     required: [true, 'البائع مطلوب']
//   },
//   description: {
//     type: String,
//     trim: true,
//     required: [true, 'وصف المنتج مطلوب']
//   },
//   mainImage: {
//     type: String,
//     required: [true, 'الصورة الرئيسية مطلوبة'],
//     validate: {
//       validator: function(v) {
//         // التحقق من صحة رابط الصورة
//         return /^https?:\/\/.+/.test(v);
//       },
//       message: 'رابط الصورة غير صالح'
//     }
//   },
//   additionalImages: [{
//     type: String,
//     validate: {
//       validator: function(v) {
//         // التحقق من صحة روابط الصور
//         return /^https?:\/\/.+/.test(v);
//       },
//       message: 'رابط الصورة غير صالح'
//     }
//   }],
//   price: {
//     type: Number,
//     required: [true, 'السعر مطلوب'],
//     min: [0, 'السعر يجب أن يكون 0 أو أكثر']
//   },
//   category: {
//     type: String,
//     enum: {
//       values: ['ملابس', 'طعام', 'مصنوعات يدوية', 'أكسسوارات', 'أخرى'],
//       message: 'الفئة غير صالحة'
//     },
//     required: [true, 'الفئة مطلوبة']
//   },
//   stock: {
//     type: Number,
//     required: [true, 'الكمية المتاحة مطلوبة'],
//     min: [0, 'الكمية يجب أن تكون 0 أو أكثر'],
//     default: 1
//   },
//   size: { 
//     type: String,
//     trim: true
//   },
//   color: { 
//     type: String,
//     trim: true
//   },
//   material: { 
//     type: String,
//     trim: true
//   },
//   isHandmade: {
//     type: Boolean,
//     default: false
//   },
//   isActive: { 
//     type: Boolean, 
//     default: true 
//   },
//   isDeleted: { 
//     type: Boolean, 
//     default: false 
//   },
//   views: { 
//     type: Number, 
//     default: 0,
//     min: 0
//   },
//   purchaseCount: {
//     type: Number,
//     default: 0,
//     min: 0
//   },
//   reviews: [{
//     user: {
//       type: mongoose.Schema.Types.ObjectId,
//       ref: 'User'
//     },
//     rating: {
//       type: Number,
//       min: 1,
//       max: 5
//     },
//     comment: {
//       type: String,
//       trim: true
//     },
//     createdAt: {
//       type: Date,
//       default: Date.now
//     }
//   }],
//   averageRating: {
//     type: Number,
//     default: 0,
//     min: 0,
//     max: 5
//   }
// }, { 
//   timestamps: true
// });

// // الفهارس
// productSchema.index({ category: 1 });
// productSchema.index({ seller: 1 });
// productSchema.index({ isActive: 1, isDeleted: 1 });

// // دالة للتحقق قبل الحفظ
// productSchema.pre('save', async function(next) {
//   try {
//     // التحقق من وجود البائع
//     const User = mongoose.model('User');
//     const sellerExists = await User.findById(this.seller);
//     if (!sellerExists) throw new Error('البائع غير موجود');

//     // حساب متوسط التقييم
//     if (this.reviews && this.reviews.length > 0) {
//       const totalRating = this.reviews.reduce((sum, review) => sum + review.rating, 0);
//       this.averageRating = totalRating / this.reviews.length;
//     }

//     next();
//   } catch (error) {
//     next(error);
//   }
// });

// const Product = mongoose.model('Product', productSchema);

// module.exports = Product;



const mongoose = require("mongoose");


// تعريف النموذج مع إضافة التحقق
const productSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      // required: [true, "اسم المنتج مطلوب"],
      trim: true,
    },
    titleAr: {
      type: String,
      required: [true, "اسم المنتج بالعربية مطلوب"],
      trim: true,
    },
    seller: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: [true, "البائع مطلوب"],
    },
    description: {
      type: String,
      trim: true,
      required: [true, "وصف المنتج مطلوب"],
    },
    mainImage: {
      type: String,
      required: [true, "الصورة الرئيسية مطلوبة"],
      validate: {
        validator: function (v) {
          // التحقق من صحة رابط الصورة
          return /^https?:\/\/.+/.test(v);
        },
        message: "رابط الصورة غير صالح",
      },
    },
    additionalImages: [
      {
        type: String,
        validate: {
          validator: function (v) {
            // التحقق من صحة روابط الصور
            return /^https?:\/\/.+/.test(v);
          },
          message: "رابط الصورة غير صالح",
        },
      },
    ],
    price: {
      type: Number,
      required: [true, "السعر مطلوب"],
      min: [0, "السعر يجب أن يكون 0 أو أكثر"],
    },
    category: {
      type: String,
      enum: {
        values: ["ملابس", "طعام", "مصنوعات يدوية", "اكسسوارات", "أخرى"],
        message: "الفئة غير صالحة",
      },
      required: [true, "الفئة مطلوبة"],

    },
    stock: {
      type: Number,
      required: [true, "الكمية المتاحة مطلوبة"],
      min: [0, "الكمية يجب أن تكون 0 أو أكثر"],
      // default: 1,
    },
    size: {
      type: String,
      trim: true,
    },
    color: {
      type: String,
      trim: true,
    },
    material: {
      type: String,
      trim: true,
    },
    isHandmade: {
      type: Boolean,
      default: false,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    isDeleted: {
      type: Boolean,
      default: false,
    },
    views: {
      type: Number,
      default: 0,
      min: 0,
    },
    purchaseCount: {
      type: Number,
      default: 0,
      min: 0,
    },
    reviews: [
      {
        user: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "User",
        },
        rating: {
          type: Number,
          min: 1,
          max: 5,
        },
        comment: {
          type: String,
          trim: true,
        },
        createdAt: {
          type: Date,
          default: Date.now,
        },
      },
    ],
    averageRating: {
      type: Number,
      default: 0,
      min: 0,
      max: 5,
    },
  },
  {
    timestamps: true,
  }
);

// الفهارس
productSchema.index({ category: 1 });
productSchema.index({ seller: 1 });
productSchema.index({ isActive: 1, isDeleted: 1 });

// دالة للتحقق قبل الحفظ
productSchema.pre("save", async function (next) {
  try {
    // التحقق من وجود البائع
    const User = mongoose.model("User");
    const sellerExists = await User.findById(this.seller);
    if (!sellerExists) throw new Error("البائع غير موجود");

    // حساب متوسط التقييم
    if (this.reviews && this.reviews.length > 0) {
      const totalRating = this.reviews.reduce(
        (sum, review) => sum + review.rating,
        0
      );
      this.averageRating = totalRating / this.reviews.length;
    }

    next();
  } catch (error) {
    next(error);
  }
});

const Product = mongoose.model("Product", productSchema);

module.exports = Product;
