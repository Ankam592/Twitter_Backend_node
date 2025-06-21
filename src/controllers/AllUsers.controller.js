import { User } from "../models/user.models.js"
import { Logger } from "../../utils/logger.js";
import { authorizeAdmin } from "../middlewares/authorizeAdmin.js";
const AllUsers = async function (req, res) {
  try {
    const { email, role } = res.locals.user;
    if (role == 'admin') {
      var users = await User.find({});
    }
    else {
      var users = await User.find({ email });
    }
    return res.render("AllUsers", { "Members": users });
  } catch (error) {
    return res.status(500).json({ message: 'Error fetching members', error });
  }
}

const searchEmp = async (req, res) => {
  const searchText = req.body.role;
  const Regex = new RegExp(`\\s*${searchText}\\s*`, 'mi');  
            // for allowing whitespace-\\s*  and m for multiline and i for case-insensitive  
  var membersEmp;
  if(searchText=='search')
  {
     membersEmp = await User.find({
      $or: [ 
        { Fullname: { $regex: Regex } },
        { email: { $regex: Regex } },
        { Address: { $regex: Regex } },
        { role: { $regex: Regex } }
      ]
    })
  }
  else
  {
      membersEmp = await User.find({
      $or: [ 
        { role: { $regex: Regex } }
      ]
    })
  }
 
  return res.status(200).json({ 'text': membersEmp })
}


export { AllUsers, searchEmp };