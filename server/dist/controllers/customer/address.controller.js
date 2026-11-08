import { asyncHandler } from "../../utils/asyncHandler.js";
import { getDbUserFromReq } from "../../middleware/auth.js";
import { User } from "../../models/User.js";
import { requireFound, requireText } from "../../utils/helpers.js";
import { ok } from "../../utils/envelope.js";
import { AppError } from "../../utils/AppError.js";
const mapAddress = (item) => {
    return {
        _id: String(item._id || ""),
        fullName: item.fullName,
        address: item.address,
        state: item.state,
        postalCode: item.postalCode,
        isDefault: item.isDefault,
    };
};
export const getAddress = asyncHandler(async (req, res) => {
    const dbUser = await getDbUserFromReq(req);
    const user = await User.findById(dbUser._id);
    const foundUser = requireFound(user, "User not found", 404);
    const addresses = (foundUser.addresses || []);
    const items = [...addresses]
        .sort((a, b) => Number(b.isDefault) - Number(a.isDefault))
        .map(mapAddress);
    res.status(200).json(ok({ items }));
});
export const postAddress = asyncHandler(async (req, res) => {
    const dbUser = await getDbUserFromReq(req);
    const fullName = String(req.body.fullName || "").trim();
    const address = String(req.body.address || "").trim();
    const state = String(req.body.state || "").trim();
    const postalCode = String(req.body.postalCode || "").trim();
    requireText(fullName, "Full name is required");
    requireText(address, "Address is required");
    requireText(state, "State is required");
    requireText(postalCode, "Postal Code is required");
    const user = await User.findById(dbUser._id);
    const foundUser = requireFound(user, "User not found", 404);
    const addresses = (foundUser.addresses || []);
    const shouldMarkAsDefault = req.body.isDefault === true || addresses.length === 0;
    if (shouldMarkAsDefault) {
        addresses.forEach((item) => {
            item.isDefault = false;
        });
    }
    addresses.push({
        fullName,
        address,
        state,
        postalCode,
        isDefault: shouldMarkAsDefault,
    });
    await foundUser.save();
    const items = [...addresses]
        .sort((a, b) => Number(b.isDefault) - Number(a.isDefault))
        .map(mapAddress);
    res.status(201).json(ok({ items }));
});
export const editAddress = asyncHandler(async (req, res) => {
    const dbUser = await getDbUserFromReq(req);
    const addressId = String(req.params.addressId || "").trim();
    requireText(addressId, "Address ID is required");
    const fullName = String(req.body.fullName || "").trim();
    const address = String(req.body.address || "").trim();
    const state = String(req.body.state || "").trim();
    const postalCode = String(req.body.postalCode || "").trim();
    requireText(fullName, "Full name is required");
    requireText(address, "Address is required");
    requireText(state, "State is required");
    requireText(postalCode, "Postal Code is required");
    const user = await User.findById(dbUser._id);
    const foundUser = requireFound(user, "User not found", 404);
    const addresses = (foundUser.addresses || []);
    const getAddressTheUserWantsToEdit = addresses.find((currentAddress) => String(currentAddress._id) === addressId);
    if (!getAddressTheUserWantsToEdit) {
        throw new AppError(404, "Address not found");
    }
    const shouldMarkAsDefault = req.body.isDefault === true || addresses.length === 0;
    if (shouldMarkAsDefault) {
        addresses.forEach((item) => {
            item.isDefault = false;
        });
    }
    getAddressTheUserWantsToEdit.fullName = fullName;
    getAddressTheUserWantsToEdit.address = address;
    getAddressTheUserWantsToEdit.state = state;
    getAddressTheUserWantsToEdit.postalCode = postalCode;
    if (shouldMarkAsDefault) {
        getAddressTheUserWantsToEdit.isDefault = true;
    }
    await foundUser.save();
    const items = [...foundUser.addresses]
        .sort((a, b) => Number(b.isDefault) - Number(a.isDefault))
        .map(mapAddress);
    res.status(201).json(ok({ items }));
});
export const deleteAddress = asyncHandler(async (req, res) => {
    const dbUser = await getDbUserFromReq(req);
    const addressId = String(req.params.addressId || "").trim();
    requireText(addressId, "Address ID is required");
    const user = await User.findById(dbUser._id);
    const foundUser = requireFound(user, "User not found", 404);
    const addresses = (foundUser.addresses || []);
    const addressToBeDeletedIndex = addresses.findIndex((currentAddress) => String(currentAddress._id) === addressId);
    if (addressToBeDeletedIndex < 0) {
        throw new AppError(404, "Address not found");
    }
    const wasDefault = addresses[addressToBeDeletedIndex]?.isDefault;
    addresses.splice(addressToBeDeletedIndex, 1);
    if (wasDefault &&
        addresses.length > 0 &&
        !addresses.some((address) => address.isDefault)) {
        addresses[0].isDefault = true;
    }
    // if (
    //   wasDefault &&
    //   addresses.length > 0 &&
    //   !addresses.some((address) => address.isDefault)
    // ) {
    //   const firstAddress = addresses[0];
    //   if (firstAddress) {
    //     firstAddress.isDefault = true;
    //   }
    // }
    await foundUser.save();
    const items = [...foundUser.addresses]
        .sort((a, b) => Number(b.isDefault) - Number(a.isDefault))
        .map(mapAddress);
    res.json(ok({ items }));
});
//# sourceMappingURL=address.controller.js.map