import { useTranslation } from '@pancakeswap/localization'
import BigNumber from 'bignumber.js'
import { useEffect, useState } from 'react'
import { useTheme } from 'styled-components'
import { formatNumber } from '@pancakeswap/utils/formatBalance'
import { AutoRenewIcon, BalanceInput, Button, Flex, Image, Text, Modal, Input, useToast } from '@pancakeswap/uikit'
import getThemeValue from '@pancakeswap/uikit/src/util/getThemeValue'
import { useNikaIdoPoolContract, useOracleContract, useTokenContract } from 'hooks/useContract'
import { ToastDescriptionWithTx } from 'components/Toast'
import { useAccount, useWaitForTransaction } from 'wagmi'
import { MaxUint256 } from '@ethersproject/constants'
import useCatchTxError from 'hooks/useCatchTxError'
import { useCallWithGasPrice } from 'hooks/useCallWithGasPrice'

interface BuyInPoolModalProps {
  // Pool attributes
  buyingTokenDecimals: number
  buyingTokenSymbol: string
  buyingTokenAddress: string
  onDismiss?: () => void
  imageUrl?: string
}

const NULL_ADDR = '0x0000000000000000000000000000000000000000'
const USDC_ADDR = '0xe1283F92e5513fbE125185221cDc8e3D3Dda422D'
const NIKA_ADDR = '0x1549C1A238B4b7aa396B5D8c315df53ceC1FEa51'
const MIN_AMOUNT = 100

export const BuyInPoolModal: React.FC<React.PropsWithChildren<BuyInPoolModalProps>> = ({
  buyingTokenDecimals,
  buyingTokenSymbol,
  buyingTokenAddress,
  onDismiss,
  imageUrl = '/images/tokens/',
}) => {
  const { t } = useTranslation()
  const theme = useTheme()
  const [buyAmount, setBuyAmount] = useState('')
  const [address, setAddress] = useState('')
  const idoContract = useNikaIdoPoolContract()
  const oracleContract = useOracleContract()
  const usdcTokenContract = useTokenContract(USDC_ADDR)
  const { toastSuccess } = useToast()
  const { callWithGasPrice } = useCallWithGasPrice()
  const { fetchWithCatchTxError, loading: pendingTx } = useCatchTxError()
  const { address: account } = useAccount()
  const [approveTxHash, setApproveTxHash] = useState<string>()
  const [isValidAmount, setIsValidAmount] = useState(true)
  const [minApproveAmount, setMinApproveAmount] = useState<BigNumber>()

  const handleSubmit = async () => {
    const approvedAmount = await usdcTokenContract.allowance(account, idoContract.address)
    console.log('approvedAmount: ', approvedAmount.toString(), minApproveAmount.toString())
    if (new BigNumber(approvedAmount.toString()).gte(new BigNumber(minApproveAmount.toString() || 0))) {
      buyToken()
    } else {
      const receipt = await fetchWithCatchTxError(() => {
        return callWithGasPrice(usdcTokenContract, 'approve', [idoContract.address, MaxUint256])
      })
      if (receipt?.status) {
        setApproveTxHash(receipt.transactionHash)
      }
    }
  }
  const buyToken = async () => {
    if (!buyAmount || new BigNumber(buyAmount).lt(MIN_AMOUNT)) return
    const receipt = await fetchWithCatchTxError(() => {
      return idoContract.buyToken(
        new BigNumber(buyAmount).times(new BigNumber(10).pow(18)).toString(),
        address || NULL_ADDR,
      )
    })
    if (receipt?.status) {
      onDismiss()
      toastSuccess(
        `${t('Bought')}!`,
        <ToastDescriptionWithTx txHash={receipt.transactionHash}>
          {`You have successfully bought ${buyAmount} NIKA`}
        </ToastDescriptionWithTx>,
      )
    }
  }

  useWaitForTransaction({
    hash: approveTxHash as any,
    onSuccess: async () => {
      buyToken()
    },
  })

  const usdValueStaked = new BigNumber(minApproveAmount ? minApproveAmount.toString() : 0).dividedBy(
    new BigNumber(10).pow(18),
  )
  // console.log('minApproveAmount: ', minApproveAmount?.toString())
  // console.log('usdValueStaked: ', usdValueStaked.toNumber())
  const formattedUsdValueBought = !usdValueStaked.isNaN() && formatNumber(usdValueStaked.toNumber())
  // console.log('formattedUsdValueBought: ', formattedUsdValueBought)

  const handleBuyInputChange = (input: string) => {
    setBuyAmount(input)
  }

  const handleAddressChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.currentTarget.validity.valid) {
      setAddress(e.currentTarget.value.replace(/,/g, '.'))
    }
  }

  useEffect(() => {
    const updateData = async () => {
      const _buyAmount = new BigNumber(buyAmount || 0)
      const isValid = _buyAmount.gte(MIN_AMOUNT)
      // console.log('fbjdsk: ', _buyAmount.times(new BigNumber(10).pow(18)).toString())
      const minAmount = await oracleContract.consult(NIKA_ADDR, _buyAmount.times(new BigNumber(10).pow(18)).toString())
      // console.log('minAmount: ', new BigNumber(minAmount).dividedBy(new BigNumber(10).pow(18)).toNumber())
      // console.log('minAmount: ', minAmount.toString())
      setIsValidAmount(isValid)
      setMinApproveAmount(minAmount)
    }
    updateData()
  }, [buyAmount])

  return (
    <Modal
      minWidth="346px"
      title={t('Buy in Pool')}
      onDismiss={onDismiss}
      headerBackground={getThemeValue(theme, 'colors.gradientCardHeader')}
    >
      <Flex alignItems="center" justifyContent="space-between" mb="8px">
        <Text bold>{t('Buy')}:</Text>
        <Flex alignItems="center" minWidth="70px">
          <Image src={`${imageUrl}${buyingTokenAddress}.png`} width={24} height={24} alt={buyingTokenSymbol} />
          <Text ml="4px" bold>
            {buyingTokenSymbol}
          </Text>
        </Flex>
      </Flex>
      <BalanceInput
        value={buyAmount}
        onUserInput={handleBuyInputChange}
        currencyValue={`~${formattedUsdValueBought || 0} USDC`}
        decimals={buyingTokenDecimals}
        isWarning={!isValidAmount}
      />

      <Text ml="auto" color="textSubtle" fontSize="12px" mb="8px">
        {t('Minimum amount of NIKA to buy is 100 tokens')}
      </Text>

      <Flex alignItems="center" justifyContent="space-between" mb="8px" mt="16px">
        <Text bold>Referrer address:</Text>
      </Flex>
      <Input onChange={handleAddressChange} value={address} />

      <Button
        isLoading={pendingTx}
        endIcon={pendingTx ? <AutoRenewIcon spin color="currentColor" /> : null}
        onClick={handleSubmit}
        disabled={!buyAmount || parseFloat(buyAmount) === 0 || !isValidAmount}
        mt="24px"
      >
        {pendingTx ? t('Confirming') : t('Confirm')}
      </Button>
    </Modal>
  )
}
