export const getTransactionId = () => {
  return `Tran_${Date.now()}_${Math.floor(Math.random() * 1000)}`;
};