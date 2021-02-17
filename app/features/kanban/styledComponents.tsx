import styled from 'styled-components';

export const LabelDiv = styled.div`
  background-color: ${(props) => props.bgColor};
  max-width: max-content;
  min-width: 60px;
  max-height: 15px;
  border: 1px solid grey;
  border-radius: 7px;
  padding: 5px;
  font-size: 12px;
  color: white;
  text-align: center;
  display: 'flex';
  align-items: center;
`;

export const CardDiv = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  margin-bottom: 10px;
`;

export const RowDiv = styled.div`
  display: flex;
  flex-direction: row;
`;

export const LabelSelectorDiv = styled.div`
  min-width: 100%;
  max-width: 100%;
  max-height: max-content;
  display: flex;
  margin-bottom: 10px;
  padding-top: 10px;
  padding-left: 5px;
  flex-direction: column;
`;

export const LabelRectDiv = styled.div`
  background-color: ${(props) => props.bgColor};
  color: white;
  max-width: 180px;
  min-height: 20px;
  padding: 5px;
  border-radius: 5px;
  margin: 5px;
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  &:hover {
    opacity: 0.8;
    cursor: pointer;
  }
`;

export const InnerDialogTitle = styled.h2`
  font-size: 20px;
  color: black;
  text-decoration: underline;
`;

export const SettingsLabelRow = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  margin: 20px;
`;
