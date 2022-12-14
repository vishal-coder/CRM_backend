import { newContactEmmiter } from "../EventMonitor/ContactEventMonitor.js";
import { newLeadEmmiter } from "../EventMonitor/LeadEventMonitor.js";
import { client } from "../index.js";
import { insertContact } from "../models/ContactModel.js";
import {
  deleteLeadById,
  fetchLeads,
  getLeadByEmail,
  getLeadById,
  getManagerLeads,
  insertLead,
} from "../models/LeadModel.js";

export const createLead = async (req, res) => {
  try {
    const { firstname, lastname, phone, email, category, createdBy, source } =
      req.body;
    const data = {
      firstname: firstname,
      lastname: lastname,
      phone: phone,
      email: email,
      category: category,
      createdBy: createdBy,
      source: source,
      createdOn: new Date(),
    };

    const dBLeadByEmail = await getLeadByEmail({ email: email });

    if (dBLeadByEmail) {
      return res
        .status(401)
        .send({ message: "Lead By same Email Already Exists" });
    }
    const pipeline = [
      {
        $match: {
          operationType: "insert",
        },
      },
    ];
    newLeadEmmiter(client, 10000, pipeline);
    const response = await insertLead(data);
    res.status(200).send({
      message: "Lead Created Successfully",
      success: true,
      users: response,
    });
  } catch (error) {
    return res.send({
      message: "Something went wrong....Please try again later",
      success: false,
    });
  }
};

export const getLeads = async (req, res) => {
  try {
    const { username, userType } = req.body;

    let response = null;
    if (userType === "Manager") {
      response = await getManagerLeads(username);
    } else {
      response = await fetchLeads(username, userType);
    }

    res.status(200).send({
      message: "Lead fetched Successfully",
      success: true,
      leads: response,
    });
  } catch (error) {
    return res.send({
      message: "Something went wrong....Please try again later",
      success: false,
    });
  }
};

export const deleteLead = async (req, res) => {
  try {
    const { id } = req.body;

    const response = await deleteLeadById(id);
    res.status(200).send({
      message: "Lead deleted Successfully",
      success: true,
      leads: response,
    });
  } catch (error) {
    return res.send({
      message: "Something went wrong....Please try again later",
      success: false,
    });
  }
};

export const MarkLeadAsContact = async (req, res) => {
  try {
    const { id } = req.body;
    const lead = await getLeadById(id);
    const contact = {
      firstname: lead.firstname,
      lastname: lead.lastname,
      phone: lead.phone,
      email: lead.email,
      category: lead.category,
      createdBy: lead.createdBy,
      category: "Contact",
      status: "Pending Payment",
      createdOn: new Date(),
    };

    const pipeline = [
      {
        $match: {
          operationType: "insert",
        },
      },
    ];

    newContactEmmiter(client, 10000, pipeline);
    const contactResult = await insertContact(contact);
    const response = await deleteLeadById(id);

    res.status(200).send({
      message: "Lead updated Successfully",
      success: true,
      leads: response,
    });
  } catch (error) {
    console.log(error);
    return res.send({
      message: "Something went wrong....Please try again later",
      success: false,
    });
  }
};
