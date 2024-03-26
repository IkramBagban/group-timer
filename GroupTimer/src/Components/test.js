session = { users : [
      {
        userId: 'UMRPNF3142',
        isCreator: true,
        isReady: true,
        name: 'done everything',
        totalTime: 21,
        socketId: 'mSs7tCBzHgR6tEKTAAAL'
      },
      {
        userId: 'UMRPNF3371',
        isCreator: false,
        isReady: true,
        name: 'Mark',
        totalTime: 30,
        socketId: 'j9XrxO1L89Zl0W_WAAAN'
      }
    ]
}
  console.log('1',session)
  session.users.sort((a, b) => b.totalTime -a.totalTime);
  console.log('2',session)