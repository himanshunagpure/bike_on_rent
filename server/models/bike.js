import mongoose from "mongoose";

const BikeSchema = new mongoose.Schema(
  {
    /* ===============================
       OWNER INFORMATION
    =============================== */
    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true
    },

    /* ===============================
       BASIC BIKE DETAILS
    =============================== */
    bikeName: {
      type: String,
      required: true,
      trim: true
    },

    bikeNumber: {
      type: String,
      required: true,
      unique: true,
      uppercase: true,
      trim: true,
      match: /^[A-Z]{2}[0-9]{2}[A-Z]{1,2}[0-9]{4}$/
    },

    bikeType: {
      type: String,
      enum: ["bike", "scooty", "electric"],
      required: true
    },

    brand: {
      type: String,
      required: true,
      trim: true
    },

    model: {
      type: String,
      required: true,
      trim: true
    },

    year: {
      type: Number,
      required: true,
      min: 2000,
      max: new Date().getFullYear()
    },

    description: {
      type: String,
      maxlength: 1000
    },

    /* ===============================
       TECHNICAL DETAILS
    =============================== */
    fuelType: {
      type: String,
      enum: ["petrol", "electric", "hybrid"],
      required: true
    },

    transmission: {
      type: String,
      enum: ["manual", "automatic"],
      required: true
    },

    engineCapacity: {
      type: Number
    },

    mileage: {
      type: Number
    },

    /* ===============================
       PRICING
    =============================== */
    pricing: {
      perHour: {
        type: Number,
        required: true
      },
      perDay: {
        type: Number,
        required: true
      },
      weekendMultiplier: {
        type: Number,
        default: 1
      }
    },

    securityDeposit: {
      type: Number,
      required: true,
      min: 0
    },

    lateFeePerHour: {
      type: Number,
      default: 0
    },

    /* ===============================
       BOOKING RULES
    =============================== */
    bookingRules: {
      minHours: {
        type: Number,
        default: 1
      },
      maxHours: {
        type: Number,
        default: 72
      }
    },

    instantBooking: {
      type: Boolean,
      default: false
    },

    cancellationPolicy: {
      type: String,
      enum: ["flexible", "moderate", "strict"],
      default: "moderate"
    },

    /* ===============================
       AVAILABILITY SYSTEM
    =============================== */
    availability: {
      type: {
        type: String,
        enum: ["calendar", "always"],
        default: "calendar"
      },

      alwaysAvailable: {
        type: Boolean,
        default: false
      },

      calendar: [
        {
          start: Date,
          end: Date
        }
      ],

      weekly: {
        monday: { type: Boolean, default: true },
        tuesday: { type: Boolean, default: true },
        wednesday: { type: Boolean, default: true },
        thursday: { type: Boolean, default: true },
        friday: { type: Boolean, default: true },
        saturday: { type: Boolean, default: true },
        sunday: { type: Boolean, default: true }
      }
    },

    blockedDates: [
      {
        start: Date,
        end: Date
      }
    ],

    bookingLockUntil: {
      type: Date
    },

    isAvailable: {
      type: Boolean,
      default: true,
      index: true
    },

    totalRides: {
      type: Number,
      default: 0
    },

    /* ===============================
       LOCATION
    =============================== */
    location: {
      city: {
        type: String,
        required: true,
        index: true
      },
      addressLine: String,
      landmark: String,
      pincode: String,

      coordinates: {
        type: {
          type: String,
          enum: ["Point"],
          default: "Point"
        },
        coordinates: {
          type: [Number], // [lng, lat]
          required: true
        }
      }
    },

    /* ===============================
       DOCUMENTS (MANDATORY)
    =============================== */
    documents: {
      rcBook: {
        url: { type: String, required: true },
        verified: { type: Boolean, default: false }
      },
      insurance: {
        url: { type: String, required: true },
        validTill: { type: Date, required: true },
        verified: { type: Boolean, default: false }
      },
      pollution: {
        url: { type: String, required: true },
        validTill: { type: Date, required: true }
      }
    },

    /* ===============================
       MEDIA
    =============================== */
    images: {
      type: [String],
      validate: [arr => arr.length >= 2, "Minimum 2 images required"]
    },

    /* ===============================
       RATING
    =============================== */
    rating: {
      average: {
        type: Number,
        default: 0,
        min: 0,
        max: 5
      },
      totalReviews: {
        type: Number,
        default: 0
      }
    },

    /* ===============================
       ADMIN CONTROL
    =============================== */
    adminStatus: {
      type: String,
      enum: ["pending", "approved", "rejected"],
      default: "pending",
      index: true
    },

    rejectionReason: String,

    isDeleted: {
      type: Boolean,
      default: false,
      index: true
    }
  },
  {
    timestamps: true
  }
);

/* ===============================
   INDEXES
=============================== */

// Geo search
BikeSchema.index({ "location.coordinates": "2dsphere" });

// Search
BikeSchema.index({ bikeName: "text", brand: "text", model: "text" });

// Filter optimization
BikeSchema.index({ isAvailable: 1, adminStatus: 1 });

export default mongoose.models.Bike || mongoose.model("Bike", BikeSchema);