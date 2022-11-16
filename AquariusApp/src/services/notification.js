import notifee, {
  TriggerType,
  RepeatFrequency,
  AndroidNotificationSetting,
} from '@notifee/react-native';

async function displayNotification(title, body, id) {
  // Request permissions (required for iOS)
  await notifee.requestPermission();

  // Create a channel (required for Android)
  const channelId = await notifee.createChannel({
    id: 'default',
    name: 'Default Channel',
  });

  // Display a notification
  await notifee.displayNotification({
    id: id,
    title: title,
    body: body,
    android: {
      channelId,
      pressAction: {
        id: 'default',
      },
    },
  });
}

async function createTriggerNotification(
  repeatFrequency,
  date,
  title,
  body,
  id,
) {
  // Request permissions (required for iOS)
  await notifee.requestPermission();

  // Create a channel (required for Android)
  const channelId = await notifee.createChannel({
    id: 'default',
    name: 'Default Channel',
  });

  // Create a trigger notification
  await notifee.createTriggerNotification(
    {
      id,
      title,
      body,
      android: {
        channelId: 'default',
      },
    },
    createTrigger(repeatFrequency, date),
  );
}

function getFrequency(repeatFrequency) {
  switch (repeatFrequency) {
    case 'weekly':
      repeatFrequency = RepeatFrequency.WEEKLY;
      break;
    case 'daily':
      repeatFrequency = RepeatFrequency.DAILY;
      break;
    case 'hourly':
      repeatFrequency = RepeatFrequency.HOURLY;
      break;
    default:
      repeatFrequency = RepeatFrequency.NONE;
  }
  return repeatFrequency;
}

function createDate(hours, minutes) {
  let date = new Date(Date.now());
  let today = new Date(Date.now());
  date.setHours(hours);
  date.setMinutes(minutes);
  date.setSeconds(0);
  if (today.getTime() > date.getTime()) {
    date.setDate(date.getDate() + 1);
  }
  return date;
}

function createTrigger(repeatFrequency, date) {
  repeatFrequency = getFrequency(repeatFrequency);
  console.log(repeatFrequency, date, date.getTime());
  // Create a time-based trigger
  const trigger = {
    type: TriggerType.TIMESTAMP,
    timestamp: date.getTime(), // fire at 11:10am (10 minutes before meeting)
    repeatFrequency: repeatFrequency,
  };

  return trigger;
}

/*
RFS02 - O aplicativo deverá notificar o usuário ao final
de cada dia de que ele deve reabastecer o reservatório de água limpa.
*/
async function waterLevelNotification() {
  const settings = await notifee.getNotificationSettings();
  if (settings.android.alarm == AndroidNotificationSetting.ENABLED) {
    await createTriggerNotification(
      'daily',
      createDate(15, 0),
      'Atenção',
      'Lembre de verificar o nível do reservatório de água.',
      'waterLevel',
    );
  } else {
    await notifee.openAlarmPermissionSettings();
  }
}

async function phNotification() {
  displayNotification(
    'Atenção',
    'O valor do pH está fora do configurado.',
    'ph',
  );
}

async function temperatureNotification() {
  displayNotification(
    'Atenção',
    'O valor da temperatura está fora do configurado.',
    'temperature',
  );
}

/*
RFS06 - O aplicativo deverá notificar o usuário a cada semana de que
ele deve verificar o nível dos reservatórios dos produtos alcalinizantes e acidificantes.
*/
async function phSolutionLevelNotification() {
  const settings = await notifee.getNotificationSettings();
  if (settings.android.alarm == AndroidNotificationSetting.ENABLED) {
    await createTriggerNotification(
      'hourly',
      createDate(14, 20),
      'Atenção',
      'Lembre de verificar o nível das soluções reguladoras de pH.',
      'phSolutionLevel',
    );
  } else {
    await notifee.openAlarmPermissionSettings();
  }
}

/*
RFS12 - O aplicativo deverá notificar o usuário no dia e
hora configurada de que ele precisa verificar os demais parâmetros do aquário.
*/
async function otherParametersNotification(date) {
  const settings = await notifee.getNotificationSettings();
  if (settings.android.alarm == AndroidNotificationSetting.ENABLED) {
    await createTriggerNotification(
      'weekly',
      date,
      'Atenção',
      'Lembre de verificar os outros parâmetros do aquário.',
      'otherParameters',
    );
  } else {
    // Show some user information to educate them on what exact alarm permission is,
    // and why it is necessary for your app functionality, then send them to system preferences:
    await notifee.openAlarmPermissionSettings();
  }
}

export {
  waterLevelNotification,
  phNotification,
  temperatureNotification,
  phSolutionLevelNotification,
  otherParametersNotification,
  displayNotification,
};
