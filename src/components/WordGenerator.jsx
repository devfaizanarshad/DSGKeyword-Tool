import { useEffect, useState } from "react";
import {
  FaArrowRight,
  FaCopy,
  FaDownload,
  FaExclamationTriangle,
} from "react-icons/fa";
import { ImHappy } from "react-icons/im";
import { TbFileDownload } from "react-icons/tb";
import businessTypes from "../DummyData/fake"; // Make sure this path is correct
import Button from "./button";
import countriesWithStates from "../DummyData/countries";

const KeyWordGenerator = () => {
  const [selectedBusinessType, setSelectedBusinessType] = useState("");
  const [selectedServices, setSelectedServices] = useState([]);
  const [showSelectedServices, setShowSelectedServices] = useState(false);
  const [keywordsCSV, setKeywordsCSV] = useState("");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [website, setWebsite] = useState("");
  const [country, setCountry] = useState("");
  const [state, setState] = useState("");
  const [zipCode, setZipCode] = useState("");
  const [radius, setRadius] = useState("");
  // Add state to manage the notification for invalid input
  const [invalidRadiusInput, setInvalidRadiusInput] = useState(false);
  const [currentStep, setCurrentStep] = useState(-1);
  const [progress, setProgress] = useState(0);
  const [showNotification, setShowNotification] = useState(false);
  const [showSuccessPopup, setShowSuccessPopup] = useState(false);
  const [showInputGrid, setShowInputGrid] = useState(false);
  const [showStepMap, setShowStepMap] = useState(true);
  const [showLocationInputs, setShowLocationInputs] = useState(false); // Added state for showing location inputs
  const [showLoader, setShowLoader] = useState(false);

  const countries = countriesWithStates.map((country) => country.country);

  // Logic to get states based on the selected country
  const getStatesByCountry = (selectedCountry) => {
    const selectedCountryObject = countriesWithStates.find(
      (c) => c.country === selectedCountry
    );
    return selectedCountryObject ? selectedCountryObject.states : [];
  };

  const states = getStatesByCountry(country);

  const steps = [
    {},
    { name: "Name", value: name, setValue: setName },
    { name: "Email", value: email, setValue: setEmail },
    { name: "Website URL", value: website, setValue: setWebsite },
  ];

  useEffect(() => {
    const timeout = setTimeout(() => {
      setShowSuccessPopup(false);
      setShowNotification(false);
      setInvalidRadiusInput(false);
      setShowLoader(false);
    }, 1500);

    return () => clearTimeout(timeout); // Cleanup function to clear the timeout on component unmount
  }, [showSuccessPopup, showNotification, invalidRadiusInput]);

  useEffect(() => {
    if (currentStep !== -1) {
      const filledSteps = [
        name,
        email,
        website,
        country,
        state,
        zipCode,
        radius,
      ].filter((step) => step !== "").length;
      const totalSteps = 7; // Updated total steps count
      setProgress((filledSteps / totalSteps) * 80);
    }
  }, [name, email, website, country, state, zipCode, radius, currentStep]);

  const handleNextStep = () => {
    let isValid = true;

    // Check if any of the previous steps are empty
    for (let i = 1; i < currentStep; i++) {
      if (steps[i].value.trim() === "") {
        isValid = false;
        break;
      }
    }
// validation of input feilds
    if (isValid) {
      const currentStepValue = steps[currentStep].value;
      if (currentStepValue.trim() === "") {
        setShowNotification(true);
      } else {
        // Additional validation for email and website fields
        if (
          (currentStep === 2 && !validateEmail(currentStepValue)) ||
          (currentStep === 3 && !validateWebsite(currentStepValue)) ||
          (currentStep === 6 && isNaN(currentStepValue.trim())) // Check if the value is not a number for radius
        ) {
          setShowNotification(true);
        } else {
          setCurrentStep(currentStep + 1);
          setShowNotification(false);
        }
      }
    } else {
      setShowNotification(true);
    }
  };

  // Function to validate email format
  const validateEmail = (email) => {
    const re = /\S+@\S+\.\S+/;
    return re.test(email);
  };

  // Function to validate website URL format
  const validateWebsite = (website) => {
    const re = /^(ftp|http|https):\/\/[^ "]+$/;
    return re.test(website);
  };

  const handleLocation = () => {
    setShowStepMap(false);
    setShowLocationInputs(true); // Show location inputs when "Set Location" is clicked
  };


  const handleBusinessTypeChange = (event) => {
    const type = event.target.value;
    setSelectedBusinessType(type);
    setSelectedServices([]);
    setShowSelectedServices(false);
    setShowLocationInputs(false);
    setName("");
    setEmail("");
    setWebsite("");
    setCountry("");
    setState("");
    setZipCode("");
    setRadius("");
    setCurrentStep(-1);
    setShowInputGrid(false);
    setShowStepMap(true);
    setKeywordsCSV("");
    setProgress(0);
  };

  // Function to handle radius change
  const handleRadiusChange = (e) => {
    const inputValue = e.target.value;
    // Check if the input is a valid number
    if (!isNaN(inputValue)) {
      setRadius(inputValue);
      setInvalidRadiusInput(false); // Clear the invalid input notification if input is valid
    } else {
      setRadius(""); // Clear radius if input is not a number
      setInvalidRadiusInput(true); // Set state to show notification for invalid input
    }
  };

  const handleGenerateKeywords = () => {
    if (country.trim() !== "" && state.trim() !== "" && zipCode.trim() !== "") {
      // Generate dummy keywords
      const dummyKeywords = generateDummyKeywords(8); // Generate 8 dummy keywords
      setKeywordsCSV(dummyKeywords);
      setShowStepMap(false);
      setCurrentStep(-1);
      setShowInputGrid(true);
      setShowLoader(true);
      setShowSuccessPopup(true);
      setShowLocationInputs(false);
      // Update progress to 100 when location is entered
      setProgress(100);
    } else {
      setShowNotification(true);
    }
  };

  // Function to generate dummy keywords
  const generateDummyKeywords = (count) => {
    const dummyServices = [
      "Keyword Research",
      "On-Page Optimization",
      "Off-Page Optimization",
      "Link Building",
      "SEO Audit",
      "Content Optimization",
      "Local SEO",
      "Technical SEO",
      "SEO Strategy Consulting",
      "Competitor Analysis",
    ];

    let dummyKeywords = [];
    for (let i = 0; i < count; i++) {
      const randomService =
        dummyServices[Math.floor(Math.random() * dummyServices.length)];
      dummyKeywords.push(`${country}` + "   " + `${randomService}`);
    }
    return dummyKeywords.join("\n");
  };

  const handleCopyKeywords = () => {
    navigator.clipboard.writeText(keywordsCSV);
  };

  const handleDownloadCSV = () => {
    const element = document.createElement("a");
    const file = new Blob([keywordsCSV], { type: "text/csv" });
    element.href = URL.createObjectURL(file);
    element.download = "keywords.csv";
    document.body.appendChild(element); // Required for this to work in Firefox
    element.click();
  };

  const handleServiceCheckboxChange = (event) => {
    const isChecked = event.target.checked;
    const serviceName = event.target.value;
    if (isChecked) {
      setSelectedServices([...selectedServices, serviceName]);
    } else {
      setSelectedServices(
        selectedServices.filter((service) => service !== serviceName)
      );
    }
    setProgress((selectedServices.length + 1) * 20);
  };

  return (
    <div className="rounded-lg p-6 w-full md:max-w-4xl">
      {currentStep !== -1 && (
        <div className="flex items-center justify-center mb-2">
          <div className="w-full  bg-gray-200 rounded-full">
            <div
              className="h-3 bg-gradient-to-r from-yellow-600 to-indigo-600 rounded-full"
              style={{ width: `${progress + 20}%` }}
            ></div>
          </div>
        </div>
      )}
      <h1 className="lg:text-4xl text-3xl  font-bold text-gray-200 mb-4">
        Choose Business Type
      </h1>
      <select
        className="border border-purple-200 rounded  text-gray-700 font-bold bg-gray-300 px-3 py-4 focus:outline-none focus:ring-2 focus:ring-purple-500 w-full mb-4 text-xl"
        value={selectedBusinessType}
        onChange={handleBusinessTypeChange}
      >
        <option value="">Select Business Type</option>
        {businessTypes.map((type, index) => (
          <option
            key={index}
            value={type.type}
            className="text-purple-800 font-semibold"
          >
            {type.type}
          </option>
        ))}
      </select>
     {/*  bussnis type selext part */}
      {selectedBusinessType && !showSelectedServices && (
        <div>
          <div className="grid lg:grid-cols-3 grid-cols-2 pt-3 gap-2">
            {businessTypes
              .find((type) => type.type === selectedBusinessType)
              ?.services.map((service, index) => (
                <label key={index} className="flex items-center">
                  <input
                    type="checkbox"
                    className="mr-2 w-5 h-5"
                    value={service}
                    checked={selectedServices.includes(service)}
                    onChange={handleServiceCheckboxChange}
                  />
                  <span className="text-[#c0ba64] font-semibold text-xl">
                    {service}
                  </span>
                </label>
              ))}
          </div>
          <button
            className="text-white justify-end flex bg-gradient-to-r from-[#8253ff] to-[#6a98ff] hover:bg-gradient-to-br hover:from-[#6d4bd             hover:to-[#6d4bd6] focus:ring-4 focus:ring-opacity-0 focus:outline-none outline-none border-none shadow-lg hover:shadow-purple-300/40 dark:shadow-lg font-medium rounded-bl-xl rounded-tr-xl text-lg px-5 py-3 text-center items-center my-3"
            onClick={() => {
              setShowSelectedServices(true);
              setName("");
              setCurrentStep(1);
            }}
          >
            Select Service Types
            <FaArrowRight className="inline-block ml-2" />
          </button>
        </div>
      )}

      {showSelectedServices && selectedServices.length > 0 && (
        <div>
          <h2 className=" text-3xl  font-bold text-white mt-4">
            Selected Services
          </h2>
          <ul className="list-disc list-inside grid lg:grid-cols-3 grid-cols-2 gap-3">
            {selectedServices.map((service, index) => (
              <li
                key={index}
                className="text-[#c0ba64] font-semibold text-xl pt-3"
              >
                {service}
              </li>
            ))}
          </ul>
        </div>
      )}

      {showStepMap &&
        steps.map((step, index) => (
          <div key={index} className={currentStep === index ? "" : "hidden"}>
            <h2 className="md:text-3xl text-2xl font-serif font-bold text-white my-3">
              {step.name}
            </h2>
            <input
              type="text"
              required
              className="border border-purple-200 bg-gray-300 rounded px-4 py-3 focus:outline-none focus:ring-2 focus:ring-purple-500 w-full mb-3"
              placeholder={`Enter your ${step.name}`}
              value={step.value}
              onChange={(e) => step.setValue(e.target.value)}
            />

            {index === steps.length - 1 ? (
              <Button name="Set Location" onClick={handleLocation} />
            ) : (
              <Button name="Next" onClick={handleNextStep} />
            )}
          </div>
        ))}

      {showLocationInputs && (
        <>
          <h2 className="md:text-3xl text-2xl font-serif font-bold text-white my-3">
            Location
          </h2>
          <div className="grid grid-cols-2 max-md:grid-cols-1  gap-4 my-4 ">
            <select
              className="border border-purple-200 rounded text-gray-700 font-bold bg-gray-300 px-3 py-4 focus:outline-none  focus:ring-2 focus:ring-purple-500 w-full mb-4 text-xl"
              value={country}
              onChange={(e) => setCountry(e.target.value)}
            >
              <option value="">Select Country</option>
              {countries.map((country, index) => (
                <option key={index} value={country} className="text-black">
                  {country}
                </option>
              ))}
            </select>
            <select
              className="border border-purple-200 rounded text-gray-700 font-bold bg-gray-300 px-3 py-4 focus:outline-none focus:ring-2 focus:ring-purple-500 w-full mb-4 text-xl"
              value={state}
              onChange={(e) => setState(e.target.value)}
            >
              <option value="">Select State</option>
              {states.map((state, index) => (
                <option key={index} value={state}>
                  {state}
                </option>
              ))}
            </select>
          </div>
          <div className="flex w-full max-md:flex-col max-md:gap-1 gap-3">
            <div className="w-full">
              <h2 className="xl:text-3xl max-xsm:text-[24px]  text-2xl font-serif font-bold text-white my-3">
                Enter Area You Cover (in KM)
              </h2>
              <input
                type="text"
                className="border border-purple-200 rounded bg-gray-300 px-3 py-4 focus:outline-none focus:ring-2 focus:ring-purple-500 w-full mb-4 text-xl"
                placeholder="Enter the radius you cover in KM"
                value={radius}
                onChange={handleRadiusChange}
              />
            </div>
            <span className="w-fit max-md:w-full">
              <h2 className="md:text-3xl text-2xl font-serif font-bold text-white my-3">
                Zip Code{" "}
              </h2>
              <input
                type="text"
                className="border border-purple-200 rounded bg-gray-300 px-3 py-4 focus:outline-none focus:ring-2 focus:ring-purple-500 w-full mb-4 text-xl"
                placeholder="Enter Zip Code"
                value={zipCode}
                onChange={(e) => setZipCode(e.target.value)}
              />
            </span>
          </div>
          <Button name="Keyword Generator" onClick={handleGenerateKeywords} />
        </>
      )}


{/*  show data that user enter */}
      {showLoader ? (
        <div className="flex justify-center mt-7 items-center">
          <div className="loader"></div>
        </div>
      ) : (
        <>
          {showInputGrid && (
            <div className="mt-4 bg-dark-purple rounded  ">
              <h2 className="lg:text-4xl text-2xl   font-bold text-gray-200 mb-3">
                User Information
              </h2>
              <div className="grid lg:grid-cols-3 md:grid-cols-2 grid-cols-1  gap-3">
                <p className="text-dark-white mb-2">
                  <span className="font-bold text-gray-900  text-2xl">
                    Name:
                  </span>{" "}
                  <span className="font-semibold text-[#c0ba64]  text-xl">
                    {" "}
                    {name}{" "}
                  </span>
                </p>
                <p className="text-dark-white mb-2">
                  <span className="font-bold text-gray-900 text-2xl">
                    Email:
                  </span>{" "}
                  <span className="font-semibold text-[#c0ba64]  text-xl">
                    {" "}
                    {email}{" "}
                  </span>
                </p>
                {website.length > 0 && (
                  <p className="text-dark-white mb-2 gap-3">
                    <span className="font-bold text-gray-900 text-2xl">
                      Website:
                    </span>{" "}
                    <span className="font-semibold text-[#c0ba64] text-xl">
                      {website}
                    </span>
                  </p>
                )}

                <p className="text-dark-white mb-2 block gap-3">
                  <span className="font-bold text-gray-900 text-2xl">
                    Country:
                  </span>{" "}
                  <span className="font-semibold text-[#c0ba64]  text-xl">
                    {" "}
                    {country}{" "}
                  </span>
                </p>
                <p className="text-dark-white mb-2 block gap-3">
                  <span className="font-bold text-gray-900 text-2xl">
                    State:
                  </span>{" "}
                  <span className="font-semibold text-[#c0ba64]  text-xl">
                    {" "}
                    {state}{" "}
                  </span>
                </p>
                <p className="text-dark-white mb-2 block gap-3">
                  <span className="font-bold text-gray-900 text-2xl">
                    Zip Code:
                  </span>{" "}
                  <span className="font-semibold text-[#c0ba64]  text-xl">
                    {" "}
                    {zipCode}{" "}
                  </span>
                </p>
              </div>
              <p className="text-dark-white mb-2 gap-3 block">
                <span className="font-bold text-gray-900 text-2xl">
                  Area that you cover (in KM):
                </span>{" "}
                <span className="font-semibold text-[#c0ba64]  text-xl">
                  {" "}
                  {radius}{" "}
                </span>
              </p>
              <div className=" gap-5">
                <div className="flex justify-between items-center ">
                  <h2 className="md:text-3xl text-2xl  font-serif font-bold  text-green-500 my-5">
                    Your Keywords:
                  </h2>
                  <span title="" className=" flex gap-3">
                    <FaCopy
                      size={25}
                      onClick={handleCopyKeywords}
                      className="text-white hover:cursor-pointer hover:text-gray-300"
                      title="Copy"
                    />
                    <TbFileDownload
                      title="Download CSV"
                      onClick={handleDownloadCSV}
                      size={30}
                      className="text-white hover:text-gray-300 hover:cursor-pointer"
                    />
                  </span>
                </div>
                <textarea
                  className="border rounded px-4 py-4 text-lg   bg-slate-400 focus:outline-none focus:ring-2 w-full"
                  rows="10"
                  readOnly
                  value={keywordsCSV}
                ></textarea>
                <div className="flex justify-between mt-4">
                  <button
                    className="bg-purple-700 hover:bg-yellow-800 text-white font-bold py-2 px-4 rounded transition-colors duration-300"
                    onClick={handleDownloadCSV}
                  >
                    Download CSV <FaDownload className="inline-block ml-2" />
                  </button>
                </div>
              </div>
            </div>
          )}
        </>
      )}

      {/*  show the notification if showNotification is true */}
      {showNotification && (
        <div className="fixed top-5 -left-3 w-full h-fit flex justify-end items-start z-10">
          <div className="text-red-400 lg:py-8 bg-yellow-100 border-l-8 border-red-700  xl:text-2xl text-lg lg:font-bold  text-center lg:w-[30%] rounded-md p-3 flex items-center justify-center">
            <FaExclamationTriangle className="mr-2" size={32} />
            {currentStep === 2 && !validateEmail(email)
              ? "Invalid Email format!"
              : ""}
            {currentStep === 3 && !validateWebsite(website)
              ? "Field is required!"
              : ""}
            {currentStep === 4 && !validateWebsite(website)
              ? "Field is required!"
              : ""}
            {currentStep === 6 && isNaN(radius.trim())
              ? "Numeric value required!"
              : ""}
            {currentStep !== 2 && currentStep !== 3 && currentStep !== 6
              ? "Field is required!"
              : ""}
          </div>
        </div>
      )}

      {/* show the notification if invalidRadiusInput is true */}
      {invalidRadiusInput && (
        <div className="fixed top-5 -left-3 w-full h-fit flex justify-end items-start z-10">
          <div className="text-red-400 lg:py-8 bg-yellow-100 border-l-8 border-red-700  lg:text-xl lg:font-bold  text-center lg:w-[30%] rounded-md p-4 flex items-center justify-center">
            <FaExclamationTriangle className="mr-2" />
            Numeric value required!
          </div>
        </div>
      )}
       {/*  sucess pop up of keywords generated */}
      {showSuccessPopup && (
        <div className="fixed top-5 lg:-left-3 -left-1 w-full h-fit flex justify-end items-start z-10">
          <div
            className="bg-green-200 lg:w-[35%] text-center flex text-sm xl:text-2xl  border-green-600 text-green-600 border-l-4 lg:py-6 p-4"
            role="alert"
          >
            <p className="font-bold text-lg max-md:text-sm">Congratulations</p>
            <p className="flex items-center text-lg max-md:text-sm ml-2">
              Your keywords have been generated!{" "}
              <ImHappy size={30} className="ml-6 max-md:text-sm max-md:ml-1" />
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default KeyWordGenerator;