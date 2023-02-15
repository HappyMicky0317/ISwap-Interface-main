import { Text } from 'rebass';
import styled from 'styled-components';

export const Wrapper = styled.div`
  position: relative;
`;

export const ClickableText = styled(Text)`
  :hover {
    cursor: pointer;
  }
  color: ${({ theme }) => theme.primary3};
`;
export const MaxButton = styled.button<{ width: string; active?: boolean }>`
  padding: 0.5rem 1rem;
  background-color: ${({ theme }) => theme.primary5};
  border: 1px solid ${({ theme }) => theme.primary5};
  border-radius: 0.5rem;
  font-size: 1rem;
  ${({ theme }) => theme.mediaWidth.upToSmall`
    padding: 0.25rem 0.5rem;
  `};
  font-weight: 500;
  cursor: pointer;
  margin: 0.25rem;
  overflow: hidden;
  color: ${({ theme }) => theme.text1};
  // color: ${({ theme }) => theme.primary3};
  background: ${({ theme }) => theme.bg3};
  ${({ active, theme }) =>
    active &&
    `
    color:#000;
  background:${theme.primary1};
  `}
  :hover {
    border: 1px solid ${({ theme }) => theme.primary3};
  }
  :focus {
    border: 1px solid ${({ theme }) => theme.primary3};
    outline: none;
  }
`;

export const Dots = styled.span`
  &::after {
    display: inline-block;
    animation: ellipsis 1.25s infinite;
    content: '.';
    width: 1em;
    text-align: left;
  }
  @keyframes ellipsis {
    0% {
      content: '.';
    }
    33% {
      content: '..';
    }
    66% {
      content: '...';
    }
  }
`;
