import { Flat } from '../models/flats.model.js';

export const storeDeviceToken = async (req, res) => {
  const { token } = req.body;
  const flatid = req?.flat?._id;

  try {
    const flat = await Flat.findById(flatid);
    if (!flat) {
      return res.status(404).json({ success: false, message: 'Flat not found' });
    }

    // Check if the token already exists
    if (!flat.deviceToken.includes(token)) {
      flat.deviceToken.push(token); // Add the new token to the array
      await flat.save(); // Save the updated flat document
    }

    res.status(200).json({ success: true, message: 'Device token stored successfully' });
  } catch (error) {
    console.error('Error storing device token:', error);
    res.status(500).json({ success: false, error: 'Internal Server Error' });
  }
};

export const deleteDeviceToken = async (token, flatid) => {
  console.log("delete", token)
  try {
    const flat = await Flat.findById(flatid);
    if (!flat) {
      return res.status(404).json({ success: false, message: 'Flat not found' });
    }

    // Check if the token exists
    if (flat.deviceToken.includes(token)) {
      // Remove the token from the array
      flat.deviceToken = flat.deviceToken.filter(existingToken => existingToken !== token);
      await flat.save(); // Save the updated flat document

      console.log('Device token deleted successfully')
    } else {
      console.log('Device token not found')
    }
  } catch (error) {
    console.error('Error deleting device token:', error);
  }
};



