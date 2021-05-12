import { triggerCampaign } from 'widget/api/campaign';
window.campaignTimers = [];

const stripTrailingSlash = ({ URL }) => {
  return URL.replace(/\/$/, '');
};
const startCampaigns = async ({ allCampaigns, currentURL }) => {
  console.log('CurrentURL-->', currentURL);

  // Clear all timeouts
  window.campaignTimers.forEach(timerId => {
    clearTimeout(timerId);
  });
  // Find all campaigns matches the URL
  const filteredCampaigns = allCampaigns
    .map(item => {
      return {
        ...item,
        timeOnpage: item?.trigger_rules?.time_on_page,
        url: item?.trigger_rules?.url,
      };
    })
    .filter(item => {
      return (
        stripTrailingSlash({ URL: item.url }) ===
        stripTrailingSlash({ URL: currentURL })
      );
    });
  console.log('filteredCampaigns-->', filteredCampaigns);

  // Execute campaigns
  filteredCampaigns.forEach(campaign => {
    const {
      trigger_rules: { time_on_page: timeOnPage },
      id: campaignId,
    } = campaign;
    const timeoutID = setTimeout(async () => {
      await triggerCampaign({ campaignId });
    }, timeOnPage * 1000);
    window.campaignTimers.push(timeoutID);
  });
};

export { startCampaigns };
