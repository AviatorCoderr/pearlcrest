import Complaint from '../models/complaints.model.js';
import { getExecutiveFlatByCategory } from '../utils/executiveMapping.js';
import { Flat } from '../models/flats.model.js';
// Create a new complaint
export const getUserComplaints = async (req, res) => {
  try {
    const flatNumber = req.flat._id;
    const complaints = await Complaint.find({ flatNumber }).populate('executiveFlat');
    res.status(200).json({ data: complaints });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
};
export const createComplaint = async (req, res) => {
  try {
    const { category, description } = req.body;
    const flatNumber = req.flat._id;

    // Determine executiveFlat based on category
    const executiveFlat = getExecutiveFlatByCategory(category);
    console.log(executiveFlat)
    const executive = await Flat.findOne({flatnumber: executiveFlat})
    const executiveid = executive?._id
    console.log(executiveid)
    const newComplaint = await Complaint.create({
      category,
      description,
      flatNumber,
      executiveFlat: executiveid
    });

    await newComplaint.save();
    res.status(201).json({ message: 'Complaint created successfully', data: newComplaint });
  } catch (error) {
    console.log(error)
    res.status(500).json({ message: 'Server error', error });
  }
};

// Get all complaints for the logged-in executive
export const getComplaints = async (req, res) => {
  try {
    const executiveFlat = req.flat._id;
    const complaints = await Complaint.find({ executiveFlat }).populate('flatNumber');

    res.status(200).json({ data: complaints });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
};

// Update the status of a complaint
export const updateComplaintStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    const updatedComplaint = await Complaint.findByIdAndUpdate(
      id,
      { status },
      { new: true }
    );

    if (!updatedComplaint) {
      return res.status(404).json({ message: 'Complaint not found' });
    }

    res.status(200).json({ message: 'Status updated successfully', data: updatedComplaint });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
};
