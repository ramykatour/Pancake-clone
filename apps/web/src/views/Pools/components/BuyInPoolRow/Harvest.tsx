import { useEffect, useState } from 'react'
import { Balance, Button, Flex, Heading, Text, useModal, useToast } from '@pancakeswap/uikit'
import { useAccount } from 'wagmi'
import { useTranslation } from '@pancakeswap/localization'
import BigNumber from 'bignumber.js'
import { BIG_ZERO } from '@pancakeswap/utils/bigNumber'
import { useNikaStakingContract, useOracleContract } from 'hooks/useContract'
import { NIKA_ADDR } from 'config/constants/nikaContract'
import useCatchTxError from 'hooks/useCatchTxError'
import { ToastDescriptionWithTx } from 'components/Toast'
import { formatLpBalance, getDecimalAmount } from '@pancakeswap/utils/formatBalance'
import { CollectModal } from '@pancakeswap/uikit/src/widgets/Pool'
import { ActionContent, ActionTitles } from '../PoolsTable/ActionPanel/styles'

interface HarvestProps {
  pendingReward: number
}

const Harvest = ({ pendingReward }: HarvestProps) => {
  const { t } = useTranslation()
  const { address: account } = useAccount()
  const { toastSuccess } = useToast()
  const nikaStakingContract = useNikaStakingContract()
  const earnings = pendingReward ? new BigNumber(pendingReward) : BIG_ZERO
  const hasEarnings = earnings.gt(0)
  const oracleContract = useOracleContract()
  const [usdcAmount, setUsdcAmount] = useState(0)
  const { fetchWithCatchTxError, loading: pendingTx } = useCatchTxError()
  const [earningsDollarValue, setEarningsDollarValue] = useState(0)

  const handleClaimRewards = async () => {
    const receipt = await fetchWithCatchTxError(() => {
      return nikaStakingContract.claimReward()
    })
    if (receipt?.status) {
      toastSuccess(
        `${t('Harvested')}!`,
        <ToastDescriptionWithTx txHash={receipt.transactionHash}>
          {t('Your %symbol% earnings have been sent to your wallet!', { symbol: 'NIKA' })}
        </ToastDescriptionWithTx>,
      )

      onDismiss?.()
    }
  }

  useEffect(() => {
    const updateData = async () => {
      const bigBuyAmount = new BigNumber(earnings.toString() || 0)
      const buyAmount = getDecimalAmount(bigBuyAmount).toString()
      if (new BigNumber(buyAmount).eq(0)) return
      const amount = await oracleContract.consult(NIKA_ADDR, buyAmount)
      if (amount) {
        const amountBigNumber = new BigNumber(amount.toString())
        const usdValue = formatLpBalance(amountBigNumber, 18)
        setEarningsDollarValue(Number(usdValue))
      }
    }
    updateData()
  }, [earnings, oracleContract])

  useEffect(() => {
    console.log('pendingTx: ', pendingTx)
  }, [pendingTx])

  const [onPresentCollect, onDismiss] = useModal(
    <CollectModal
      formattedBalance={earnings.toString()}
      fullBalance=""
      earningTokenSymbol="NIKA"
      earningsDollarValue={earningsDollarValue}
      handleHarvestConfirm={handleClaimRewards}
      pendingTx={pendingTx}
    />,
  )

  useEffect(() => {
    const fetchData = async () => {
      if (!pendingReward) return
      const _usdcAmount = await oracleContract.consult(
        NIKA_ADDR,
        new BigNumber(pendingReward || 0).times(new BigNumber(10).pow(18)).toString(),
      )
      setUsdcAmount(new BigNumber(_usdcAmount.toString() || 0).dividedBy(new BigNumber(10).pow(18)).toNumber())
    }
    fetchData()
  }, [pendingReward])

  if (!account) {
    return (
      <>
        <ActionTitles>
          <Text fontSize="12px" bold color="secondary" as="span" textTransform="uppercase">
            {t('%asset% Earned', { asset: 'NIKA' })}
          </Text>
        </ActionTitles>
        <ActionContent>
          <Heading>0</Heading>
          <Button disabled>{t('Harvest')}</Button>
        </ActionContent>
      </>
    )
  }

  return (
    <>
      <ActionTitles>
        <Text fontSize="12px" bold color="secondary" as="span" textTransform="uppercase">
          {t('%asset% Earned', { asset: 'NIKA' })}
        </Text>
      </ActionTitles>
      <ActionContent>
        <Flex flex="1" flexDirection="column" alignSelf="flex-center">
          <>
            {hasEarnings ? (
              <>
                <Balance lineHeight="1" bold fontSize="20px" decimals={5} value={pendingReward} />

                <Balance
                  display="inline"
                  fontSize="12px"
                  color="textSubtle"
                  decimals={5}
                  prefix="~"
                  value={usdcAmount}
                  unit=" USDC"
                />
              </>
            ) : (
              <>
                <Heading color="textDisabled">0</Heading>
                <Text fontSize="12px" color="textDisabled">
                  0 USD
                </Text>
              </>
            )}
          </>
        </Flex>
        <Button disabled={!hasEarnings} onClick={onPresentCollect}>
          {t('Harvest')}
        </Button>
      </ActionContent>
    </>
  )
}

export default Harvest
