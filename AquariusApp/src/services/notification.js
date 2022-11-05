import notifee from '@notifee/react-native';

async function displayNotification(title, body) {
  // Request permissions (required for iOS)
  await notifee.requestPermission();

  // Create a channel (required for Android)
  const channelId = await notifee.createChannel({
    id: 'default',
    name: 'Default Channel',
  });

  // Display a notification
  await notifee.displayNotification({
    title: title,
    body: body,
    android: {
      channelId,
      // pressAction is needed if you want the notification to open the app when pressed
      pressAction: {
        id: 'default',
      },
    },
  });
}

async function waterLevelNotification() {
  displayNotification(
    'Atenção',
    'Lembre de verificar o nível do reservatório de água.',
  );
}

async function phNotification() {
  displayNotification('Atenção', 'O valor do pH está fora do configurado.');
}

async function temperatureNotification() {
  displayNotification(
    'Atenção',
    'O valor da temperatura está fora do configurado.',
  );
}

async function phSolutionLevelNotification() {
  displayNotification(
    'Atenção',
    'Lembre de verificar o nível das soluções reguladoras de pH.',
  );
}

async function otherParametersNotification() {
  displayNotification(
    'Atenção',
    'Lembre de verificar os outros parâmetros do aquário.',
  );
}

export {
  waterLevelNotification,
  phNotification,
  temperatureNotification,
  phSolutionLevelNotification,
  otherParametersNotification,
};
