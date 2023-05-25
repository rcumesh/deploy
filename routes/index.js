
var express = require('express');
var router = express.Router();

var bodyparser = require('body-parser');


router.use(bodyparser.urlencoded({ extended: false }));
router.use(bodyparser.json());
var mongomodel = require('../modules/RegisterD.js');
const { log } = require('util');

/* GET home page. */
router.get('/', function (req, res, next) {
  res.render('register', { title: "Register" });
});

router.post('/', function (req, res, next) {
  mongomodel.registermongomodel.findOne({ Email: req.body.e }, function (err, data) {
    if (err) throw err;
    if (data == null) {
      var person = new mongomodel.registermongomodel({ Name: req.body.n, DOB: req.body.d, Email: req.body.e, Password: req.body.p });
      person.save();
      var obj = new mongomodel.filemodel({
        EmailId: req.body.e,
        Adharcard: "",
        Pancard: "",
        BankPassBook: "",
        Ssc: "",
        Hsc: "",
        Degree: "",
        Resume: "",
        ProfileImg: "",
        Status: ''
      });
      obj.save();
      res.render('info', { title: "Onboarding", body: req.body });
    } else {
      res.render('login', { title: "Login", title1: "Sign into your account" });
    }
  });


});


//onboarding
router.post('/Employee', function (req, res, next) {
  var basicinfo = new mongomodel.Basicinfomodel({
    Name: req.body.N,
    EmployeeId: req.body.EID,
    EmailId: req.body.E,
    DateOfJoining: req.body.DOJ,
    ReportingTO: req.body.RT,
    BTECH: req.body.BTECH,
    HSC: req.body.HSC,
    SSC: req.body.SSC
  });
  basicinfo.save();

  var personalinfo = new mongomodel.personalinfomodel({
    Name: req.body.N,
    MobileNo: req.body.MN,
    EmailId: req.body.E,
    BirthDate: req.body.DOB,
    MaritalStatus: req.body.MS
  });
  personalinfo.save();

  var work = new mongomodel.workmodel({
    Department: req.body.D,
    Location: req.body.L,
    ReportingTo: req.body.RT,
    Designation: req.body.DG,
    ModeOfWork: req.body.MOW,
    EmployeeStatus: req.body.ES,
    Expirience: req.body.EX,
    EmailId: req.body.E
  })

  work.save();
  res.render('uploadingimg', { title: "files", E: req.body.E });

});

//login
router.get('/check', function (req, res, next) {
  res.render('login', { title: "Login", title1: "Sign into your account" });
});
router.post('/check', function (req, res, next) {
  mongomodel.registermongomodel.findOne({ Email: req.body.ee }, function (err, data) {
    if (err) throw err;
    if (data != null && data.Email == req.body.ee && data.Password == req.body.pp) {
      var MyDate = new Date();
      var MyDateString;
      MyDate.setDate(MyDate.getDate());
      MyDateString = ('0' + MyDate.getDate()).slice(-2) + '-' + ('0' + (MyDate.getMonth() + 1)).slice(-2) + '-' + MyDate.getFullYear();

      var time = MyDate.getHours() + ':' + MyDate.getMinutes()
      var time = time.split(':').map(e => e.padStart(2, 0)).join(':');
      mongomodel.loginmodel.deleteMany({EmailId:req.body.ee,CheckOut:''},function(err,data10){
        if(err) throw err;
        
      });
      
      mongomodel.Basicinfomodel.findOne({ EmailId: req.body.ee }, function (err, data1) {
        if (err) throw err;
        mongomodel.personalinfomodel.findOne({ EmailId: req.body.ee }, function (err, data2) {
          if (err) throw err;
          mongomodel.workmodel.findOne({ EmailId: req.body.ee }, function (err, data3) {
            if (err) throw err;

            var inputs = new mongomodel.loginmodel({
              EmailId: req.body.ee,
              Date: MyDateString,
              CheckIn: time,
              CheckOut: ''
            });
            inputs.save();

            var ppp = '';
            MyDateString2 = MyDate.getFullYear() + '-' + ('0' + (MyDate.getMonth() + 1)).slice(-2);
            mongomodel.ratingmodel.findOne({ EmailId: req.body.ee, Date: MyDateString2 }, function (err, data5) {
              if (err) throw err;
              if (data5 != null) {
                for (var i = 0; i < data5.Rating; i++) {
                  ppp += '⭐';
                };
              }
              mongomodel.filemodel.findOne({ EmailId: req.body.ee }, function (err, data6) {
                if (err) throw err;
                res.render("Employee", { title: "Home", body1: data1, body2: data2, body3: data3, body5: ppp, dp: data6.Status, date: MyDateString, time: time });
              });


            });

          });
        });
      });
    } else {
      res.render('login', { title: "Invalid Credentials", title1: "Please fill the correct credentials" });
    }
  }).clone().catch(function (err) { console.log(err); });;

});


