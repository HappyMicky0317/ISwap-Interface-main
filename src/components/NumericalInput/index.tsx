import styled from 'styled-components';
import { escapeRegExp } from '../../utils';
import React from 'react';
const StyledInput = styled.input<{ error?: boolean; fontSize?: string; align?: string }>`
  color: ${({ error, theme }) => (error ? theme.red1 : theme.text1)};
  width: 100%;
  // max-width: 195px;
  height: 62px;
  position: relative;
  font-weight: 500;
  outline: none;
  // text-align: right;
  border: none;
  border-radius: 5px;
  flex: 1 1 auto;
  background-color: ${({ theme }) => theme.bg1};
  // background: #2B2626;
  box-shadow: inset 6px 10px 12px 197px rgba(255, 255, 255, 0.1);
  // filter: blur(0.4px);
  font-size: ${({ fontSize }) => fontSize ?? '24px'};
  text-align: ${({ align }) => align && align};
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  padding: 0px 10px;
  -webkit-appearance: number;

  ::-webkit-search-decoration {
    -webkit-appearance: none;
  }
  // [type='number'] {
  //   -moz-appearance: number;
  // }
  input[type='number'] {
    height: 30px;
    line-height: 30px;
    font-size: 16px;
    padding: 0 8px;
  }
  ::-webkit-inner-spin-button {
    -webkit-appearance: none;
    cursor: pointer;
    display: block;
    width: 8px;
    color: #333;
    text-align: center;
    position: relative;
  }
  ::-webkit-inner-spin-button {
    display: none;
    background: transparent url('http://i.stack.imgur.com/YYySO.png') no-repeat 50% 50%;
    width: 14px;
    opacity: 1 !important;
    filter: grayscale(1);
    height: 14px;
    padding: 4px;
    margin: 12px 4px;
    position: relative;
    right: 4px;
    border-radius: 28px;
  }

  ::placeholder {
    // color: white;
    font-size: 20px;
    color: ${({ theme }) => theme.text4};
  }
  -moz-appearance: textfield !important;
`;

const inputRegex = RegExp(`^\\d*(?:\\\\[.])?\\d*$`); // match escaped "." characters via in a non-capturing group

export const Input = React.memo(function InnerInput({
  value,
  onUserInput,
  placeholder,
  ...rest
}: {
  value: string | number;
  onUserInput: (input: string) => void;
  error?: boolean;
  fontSize?: string;
  align?: 'right' | 'left';
} & Omit<React.HTMLProps<HTMLInputElement>, 'ref' | 'onChange' | 'as'>) {
  const enforcer = (nextUserInput: string) => {
    if (nextUserInput === '' || inputRegex.test(escapeRegExp(nextUserInput))) {
      onUserInput(nextUserInput);
    }
  };

  return (
    <StyledInput
      {...rest}
      value={value}
      onChange={(event) => {
        // replace commas with periods, because ISwap exclusively uses period as the decimal separator
        enforcer(event.target.value.replace(/,/g, '.'));
      }}
      // universal input options
      inputMode="decimal"
      title="Token Amount"
      autoComplete="off"
      autoCorrect="off"
      type="number"
      step="0.1"
      // text-specific options
      pattern="^[0-9]*[.,]?[0-9]*$"
      placeholder={placeholder || '0.0'}
      minLength={1}
      maxLength={79}
      spellCheck="false"
    />
  );
});

export default Input;

// const inputRegex = RegExp(`^\\d*(?:\\\\[.])?\\d*$`) // match escaped "." characters via in a non-capturing group
