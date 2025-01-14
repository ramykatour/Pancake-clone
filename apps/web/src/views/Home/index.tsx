import styled, { keyframes } from 'styled-components'
import PageSection from 'components/PageSection'
import { useAccount } from 'wagmi'
import Container from 'components/Layout/Container'
import { PageMeta } from 'components/Layout/Page'
import { useTranslation } from '@pancakeswap/localization'
import { useActiveChainId } from 'hooks/useActiveChainId'
import { ChainId } from '@pancakeswap/sdk'
import { FireIcon, Link, Text } from '@pancakeswap/uikit'
import Hero from './components/Hero'
import { swapSectionData } from './components/SalesSection/data'
import MetricsSection from './components/MetricsSection'
import SalesSection from './components/SalesSection'
import Footer from './components/Footer'
import { WedgeTopLeft, InnerWedgeWrapper, OuterWedgeWrapper } from './components/WedgeSvgs'
import UserBanner from './components/UserBanner'

const StyledHeroSection = styled(PageSection)`
  padding-top: 16px;

  ${({ theme }) => theme.mediaQueries.md} {
    padding-top: 48px;
  }
`

const UserBannerWrapper = styled(Container)`
  z-index: 1;
  position: absolute;
  width: 100%;
  top: 0;
  left: 50%;
  transform: translate(-50%, 0);
  padding-left: 0px;
  padding-right: 0px;

  ${({ theme }) => theme.mediaQueries.lg} {
    padding-left: 24px;
    padding-right: 24px;
  }
`
const ChainList = styled.div`
  display: flex;
  justify-content: space-between;
  margin-top: 60px;
`

const ChainItemWrapper = styled.div`
  display: flex;
  flex-direction: column;
  margin-left: 130px;
`

const TokenList = styled.div`
  display: flex;
`

const TrendingSalesItems = styled.div`
  display: inline-block;
`

const marquee = keyframes`
  0% {
    -webkit-transform: translate3d(0, 0, 0);
    -moz-transform: translate3d(0, 0, 0);
    -o-transform: translate3d(0, 0, 0);
    transform: translate3d(0, 0, 0);
  }
  100% {
    -webkit-transform: translate3d(-50%, 0, 0);
    -moz-transform: translate3d(-50%, 0, 0);
    -o-transform: translate3d(-50%, 0, 0);
    transform: translate3d(-50%, 0, 0);
  }
`

const TrendingSales = styled.div`
  padding-bottom: 10px;
  display: inline-block;
  white-space: nowrap;
  overflow: hidden;
  -webkit-animation: ${marquee} 20s linear infinite;
  -moz-animation: ${marquee} 20s linear infinite;
  -o-animation: ${marquee} 20s linear infinite;
  animation: ${marquee} 20s linear infinite;
  animation-delay: 0.5s;

  &:hover {
    -webkit-animation-play-state: paused;
    -moz-animation-play-state: paused;
    -o-animation-play-state: paused;
    animation-play-state: paused;
  }
`

const marqueeRevert = keyframes`
  0% {
    -webkit-transform: translate3d(-50%, 0, 0);
    -moz-transform: translate3d(-50%, 0, 0);
    -o-transform: translate3d(-50%, 0, 0);
    transform: translate3d(-50%, 0, 0);
  }
  100% {
    -webkit-transform: translate3d(0, 0, 0);
    -moz-transform: translate3d(0, 0, 0);
    -o-transform: translate3d(0, 0, 0);
    transform: translate3d(0, 0, 0);
  }
`

const TrendingSalesRevert = styled.div`
  padding-bottom: 10px;
  display: inline-block;
  white-space: nowrap;
  overflow: hidden;
  -webkit-animation: ${marqueeRevert} 20s linear infinite;
  -moz-animation: ${marqueeRevert} 20s linear infinite;
  -o-animation: ${marqueeRevert} 20s linear infinite;
  animation: ${marqueeRevert} 20s linear infinite;
  animation-delay: 0.5s;

  &:hover {
    -webkit-animation-play-state: paused;
    -moz-animation-play-state: paused;
    -o-animation-play-state: paused;
    animation-play-state: paused;
  }
`

const TokenContainer = styled.div`
  color: #2196f3;
  width: 170px;
  cursor: pointer;
  height: 70px;
  margin: 3px 6px 0 0;
  display: flex;
  padding: 0 10px 0 10px;
  font-size: 90%;
  box-shadow: 1px 1px 15px -6px #7ec2f8;
  align-items: center;
  border-radius: 10px;
  justify-content: center;
`

const TokenImage = styled.div`
  width: 42px;
  height: 42px;
  margin-right: 10px;
  & img {
    border-radius: 50%;
  }
`
const Token = styled.div<{ name: string }>`
  width: 52px;
  height: 52px;
  border-radius: 50%;
  background-image: ${(props) => `url('images/home/flying-pancakes/${props.name}.png')`};
  background-size: cover;
`
const chainList = [
  {
    icon: 'ethereum-right',
    label: 'ethereum',
    link: 'https://ethereum.org/en/',
  },
  {
    icon: 'avax-right',
    label: 'avalanche',
    link: 'https://www.avax.network/',
  },
  {
    icon: 'solana-right',
    label: 'solana',
    link: 'https://solana.com/',
  },
  {
    icon: 'bnb-right',
    label: 'bnb',
    link: 'https://www.bnbchain.world/en',
  },
  {
    icon: 'fantom-right',
    label: 'fantom',
    link: 'https://fantom.foundation/',
  },
  {
    icon: 'polygon-right',
    label: 'polygon',
    link: 'https://polygon.technology/',
  },
]

