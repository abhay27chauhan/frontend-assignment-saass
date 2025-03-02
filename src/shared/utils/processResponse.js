const processResponse = (data) => {
  if (!Array.isArray(data)) {
    return []; // Ensure it always returns an array
  }
  return data.map((project) => ({
    "s.no": project["s.no"],
    percentageFunded: project["percentage.funded"],
    amountPledged: project["amt.pledged"],
  }));
};

export default processResponse;
  