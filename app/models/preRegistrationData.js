const mongoose = require('mongoose')
const bcrypt = require('bcrypt-nodejs')
const validator = require('validator')
const mongoosePaginate = require('mongoose-paginate-v2')

const preRegistrationDataSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      // unique:true,
      required: true
    },
    // onboarding process
    step1: {
      first_name: {
        type: String
      },
      last_name: {
        type: String
      },
      designation_id: {
        type: mongoose.Types.ObjectId
        //
      },
      // designation_id:{
      //   type:String,
      //   required:true
      // },
      password: {
        type: String
      },
      cnfm_password: {
        type: String
      },
      check1: {
        type: Boolean,
        default: false
      },
      check2: {
        type: Boolean,
        default: false
      },
      check3: {
        type: Boolean,
        default: false
      },
      check4: {
        type: Boolean,
        default: false
      }
    },
    step2: {
      company_details: {
        company_name: { type: String },
        company_number: { type: String },
        company_vat: { type: String },
        profile_image: { type: String },
        user_type: { type: mongoose.Types.ObjectId }
      },
      administrator_details: {
        full_name: {
          type: String
        },
        first_name: {
          type: String
        },
        last_name: {
          type: String
        },
        office_name: {
          type: String
          // default: "",
        },
        designation_id: {
          type: mongoose.Schema.Types.ObjectId // Assuming it's a reference to another document
        },
        department: {
          type: String
          // default: "",
        },
        admin_profile: {
          type: String
          // default: "",
        },
        country_code: {
          type: String
          // default: "",
        },
        phone: {
          type: String
          // default: "",
        },
        office_email: {
          type: String,
          // default: "",
          match: /.+\@.+\..+/
        }
      },
      admin_rights: {
        allowed_to_onboard_users: {
          type: Boolean
          // default: false,
        },
        allowed_to_deregister_users: {
          type: Boolean
          // default: false,
        },
        allowed_to_assign_users_rights: {
          type: Boolean
          // default: false,
        },
        allowed_to_set_financial_limit: {
          type: Boolean
          // default: false,
        },
        allowed_complete_access: {
          type: Boolean
          // default: false,
        },
        allowed_to_broadcast_tasks: {
          type: Boolean
          // default: false,
        },
        allowed_to_purchase_content: {
          type: Boolean
          // default: false,
        },
        price_range: {
          minimum_price: {
            type: String // Use Number if you want numerical validation
            // default: "",
          },
          maximum_price: {
            type: String // Use Number if you want numerical validation
            // default: "",
          }
        }
      },
      office_details: [
        {
          name: { type: String, default: '' },
          complete_address: { type: String, default: '' },
          latitude: { type: Number },
          longitude: { type: Number },
          phone: { type: String, default: '' },
          fax: { type: String, default: '' },
          country_code: { type: String, default: '' },
          city: { type: String, default: '' },
          country: { type: String, default: '' },
          post_code: { type: String, default: '' },
          website: { type: String, default: '' },

          // is_another_office_exist: { type: Boolean},
          company_name: { type: String, default: '' },
          company_number: { type: String, default: '' },
          company_vat: { type: String, default: '' },
          profile_image: { type: String, default: '' },
          name: { type: String, default: '' },
          office_type_id: { type: mongoose.Types.ObjectId },
          address: {
            country: { type: String, default: '' },
            city: { type: String, default: '' },
            complete_address: { type: String, default: '' },
            Pin_Location: {
              lat: { type: Number, default: '' },
              long: { type: Number, default: '' }
            },
            location: {
              type: { type: String, enum: ['Point'], default: 'Point' },
              coordinates: {
                type: [Number],
                validate: {
                  validator(coords) {
                    return coords.length === 2 // Ensure it contains latitude and longitude
                  },
                  message: 'Coordinates should contain latitude and longitude'
                }
              }
            },
            pincode: { type: String, default: '' }
          },
          office_type: {
            type: String,
            enum: ['option1', 'option2', 'option3'], // Add valid office types
            default: 'option1'
          }
        }
      ]
    }
  },

  {
    versionKey: false,
    timestamps: true
  }
)

module.exports = mongoose.model(
  'PreRegistrationData',
  preRegistrationDataSchema
)

// const mongoose = require('mongoose');

// const administratorDetailsSchema = new mongoose.Schema({
//   full_name: {
//     type: String,
//
//   },
//   first_name: {
//     type: String,
//
//   },
//   last_name: {
//     type: String,
//
//   },
//   office_name: {
//     type: String,
//     default: "",
//   },
//   designation_id: {
//     type: mongoose.Schema.Types.ObjectId, // Assuming it's a reference to another document
//     ref: 'Designation', // The referenced collection, if applicable
//
//   },
//   department: {
//     type: String,
//     default: "",
//   },
//   admin_profile: {
//     type: String,
//     default: "",
//   },
//   country_code: {
//     type: String,
//     default: "",
//   },
//   phone: {
//     type: String,
//     default: "",
//   },
//   office_email: {
//     type: String,
//     default: "",
//     match: /.+\@.+\..+/,
//   },
// });

// module.exports = mongoose.model('AdministratorDetails', administratorDetailsSchema);