//edit
router.get('/edit/:E', function (req, res, next) {
  console.log(req.params.E);
  mongomodel.Basicinfomodel.findOne({ EmailId: req.params.E }, function (err, data1) {
    if (err) throw err;
    mongomodel.personalinfomodel.findOne({ EmailId: req.params.E }, function (err, data2) {
      if (err) throw err;
      mongomodel.workmodel.findOne({ EmailId: req.params.E }, function (err, data3) {
        if (err) throw err;

        res.render("edit", { title: "Edit", p: req.params.E, body1: data1, body2: data2, body3: data3, E: req.params.E });

      });
    });
  });
});

router.post('/edit/:E', function (req, res, next) {
  mongomodel.Basicinfomodel.findOneAndUpdate({ EmailId: req.params.E }, {
    Name: req.body.N,
    EmployeeId: req.body.EID,
    EmailId: req.body.E,
    DateOfJoining: req.body.DOJ,
    ReportingTO: req.body.RT,
    BTECH: req.body.BTECH,
    HSC: req.body.HSC,
    SSC: req.body.SSC
  }, function (err, data1) {
    if (err) throw err;
    mongomodel.personalinfomodel.findOneAndUpdate({ EmailId: req.params.E }, {
      Name: req.body.N,
      MobileNo: req.body.MN,
      EmailId: req.body.E,
      BirthDate: req.body.DOB,
      MaritalStatus: req.body.MS
    }, function (err, data2) {
      if (err) throw err;
      mongomodel.workmodel.findOneAndUpdate({ EmailId: req.params.E }, {
        Department: req.body.D,
        Location: req.body.L,
        ReportingTo: req.body.RT,
        Designation: req.body.DG,
        ModeOfWork: req.body.MOW,
        EmployeeStatus: req.body.ES,
        Expirience: req.body.EX,
        EmailId: req.body.E
      }, function (err, data3) {
        if (err) throw err;
        mongomodel.Basicinfomodel.findOne({ EmailId: req.params.E }, function (err, data1) {
          if (err) throw err;
          mongomodel.personalinfomodel.findOne({ EmailId: req.params.E }, function (err, data2) {
            if (err) throw err;
            mongomodel.workmodel.findOne({ EmailId: req.params.E }, function (err, data3) {
              if (err) throw err;
              var MyDate = new Date();
              var MyDateString;
              MyDate.setDate(MyDate.getDate());
              MyDateString = ('0' + MyDate.getDate()).slice(-2) + '-' + ('0' + (MyDate.getMonth() + 1)).slice(-2) + '-' + MyDate.getFullYear();
              var time = MyDate.getHours() + ':' + MyDate.getMinutes()
              var time = time.split(':').map(e => e.padStart(2, 0)).join(':');
              var ppp = '';
              var MyDateString2 = MyDate.getFullYear() + '-' + ('0' + (MyDate.getMonth() + 1)).slice(-2);
              mongomodel.ratingmodel.findOne({ EmailId: req.params.E, Date: MyDateString2 }, function (err, data5) {
                if (err) throw err;

                if (data5 != null) {
                  for (var i = 0; i < data5.Rating; i++) {
                    ppp += '⭐';
                  };
                }
                mongomodel.filemodel.findOne({ EmailId: req.params.E }, function (err, data6) {
                  if (err) throw err;
                  res.render("employee", { title: "Home", body1: data1, body2: data2, body3: data3, body5: ppp, dp: data6.Status, date: MyDateString, time: time });
                });
              });

            });
          });
        });
      });
    });
  });
});


//projects

router.get('/projects/:E', function (req, res, next) {
  mongomodel.projectmodel.find({ EmailId: req.params.E }, function (err, data) {
    console.log(data);
    res.render('project', { title: "Project", records: data, p: req.params.E, flag: 1 });
  });
});

