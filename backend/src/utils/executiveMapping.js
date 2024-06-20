export const getExecutiveFlatByCategory = (category) => {
    const mapping = {
      plumbing: 'B403',
      electrical: 'C306',
      housekeeping: 'A405',
      sewerage: 'A301',
      parking: 'CG3',
      security: 'CG4',
      lift: 'B204',
      technical: 'PCS'
    };
    return mapping[category];
  };
  