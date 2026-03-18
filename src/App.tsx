import {
  APP_VERSIONS,
  DEFAULT_APP_VERSION,
  isAppVersion,
} from "./appVersions";

const getVersionFromQuery = () => {
  const version = new URLSearchParams(window.location.search).get("v");
  if (version && isAppVersion(version)) {
    return version;
  }
  return DEFAULT_APP_VERSION;
};

export default function App() {
  const version = getVersionFromQuery();
  const SelectedVersion = APP_VERSIONS[version];
  return <SelectedVersion />;
}