router.post('/projectss/:E', function (req, res, next) {
  var flag = 0;
  mongomodel.projectmodel.findOne({EmailId:req.params.E,ProjectName:req.body.PN,ProjectLink:req.body.PL},function(err,data6){
    console.log(data6);
    if(data6==null){
      var projectdata = new mongomodel.projectmodel({
        EmailId: req.params.E,
        ProjectName: req.body.PN,
        ProjectLink: req.body.PL
      });
      projectdata.save(function (err, data1) {
        if (err) throw err;
        mongomodel.projectmodel.find({ EmailId: req.params.E }, function (err, data) {
          res.render('project', { title: "Project", records: data, p: req.params.E, flag: 1 });
        });
      });
    }else{
      mongomodel.projectmodel.find({ EmailId: req.params.E }, function (err, data) {
        res.render('project', { title: "Project", records: data, p: req.params.E, flag: 1 });
      });
    }
  });
  


});

//To render home page
router.get('/home/:ee', function (req, res, next) {
  mongomodel.Basicinfomodel.findOne({ EmailId: req.params.ee }, function (err, data1) {
    if (err) throw err;
    mongomodel.personalinfomodel.findOne({ EmailId: req.params.ee }, function (err, data2) {
      if (err) throw err;
      mongomodel.workmodel.findOne({ EmailId: req.params.ee }, function (err, data3) {
        if (err) throw err;
        mongomodel.loginmodel.findOne({ EmailId: req.params.ee, CheckOut: "" }, function (err, data4) {
          if (err) throw err;
          var ppp = '';
          var MyDate = new Date();
          var MyDateString;
          MyDate.setDate(MyDate.getDate());
          MyDateString = MyDate.getFullYear() + '-' + ('0' + (MyDate.getMonth() + 1)).slice(-2);
          mongomodel.ratingmodel.findOne({ EmailId: req.params.ee, Date: MyDateString }, function (err, data5) {
            if (err) throw err;

            if (data5 != null) {
              for (var i = 0; i < data5.Rating; i++) {
                ppp += '⭐';
              };
            }
            mongomodel.filemodel.findOne({ EmailId: req.params.ee }, function (err, data6) {
              if (err) throw err;
              res.render("Employee", { title: "Home", body1: data1, body2: data2, body3: data3, body5: ppp, dp: data6.Status, date: data4.Date, time: data4.CheckIn });
            });
          });



        });


      });
    });
  });
});

//delete project
router.post('/delete/:E', function (req, res, next) {
  mongomodel.projectmodel.deleteOne({ EmailId: req.params.E, ProjectName: req.body.PN, ProjectLink: req.body.PL }, function (err, data) {
    if (err) throw err;
    mongomodel.projectmodel.find({ EmailId: req.params.E }, function (err, data) {
      res.render('project', { title: "Project", records: data, p: req.params.E, flag: 1 });
    });
  });
});


//logout
router.get('/logout/:E?/:D?/:T?', function (req, res, next) {
  let date_ob = new Date();
  var time = date_ob.getHours() + ':' + date_ob.getMinutes();
  var time = time.split(':').map(e => e.padStart(2, 0)).join(':');
  mongomodel.loginmodel.findOneAndUpdate({ EmailId: req.params.E, Date: req.params.D, CheckIn: req.params.T }, { CheckOut: time }, function (err, data) {
    if (err) throw (err);
    res.redirect('/front');
  });

});


//dsr
router.get('/dsr/:E', function (req, res, next) {
  res.render('dsr', { title: 'DSR', p: req.params.E, pp: 'Welcome to the DSR section', q: 'Fill the DSR as orgniztion will consider it for APPRAISAL.' });

});

router.post('/dsr/:E', function (req, res, next) {
  var arr1 = [];
  for (var i = 0; i < 10; i++) {
    if (req.body['mobile' + String(i)] != undefined) {
      arr1.push(req.body['mobile' + String(i)]);
    }

  }
  var MyDate = new Date();
  var MyDateString;
  MyDate.setDate(MyDate.getDate());
  MyDateString = ('0' + MyDate.getDate()).slice(-2) + '-' + ('0' + (MyDate.getMonth() + 1)).slice(-2) + '-' + MyDate.getFullYear();
  mongomodel.dsrmodel.findOne({ EmailId: req.params.E, Date: MyDateString }, function (err, data) {
    if (err) throw err;
    if (data == null) {
      var d = new mongomodel.dsrmodel({
        EmailId: req.params.E,
        Date: MyDateString,
        Task: arr1,
        Attendence: 'p'
      });

      d.save();
      res.render('dsr', { title: 'DSR', p: req.params.E, pp: 'Welcome to the DSR section', q: 'Thanks for filling the DSR.' });
    }
    else {
      res.render('dsr', { title: 'DSR', p: req.params.E, pp: 'U had already filled the DSR. ', q: 'Thanks for filling the DSR.' });

    }
  });


});