const trendingSales = [
  {
    image: 'https://pbs.twimg.com/profile_images/1484599264214929413/beISbI6c_400x400.jpg',
    name: 'PUP',
  },
  {
    image: 'https://i.pinimg.com/originals/7d/ce/1e/7dce1ee0c4aa735693a175d78233e7ff.gif',
    name: 'TDD',
  },
  {
    image: 'https://i.imgur.com/2uASJ74.png',
    name: 'ZOI',
  },
  {
    image: 'https://i.postimg.cc/Vv7x6N4Z/Blue-Rocket-Doge2.png',
    name: 'BRD',
  },
  {
    image: 'https://i.postimg.cc/6qNhYCHB/7On.gif',
    name: 'mV4',
  },
  {
    image: 'https://www.triplex-token.com/gallery_gen/939ddb956693340e47dbf6b23d09793a.png',
    name: 'TXT',
  },

  {
    image: 'https://i.postimg.cc/0Qvt7Shx/Logo-MAI.png',
    name: 'MAI',
  },
  {
    image: 'https://i.postimg.cc/1tcxbQP1/IMG-20230203-130756-732.png',
    name: 'QUKA',
  },
  {
    image: 'https://cryptonican.com/wp-content/uploads/2023/01/Cryptonican.com-Automatic-CAN-Token.png',
    name: 'ACAN',
  },
]
const Home: React.FC<React.PropsWithChildren> = () => {
  const { address: account } = useAccount()
  const { chainId } = useActiveChainId()

  const HomeSectionContainerStyles = { margin: '0', width: '100%', maxWidth: '968px' }

  const { t } = useTranslation()

  return (
    <>
      <PageMeta />
      <style jsx global>{`
        #home-1 .page-bg {
          background: linear-gradient(139.73deg, #e6fdff 0%, #f3efff 100%);
        }
        [data-theme='dark'] #home-1 .page-bg {
          background: radial-gradient(103.12% 50% at 50% 50%, #21193a 0%, #191326 100%);
        }
        #home-2 .page-bg {
          background: linear-gradient(180deg, #ffffff 22%, #d7caec 100%);
        }
        [data-theme='dark'] #home-2 .page-bg {
          background: linear-gradient(180deg, #09070c 22%, #201335 100%);
        }
        #home-3 .page-bg {
          background: #d7caec;
        }
        [data-theme='dark'] #home-3 .page-bg {
          background: linear-gradient(180deg, #201335 0%, #27262c 100%);
        }
        #home-4 .inner-wedge svg {
          fill: #d8cbed;
        }
        [data-theme='dark'] #home-4 .inner-wedge svg {
          fill: #201335;
        }
      `}</style>
      <StyledHeroSection
        innerProps={{ style: { margin: '0', width: '100%' } }}
        containerProps={{
          id: 'home-1',
        }}
        index={2}
        hasCurvedDivider={false}
      >
        {account && chainId === ChainId.BSC && (
          <UserBannerWrapper>
            <UserBanner />
          </UserBannerWrapper>
        )}
        <Hero />

        <div style={{ overflow: 'hidden', marginTop: '60px' }}>
          <TrendingSalesRevert>
            {[1, 2, 3, 4].map(() => (
              <TrendingSalesItems>
                <div>
                  <ChainList>
                    {chainList.map(({ icon, link, label }) => (
                      <Link href={link} style={{ textDecoration: 'none' }}>
                        <ChainItemWrapper>
                          <Token name={icon} />
                          <Text
                            display="inline"
                            textAlign="center"
                            color="textSubtle"
                            mb="20px"
                            mt="30px"
                            fontWeight={700}
                            textTransform="uppercase"
                          >
                            {label}
                          </Text>
                        </ChainItemWrapper>
                      </Link>
                    ))}
                  </ChainList>
                </div>
              </TrendingSalesItems>
            ))}
          </TrendingSalesRevert>
        </div>
      </StyledHeroSection>

      <PageSection
        index={2}
        hasCurvedDivider={false}
        innerProps={{ style: { margin: '0', width: '100%' } }}
        containerProps={{
          id: 'home-5',
        }}
      >
        <OuterWedgeWrapper>
          <InnerWedgeWrapper top>
            <WedgeTopLeft />
          </InnerWedgeWrapper>
        </OuterWedgeWrapper>
        <SalesSection {...swapSectionData(t)} />
        <div style={{ overflow: 'hidden', marginTop: '60px' }}>
          <TrendingSales>
            {[1, 2, 3, 4].map(() => (
              <TrendingSalesItems>
                <div>
                  <TokenList>
                    {trendingSales.map(({ image, name }) => (
                      <TokenContainer>
                        <TokenImage>
                          <img alt="" className="jss330" src={image} />
                        </TokenImage>
                        <div>
                          <div>
                            <Text display="inline">0</Text>
                            <FireIcon stroke="#2196f3" />
                          </div>
                          <Text>{name}</Text>
                        </div>
                      </TokenContainer>
                    ))}
                  </TokenList>
                </div>
              </TrendingSalesItems>
            ))}
          </TrendingSales>
        </div>
      </PageSection>

      <PageSection
        innerProps={{ style: { margin: '0', width: '100%' } }}
        containerProps={{
          id: 'home-2',
        }}
        index={2}
        hasCurvedDivider={false}
      >
        <MetricsSection />
      </PageSection>

      <PageSection
        innerProps={{ style: HomeSectionContainerStyles }}
        index={2}
        hasCurvedDivider={false}
        containerProps={{
          id: 'home-3',
        }}
      >
        <Footer />
      </PageSection>
    </>
  )
}

export default Home
