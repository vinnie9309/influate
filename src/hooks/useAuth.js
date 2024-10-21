import { useEffect } from "react"
import Cookies from "js-cookie"
import { useSelector, useDispatch } from "react-redux"

import {
  selectIsAuthenticated,
  loggedIn,
  loggedOut
} from "../app/api/authSlice"

const useAuth = () => {
  const isAuthenticated = useSelector(selectIsAuthenticated)
  const dispatch = useDispatch()

  useEffect(() => {
    const token = Cookies.get("authToken")
    if (token) {
      dispatch(loggedIn({ token }))
    } else {
      dispatch(loggedOut())
    }
  }, [dispatch])

  return isAuthenticated
}

export default useAuth