//dsr tracker
router.get('/task/:E/:aa?', function (req, res, next) {
  mongomodel.dsrmodel.find({ EmailId: req.params.E }, function (err, data) {
    if (err) throw err;
    data = data.reverse();
    mongomodel.loginmodel.find({ EmailId: req.params.E }, function (err, data1) {
      var dic = {};
      var maxx = '00:00';
      var minx = '24:00';
      for (var i = 0; i < data1.length; i++) {
        dic[data1[i].Date] = [minx, maxx]
      }
      for (var i = 0; i < data1.length; i++) {

        if (data1[i].CheckIn < dic[data1[i].Date][0]) {
          dic[data1[i].Date][0] = data1[i].CheckIn;
        }
        if (data1[i].CheckOut > dic[data1[i].Date][1]) {
          dic[data1[i].Date][1] = data1[i].CheckOut;
        }
      }
      if (req.params.aa == 'u') {
        res.render('task1', { title: 'DSR', p: req.params.E, records: data, count: 0, dic: dic });
      } else {
        res.render('task', { title: 'Task', p: req.params.E, records: data, count: 0, dic: dic });
      }

    });

  });

});


//front page
router.get('/front', function (req, res, next) {
  var MyDate = new Date();
  var MyDateString;
  MyDate.setDate(MyDate.getDate());
  MyDateString = ('0' + (MyDate.getMonth() + 1)).slice(-2) + '-' + ('0' + MyDate.getDate()).slice(-2);
  var MyDateString1 = MyDate.getFullYear() + '-' + ('0' + (MyDate.getMonth() + 1)).slice(-2);

  mongomodel.personalinfomodel.find({}, function (err, data) {
    var arr = [];
    if (err) throw err;
    for (var i = 0; i < data.length; i++) {
      if (data[i].BirthDate.slice(5,) == MyDateString) {
        arr.push(data[i]);
      }
    }
    var arr1 = [];
    mongomodel.Basicinfomodel.find({}, function (err, data1) {
      if (err) throw err;

      for (var i = 0; i < data1.length; i++) {
        if (data1[i].DateOfJoining.slice(0, 7) == MyDateString1) {
          arr1.push(data1[i]);
        }
      }
      mongomodel.announcementmodel.find({}, function (err, data2) {
        if (err) throw err;
        var arr2 = [];
        for (var i = 0; i < data2.length; i++) {
          arr2.push(data2[i].Announcement);
        }
        res.render('front', { title: 'cctech', arr: arr, arr1: arr1, arr2: arr2 });
      });

    });
  });
});


//trainers login
router.get('/trainerlogin', function (req, res, next) {
  res.render('trainer', { title: "Trainer's Login", title1: "Sign into your account" });
});

router.post('/trainercheck', function (req, res, next) {

  mongomodel.trainermodel.findOne({ EmailId: req.body.ee }, function (err, data) {
    if (data != null && req.body.ee == data.EmailId && req.body.pp == data.Password) {

      mongomodel.Basicinfomodel.find({}, function (err, dataa) {

        var MyDate = new Date();
        var MyDateString;
        MyDate.setDate(MyDate.getDate());
        MyDateString = MyDate.getFullYear() + '-' + ('0' + (MyDate.getMonth() + 1)).slice(-2) + '-' + ('0' + MyDate.getDate()).slice(-2);
        mongomodel.filemodel.find({}, function (err, data1) {
          if (err) throw err;
          res.render('trainershome', { title: 'Home', data: dataa, date: MyDateString, data1: data1 });
        });

      });



      console.log('successfully logged in');
    } else {
      console.log('unsuccessfull login');
      res.render('trainer', { title: "Invalid Credentials", title1: "Please enter the correct credentials" });
    }
  });
});

//assign task

router.get('/assigntask/:E/:D', function (req, res, next) {
  var MyDate = new Date();
  var MyDateString;
  MyDate.setDate(MyDate.getDate());
  MyDateString = MyDate.getFullYear() + '-' + ('0' + (MyDate.getMonth() + 1)).slice(-2) + '-' + ('0' + MyDate.getDate()).slice(-2);

  res.render('assign', { title: 'assign', dd: MyDateString });
});


