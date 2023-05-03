import React, { useState, useEffect } from 'react';
import axios from 'axios';
import styled from 'styled-components';

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
        <input
          value={location}
          onChange={handleInputChange}
          placeholder="Enter Location"
          type="text"
          style={{
            border: 'none',
            outline: 'none',
            backgroundColor: 'transparent',
            fontSize: '20px',
            color: '#414141',
            fontWeight: 'bold',
            lineHeight: '1.5',
          }}
        />

        {data.main ? (
          <h2 style={{ margin: '0', color: '#414141' }}>
            {(((data.main.temp - 32) * 5) / 9).toFixed()}°C
          </h2>
        ) : null}

        {data.weather ? (
          <p style={{ fontSize: '12px', color: '#939393' }}>
            {data.weather[0].main}
          </p>
        ) : null}
      </Top>
    </Container>
  );
}

export default WeatherApp;