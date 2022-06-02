import { ORACLE_URL_BASE } from '../../common/constants';

export const getNftMarketLowerPricesByCreators = async (creatorsAddresses: string[] = []) => {
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
