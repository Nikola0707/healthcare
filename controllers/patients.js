const Patient = require('../models/patient');
const Doctor = require('../models/doctor');

module.exports = {
  // getAll: async (req, res) => {
  //   const patients = await Patient.find().populate('doctor');

  //   res.render('patients/index', { patients: patients })
  // },
  getAll: async (req, res) => {
    if (req.query) {
      // console.log(req.query)
      const regex = new RegExp(req.query.search, "gi");
      if (req.query.select === "ssn") {
        Patient.find({  ssn: regex }, function (err, patients) {
          if (err) {
            console.log(err);
          } else {
            res.render("patients/index", { patients: patients });
          }
        }).populate('doctor');
      } else if (req.query.select === "fullName") {
        Patient.find(
          { full_name: regex},
          function (err, patients) {
            if (err) {
              console.log(err);
            } else {
              res.render("patients/index", { patients: patients });
            }
          }
        ).populate('doctor');
      } else if (req.query.select === "city") {
        Patient.find(
          { city: regex },
          function (err, patients) {
            if (err) {
              console.log(err);
            } else {
              res.render("patients/index", { patients: patients });
            }
          }
        ).populate('doctor');
      } else if (req.query.select === "age") {
        Patient.find(
          { age: regex },
          function (err, patients) {
            if (err) {
              console.log(err);
            } else {
              res.render("patients/index", { patients: patients });
            }
          }
        ).populate('doctor');
      } else if (req.query.select === "doctor") {
        Patient.find(
          { doctor: regex},
          function (err, patients) {
            if (err) {
              console.log(err);
            } else {
              res.render("patients/index", { patients: patients });
            }
          }
        ).populate('doctor');
      } else {
        Patient.find(
          { $or: [{ ssn: regex }, { full_name: regex }, { city: regex }, { specialization: regex}] },
          function (err, patients) {
            if (err) {
              console.log(err);
            } else {
              res.render("patients/index", { patients: patients });
            }
          }
        ).populate('doctor');
      }
    } else {
      const patients = await Patient.find().populate('doctor');
        res.render('patients/index', { patients: patients })
    }
  },
  getOne: async (req, res) => {
    const patient = await Patient.findById(req.params.id);
    const doctors = await Doctor.find();

    res.render('patients/update', {
      patient,
      doctors
    });
  },
  create: async (req, res) => {
    const doctors = await Doctor.find();
    console.log(doctors)
    res.render('patients/create', { doctors });
  },
  postCreate: async (req, res) => {
    try {
      if (req.body.doctor == '') {
        delete req.body.doctor;
      }

      const patient = new Patient(req.body);
      await patient.save();

      res.redirect('/patients');
    } catch (error) {
      console.log(error);
      res.render('patients/create', {
        ...req.body,
        error: error.message
      });
    }
  },
  postUpdate: async (req, res) => {
    try {
      if (req.body.doctor == '') {
        req.body.doctor = null
      }
      // patient.doctor = ObjectId(null)

      await Patient.findByIdAndUpdate(req.params.id, req.body, { runValidators: true });
      res.redirect('/patients');
    } catch (error) {
      res.render('patients/update', {
        ...req.body,
        _id: req.params.id,
        error: error.message
      })
    }
  },
  delete: async (req, res) => {
    await Patient.findByIdAndRemove(req.params.id)

    res.send({
      error: false,
      message: `Patient with id #${req.params.id} removed`
    });
  },
  patients: async (req, res) => {
    const doctor = await Doctor.findById(req.params.id)
    const patient = await Patient.find()
    res.render("doctors/patients", {
      patients: patient,
      doctors: doctor,
    });
  }
};