import  { useEffect, useState } from "react";
import { FaArrowRight, FaExclamationTriangle } from "react-icons/fa";
import { ImHappy } from "react-icons/im";
import businessTypes from "../DummyData/fake"; // Make sure this path is correct
import Button from "./button";

const KeyWordGenerator = () => {
  const [selectedBusinessType, setSelectedBusinessType] = useState("");
  const [selectedServices, setSelectedServices] = useState([]);
  const [showSelectedServices, setShowSelectedServices] = useState(false);
  const [keywordsCSV, setKeywordsCSV] = useState("");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [website, setWebsite] = useState("");
  const [location, setLocation] = useState("");
  const [currentStep, setCurrentStep] = useState(-1);
  const [progress, setProgress] = useState(0);
  const [showNotification, setShowNotification] = useState(false);
  const [showSuccessPopup, setShowSuccessPopup] = useState(false);
  const [showInputGrid, setShowInputGrid] = useState(true); // State to manage visibility of input grid and generate button
  const [showStepMap, setShowStepMap] = useState(true); // State to manage the visibility of step map

  const steps = [ // Define steps array
    { name: "Name", value: name, setValue: setName },
    { name: "Email", value: email, setValue: setEmail },
    { name: "Website URL", value: website, setValue: setWebsite },
    { name: "Location", value: location, setValue: setLocation },
  ];

  useEffect(() => {
    if (currentStep !== -1) {
      const filledSteps = [name, email, website, location].filter(
        (step) => step !== ""
      ).length;
      const totalSteps = 4;
      setProgress((filledSteps / totalSteps) * 80);
    }
  }, [name, email, website, location, currentStep]);

  useEffect(() => {
    let timer;
    if (showNotification || showSuccessPopup) {
      timer = setTimeout(() => {
        setShowNotification(false);
        setShowSuccessPopup(false); // Clear the notification after 5 seconds
      }, 4000); // Auto close notification after 5 seconds
    }
    return () => clearTimeout(timer);
  }, [showNotification, showSuccessPopup]);

  const handleNextStep = () => {
    const currentStepValue = steps[currentStep].value;
    if (currentStepValue.trim() === "") {
      setShowNotification(true); // Show notification if field is empty
    } else {
      setCurrentStep(currentStep + 1);
      setShowNotification(false); // Hide notification if moving to next step
    }
  };
  

  const handleBusinessTypeChange = (event) => {
    const type = event.target.value;
    setSelectedBusinessType(type);
    setSelectedServices([]);
    setShowSelectedServices(false);
    setName(""); // Reset name state
    setEmail(""); // Reset email state
    setWebsite(""); // Reset website state
    setLocation(""); // Reset location state
    setCurrentStep(-1); // Reset current step
    setShowInputGrid(true); // Show input grid again
    setShowStepMap(true); // Show step map again
    setKeywordsCSV(""); // Reset keywords CSV
    setProgress(0); // Reset progress bar
  };
  
  // this is dummy data generatied this time you can handle backend login onclick generate btn 
  const handleGenerateKeywords = () => {
    if (location.trim() !== "") {
      const keywords = selectedServices.map(
        (service) => `${location}\t${service}`
      );
      const csvContent =
        "Step 3: Your Keywords\nLocation\tKeyword\n" + keywords.join("\n");
      setKeywordsCSV(csvContent);
      setShowSuccessPopup(true);
      setShowInputGrid(false); // Hide input grid and generate button
      setShowStepMap(false); // Hide step map on keyword generation
      setCurrentStep(-1); // Reset current step to hide Progress bar
      // Do not reset name, email, website, location here
    } else {
      setShowNotification(true);
    }
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
    setProgress((selectedServices.length + 1) * 20); // Update progress bar on checkbox selection
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
          <option key={index} value={type.type} className="text-purple-800 font-semibold">
            {type.type}
          </option>
        ))}
      </select>

      {selectedBusinessType && !showSelectedServices && (
        <div>
          <div className="grid lg:grid-cols-3 grid-cols-2 pt-3 gap-2">
            {businessTypes.find((type) => type.type === selectedBusinessType)?.services.map((service, index) => (
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
            className="text-white justify-end flex bg-gradient-to-r from-[#8253ff] to-[#6a98ff] hover:bg-gradient-to-br hover:from-[#6d4bd6] hover:to-[#6d4bd6] focus:ring-4 focus:ring-opacity-0 focus:outline-none outline-none border-none shadow-lg hover:shadow-purple-300/40 dark:shadow-lg font-medium rounded-bl-xl rounded-tr-xl text-lg px-5 py-3 text-center items-center my-3"
            onClick={() => {
              setShowSelectedServices(true);
              setName('');
              setCurrentStep(0);
            }}
          >
            Select Service Types
            <FaArrowRight className="inline-block ml-2" />
          </button>
        </div>
      )}

      {showSelectedServices && selectedServices.length > 0 && (
        <div>
          <h2 className="md:text-3xl text-2xl font-serif font-bold text-white mt-4">
            Selected Services:
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

      {showStepMap && (
        steps.map((step, index) => (
          <div key={index} className={currentStep === index ? '' : 'hidden'}>
            <h2 className="md:text-3xl text-2xl font-serif font-bold text-white my-3">
              {step.name}
            </h2>
            <input
  type="email" // Specify type as "email" for email validation
  required
  className="border border-purple-200 bg-gray-300 rounded px-4 py-3 focus:outline-none focus:ring-2 focus:ring-purple-500 w-full mb-3"
  placeholder={`Enter your ${step.name}`}
  value={step.value}
  onChange={(e) => step.setValue(e.target.value)}
/>

            {index === steps.length - 1 ? (
              <Button name="Generate Keywords" onClick={handleGenerateKeywords} />
            ) : (
              <Button name="Next" onClick={handleNextStep} />
            )}
          </div>
        ))
      )}

      {!showInputGrid && (
        <div className="mt-4 bg-dark-purple rounded  ">
          <h2 className="lg:text-4xl text-2xl  font-serif font-bold text-white mb-3">
            User Information:
          </h2>
          <div className="grid lg:grid-cols-3 grid-cols-2  gap-3">
            <p className="text-dark-white mb-2">
              <span className="font-bold text-gray-900  text-2xl">Name:</span> <span className="font-semibold text-[#c0ba64]  text-xl">  {name} </span>
            </p>
            <p className="text-dark-white mb-2">
              <span className="font-bold text-gray-900 text-2xl">Email:</span>  <span className="font-semibold text-[#c0ba64]  text-xl">  {email} </span>
            </p>
            <p className="text-dark-white mb-2">
              <span className="font-bold text-gray-900 text-2xl">Location:</span>  <span className="font-semibold text-[#c0ba64]  text-xl">  {location} </span>
            </p>
          </div>
        </div>
      )}

      {showNotification && (
        <div className="fixed top-5 -left-3 w-full h-fit flex justify-end items-start z-10">
          <div className="text-red-400 lg:py-8 bg-yellow-100 border-l-8 border-red-700  lg:text-xl lg:font-bold  text-center lg:w-[30%] rounded-md p-4 flex items-center justify-center">
            <FaExclamationTriangle className="mr-2" />
            Field is required!
          </div>
        </div>
      )}

      {showSuccessPopup && (
        <div className="fixed top-5 -left-3 w-full h-fit flex justify-end items-start z-10">
          <div className="bg-green-200 lg:w-[40%] text-center flex lg:text-lg  border-green-600 text-green-600 border-l-4 lg:py-8 p-4" role="alert">
            <p className="font-bold">Congratulations</p>
            <p className="flex items-center">
              Your keywords have been generated! <ImHappy className="ml-3" />
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default KeyWordGenerator;

