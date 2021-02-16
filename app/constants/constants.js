export const defaultColors = [
  '#264653',
  '#2A9D8F',
  '#E9C46A',
  '#F4A261',
  '#E76F51',
  '#E63946',
  '#F1FAEE',
  '#A8DADC',
  '#457B9D',
  '#1D3557',
];

export const getColor = (index) => {
  return index > defaultColors.length ? '#FFFFFF' : defaultColors[index];
};
