import { createContext, useContext } from "react";

const ProfileTypeContext = createContext();
export const setProfileType = () => useContext(ProfileTypeContext);
