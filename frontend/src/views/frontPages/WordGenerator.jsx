/* eslint-disable prettier/prettier */
import { useEffect, useState } from "react";
import React from 'react';
// import { renderToStaticMarkup } from 'react-dom/server';
import axios from 'axios';
// import { useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';
import {
  FaArrowRight,
  FaExclamationTriangle,
} from "react-icons/fa";
import { ImHappy } from "react-icons/im";
import Button from "./button";
// import countriesWithStates from "./DummyData/countries";
import {
  // CitySelect,
  CountrySelect,
  StateSelect,
  // LanguageSelect,
} from "react-country-state-city";
import "./../../../node_modules/react-country-state-city/dist/react-country-state-city.css";

const KeyWordGenerator = () => {
  // const navigate = useNavigate();
  // Values for Api: selectedSector,selectedBussinessDiscipline, selectedServices,name,email,website,country,state,radius,zipCode
  const [countryid, setCountryid] = useState(0);
  // const [stateid, setstateid] = useState(0);
  // states for backend data //
  const [sectors, setSectors] = useState([]);
  const [selectedSector, setSelectedSector] = useState([]);

  const [bussinessDisciplines, setBussinessDisciplines] = useState([]);
  const [selectedBussinessDiscipline, setSelectedBussinessDiscipline] = useState("");

  const [services, setServices] = useState([]);
  const [selectedServices, setSelectedServices] = useState([]);

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [website, setWebsite] = useState("");
  const [country, setCountry] = useState("");
  const [state, setState] = useState("");
  const [zipCode, setZipCode] = useState("");
  const [radius, setRadius] = useState("");
  const [keywordsArray, setKeywordsArray] = useState([]);


  // SaveData

  const SaveData = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post(`${process.env.REACT_APP_API_BASE_URL}/customer/addCustomer`, {
        sector: selectedSector,
        bussinessDiscipline: selectedBussinessDiscipline,
        services: selectedServices,
        name: name,
        email: email,
        website: website,
        country: country,
        state: state,
        radius: radius,
        zipCode: zipCode,
        keywords: keywordsArray
      });

      if (response.data.status === 200) {
        Swal.fire({
          icon: 'success',
          title: 'Success',
          text: response.data.message,
        });

        window.location.href = "/";
        // navigate('/');
      } else {
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: response.data.message,
        });

        if (
          response.data.status === 400 &&
          response.data.message === 'This sector already exists'
        ) {
          window.location.href = "/";
          // navigate('/sector/list');
        }
      }
    } catch (error) {
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: error.response ? error.response.data.message : 'An error occurred',
      });
    }
  };

  // states for backend data //
  const [showSelectedServices, setShowSelectedServices] = useState(false);

  // Add state to manage the notification for invalid input
  const [invalidRadiusInput, setInvalidRadiusInput] = useState(false);
  const [currentStep, setCurrentStep] = useState(-1);
  const [progress, setProgress] = useState(0);
  const [showNotification, setShowNotification] = useState(false);
  const [showSuccessPopup, setShowSuccessPopup] = useState(false);
  const [showInputGrid, setShowInputGrid] = useState(false);
  const [showStepMap, setShowStepMap] = useState(true);
  const [showLocationInputs, setShowLocationInputs] = useState(false); // Added state for showing location inputs

  // Add state to manage whether to show the radio buttons
  const [showLoader, setShowLoader] = useState(false);

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
          (currentStep === 4 && !validateWebsite(currentStepValue)) ||
          (currentStep === 6 && isNaN(currentStepValue.trim())) // Check if the value is not a number for radius
        ) {
          setShowNotification(true);
        } else {
          setCurrentStep(currentStep + 1);
          setShowNotification(false);
        }

        if (
          currentStep === 3 &&
          !validateWebsite(website)
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
    console.log("Result of Email", re.test(email));
    return re.test(email);
  };

  // Function to validate website URL format
  const validateWebsite = (website) => {
    console.log("Enter in Web");
    const re = /^(ftp|http|https):\/\/[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}(\/[^\s]*)?$/;
    console.log("Result of WEB", re.test(website));
    return re.test(website);
  };

  // Function to handle location input and show location options
  const handleLocation = () => {
    setShowStepMap(false);
    setShowLocationInputs(true);
  };

  const handleSectorChange = (value) => {
    console.log("handleSectorChange", handleSectorChange);
    const sector = value;
    setShowSelectedServices(false);
    setShowLocationInputs(false);
    setShowInputGrid(false);
    setSelectedBussinessDiscipline(false);
    setSelectedSector(sector);
  };

  const handleBusinessDisciplineChange = (value) => {
    const type = value;
    setSelectedBussinessDiscipline(type);
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
    setProgress(0);
  };

  // Function to handle radius change
  const handleRadiusChange = (e) => {
    const inputValue = e.target.value;
    // Check if the input is a valid number and within the range of -0 to 100
    if (!isNaN(inputValue) && inputValue >= 0 && inputValue <= 100) {
      setRadius(inputValue);
      setInvalidRadiusInput(false); // Clear the invalid input notification if input is valid
    } else {
      setRadius(""); // Clear radius if input is not a number or not within range
      setInvalidRadiusInput(true); // Set state to show notification for invalid input
    }
  };

  const handleServiceCheckboxChange = (event) => {
    const isChecked = event.target.checked;
    const serviceName = event.target.value;
    if (isChecked) {
      setSelectedServices([...selectedServices, serviceName]);
    } else {
      setSelectedServices(
        selectedServices.filter((service) => service !== serviceName && service !== "" && service !== ",")
      );
    }
    setProgress((selectedServices.length + 1) * 20);
  };

  useEffect(() => {
    axios.get(`${process.env.REACT_APP_API_BASE_URL}/sector/listOfSectorsName`)
      .then((result) => {
        const sectorData = result.data.data;
        setSectors(sectorData);
      })
      .catch((error) => {
        console.log(error);
      });
  });


  const getBusinessDisciplines = async (e) => {
    console.log("Frontend sector Name for Discipline: ", e);
    axios.get(`${process.env.REACT_APP_API_BASE_URL}/sector/listOfBusinessDisciplines/${e}`)
      .then((result) => {
        const sectorData = result.data.data;
        setBussinessDisciplines(sectorData);
        console.log("Frontend Bussiness Disciplines: ", sectorData);
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const getServices = async (e) => {
    const bussinessDiscipline = e;

    await axios.post(`${process.env.REACT_APP_API_BASE_URL}/service/ServicesForSelectedBusinessDiscipline`, {
      sectorName: selectedSector,
      bussinessDiscipline: bussinessDiscipline,
    }).then((result) => {
      const servicesData = result.data.data;
      setServices(servicesData);
      // console.log("Services: ", servicesData);
    })
      .catch((error) => {
        console.log(error);
      });
  };

  const CheckData = async (e) => {
    // // Values for Api: selectedSector,selectedBussinessDiscipline, selectedServices
    // console.log("selectedSector: ", selectedSector)
    // console.log("selectedBussinessDiscipline: ", selectedBussinessDiscipline)
    // console.log("selectedServices: ", selectedServices)
    // console.log("name: ", name)
    // console.log("email: ", email)
    // console.log("website: ", website)
    // console.log("radius: ", radius)
    // console.log("zipCode: ", zipCode)
    // console.log("country: ", country)
    // console.log("state: ", state)
  };

  // Helper function to create URL-friendly slugs
  const createSlug = (text) => {
    return text.toLowerCase().replace(/\s+/g, '-');
  };

  const getKeywords = async (selectedServices, country, state) => {
    const results = [];

    if (!Array.isArray(selectedServices) || selectedServices.length === 0) {
      console.warn("selectedServices parameter is undefined or empty.");
      return results; // Return early if no valid 'selectedServices' array
    }

    // Function to generate an HTML link
    const generateLink = (text, location) => {
      return `<li><a href="/${createSlug(text)}/" title="${text}">${location}</a></li>`;
    };

    // Generate all combinations of keywords and their HTML links
    selectedServices.forEach((service) => {
      const fullKeyword1 = `${country} ${service}`;
      const fullKeyword2 = `${service} ${country}`;
      const fullKeyword3 = `${service} in ${country}`;
      const fullKeyword4 = `${state} ${service}`;
      const fullKeyword5 = `${service} ${state}`;
      const fullKeyword6 = `${service} in ${state}`;

      results.push({
        keyword: fullKeyword1,
        location: country,
        link: generateLink(fullKeyword1, country),
      });

      results.push({
        keyword: fullKeyword2,
        location: country,
        link: generateLink(fullKeyword2, country),
      });

      results.push({
        keyword: fullKeyword3,
        location: country,
        link: generateLink(fullKeyword3, country),
      });

      results.push({
        keyword: fullKeyword4,
        location: state,
        link: generateLink(fullKeyword4, state),
      });

      results.push({
        keyword: fullKeyword5,
        location: state,
        link: generateLink(fullKeyword5, state),
      });

      results.push({
        keyword: fullKeyword6,
        location: state,
        link: generateLink(fullKeyword6, state),
      });
    });

    // Add links for country and state individually
    results.push({
      keyword: country,
      location: country,
      link: generateLink(country, country),
    });

    results.push({
      keyword: `in ${country}`,
      location: country,
      link: generateLink(`in ${country}`, country),
    });

    results.push({
      keyword: state,
      location: state,
      link: generateLink(state, state),
    });

    results.push({
      keyword: `in ${state}`,
      location: state,
      link: generateLink(`in ${state}`, state),
    });

    // Remove duplicates based on the keyword
    const uniqueResults = results.reduce((acc, current) => {
      const exists = acc.find((item) => item.keyword === current.keyword);
      if (!exists) {
        acc.push(current);
      }
      return acc;
    }, []);

    setKeywordsArray(uniqueResults);
    console.log("Keywords:", keywordsArray);

    return uniqueResults;
  }

  return (
    <>
      <div className="rounded-lg p-6 w-full md:max-w-4xl">
        {currentStep !== -1 && (
          <div className="flex items-center justify-center mb-2">
            <div className="w-full bg-white rounded-full">
              <div
                className="h-3 bg-gradient-to-r from-yellow-600 to-indigo-600 rounded-full"
                style={{ width: `${progress + 20}%` }}
              ></div>
            </div>
          </div>
        )}
        <h1 className="lg:text-4xl text-3xl  font-bold text-white mb-4">
          Choose Sector
        </h1>
        <select
          className="border border-purple-200 rounded text-gray-700 font-bold bg-white px-3 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500 w-full mb-4 text-xl"
          value={selectedSector}
          onChange={(e) => {
            console.log("e.target.value: ", e);
            getBusinessDisciplines(e.target.value);
            handleSectorChange(e.target.value);
          }}

        >
          <option value="">Select Sector</option>
          {sectors.map((sectorName, index) => (
            <option
              key={index}
              value={sectorName}
              className="text-purple-800 font-semibold"
            >
              {sectorName}
            </option>
          ))}
        </select>

        {selectedSector && (
          <div>
            <h1 className="lg:text-4xl text-3xl  font-bold text-white mb-4">
              Choose Business discipline
            </h1>
            <select
              className="border border-purple-200 rounded text-gray-700 font-bold bg-white px-3 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500 w-full mb-4 text-xl"
              value={selectedBussinessDiscipline}
              onChange={(e) => {
                handleBusinessDisciplineChange(e.target.value);
                // setSelectedBussinessDiscipline(e.target.value); // Update state
                getServices(e.target.value);
              }}
            >
              <option value="">Select Business discipline</option>
              {bussinessDisciplines && bussinessDisciplines.map((disciplines, index) => (
                <option
                  key={index}
                  value={disciplines}
                  className="text-purple-800 font-semibold"
                >
                  {disciplines}
                </option>
              ))}
            </select>

            {selectedBussinessDiscipline && (
              <div>
                <div className="grid lg:grid-cols-3 grid-cols-2 pt-3 gap-2">
                  {services && services.map((service, index) => (
                    <label key={index} className="flex items-center">
                      <input
                        type="checkbox"
                        className="mr-2 w-5 h-5"
                        value={service} // Set the value to the individual service
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
                  className="text-white justify-end flex bg-gradient-to-r from-[#8253ff] to-[#6a98ff]  hover:to-[#6d4bd6] focus:ring-4 focus:ring-opacity-0 focus:outline-none outline-none border-none shadow-lg hover:shadow-purple-300/40 dark:shadow-lg font-medium rounded-bl-xl rounded-tr-xl text-lg px-5 py-3 text-center items-center my-3"
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
                className="border border-purple-200 rounded bg-white px-3 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500 w-full mb-3"
                placeholder={`Enter your ${step.name}`}
                value={step.value}
                onChange={(e) => { step.setValue(e.target.value); CheckData(); }}
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
            <div className="grid grid-cols-2 max-md:grid-cols-1 gap-4 my-4 ">
              <CountrySelect
                className="rounded text-gray-700 font-bold bg-white px-3 py-2 w-full mb-4 text-xl"
                placeHolder="Select Country"
                onChange={(e) => {
                  setCountryid(e.id);
                  setCountry(e.name);
                }}
                value={country}
              />
              <StateSelect
                className="rounded text-gray-700 font-bold bg-white px-3 py-2 w-full mb-4 text-xl"
                countryid={countryid}
                onChange={(e) => { setState(e.name); CheckData(); getKeywords(selectedServices, country, state); }}
                placeHolder="Select State"
                value={state}
              />
            </div>
            <div className="flex w-full max-md:flex-col max-md:gap-3 gap-5">
              <div className="w-full">
                <h2 className="xl:text-3xl max-xsm:text-[24px]  text-2xl font-serif font-bold text-white my-3">
                  Enter Area You Cover ({radius} miles)
                </h2>
                <div className="relative mb-6">
                  <input
                    id="labels-range-input"
                    type="range"
                    defaultValue={0}
                    min={0}
                    max={100}
                    value={radius}
                    onChange={handleRadiusChange}
                    className="w-full h-2 bg-white rounded-lg appearance-none cursor-pointer dark:bg-gray-700"
                  />
                  <span className="text-sm text-yellow-500 dark:text-yellow-400 absolute start-0 -bottom-6">
                    0 miles
                  </span>
                  <span className="text-sm text-yellow-500 dark:text-yellow-400 absolute start-1/3 -translate-x-1/2 rtl:translate-x-1/2 -bottom-6">
                    30 miles
                  </span>
                  <span className="text-sm text-yellow-500 dark:text-yellow-400 absolute start-2/3 -translate-x-1/2 rtl:translate-x-1/2 -bottom-6">
                    65 miles
                  </span>
                  <span className="text-sm text-yellow-500 dark:text-yellow-400 absolute end-0 -bottom-6">
                    100 miles
                  </span>
                </div>
              </div>
              <span className="w-fit max-md:w-full">
                <h2 className="md:text-3xl text-2xl font-serif font-bold text-white my-3">
                  Zip Code{" "}
                </h2>
                <input
                  type="text"
                  className="border border-purple-200 rounded bg-white px-3 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500 w-full mb-4 text-xl"
                  placeholder="Enter Zip Code"
                  value={zipCode}
                  onChange={(e) => { setZipCode(e.target.value); CheckData() }}
                />
              </span>
            </div>
            <div className="flex flex-row space-x-4">
              <Button type="submit" name="Submit" className="inline-flex" onClick={SaveData}>Submit</Button>
            </div>
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
                <h2 className="lg:text-4xl text-2xl font-bold text-gray-200 mb-3">
                  User Information
                </h2>
                <div className="grid lg:grid-cols-2 md:grid-cols-2 grid-cols-1 gap-3">
                  <p className="mb-2">
                    <span className="font-bold text-[#c0ba64] text-2xl">
                      Name:
                    </span>{" "}
                    <span className="font-bold text-white text-xl">
                      {" "}
                      {name}{" "}
                    </span>
                  </p>
                  <p className=" mb-2">
                    <span className="font-bold text-[#c0ba64] text-2xl">
                      Email:
                    </span>{" "}
                    <span className="font-bold text-white text-xl">
                      {" "}
                      {email}{" "}
                    </span>
                  </p>
                  {website.length > 0 && (
                    <p className="mb-2 gap-3">
                      <span className="font-bold text-[#c0ba64] text-2xl">
                        Website:
                      </span>{" "}
                      <span className="font-bold text-white text-xl">
                        {website}
                      </span>
                    </p>
                  )}

                  <p className="text-dark-white mb-2 block gap-3">
                    <span className="font-bold text-[#c0ba64] text-2xl">
                      Country:
                    </span>{" "}
                    <span className="font-bold text-white text-xl">
                      {" "}
                      {country}{" "}
                    </span>
                  </p>
                  <p className="text-dark-white mb-2 block gap-3">
                    <span className="font-bold text-[#c0ba64] text-2xl">
                      State:
                    </span>{" "}
                    <span className="font-bold text-white text-xl">
                      {" "}
                      {state}{" "}
                    </span>
                  </p>
                  <p className="text-dark-white mb-2 block gap-3">
                    <span className="font-bold text-[#c0ba64] text-2xl">
                      Zip Code:
                    </span>{" "}
                    <span className="font-bold text-white text-xl">
                      {" "}
                      {zipCode}{" "}
                    </span>
                  </p>
                </div>
                <p className="text-dark-white mb-2 gap-3 block mt-3">
                  <span className="font-bold text-[#c0ba64] text-2xl">
                    Area that you cover :
                  </span>{" "}
                  <span className="font-bold text-white text-xl">
                    {" "}
                    {`${radius} miles `}{" "}
                  </span>
                </p>
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
                ? "Invalid Website format!"
                : "Field is required!"}
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
    </>
  );
};

export default KeyWordGenerator;