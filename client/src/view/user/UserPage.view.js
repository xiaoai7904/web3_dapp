/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect } from 'react';
import useContract from '@/hooks/useContract';

export const UserPage = () => {
  const { getLandContract } = useContract();

  const getPayIsLand = async () => {
    try {
      const landContract = await getLandContract();
      landContract.methods.tokenURI()
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    getPayIsLand();
  }, []);
  return <div>userPage</div>;
};

export default UserPage;
