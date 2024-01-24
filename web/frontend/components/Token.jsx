import React, { useState } from 'react';
import {
  Text,
  Tile,
  render,
  Screen,
  useExtensionApi,
} from '@shopify/retail-ui-extensions-react';

const SmartGridTile = () => {
  const api = useExtensionApi<'pos.home.tile.render'>();
  return (
    <Tile
      title='Session API'
      subtitle='SmartGrid Extension'
      enabled
      onPress={() => {
        api.smartGrid.presentModal();
      }}
    />
  );
};

const SmartGridModal = () => {
  const { currentSession, getSessionToken } = useExtensionApi().session;
  const { shopId, userId, locationId, staffMemberId } = currentSession;
  const [sessionToken, setSessionToken] = useState<string>();

  getSessionToken().then((newToken) => {
    setSessionToken(newToken);
  });

  return (
    <Screen name='Screen One' title="Screen One Title">
      <Text>
        shopId: {shopId}, userId: {userId}, locationId: {locationId}, staffId:{' '}
        {staffMemberId}
      </Text>
      <Text>sessionToken: {sessionToken}</Text>
    </Screen>
  );
};

render('pos.home.tile.render', () => <SmartGridTile />);
render('pos.home.modal.render', () => <SmartGridModal />);
