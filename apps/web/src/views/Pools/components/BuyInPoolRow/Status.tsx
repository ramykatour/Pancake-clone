import { Text, Pool } from '@pancakeswap/uikit'
import styled from 'styled-components'
import { useTranslation } from '@pancakeswap/localization'

interface StatusProps {
  status: string
}

const StyledCell = styled(Pool.BaseCell)`
  flex: 2 0 100px;
`
const Status = ({ status }: StatusProps) => {
  const { t } = useTranslation()
  return (
    <StyledCell>
      <Pool.CellContent>
        <Text fontSize="12px" color="textSubtle" textAlign="left">
          {t('Status')}
        </Text>
        <Text color={status === t('Active') || status === t('Open') ? 'primary' : 'text'}>{status}</Text>
      </Pool.CellContent>
    </StyledCell>
  )
}

export default Status
