const mongoose = require('mongoose')

const reviewSchema = new mongoose.Schema(
  {
    houseCare: {
      type: Number,
      min: 0,
      max: 5
    },
    gardenCare: {
      type: Number,
      min: 0,
      max: 5
    },
    petCare: {
      type: Number,
      min: 0,
      max: 5
    },
    communication: {
      type: Number,
      min: 0,
      max: 5
    },
    comment: {
      type: String
    }
  }
);

const houseSitterSchema = mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Please enter your name."],
      minlength: 1,
      maxlength: 50

    },
    surname: {
      type: String,
      required: [true, "Please enter your surname."],
      minlength: 1,
      maxlength: 50
    },
    email: {
      type: String,
      required: [true, "Please enter your Email."],
      minlength: 5,
      maxlength: 255,
      unique: true
    },
    phonenumber: {
      type: String,
      required: [true, "Please enter your phone number."]
    },
    password: {
      type: String,
      required: [true, "Password should have more than 8 characters."],
      minlength: 8,
      maxlength: 1024
    },
    age: {
      type: Number,
      required: true
    },
    Tagline: {
      type: String,
      required: [true, "Please enter a tagline to describe yourself or highlight your unique qualities."],
      unique: true
    },
    occupation: {
      type: String,
      required: true
    },
    address: {
      country: {
        type: String,
        required: true
      },
      postalAddress: {
        type: String,
        required: true
      },
      city: {
        type: String
      },
      state: {
        type: String,
        required: true
      },
      zipCode: {
        type: String,
        required: true
      }
    },
    isCouple: {
      type: Boolean,
      default: false
    },
    partner: {
      name: {
        type: String
      },
      age: {
        type: Number
      },
      occupation: {
        type: String
      }
    },
    photos: [{
      type: String
    }],
    bio: {
      type: String,
      maxlength: 2000
    },
    // Review system
    reviews: [reviewSchema],

    // Calculate overall rating based on individual category ratings
    overallRating: {
      type: Number,
      min: 0,
      max: 5,
      default: 0
    },
    // Preferences for location, type of pet and housesit duration
    preferences: {
      locations: [{
        type: String,
        // This has to be like : 'Anywhere in the United States', Florida: Central, Central East, Central West, North Central, Northeast, Northwest, Georgia, North Carolina, South Carolina, Tennessee: East, Middle, Virginia: Central, Eastern Shore, Shenandoah Valley, Southwestern, Tidewater, West Virginia
        enum: ['Urban', 'Suburban', 'Rural']
      }],
      petTypes: [{
        type: String,
        enum: ['Cats', 'Dogs', 'Birds', 'Fish', 'Rabbits/Guinea Pigs', 'Reptiles', 'Chickens/Ducks/Geese', 'Farm Animals']
      }],
      housesitDuration: [{
        type: String,
        enum: ['Weekend', '0 - 1 week', '1 - 2 weeks', '2 - 4 weeks', '1 - 2 months', '2 months +']
      }]
    }
  },
  {
    timestamps: true
  } 
)

// Pre-save hook to calculate the overall rating based on individual category ratings
houseSitterSchema.pre('save', function (next) {
  if (this.reviews.length > 0) {
    const totalHouseCareRating = this.reviews.reduce((total, review) => total + review.houseCare, 0);
    const totalGardenCareRating = this.reviews.reduce((total, review) => total + review.gardenCare, 0);
    const totalPetCareRating = this.reviews.reduce((total, review) => total + review.petCare, 0);
    const totalCommunicationRating = this.reviews.reduce((total, review) => total + review.communication, 0);

    const totalReviews = this.reviews.length;
    this.overallRating =
      (totalHouseCareRating + totalGardenCareRating + totalPetCareRating + totalCommunicationRating) /
      (4 * totalReviews);
  }

  next();
});

const HouseSitter = mongoose.model('HouseSitter', houseSitterSchema);

module.exports = HouseSitter