import styled from 'styled-components';

export const Wrapper = styled.div`
  position: relative;
  margin: 0;
  padding-bottom: 6rem;
  min-height: 100%;
`;
export const Statusbar = styled.div`
  bottom: 0;
  width: 100%;
  border-top: 2px solid #e6e6e6;
  clear: both;
  position: fixed;
  right: 0;
  left: 0;
  background-color: #ffffff;

  ul {
    list-style: none;
    color: #a6a6a6;
    margin: 3px;
  }

  li {
    padding: 0 10px;
    display: inline-block;
    font-size: 15px;
  }

  li > img {
    width: 14px;
  }
`;

export const SettingIcon = styled.img`
  width: 20px;
  float: right;
  padding: 0 40px;
`;

export const Settings = styled.div`
  z-index: 101;
  float: right;
  overflow: scroll;
  padding: 20px;
  display: inline;
  border: 2px solid #e6e6e6;
  border-radius: 10px 0 0 10px;
  color: #a6a6a6;

  h1,
  h2 {
    font-size: 16px;
  }

  input[type='text'] {
    width: 100px;
    height: 10px;
    margin-bottom: 10px;
  }

  input[type='color'] {
    border: none;
    float: right;
    height: 17px;
  }
`;

export const SaveButton = styled.button`
  background-color: #ffffff;
  border: 2px solid #e6e6e6;
  border-radius: 10px;
  color: #2e2e2e;
  float: right;
  padding: 5px 10px;
  font-size: 15px;
`;

export const CloseButton = styled.img`
  float: right;
  width: 17px;
`;
