import CustomForm from "@/components/custom/custom-form";
import CustomInput from "@/components/custom/custom-input";
import CustomSelectField from "@/components/custom/custom-seletectField";

const EditMyProfileDetails = () => {
  const handleEditProfileInformation = () => {};
  return (
    <section className="w-full grid grid-cols-1 md:grid-cols-3 gap-4 mt-8 " >
      <div className="w-full col-span-2 border border-[#E2E8F0] shadow p-4">
        <div className="border-b border-[#E2E8F0] pb-4 mb-4">
          <h1 className="text-xl font-semibold">Personal Information</h1>
        </div>
        <CustomForm onSubmit={handleEditProfileInformation}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <CustomInput
              type="text"
              required
              name="firstName"
              placeholder="Enter your first name"
              label="First Name"
            />
            <CustomInput
              type="text"
              required
              name="lastName"
              placeholder="Enter your last name"
              label="Last Name"
            />
            <CustomInput
              type="text"
              name="nickName"
              placeholder="Enter your nick name"
              label="Nick Name"
            />
            <CustomInput
              type="text"
              name="userName"
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
            <CustomInput
              type="text"
              name="city"
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
             items={
              [
                "Friend",
                "Family",
                "Colleague",
                "Acquaintance",
                "Other",
              ]
             }
             name="referredAs"
              label="Referred As"
              size="md"
              required
              placeholder="How did you know about us"
            />
            
            <CustomSelectField
             items={
              [
                "18-24",
                "25-34",
                "35-44",
                "45-54",
                "55-64",
                "65+",
              ]
             }
             name="ageRange"
              label="Age Range"
              size="md"
              required
              placeholder="Select your age range"
            />
            <CustomInput
              type="text"
              name="profession"
              placeholder="Enter your profession"
              label="Profession"
            />
            {/* Relationship status */}
            <CustomSelectField
             items={
              [
                "Single",
                "Married",
                "Divorced",
                "Separated",
                "Widowed",
              ]
             }
             name="relationshipStatus"
              label="Relationship Status"
              size="md"
              required
              placeholder="What is your marital status"
            />
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
