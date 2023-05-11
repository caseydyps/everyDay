import axios from 'axios';
import { useEffect, useState } from 'react';
import styled from 'styled-components';
import React from 'react';
type DataType = {
  main?: {
    temp: number;
  };
  weather?: any;
};

function WeatherApp() {
  const [data, setData] = useState<DataType>({});
  const [location, setLocation] = useState('Taipei');
  const url = `https://api.openweathermap.org/data/2.5/weather?q=${location}&units=imperial&appid=895284fb2d2c50a520ea537456963d9c`;
  useEffect(() => {
    if (location !== '') {
      axios.get(url).then((response) => {
        setData(response.data);
      });
    }
  }, [location]);

  const Container = styled.div`
    margin: 0 auto;
    max-width: 100px;
    height: 100px;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    color: #fff;
    padding: 10px;
  `;

  const Top = styled.div`
    width: 100%;
    margin: auto;
    height: 100%;
  `;

  const handleInputChange = (event: any) => {
    setLocation(event.target.value);
  };

  return (
    <Container className="container">
      <Top className="top">
        <StyledInput
          value={location}
          onChange={handleInputChange}
          placeholder="Enter Location"
          type="text"
        />
        {data.main ? (
          <TemperatureHeading>
            {(((data.main.temp - 32) * 5) / 9).toFixed()}°C
          </TemperatureHeading>
        ) : null}
        {data.weather ? (
          <WeatherText>{data.weather[0].main}</WeatherText>
        ) : null}
      </Top>
    </Container>
  );
}

const StyledInput = styled.input`
  border: none;
  outline: none;
  background-color: transparent;
  font-size: 20px;
  color: #414141;
  font-weight: bold;
  line-height: 1.5;
`;

const TemperatureHeading = styled.h2`
  margin: 0;
  color: #414141;
`;

const WeatherText = styled.p`
  font-size: 12px;
  color: #939393;
`;

export default WeatherApp;
