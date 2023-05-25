var mongoose = require('mongoose');
mongoose.set('strictQuery', true);
mongoose.connect('mongodb://127.0.0.1:27017/intern1', { useNewUrlParser: true });
var db = mongoose.connection;

//Register Table
var schema = new mongoose.Schema({
    Name: "string",
    DOB: "string",
    Email: "string",
    Password: "string"
});
var registermongomodel = new mongoose.model('register', schema);

//Basic Info Table
var BasciinfoSchema = new mongoose.Schema({
    Name: "string",
    EmployeeId: "string",
    EmailId: "string",
    DateOfJoining: "string",
    ReportingTO: "string",
    BTECH: "string",
    HSC: "string",
    SSC: "string",
});
var Basicinfomodel = new mongoose.model("BasiC Info", BasciinfoSchema);

//Personal Info Table
var PersonalinfoSchema = new mongoose.Schema({
    Name: "string",
    MobileNo: "string",
    EmailId: "string",
    BirthDate: "string",
    MaritalStatus: "string"
});
var personalinfomodel = new mongoose.model("Personal Info", PersonalinfoSchema);

//work table
var workschema = new mongoose.Schema({
    Department: "string",
    Location: "string",
    ReportingTo: "string",
    Designation: "string",
    ModeOfWork: "string",
    EmployeeStatus: "string",
    Expirience: "String",
    EmailId: "String"
});
var workmodel = new mongoose.model("Work", workschema);


//projects table
var projectschema = new mongoose.Schema({
    EmailId: "string",
    ProjectName: "string",
    ProjectLink: "string"
});

var projectmodel = new mongoose.model('projects', projectschema);

//login table
var loginschema = new mongoose.Schema({
    EmailId: "string",
    Date: "string",
    CheckIn: "string",
    CheckOut: "string"
});

var loginmodel = new mongoose.model('login', loginschema);

//DSR table
var dsrschema = new mongoose.Schema(
    {
        EmailId: "string",
        Date: "string",
        Task: [],
        Attendence: "string"

    }
);

var dsrmodel = new mongoose.model('dsr', dsrschema);

//trainer 
var trainerschema = new mongoose.Schema({
    Name: "string",
    EmailId: "string",
    Password: "string"
});

var trainermodel = new mongoose.model('trainer', trainerschema);

//Announcement
var announcementschem = new mongoose.Schema({
    Announcement: 'string'
});

var announcementmodel = new mongoose.model('Announcements', announcementschem);

//assigned task
var assignschem = new mongoose.Schema({
    EmailId: 'string',
    Date: 'string',
    Task: []
});

var assignmodel = new mongoose.model('tasks', assignschem);

//rating
var ratingschema = new mongoose.Schema({
    EmailId :"string",
    Date:"string",
    Rating : "string"
});

var ratingmodel = new mongoose.model('rating',ratingschema);

//leave 
var leaveschema = new mongoose.Schema({
    FirstName:"string",
    LastName:"string",
    EmployeeId:"string",
    EmailId:"string",
    LeaveType:"string",
    FromDate:"string",
    ToDate:"string",
    Status:"string"
});

var leavemodel = new mongoose.model('Leave', leaveschema);

//file
var fileschem = new mongoose.Schema({
    EmailId :"string",
    Adharcard : "string",
    Pancard :"string",
    BankPassBook:"string",
    Ssc:"string",
    Hsc:"string",
    Degree:"string",
    Resume:"string",
    ProfileImg:"string",
    Status:"string"
});

var filemodel = new mongoose.model('files',fileschem);

//salary
var salaryschema = new mongoose.Schema({
    ProfessionalTax : "string",
    ProvidentFund : "string",
    MedicalInsurance : "string"
});

var salarymodel = new mongoose.model('salary',salaryschema);

//admin
var adminschema = new mongoose.Schema({
    EmailId:"string"
});

var adminmodel = new mongoose.model('admin',adminschema);

module.exports.registermongomodel = registermongomodel;
module.exports.Basicinfomodel = Basicinfomodel;
module.exports.workmodel = workmodel;
module.exports.personalinfomodel = personalinfomodel;
module.exports.projectmodel = projectmodel;
module.exports.loginmodel = loginmodel;
module.exports.dsrmodel = dsrmodel;
module.exports.trainermodel = trainermodel;
module.exports.announcementmodel = announcementmodel;
module.exports.assignmodel = assignmodel;
module.exports.ratingmodel = ratingmodel;
module.exports.leavemodel = leavemodel ;
module.exports.filemodel = filemodel;
module.exports.salarymodel = salarymodel;
module.exports.adminmodel = adminmodel;