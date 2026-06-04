import posthog from "posthog-js";

posthog.init(
  process.env.REACT_APP_POSTHOG_KEY,
  {
    api_host: "https://us.i.posthog.com",
  }
);

export default posthog;