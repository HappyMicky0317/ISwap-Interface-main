import styled from 'styled-components';

export const BodyWrapper = styled.div`
  // position: relative;
  max-width: 560px;
  width: 100%;
  margin-bottom: 20px;
  // opacity: 0.6;
  // background green;
  background: ${({ theme }) => theme.bg1};
  // box-shadow: 0px 0px 1px rgba(0, 0, 0, 0.01), 0px 4px 8px rgba(0, 0, 0, 0.04), 0px 16px 24px rgba(0, 0, 0, 0.04),
  //   0px 24px 32px rgba(0, 0, 0, 0.01);
  box-shadow: 0px 2px 26px rgba(0, 0, 0, 0.15);
  border-radius: 16px;
  padding: 30px;
  // padding: 1rem;
  // margin: 64px auto;
  overflow: hidden;
  // position: relative;
  // max-width: 420px;
  // width: 100%;
  // background: ${({ theme }) => theme.bg1};
  // box-shadow: 0px 0px 1px rgba(0, 0, 0, 0.01), 0px 4px 8px rgba(0, 0, 0, 0.04), 0px 16px 24px rgba(0, 0, 0, 0.04),
  //   0px 24px 32px rgba(0, 0, 0, 0.01);
  // border-radius: 30px;
  // padding: 1rem;
`;

/**
 * The styled container element that wraps the content of most pages and the tabs.
 */
export default function AppBody({ children }: { children: React.ReactNode }) {
  return <BodyWrapper>{children}</BodyWrapper>;
}
export const Container = styled.div`
  width: 100%;
  max-width: 1200px;
  margin: 0 auto;
  display: grid;
  grid-template-columns: 1fr 1fr;
  column-gap: 20px;
  @media (max-width: 1140px) {
    max-width: 560px;
    column-gap: 0px;
    grid-template-columns: 1fr;
  }
`;
