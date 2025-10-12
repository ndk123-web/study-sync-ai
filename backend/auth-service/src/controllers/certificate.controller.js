import wrapper from "../utils/Wrapper.js";
import User from "../models/user.models.js";
import ApiResponse from "../utils/ApiResponse.js";

const GetUserCertificateController = wrapper(async (req, res) => {
  const currentUser = req.user;

  const getCurrentUser = await User.findOne({ uid: currentUser.uid });
  if (!getCurrentUser) {
    console.log("User not found");
    return res.status(404).json(new ApiResponse(404, {}, "User not found"));
  }

  const certificates = getCurrentUser.certificates || [];
  console.log("certificates: ", certificates);

  return res.status(200).json(
    new ApiResponse(
      200,
      {
        certificates,
      },
      "User certificates fetched successfully"
    )
  );
});

export { GetUserCertificateController };