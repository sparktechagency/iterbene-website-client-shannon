import UserProfileInformationPage from "@/components/pages/UserProfilePage/UserProfilePage";
import React from "react";

const layout = ({ children }: { children: React.ReactNode }) => {
    return <UserProfileInformationPage>{children}</UserProfileInformationPage>;
};

export default layout;
