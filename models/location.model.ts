let mongoose = require("mongoose");
let Schema = mongoose.Schema;

const locationSchema = new Schema(
  {
    // ID: {
    //   type: Number,
    // },
    Name: {
      type: String,
    },
    Description: {
      type: String,
      default: null
    },
    Adress1: {
      type: String,
      default: null
    },
    Adress2: {
      type: String,
      default: null
    },
    City: {
      type: String,
      default: null
    },
    State: {
      type: String,
      default: null
    },
    Zip: {
      type: String,
      default: null
    },
    Latitude1: {
      type: Number,
    },
    Longitude1: {
      type: Number
    },
    Code: {
      type: String
    },
    Status: {
      type: Number
    },
    CreatedBy: {
      type: Number
    },
    ModifiedDate: {
      type: Date
    },
    ModifiedBy: {
      type: Number
    },
    Deleted: {
      type: Number
    },
    DeletedDate: {
      type: Date
    },
    DeletedBy: {
      type: Number
    },
    SiteID: {
      type: Number
    },
    Type: {
      type: Number
    },
    Latitude2: {
      type: Number
    },
    Latitude3: {
      type: Number
    },
    Latitude4: {
      type: Number
    },
    Longitude2: {
      type: Number
    },
    Longitude3: {
      type: Number
    },
    Longitude4: {
      type: Number
    },
    Longitude5: {
      type: Number
    },
    Latitude5: {
      type: Number
    },
    Longitude6: {
      type: Number
    },
    Latitude6: {
      type: Number
    },
    Longitude7: {
      type: Number
    },
    Latitude7: {
      type: Number
    },
    Longitude8: {
      type: Number
    },
    Latitude8: {
      type: Number
    },
    Longitude9: {
      type: Number
    },
    Latitude9: {
      type: Number
    },
    Longitude10: {
      type: Number
    },
    Latitude10: {
      type: Number
    },
    Longitude11: {
      type: Number
    },
    Latitude11: {
      type: Number
    },
    Longitude12: {
      type: Number
    },
    Latitude12: {
      type: Number
    },
    Longitude13: {
      type: Number
    },
    Latitude13: {
      type: Number
    },
    Longitude14: {
      type: Number
    },
    Latitude14: {
      type: Number
    },
    Longitude15: {
      type: Number
    },
    Latitude15: {
      type: Number
    },
    Longitude16: {
      type: Number
    },
    Latitude16: {
      type: Number
    },
    Longitude17: {
      type: Number
    },
    Latitude17: {
      type: Number
    },
    Longitude18: {
      type: Number
    },
    Latitude18: {
      type: Number
    },
    Longitude19: {
      type: Number
    },
    Latitude19: {
      type: Number
    },
    Longitude20: {
      type: Number
    },
    Latitude20: {
      type: Number
    },
    circleCenter: {
      type: String
    },
    circleRadius: {
      type: Number
    },
    shape: {
      type: String
    },
    bounds: {
      type: String
    },
    TrailerID: {
      type: Number,
      default: null

    },
    StatusType: {
      type: Number,
      default: null
    },
    ReferenceLatitude: {
      type: Number,
      default: null
    },
    ReferenceLongitude: {
      type: Number,
      default: null
    },
    OutOfService: {
      type: Boolean,
      default: null
    },
    isGroup: {
      type: Boolean,
      default: false
    },
    groupUniqueKey: {
      type: String,
    },
  },
  {
    // strict: true,
    versionKey: false,
    timestamps: true,
  }
);

module.exports = mongoose.model("Locations", locationSchema);
