import React, { useContext, useEffect, useState } from "react";

import "./CountryDetail.css";
import { Link, useLocation, useParams } from "react-router-dom";

import { useTheme } from "../hooks/useTheme";

export default function CountryDetail() {
  const [isDark] = useTheme();
  const params = useParams();
  const { state } = useLocation();
  console.log(state);
  const countryName = params.country;
  const [countryData, setCountryData] = useState(null);
  const [notFound, setNotFound] = useState(false);

  function updateCountryData(data) {
    setCountryData({
      flag: data.flags.svg,
      name: data.name.common,
      nativeName: Object.values(data.name.nativeName || {})[0]?.common,
      population: data.population,
      region: data.region,
      subregion: data.subregion,
      tld: data.tld,
      currencies: Object.values(data.currencies || {})
        .map((currency) => currency.name)
        .join(", "),
      languages: Object.values(data.languages || {}).join(", "),
      borders: [],
    });

    if (!data.borders) {
      data.borders = [];
    }

    Promise.all(
      data.borders.map((border) => {
        return fetch(`https://restcountries.com/v3.1/alpha/${border}`)
          .then((res) => {
            return res.json();
          })
          .then(([borderCountry]) => {
            return borderCountry.name.common;
          });
      })
    ).then((borders) => {
      setTimeout(() => {
        setCountryData((prevState) => ({ ...prevState, borders }));
      });
    });
  }

  useEffect(() => {
    if (state) {
      updateCountryData(state);
      return;
    }
    fetch(`https://restcountries.com/v3.1/name/${countryName}?fullText=true`)
      .then((res) => {
        return res.json();
      })
      .then(([data]) => {
        updateCountryData(data);
      })
      .catch((err) => {
        setNotFound(true);
      });
  }, [countryName]);
  if (notFound) {
    return <div>Country not found</div>;
  }
  return countryData === null ? (
    "loading..."
  ) : (
    <main className={`${isDark ? "dark" : ""}`}>
      <div className="country-detail-container">
        <a className="back-button" href="#" onClick={() => history.back()}>
          <i className="fa-solid fa-arrow-left"></i>&nbsp; Back
        </a>
        <div className="card-container">
          <img src={countryData.flag} alt={`${countryData.name} flag`} />

          <div className="card-text">
            <h1>{countryData.name}</h1>
            <div className="details-text">
              <div>
                <p>
                  <b>Native Name: </b>{" "}
                  {countryData.nativeName || countryData.name}
                </p>
                <p>
                  <b>Population: </b>
                  {countryData.population.toLocaleString("en-IN")}
                </p>
                <p>
                  <b>Region: </b> {countryData.region}
                </p>
                <p>
                  <b>Sub Region: </b> {countryData.subregion}
                </p>
              </div>
              <div>
                <p>
                  <b>Top Level Domain: </b>
                  {countryData.tld}
                </p>
                <p>
                  <b>Currencies: </b> {countryData.currencies}
                </p>
                <p>
                  <b>Languages: </b> {countryData.languages}
                </p>
              </div>
            </div>
            {countryData.borders.length !== 0 && (
              <div className="border-countries">
                <b>Border Countries: </b>
                {countryData.borders.map((border) => (
                  <Link key={border} to={`/${border}`}>
                    {border}
                  </Link>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </main>
  );
}
