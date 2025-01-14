import styled from 'styled-components'
import { Button, Flex, Image, Pool, useMatchBreakpoints, useModal } from '@pancakeswap/uikit'
import { useTranslation } from '@pancakeswap/localization'
import { useAccount } from 'wagmi'
import ConnectWalletButton from 'components/ConnectWalletButton'
import { BuyInPoolModal } from './BuyInPoolModal'
import Status from './Status'
import TokenPrice from './TokenPrice'
import ActionPanel from './ActionPanel'
import NameCell from './NameCell'

const BuyContainer = styled(Flex)`
  display: block;
  width: 100%;
`

const ActionWrapper = styled(Flex)`
  flex-direction: row;
  justify-content: flex-end;
  align-items: center;
  flex: 1;
  padding: 0px 12px 12px;
  ${({ theme }) => theme.mediaQueries.md} {
    flex: 0 0 120px;
    padding-right: 32px;
    padding-left: 8px;
  }
`

const StyledCell = styled(Pool.BaseCell)`
  flex: 4.5;
  ${({ theme }) => theme.mediaQueries.sm} {
    flex: 1 0 120px;
  }
`
const PoolContainer = styled(Flex)`
  background-color: ${({ theme }) => theme.card.background};
  display: block;
  border: 2px solid ${({ theme }) => theme.colors.input};
  border-radius: 16px;
  margin-bottom: 16px!important;

  ${({ theme }) => theme.mediaQueries.sm} {
    margin-bottom: 0;
  }
}

  ${({ theme }) => theme.mediaQueries.xl} {
    margin-right: 0;
  }
`
const BuyInPoolRow = () => {
  const { t } = useTranslation()
  const { isXs, isSm, isMd, isLg, isXl, isXxl } = useMatchBreakpoints()
  // const isLargerScreen = isLg || isXl || isXxl
  const isXLargerScreen = isXl || isXxl
  const { address: account } = useAccount()
  const { isMobile } = useMatchBreakpoints()

  const [onPresentBuyInPoolModal] = useModal(<BuyInPoolModal />)
  if (isMobile)
    return (
      <PoolContainer style={{ position: 'relative' }}>
        <Image
          style={{ position: 'absolute', top: '-25px', left: '-25px' }}
          alt="star-icon"
          src="./images/star-icon.png"
          width={60}
          height={60}
        />
        <Pool.ExpandRow panel={<ActionPanel expanded breakpoints={{ isXs, isSm, isMd, isLg, isXl, isXxl }} />}>
          <BuyContainer>
            <Flex>
              <NameCell title={t('Buy/ Stake NIKA')} />
              <TokenPrice />
              <Status status="Open" />
            </Flex>
            <ActionWrapper>
              {account ? (
                <Button
                  width="100%"
                  onClick={(e) => {
                    e.stopPropagation()
                    onPresentBuyInPoolModal()
                  }}
                >
                  {t('Buy')}
                </Button>
              ) : (
                <ConnectWalletButton width="100%" />
              )}
            </ActionWrapper>
          </BuyContainer>
        </Pool.ExpandRow>
      </PoolContainer>
    )
  return (
    <PoolContainer style={{ position: 'relative' }}>
      <Image
        style={{ position: 'absolute', top: '-25px', left: '-25px' }}
        alt="star-icon"
        src="./images/star-icon.png"
        width={60}
        height={60}
      />
      <Pool.ExpandRow panel={<ActionPanel expanded breakpoints={{ isXs, isSm, isMd, isLg, isXl, isXxl }} />}>
        <NameCell title={t('Buy/ Stake NIKA')} />
        <TokenPrice />
        <Status status={t('Open')} />
        {isXLargerScreen && <StyledCell />}
        <ActionWrapper>
          {account ? (
            <Button
              width={200}
              onClick={(e) => {
                e.stopPropagation()
                onPresentBuyInPoolModal()
              }}
            >
              {t('Buy')}
            </Button>
          ) : (
            <ConnectWalletButton width={200} />
          )}
        </ActionWrapper>
      </Pool.ExpandRow>
    </PoolContainer>
  )
}

export default BuyInPoolRow