router.post('/assigntask/:E/:D', function (req, res, next) {
  var tasks = [];
  for (var i = 0; i < 10; i++) {
    if (req.body['mobile' + i] != undefined) {
      tasks.push(req.body['mobile' + i]);
    }
  }
  mongomodel.assignmodel.findOne({ EmailId: req.params.E, Date: req.params.D }, function (err, data) {
    if (err) throw err;
    if (data == null) {
      var obj = new mongomodel.assignmodel({ EmailId: req.params.E, Date: req.params.D, Task: tasks });
      obj.save();
    } else {
      mongomodel.assignmodel.findOne({ EmailId: req.params.E, Date: req.params.D }, function (err, data1) {
        if (err) throw err;
        mongomodel.assignmodel.findOneAndUpdate({ EmailId: req.params.E, Date: req.params.D }, { Task: data1.Task.concat(tasks) }, function (err, data2) {
          if (err) throw err;
        });
      });

    }
    mongomodel.Basicinfomodel.find({}, function (err, dataa) {
      var MyDate = new Date();
      var MyDateString;
      MyDate.setDate(MyDate.getDate());
      MyDateString = MyDate.getFullYear() + '-' + ('0' + (MyDate.getMonth() + 1)).slice(-2) + '-' + ('0' + MyDate.getDate()).slice(-2);
      mongomodel.filemodel.find({}, function (err, data1) {
        if (err) throw err;
        res.render('trainershome', { title: 'Home', data: dataa, date: MyDateString, data1: data1 });
      });
    });

  });

});


//assigned work
router.get('/assignedwork/:E', function (req, res, next) {
  mongomodel.assignmodel.find({ EmailId: req.params.E }, function (err, data) {
    if (err) throw err;
    data = data.reverse();
    res.render('assignedtask', { title: 'Task', records: data, p: req.params.E })
  });
});

//performance
router.get('/performance/:E', function (req, res, next) {
  mongomodel.Basicinfomodel.findOne({ EmailId: req.params.E }, function (err, data) {
    if (err) throw err;
    res.render('performance', { title: "Performance", data: data });
  });

});

router.post('/performance/:E', function (req, res, next) {
  var MyDate = new Date();
  var MyDateString;
  MyDate.setDate(MyDate.getDate());
  MyDateString = MyDate.getFullYear() + '-' + ('0' + (MyDate.getMonth() + 1)).slice(-2);
  mongomodel.ratingmodel.findOne({ EmailId: req.params.E, Date: MyDateString }, function (err, data) {
    if (data == null) {
      var obj = new mongomodel.ratingmodel({ EmailId: req.params.E, Date: MyDateString, Rating: req.body.rating });
      obj.save();
    } else {
      mongomodel.ratingmodel.findOneAndUpdate({ EmailId: req.params.E, Date: MyDateString }, { Rating: req.body.rating }, function (err, data1) {
        if (err) throw err;

      });
    }
    mongomodel.Basicinfomodel.find({}, function (err, dataa) {
      if (err) throw err;
      mongomodel.filemodel.find({}, function (err, data1) {
        if (err) throw err;
        res.render('trainershome', { title: 'Home', data: dataa, date: MyDateString, data1: data1 });
      });
    });
  });

});

//leave apply
router.get('/leave/:E', function (req, res, next) {
  res.render('leave', { title: 'Leave' });
});

router.post('/leave/:E', function (req, res, next) {
  console.log(req.body);
  var obj = new mongomodel.leavemodel({
    FirstName: req.body.fn,
    LastName: req.body.ln,
    EmployeeId: req.body.ei,
    EmailId: req.body.e,
    LeaveType: req.body.lt,
    FromDate: req.body.fd,
    ToDate: req.body.td,
    Status: 'Pending'
  });
  obj.save();
  mongomodel.Basicinfomodel.findOne({ EmailId: req.params.E }, function (err, data1) {
    if (err) throw err;
    mongomodel.personalinfomodel.findOne({ EmailId: req.params.E }, function (err, data2) {
      if (err) throw err;
      mongomodel.workmodel.findOne({ EmailId: req.params.E }, function (err, data3) {
        if (err) throw err;
        mongomodel.loginmodel.findOne({ EmailId: req.params.E, CheckOut: "" }, function (err, data4) {
          if (err) throw err;
          var ppp = '';
          var MyDate = new Date();
          var MyDateString;
          MyDate.setDate(MyDate.getDate());
          MyDateString = MyDate.getFullYear() + '-' + ('0' + (MyDate.getMonth() + 1)).slice(-2);
          mongomodel.ratingmodel.findOne({ EmailId: req.params.E, Date: MyDateString }, function (err, data5) {
            if (err) throw err;

            if (data5 != null) {
              for (var i = 0; i < data5.Rating; i++) {
                ppp += '⭐';
              };
            }
            mongomodel.filemodel.findOne({ EmailId: req.params.E }, function (err, data6) {
              if (err) throw err;

              res.render("Employee", { title: "Home", body1: data1, body2: data2, body3: data3, body5: ppp, dp: data6.Status, date: data4.Date, time: data4.CheckIn });
            });
          });



        });


      });
    });
  });


});


