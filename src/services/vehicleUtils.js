export const groupVehiclesTogether = (expenses) => {
  if (!Array.isArray(expenses)) return [];

  const isIpva = (e) => (e.name && e.name.toLowerCase().includes('ipva')) || (e.id && e.id.toLowerCase().includes('ipva'));
  const isLicenciamento = (e) => (e.name && e.name.toLowerCase().includes('licenciamento')) || (e.id && e.id.toLowerCase().includes('licenciamento'));

  const ipvaItems = expenses.filter(isIpva);
  const licenciamentoItems = expenses.filter(isLicenciamento);
  const otherItems = expenses.filter(e => !isIpva(e) && !isLicenciamento(e));

  const vehicleSortOrder = ['mobi', 'c3', 'shineray', 'hb20'];
  const getVehicleRank = (name = '') => {
    const n = name.toLowerCase();
    const idx = vehicleSortOrder.findIndex(v => n.includes(v));
    return idx === -1 ? 99 : idx;
  };

  ipvaItems.sort((a, b) => getVehicleRank(a.name) - getVehicleRank(b.name));
  licenciamentoItems.sort((a, b) => getVehicleRank(a.name) - getVehicleRank(b.name));

  const firstVehicleIndex = expenses.findIndex(e => isIpva(e) || isLicenciamento(e));
  const insertIndex = firstVehicleIndex === -1 ? otherItems.length : firstVehicleIndex;

  const result = [...otherItems];
  result.splice(insertIndex, 0, ...ipvaItems, ...licenciamentoItems);

  return result;
};
