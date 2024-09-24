const User = require("../models/product.model.js");
const csv = require("csvtojson");

const CsvParser = require("json2csv").Parser;

const getUsers = async (req, res) => {
  try {
    const user = await User.find({});
    res.status(200).json(user);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getUser = async (req, res) => {
  try {
    const { id } = req.params;
    const user = await User.findById(id);
    res.status(200).json(user);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const createUser = async (req, res) => {
  try {
    console.log("req", req);
    const user = await User.create(req.body);
    res.status(200).json(user);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const updateUser = async (req, res) => {
  try {
    const { id } = req.params;
    const Updateuser = await User.findByIdAndUpdate(id, req.body);
    if (!Updateuser) {
      return res.status(404).json({ message: "user not found" });
    }

    res.status(200).json(Updateuser);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const deleteUser = async (req, res) => {
  try {
    const { id } = req.params;
    const Deleteuser = await User.findByIdAndDelete(id);
    if (!Deleteuser) {
      return res.status(404).json({ message: "user not found" });
    }

    res.status(200).json({ message: "user delete successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const exportUser = async (req, res) => {
  try {
    const users = [];
    const userData = await User.find({});

    userData.forEach((user) => {
      const { id, name, email, mobile } = user;
      users.push({ id, name, email, mobile });
    });
    const csvFields = ["id", "name", "email", "mobile"];
    const csvParser = new CsvParser({ fields: csvFields });
    const csvData = csvParser.parse(users);

    res.setHeader("content-Type", "text/csv");
    res.setHeader("Content-Disposition", "attachment;filename=usersData.csv");
    res.status(200).end(csvData);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const importUser = async(req, res) => {
  try {
    const userData = [];
    csv()
      .fromFile(req.file.path)
      .then(async(response) => {
        for (let x = 0; x < response.length; x++) {
          userData.push({
            name: response[x].name,
            email: response[x].email,
            mobile: response[x].mobile,
          });
        }
        await User.insertMany(userData);
      });
      res.send({status:200,success:true,msg:'Csv Imported'})
  } catch {}
};
module.exports = {
  getUsers,
  getUser,
  createUser,
  updateUser,
  deleteUser,
  exportUser,
  importUser,
};
