import { asyncHandler } from "../utils/asynchandler.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { ApiError } from "../utils/ApiError.js";
import Maid from "../models/maids.model.js";
import {Flat} from "../models/flats.model.js"
import { sendPushNotificationToDevice } from "../pushnotification.js";
const addMaidByFlat = asyncHandler(async (req, res) => {
    const { _id } = req.body;
    const flatId = req?.flat?._id;

    const existingMaid = await Maid.findById(_id);

    if (!existingMaid) {
        throw new ApiError(404, "Maid not found");
    }

    const flatWorking = existingMaid.flat || [];
    if (flatWorking.includes(flatId)) {
        throw new ApiError(400, "Already linked");
    }

    const newFlatWorking = [...flatWorking, flatId];

    await Maid.findByIdAndUpdate(_id, { flat: newFlatWorking });
    return res.status(200).json(new ApiResponse(200, null, "Added to flat"));
});
const addMaid = asyncHandler(async (req, res) => {
    const { flatnumber, name, mobile, aadhar, purpose } = req.body;
    const existingMaid = await Maid.findOne({
        $or: [{ mobile: mobile }]
    });
    if (existingMaid) {
        throw new ApiError(400, "Already exists. Check Mobile or Aadhar number again");
    }
    let flatidList = [];
    for (const element of flatnumber) {
        const flat = await Flat.findOne({ flatnumber: element });
        const flatid = flat?._id;
        flatidList.push(flatid);
    }
    const response = await Maid.create({
        flat: flatidList,
        name,
        mobile,
        aadhar,
        purpose // Include purpose in creation
    });

    return res.status(200).json(new ApiResponse(200, { response }, "Aaid added"));
});
const getAllMaid = asyncHandler(async (req, res) => {
    try {
        const response = await Maid.find().populate('flat');
        const Maidlist = await Promise.all(response.map(async (record) => {
            const flatnumber = record.flat.flatnumber;
            const isCheckin = await isMaidCheckedIn(record._id);
            return { ...record._doc, flatnumber, checkedin: isCheckin };
        }));
        res.status(200).json(new ApiResponse(200, { Maidlist }, "Data received"));
    } catch (error) {
        throw new ApiError('something went wrong')
    }
});
const getAllMaidByFlat = asyncHandler(async (req, res) => {
    try {
        const {_id} =  req.body
        const response = await Maid.find({flat: _id});
        res.status(200).json(new ApiResponse(200, { response }, "Data received"));
    } catch (error) {
        throw new ApiError(500, "something went wrong")
    }
});
const isMaidCheckedIn = async (maidId) => {
    try {
        const today = new Date();
        const startOfToday = new Date(today.getFullYear(), today.getMonth(), today.getDate(), 0, 0, 0);
        const endOfToday = new Date(today.getFullYear(), today.getMonth(), today.getDate() + 1, 0, 0, 0);
        
        const maid = await Maid.findOne({
            _id: maidId,
            $and: [
                { checkin: { $gte: startOfToday }, checkin: { $lt: endOfToday } }
            ]
        });

        return maid ? true : false;
    } catch (error) {
        throw new ApiError(500, error)
    }
};
const checkin = asyncHandler(async (req, res) => {
    const { _id } = req.body;
    const currentTime = new Date();
    const showTime = currentTime.toLocaleString("en-IN", {timeZone: "Asia/Kolkata"});
    
    const existingMaid = await Maid.findById(_id).populate('flat'); // populate to get flat details
    
    if (!existingMaid) {
      throw new ApiError(404, "Not found");
    }
    
    const flats = existingMaid.flat;
    
    // Iterate over each flat to send push notifications
    for (const flat of flats) {
      const flatDetail = await Flat.findById(flat._id);
      if (flatDetail?.deviceToken && flatDetail.deviceToken.length > 0) {
        let title = "घर में धमाका! कोई आ गया!";
      const body = `${existingMaid?.name} ने ${showTime} पर चेक-इन किया है।`;

      const maidNotifications = [
        "हाय मां! लगता है आज 'सास-बहू' का ड्रामा कम, सफाई का ज्यादा होगा!",
        "'झाड़ू पकड़कर नाचो' बाई जी आ गई हैं, घर नाचने लगेगा!", 
        "बोलो ज़रा 'बाई जी आई हैं तो चाय तो बनती है ही!' जल्दी से बनाओ, नहीं तो 'पड़ोसन चुरा लेगी'!"
      ];

      const milkmanNotifications = [
        "'चाय के लिए दूध नहीं'  - ये झूठ बोलने का टाइम खत्म हुआ! दूध वाला भैया आ गए हैं!",
        "क्या आज 'कॉफी पीने का मन नहीं करता'? दूध वाला आया है, जल्दी ले लो, नहीं तो 'पड़ोसी ले जाएगी'!",
        "दूध वाला आया है!  'अरे बाप रे, सीरियल खत्म हो गया!' जल्दी से दुकान दौड़ो!"
      ];

      const schoolVanNotifications = [
        "बच्चों को जल्दी तैयार करो, नहीं तो 'टाइमिंग है Boss!' स्कूल जाने में देर हो जाएगी और 'टीचर डांटेंगी'!",
        "'बच्चे पढ़ने गए, घर में शांति!' का टाइम आ गया है! स्कूल वैन आ गई!",
        "स्कूल वैन आई है! जल्दी से बच्चों को बिठाओ, नहीं तो 'होमवर्क पूरा नहीं किया' का बवाल मचेगा!"
      ];

      const garbageVanNotifications = [
        "अरे बाप रे! कचरा का अंबार लग गया है! जल्दी से निकालो, गाड़ी आ गई है, नहीं तो 'पड़ोसी ताना मारेंगी'!",
        "'स्वच्छ भारत अभियान' में अपना योगदान दो! कचरा बाहर निकालने का समय है, नहीं तो 'पति डांटेंगे'!",
        "'कूड़ा करकट' जल्दी से बाहर निकालो, गाड़ी आ गई है, नहीं तो 'सास जी बोलेंगी'!"
      ];

      const newspaperNotifications = [
        "ताज़ा खबरें आपके दरवाजे पर!️",
        "नमस्ते! सुबह की ताज़ा खबरें आपके लिए तैयार हैं! ☕️️",
        "दुनिया की खबरें, आपके घर में! ",
        "चाय के साथ गरमागरम खबरें! ☕️️",
        "अखबार आया है! पढ़कर जानिए देश-विदेश की हर बात! ",
        "नए दिन की शुरुआत ताज़ा खबरों के साथ! ☀️️",
      ];

      const getRandomNotification = (notifications) => {
        return notifications[Math.floor(Math.random() * notifications.length)];
      };

      switch (existingMaid.purpose) {
        case "MAID":
          title = getRandomNotification(maidNotifications);
          break;
        case "MILKMAN":
          title = getRandomNotification(milkmanNotifications);
          break;
        case "SCHOOL VAN":
          title = getRandomNotification(schoolVanNotifications);
          break;
        case "GARBAGE VAN":
          title = getRandomNotification(garbageVanNotifications);
          break;
        case "NEWSPAPER":
        title = getRandomNotification(newspaperNotifications)
        break;
        default:
          title = "घर में धमाका! कोई आ गया!";
      }
        
        // Iterate over all device tokens and send notification to each
        await Promise.all(flatDetail.deviceToken.map(token => {
          sendPushNotificationToDevice(token, flat._id, title, body)
        }
        ));
      }
    }
  
    const datetimearray = existingMaid.checkin || [];
    const newarray = [...datetimearray, currentTime];
    
    const response = await Maid.updateOne({ _id }, { $set: { checkin: newarray } });
    
    res.status(200).json(new ApiResponse(200, { response }, "Check in time added"));
});
const checkout = asyncHandler(async(req, res) => {
    const {_id} = req.body;
    const currentTime = new Date();
    const isoTime = currentTime.toLocaleString("en-IN", {timeZone: "Asia/Kolkata"}); // Convert date to ISO 8601 format
    const response = await Maid.updateOne({_id}, {$set: {checkout: isoTime}});
    res.status(200).json(new ApiResponse(200, {response}, "Check out time updated"));
});
const deleteMaidbyFlat = asyncHandler(async(req, res) => {
    const {maidid, flatid} = req.body
    console.log(maidid, flatid)
    const exisitingmaid = await Maid.findById({_id: maidid})
    if(!exisitingmaid) throw new ApiError(404, "Not found")
    const flatarray = exisitingmaid.flat
    const newflatarray = flatarray.filter((ele) => ele===flatid)
    console.log(flatarray)
    console.log(newflatarray)
    await Maid.updateOne({_id: maidid}, {$set: {flat: newflatarray}})
    return res.status(200).json(new ApiResponse(200, "Removed"))
})
const addMaidbyloop = asyncHandler(async(req, res) => {
    const maiddet = req.body
    try {
        for(const maid of maiddet){
            const {name, mobile} = maid;
            const maidcreated = await Maid.create({
                name,
                mobile
            })
            if(!maidcreated) throw new ApiError(500, "Something went wrong")
        }
        return res.status(200).json(new ApiResponse(200, "all data added"))
    } catch (error) {
        console.log(error)
        throw new ApiError(500, error)
    }
})
export {addMaidByFlat, addMaid, getAllMaid, checkin, checkout, getAllMaidByFlat, deleteMaidbyFlat, addMaidbyloop}