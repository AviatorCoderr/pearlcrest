import { Flat } from '../models/flats.model.js';

export const storeDeviceToken = async (req, res) => {
  const { token } = req.body;
  const flatid = req?.flat?._id
    console.log("hello")
  try {
    const flat = await Flat.findOneAndUpdate({ _id: flatid }, { deviceToken: token }, { new: true });
    if (!flat) {
      return res.status(404).json({ success: false, message: 'Flat not found' });
    }

    res.status(200).json({ success: true, message: 'Device token stored successfully' });
  } catch (error) {
    console.error('Error storing device token:', error);
    res.status(500).json({ success: false, error: 'Internal Server Error' });
  }
};
