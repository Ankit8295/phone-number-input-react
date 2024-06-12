import React, { ComponentProps, useEffect, useRef, useState } from "react";
import { CountryType, countriesData } from "./countriesDara";
import "./styles.css";

export interface IPhoneInputProps extends ComponentProps<"input"> {
  labelStyles?: string;
  inputStyles?: string;
  label?: string;
  defaultCountryCode?: string;
  defaultValue?: string;
  error?: string;
  validation?: boolean;
}

export const PhoneInput = (props: IPhoneInputProps) => {
  const {
    labelStyles,
    inputStyles,
    label,
    defaultCountryCode,
    defaultValue,
    error,
    validation,
  } = props;
  const dropDownNode = useRef<HTMLDivElement>(null);

  const [show, setShow] = useState<boolean>(false);

  const [searchedCountry, setSearchedCountry] = useState<string>("");

  const [fieldError, setFieldError] = useState(!validation ? error : "");

  const filterCountriesData = searchedCountry
    ? countriesData.filter((country) =>
        country.country?.toLowerCase().includes(searchedCountry.toLowerCase())
      )
    : countriesData;

  useEffect(() => {
    setFieldError(error);
  }, [error]);

  const defaultCountryData = countriesData.find(
    (country) => country.dial_code === defaultCountryCode
  );

  const [selectedValues, setSelectedValues] = useState<CountryType>({
    dial_code: defaultCountryData?.dial_code,
    flag: defaultCountryData?.flag,
    phoneLength: defaultCountryData?.phoneLength,
  });

  const selectCountry = (country: CountryType) => {
    setShow((prev) => !prev);
    setSelectedValues({
      dial_code: country?.dial_code,
      flag: country.flag,
      phoneLength: country.phoneLength,
    });
  };

  function validateField(e: string) {
    if (e.length) {
      if (e.length < Number(selectedValues?.phoneLength)) {
        return setFieldError("Number is not valid");
      }
      if (/^[-+]?\d+$/.test(e)) return setFieldError("");
    }
    setFieldError("");
  }

  useEffect(() => {
    const handleDomClick = (e: any) => {
      e.stopPropagation();
      if (show) {
        if (
          !dropDownNode.current?.contains(e.target) &&
          e.target !== dropDownNode.current
        ) {
          setShow(false);
        }
      }
    };
    document.addEventListener("click", handleDomClick);
    return () => {
      document.removeEventListener("click", handleDomClick);
    };
  }, [show]);

  return (
    <div ref={dropDownNode} className="phone_library ">
      {label && (
        <p>
          {label}
          {props.required && <span className="text-red-500">*</span>}
        </p>
      )}
      <div className="phone_input-container" id={labelStyles}>
        {show && (
          <div className="flag_dropDown">
            <label className="flag_dropDown-searchbar">
              <svg viewBox="0 0 32 32" width="25px" height="25px">
                <path d="M 19 3 C 13.488281 3 9 7.488281 9 13 C 9 15.394531 9.839844 17.589844 11.25 19.3125 L 3.28125 27.28125 L 4.71875 28.71875 L 12.6875 20.75 C 14.410156 22.160156 16.605469 23 19 23 C 24.511719 23 29 18.511719 29 13 C 29 7.488281 24.511719 3 19 3 Z M 19 5 C 23.429688 5 27 8.570313 27 13 C 27 17.429688 23.429688 21 19 21 C 14.570313 21 11 17.429688 11 13 C 11 8.570313 14.570313 5 19 5 Z" />
              </svg>
              <input
                type="search"
                placeholder="search country"
                onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                  setSearchedCountry(e.target.value)
                }
              />
            </label>

            {filterCountriesData.map((country) => (
              <div onClick={() => selectCountry(country)} key={country.country}>
                <img
                  src={country.flag}
                  alt="country_flag"
                  width={"28"}
                  height={"25"}
                />
                <span>{country.country}</span>
              </div>
            ))}
          </div>
        )}
        <div
          className="flag_container"
          onClick={() => setShow((prev) => !prev)}
        >
          <img
            src={selectedValues.flag as string}
            alt="selected_flag"
            width={"32"}
            height={"32"}
          />
          <span>{selectedValues.dial_code}</span>
        </div>
        <input
          onBlur={(e) => validation && validateField(e.target.value)}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
            return {
              value: e.target.value,
              countryCode: selectedValues.dial_code,
              formattedValue: `${selectedValues?.dial_code}-${e.target.value}`,
            };
          }}
          id={inputStyles}
          defaultValue={defaultValue}
          className="input"
          type="text"
          maxLength={Number(selectedValues?.phoneLength)}
          {...props}
        />
      </div>
      {fieldError && <span className="error_phone_input">*{fieldError}</span>}
    </div>
  );
};
