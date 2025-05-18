import CustomButton from "@/components/custom/custom-button";
import CustomForm from "@/components/custom/custom-form";
import CustomInput from "@/components/custom/custom-input";
import CustomSelectField from "@/components/custom/custom-seletectField";
import { useUpdateProfileMutation } from "@/redux/features/profile/profileApi";
import { IUser } from "@/types/user.types";
import { editProfileValidationSchema } from "@/validation/user.validation";
import { zodResolver } from "@hookform/resolvers/zod";
import { FieldValues } from "react-hook-form";
import toast from "react-hot-toast";

interface IEditMyProfileDetailsProps {
  userData: IUser;
  setEditMode: React.Dispatch<React.SetStateAction<boolean>>;
}

const EditMyProfileDetails = ({ userData, setEditMode }: IEditMyProfileDetailsProps) => {
  const [updateProfile, { isLoading }] = useUpdateProfileMutation();
  const handleEditProfileInformation = async (values: FieldValues) => {
    try {
      const res = await updateProfile(values).unwrap();
      toast.success(res?.message);
      setEditMode(false);
    } catch (error) {
      const err = error as Error;
      toast.error(err?.message || "Something went wrong!");
    }
  };
  return (
    <section className="w-full grid grid-cols-1 md:grid-cols-3 gap-4 mt-8 ">
      <div className="w-full col-span-2 border border-[#E2E8F0] shadow p-4">
        <div className="border-b border-[#E2E8F0] pb-4 mb-4">
          <h1 className="text-xl font-semibold">Personal Information</h1>
        </div>
        <CustomForm
          onSubmit={handleEditProfileInformation}
          defaultValues={userData}
          resolver={zodResolver(editProfileValidationSchema)}
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <CustomInput
              type="text"
              required
              name="fullName"
              placeholder="Enter your full name"
              label="Full Name"
            />
            <CustomInput
              type="text"
              name="nickname"
              placeholder="Enter your nick name"
              label="Nick Name"
            />
            <CustomInput
              type="text"
              name="username"
              required
              placeholder="Enter your username"
              label="Username"
            />
            {/* add address,phoneNumber,city and sate, referred as, age range, profession, relationship status */}
            <CustomInput
              type="text"
              required
              name="address"
              placeholder="Enter your address"
              label="Address"
            />
            <CustomInput
              type="text"
              required
              name="phoneNumber"
              placeholder="Enter your phone number"
              label="Phone Number"
            />
            {/* country */}
            <CustomInput
              type="text"
              name="country"
              required
              placeholder="Enter your country"
              label="Country"
            />
            <CustomInput
              type="text"
              name="city"
              required
              placeholder="Enter your city"
              label="City"
            />
            <CustomInput
              type="text"
              required
              name="state"
              placeholder="Enter your state"
              label="State"
            />
            {/* Referred as */}
            <CustomSelectField
              items={["He/Him", "She/Her", "They/Them", "Undisclosed"]}
              name="referredAs"
              label="Referred As"
              size="md"
              required
              placeholder="How did you know about us"
            />
            <CustomSelectField
              items={[
                "13-17",
                "18-24",
                "25-34",
                "35-44",
                "45-54",
                "55-64",
                "65+",
              ]}
              name="ageRange"
              label="Age Range"
              size="md"
              required
              placeholder="Select your age range"
            />
            <CustomInput
              type="text"
              name="profession"
              required
              placeholder="Enter your profession"
              label="Profession"
            />
            {/* Relationship status */}
            <CustomSelectField
              items={[
                "Divorced",
                "Domestic Partnership",
                "Engaged",
                "In a Relationship",
                "It's Complicated",
                "Looking",
                "Married",
                "Married with child/children",
                "Single",
                "Undisclosed",
                "Widowed",
              ]}
              required
              name="maritalStatus"
              label="Relationship Status"
              size="md"
              placeholder="What is your marital status"
            />
          </div>
          <div className="mt-6 flex flex-col md:flex-row gap-4">
            <CustomButton
              type="button"
              variant="outline"
              onClick={() => setEditMode(false)}
              className="px-9 py-3"
              fullWidth
            >
              Cancel
            </CustomButton>
            <CustomButton
              loading={isLoading}
              type="submit"
              variant="default"
              className="px-9 py-3"
              fullWidth
            >
              Save
            </CustomButton>
          </div>
        </CustomForm>
      </div>
      <div className="w-full col-span-1 border border-[#E2E8F0] shadow p-4">
        <div className="border-b border-[#E2E8F0] pb-4 mb-4">
          <h1 className="text-xl font-semibold">Your Photo</h1>
        </div>
      </div>
    </section>
  );
};

export default EditMyProfileDetails;
