let today = new Date();
let CurrentwaliDate = today.toLocaleDateString('en-GB');

const mongoose=require("mongoose");

const add_pets_schema_1O1=new mongoose.Schema({
    username: {
        type:String,
        required:true,
    },
    phone: {
        type:Number,
        required:true
    },
    petname: {
        type:String,
        required:true,
    },
    petage: {
        type:Number,
        required:true
    },
    vaccination: {
        type:String,
        required:true
    },
    unit_day_or_month_or_year: {
        type:String,
        required:true
    },
    breed: {
        type:String,
        required:true
    },
    pettype_dog_or_cat:
    {
        type:String,
        required:true
    },
    image : {
        type:String,
        required:false 
    },
    what:{
        type:String,
        required:false
    },
    pettype_rescued_or_puschase: {
        type:String,
        required:true
    },
    state: {
        type:String,
        required:true
    },
    city: {
        type:String,
        required:true
    },
    date:
    {
        type:String,
        default: CurrentwaliDate,
        required:false
    },
    colour: {
        type:String,
        required:true
    },
    gender:
    {
        type:String,
        required:true
    },
    description:
    {
        type:String,
    },
})

const Add_petscollection = new mongoose.model("Addpet",add_pets_schema_1O1);

module.exports = Add_petscollection;