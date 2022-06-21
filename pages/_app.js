import '../styles/globals.css';
import { Provider } from 'react-redux';
import { store, PersistedStore } from '../app/store';
import { PersistGate } from 'redux-persist/integration/react';

function MyApp({ Component, pageProps }) {
  return (
    <Provider store={store}>
      {/* <PersistGate loading={null} persistor={PersistedStore}> */}
      <Component {...pageProps} />
      {/* </PersistGate> */}
    </Provider>
  );
}

export default MyApp;
