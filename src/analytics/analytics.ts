import ReactGA from "react-ga4";

export const initGA = () => {
  ReactGA.initialize("G-GWB1KFHR3G");
};

export const logPageView = () => {
  ReactGA.send({ hitType: "pageview", page: window.location.pathname });
};

export const logEvent = (category: string, action: string) => {
  ReactGA.event({
    category: category,
    action: action,
  });
};
