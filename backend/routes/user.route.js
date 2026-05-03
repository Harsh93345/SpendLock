import {Router} from "express"
import { registerUser,loginUser,logoutUser,refreshAcessToken,changeCurrentPassword,changeUpiPin,UpdateAccountDetails,updateUserAvatar,getCurrentUser } from "../controllers/user.controller.js"
import { verifyJWT } from "../middlewares/auth.middleware.js"
import { upload } from "../middlewares/multer.middleware.js"

const userRouter = Router()

userRouter.route("/register").post(
  upload.fields([
    {
      name: "avatar",
      maxCount: 1
    }
  ]),
  registerUser
)

userRouter.route("/login").post(loginUser)

userRouter.route("/logout").post(logoutUser)
userRouter.route("/refresh-token").post(refreshAcessToken)
userRouter.route("/change-password").post(verifyJWT, changeCurrentPassword)
userRouter.route("/current-user").get(verifyJWT, getCurrentUser)
userRouter.route("/change-upi-pin").post(verifyJWT, changeUpiPin)
userRouter.route("/update-account").patch(verifyJWT, UpdateAccountDetails)
userRouter.route("/update-avatar").patch(verifyJWT, upload.single("avatar"), updateUserAvatar)

export default userRouter