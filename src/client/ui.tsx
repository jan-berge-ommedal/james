import React, { ButtonHTMLAttributes } from 'react';
import './ui.less';
import styled from '@emotion/styled';

export const StyledButton = styled.button`
 cursor: pointer;
 background-color: #ddd;
 border-radius: 5px;
 &:hover{
    background-color: #eee;
 }
`;

export const Button: React.FC<ButtonHTMLAttributes<HTMLButtonElement>> = (args) => <StyledButton type="button" {...args} />;
export const Button2: React.FC<ButtonHTMLAttributes<HTMLButtonElement>> = (args) => <StyledButton type="button" {...args} />;
