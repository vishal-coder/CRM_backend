import {
  fetchServiceRequest,
  getManagerServiceRequest,
  insertServiceRequest,
  updateServiceRequestById,
} from "../models/ServiceModel.js";

export const createServiceRequest = async (req, res) => {
  try {
    const { email, description, createdBy, priority } = req.body;
    const data = {
      email: email,
      description: description,
      createdBy: createdBy,
      priority: priority,
      createdOn: new Date(),
      status: "Open",
    };

    const response = await insertServiceRequest(data);

    res.status(200).send({
      message: "Service Request Created Successfully",
      success: true,
      serviceReq: response,
    });
  } catch (error) {
    return res.send({
      message: "Something went wrong....Please try again later",
      success: false,
    });
  }
};

export const getServiceRequests = async (req, res) => {
  try {
    const { username, userType } = req.body;

    let response = null;
    if (userType === "Manager") {
      response = await getManagerServiceRequest(username);
    } else {
      response = await fetchServiceRequest(username, userType);
    }

    res.status(200).send({
      message: "Lead fetched Successfully",
      success: true,
      serviceReq: response,
    });
  } catch (error) {
    return res.send({
      message: "Something went wrong....Please try again later",
      success: false,
    });
  }
};

export const updateServiceStatus = async (req, res) => {
  try {
    const { id } = req.body;
    const response = await updateServiceRequestById(id);

    res.status(200).send({
      message: "Lead updated Successfully",
      success: true,
    });
  } catch (error) {
    return res.send({
      message: "Something went wrong....Please try again later",
      success: false,
    });
  }
};
