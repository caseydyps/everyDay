import { useState } from 'react';
import { createAvatar } from '@dicebear/core';
import { adventurer } from '@dicebear/avatars';
import styled from 'styled-components/macro';

const AvatarContainer = styled.div`
  width: 500px;
  height: 500px;
  border-radius: 50%;
  overflow: hidden;
`;

const AvatarImage = styled.img`
  width: 100%;
  height: 100%;
`;

function AvatarCreator() {
  const [seed, setSeed] = useState('Sassy');
  const [eyebrows, setEyebrows] = useState('variant01');
  const [eyes, setEyes] = useState('variant01');
  const [hair, setHair] = useState('short01');
  const [hairProbability, setHairProbability] = useState('100');
  const [hairColor, setHairColor] = useState('0e0e0e');
  const [mouth, setMouth] = useState('variant01');
  const [background, setBackground] = useState('f5f5f5');
  const [feature, setFeature] = useState('blush');
  const [featuresProbability, setFeaturesProbability] = useState('100');

  const handleSeedChange = (event) => {
    setSeed(event.target.value);
  };

  const handleEyebrowsChange = (event) => {
    setEyebrows(event.target.value);
  };

  const handleEyesChange = (event) => {
    setEyes(event.target.value);
  };

  const handleHairChange = (event) => {
    const value = event.target.value;
    if (value === 'none') {
      setHair('short19');
      setHairProbability(0);
    } else {
      setHair(value);
      setHairProbability(100);
    }
  };

  const handleHairColorChange = (event) => {
    setHairColor(event.target.value);
  };

  const handleMouthChange = (event) => {
    setMouth(event.target.value);
  };

  const handleBackgroundChange = (event) => {
    setBackground(event.target.value);
  };

  const handleFeatureChange = (event) => {
    const value = event.target.value;
    if (value === 'none') {
      setFeature('blush');
      setFeaturesProbability(0);
    } else {
      setFeature(value);
      setFeaturesProbability(100);
    }
  };
  const avatarBabyUrl = `https://api.dicebear.com/6.x/adventurer/svg?seed=Sassy&hairProbability=0`;
  const avatarMomUrl = `https://api.dicebear.com/6.x/adventurer/svg?seed=Precious&features[]`;
  const avatarDadUrl = `https://api.dicebear.com/6.x/adventurer/svg?seed=Sadie&earrings=variant01,variant02,variant03&earringsProbability=0&eyebrows=variant01,variant02,variant03&eyes=variant01,variant02,variant03&features[]&featuresProbability=0&glasses[]&glassesProbability=0&hair[]&hairColor=0e0e0e,562306,592454,6a4e35,796a45&mouth=variant01,variant02,variant03&skinColor=f2d3b1`;
  const avatarUrl = `https://api.dicebear.com/6.x/adventurer/svg?seed=${seed}&eyebrows=${eyebrows}&eyes=${eyes}&hairColor=${hairColor}&mouth=${mouth}https://api.dicebear.com/6.x/adventurer/svg?seed=${seed}&eyebrows=${eyebrows}&eyes=${eyes}&hair=${hair}&hairProbability=${hairProbability}&hairColor=${hairColor}&mouth=${mouth}&backgroundColor=${background}&features=${feature}&featuresProbability=${featuresProbability}`;
  return (
    <>
      <div>
        <label htmlFor="seed-select">Select a seed:</label>
        <select id="seed-select" value={seed} onChange={handleSeedChange}>
          <option value="Precious">Precious</option>
          <option value="Cookie">Cookie</option>
          <option value="Sassy">Sassy</option>
        </select>
        <br />
        <label htmlFor="eyebrows-select">Select eyebrows:</label>
        <select
          id="eyebrows-select"
          value={eyebrows}
          onChange={handleEyebrowsChange}
        >
          <option value="variant01">Thick</option>
          <option value="variant02">Variant 2</option>
          <option value="variant03">Variant 3</option>
          <option value="variant04">Variant 4</option>
          <option value="variant05">Variant 5</option>
        </select>
        <br />
        <label htmlFor="eyes-select">Select eyes:</label>
        <select id="eyes-select" value={eyes} onChange={handleEyesChange}>
          <option value="variant01">Variant 1</option>
          <option value="variant02">Variant 2</option>
          <option value="variant03">Variant 3</option>
        </select>
        <br />
        <label htmlFor="hair-select">Select hair style:</label>
        <select id="hair-select" value={hair} onChange={handleHairChange}>
          <option value="long03">中短髮</option>
          <option value="long06">大波浪</option>
          <option value="long08">花圈</option>
          <option value="long15">雙馬尾</option>
          <option value="long16">馬尾</option>
          <option value="short01">瀏海</option>
          <option value="short04">平頭</option>
          <option value="short07">韓系</option>
          <option value="short09">韓系2</option>
          <option value="short12">呆頭</option>
          <option value="short15">8+9</option>
          <option value="short16">刺蝟</option>
          <option value="short19">當兵</option>
          <option value="none">光頭</option>
        </select>

        <label htmlFor="hair-color-select">Select hair color:</label>
        <select
          id="hair-color-select"
          value={hairColor}
          onChange={handleHairColorChange}
        >
          <option value="0e0e0e">Black</option>
          <option value="562306">Brown</option>
          <option value="e6c770">Blonde</option>
          <option value="6a4e35">Red</option>
          <option value="796a45">Gray</option>
          <option value="914b2d">Auburn</option>
          <option value="733d1f">Chestnut</option>
          <option value="f5d23d">Blonde Highlights</option>
          <option value="221b15">Dark Brown</option>
          <option value="b38a58">Light Brown</option>
        </select>
        <br />
        <label htmlFor="feature-select">Select feature:</label>
        <select
          id="feature-select"
          value={feature}
          onChange={handleFeatureChange}
        >
          <option value="blush">blush</option>
          <option value="freckles">freckles</option>
          <option value="none">none</option>
        </select>

        <label htmlFor="mouth-select">Select mouth:</label>
        <select id="mouth-select" value={feature} onChange={handleMouthChange}>
          <option value="variant01">Variant 1</option>
          <option value="variant02">Variant 2</option>
          <option value="variant03">Variant 3</option>
        </select>
        <label htmlFor="background-color-select">
          Select background color:
        </label>
        <select
          id="background-color-select"
          value={background}
          onChange={handleBackgroundChange}
        >
          <option value="f5f5f5">Light Gray</option>
          <option value="b6e3f4">Blue</option>
          <option value="d1d4f9">Purple</option>
          <option value="transparent">Transparent</option>
        </select>
      </div>
      <AvatarContainer>
        <AvatarImage src={avatarUrl} alt="avatar" />
      </AvatarContainer>
    </>
  );
}

export default AvatarCreator;
