export const MainUrls = {
    getHome: () => "/",
    getSignIn: ()=> "/signin",
    getSignUp: () => "/signup",
    getDashboard: () => "/dashboard",
}

export const DashboardUrls = {
    _getRoot: () => "/dashboard",
    getArchitecture: () => `${DashboardUrls._getRoot()}/architecture`,
    getGrowthPlan: () => `${DashboardUrls._getRoot()}/growth-plan`,
    getAnalytics: () => `${DashboardUrls._getRoot()}/analytics`,
    getLibrary: () => `${DashboardUrls._getRoot()}/library`,
    getMarketplace: () => `${DashboardUrls._getRoot()}/marketplace`,
}

export const ArchitectureUrls = {
    _getRoot: () => DashboardUrls.getArchitecture(),
    getBrandGuide: () => `${ArchitectureUrls._getRoot()}/brand-guide`,
    getChannels: () => `${ArchitectureUrls._getRoot()}/channels`,
    getProduct: () => `${ArchitectureUrls._getRoot()}/product`,
    getMarket: () => `${ArchitectureUrls._getRoot()}/market`,
    getTechStack: () => `${ArchitectureUrls._getRoot()}/tech-stack`,
}