//trainer side leave option
router.get('/trainersideleave/:E', function (req, res, next) {

  mongomodel.leavemodel.find({ EmailId: req.params.E, Status: "Pending" }, function (err, data) {
    if (err) throw err;
    res.render('trainersideleave', { title: "Leave", records: data });
  });
});

router.get('/approveleave/:E/:F/:T/:P?', function (req, res, next) {
  if (req.params.P == 'A') {
    console.log(req.params.E);
    console.log(req.params.F);
    console.log(req.params.T);
    mongomodel.leavemodel.findOneAndUpdate({ EmailId: req.params.E, FromDate: req.params.F, ToDate: req.params.T, Status: "Pending" }, { Status: "Approved" }, function (err, data) {
      console.log(data);
      if (err) throw err;
      var MyDate = new Date();
      var MyDateString;
      MyDate.setDate(MyDate.getDate());
      MyDateString = MyDate.getFullYear() + '-' + ('0' + (MyDate.getMonth() + 1)).slice(-2);
      mongomodel.Basicinfomodel.find({}, function (err, dataa) {
        if (err) throw err;
        mongomodel.filemodel.find({}, function (err, data1) {
          if (err) throw err;
          res.render('trainershome', { title: 'Home', data: dataa, date: MyDateString, data1: data1 });
        });
      });

    });
  } else {
    mongomodel.leavemodel.findOneAndUpdate({ EmailId: req.params.E, FromDate: req.params.F, ToDate: req.params.T }, { Status: "Rejected" }, function (err, data) {
      if (err) throw err;
    });
    var MyDate = new Date();
    var MyDateString;
    MyDate.setDate(MyDate.getDate());
    MyDateString = MyDate.getFullYear() + '-' + ('0' + (MyDate.getMonth() + 1)).slice(-2);
    mongomodel.Basicinfomodel.find({}, function (err, dataa) {
      if (err) throw err;
      mongomodel.filemodel.find({}, function (err, data1) {
        if (err) throw err;
        res.render('trainershome', { title: 'Home', data: dataa, date: MyDateString, data1: data1 });
      });
    });
  }
});

//intern side leave tracker
router.get('/approvecancel/:E', function (req, res, next) {
  mongomodel.leavemodel.find({ EmailId: req.params.E, $or: [{ Status: "Approved" }, { Status: "Rejected" }] }, function (err, data) {
    if (err) throw err;
    data = data.reverse();
    res.render('Trackleave', { title: "Leave", records: data, p: req.params.E, title: 'Track Leave' });
  });
});

var multer = require('multer');
//image uploading
var storage = multer.diskStorage({
  destination: "./public/uploads",
  filename: (req, file, cb) => {
    cb(null, Date.now() + '-' + file.originalname)
  }
});

let upload = multer({
  storage: storage,
  fileFilter: (req, file, cb) => {
    if (
      file.mimetype == 'image/jpeg' ||
      file.mimetype == 'image/jpg' ||
      file.mimetype == 'image/png' ||
      file.mimetype == 'application/pdf'
    ) {
      cb(null, true);
    } else {
      cb(null, false);
      cb(new Error("only jpeg,jpg,png file are accepted"));
    }
  }
})

router.get('/editfile/:E', function (req, res, next) {
  mongomodel.filemodel.findOne({ EmailId: req.params.E }, function (err, data) {
    res.render('editfiles', { title: "Edit Files", data: data, E: data.EmailId });

  })
});

