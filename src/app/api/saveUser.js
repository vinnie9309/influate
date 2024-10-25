// import { db as database } from "../../../firebase/config"
// import { ref } from "firebase/database"
// export const addUser = function (uid, userData) {
//   database
//     .ref("users/" + uid)
//     .set(userData)
//     .then(() => {
//       console.log("User data saved successfully.")
//     })
//     .catch((error) => {
//       console.error("Error saving user data: ", error)
//     })
// }
// export const getUser = function (uid) {
//   return database.ref("users/" + uid).once("value")
// }
