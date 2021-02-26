import { AppContainer } from "../components/AppContext";
import "../styles/globals.scss";

function MyApp({ Component, pageProps }) {
  return (
    <AppContainer>
      <Component {...pageProps} />
    </AppContainer>
  );
}

export default MyApp;