router.post('/uploaded/:E/:u?', upload.array('f', 8), function (req, res, next) {
  console.log(req.files);
  mongomodel.filemodel.findOne({ EmailId: req.params.E }, function (err, data) {
    if (err) throw err;
    if (data == null) {
      var p = new mongomodel.filemodel({
        EmailId: req.params.E,
        Adharcard: req.files[0].path,
        Pancard: req.files[1].path,
        BankPassBook: req.files[2].path,
        Ssc: req.files[3].path,
        Hsc: req.files[4].path,
        Degree: req.files[5].path,
        Resume: req.files[6].path,
        ProfileImg: req.files[7].path,
        Status: "Pending"
      });
      p.save();
      if (req.params.u == "u") {

        mongomodel.Basicinfomodel.findOne({ EmailId: req.params.E }, function (err, data1) {
          if (err) throw err;
          mongomodel.personalinfomodel.findOne({ EmailId: req.params.E }, function (err, data2) {
            if (err) throw err;
            mongomodel.workmodel.findOne({ EmailId: req.params.E }, function (err, data3) {
              if (err) throw err;
              mongomodel.loginmodel.findOne({ EmailId: req.params.E, CheckOut: "" }, function (err, data4) {
                if (err) throw err;
                var ppp = '';
                var MyDate = new Date();
                var MyDateString;
                MyDate.setDate(MyDate.getDate());
                MyDateString = MyDate.getFullYear() + '-' + ('0' + (MyDate.getMonth() + 1)).slice(-2);
                mongomodel.ratingmodel.findOne({ EmailId: req.params.E, Date: MyDateString }, function (err, data5) {
                  if (err) throw err;

                  if (data5 != null) {
                    for (var i = 0; i < data5.Rating; i++) {
                      ppp += '⭐';
                    };
                  }
                  mongomodel.filemodel.findOne({ EmailId: data.EmailId }, function (err, data6) {
                    if (err) throw err;
                    res.render("Employee", { title: "Home", body1: data1, body2: data2, body3: data3, body5: ppp, dp: data6.Status, date: data4.Date, time: data4.CheckIn });
                  });
                });



              });


            });
          });
        });




      } else {
        res.render('login', { title: "Login", title1: "Sign into your account" });
      }

    } else {
      mongomodel.filemodel.findOneAndUpdate({ EmailId: req.params.E }, {
        EmailId: req.params.E,
        Adharcard: req.files[0].path,
        Pancard: req.files[1].path,
        BankPassBook: req.files[2].path,
        Ssc: req.files[3].path,
        Hsc: req.files[4].path,
        Degree: req.files[5].path,
        Resume: req.files[6].path,
        ProfileImg: req.files[7].path,
        Status: "Pending"
      }, function (err, data1) {
        if (err) throw err;
        if (req.params.u == "u") {

          mongomodel.Basicinfomodel.findOne({ EmailId: req.params.E }, function (err, data1) {
            if (err) throw err;
            mongomodel.personalinfomodel.findOne({ EmailId: req.params.E }, function (err, data2) {
              if (err) throw err;
              mongomodel.workmodel.findOne({ EmailId: req.params.E }, function (err, data3) {
                if (err) throw err;
                mongomodel.loginmodel.findOne({ EmailId: req.params.E, CheckOut: "" }, function (err, data4) {
                  if (err) throw err;
                  var ppp = '';
                  var MyDate = new Date();
                  var MyDateString;
                  MyDate.setDate(MyDate.getDate());
                  MyDateString = MyDate.getFullYear() + '-' + ('0' + (MyDate.getMonth() + 1)).slice(-2);
                  mongomodel.ratingmodel.findOne({ EmailId: req.params.E, Date: MyDateString }, function (err, data5) {
                    if (err) throw err;

                    if (data5 != null) {
                      for (var i = 0; i < data5.Rating; i++) {
                        ppp += '⭐';
                      };
                    }
                    mongomodel.filemodel.findOne({ EmailId: req.params.E }, function (err, data6) {
                      if (err) throw err;
                      res.render("Employee", { title: "Home", body1: data1, body2: data2, body3: data3, body5: ppp, dp: data6.Status, date: data4.Date, time: data4.CheckIn });
                    });
                  });



                });


              });
            });
          });




        } else {
          res.render('login', { title: "Login", title1: "Sign into your account" });
        }
      });
    }
  });

});

//Documets
router.get('/Documents/:E', function (req, res, next) {
  mongomodel.filemodel.findOne({ EmailId: req.params.E }, function (err, data) {
    if (err) throw err;
    res.render('document', { title: "Document", data: data });


  });
});

router.post('/Documents/:E', function (req, res, next) {
  mongomodel.filemodel.findOneAndUpdate({ EmailId: req.params.E }, { Status: "Completed" }, function (err, data) {
    if (err) throw err;
    var MyDate = new Date();
    var MyDateString;
    MyDate.setDate(MyDate.getDate());
    MyDateString = MyDate.getFullYear() + '-' + ('0' + (MyDate.getMonth() + 1)).slice(-2);
    mongomodel.Basicinfomodel.find({}, function (err, dataa) {
      if (err) throw err;
      mongomodel.filemodel.find({}, function (err, data1) {
        if (err) throw err;
        res.render('trainershome', { title: 'Home', data: dataa, date: MyDateString, data1: data1 });
      });
    });
  });
});

