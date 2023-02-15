// import { transparentize } from 'polished';
import React, { useMemo } from 'react';
import styled, {
  ThemeProvider as StyledComponentsThemeProvider,
  createGlobalStyle,
  css,
  DefaultTheme,
} from 'styled-components';
import { useIsDarkMode } from '../state/user/hooks';
import { Text, TextProps } from 'rebass';
import { Colors } from './styled';
import BGImage from '../assets/images/back_logo.png';
// radial-gradient(40% 60% at 52% 11%,#2d73ffc2 -184%,rgba(255,255,255,0) 100%)
//159px -17px 150px 73px #113b8c, 11px 33px 56px 13px rgb(249 115 65 / 0%);
export * from './components';

const MEDIA_WIDTHS = {
  upToExtraSmall: 500,
  upToSmall: 720,
  upToMedium: 960,
  upToLarge: 1280,
};

const mediaWidthTemplates: { [width in keyof typeof MEDIA_WIDTHS]: typeof css } = Object.keys(MEDIA_WIDTHS).reduce(
  (accumulator, size) => {
    (accumulator as any)[size] = (a: any, b: any, c: any) => css`
      @media (max-width: ${(MEDIA_WIDTHS as any)[size]}px) {
        ${css(a, b, c)}
      }
    `;
    return accumulator;
  },
  {},
) as any;

const white = '#FFFFFF';
const black = '#000000';

export function colors(darkMode: boolean): Colors {
  return {
    // base
    white,
    black,

    // text
    // text1: darkMode ? '#FFFFFF' : '#000000',
    BUYTEXT: darkMode ? '#FFFFFF' : '#000000',
    EnterAmountconectwallet: darkMode ? '#FFFFFF' : '#000000',
    LOVESWAPBACKGROUND: darkMode ? 'rgb(16, 226, 242)' : 'rgb(16, 226, 242)',
    BorderColor: darkMode ? 'rgba(0,0,0,0)' : '#F3C914',
    text1: darkMode ? '#FFFFFF' : '#000000',
    text2: darkMode ? '#C3C5CB' : '#565A69',
    text3: darkMode ? '#6C7284' : '#888D9B',
    text4: darkMode ? '#565A69' : '#C3C5CB',
    text5: darkMode ? '#2C2F36' : '#EDEEF2',
    textConeectToWaletOnNavbar: darkMode ? '#c3c5cb' : '#000000',
    // backgrounds / greys
    // bg1: darkMode ? '#151313' : '#FFFFFF',
    bg1: darkMode ? '#232323' : '#FFFFFF',
    settingCardbg: darkMode ? '#020202' : '#ffffff',
    bg2: darkMode ? '#0A0A1E' : 'rgba(0,0,0,0)',
    // radial-gradient(82.02% 184.41% at 52.84% -52%,#363cff4a -43%,#dfd1e275 80%)
    RDial: darkMode ? '#F3C914' : '#F3C914',
    Rdial1: darkMode ? '#020202' : '#ffffff75',
    // bg2: darkMode ? '#2C2F36' : '#F7F8FA',
    // bg3: darkMode ? '#40444F' : '#EDEEF2',
    bg3: darkMode ? 'rgba(196, 196, 196, 0.1)' : '#EDEEF2',
    bg4: darkMode ? 'rgba(196, 196, 196, 0.1);' : '#CED0D9',
    bg5: darkMode ? '#6C7284' : '#888D9B',
    bgSWAP6: darkMode ? '#ed7b17' : '#ed7b17',
    cardsBoxShadowTopLeftcorner: darkMode ? 'rgb(234 212 16)' : '#363cffbf',
    cardsBoxShadowTopleftCorner1: darkMode ? 'rgb(249 115 65 / 0%)' : '#363cff',
    cardsBoxShadowTopRightcorner: darkMode ? 'rgb(228 96 24)' : 'rgb(179 71 136 / 85%)',
    cardsBoxShadowTopRightCorner1: darkMode ? 'rgb(78 71 179)' : 'rgb(179 71 136 / 85%)',
    settingMenuiconStrokeColor: darkMode ? '#F3C914' : '#F3C914',
    voteCardColor: darkMode
      ? 'radial-gradient(76.02% 75.41% at 1.84% 0%,#F3C914 0%,#151515 100%)'
      : 'radial-gradient(76.02% 75.41% at 1.84% 0%,#F3C914 0%,rgba(0,0,0,0) 100%)',
    bgThemeColor: darkMode ? '#1C1C1C' : 'linear-gradient(53deg, #F3C914, transparent)',
    swapBodyColor: darkMode ? '152px 147px 101px 93px #F3C91457, 11px 33px 56px 13px rgb(249 115 65 / 0%)' : '#000000',
    //specialty colors
    modalBG: darkMode ? 'rgba(0,0,0,.425)' : 'rgba(0,0,0,0.3)',
    advancedBG: darkMode ? 'rgba(0,0,0,0.1)' : 'rgba(255,255,255,0.6)',
    pngLOGOCOLOR: darkMode ? '' : '',
    //primary colors
    // primary1: darkMode ? '#2172E5' : '#ff007a',
    // primary1: darkMode ? '#ed7b17' : '#ed7b17',
    // primary1: darkMode ? '#F97341' : '#F97341',
    primary1: darkMode ? 'linear-gradient(90deg, #FFB807 8.49%, #FFEA00 100%);' : 'rgb(29, 195, 181)',

    //1px solid rgb(29,195, 181)
    primary2: darkMode ? '#3680E7' : '#FF8CC3',
    primary3: darkMode ? '#F3C914' : '#F3C914',
    primary4: darkMode ? '#376bad70' : 'rgba(0,0,0,0)',
    primary6: darkMode ? 'rgba(0,0,0,0)' : 'rgba(0,0,0,0)',
    primary5: darkMode ? 'rgba(0, 0, 0, 0)' : 'rgba(0,0,0,0)',
    primary7: darkMode ? '#F97341' : '#F97341',
    primary8: darkMode ? '#020202' : 'rgba(0,0,0,0)',
    // primary5: darkMode ? '#153d6f70' : '#FDEAF1',

    // color text
    // primaryText1: darkMode ? '#6da8ff' : '#ff007a',
    // primaryText1: darkMode ? '#FFFFFF' : '#FFFFFF',
    primaryText1: darkMode ? '#FFFFFF' : '#000000',

    // secondary colors
    secondary1: darkMode ? '#2172E5' : '#2172E5',
    secondary2: darkMode ? '#17000b26' : '#F6DDE8',
    secondary3: darkMode ? '#17000b26' : '#FDEAF1',

    // other
    red1: '#FF6871',
    red2: '#F82D3A',
    green1: '#27AE60',
    yellow1: '#FFE270',
    yellow2: '#F3841E',
    blue1: '#2172E5',

    // dont wanna forget these blue yet
    // blue4: darkMode ? '#153d6f70' : '#C4D9F8',
    // blue5: darkMode ? '#153d6f70' : '#EBF4FF',
  };
}

