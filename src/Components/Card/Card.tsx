import styled from 'styled-components/macro';
type CardProps = {
  title: string;
  imageSrc: string;
  altText: string;
  children: React.ReactNode;
};

export const Card: React.FC<CardProps> = ({
  title,
  imageSrc,
  altText,
  children,
}) => {
  return (
    <CardContainer>
      <CardTitle>{title}</CardTitle>
      <CardImage src={imageSrc} alt={altText} />
      <CardText>{children}</CardText>
    </CardContainer>
  );
};

const CardContainer = styled.div`
  height: 280px;
  width: 200px;
  background-color: rgba(255, 255, 255, 0.25);
  backdrop-filter: blur(6px);
  -webkit-backdrop-filter: blur(6px);
  border: 1px solid rgba(255, 255, 255, 0.18);
  box-shadow: rgba(142, 142, 142, 0.19) 0px 6px 15px 0px;
  -webkit-box-shadow: rgba(142, 142, 142, 0.19) 0px 6px 15px 0px;
  border-radius: 12px;
  -webkit-border-radius: 12px;
  color: rgba(255, 255, 255, 0.75);
  text-align: center;
  margin: 10px;
  padding: 20px;
`;

const CardTitle = styled.h2`
  font-size: 24px;
  margin-bottom: 20px;
  color: #1e3d6b;
  font-family: 'Braah One';
`;

const CardImage = styled.img`
  width: 100px;
  height: auto;
  margin-bottom: 10px;
`;

const CardText = styled.p`
  text-align: left;
  margin-top: 10px;
  font-size: 14px;
`;