//rejected onboarding by trainer
router.get('/rejected/:E', function (req, res, next) {
  mongomodel.filemodel.findOneAndUpdate({ EmailId: req.params.E }, { Status: "Rejected" }, function (err, data) {
    if (err) throw err;
    var MyDate = new Date();
    var MyDateString;
    MyDate.setDate(MyDate.getDate());
    MyDateString = MyDate.getFullYear() + '-' + ('0' + (MyDate.getMonth() + 1)).slice(-2);
    mongomodel.Basicinfomodel.find({}, function (err, dataa) {
      if (err) throw err;
      mongomodel.filemodel.find({}, function (err, data1) {
        if (err) throw err;
        res.render('trainershome', { title: 'Home', data: dataa, date: MyDateString, data1: data1 });
      });
    });
  });
});


//salary sleep
router.get('/salary/:E', function (req, res, next) {
  res.render('salary', { title: "salary", x: "Calculate the salary(Joy).", p: req.params.E, records: [] });
});

router.post('/salarypost/:E', function (req, res, next) {
  console.log(req.body);

  if (req.body.FD > req.body.TD) {
    res.render('salary', { title: "salary", x: "Wrong Input please choose the correct credentials.", p: req.params.E, records: [] });
  } else {
    mongomodel.loginmodel.find({ EmailId: req.params.E }, function (err, data) {
      if (err) throw err;
      var datearr = []
      for (var i = 0; i < data.length; i++) {
        var FromDate = data[i].Date.split("-");
        var date = FromDate[2] + '-' + FromDate[1] + '-' + FromDate[0];
        if (date >= req.body.FD && date <= req.body.TD) {
          datearr.push(data[i]);
        }
      }

      miniutedic = {}
      for (var j = 0; j < datearr.length; j++) {
        miniutedic[datearr[j].Date] = '';
      }
      console.log(datearr);
      var sum = 0;
      for (var j = 0; j < datearr.length; j++) {
        if (miniutedic[datearr[j].Date] == '') {
          var chin = datearr[j].CheckIn.split(":");
          var chout = datearr[j].CheckOut.split(":");
          var hours = Math.abs(parseInt(chout[0]) - parseInt(chin[0])) * 60;
          var minute = parseInt(chout[1]) - parseInt(chin[1]);
          miniutedic[datearr[j].Date] = hours + minute;
          sum += hours + minute;
        } else {
          var chin = datearr[j].CheckIn.split(":");
          var chout = datearr[j].CheckOut.split(":");
          var hours = Math.abs(parseInt(chout[0]) - parseInt(chin[0])) * 60;
          var minute = parseInt(chout[1]) - parseInt(chin[1])
          sum += hours + minute;
          miniutedic[datearr[j].Date] += hours + minute;
        }
      }

      mongomodel.salarymodel.find({}, function (err, data3) {
        if (err) throw err;
        var tsalary = sum * 4;
        var deduction = parseInt(data3[0].ProfessionalTax) + parseInt(data3[0].ProvidentFund) + parseInt(data3[0].MedicalInsurance);
        var inhand = tsalary - deduction;
        res.render('salary', { title: "salary", x: "Calculate the salary(Joy).", p: req.params.E, records: miniutedic, data3: data3, sum: sum, salary: tsalary, de: deduction, inhand: inhand });
      });
    })
  }

});

//to render trainers home
router.get('/thome', function (req, res, next) {
  mongomodel.Basicinfomodel.find({}, function (err, dataa) {

    var MyDate = new Date();
    var MyDateString;
    MyDate.setDate(MyDate.getDate());
    MyDateString = MyDate.getFullYear() + '-' + ('0' + (MyDate.getMonth() + 1)).slice(-2) + '-' + ('0' + MyDate.getDate()).slice(-2);
    mongomodel.filemodel.find({}, function (err, data1) {
      if (err) throw err;
      res.render('trainershome', { title: 'Home', data: dataa, date: MyDateString, data1: data1 });
    });

  });
});

// trainer side project
router.get('/trainersideproject/:E',function(req,res,next){
  mongomodel.projectmodel.find({EmailId:req.params.E},function(err,data){
    console.log(data);
    res.render('trainersideproject',{title:"project",records:data});
  });
});

module.exports = router;