export function theme(darkMode: boolean): DefaultTheme {
  return {
    ...colors(darkMode),

    grids: {
      sm: 8,
      md: 12,
      lg: 24,
    },

    //shadows
    shadow1: darkMode ? '#000' : '#2F80ED',

    // media queries
    mediaWidth: mediaWidthTemplates,

    // css snippets
    flexColumnNoWrap: css`
      display: flex;
      flex-flow: column nowrap;
    `,
    flexRowNoWrap: css`
      display: flex;
      flex-flow: row nowrap;
    `,
  };
}

export default function ThemeProvider({ children }: { children: React.ReactNode }) {
  const darkMode = useIsDarkMode();

  const themeObject = useMemo(() => theme(darkMode), [darkMode]);

  return <StyledComponentsThemeProvider theme={themeObject}>{children}</StyledComponentsThemeProvider>;
}

const TextWrapper = styled(Text)<{ color: keyof Colors }>`
  color: ${({ color, theme }) => (theme as any)[color]};
`;

export const TYPE = {
  main(props: TextProps) {
    return <TextWrapper fontWeight={500} color={'text2'} {...props} />;
  },
  link(props: TextProps) {
    return <TextWrapper fontWeight={500} color={'primary1'} {...props} />;
  },
  black(props: TextProps) {
    return <TextWrapper fontWeight={500} color={'text1'} {...props} />;
  },
  white(props: TextProps) {
    return <TextWrapper fontWeight={500} color={'white'} {...props} />;
  },
  body(props: TextProps) {
    return <TextWrapper fontWeight={400} fontSize={16} color={'text1'} {...props} />;
  },
  largeHeader(props: TextProps) {
    return <TextWrapper fontWeight={600} fontSize={24} {...props} />;
  },
  mediumHeader(props: TextProps) {
    return <TextWrapper fontWeight={500} fontSize={20} {...props} />;
  },
  subHeader(props: TextProps) {
    return <TextWrapper fontWeight={400} fontSize={14} {...props} />;
  },
  small(props: TextProps) {
    return <TextWrapper fontWeight={500} fontSize={11} {...props} />;
  },
  blue(props: TextProps) {
    return <TextWrapper fontWeight={500} color={'primary1'} {...props} />;
  },
  yellow(props: TextProps) {
    return <TextWrapper fontWeight={500} color={'yellow1'} {...props} />;
  },
  darkGray(props: TextProps) {
    return <TextWrapper fontWeight={500} color={'text3'} {...props} />;
  },
  gray(props: TextProps) {
    return <TextWrapper fontWeight={500} color={'bg3'} {...props} />;
  },
  italic(props: TextProps) {
    return <TextWrapper fontWeight={500} fontSize={12} fontStyle={'italic'} color={'text2'} {...props} />;
  },
  error({ error, ...props }: { error: boolean } & TextProps) {
    return <TextWrapper fontWeight={500} color={error ? 'red1' : 'text2'} {...props} />;
  },
};
export const Divider = styled.hr`
  width: 100%;
  height: 1px;
  background-color: #424242;
  border: none;
`;
export const FixedGlobalStyle = createGlobalStyle`
html, input, textarea, button {
  font-family: 'Poppins', sans-serif;
  font-display: fallback;
}
@supports (font-variation-settings: normal) {
  html, input, textarea, button {
    font-family: 'Poppins', sans-serif;
  }
}

html,
body {
  margin: 0;
  padding: 0;
}

* {
  box-sizing: border-box;
}

button {
  user-select: none;
}

html {
  font-size: 16px;
  font-variant: none;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  -webkit-tap-highlight-color: rgba(0, 0, 0, 0);
  font-feature-settings: 'ss01' on, 'ss02' on, 'cv01' on, 'cv03' on;
  
}


.lds-spinner {
  color: official;
  display: inline-block;
  position: relative;
  width: 90px;
  height: 90px;
}
.lds-spinner div {
  transform-origin: 40px 40px;
  animation: lds-spinner 1.2s linear infinite;
}
.lds-spinner div:after {
  content: " ";
  display: block;
  position: absolute;
  top: 3px;
  left: 37px;
  width: 6px;
  height: 18px;
  border-radius: 20%;
  background: #F3C914;
}
.lds-spinner div:nth-child(1) {
  transform: rotate(0deg);
  animation-delay: -1.1s;
}
.lds-spinner div:nth-child(2) {
  transform: rotate(30deg);
  animation-delay: -1s;
}
.lds-spinner div:nth-child(3) {
  transform: rotate(60deg);
  animation-delay: -0.9s;
}
.lds-spinner div:nth-child(4) {
  transform: rotate(90deg);
  animation-delay: -0.8s;
}
.lds-spinner div:nth-child(5) {
  transform: rotate(120deg);
  animation-delay: -0.7s;
}
.lds-spinner div:nth-child(6) {
  transform: rotate(150deg);
  animation-delay: -0.6s;
}
.lds-spinner div:nth-child(7) {
  transform: rotate(180deg);
  animation-delay: -0.5s;
}
.lds-spinner div:nth-child(8) {
  transform: rotate(210deg);
  animation-delay: -0.4s;
}
.lds-spinner div:nth-child(9) {
  transform: rotate(240deg);
  animation-delay: -0.3s;
}
.lds-spinner div:nth-child(10) {
  transform: rotate(270deg);
  animation-delay: -0.2s;
}
.lds-spinner div:nth-child(11) {
  transform: rotate(300deg);
  animation-delay: -0.1s;
}
.lds-spinner div:nth-child(12) {
  transform: rotate(330deg);
  animation-delay: 0s;
}
@keyframes lds-spinner {
  0% {
    opacity: 1;
  }
  100% {
    opacity: 0;
  }
}
`;

export const ThemedGlobalStyle = createGlobalStyle`
html {
  color: ${({ theme }) => theme.text1};
  // background: ${({ theme }) => theme.bg2};
  background: ${({ theme }) => theme.bgThemeColor};
}

body {
  min-height: 100vh;
  background:url(${BGImage}) no-repeat right bottom ;

  // background-position:

}
// body::after{
// position:absolute;
// inset:0;
// background-image:url(${BGImage});
// content:'';
// }
`;

// background-position: 0 -30vh;
// background-repeat: no-repeat;
// background-image: ${({ theme }) =>
//   `radial-gradient(0% 50% at 50% 50%, ${transparentize(0.9, theme.primary1)} 0%, ${transparentize(
//     1,
//     theme.bg1,
//   )} 100%)`};
