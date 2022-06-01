import { ORACLE_URL_BASE } from '../../common/constants';

const getNftMarketLowerPricesByCreators = async (creatorsAddresses = []) => {
  try {
    const res = await fetch(`${ORACLE_URL_BASE}/creators`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(creatorsAddresses),
    });

    return await res.json();
  } catch (error) {
    console.error(error);
  }

  return {};
};

export default getNftMarketLowerPricesByCreators;
