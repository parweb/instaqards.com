import { DashboardWelcomeHeader } from 'components/dashboard/DashboardWelcomeHeader';
import { DashboardFeaturesGrid } from 'components/dashboard/DashboardFeaturesGrid';
import { DashboardOnboardingChecklist } from 'components/dashboard/DashboardOnboardingChecklist';
import { DashboardStats } from 'components/dashboard/DashboardStats';
import { DashboardSuggestions } from 'components/dashboard/DashboardSuggestions';
import { DashboardAdvancedFeatures } from 'components/dashboard/DashboardAdvancedFeatures';
import { DashboardSupport } from 'components/dashboard/DashboardSupport';
import { currentUser } from 'helpers/auth';

const Overview = async () => {
  const user = await currentUser();

  return (
    <div className="flex flex-col space-y-12 p-8 max-w-6xl mx-auto">
      <DashboardWelcomeHeader userName={user?.name || undefined} />
      <DashboardOnboardingChecklist />
      <DashboardFeaturesGrid />
      <DashboardStats />
      <DashboardSuggestions />
      <DashboardAdvancedFeatures />
      <DashboardSupport />
    </div>
  );
};

export default Overview;
