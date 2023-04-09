import { useState, useEffect } from 'react';
// import { createAvatar } from '@dicebear/core';
// import { adventurer } from '@dicebear/avatars';
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

const Button = styled.button`
  margin-top: 1rem;
  padding: 0.5rem 1rem;
  border-radius: 0.25rem;
  background-color: #0077cc;
  color: white;
  font-size: 1rem;
  border: none;
  cursor: pointer;
`;

type AvatarCreatorProps = {
  onSave: () => void;
};
function AvatarCreator({ onSave }: AvatarCreatorProps) {
  const [seed, setSeed] = useState<string>('Sassy');
  const [eyebrows, setEyebrows] = useState<string>('variant01');
  const [eyes, setEyes] = useState<string>('variant01');
  const [hair, setHair] = useState<string>('short01');
  const [hairProbability, setHairProbability] = useState<number>(100);
  const [hairColor, setHairColor] = useState<string>('0e0e0e');
  const [mouth, setMouth] = useState<string>('variant01');
  const [background, setBackground] = useState<string>('f5f5f5');
  const [feature, setFeature] = useState<string>('blush');
  const [featuresProbability, setFeaturesProbability] = useState<number>(100);
  const [avatarUrl, setAvatarUrl] = useState<string>(
    `https://api.dicebear.com/6.x/adventurer/svg?seed=${seed}&eyebrows=${eyebrows}&eyes=${eyes}&hair=${hair}&hairProbability=${hairProbability}&hairColor=${hairColor}&mouth=${mouth}&backgroundColor=${background}&features=${feature}&featuresProbability=${featuresProbability}`
  );

  useEffect(() => {
    generateAvatarUrl();
  }, [seed, eyebrows, eyes, hair, hairColor, feature, mouth, background]);

  const generateAvatarUrl = () => {
    const baseUrl = `https://api.dicebear.com/6.x/adventurer/svg?seed=${seed}&eyebrows=${eyebrows}&eyes=${eyes}&hair=${hair}&hairProbability=${hairProbability}&hairColor=${hairColor}&mouth=${mouth}&backgroundColor=${background}&features=${feature}&featuresProbability=${featuresProbability}`;

    setAvatarUrl(baseUrl);
  };

  const handleSeedChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSeed(event.target.value);
  };
  const handleEyebrowsChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setEyebrows(event.target.value);
  };
  const handleEyesChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setEyes(event.target.value);
  };
  const handleHairChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const value = event.target.value;
    if (value === 'none') {
      setHair('short19');
      setHairProbability(0);
    } else {
      setHair(value);
      setHairProbability(100);
    }
  };

  const handleHairColorChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setHairColor(event.target.value);
  };

  const handleMouthChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setMouth(event.target.value);
  };

  const handleBackgroundChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setBackground(event.target.value);
  };

  const handleFeatureChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value;
    if (value === 'none') {
      setFeaturesProbability(0);
      setFeature('mustache');
    } else {
      setFeature(value);
      setFeaturesProbability(100);
    }
  };

  const handleSaveClick = () => {
    onSave(avatarUrl);
  };

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
        <select id="mouth-select" value={mouth} onChange={handleMouthChange}>
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
      <Button onClick={handleSaveClick}>Save Avatar</Button>
    </>
  );
}

export default AvatarCreator;
