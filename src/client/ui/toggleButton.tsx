import styled from '@emotion/styled';
import React from 'react';

interface ToggleButtonAttributes{
    onToggle: () => void,
    checked: boolean
}

const ToggleButtonLabel = styled.label`
 display: inline-block;
 cursor: pointer;
 line-height: 30px;
`;

const Switch = styled.span`
  position: relative;
  display: inline-block;
  width: 60px;
  height: 34px;
  
  input {
   opacity: 0;
   width: 0;
   height: 0;
  }
  
  input:checked + span {
    background-color: #2196F3;
  }

  input:focus + span {
    box-shadow: 0 0 1px #2196F3;
  }

  input:checked + span:before {
    -webkit-transform: translateX(26px);
    -ms-transform: translateX(26px);
    transform: translateX(26px);
  }

`;

const Slider = styled.span`
  position: absolute;
  cursor: pointer;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: #ccc;
  -webkit-transition: .4s;
  transition: .4s;
  border-radius: 34px;

  &:before {
    border-radius: 50%;
    position: absolute;
    content: "";
    height: 26px;
    width: 26px;
    left: 4px;
    bottom: 4px;
    background-color: white;
    -webkit-transition: .4s;
    transition: .4s;
  }
`;

const ToggleButton : React.FC<ToggleButtonAttributes> = ({
  onToggle, checked, children, ...rest
}) => (
  <ToggleButtonLabel>
    <Switch>
      <input
        type="checkbox"
        checked={checked}
        onChange={(e) => {
          e.preventDefault();
          onToggle();
        }}
      />
      <Slider />
    </Switch>
    {children}
  </ToggleButtonLabel>
);

export default ToggleButton;
