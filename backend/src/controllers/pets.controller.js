import {asyncHandler} from "../utils/asynchandler.js"
import {Pet} from "../models/pets.model.js"
import {ApiResponse} from "../utils/ApiResponse.js"
import {ApiError} from "../utils/ApiError.js"

const addAdminPets = asyncHandler(async (req, res) => {
    try {
        const pets = req.body;

        // Check if pets is an array and is not empty
        if (!Array.isArray(pets) || pets.length === 0) {
            throw new Error("Pet data is missing or not in the correct format");
        }

        for (const petData of pets) {
            const { flat, type, breed } = petData;
            const pet = await Pet.create({
                flat,
                type,
                breed
            });
            if (!pet) {
                throw new Error("Failed to create pet");
            }
        }

        res.status(201).json({ success: true, message: "Pets created successfully" });
    } catch (error) {
        res.status(400).json({ success: false, message: error.message });
    }
});
const getPets = asyncHandler(async (req, res) => {
    const flatid = req?.flat._id.toString();
    const pets = await Pet.find({flat: {$in: flatid}});
    res.status(200).json(new ApiResponse(200, {pets}, "Vehicle data received"));
});

export {addAdminPets, getPets}